import { PATTERNS } from "../constants/patterns";

export function splitPreservingParentheses(text: string): string[] {
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

export function extractMunicipalities(areaText: string): {
  name: string;
  municipalities: string[];
} {
  const municipalities: string[] = [];
  let match;

  // Reset pattern to start from beginning
  PATTERNS.parentheses.lastIndex = 0;
  while ((match = PATTERNS.parentheses.exec(areaText)) !== null) {
    const munis = match[1]
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0 && !/^\d+$/.test(m));
    municipalities.push(...munis);
  }

  const cleanName = areaText
    .replace(/\s*\([^)]*\)/g, "")
    .replace(PATTERNS.cleanExtra, "")
    .replace(PATTERNS.restPattern, "")
    .replace(/^the\s+/i, "")
    .trim();

  return { name: cleanName, municipalities };
}
