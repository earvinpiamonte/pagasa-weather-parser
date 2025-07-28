export const PATTERNS = {
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

export const SKIP_TERMS = new Set([
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
