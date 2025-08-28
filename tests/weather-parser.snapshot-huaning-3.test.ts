import { join } from "path";
import parseWeatherPdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE BULLETIN NR. 3",
  subtitle: "Tropical Depression HUANING",
  description:
    "TROPICAL DEPRESSION MAINTAINS ITS STRENGTH WHILE MOVING SLOWLY.",
  dateIssued: "August 18, 2025 5:00 PM",
  dateIssuedISO: "2025-08-18T09:00:00.000Z",
  dateValidUntil: "August 18, 2025 11:00 PM",
  dateValidUntilISO: "2025-08-18T15:00:00.000Z",
  cyclone: {
    name: "HUANING",
    internationalName: null,
    signals: [],
  },
};

describe("snapshot: TCB#3_huaning.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "TCB#3_huaning.pdf");

    const result = await parseWeatherPdf(filePath);

    expect(result).toStrictEqual(expected);
  });
});
