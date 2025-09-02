import { join } from "path";
import parseTropicalCyclonePdf from "../src/index";

const expected = {
  title: "TROPICAL CYCLONE ADVISORY NR. 5",
  subtitle: "Severe Tropical Storm PODUL",
  description:
    "SEVERE TROPICAL STORM “PODUL” CONTINUES TO ACCELERATE WHILE MAINTAINING ITS STRENGTH.",
  dateIssued: "August 10, 2025 11:00 AM",
  dateIssuedISO: "2025-08-10T03:00:00.000Z",
  dateValidUntil: "August 10, 2025 11:00 PM",
  dateValidUntilISO: "2025-08-10T15:00:00.000Z",
  cyclone: {
    name: null,
    internationalName: null,
    signals: [],
  },
};

describe("snapshot: tcadvisory.pdf", () => {
  it("matches the expected parsed structure exactly", async () => {
    const filePath = join(__dirname, "data", "tcadvisory.pdf");

    const result = await parseTropicalCyclonePdf(filePath);

    expect(result).toStrictEqual(expected);
  });
});
