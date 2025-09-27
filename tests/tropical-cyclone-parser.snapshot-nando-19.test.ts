import { join } from "path";
import parseTropicalCyclonePdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 19",
  subtitle: "Typhoon NANDO (RAGASA)",
  description:
    "SUPER TYPHOON NANDO SLIGHTLY ACCELERATES AS IT BEGINS TO APPROACH EXTREME NORTHERN LUZON.",
  dateIssued: "September 22, 2025 2:00 AM",
  dateIssuedISO: "2025-09-21T18:00:00.000Z",
  dateValidUntil: "September 22, 2025 5:00 AM",
  dateValidUntilISO: "2025-09-21T21:00:00.000Z",
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
            { name: "Ifugao", parts: ["rest"] },
            { name: "Benguet" },
            { name: "Ilocos Sur", parts: ["rest"] },
            { name: "La Union" },
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
            { name: "Cagayan", parts: ["rest"] },
            { name: "Isabela" },
            { name: "Apayao", parts: ["rest"] },
            { name: "Abra" },
            { name: "Kalinga" },
            { name: "Mountain Province" },
            {
              name: "Ifugao",
              parts: ["eastern", "central"],
              locals: [
                "Alfonso Lista",
                "Aguinaldo",
                "Mayoyao",
                "Banaue",
                "Hungduan",
                "Lagawe",
                "Hingyon",
              ],
            },
            {
              name: "Nueva Vizcaya",
              parts: ["northeastern"],
              locals: ["Diadi"],
            },
            { name: "Ilocos Norte", parts: ["rest"] },
            {
              name: "Ilocos Sur",
              parts: ["northern", "central"],
              locals: [
                "Cabugao",
                "Sinait",
                "San Juan",
                "Magsingal",
                "Santo Domingo",
                "Bantay",
                "San Ildefonso",
                "San Vicente",
                "Santa Catalina",
                "City of Vigan",
                "Caoayan",
                "Santa",
                "Nagbukel",
                "Narvacan",
                "Santa Maria",
                "San Emilio",
                "Burgos",
                "Santiago",
                "San Esteban",
                "Lidlidda",
                "Banayoyo",
                "Quirino",
                "Cervantes",
                "Suyo",
                "Sigay",
                "Gregorio del Pilar",
                "Salcedo",
                "Galimuyod",
                "City of Candon",
                "Santa Lucia",
                "Santa Cruz",
              ],
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
              parts: ["northern", "central", "mainland"],
              locals: [
                "Gonzaga",
                "Lal-Lo",
                "Gattaran",
                "Baggao",
                "Alcala",
                "Santo Niño",
                "Lasam",
                "Allacapan",
                "Camalaniugan",
                "Buguey",
                "Santa Teresita",
                "Aparri",
                "Ballesteros",
                "Abulug",
                "Pamplona",
                "Sanchez-Mira",
                "Claveria",
                "Santa Praxedes",
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
            {
              name: "Ilocos Norte",
              parts: ["northern", "central"],
              locals: [
                "Carasi",
                "Piddig",
                "Vintar",
                "Bacarra",
                "Pasuquin",
                "Burgos",
                "Bangui",
                "Dumalneg",
                "Pagudpud",
                "Adams",
                "Nueva Era",
                "Solsona",
                "Dingras",
                "Sarrat",
                "Laoag City",
                "San Nicolas",
              ],
            },
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
              parts: ["southeastern"],
              locals: ["Basco", "Mahatao", "Ivana", "Uyugan", "Sabtang"],
            },
            { name: "Babuyan Islands", parts: ["rest"] },
            {
              name: "Cagayan",
              parts: ["northeastern", "mainland"],
              locals: ["Santa Ana"],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
      {
        level: 5,
        regions: {
          luzon: [
            {
              name: "Babuyan Islands",
              parts: ["northeastern"],
              locals: ["Babuyan Island", "Didicas Island"],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
    ],
  },
};

describe("snapshot: TCB#19_nando.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#19_nando.pdf");

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
