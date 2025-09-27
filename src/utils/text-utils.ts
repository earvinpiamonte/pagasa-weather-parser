import { PATTERNS } from "../constants/patterns";

export const splitPreservingParentheses = (text: string): string[] => {
  const result: string[] = [];
  let current = "";
  let parenthesesDepth = 0;
  let i = 0;

  const AND_DELIMITER = " and ";

  while (i < text.length) {
    const char = text[i];
    const nextChars = text.slice(i, i + AND_DELIMITER.length).toLowerCase();

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

      const restOfText = text.slice(i + AND_DELIMITER.length);

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
  return name.trim().replace(/\.+$/, "");
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
