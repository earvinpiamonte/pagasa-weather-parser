import * as fs from "fs";
import pdf from "pdf-parse";

// Pre-compiled regex patterns
const PATTERNS = {
  tcws: /TROPICAL CYCLONE WIND SIGNALS.*?IN EFFECT(.*?)(?=OTHER HAZARDS|HAZARDS AFFECTING|$)/s,
  signalNumber: /^[12345]\s*$/,
  tcwsNumber: /TCWS\s+No\.\s*([12345])/i,
  signalMatch: /^\s*([12345])\s*$/m,
  portionPattern:
    /^(the\s+)?(northern|southern|eastern|western|northeastern|northwestern|southeastern|southwestern|central)\s+portion\s+of\s+(.+)$/i,
  restPattern: /^(the\s+)?rest\s+of\s+/i,
  additionalPortion:
    /\b(northwestern|northeastern|southeastern|southwestern|northern|southern|eastern|western|central)\b/gi,
  cleanPortion:
    /\b(northwestern|northeastern|southeastern|southwestern|northern|southern|eastern|western|central)(\s+portion\s+of\s+|\s+)/gi,
  parentheses: /\(([^)]+)\)/g,
  cleanExtra: /\s*-\s*-?\s*$/,
  normalizeSpace: /\s+/g,
  skipMetadata:
    /^\s*\d+\s*$|bulletin|tropical|storm|emong|issued|valid|broadcast|prepared|checked|tracking|weather|flood|forecasting|tel|senator|website|brgy|quezon city|philippines|republic|department|science|technology|pagasa|atmospheric|geophysical|astronomical|services|administration|division|page\s+\d+/i,
  areaNames:
    /batanes|babuyan|cagayan|ilocos|apayao|isabela|nueva|zambales|pampanga|bulacan|metro manila|rizal|cavite|laguna|batangas|quezon|mindoro|palawan|samar|leyte|cebu|bohol|negros|panay|mindanao|davao|surigao|agusan|bukidnon|lanao|aurora|tarlac|albay|camarines|sorsogon|catanduanes|romblon|aklan|antique|capiz|guimaras|iloilo|abra|kalinga|mountain province|ifugao|benguet|la union/i,
} as const;

const SKIP_TERMS = new Set([
  "Wind threat",
  "Storm-force",
  "Gale-force",
  "winds",
  "Luzon",
  "Visayas",
  "Mindanao",
  "-",
  "Range of wind",
  "Potential impacts",
  "Beaufort",
  "hours",
  "km/h",
]);

interface AreaDetail {
  name: string;
  parts?: string[];
  locals?: string[];
}

interface SignalArea {
  areas: {
    Luzon: AreaDetail[];
    Visayas: AreaDetail[];
    Mindanao: AreaDetail[];
  };
}

interface ParsedSignals {
  signals: {
    [key: string]: SignalArea;
  };
}

async function parsePDF(filePath: string): Promise<ParsedSignals> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return extractSignals(data.text);
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

