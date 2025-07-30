import pdf from "pdf-parse";
import { WindSignals } from "../types/index";
import { extractSignals } from "./signal-parser";

export const parsePdfFromBuffer = async (
  buffer: Buffer,
): Promise<WindSignals> => {
  const data = await pdf(buffer);

  return extractSignals(data.text);
};
