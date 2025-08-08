import { PATTERNS } from "../constants/patterns";
import { Area } from "../types/index";
import {
  splitPreservingParentheses,
  extractMunicipalities,
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

    if (line.includes("Warning lead time")) {
      collecting = false;
      continue;
    }

    if (PATTERNS.skipLine.test(line) || PATTERNS.regionHeading.test(line)) {
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
};

export const containsAreaNames = (line: string): boolean => {
  if (PATTERNS.skipMetadata.test(line) || PATTERNS.skipLine.test(line)) {
    return false;
  }

  // Area lines often contain commas/and-separated phrases with optional portion/rest/mainland keywords, e.g. "northern portion of Cagayan, Ilocos Norte and Abra"
  const hasListDelimiters = /,|;|\sand\s/i.test(line);

  const hasAreaKeywords = PATTERNS.areaLineKeywords.test(line);

  // Starts with a known signal header is already filtered. Keep lines with title-case words and avoid all-caps metadata
  const looksLikeProperNouns =
    /\b[A-Z][a-z'’\-]+(?:\s+[A-Z][a-z'’\-]+)*\b/.test(line) ||
    /\b[A-Z]{3,}\b/.test(line);

  // Consider a line an area line if it has list delimiters or area keywords and looks like it contains proper nouns.
  return (hasListDelimiters || hasAreaKeywords) && looksLikeProperNouns;
};

export const parseArea = (areaText: string): Area | null => {
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
};
