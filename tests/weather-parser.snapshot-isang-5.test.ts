import { join } from "path";
import parseWeatherPdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 5",
  subtitle: "Tropical Depression ISANG",
  description:
    "“ISANG” HAS EMERGED OVER THE SEA WEST OF ILOCOS REGION AND IS NOW TRAVERSING THE WEST PHILIPPINE SEA.",
  dateIssued: "August 22, 2025 11:00 PM",
  dateIssuedISO: "2025-08-22T15:00:00.000Z",
  dateValidUntil: null,
  dateValidUntilISO: null,
  cyclone: {
    name: "ISANG",
    internationalName: null,
    signals: [
      {
        level: 1,
        regions: {
          luzon: [
            { name: "Cagayan", islands: ["Babuyan Islands"] },
            { name: "Isabela" },
            { name: "Quirino" },
            { name: "Nueva Vizcaya" },
            { name: "Apayao" },
            { name: "Abra" },
            { name: "Kalinga" },
            { name: "Mountain Province" },
            { name: "Ifugao" },
            { name: "Benguet" },
            { name: "Ilocos Norte" },
            { name: "Ilocos Sur" },
            { name: "La Union" },
            { name: "Pangasinan" },
            {
              name: "Nueva Ecija",
              parts: ["northern"],
              locals: ["Carranglan", "Lupao"],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#5_isang.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#5_isang.pdf");
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
