import pdf from "pdf-parse";
import { WindSignals } from "../types/index";
import { extractSignals } from "./signal-parser";

export const parsePdfFromBuffer = async (
  buffer: Buffer,
): Promise<WindSignals> => {
  try {
    const data = await pdf(buffer);

    return extractSignals(data.text);
  } catch (error) {
    throw new Error(
      `Failed to parse PDF buffer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
