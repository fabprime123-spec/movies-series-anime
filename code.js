const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_FILE = path.join(__dirname, 'codebase_contents.txt');
const TARGET_DIR = path.join(__dirname, 'source');
const APP_FILE = path.join(__dirname, 'App.tsx');

// Excluded extensions (e.g. binary/media assets)
const EXCLUDED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
  '.ttf', '.otf', '.woff', '.woff2',
  '.mp3', '.mp4', '.wav', '.pdf', '.zip'
]);

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return !EXCLUDED_EXTENSIONS.has(ext);
}

function getFilesRecursively(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      if (isTextFile(fullPath)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

function run() {
  console.log('Gathering files...');
  let filesToProcess = [];

  // Add App.tsx if it exists
  if (fs.existsSync(APP_FILE) && fs.statSync(APP_FILE).isFile()) {
    filesToProcess.push(APP_FILE);
  }

  // Add all files from the source directory
  if (fs.existsSync(TARGET_DIR)) {
    filesToProcess = filesToProcess.concat(getFilesRecursively(TARGET_DIR));
  }

  console.log(`Found ${filesToProcess.length} text files to process.`);

  let outputContent = '';

  filesToProcess.forEach(filePath => {
    const relativePath = path.relative(__dirname, filePath);
    console.log(`Processing: ${relativePath}`);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      outputContent += `================================================================================\n`;
      outputContent += `FILE: ${relativePath}\n`;
      outputContent += `================================================================================\n`;
      outputContent += content;
      outputContent += `\n\n`;
    } catch (err) {
      console.error(`Error reading ${relativePath}: ${err.message}`);
    }
  });

  try {
    fs.writeFileSync(OUTPUT_FILE, outputContent, 'utf8');
    console.log(`\nSuccess! Created output file at:\n${OUTPUT_FILE}`);
  } catch (err) {
    console.error(`Failed to write output file: ${err.message}`);
  }
}

run();
