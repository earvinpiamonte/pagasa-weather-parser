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
  bulletinTitle: /(TROPICAL\s+CYCLONE\s+BULLETIN\s+NR\.\s*\d+[A-Z]?)/i,
  advisoryTitle: /(TROPICAL\s+CYCLONE\s+ADVISORY\s+NR\.\s*\d+[A-Z]?)/i,
  bulletinSubtitle:
    /(Tropical\s+Depression\s+[A-Z]+\s*\([^)]*\)?|Tropical\s+Storm\s+[A-Z]+\s*\([^)]*\)?|Typhoon\s+[A-Z]+\s*\([^)]*\)?|Severe\s+Tropical\s+Storm\s+[A-Z]+\s*\([^)]*\)?|Low\s+Pressure\s+Area\s*\([^)]*\))/i,
  // Classification header without trailing parentheses
  plainCycloneClassification:
    /(Tropical\s+Depression|Tropical\s+Storm|Severe\s+Tropical\s+Storm|Typhoon)\s+[A-Z]{3,}(?!\s*\()/i,
  cycloneNames:
    /\b(Tropical\s+Storm|Typhoon|Severe\s+Tropical\s+Storm)\s+([A-Z]+)\s*\(([^)]+)\)/i,
  issued:
    /Issued\s+at\s+([A-Za-z]+\s+\d{1,2},\s*\d{4})\s*(\d{1,2}:\d{2})\s*(AM|PM)/i,
  validUntil:
    /Valid\s+Until\s*:?.{0,10}?([A-Za-z]+\s+\d{1,2},\s*\d{4})\s*(\d{1,2}:\d{2})\s*(AM|PM)/i,
  issuedAlt:
    /Issued\s+at\s+(\d{1,2}:\d{2})\s*(AM|PM),\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i, // time first then day Month Year
  validTodayTime: /Valid[^\n]*?at\s+(\d{1,2}:\d{2})\s*(AM|PM)\s+today\.?/i,
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
  trailingDash: /\s*-\s*$/,
  trailingMultipleDash: /\s+(?:-\s*){1,3}$/g,
  dashOnly: /^-+$/,
  // skip generic metadata/noise lines commonly found in headers/footers
  skipMetadata:
    /^\s*\d+\s*$|bulletin|tropical|storm|issued|valid|broadcast|prepared|checked|tracking|weather|flood|forecasting|tel|senator|website|brgy|philippines|republic|department|science|technology|pagasa|atmospheric|geophysical|astronomical|services|administration|division|page\s+\d+/i,
  // skip lines for hazard descriptors and units anywhere in the line
  skipLine:
    /\b(Wind threat|Storm-force|Gale-force|Range of wind|Potential impacts|Warning lead time|Beaufort|km\/h|hours)\b/i,
  regionHeading: /^\s*(Luzon|Visayas|Mindanao)\s*[:\-]?\s*$/i,
  // keywords that often appear around area listings
  areaLineKeywords: /(portion\s+of|rest\s+of|mainland|islands?)/i,
  areaFiller: /^(?:winds|(?:strong|gale-force|storm-force)(?:\s+winds?)?)$/i,
} as const;
