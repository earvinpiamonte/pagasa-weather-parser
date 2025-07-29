import { parsePDF, parseBuffer } from "./parsers/pdf-parser";
import { WindSignals, Regions, Area } from "./types/index";

export interface ParsedTCBPromise extends Promise<WindSignals> {
  jsonStringified(space?: number | string): Promise<string>;
}

function parseTCB(filePath: string): ParsedTCBPromise;

function parseTCB(buffer: Buffer): ParsedTCBPromise;

function parseTCB(input: string | Buffer): ParsedTCBPromise {
  if (typeof input !== "string" && !Buffer.isBuffer(input)) {
    throw new Error("Invalid input: expected string (file path) or Buffer");
  }

  const parsingPromise =
    typeof input === "string" ? parsePDF(input) : parseBuffer(input);

  const result = parsingPromise as ParsedTCBPromise;

  result.jsonStringified = async (space: number | string = 2) => {
    const data = await parsingPromise;

    return JSON.stringify(data, null, space);
  };

  return result;
}

export default parseTCB;

export { WindSignals, Regions, Area };
