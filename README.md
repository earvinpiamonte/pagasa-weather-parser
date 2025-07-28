# @earvinpiamonte/pagasa-tcb-parser

A TypeScript library for parsing PAGASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration) tropical cyclone bulletin (TCB) PDF files.

## Installation

```bash
npm i @earvinpiamonte/pagasa-tcb-parser
```

## Usage

### Basic Usage

```javascript
import bulletin from "@earvinpiamonte/pagasa-tcb-parser"

// Parse a PDF file
const result = await bulletin.parsePDF('/path/to/TCB#16_emong.pdf');

console.log(result.signals);

// Parse from buffer
const buffer = fs.readFileSync('/path/to/TCB#16_emong.pdf');
const result = await bulletin.parseBuffer(buffer);

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
      "areas": {
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
      "areas": {
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

### `bulletin.parsePDF(filePath: string): Promise<ParsedSignals>`

Parses a PAGASA TCB PDF file from a file path.

**Parameters:**
- `filePath` (string): Path to the PDF file

**Returns:** Promise that resolves to a `ParsedSignals` object

### `bulletin.parseBuffer(buffer: Buffer): Promise<ParsedSignals>`

Parses a PAGASA TCB PDF from a buffer.

**Parameters:**
- `buffer` (Buffer): PDF file buffer

**Returns:** Promise that resolves to a `ParsedSignals` object

## TypeScript Support

This package is written in TypeScript and includes type definitions.

```typescript
import bulletin, { ParsedSignals, SignalArea } from "@earvinpiamonte/pagasa-tcb-parser";

const result: ParsedSignals = await bulletin.parsePDF('/path/to/file.pdf');
```

## Supported Formats

Currently supports PAGASA Tropical Cyclone Bulletin PDF files that contain TCWS (Tropical Cyclone Wind Signals) information.

## Maintainer

Designed and developed by [Noel Earvin Piamonte](https://earv.in)
