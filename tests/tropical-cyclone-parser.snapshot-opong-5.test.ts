import { join } from "path";
import parseTropicalCyclonePdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 5",
  subtitle: "Severe Tropical Storm OPONG (BUALOI)",
  description:
    "“OPONG” INTENSIFIES INTO A SEVERE TROPICAL STORM OVER THE PHILIPPINE SEA.",
  dateIssued: "September 24, 2025 5:00 PM",
  dateIssuedISO: "2025-09-24T09:00:00.000Z",
  dateValidUntil: "September 24, 2025 11:00 PM",
  dateValidUntilISO: "2025-09-24T15:00:00.000Z",
  cyclone: {
    name: "OPONG",
    internationalName: "BUALOI",
    signals: [
      {
        level: 1,
        regions: {
          luzon: [
            { name: "Catanduanes" },
            { name: "Camarines Sur" },
            { name: "Albay" },
            { name: "Sorsogon" },
            { name: "Masbate" },
          ],
          visayas: [
            {
              name: "Samar",
              parts: ["rest", "eastern"],
            },
            { name: "Biliran" },
            {
              name: "Leyte",
              parts: ["northern"],
              locals: [
                "Barugo",
                "San Miguel",
                "Babatngon",
                "Tacloban City",
                "Calubian",
                "Leyte",
                "Capoocan",
                "Carigara",
                "Palo",
              ],
            },
          ],
          mindanao: [],
        },
      },
      {
        level: 2,
        regions: {
          luzon: [],
          visayas: [
            {
              name: "Samar",
              parts: ["northern", "eastern"],
              locals: ["San Policarpo", "Oras", "Jipapad", "Arteche"],
            },
          ],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#5_opong.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#5_opong.pdf");

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
