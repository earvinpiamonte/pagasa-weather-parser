import * as fs from "fs";
import pdf from "pdf-parse";
import { WindSignals } from "../types/index";
import { extractSignals } from "./signal-extractor";

export async function parsePDF(filePath: string): Promise<WindSignals> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return extractSignals(data.text);
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function parseBuffer(buffer: Buffer): Promise<WindSignals> {
  try {
    const data = await pdf(buffer);
    return extractSignals(data.text);
  } catch (error) {
    throw new Error(
      `Failed to parse PDF buffer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
