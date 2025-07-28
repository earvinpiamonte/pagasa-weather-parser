import { parsePDF, parseBuffer } from "./parsers/pdf-parser";
import { ParsedSignals, SignalArea, AreaDetail } from "./types/index";

// Main export object that matches the required import pattern
const storms = {
  get signals() {
    return {};
  },

  async parsePDF(filePath: string): Promise<ParsedSignals> {
    return parsePDF(filePath);
  },

  async parseBuffer(buffer: Buffer): Promise<ParsedSignals> {
    return parseBuffer(buffer);
  },
};

export default storms;

export { ParsedSignals, SignalArea, AreaDetail };
