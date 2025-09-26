import { join } from "path";
import parseTropicalCyclonePdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 18",
  subtitle: "Typhoon NANDO (RAGASA)",
  description:
    "SUPER TYPHOON NANDO FURTHER INTENSIFIES AS IT CONTINUES TO MOVE WEST NORTHWESTWARD.",
  dateIssued: "September 21, 2025 11:00 PM",
  dateIssuedISO: "2025-09-21T15:00:00.000Z",
  dateValidUntil: "September 22, 2025 2:00 AM",
  dateValidUntilISO: "2025-09-21T18:00:00.000Z",
  cyclone: {
    name: "NANDO",
    internationalName: "RAGASA",
    signals: [
      {
        level: 1,
        regions: {
          luzon: [
            { name: "Isabela", parts: ["rest"] },
            { name: "Quirino" },
            { name: "Nueva Vizcaya" },
            { name: "Mountain Province", parts: ["rest"] },
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
            {
              name: "Isabela",
              parts: ["northern", "central"],
              locals: [
                "San Mariano",
                "Ilagan City",
                "Tumauini",
                "Cabagan",
                "Palanan",
                "Divilacan",
                "Maconacon",
                "San Pablo",
                "Santa Maria",
                "Santo Tomas",
                "Delfin Albano",
                "Quezon",
                "Quirino",
                "Mallig",
                "Gamu",
                "Burgos",
                "Dinapigue",
                "Roxas",
                "San Manuel",
                "San Mateo",
                "Aurora",
                "Cabatuan",
                "Luna",
                "Reina Mercedes",
                "Naguilian",
                "Benito Soliven",
                "City of Cauayan",
                "Alicia",
                "Angadanan",
                "San Guillermo",
              ],
            },
            { name: "Apayao", parts: ["rest"] },
            { name: "Abra" },
            { name: "Kalinga" },
            {
              name: "Mountain Province",
              parts: ["eastern", "central"],
              locals: [
                "Paracelis",
                "Natonin",
                "Barlig",
                "Sadanga",
                "Bontoc",
                "Besao",
                "Sagada",
              ],
            },
            {
              name: "Ifugao",
              parts: ["eastern"],
              locals: ["Alfonso Lista", "Aguinaldo"],
            },
            { name: "Ilocos Norte", parts: ["rest"] },
            {
              name: "Ilocos Sur",
              parts: ["northern"],
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
            { name: "Batanes" },
            { name: "Babuyan Islands" },
            {
              name: "Cagayan",
              parts: ["northern", "central"],
              locals: [
                "Santa Ana",
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
              parts: ["northern"],
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

describe("snapshot: TCB#18_nando.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#18_nando.pdf");

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
