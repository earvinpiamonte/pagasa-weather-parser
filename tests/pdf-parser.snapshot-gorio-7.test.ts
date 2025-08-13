import { join } from "path";
import parseTcbPdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 7",
  subtitle: "Typhoon GORIO (PODUL)",
  description:
    "“GORIO” MAINTAINS ITS STRENGTH AS IT MOVES WEST NORTHWESTWARD OVER THE PAST SIX HOURS.",
  dateIssued: "August 12, 2025 5:00 PM",
  dateIssuedISO: "2025-08-12T09:00:00.000Z",
  dateValidUntil: "August 12, 2025 11:00 PM",
  dateValidUntilISO: "2025-08-12T15:00:00.000Z",
  cyclone: {
    name: "GORIO",
    internationalName: "PODUL",
    signals: [
      {
        level: 1,
        regions: {
          luzon: [
            {
              name: "Batanes",
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#7_gorio.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#7_gorio.pdf");
    const result = await parseTcbPdf(filePath);

    const sanitize = (value: any): any => {
      if (Array.isArray(value)) return value.map(sanitize);
      if (value && typeof value === "object") {
        const cleaned: any = {};
        for (const key of Object.keys(value)) {
          const currentValue = value[key];
          if (currentValue !== undefined) {
            cleaned[key] = sanitize(currentValue);
          }
        }
        return cleaned;
      }
      return value;
    };

    expect(sanitize(result)).toStrictEqual(expected);
  });
});
