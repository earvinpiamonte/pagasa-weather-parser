// Common cardinal/ordinal descriptors used in PAGASA bulletins
export const DIRECTIONS = [
  "northwestern",
  "northeastern",
  "southeastern",
  "southwestern",
  "northern",
  "southern",
  "eastern",
  "western",
  "central",
] as const;

const DIR_GROUP = DIRECTIONS.join("|");

export const PATTERNS = {
  tcws: /TROPICAL CYCLONE WIND SIGNALS.*?IN EFFECT(.*?)(?=OTHER HAZARDS|HAZARDS AFFECTING|$)/s,
  signalNumber: /^[12345]\s*$/,
  tcwsNumber: /TCWS\s+No\.\s*([12345])/i,
  signalMatch: /^\s*([12345])\s*$/m,
  portionPattern: new RegExp(
    `^(the\\s+)?(${DIR_GROUP})\\s+portion\\s+of\\s+(.+)$`, // e.g. "northern portion of Cagayan"
    "i"
  ),
  restPattern: /^(the\s+)?rest\s+of\s+/i,
  additionalPortion: new RegExp(`\\b(${DIR_GROUP})\\b`, "gi"),
  cleanPortion: new RegExp(
    `\\b(${DIR_GROUP})(\\s+portion\\s+of\\s+|\\s+)`,
    "gi"
  ),
  parentheses: /\(([^)]+)\)/g,
  cleanExtra: /\s*-\s*-?\s*$/,
  normalizeSpace: /\s+/g,
  // skip generic metadata/noise lines commonly found in headers/footers
  skipMetadata:
    /^\s*\d+\s*$|bulletin|tropical|storm|issued|valid|broadcast|prepared|checked|tracking|weather|flood|forecasting|tel|senator|website|brgy|philippines|republic|department|science|technology|pagasa|atmospheric|geophysical|astronomical|services|administration|division|page\s+\d+/i,
  // skip lines for hazard descriptors and units anywhere in the line
  skipLine:
    /\b(Wind threat|Storm-force|Gale-force|Range of wind|Potential impacts|Warning lead time|Beaufort|km\/h|hours)\b/i,
  regionHeading: /^\s*(Luzon|Visayas|Mindanao)\s*[:\-]?\s*$/i,
  // keywords that often appear around area listings
  areaLineKeywords: /(portion\s+of|rest\s+of|mainland|islands?)/i,
} as const;
