# `pagasa-tcb-parser`

A TypeScript library for parsing [PAGASA](https://www.pagasa.dost.gov.ph/) (Philippine Atmospheric, Geophysical and Astronomical Services Administration) tropical cyclone bulletin (TCB) PDF files.

## Installation

```bash
npm i @earvinpiamonte/pagasa-tcb-parser
```

## Usage

### Basic Usage

File path example:

```javascript
import parseTCB from "@earvinpiamonte/pagasa-tcb-parser"

const result = await parseTCB('/path/to/TCB#16_emong.pdf');

console.log(result.signals);

// Get formatted JSON string output
const jsonOutput = JSON.stringify(result, null, 2);

console.log(jsonOutput);
```

Chaining `.jsonStringified()` example:

```javascript
import parseTCB from "@earvinpiamonte/pagasa-tcb-parser"

const jsonOutput = await parseTCB('/path/to/TCB#16_emong.pdf').jsonStringified();
const customSpacingJson = await parseTCB('/path/to/TCB#16_emong.pdf').jsonStringified(4); // with custom space

console.log(jsonOutput);
```

Buffer example:

```javascript
import { readFileSync } from "fs"
import parseTCB from "@earvinpiamonte/pagasa-tcb-parser"

const buffer = readFileSync('/path/to/TCB#16_emong.pdf');
const result = await parseTCB(buffer);

console.log(result.signals);
```

### Example output

The parser returns a structured JSON object with the following stringified example output:

<details>
<summary>Click to expand JSON output</summary>

```json
{
  "signals": {
    "1": {
      "regions": {
        "Luzon": [
          {
            "name": "Ilocos Norte",
            "parts": [
              "rest"
            ]
          },
          {
            "name": "Ilocos Sur",
            "parts": [
              "northern"
            ],
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
            "parts": [
              "rest"
            ]
          },
          {
            "name": "Kalinga"
          },
          {
            "name": "Mountain Province"
          },
          {
            "name": "Cagayan",
            "parts": [
              "rest",
              "mainland"
            ]
          },
          {
            "name": "Isabela",
            "parts": [
              "northern"
            ],
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
        "Visayas": [],
        "Mindanao": []
      }
    },
    "2": {
      "regions": {
        "Luzon": [
          {
            "name": "Ilocos Norte",
            "parts": [
              "northern"
            ],
            "locals": [
              "Dumalneg",
              "Pagudpud",
              "Adams",
              "Burgos",
              "Bangui"
            ]
          },
          {
            "name": "Apayao",
            "parts": [
              "northern"
            ],
            "locals": [
              "Calanasan",
              "Luna",
              "Santa Marcela"
            ]
          },
          {
            "name": "Batanes"
          },
          {
            "name": "Babuyan Islands"
          },
          {
            "name": "Cagayan",
            "parts": [
              "northwestern",
              "mainland"
            ],
            "locals": [
              "Camalaniugan",
              "Buguey",
              "Aparri",
              "Allacapan",
              "Ballesteros",
              "Abulug",
              "Pamplona",
              "Claveria",
              "Sanchez-Mira",
              "Santa Praxedes"
            ]
          }
        ],
        "Visayas": [],
        "Mindanao": []
      }
    }
  }
}
```

</details>

## API

The package exports a single function that can handle both file paths and buffers:

| Function/Method | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `parseTCB(input)` | `input`: `string` or `Buffer` | `ParsedTCBPromise` | Parses a PDF from a file path or buffer. The returned promise is augmented with a `.jsonStringified()` method. |
| `.jsonStringified(space?)` | `space?`: `number` or `string` (optional, defaults to `2`) | `Promise<string>` | A chainable method that returns the parsed result as a JSON string. |

### Function Overloads

```typescript
import { ParsedTCBPromise } from "@earvinpiamonte/pagasa-tcb-parser";

function parseTCB(filePath: string): ParsedTCBPromise;
function parseTCB(buffer: Buffer): ParsedTCBPromise;
```

## TypeScript Support

This package is written in TypeScript and includes type definitions.

```typescript
import { readFileSync } from "fs";
import parseTCB, { WindSignals, Regions, Area } from "@earvinpiamonte/pagasa-tcb-parser";

// Basic
const result: WindSignals = await parseTCB('/path/to/file.pdf');

// With JSON stringified
const jsonResult: string = await parseTCB('/path/to/file.pdf').jsonStringified();

// From buffer
const buffer = readFileSync('/path/to/file.pdf');
const bufferResult: WindSignals = await parseTCB(buffer);

// You can also type individual parts:
const signal1: Regions = result.signals['1'];
const area: Area = signal1.regions.Luzon[0];
```

## Testing

This project uses [Jest](https://jestjs.io) for testing. The test suite validates that the parser correctly extracts wind signal data from PAGASA TCB PDF files and returns properly structured objects.

### Prerequisites

Make sure you have the development dependencies installed:

```bash
cd pagasa-tcb-parser/
```

```bash
npm i
```

### Running Tests

Run all tests:

```bash
npm test
```

### Test Structure

The tests are located in the `tests/` directory and include the ff:

- **Unit Tests**: `tests/pdf-parser.test.ts` - Tests the core PDF parsing functionality
- **Test Data**: `tests/data/` - Contains sample PAGASA TCB PDF files for testing

### Test Data

The test suite includes several sample PAGASA TCB PDF files:
- `TCB#15_emong.pdf`
- `TCB#16_emong.pdf`
- `TCB#17_emong.pdf`
- `TCB#18_emong.pdf`

## Supported Formats

Currently supports PAGASA Tropical Cyclone Bulletin PDF files that contain TCWS (Tropical Cyclone Wind Signals) information.

## Maintainer

Designed and developed by [Noel Earvin Piamonte](https://earv.in)
