# @earvinpiamonte/pagasa-tcb-parser

A TypeScript library for parsing [PAGASA](https://www.pagasa.dost.gov.ph/) (Philippine Atmospheric, Geophysical and Astronomical Services Administration) tropical cyclone bulletin (TCB) PDF files.

## Installation

```bash
npm i @earvinpiamonte/pagasa-tcb-parser
```

## Usage

### Basic Usage

```javascript
import { readFileSync } from "fs"
import tcbParser from "@earvinpiamonte/pagasa-tcb-parser"

// Example 1: Parse a PDF file
const result = await tcbParser.parsePDF('/path/to/TCB#16_emong.pdf');

console.log(result.signals);

// Get formatted JSON output
const jsonOutput = JSON.stringify(result, null, 2);

console.log(jsonOutput);



// Example 2: Parse from buffer
const buffer = readFileSync('/path/to/TCB#16_emong.pdf');
const result2 = await tcbParser.parseBuffer(buffer);

console.log(result2.signals);
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

### `tcbParser.parsePDF(filePath: string): Promise<WindSignals>`

Parses a PAGASA TCB PDF file from a file path.

**Parameters:**
- `filePath` (string): Path to the PDF file

**Returns:** Promise that resolves to a `WindSignals` object

### `tcbParser.parseBuffer(buffer: Buffer): Promise<WindSignals>`

Parses a PAGASA TCB PDF from a buffer.

**Parameters:**
- `buffer` (Buffer): PDF file buffer

**Returns:** Promise that resolves to a `WindSignals` object

## TypeScript Support

This package is written in TypeScript and includes type definitions.

```typescript
import tcbParser, { WindSignals, Regions, Area } from "@earvinpiamonte/pagasa-tcb-parser";

const result: WindSignals = await tcbParser.parsePDF('/path/to/file.pdf');

// You can also type individual parts:
const signal1: Regions = result.signals['1'];
const area: Area = signal1.regions.Luzon[0];
```

## Supported Formats

Currently supports PAGASA Tropical Cyclone Bulletin PDF files that contain TCWS (Tropical Cyclone Wind Signals) information.

## Maintainer

Designed and developed by [Noel Earvin Piamonte](https://earv.in)
