import { promises as fs } from "fs";
import { parsePdfFromBuffer } from "./parsers/pdf-parser";
import { Regions, Area, BulletinData, CycloneInfo } from "./types/index";

export interface ParsedWeatherPdfPromise extends Promise<BulletinData> {
  jsonStringified(space?: number | string): Promise<string>;
}

const parseWeatherPdf = (input: string | Buffer): ParsedWeatherPdfPromise => {
  if (typeof input !== "string" && !Buffer.isBuffer(input)) {
    throw new Error("Invalid input: expected string (file path) or Buffer");
  }

  const corePromise = (async (): Promise<BulletinData> => {
    const buffer = typeof input === "string" ? await fs.readFile(input) : input;

    return await parsePdfFromBuffer(buffer);
  })();

  const result = corePromise as ParsedWeatherPdfPromise;

  result.jsonStringified = async (space: number | string = 2) => {
    const data = await corePromise;

    return JSON.stringify(data, null, space);
  };

  return result;
};

export { parseWeatherPdf };

export default parseWeatherPdf;

export { Regions, Area, BulletinData, CycloneInfo };

module.exports = parseWeatherPdf;
module.exports.parseWeatherPdf = parseWeatherPdf;
module.exports.default = parseWeatherPdf;
