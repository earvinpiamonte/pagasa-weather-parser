#!/usr/bin/env node
const parseWeatherPdf = require('./dist/index.js');
const path = require('path');
const fs = require('fs');

async function demonstrateParser() {
  console.log('PAGASA Weather PDF Parser Demonstration');
  console.log('=====================================\n');

  // Check if TCB#3F_jacinto.pdf exists
  const jacintoPath = path.join(__dirname, 'tests/data', 'TCB#3F_jacinto.pdf');
  
  if (fs.existsSync(jacintoPath)) {
    console.log('✅ Found TCB#3F_jacinto.pdf - Parsing now...\n');
    
    try {
      const result = await parseWeatherPdf(jacintoPath);
      console.log('🌪️ PARSED RESULT for TCB#3F_jacinto.pdf:');
      console.log('==========================================');
      console.log(JSON.stringify(result, null, 2));
      
      // Also demonstrate the jsonStringified method
      const jsonString = await parseWeatherPdf(jacintoPath).jsonStringified();
      console.log('\n📋 Using .jsonStringified() method:');
      console.log(jsonString);
      
    } catch (error) {
      console.error('❌ Error parsing TCB#3F_jacinto.pdf:', error.message);
    }
  } else {
    console.log('❌ TCB#3F_jacinto.pdf not found in tests/data/ directory\n');
    
    console.log('📁 Available PDF files:');
    const testDataDir = path.join(__dirname, 'tests/data');
    const pdfFiles = fs.readdirSync(testDataDir).filter(file => file.endsWith('.pdf'));
    pdfFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    
    console.log('\n🔍 Demonstrating parser with similar file (TCB#3_huaning.pdf):');
    console.log('================================================================\n');
    
    const similarFile = path.join(__dirname, 'tests/data', 'TCB#3_huaning.pdf');
    try {
      const result = await parseWeatherPdf(similarFile);
      console.log('🌪️ SAMPLE OUTPUT STRUCTURE:');
      console.log('===========================');
      console.log(JSON.stringify(result, null, 2));
      
      console.log('\n📊 Data structure explanation:');
      console.log('- title: The bulletin title (e.g., "TROPICAL CYCLONE BULLETIN NR. 3")');
      console.log('- subtitle: Cyclone classification and name (e.g., "Tropical Depression HUANING")');
      console.log('- description: Current status description');
      console.log('- dateIssued/dateIssuedISO: When the bulletin was issued');
      console.log('- dateValidUntil/dateValidUntilISO: Validity period');
      console.log('- cyclone: Detailed cyclone information including:');
      console.log('  - name: Cyclone name');
      console.log('  - internationalName: International designation');
      console.log('  - signals: Array of TCWS (Tropical Cyclone Wind Signal) levels and affected areas');
      
    } catch (error) {
      console.error('❌ Error parsing sample file:', error.message);
    }
  }

  console.log('\n🚀 HOW TO USE WITH TCB#3F_jacinto.pdf (when available):');
  console.log('======================================================');
  console.log('const parseWeatherPdf = require("@earvinpiamonte/pagasa-weather-parser");');
  console.log('');
  console.log('// Method 1: Basic parsing');
  console.log('const result = await parseWeatherPdf("path/to/TCB#3F_jacinto.pdf");');
  console.log('console.log(result);');
  console.log('');
  console.log('// Method 2: Get JSON string directly');
  console.log('const jsonResult = await parseWeatherPdf("path/to/TCB#3F_jacinto.pdf").jsonStringified();');
  console.log('console.log(jsonResult);');
  console.log('');
  console.log('// Method 3: From buffer');
  console.log('const fs = require("fs");');
  console.log('const buffer = fs.readFileSync("path/to/TCB#3F_jacinto.pdf");');
  console.log('const result = await parseWeatherPdf(buffer);');
}

demonstrateParser().catch(console.error);