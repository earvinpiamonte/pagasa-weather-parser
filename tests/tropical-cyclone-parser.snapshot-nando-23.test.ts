import { join } from "path";
import parseTropicalCyclonePdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 23",
  subtitle: "Typhoon NANDO (RAGASA)",
  description: "PASSES VERY CLOSE TO BABUYAN ISLAND.",
  dateIssued: "September 22, 2025 2:00 PM",
  dateIssuedISO: "2025-09-22T06:00:00.000Z",
  dateValidUntil: "September 22, 2025 5:00 PM",
  dateValidUntilISO: "2025-09-22T09:00:00.000Z",
  cyclone: {
    name: "NANDO",
    internationalName: "RAGASA",
    signals: [
      {
        level: 1,
        regions: {
          luzon: [
            { name: "Quirino" },
            { name: "Nueva Vizcaya", parts: ["rest"] },
            { name: "Benguet", parts: ["rest"] },
            { name: "La Union", parts: ["rest"] },
            { name: "Pangasinan" },
            { name: "Aurora" },
            { name: "Nueva Ecija" },
            { name: "Bulacan" },
            { name: "Tarlac" },
            { name: "Pampanga" },
            { name: "Zambales" },
            {
              name: "Quezon",
              parts: ["northern"],
              locals: ["General Nakar"],
              islands: ["Polillo Islands"],
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
            { name: "Cagayan", parts: ["rest", "mainland"] },
            { name: "Isabela" },
            { name: "Apayao", parts: ["rest"] },
            { name: "Abra" },
            { name: "Kalinga" },
            { name: "Mountain Province" },
            { name: "Ifugao" },
            {
              name: "Benguet",
              parts: ["northern"],
              locals: ["Mankayan", "Buguias", "Bakun", "Kibungan"],
            },
            {
              name: "Nueva Vizcaya",
              parts: ["northeastern"],
              locals: ["Diadi"],
            },
            { name: "Ilocos Sur" },
            {
              name: "La Union",
              parts: ["northern"],
              locals: ["Sudipen", "Bangar", "Luna", "Balaoan", "Santol"],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
      {
        level: 3,
        regions: {
          luzon: [
            { name: "Batanes", parts: ["rest"] },
            {
              name: "Cagayan",
              parts: ["central", "mainland"],
              locals: [
                "Lal-Lo",
                "Gattaran",
                "Baggao",
                "Alcala",
                "Santo Niño",
                "Lasam",
                "Allacapan",
                "Rizal",
                "Amulung",
                "Piat",
              ],
            },
            {
              name: "Apayao",
              parts: ["northern", "central"],
              locals: [
                "Flora",
                "Santa Marcela",
                "Pudtol",
                "Luna",
                "Calanasan",
                "Kabugao",
              ],
            },
            { name: "Ilocos Norte", parts: ["rest"] },
          ],
          visayas: [],
          mindanao: [],
        },
      },
      {
        level: 4,
        regions: {
          luzon: [
            {
              name: "Batanes",
              parts: ["southern"],
              locals: ["Basco", "Mahatao", "Ivana", "Uyugan", "Sabtang"],
            },
            {
              name: "Cagayan",
              parts: ["northern", "mainland"],
              locals: [
                "Santa Ana",
                "Santa Praxedes",
                "Claveria",
                "Sanchez-Mira",
                "Pamplona",
                "Abulug",
                "Ballesteros",
                "Aparri",
                "Buguey",
                "Santa Teresita",
                "Gonzaga",
                "Camalaniugan",
              ],
            },
            {
              name: "Ilocos Norte",
              parts: ["northern"],
              locals: ["Pagudpud", "Burgos", "Bangui", "Dumalneg", "Adams"],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
      {
        level: 5,
        regions: {
          luzon: [{ name: "Babuyan Islands" }],
          visayas: [],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#23_nando.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#23_nando.pdf");

    const result = await parseTropicalCyclonePdf(filePath);

    const sanitize = (value: unknown): unknown => {
      if (Array.isArray(value)) {
        return value.map(sanitize);
      }

      if (value !== null && typeof value === "object") {
        const cleaned: Record<string, unknown> = {};

        for (const [key, currentValue] of Object.entries(value)) {
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
