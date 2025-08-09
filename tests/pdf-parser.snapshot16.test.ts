import { join } from "path";
import parseTcbPdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 16",
  subtitle: "Tropical Storm EMONG (CO-MAY)",
  description:
    "EMONG WEAKENS INTO A TROPICAL STORM AND IS NOW PASSING CLOSE TO THE BABUYAN ISLANDS",
  dateIssued: "July 25, 2025 2:00 PM",
  dateIssuedISO: "2025-07-25T06:00:00.000Z",
  dateValidUntil: "July 25, 2025 5:00 PM",
  dateValidUntilISO: "2025-07-25T09:00:00.000Z",
  cyclone: {
    name: "EMONG",
    internationalName: "CO-MAY",
    signals: {
      "1": {
        regions: {
          luzon: [
            { name: "Ilocos Norte", parts: ["rest"] },
            {
              name: "Ilocos Sur",
              parts: ["northern"],
              locals: [
                "Gregorio del Pilar",
                "Magsingal",
                "San Esteban",
                "Banayoyo",
                "Burgos",
                "City of Candon",
                "Santiago",
                "San Vicente",
                "Santa Catalina",
                "Lidlidda",
                "Nagbukel",
                "Sinait",
                "Sigay",
                "San Ildefonso",
                "Galimuyod",
                "Quirino",
                "City of Vigan",
                "San Emilio",
                "Cabugao",
                "Caoayan",
                "San Juan",
                "Santa",
                "Bantay",
                "Santo Domingo",
                "Santa Maria",
                "Narvacan",
                "Salcedo",
                "Cervantes",
              ],
            },
            { name: "Abra" },
            { name: "Apayao", parts: ["rest"] },
            { name: "Kalinga" },
            { name: "Mountain Province" },
            { name: "Cagayan", parts: ["rest", "mainland"] },
            {
              name: "Isabela",
              parts: ["northern"],
              locals: [
                "Quirino",
                "Mallig",
                "Quezon",
                "Delfin Albano",
                "Tumauini",
                "Maconacon",
                "San Pablo",
                "Santa Maria",
                "Cabagan",
                "Santo Tomas",
                "Roxas",
                "San Manuel",
              ],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
      "2": {
        regions: {
          luzon: [
            {
              name: "Ilocos Norte",
              parts: ["northern"],
              locals: ["Dumalneg", "Pagudpud", "Adams", "Burgos", "Bangui"],
            },
            {
              name: "Apayao",
              parts: ["northern"],
              locals: ["Calanasan", "Luna", "Santa Marcela"],
            },
            { name: "Batanes" },
            { name: "Babuyan Islands" },
            {
              name: "Cagayan",
              parts: ["northwestern", "mainland"],
              locals: [
                "Camalaniugan",
                "Buguey",
                "Aparri",
                "Allacapan",
                "Ballesteros",
                "Abulug",
                "Pamplona",
                "Claveria",
                "Sanchez-Mira",
                "Santa Praxedes",
              ],
            },
          ],
          visayas: [],
          mindanao: [],
        },
      },
    },
  },
};

describe("snapshot: TCB#16_emong.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#16_emong.pdf");

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
