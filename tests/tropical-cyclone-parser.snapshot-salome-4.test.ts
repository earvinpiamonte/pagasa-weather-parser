import { join } from "path";
import parseTropicalCyclonePdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 4",
  subtitle: "Tropical Depression SALOME",
  description: `“SALOME” MAINTAINS ITS STRENGTH AS IT ACCELERATES SOUTHWARD TOWARDS EXTREME NORTHERN LUZON.`,
  dateIssued: "October 22, 2025 8:00 PM",
  dateIssuedISO: "2025-10-22T12:00:00.000Z",
  dateValidUntil: "October 22, 2025 11:00 PM",
  dateValidUntilISO: "2025-10-22T15:00:00.000Z",
  cyclone: {
    name: "SALOME",
    internationalName: null,
    signals: [
      {
        level: 1,
        regions: {
          luzon: [
            { name: "Batanes" },
            {
              name: "Babuyan Islands",
              parts: ["western"],
              locals: ["Calayan Island", "Dalupiri Island"],
            },
            {
              name: "Ilocos Norte",
              parts: ["northwestern"],
              locals: [
                "Bangui",
                "Pagudpud",
                "Burgos",
                "Pasuquin",
                "Bacarra",
                "Laoag City",
              ],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#4_salome.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#4_salome.pdf");

    const result = await parseTropicalCyclonePdf(filePath);

    const sanitize = (value: any): any => {
      if (Array.isArray(value)) {
        return value.map(sanitize);
      }

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
