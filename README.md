# `pagasa-tcb-parser`

<p align="center">
    <a href="https://www.npmjs.com/package/@earvinpiamonte/pagasa-tcb-parser">
        <img src="https://img.shields.io/npm/v/@earvinpiamonte/pagasa-tcb-parser.svg" alt="npm version">
    </a>
    <a href="https://github.com/earvinpiamonte/pagasa-tcb-parser/actions/workflows/tests.yml">
        <img src="https://github.com/earvinpiamonte/pagasa-tcb-parser/actions/workflows/tests.yml/badge.svg" alt="Tests">
    </a>
</p>

A TypeScript library for parsing [PAGASA](https://www.pagasa.dost.gov.ph/) (Philippine Atmospheric, Geophysical and Astronomical Services Administration) tropical cyclone bulletin (TCB) PDF files.

## Installation

```bash
npm i @earvinpiamonte/pagasa-tcb-parser
```

## Usage

### Basic

```javascript
import parseTcbPdf from "@earvinpiamonte/pagasa-tcb-parser"

const result = await parseTcbPdf('/path/to/TCB#16_emong.pdf');

console.log(result);
```

### Error Handling

#### Using async/ await

```javascript
import parseTcbPdf from "@earvinpiamonte/pagasa-tcb-parser"

const run = async () => {
  try {
    const result = await parseTcbPdf('/path/to/TCB#16_emong.pdf');

    console.log(result);
  } catch (error) {
    console.error("Failed to parse TCB:", error.message);
  }
};

run();
```

#### Using Promises with `.then().catch()`

```javascript
import parseTcbPdf from "@earvinpiamonte/pagasa-tcb-parser"

parseTcbPdf('/path/to/TCB#16_emong.pdf')
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error("Failed to parse TCB:", error.message);
  });
```

#### Example fetching and parsing from external source

```javascript
import express from 'express';
import parseTcbPdf from '@earvinpiamonte/pagasa-tcb-parser';

const app = express();

app.get('/your/api/get-tcb', async (req, res) => {
  try {
    const response = await fetch('https://pubfiles.pagasa.dost.gov.ph/tamss/weather/bulletin/TCB%2316_emong.pdf');
    const buffer = await response.buffer();
    const result = await parseTcbPdf(buffer);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse TCB' });
  }
});
```

> [!NOTE]
> `parseTcbPdf` both supports file path and buffer input.

### Example output

The parser returns a structured JavaScript object:

<details>
<summary>Toggle example code</summary>

```json
{
  "signals": {
    "1": {
      "regions": {
        "luzon": [
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
        "visayas": [],
        "mindanao": []
      }
    },
    "2": {
      "regions": {
        "luzon": [
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
        "visayas": [],
        "mindanao": []
      }
    }
  }
}
```

</details>

### API

The package exports a single function that can handle both file paths and buffers:

| Function/Method | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `parseTcbPdf(input)` | `input`: `string` or `Buffer` | `ParsedTCBPromise` | Parses a PDF from a file path or buffer. |
| `.jsonStringified(space?)` | `space?`: `number` or `string` (optional, defaults to `2`) | `Promise<string>` | A chainable method that returns the parsed result as a JSON string. |

#### Function Signature

```typescript
import { ParsedTCBPromise } from "@earvinpiamonte/pagasa-tcb-parser";

/**
 * Parses a PAGASA TCB PDF from a file path or Buffer.
 * Returns a ParsedTCBPromise: a Promise<WindSignals>.
 */
declare function parseTcbPdf(input: string | Buffer): ParsedTCBPromise;
```

## Development

### TypeScript Support

This package is written in TypeScript and includes type definitions.

> **Note:** The package exports the `ParsedTCBPromise` type for advanced typing, which extends `Promise<WindSignals>` with a `.jsonStringified()` method.

```typescript
import parseTcbPdf, { ParsedTCBPromise, WindSignals, Regions, Area } from "@earvinpiamonte/pagasa-tcb-parser";

// Parse from file path
const result: ParsedTCBPromise = await parseTcbPdf('/path/to/file.pdf');

// With JSON stringified
const jsonResult: string = await result.jsonStringified();

// Using `WindSignals` type directly:
const windSignals: WindSignals = await result;

// You can also type individual parts:
const signal1: Regions = result.signals['1'];
const area: Area = signal1.regions.luzon[0];
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
