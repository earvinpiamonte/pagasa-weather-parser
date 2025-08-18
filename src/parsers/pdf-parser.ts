import pdf from "pdf-parse";
import { BulletinData } from "../types/index";
import { extractSignals } from "./signal-parser";
import { PATTERNS } from "../constants/patterns";

const parseDate = (date: string, time: string, meridian: string): string =>
  `${date} ${time} ${meridian}`.replace(/\s+/g, " ").trim();

const toISO = (
  date: string | undefined,
  time: string | undefined,
  meridian: string | undefined
): string | undefined => {
  if (!date || !time || !meridian) {
    return undefined;
  }

  try {
    const base = `${date} ${time} ${meridian}`;

    const dateObject = new Date(base + " GMT+0800");

    return isNaN(dateObject.getTime()) ? undefined : dateObject.toISOString();
  } catch {
    return undefined;
  }
};

const extractMeta = (text: string) => {
  const title =
    text.match(PATTERNS.bulletinTitle)?.[1] ||
    text.match(PATTERNS.advisoryTitle)?.[1];
  const subtitle =
    text.match(PATTERNS.bulletinSubtitle)?.[1] ||
    text.match(PATTERNS.plainCycloneClassification)?.[0];
  const names = text.match(PATTERNS.cycloneNames);
  const issued = text.match(PATTERNS.issued);
  const valid = text.match(PATTERNS.validUntil);

  let dateIssued: string | undefined;
  let dateIssuedISO: string | undefined;

  if (!issued) {
    const issuedAlternateMatch = text.match(PATTERNS.issuedAlt);

    if (issuedAlternateMatch) {
      const time = issuedAlternateMatch[1];
      const meridian = issuedAlternateMatch[2];
      const day = issuedAlternateMatch[3];
      const month = issuedAlternateMatch[4];
      const year = issuedAlternateMatch[5];

      dateIssued = `${month} ${day}, ${year} ${time} ${meridian}`;
      dateIssuedISO = toISO(`${month} ${day}, ${year}`, time, meridian);
    }
  }

  if (!dateIssued && issued) {
    dateIssued = parseDate(issued[1], issued[2], issued[3]);
    dateIssuedISO = toISO(issued[1], issued[2], issued[3]);
  }

  let dateValidUntil: string | undefined;
  let dateValidUntilISO: string | undefined;

  if (!valid) {
    const validTodayTimeMatch = text.match(PATTERNS.validTodayTime);

    if (validTodayTimeMatch && dateIssued) {
      // Reuse issued date's date part (Month Day, Year)
      const datePart = (dateIssued.match(/([A-Za-z]+\s+\d{1,2},\s*\d{4})/) ||
        [])[1];
      const time = validTodayTimeMatch[1];
      const meridian = validTodayTimeMatch[2];

      if (datePart) {
        dateValidUntil = `${datePart} ${time} ${meridian}`;
        dateValidUntilISO = toISO(datePart, time, meridian);
      }
    }
  }

  if (!dateValidUntil && valid) {
    dateValidUntil = parseDate(valid[1], valid[2], valid[3]);
    dateValidUntilISO = toISO(valid[1], valid[2], valid[3]);
  }

  let description: string | undefined;

  if (subtitle) {
    const subtitleIndex = text.indexOf(subtitle);

    if (subtitleIndex !== -1) {
      const linesAfterSubtitle = text
        .slice(subtitleIndex + subtitle.length)
        .split(/\n+/)
        .map((line) => line.trim());

      let capturing = false;

      const descriptionLines: string[] = [];

      for (const line of linesAfterSubtitle) {
        if (!line) {
          continue;
        }

        if (/^TROPICAL CYCLONE WIND SIGNALS/i.test(line)) {
          break;
        }

        if (
          /^(Issued at|Valid for broadcast|Prepared by:|Checked by:|Page \d+ of \d+|Republic of the Philippines|DEPARTMENT OF SCIENCE|Philippine Atmospheric|Services Administration|Weather Division|MMSS-\d+)/i.test(
            line
          )
        ) {
          if (!capturing) {
            continue;
          }

          break;
        }

        const isUpper =
          /^[A-Z0-9 “”"'(),.-]+$/.test(line) && /[A-Z]/.test(line);

        if (!capturing) {
          const cycloneNameFromSubtitle =
            subtitle?.match(/[“"']?([A-Z]{3,})/)?.[1];
          const dynamicPatternParts = [
            "WEAKENS",
            "INTENSIFIES",
            "MAINTAINS",
            "ENTERS",
            "PASSES",
            "APPROACHES",
            "EXIT",
            "RE-?ENTERS",
            "RE-?EMERGES",
            "REGENERATES",
            "REMAINS",
            "RE-?FORMS",
            "RE-?INTENSIFIES",
            "DEVELOPS",
            "DISSIPATES",
            "REMNANT\\s+LOW",
          ];
          if (cycloneNameFromSubtitle) {
            dynamicPatternParts.unshift(cycloneNameFromSubtitle);
          }
          const triggerRegex = new RegExp(
            `(${dynamicPatternParts.join("|")})`,
            "i"
          );
          if (isUpper && triggerRegex.test(line)) {
            capturing = true;
            descriptionLines.push(line.replace(/\s+/g, " ").trim());
          }
        } else {
          if (isUpper) {
            descriptionLines.push(line.replace(/\s+/g, " ").trim());
            continue;
          }

          break;
        }

        if (descriptionLines.length >= 2) {
          break;
        }
      }

      if (descriptionLines.length) {
        description = descriptionLines.join(" ");
      }
    }
  }

  return {
    title: title || null,
    subtitle: subtitle || null,
    description: description || null,
    dateIssued: dateIssued || null,
    dateIssuedISO: dateIssuedISO || null,
    dateValidUntil: dateValidUntil || null,
    dateValidUntilISO: dateValidUntilISO || null,
    cyclone: {
      name:
        names?.[2] ||
        subtitle?.match(/Tropical\s+Depression\s+([A-Z]{3,})/i)?.[1] ||
        null,
      internationalName: names?.[3] || null,
      signals: [],
    },
  };
};

export const parsePdfFromBuffer = async (
  buffer: Buffer
): Promise<BulletinData> => {
  try {
    const data = await pdf(buffer);
    const meta = extractMeta(data.text);
    const signalsMap = extractSignals(data.text);
    const signalsArray = Object.keys(signalsMap)
      .map((k) => ({ level: Number(k), regions: signalsMap[k].regions }))
      .sort((a, b) => a.level - b.level);

    return {
      ...meta,
      cyclone: {
        ...meta.cyclone,
        signals: signalsArray,
      },
    };
  } catch (error) {
    throw new Error(
      `Failed to parse PDF buffer: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
