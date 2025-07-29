import { z } from "zod";
import { parsePDF } from "../src/parsers/pdf-parser";
import { join } from "path";
import { readdirSync } from "fs";

const AreaSchema = z.object({
  name: z.string(),
  parts: z.array(z.string()).optional(),
  locals: z.array(z.string()).optional(),
});

const WindSignalSchema = z.object({
  signals: z.record(
    z.string(),
    z.object({
      regions: z.object({
        Luzon: z.array(AreaSchema),
        Visayas: z.array(AreaSchema),
        Mindanao: z.array(AreaSchema),
      }),
    }),
  ),
});

describe("pdf-parser", () => {
  const pdfDirectory = join(__dirname, "data");
  const pdfFiles = readdirSync(pdfDirectory).filter((file) =>
    file.endsWith(".pdf"),
  );

  pdfFiles.forEach((file) => {
    it(`should parse ${file} and return a valid WindSignals object`, async () => {
      const filePath = join(pdfDirectory, file);
      const result = await parsePDF(filePath);

      console.log(JSON.stringify(result, null, 2));

      const validation = WindSignalSchema.safeParse(result);

      expect(validation.success).toBe(true);
    });
  });
});
