import { promises as fs } from "fs";
import { parsePdfFromBuffer } from "./parsers/pdf-parser";
import { WindSignals, Regions, Area } from "./types/index";

export interface ParsedTcbPdfPromise extends Promise<WindSignals> {
  jsonStringified(space?: number | string): Promise<string>;
}

const parseTcbPdf = (input: string | Buffer): ParsedTcbPdfPromise => {
  if (typeof input !== "string" && !Buffer.isBuffer(input)) {
    throw new Error("Invalid input: expected string (file path) or Buffer");
  }

  const corePromise = (async (): Promise<WindSignals> => {
    const buffer = typeof input === "string" ? await fs.readFile(input) : input;

    return await parsePdfFromBuffer(buffer);
  })();

  const result = corePromise as ParsedTcbPdfPromise;

  result.jsonStringified = async (space: number | string = 2) => {
    const data = await corePromise;

    return JSON.stringify(data, null, space);
  };

  return result;
};

export { parseTcbPdf };

export default parseTcbPdf;

export { WindSignals, Regions, Area };

module.exports = parseTcbPdf;
module.exports.parseTcbPdf = parseTcbPdf;
module.exports.default = parseTcbPdf;
