# Parsing TCB#3F_jacinto.pdf with PAGASA Weather Parser

## ❌ Current Status

The file `TCB#3F_jacinto.pdf` is **not found** in the test data directory (`tests/data/`). 

## 📁 Available Test Files

The following PDF files are currently available for testing:
- TCB#15_emong.pdf
- TCB#16_emong.pdf  
- TCB#17_emong.pdf
- TCB#18_emong.pdf
- TCB#3_huaning.pdf
- TCB#5_isang.pdf
- TCB#7_gorio.pdf
- TCB#9_gorio.pdf
- tcadvisory.pdf

## 🔍 Sample Output Structure

Based on parsing a similar file (`TCB#3_huaning.pdf`), here's the expected output structure:

```json
{
  "title": "TROPICAL CYCLONE BULLETIN NR. 3",
  "subtitle": "Tropical Depression HUANING", 
  "description": "TROPICAL DEPRESSION MAINTAINS ITS STRENGTH WHILE MOVING SLOWLY.",
  "dateIssued": "August 18, 2025 5:00 PM",
  "dateIssuedISO": "2025-08-18T09:00:00.000Z",
  "dateValidUntil": "August 18, 2025 11:00 PM", 
  "dateValidUntilISO": "2025-08-18T15:00:00.000Z",
  "cyclone": {
    "name": "HUANING",
    "internationalName": null,
    "signals": []
  }
}
```

## 🚀 How to Parse TCB#3F_jacinto.pdf

### Step 1: Add the PDF file

Place `TCB#3F_jacinto.pdf` in the `tests/data/` directory:
```
tests/data/TCB#3F_jacinto.pdf
```

### Step 2: Use the parser

**JavaScript/Node.js:**
```javascript
const parseWeatherPdf = require('@earvinpiamonte/pagasa-weather-parser');

async function parseJacinto() {
  try {
    // Method 1: Parse from file path
    const result = await parseWeatherPdf('tests/data/TCB#3F_jacinto.pdf');
    console.log('Parsed result:', result);
    
    // Method 2: Get JSON string directly
    const jsonString = await parseWeatherPdf('tests/data/TCB#3F_jacinto.pdf').jsonStringified(2);
    console.log('JSON output:', jsonString);
    
  } catch (error) {
    console.error('Error parsing PDF:', error.message);
  }
}

parseJacinto();
```

**TypeScript:**
```typescript
import parseWeatherPdf, { BulletinData } from '@earvinpiamonte/pagasa-weather-parser';

async function parseJacinto(): Promise<BulletinData> {
  try {
    const result = await parseWeatherPdf('tests/data/TCB#3F_jacinto.pdf');
    
    // Fully typed result
    console.log('Cyclone name:', result.cyclone.name);
    console.log('Issue date:', result.dateIssued);
    console.log('Signal levels:', result.cyclone.signals.length);
    
    return result;
  } catch (error: any) {
    throw new Error(`Failed to parse TCB#3F_jacinto.pdf: ${error.message}`);
  }
}
```

### Step 3: Run the examples

Once you have the PDF file in place:

```bash
# Run JavaScript demo
node demo-parser.js

# Run TypeScript example  
npx ts-node examples/parse-jacinto.ts
```

## 📊 Expected Data Fields

The parser extracts the following information:

- **title**: Bulletin title (e.g., "TROPICAL CYCLONE BULLETIN NR. 3F")
- **subtitle**: Cyclone classification and name (e.g., "Tropical Storm JACINTO")
- **description**: Current status description
- **dateIssued**: When the bulletin was issued (human-readable)
- **dateIssuedISO**: ISO 8601 formatted issue date
- **dateValidUntil**: Validity period end (human-readable)
- **dateValidUntilISO**: ISO 8601 formatted validity end
- **cyclone**: Detailed cyclone information:
  - **name**: Cyclone local name
  - **internationalName**: International designation (if any)
  - **signals**: Array of TCWS (Tropical Cyclone Wind Signal) levels and affected areas

## 🔧 Development

To run the demonstration scripts provided:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run all tests
npm test

# Run demonstration
node demo-parser.js
```

The parser supports both file paths and Buffer inputs, making it flexible for different use cases.