async function parseBuffer(buffer: Buffer): Promise<ParsedSignals> {
  try {
    const data = await pdf(buffer);
    return extractSignals(data.text);
  } catch (error) {
    throw new Error(
      `Failed to parse PDF buffer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function extractSignals(text: string): ParsedSignals {
  const signals: { [key: string]: SignalArea } = {};
  const tcwsMatch = text.match(PATTERNS.tcws);

  if (!tcwsMatch) {
    return { signals };
  }

  const tcwsSection = tcwsMatch[1];
  const signalBlocks = extractSignalBlocks(tcwsSection);

  for (const block of signalBlocks) {
    const signalNumber = extractSignalNumber(block);
    if (signalNumber) {
      const areas = extractAreasFromBlock(block);
      signals[signalNumber] = {
        areas: {
          Luzon: areas.Luzon,
          Visayas: areas.Visayas,
          Mindanao: areas.Mindanao,
        },
      };
    }
  }

  return { signals };
}

function extractSignalBlocks(tcwsSection: string): string[] {
  const blocks: string[] = [];
  const lines = tcwsSection.split("\n");
  let currentBlock = "";
  let inSignalBlock = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      PATTERNS.signalNumber.test(trimmedLine) ||
      trimmedLine.includes("TCWS No.")
    ) {
      if (currentBlock && inSignalBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = line + "\n";
      inSignalBlock = true;
    } else if (inSignalBlock) {
      currentBlock += line + "\n";

      if (
        trimmedLine.includes("OTHER HAZARDS") ||
        trimmedLine.includes("HAZARDS AFFECTING")
      ) {
        break;
      }
    }
  }

  if (currentBlock && inSignalBlock) {
    blocks.push(currentBlock);
  }

  return blocks.filter((block) => block.trim().length > 0);
}

function extractSignalNumber(block: string): string | null {
  const numberMatch = block.match(PATTERNS.signalMatch);
  if (numberMatch) return numberMatch[1];

  const tcwsMatch = block.match(PATTERNS.tcwsNumber);
  return tcwsMatch ? tcwsMatch[1] : null;
}

function extractAreasFromBlock(block: string): {
  Luzon: AreaDetail[];
  Visayas: AreaDetail[];
  Mindanao: AreaDetail[];
} {
  const areaText = extractTCWSAreaText(block);
  const areas = areaText ? parseFullAreaText(areaText) : [];

  return {
    Luzon: mergeAndCleanAreas(areas),
    Visayas: [],
    Mindanao: [],
  };
}

function extractTCWSAreaText(block: string): string {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  let areaText = "";
  let signalFound = false;
  let collecting = false;

  for (const line of lines) {
    if (PATTERNS.signalNumber.test(line)) {
      signalFound = true;
      collecting = false;
      continue;
    }

    if (line.includes("Warning lead time")) {
      collecting = false;
      continue;
    }

    if (
      SKIP_TERMS.has(line) ||
      line.includes("Wind threat") ||
      line.includes("Storm-force") ||
      line.includes("Gale-force") ||
      line.includes("Range of wind") ||
      line.includes("Potential impacts") ||
      line.includes("Beaufort") ||
      line.includes("hours") ||
      line.includes("km/h")
    ) {
      continue;
    }

    if (signalFound && !collecting && containsAreaNames(line)) {
      collecting = true;
      areaText = line;
    } else if (collecting) {
      areaText += " " + line;
    }
  }

  return areaText
    .trim()
    .replace(PATTERNS.cleanExtra, "")
    .replace(PATTERNS.normalizeSpace, " ");
}

function parseFullAreaText(text: string): AreaDetail[] {
  const cleanText = text
    .replace(PATTERNS.normalizeSpace, " ")
    .replace(/([,;])\s+and\s+/g, "$1 ")
    .trim();
  const segments = splitPreservingParentheses(cleanText);

  return segments
    .map((segment) => parseAreaDetail(segment.trim()))
    .filter((detail) => detail !== null) as AreaDetail[];
}

function splitPreservingParentheses(text: string): string[] {
  const result: string[] = [];
  let current = "";
  let parenthesesDepth = 0;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const nextChars = text.slice(i, i + 5).toLowerCase();

    if (char === "(") {
      parenthesesDepth++;
      current += char;
    } else if (char === ")") {
      parenthesesDepth--;
      current += char;
    } else if (parenthesesDepth === 0 && (char === "," || char === ";")) {
      if (current.trim()) {
        result.push(current.trim());
      }
      current = "";
    } else if (parenthesesDepth === 0 && nextChars === " and ") {
      if (current.trim()) {
        result.push(current.trim());
      }
      current = "";
      i += 4;
    } else {
      current += char;
    }
    i++;
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result.filter((segment) => segment.length > 0);
}

function mergeAndCleanAreas(areas: AreaDetail[]): AreaDetail[] {
  const merged = new Map<string, AreaDetail>();

  for (const area of areas) {
    const key = area.name.toLowerCase();

    if (merged.has(key)) {
      const existing = merged.get(key)!;

      if (area.parts) {
        if (!existing.parts) {
          existing.parts = [...area.parts];
        } else {
          for (const part of area.parts) {
            if (!existing.parts.includes(part)) {
              existing.parts.push(part);
            }
          }
        }
      }

      if (area.locals) {
        if (!existing.locals) {
          existing.locals = [...area.locals];
        } else {
          for (const local of area.locals) {
            if (!existing.locals.includes(local)) {
              existing.locals.push(local);
            }
          }
        }
      }
    } else {
      merged.set(key, {
        name: area.name,
        parts: area.parts ? [...area.parts] : undefined,
        locals: area.locals ? [...area.locals] : undefined,
      });
    }
  }

  return Array.from(merged.values());
}

function containsAreaNames(line: string): boolean {
  return !PATTERNS.skipMetadata.test(line) && PATTERNS.areaNames.test(line);
}

function parseAreaDetail(areaString: string): AreaDetail | null {
  const cleanArea = areaString.trim().replace(PATTERNS.cleanExtra, "");
  if (!cleanArea || cleanArea.length < 3) return null;

  const partDescriptors: string[] = [];
  let workingArea = cleanArea;

  // Extract portion patterns
  const portionMatch = workingArea.match(PATTERNS.portionPattern);
  if (portionMatch) {
    partDescriptors.push(portionMatch[2].toLowerCase());
    workingArea = portionMatch[3];
  }

  // Handle "rest of" and "mainland"
  if (PATTERNS.restPattern.test(workingArea)) {
    partDescriptors.push("rest");
    workingArea = workingArea.replace(PATTERNS.restPattern, "");
  }
  if (workingArea.toLowerCase().includes("mainland")) {
    partDescriptors.push("mainland");
    workingArea = workingArea.replace(/mainland\s+/i, "");
  }

  // Extract additional portion descriptors
  const additionalMatch = workingArea.match(PATTERNS.additionalPortion);
  if (additionalMatch) {
    additionalMatch.forEach((portion) => {
      const p = portion.toLowerCase();
      if (!partDescriptors.includes(p)) partDescriptors.push(p);
    });
  }

  // Clean remaining portion text
  workingArea = workingArea.replace(PATTERNS.cleanPortion, "");

  const { name, municipalities } = extractMunicipalities(workingArea);
  const result: AreaDetail = { name: name.trim() };

  if (partDescriptors.length > 0) result.parts = partDescriptors;
  if (municipalities.length > 0) result.locals = municipalities;

  return result;
}

function extractMunicipalities(areaString: string): {
  name: string;
  municipalities: string[];
} {
  const municipalities: string[] = [];
  let match;

  // Reset pattern to start from beginning
  PATTERNS.parentheses.lastIndex = 0;
  while ((match = PATTERNS.parentheses.exec(areaString)) !== null) {
    const munis = match[1]
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0 && !/^\d+$/.test(m));
    municipalities.push(...munis);
  }

  const cleanName = areaString
    .replace(/\s*\([^)]*\)/g, "")
    .replace(PATTERNS.cleanExtra, "")
    .replace(PATTERNS.restPattern, "")
    .replace(/^the\s+/i, "")
    .trim();

  return { name: cleanName, municipalities };
}

// Main export object that matches the required import pattern
const storms = {
  get signals() {
    return {};
  },

  async parsePDF(filePath: string): Promise<ParsedSignals> {
    return parsePDF(filePath);
  },

  async parseBuffer(buffer: Buffer): Promise<ParsedSignals> {
    return parseBuffer(buffer);
  },
};

export default storms;
export { ParsedSignals, SignalArea, AreaDetail };
