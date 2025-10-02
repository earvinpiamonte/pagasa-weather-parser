import { PATTERNS } from "../constants/patterns";
import {
  LUZON_PROVINCES,
  VISAYAS_PROVINCES,
  MINDANAO_PROVINCES,
} from "../constants/regions";

const ALL_PROVINCES = [
  ...LUZON_PROVINCES,
  ...VISAYAS_PROVINCES,
  ...MINDANAO_PROVINCES,
];

const PROVINCE_PATTERN = ALL_PROVINCES.sort((a, b) => b.length - a.length)
  .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

const ADJACENT_PROVINCES_REGEX = new RegExp(
  `\\b(${PROVINCE_PATTERN})\\s+(${PROVINCE_PATTERN})\\b`,
  "gi"
);

const getProvinceRegion = (provinceName: string): string => {
  const lower = provinceName.toLowerCase();

  if (LUZON_PROVINCES.includes(lower)) {
    return "luzon";
  }

  if (VISAYAS_PROVINCES.includes(lower)) {
    return "visayas";
  }

  if (MINDANAO_PROVINCES.includes(lower)) {
    return "mindanao";
  }

  return "unknown";
};

const splitAdjacentRegions = (text: string): string => {
  // Reset lastIndex to avoid stateful regex issues with the global flag
  ADJACENT_PROVINCES_REGEX.lastIndex = 0;

  return text.replace(
    ADJACENT_PROVINCES_REGEX,
    (match, province1, province2) => {
      // Only split if they belong to different regions
      const region1 = getProvinceRegion(province1);

      const region2 = getProvinceRegion(province2);

      return region1 !== region2 ? `${province1}, ${province2}` : match;
    }
  );
};

export const splitPreservingParentheses = (text: string): string[] => {
  // First split any adjacent province names that should be separate
  const preprocessedText = splitAdjacentRegions(text);

  const result: string[] = [];
  let current = "";
  let parenthesesDepth = 0;
  let i = 0;

  const AND_DELIMITER = " and ";

  while (i < preprocessedText.length) {
    const char = preprocessedText[i];

    const nextChars = preprocessedText
      .slice(i, i + AND_DELIMITER.length)
      .toLowerCase();

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
    } else if (parenthesesDepth === 0 && nextChars === AND_DELIMITER) {
      // Check if this "and" is connecting parts of the same area or different areas
      // Look ahead to see if there's "portion" or "portions" after "and"

      const restOfText = preprocessedText.slice(i + AND_DELIMITER.length);

      const isConnectingPortions = PATTERNS.connectingPortions.test(restOfText);

      if (isConnectingPortions) {
        current += " and ";
      } else {
        if (current.trim()) {
          result.push(current.trim());
        }

        current = "";
      }

      // Skip past the delimiter
      i += AND_DELIMITER.length - 1; // -1 because the main loop will increment i
    } else {
      current += char;
    }

    i++;
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result.filter((segment) => segment.length > 0);
};

export const normalizeLocationName = (name: string): string => {
  const trimmed = name.trim().replace(/\.+$/, "");

  // Keep certain words lowercase (articles, prepositions, etc.)
  const keepLowercase = ["of", "del", "de", "la", "las", "los", "and", "the"];

  // Properly capitalize the name while preserving original case for certain words
  return trimmed
    .split(" ")
    .map((word, index) => {
      if (word.length === 0) return word;

      const lowerWord = word.toLowerCase();

      // Always capitalize the first word, keep certain words lowercase if not first
      if (index > 0 && keepLowercase.includes(lowerWord)) {
        return lowerWord;
      }

      // Handle hyphenated words (like "Lal-Lo", "Sanchez-Mira")
      if (word.includes("-")) {
        return word
          .split("-")
          .map((part) => {
            if (part.length === 0) return part;
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          })
          .join("-");
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export const fixCommonSpelling = (text: string): string => {
  if (!text || typeof text !== "string") {
    return text;
  }

  let corrected = text;

  corrected = corrected.replace(/portionp\s+of\b/gi, "portion of");

  return corrected;
};

export const extractMunicipalities = (
  areaText: string
): {
  name: string;
  municipalities: string[];
} => {
  const municipalities: string[] = [];
  let match;

  // Reset pattern to start from beginning
  PATTERNS.parentheses.lastIndex = 0;
  while ((match = PATTERNS.parentheses.exec(areaText)) !== null) {
    const munis = match[1]
      .split(",")
      .map((m) => normalizeLocationName(m))
      .filter((m) => m.length > 0 && !/^\d+$/.test(m));

    municipalities.push(...munis);
  }

  // Normalize "Isl" to "Island" for municipalities
  const normalizedMunicipalities = municipalities.map((municipality) => {
    return municipality.replace(/\bIsl\s*$/, "Island");
  });

  const cleanName = normalizeLocationName(
    areaText
      .replace(/\s*\([^)]*\)/g, "")
      .replace(PATTERNS.cleanExtra, "")
      .replace(PATTERNS.restPattern, "")
      .replace(/^the\s+/i, "")
      .replace(PATTERNS.andPortions, " ")
      .replace(/\s+/g, " ")
  );

  return { name: cleanName, municipalities: normalizedMunicipalities };
};
