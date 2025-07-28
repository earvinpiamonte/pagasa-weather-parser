import { PATTERNS } from "../constants/patterns";
import { WindSignals, Regions } from "../types/index";
import { extractRegionsFromBlock } from "./area-parser";

export const extractSignals = (text: string): WindSignals => {
  const signals: { [key: string]: Regions } = {};
  const tcwsMatch = text.match(PATTERNS.tcws);

  if (!tcwsMatch) {
    return { signals };
  }

  const tcwsSection = tcwsMatch[1];
  const signalBlocks = extractSignalBlocks(tcwsSection);

  for (const block of signalBlocks) {
    const signalNumber = extractSignalNumber(block);
    if (signalNumber) {
      const regions = extractRegionsFromBlock(block);
      signals[signalNumber] = {
        regions: {
          Luzon: regions.Luzon,
          Visayas: regions.Visayas,
          Mindanao: regions.Mindanao,
        },
      };
    }
  }

  return { signals };
};

export const extractSignalBlocks = (tcwsSection: string): string[] => {
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
};

export const extractSignalNumber = (block: string): string | null => {
  const numberMatch = block.match(PATTERNS.signalMatch);
  if (numberMatch) return numberMatch[1];

  const tcwsMatch = block.match(PATTERNS.tcwsNumber);
  return tcwsMatch ? tcwsMatch[1] : null;
};
