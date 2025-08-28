import { readFileSync, readdirSync } from "fs";
import { z } from "zod";
import { join } from "path";
import parseWeatherPdf from "../src/index";

const nullableString = z.string().nullable();

const AreaSchema = z.object({
  name: z.string(),
  parts: z.array(z.string()).optional(),
  locals: z.array(z.string()).optional(),
});

const CycloneSignalSchema = z.object({
  level: z.number(),
  regions: z.object({
    luzon: z.array(AreaSchema),
    visayas: z.array(AreaSchema),
    mindanao: z.array(AreaSchema),
  }),
});

const BulletinSchema = z.object({
  title: nullableString,
  subtitle: nullableString,
  description: nullableString,
  dateIssued: nullableString,
  dateIssuedISO: nullableString,
  dateValidUntil: nullableString,
  dateValidUntilISO: nullableString,
  cyclone: z.object({
    name: nullableString,
    internationalName: nullableString,
    signals: z.array(CycloneSignalSchema),
  }),
});

describe("parseWeatherPdf", () => {
  const pdfDirectory = join(__dirname, "data");
  const pdfFiles = readdirSync(pdfDirectory).filter((file) =>
    file.endsWith(".pdf"),
  );

  pdfFiles.forEach((file) => {
    describe(`for file: ${file}`, () => {
      const testFilePath = join(pdfDirectory, file);

      describe("standard parsing (without chaining)", () => {
        it("should parse from a file path and return a valid WindSignals object", async () => {
          const result = await parseWeatherPdf(testFilePath);

          const validation = BulletinSchema.safeParse(result);

          expect(validation.success).toBe(true);
        });

        it("should parse from a buffer and return a valid WindSignals object", async () => {
          const buffer = readFileSync(testFilePath);

          const result = await parseWeatherPdf(buffer);

          const validation = BulletinSchema.safeParse(result);

          expect(validation.success).toBe(true);
        });
      });

      describe("chaining with .jsonStringified()", () => {
        it("should parse from a file path and return a valid JSON string", async () => {
          const jsonOutput =
            await parseWeatherPdf(testFilePath).jsonStringified();

          expect(typeof jsonOutput).toBe("string");

          expect(() => {
            const parsed = JSON.parse(jsonOutput);

            const validation = BulletinSchema.safeParse(parsed);

            expect(validation.success).toBe(true);
          }).not.toThrow();
        });

        it("should parse from a buffer and return a valid JSON string", async () => {
          const buffer = readFileSync(testFilePath);

          const jsonOutput = await parseWeatherPdf(buffer).jsonStringified();

          expect(typeof jsonOutput).toBe("string");

          expect(() => {
            const parsed = JSON.parse(jsonOutput);

            const validation = BulletinSchema.safeParse(parsed);

            expect(validation.success).toBe(true);
          }).not.toThrow();
        });

        it("should allow custom spacing for the JSON output", async () => {
          const jsonOutput =
            await parseWeatherPdf(testFilePath).jsonStringified(4);

          const lines = jsonOutput.split("\n");

          expect(() => JSON.parse(jsonOutput)).not.toThrow();

          expect(lines.length).toBeGreaterThan(1);

          expect(lines[1].match(/^\s+/)?.[0]?.length).toBe(4);
        });
      });
    });
  });

  describe("error handling", () => {
    it("should throw a synchronous error for invalid input type", () => {
      expect(() => parseWeatherPdf(123 as any)).toThrow(
        "Invalid input: expected string (file path) or Buffer",
      );
    });

    it("should reject for a non-existent file", async () => {
      await expect(parseWeatherPdf("/non/existent/file.pdf")).rejects.toThrow(
        "ENOENT: no such file or directory, open '/non/existent/file.pdf'",
      );
    });
    it("should reject for an invalid buffer", async () => {
      const invalidBuffer = Buffer.from("not a pdf");

      await expect(parseWeatherPdf(invalidBuffer)).rejects.toThrow(
        "Invalid PDF structure",
      );
    });

    it("should reject the .jsonStringified() chain if the core promise fails", async () => {
      await expect(
        parseWeatherPdf("/non/existent/file.pdf").jsonStringified(),
      ).rejects.toThrow(
        "ENOENT: no such file or directory, open '/non/existent/file.pdf'",
      );
    });
  });
});
