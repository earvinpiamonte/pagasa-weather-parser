import parseWeatherPdf from '../src/index';
import { CycloneSignal } from '../src/types/index';
import { join } from 'path';
import { existsSync } from 'fs';

async function parseJacintoExample() {
  console.log('🌪️ PAGASA Weather Parser - TCB#3F_jacinto.pdf Example');
  console.log('=====================================================\n');
  
  const jacintoPath = join(__dirname, '..', 'tests', 'data', 'TCB#3F_jacinto.pdf');
  
  if (existsSync(jacintoPath)) {
    console.log('✅ Found TCB#3F_jacinto.pdf - Processing...\n');
    
    try {
      // Parse the PDF file
      const result = await parseWeatherPdf(jacintoPath);
      
      console.log('📋 PARSED DATA:');
      console.log('===============');
      console.log(`Title: ${result.title}`);
      console.log(`Subtitle: ${result.subtitle}`);
      console.log(`Description: ${result.description}`);
      console.log(`Date Issued: ${result.dateIssued}`);
      console.log(`Date Valid Until: ${result.dateValidUntil}`);
      console.log(`Cyclone Name: ${result.cyclone.name}`);
      console.log(`International Name: ${result.cyclone.internationalName || 'N/A'}`);
      console.log(`Number of Signal Levels: ${result.cyclone.signals.length}\n`);
      
      // Show detailed signals if any
      if (result.cyclone.signals.length > 0) {
        console.log('🚨 TROPICAL CYCLONE WIND SIGNALS:');
        console.log('=================================');
        result.cyclone.signals.forEach((signal: CycloneSignal, index: number) => {
          console.log(`\nSignal Level ${signal.level}:`);
          console.log(`  Luzon: ${signal.regions.luzon.length} areas`);
          console.log(`  Visayas: ${signal.regions.visayas.length} areas`);
          console.log(`  Mindanao: ${signal.regions.mindanao.length} areas`);
        });
      }
      
      console.log('\n🗂️ FULL JSON OUTPUT:');
      console.log('===================');
      const jsonOutput = await parseWeatherPdf(jacintoPath).jsonStringified(2);
      console.log(jsonOutput);
      
    } catch (error: any) {
      console.error('❌ Error parsing file:', error.message);
    }
  } else {
    console.log(`❌ File not found: ${jacintoPath}\n`);
    console.log('💡 To parse TCB#3F_jacinto.pdf, please:');
    console.log('1. Place the PDF file in the tests/data/ directory');
    console.log('2. Run this script again\n');
    
    console.log('📖 Expected file location:');
    console.log(`   ${jacintoPath}\n`);
    
    console.log('🔧 Example TypeScript usage:');
    console.log(`
import parseWeatherPdf, { BulletinData } from '@earvinpiamonte/pagasa-weather-parser';

async function parseJacinto(): Promise<BulletinData> {
  const result = await parseWeatherPdf('tests/data/TCB#3F_jacinto.pdf');
  
  // The result has full TypeScript type information
  console.log('Cyclone name:', result.cyclone.name);
  console.log('Issue date:', result.dateIssued);
  console.log('Signal levels:', result.cyclone.signals.length);
  
  return result;
}
    `);
  }
}

// Run the example
parseJacintoExample().catch(console.error);