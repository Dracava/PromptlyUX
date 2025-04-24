const fs = require('fs');
const path = require('path');

// Read the source files
const template = fs.readFileSync(path.join(__dirname, 'src/index.html'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, 'src/styles.css'), 'utf8');
const script = fs.readFileSync(path.join(__dirname, 'src/script.js'), 'utf8');
const libraryScript = fs.readFileSync(path.join(__dirname, 'src/library.js'), 'utf8');

// Combine the scripts
const combinedScript = script + '\n\n' + libraryScript;

// Create the combined HTML with inline styles and scripts
let result = template
    .replace('/* STYLE_PLACEHOLDER */', styles)
    .replace('/* SCRIPT_PLACEHOLDER */', combinedScript);

// Clean up any duplicate body tags (common issue when combining files)
result = result.replace(/<body>[\s\S]*<body>/, '<body>');
result = result.replace(/<\/body>[\s\S]*<\/body>/, '</body>');

// Write the combined file
fs.writeFileSync(path.join(__dirname, 'ui.html'), result, 'utf8');

console.log('Successfully built ui.html'); 