import { parsePDF, parseBuffer } from "./parsers/pdf-parser";
import { WindSignals, Regions, Area } from "./types/index";

const tcbParser = {
  parsePDF: async (filePath: string): Promise<WindSignals> =>
    parsePDF(filePath),

  parseBuffer: async (buffer: Buffer): Promise<WindSignals> =>
    parseBuffer(buffer),
};

export default tcbParser;

export { WindSignals, Regions, Area };
