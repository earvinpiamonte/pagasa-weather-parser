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
  if (!date || !time || !meridian) return undefined;
  try {
    const base = `${date} ${time} ${meridian}`;

    const d = new Date(base + " GMT+0800");

    return isNaN(d.getTime()) ? undefined : d.toISOString();
  } catch {
    return undefined;
  }
};

const extractMeta = (text: string) => {
  const title = text.match(PATTERNS.bulletinTitle)?.[1];
  const subtitle = text.match(PATTERNS.bulletinSubtitle)?.[1];
  const names = text.match(PATTERNS.cycloneNames);
  const issued = text.match(PATTERNS.issued);
  const valid = text.match(PATTERNS.validUntil);

  let dateIssued: string | undefined;
  let dateIssuedISO: string | undefined;

  if (!issued) {
    const alt = text.match(PATTERNS.issuedAlt);

    if (alt) {
      const time = alt[1];
      const mer = alt[2];
      const day = alt[3];
      const month = alt[4];
      const year = alt[5];

      dateIssued = `${month} ${day}, ${year} ${time} ${mer}`;
      dateIssuedISO = toISO(`${month} ${day}, ${year}`, time, mer);
    }
  }

  if (!dateIssued && issued) {
    dateIssued = parseDate(issued[1], issued[2], issued[3]);
    dateIssuedISO = toISO(issued[1], issued[2], issued[3]);
  }

  let dateValidUntil: string | undefined;
  let dateValidUntilISO: string | undefined;

  if (!valid) {
    const vt = text.match(PATTERNS.validTodayTime);

    if (vt && dateIssued) {
      // Reuse issued date's date part (Month Day, Year)
      const datePart = (dateIssued.match(/([A-Za-z]+\s+\d{1,2},\s*\d{4})/) ||
        [])[1];
      const time = vt[1];
      const mer = vt[2];

      if (datePart) {
        dateValidUntil = `${datePart} ${time} ${mer}`;
        dateValidUntilISO = toISO(datePart, time, mer);
      }
    }
  }

  if (!dateValidUntil && valid) {
    dateValidUntil = parseDate(valid[1], valid[2], valid[3]);
    dateValidUntilISO = toISO(valid[1], valid[2], valid[3]);
  }

  let description: string | undefined;

  if (subtitle) {
    const idx = text.indexOf(subtitle);

    if (idx !== -1) {
      const after = text
        .slice(idx + subtitle.length)
        .split(/\n+/)
        .map((l) => l.trim());

      let capturing = false;

      const parts: string[] = [];

      for (const raw of after) {
        if (!raw) {
          continue;
        }

        if (/^TROPICAL CYCLONE WIND SIGNALS/i.test(raw)) {
          break;
        }

        // Skip obvious metadata/header blocks
        if (
          /^(Issued at|Valid for broadcast|Prepared by:|Checked by:|Page \d+ of \d+|Republic of the Philippines|DEPARTMENT OF SCIENCE|Philippine Atmospheric|Services Administration|Weather Division|MMSS-\d+)/i.test(
            raw
          )
        ) {
          if (!capturing) {
            continue;
          } else {
            break;
          }
        }

        const isUpper = /^[A-Z0-9 “”"'(),.-]+$/.test(raw) && /[A-Z]/.test(raw);

        if (!capturing) {
          // Start when line contains cyclone name or verbs and is uppercase-ish
          if (
            isUpper &&
            /(EMONG|WEAKENS|INTENSIFIES|MAINTAINS|ENTERS|PASSES|APPROACHES|EXIT)/.test(
              raw
            )
          ) {
            capturing = true;

            parts.push(raw.replace(/\s+/g, " ").trim());
          }
        } else {
          // Continue while uppercase sequence
          if (isUpper) {
            parts.push(raw.replace(/\s+/g, " ").trim());
            continue;
          }

          break;
        }
        if (parts.length >= 2) {
          break;
        }
      }

      if (parts.length) {
        description = parts.join(" ");
      }
    }
  }

  return {
    title,
    subtitle,
    description,
    dateIssued,
    dateIssuedISO,
    dateValidUntil,
    dateValidUntilISO,
    cyclone: {
      name: names?.[2],
      internationalName: names?.[3],
    },
  };
};

export const parsePdfFromBuffer = async (
  buffer: Buffer
): Promise<BulletinData> => {
  try {
    const data = await pdf(buffer);
    const meta = extractMeta(data.text);
    const signals = extractSignals(data.text);

    return {
      ...meta,
      cyclone: {
        ...meta.cyclone,
        signals: signals.signals,
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
