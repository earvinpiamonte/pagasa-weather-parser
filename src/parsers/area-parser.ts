import { PATTERNS } from "../constants/patterns";
import { Area } from "../types/index";
import {
  splitPreservingParentheses,
  extractMunicipalities,
  normalizeLocationName,
} from "../utils/text-utils";

export const extractRegionsFromBlock = (
  block: string
): {
  luzon: Area[];
  visayas: Area[];
  mindanao: Area[];
} => {
  const rawAreaText = extractTcwsAreaText(block);
  const parsedAreas = rawAreaText ? parseAreasText(rawAreaText) : [];

  return {
    luzon: mergeAreas(parsedAreas),
    visayas: [],
    mindanao: [],
  };
};

export const extractTcwsAreaText = (block: string): string => {
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

    if (PATTERNS.tcwsNumber.test(line)) {
      signalFound = true;
      collecting = false;

      continue;
    }

    if (/warning lead time/i.test(line)) {
      if (collecting) {
        break;
      }

      continue;
    }

    if (PATTERNS.skipLine.test(line) || PATTERNS.regionHeading.test(line)) {
      continue;
    }

    if (signalFound && !collecting) {
      const cleanedCandidate = line
        .replace(PATTERNS.trailingMultipleDash, "")
        .replace(PATTERNS.trailingDash, "");

      const lower = cleanedCandidate.toLowerCase();

      if (PATTERNS.areaFiller.test(lower)) {
        continue;
      }

      if (containsAreaNames(cleanedCandidate)) {
        collecting = true;
        areaText = cleanedCandidate;
      }
    } else if (collecting) {
      if (
        PATTERNS.dashOnly.test(line) ||
        line === "-" ||
        PATTERNS.areaFiller.test(line.toLowerCase())
      ) {
        continue;
      }

      const cleaned = line.replace(PATTERNS.trailingDash, "");

      if (!cleaned) {
        continue;
      }

      if (PATTERNS.signalNumber.test(cleaned)) {
        break;
      }

      const openParenCount = (cleaned.match(/\(/g) || []).length;

      const closeParenCount = (cleaned.match(/\)/g) || []).length;

      const isOnlyText = /^[A-Za-z\s,]+$/.test(cleaned.trim());

      if (openParenCount > closeParenCount) {
        // More opening than closing parentheses, likely a continuation
        areaText += " " + cleaned;
      } else if (closeParenCount > openParenCount) {
        // More closing than opening parentheses, likely the end of a continuation
        areaText += " " + cleaned;
      } else if (isOnlyText && areaText.trim().length > 0) {
        // This line contains only letters, spaces, and commas and we already have area text
        // Check if the previous area text ends with an opening parenthesis
        const lastChar = areaText.trim().slice(-1);

        if (lastChar === "(" || areaText.trim().endsWith(",")) {
          areaText += " " + cleaned;
        } else {
          // This might be a new area, but let's be more conservative and include it
          areaText += " " + cleaned;
        }
      } else if (isOnlyText) {
        // This line contains only letters, spaces, and commas - likely a continuation
        areaText += " " + cleaned;
      } else {
        // This might be a new area or end of current area
        areaText += " " + cleaned;
      }
    }
  }

  return areaText
    .trim()
    .replace(PATTERNS.cleanExtra, "")
    .replace(PATTERNS.normalizeSpace, " ");
};

export const parseAreasText = (text: string): Area[] => {
  const cleanText = text
    .replace(PATTERNS.normalizeSpace, " ")
    .replace(/([,;])\s+and\s+/g, "$1 ")
    .trim();
  const segments = splitPreservingParentheses(cleanText);

  return segments
    .map((segment) => parseArea(segment.trim()))
    .filter((detail) => detail !== null) as Area[];
};

export const mergeAreas = (areas: Area[]): Area[] => {
  const merged = new Map<string, Area>();

  const mergeUnique = (
    target: string[] | undefined,
    incoming: string[] | undefined
  ): string[] | undefined => {
    if (!incoming || incoming.length === 0) {
      return target;
    }

    if (!target) {
      return [...incoming];
    }

    for (const item of incoming) {
      if (!target.includes(item)) {
        target.push(item);
      }
    }

    return target;
  };

  for (const area of areas) {
    const key = area.name.toLowerCase();

    if (merged.has(key)) {
      const existing = merged.get(key)!;

      existing.parts = mergeUnique(existing.parts, area.parts);
      existing.locals = mergeUnique(existing.locals, area.locals);
      existing.islands = mergeUnique(existing.islands, area.islands);
    } else {
      merged.set(key, {
        name: area.name,
        parts: area.parts ? [...area.parts] : undefined,
        locals: area.locals ? [...area.locals] : undefined,
        islands: area.islands ? [...area.islands] : undefined,
      });
    }
  }

  return Array.from(merged.values());
};

