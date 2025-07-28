import { PATTERNS, SKIP_TERMS } from "../constants/patterns";
import { Area } from "../types/index";
import {
  splitPreservingParentheses,
  extractMunicipalities,
} from "../utils/text-utils";

export function extractRegionsFromBlock(block: string): {
  Luzon: Area[];
  Visayas: Area[];
  Mindanao: Area[];
} {
  const rawAreaText = extractTCWSAreaText(block);
  const parsedAreas = rawAreaText ? parseAreasText(rawAreaText) : [];

  return {
    Luzon: mergeAreas(parsedAreas),
    Visayas: [],
    Mindanao: [],
  };
}

export function extractTCWSAreaText(block: string): string {
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

export function parseAreasText(text: string): Area[] {
  const cleanText = text
    .replace(PATTERNS.normalizeSpace, " ")
    .replace(/([,;])\s+and\s+/g, "$1 ")
    .trim();
  const segments = splitPreservingParentheses(cleanText);

  return segments
    .map((segment) => parseArea(segment.trim()))
    .filter((detail) => detail !== null) as Area[];
}

export function mergeAreas(areas: Area[]): Area[] {
  const merged = new Map<string, Area>();

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

export function containsAreaNames(line: string): boolean {
  return !PATTERNS.skipMetadata.test(line) && PATTERNS.areaNames.test(line);
}

export function parseArea(areaText: string): Area | null {
  const cleanArea = areaText.trim().replace(PATTERNS.cleanExtra, "");
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
  const result: Area = { name: name.trim() };

  if (partDescriptors.length > 0) result.parts = partDescriptors;
  if (municipalities.length > 0) result.locals = municipalities;

  return result;
}
