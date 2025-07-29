import { parsePDF, parseBuffer } from "./parsers/pdf-parser";
import { WindSignals, Regions, Area } from "./types/index";

// Function overloads for type safety
function parseTCB(filePath: string): Promise<WindSignals>;
function parseTCB(buffer: Buffer): Promise<WindSignals>;

// Implementation
function parseTCB(input: string | Buffer): Promise<WindSignals> {
  if (typeof input === "string") {
    return parsePDF(input);
  } else if (Buffer.isBuffer(input)) {
    return parseBuffer(input);
  } else {
    throw new Error("Invalid input: expected string (file path) or Buffer");
  }
}

export default parseTCB;

export { WindSignals, Regions, Area };
