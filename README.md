# `pagasa-tcb-parser`

[![npm version](https://img.shields.io/npm/v/@earvinpiamonte/pagasa-tcb-parser.svg)](https://www.npmjs.com/package/@earvinpiamonte/pagasa-tcb-parser)
[![Tests](https://github.com/earvinpiamonte/pagasa-tcb-parser/actions/workflows/tests.yml/badge.svg)](https://github.com/earvinpiamonte/pagasa-tcb-parser/actions/workflows/tests.yml)

A TypeScript library for parsing [PAGASA](https://www.pagasa.dost.gov.ph/) (Philippine Atmospheric, Geophysical and Astronomical Services Administration) tropical cyclone bulletin (TCB) PDF files.

## Installation

```bash
npm i @earvinpiamonte/pagasa-tcb-parser
```

## Usage

### Basic

```javascript
import parseTcbPdf from "@earvinpiamonte/pagasa-tcb-parser";

async function run() {
  const bulletin = await parseTcbPdf("/path/to/TCB#16_emong.pdf");

  console.log(bulletin);
}
run();
```

### Error Handling

#### Using async/ await

```javascript
import parseTcbPdf from "@earvinpiamonte/pagasa-tcb-parser";

const run = async () => {
  try {
    const bulletin = await parseTcbPdf("/path/to/TCB#16_emong.pdf");

    console.log(bulletin);
  } catch (error) {
    console.error("Failed to parse TCB:", error.message);
  }
};

run();
```

#### Using Promises with `.then().catch()`

```javascript
import parseTcbPdf from "@earvinpiamonte/pagasa-tcb-parser";

parseTcbPdf("/path/to/TCB#16_emong.pdf")
  .then((bulletin) => {
    console.log(bulletin);
  })
  .catch((error) => {
    console.error("Failed to parse TCB:", error.message);
  });
```

#### Example fetching and parsing from external source

```javascript
import express from "express";
import parseTcbPdf from "@earvinpiamonte/pagasa-tcb-parser";

const app = express();

app.get("/your/api/get-tcb", async (req, res) => {
  try {
    const response = await fetch(
      "https://pubfiles.pagasa.dost.gov.ph/tamss/weather/bulletin/TCB%2316_emong.pdf"
    );

    const buffer = await response.buffer();

    const bulletin = await parseTcbPdf(buffer);

    res.json(bulletin);
  } catch (error) {
    res.status(500).json({ error: "Failed to parse TCB" });
  }
});
```

> [!NOTE] > `parseTcbPdf` supports both file path (string) and Buffer input.

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
    "signals": {
      "1": {
        "regions": {
          "luzon": [
            {
              "name": "Ilocos Norte",
              "parts": ["rest"]
            },
            {
              "name": "Ilocos Sur",
              "parts": ["northern"],
              "locals": [
                "Gregorio del Pilar",
                "Magsingal",
                "San Esteban",
                "Banayoyo",
                "Burgos",
                "City of Candon",
                "Santiago",
                "San Vicente",
                "Santa Catalina",
                "Lidlidda",
                "Nagbukel",
                "Sinait",
                "Sigay",
                "San Ildefonso",
                "Galimuyod",
                "Quirino",
                "City of Vigan",
                "San Emilio",
                "Cabugao",
                "Caoayan",
                "San Juan",
                "Santa",
                "Bantay",
                "Santo Domingo",
                "Santa Maria",
                "Narvacan",
                "Salcedo",
                "Cervantes"
              ]
            },
            {
              "name": "Abra"
            },
            {
              "name": "Apayao",
              "parts": ["rest"]
            },
            {
              "name": "Kalinga"
            },
            {
              "name": "Mountain Province"
            },
            {
              "name": "Cagayan",
              "parts": ["rest", "mainland"]
            },
            {
              "name": "Isabela",
              "parts": ["northern"],
              "locals": [
                "Quirino",
                "Mallig",
                "Quezon",
                "Delfin Albano",
                "Tumauini",
                "Maconacon",
                "San Pablo",
                "Santa Maria",
                "Cabagan",
                "Santo Tomas",
                "Roxas",
                "San Manuel"
              ]
            }
          ],
          "visayas": [],
          "mindanao": []
        }
      },
      "2": {
        "regions": {
          "luzon": [
            /* ... */
          ],
          "visayas": [],
          "mindanao": []
        }
      }
    }
  }
}
```

</details>

### API

The package exports a single function that can handle both file paths and buffers:

| Function/Method            | Parameters                                                 | Returns               | Description                                                         |
| -------------------------- | ---------------------------------------------------------- | --------------------- | ------------------------------------------------------------------- |
| `parseTcbPdf(input)`       | `input`: `string` or `Buffer`                              | `ParsedTcbPdfPromise` | Parses a PDF from a file path or buffer.                            |
| `.jsonStringified(space?)` | `space?`: `number` or `string` (optional, defaults to `2`) | `Promise<string>`     | A chainable method that returns the parsed result as a JSON string. |

#### Function Signature

```typescript
import { ParsedTcbPdfPromise } from "@earvinpiamonte/pagasa-tcb-parser";

/**
 * Parses a PAGASA TCB PDF from a file path or Buffer.
 * Returns a ParsedTcbPdfPromise: a Promise<BulletinData>.
 */
declare function parseTcbPdf(input: string | Buffer): ParsedTcbPdfPromise;
```

## Development

### TypeScript Support

This package is written in TypeScript and includes type definitions.

> **Note:** The package exports the `ParsedTcbPdfPromise` type for advanced typing, which extends `Promise<BulletinData>` with a `.jsonStringified()` method.

```typescript
import parseTcbPdf, {
  ParsedTcbPdfPromise,
  BulletinData,
  WindSignals,
  Regions,
  Area,
  CycloneInfo,
} from "@earvinpiamonte/pagasa-tcb-parser";

// Option 1: Keep the promise (for chaining .jsonStringified later)
const promise: ParsedTcbPdfPromise = parseTcbPdf("/path/to/file.pdf");
const bulletin: BulletinData = await promise; // resolved value
const jsonResult: string = await promise.jsonStringified();

// Option 2: Direct await (no need to store promise separately)
const bulletin2: BulletinData = await parseTcbPdf("/path/to/another.pdf");

// Access nested structures with exported helper types
const signal1: Regions = bulletin.cyclone.signals["1"];
const area: Area | undefined = signal1.regions.luzon[0];
```

### Testing

This project uses [Jest](https://jestjs.io) for testing.

#### Prerequisites

Make sure you have the dependencies installed:

```bash
cd pagasa-tcb-parser/
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
