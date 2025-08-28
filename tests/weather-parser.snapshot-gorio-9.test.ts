import { join } from "path";
import parseWeatherPdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 9",
  subtitle: "Typhoon GORIO (PODUL)",
  description:
    "“GORIO” SLIGHTLY INTENSIFIES AS IT BEGINS TO APPROACH THE EASTERN COAST OF SOUTHERN TAIWAN.",
  dateIssued: "August 13, 2025 5:00 AM",
  dateIssuedISO: "2025-08-12T21:00:00.000Z",
  dateValidUntil: "August 13, 2025 11:00 AM",
  dateValidUntilISO: "2025-08-13T03:00:00.000Z",
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
              parts: ["rest"],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
      {
        level: 2,
        regions: {
          luzon: [
            {
              name: "Batanes",
              locals: ["Itbayat"],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#9_gorio.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#9_gorio.pdf");
    const result = await parseWeatherPdf(filePath);

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