export const containsAreaNames = (line: string): boolean => {
  if (PATTERNS.skipMetadata.test(line) || PATTERNS.skipLine.test(line)) {
    return false;
  }
  // Clean trailing placeholder dash columns (e.g. "Batanes - -" -> "Batanes") often present in tabular TCWS listings
  const cleanedLine = line.replace(/\s+(?:-\s*){1,3}$/g, "").trim();

  const lower = cleanedLine.toLowerCase();

  if (PATTERNS.areaFiller.test(lower)) {
    return false;
  }

  // Area lines often contain commas/and-separated phrases with optional portion/rest/mainland keywords, e.g. "northern portion of Cagayan, Ilocos Norte and Abra"
  const hasListDelimiters = /,|;|\band\b/i.test(cleanedLine);

  const hasAreaKeywords = PATTERNS.areaLineKeywords.test(cleanedLine);

  // Starts with a known signal header is already filtered. Keep lines with title-case words and avoid all-caps metadata
  const looksLikeProperNouns =
    /\b[A-Z][a-z'’\-]+(?:\s+[A-Z][a-z'’\-]+)*\b/.test(cleanedLine) ||
    /\b[A-Z]{3,}\b/.test(cleanedLine);

  // Additionally accept a single proper noun possibly with parenthetical qualifier (e.g., "Batanes (Itbayat)")
  const singleIslandPattern = /^[A-Z][A-Za-z'’\-]+(?:\s+\([A-Za-z'’\-]+\))?$/;

  return (
    ((hasListDelimiters || hasAreaKeywords) && looksLikeProperNouns) ||
    singleIslandPattern.test(cleanedLine)
  );
};

export const parseArea = (areaText: string): Area | null => {
  let cleanArea = areaText.trim().replace(PATTERNS.cleanExtra, "");

  // Remove "Typhoon force winds", "Storm force winds", "Gale force winds" prefixes
  cleanArea = cleanArea.replace(PATTERNS.typhoonForceWinds, "");

  if (!cleanArea || cleanArea.length < 3) {
    return null;
  }

  const partDescriptors: string[] = [];
  let workingArea = cleanArea;

  // Handle complex patterns like "the northern and central portions of Aurora"
  let multiPortionMatch = workingArea.match(PATTERNS.multiPortionPattern);

  if (!multiPortionMatch) {
    multiPortionMatch = workingArea.match(PATTERNS.multiPortionPatternAlt);
  }

  if (multiPortionMatch) {
    if (multiPortionMatch[2]) {
      partDescriptors.push(multiPortionMatch[2].toLowerCase());
    }

    if (multiPortionMatch[3]) {
      partDescriptors.push(multiPortionMatch[3].toLowerCase());
    }

    workingArea = multiPortionMatch[4];
  } else {
    const portionMatch = workingArea.match(PATTERNS.portionPattern);

    if (portionMatch) {
      partDescriptors.push(portionMatch[2].toLowerCase());

      workingArea = portionMatch[3];
    }
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

  // Handle "and portions" patterns that weren't caught by multi-portion patterns
  workingArea = workingArea.replace(PATTERNS.andPortions, " ");

  // Extract additional portion descriptors
  const additionalMatch = workingArea.match(PATTERNS.additionalPortion);
  if (additionalMatch) {
    additionalMatch.forEach((portion) => {
      const p = portion.toLowerCase();

      if (!partDescriptors.includes(p)) {
        partDescriptors.push(p);
      }
    });
  }

  // Clean remaining portion text
  workingArea = workingArea.replace(PATTERNS.cleanPortion, "");

  // Handle "including" lists, e.g. "Cagayan including Babuyan Islands"
  let islands: string[] = [];

  // allow common punctuation after 'including' (e.g. 'including:', 'including -', 'including;')
  const includingMatch = workingArea.match(
    /\bincluding\b[\s:;,\-\u2013\u2014]*(.+)$/i
  );

  if (includingMatch) {
    // preserve original 'and' replacement then split on commas or 'and' separators
    const listText = includingMatch[1]
      .replace(/\band\b/gi, ",")
      .split(/\s*,\s*|\s+and\s+/i)
      .map((s) => normalizeLocationName(s))
      .filter((s) => s.length > 0);

    islands = listText;

    workingArea = workingArea.replace(includingMatch[0], "").trim();
  }

  const { name, municipalities } = extractMunicipalities(workingArea);

  const result: Area = { name: normalizeLocationName(name) };

  if (islands.length > 0) {
    result.islands = islands;
  }

  if (partDescriptors.length > 0) {
    result.parts = partDescriptors;
  }

  if (municipalities.length > 0) {
    result.locals = municipalities;
  }

  return result;
};
