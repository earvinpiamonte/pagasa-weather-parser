import { readFileSync } from "fs";
import pdf from "pdf-parse";
import { WindSignals } from "../types/index";
import { extractSignals } from "./signal-parser";

export const parsePDF = async (filePath: string): Promise<WindSignals> => {
  try {
    const dataBuffer = readFileSync(filePath);
    const data = await pdf(dataBuffer);

    return extractSignals(data.text);
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

export const parseBuffer = async (buffer: Buffer): Promise<WindSignals> => {
  try {
    const data = await pdf(buffer);

    return extractSignals(data.text);
  } catch (error) {
    throw new Error(
      `Failed to parse PDF buffer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
