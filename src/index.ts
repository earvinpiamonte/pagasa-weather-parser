import { parsePDF, parseBuffer } from "./parsers/pdf-parser";
import { WindSignals, Regions, Area } from "./types/index";

const tcbParser = {
  async parsePDF(filePath: string): Promise<WindSignals> {
    return parsePDF(filePath);
  },

  async parseBuffer(buffer: Buffer): Promise<WindSignals> {
    return parseBuffer(buffer);
  },
};

export default tcbParser;

export { WindSignals, Regions, Area };
