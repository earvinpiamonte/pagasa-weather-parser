import { join } from "path";
import parseTropicalCyclonePdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 2",
  subtitle: "Tropical Depression MIRASOL",
  description:
    "MIRASOL MAINTAINS ITS STRENGTH AS IT MOVES CLOSER TOWARDS ISABELA – NORTHERN PORTION OF AURORA.",
  dateIssued: "September 16, 2025 8:00 PM",
  dateIssuedISO: "2025-09-16T12:00:00.000Z",
  dateValidUntil: "September 16, 2025 11:00 PM",
  dateValidUntilISO: "2025-09-16T15:00:00.000Z",
  cyclone: {
    name: "MIRASOL",
    internationalName: null,
    signals: [
      {
        level: 1,
        regions: {
          luzon: [
            {
              name: "Batanes",
            },
            {
              name: "Cagayan",
              islands: ["Babuyan Islands"],
            },
            {
              name: "Isabela",
            },
            {
              name: "Quirino",
            },
            {
              name: "Nueva Vizcaya",
              parts: ["northeastern"],
              locals: [
                "Diadi",
                "Quezon",
                "Kasibu",
                "Dupax del Norte",
                "Bambang",
                "Ambaguio",
                "Bayombong",
                "Solano",
                "Villaverde",
                "Bagabag",
              ],
            },
            {
              name: "Aurora",
              parts: ["northern", "central"],
              locals: [
                "Dilasag",
                "Casiguran",
                "Dinalungan",
                "Dipaculao",
                "Baler",
              ],
            },
            {
              name: "Apayao",
            },
            {
              name: "Kalinga",
            },
            {
              name: "Abra",
            },
            {
              name: "Mountain Province",
            },
            {
              name: "Ifugao",
            },
            {
              name: "Ilocos Norte",
            },
            {
              name: "Ilocos Sur",
              parts: ["northern"],
              locals: [
                "Sinait",
                "Cabugao",
                "San Juan",
                "Magsingal",
                "Santo Domingo",
                "Bantay",
                "San Vicente",
                "San Ildefonso",
                "Santa Catalina",
                "City of Vigan",
                "Caoayan",
                "Santa",
              ],
            },
            {
              name: "Polillo Islands",
            },
            {
              name: "Camarines Norte",
              parts: ["northern"],
              locals: [
                "Vinzons",
                "Capalonga",
                "Jose Panganiban",
                "Paracale",
                "Talisay",
                "Daet",
                "Mercedes",
              ],
            },
            {
              name: "Camarines Sur",
              parts: ["northeastern"],
              locals: [
                "Caramoan",
                "Garchitorena",
                "Presentacion",
                "Lagonoy",
                "Siruma",
                "Tinambac",
                "Goa",
                "San Jose",
              ],
            },
            {
              name: "Catanduanes",
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#2_mirasol.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#2_mirasol.pdf");

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
