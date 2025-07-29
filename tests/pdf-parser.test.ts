import { readFileSync, readdirSync } from "fs";
import { z } from "zod";
import { join } from "path";
import parseTCB from "../src/index";

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

describe("parseTCB", () => {
  const pdfDirectory = join(__dirname, "data");
  const pdfFiles = readdirSync(pdfDirectory).filter((file) =>
    file.endsWith(".pdf"),
  );

  describe("file path input", () => {
    pdfFiles.forEach((file) => {
      it(`should parse ${file} from file path and return a valid WindSignals object`, async () => {
        const filePath = join(pdfDirectory, file);
        const result = await parseTCB(filePath);
        const validation = WindSignalSchema.safeParse(result);

        expect(validation.success).toBe(true);
      });
    });
  });

  describe("buffer input", () => {
    pdfFiles.forEach((file) => {
      it(`should parse ${file} from buffer and return a valid WindSignals object`, async () => {
        const filePath = join(pdfDirectory, file);
        const buffer = readFileSync(filePath);
        const result = await parseTCB(buffer);
        const validation = WindSignalSchema.safeParse(result);

        expect(validation.success).toBe(true);
      });
    });
  });

  describe("error handling", () => {
    it("should throw an error for invalid input type", () => {
      expect(() => parseTCB(123 as any)).toThrow(
        "Invalid input: expected string (file path) or Buffer",
      );
    });

    it("should throw an error for non-existent file", async () => {
      await expect(parseTCB("/non/existent/file.pdf")).rejects.toThrow(
        "Failed to parse PDF",
      );
    });

    it("should throw an error for invalid buffer", async () => {
      const invalidBuffer = Buffer.from("not a pdf");
      await expect(parseTCB(invalidBuffer)).rejects.toThrow(
        "Failed to parse PDF buffer",
      );
    });
  });
});
