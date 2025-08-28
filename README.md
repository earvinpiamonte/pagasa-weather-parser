# `pagasa-weather-parser`

[![npm version](https://img.shields.io/npm/v/@earvinpiamonte/pagasa-weather-parser.svg)](https://www.npmjs.com/package/@earvinpiamonte/pagasa-weather-parser)
[![Tests](https://github.com/earvinpiamonte/pagasa-weather-parser/actions/workflows/tests.yml/badge.svg)](https://github.com/earvinpiamonte/pagasa-weather-parser/actions/workflows/tests.yml)

A TypeScript library for parsing [PAGASA](https://www.pagasa.dost.gov.ph/) (Philippine Atmospheric, Geophysical and Astronomical Services Administration) tropical cyclone bulletin (TCB), tropical cyclone advisory (TCA), and weather advisory PDF files.

## Installation

```bash
npm i @earvinpiamonte/pagasa-weather-parser
```

## Usage

### Basic

```javascript
import parseWeatherPdf from "@earvinpiamonte/pagasa-weather-parser";

async function run() {
  const bulletin = await parseWeatherPdf("/path/to/TCB#16_emong.pdf");

  console.log(bulletin);
}
run();
```

### Error Handling

#### Using async/ await

```javascript
import parseWeatherPdf from "@earvinpiamonte/pagasa-weather-parser";

const run = async () => {
  try {
    const bulletin = await parseWeatherPdf("/path/to/TCB#16_emong.pdf");

    console.log(bulletin);
  } catch (error) {
    console.error("Failed to parse PDF:", error.message);
  }
};

run();
```

#### Using Promises with `.then().catch()`

```javascript
import parseWeatherPdf from "@earvinpiamonte/pagasa-weather-parser";

parseWeatherPdf("/path/to/TCB#16_emong.pdf")
  .then((bulletin) => {
    console.log(bulletin);
  })
  .catch((error) => {
    console.error("Failed to parse PDF:", error.message);
  });
```

#### Example fetching and parsing from external source

```javascript
import express from "express";
import parseWeatherPdf from "@earvinpiamonte/pagasa-weather-parser";

const app = express();

app.get("/your/api/get-tcb", async (req, res) => {
  try {
    const response = await fetch(
      "https://pubfiles.pagasa.dost.gov.ph/tamss/weather/bulletin/TCB%2316_emong.pdf"
    );

    const buffer = await response.buffer();

    const bulletin = await parseWeatherPdf(buffer);

    res.json(bulletin);
  } catch (error) {
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});
```

> [!NOTE] > `parseWeatherPdf` supports both file path (string) and Buffer input.

### Example output

The parser returns a structured JavaScript object:

<details>
<summary>Toggle example code</summary>

```json
{
  "title": "TROPICAL CYCLONE BULLETIN NR. 16",
  "subtitle": "Tropical Storm EMONG (CO-MAY)",
  "description": "EMONG WEAKENS INTO A TROPICAL STORM AND IS NOW PASSING CLOSE TO THE BABUYAN ISLANDS",
  "dateIssued": "July 25, 2025 2:00 PM",
  "dateIssuedISO": "2025-07-25T06:00:00.000Z",
  "dateValidUntil": "July 25, 2025 5:00 PM",
  "dateValidUntilISO": "2025-07-25T09:00:00.000Z",
  "cyclone": {
    "name": "EMONG",
    "internationalName": "CO-MAY",
    "signals": [
      {
        "level": 1,
        "regions": {
          "luzon": [
            { "name": "Ilocos Norte", "parts": ["rest"] },
            {
              "name": "Ilocos Sur",
              "parts": ["northern"],
              "locals": ["Gregorio del Pilar", "Magsingal" /* ... */]
            },
            { "name": "Abra" },
            { "name": "Apayao", "parts": ["rest"] },
            { "name": "Kalinga" },
            { "name": "Mountain Province" },
            { "name": "Cagayan", "parts": ["rest", "mainland"] },
            {
              "name": "Isabela",
              "parts": ["northern"],
              "locals": ["Quirino", "Mallig" /* ... */]
            }
          ],
          "visayas": [],
          "mindanao": []
        }
      },
      {
        "level": 2,
        "regions": {
          "luzon": [
            /* ... */
          ],
          "visayas": [],
          "mindanao": []
        }
      }
    ]
  }
}
```

</details>

### API

The package exports a single function that can handle both file paths and buffers:

| Function/Method            | Parameters                                                 | Returns               | Description                                                         |
| -------------------------- | ---------------------------------------------------------- | --------------------- | ------------------------------------------------------------------- |
| `parseWeatherPdf(input)`       | `input`: `string` or `Buffer`                              | `ParsedWeatherPdfPromise` | Parses a PDF from a file path or buffer.                            |
| `.jsonStringified(space?)` | `space?`: `number` or `string` (optional, defaults to `2`) | `Promise<string>`     | A chainable method that returns the parsed result as a JSON string. |

#### Function Signature

```typescript
import { ParsedWeatherPdfPromise } from "@earvinpiamonte/pagasa-weather-parser";

/**
 * Parses a PAGASA Weather PDF from a file path or Buffer.
 * Returns a ParsedWeatherPdfPromise: a Promise<BulletinData>.
 */
declare function parseWeatherPdf(input: string | Buffer): ParsedWeatherPdfPromise;
```

## Development

### TypeScript Support

This package is written in TypeScript and includes type definitions.

> **Note:** The package exports the `ParsedWeatherPdfPromise` type for advanced typing, which extends `Promise<BulletinData>` with a `.jsonStringified()` method.

```typescript
import parseWeatherPdf, {
  ParsedWeatherPdfPromise,
  BulletinData,
  Regions,
  Area,
  CycloneInfo,
} from "@earvinpiamonte/pagasa-weather-parser";

// Option 1: Keep the promise (for chaining .jsonStringified later)
const promise: ParsedWeatherPdfPromise = parseWeatherPdf("/path/to/file.pdf");
const bulletin: BulletinData = await promise; // resolved value
const jsonResult: string = await promise.jsonStringified();

// Option 2: Direct await (no need to store promise separately)
const bulletin2: BulletinData = await parseWeatherPdf("/path/to/another.pdf");

// Access signal data (array)
const signalNumberOne = bulletin.cyclone.signals[0]?.level; // number | undefined
const firstLuzonArea: Area | undefined =
  bulletin.cyclone.signals[0]?.regions.luzon[0];

// Find a specific signal level
const signalNumberTwo = bulletin.cyclone.signals.find(
  (signal) => signal.level === 2
);

// Length check
if (bulletin.cyclone.signals.length === 0) {
  // no active signals
}
```

### Testing

This project uses [Jest](https://jestjs.io) for testing.

#### Prerequisites

Make sure you have the dependencies installed:

```bash
cd pagasa-weather-parser/
```

```bash
npm i
```

#### Running Tests

```bash
npm test
```

#### Test Structure

The tests are located in the `tests/` directory and include the ff:

- **Unit Tests**: `tests/pdf-parser.test.ts` - Tests the core PDF parsing functionality
- **Test Data**: `tests/data/` - Contains sample PAGASA TCB PDF files for testing

#### Test Data

The test suite includes several sample PAGASA TCB PDF files:

- `TCB#15_emong.pdf`
- `TCB#16_emong.pdf`
- `TCB#17_emong.pdf`
- `TCB#18_emong.pdf`

### Supported Formats

Currently, PAGASA Tropical Cyclone Bulletin PDF files that contain TCWS (Tropical Cyclone Wind Signals) information are supported by this package.

## Maintainer

Designed and developed by [Noel Earvin Piamonte](https://earv.in)
