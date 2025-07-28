import { PATTERNS } from "../constants/patterns";
import { WindSignals, SignalArea } from "../types/index";
import { extractAreasFromBlock } from "./area-parser";

export function extractSignals(text: string): WindSignals {
  const signals: { [key: string]: SignalArea } = {};
  const tcwsMatch = text.match(PATTERNS.tcws);

  if (!tcwsMatch) {
    return { signals };
  }

  const tcwsSection = tcwsMatch[1];
  const signalBlocks = extractSignalBlocks(tcwsSection);

  for (const block of signalBlocks) {
    const signalNumber = extractSignalNumber(block);
    if (signalNumber) {
      const areas = extractAreasFromBlock(block);
      signals[signalNumber] = {
        areas: {
          Luzon: areas.Luzon,
          Visayas: areas.Visayas,
          Mindanao: areas.Mindanao,
        },
      };
    }
  }

  return { signals };
}

export function extractSignalBlocks(tcwsSection: string): string[] {
  const blocks: string[] = [];
  const lines = tcwsSection.split("\n");
  let currentBlock = "";
  let inSignalBlock = false;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (
      PATTERNS.signalNumber.test(trimmedLine) ||
      trimmedLine.includes("TCWS No.")
    ) {
      if (currentBlock && inSignalBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = line + "\n";
      inSignalBlock = true;
    } else if (inSignalBlock) {
      currentBlock += line + "\n";

      if (
        trimmedLine.includes("OTHER HAZARDS") ||
        trimmedLine.includes("HAZARDS AFFECTING")
      ) {
        break;
      }
    }
  }

  if (currentBlock && inSignalBlock) {
    blocks.push(currentBlock);
  }

  return blocks.filter((block) => block.trim().length > 0);
}

export function extractSignalNumber(block: string): string | null {
  const numberMatch = block.match(PATTERNS.signalMatch);
  if (numberMatch) return numberMatch[1];

  const tcwsMatch = block.match(PATTERNS.tcwsNumber);
  return tcwsMatch ? tcwsMatch[1] : null;
}
