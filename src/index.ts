import { promises as fs } from "fs";
import { Buffer } from "buffer";
import { parsePdfFromBuffer } from "./parsers/pdf-parser";
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

  const corePromise = new Promise<WindSignals>(async (resolve, reject) => {
    try {
      const buffer =
        typeof input === "string" ? await fs.readFile(input) : input;
      const result = await parsePdfFromBuffer(buffer);

      resolve(result);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);

      reject(new Error(`Failed to parse PDF from buffer. Reason: ${reason}`));
    }
  });

  const result = corePromise as ParsedTCBPromise;

  result.jsonStringified = async (space: number | string = 2) => {
    const data = await corePromise;

    return JSON.stringify(data, null, space);
  };

  return result;
}

export default parseTCB;

export { WindSignals, Regions, Area };
