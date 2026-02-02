const fs = require('fs');
const path = require('path');

// Read the file with proper encoding
const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Remove the entire sticky-header file upload block
content = content.replace(/<div class="sticky-header">[\s\S]*?<\/div>/, '<div class="sticky-header">\n  <div class="top-msg">IVRS बुकिंग - 8888823456 | <strong>मिस्ड कॉल बुकिंग - 9493602222</strong> | WhatsApp बुकिंग - 9222201122</div>\n  <div class="header-controls" style="position:absolute; right:20px; top:50%; transform:translateY(-50%); display: flex; align-items: center; gap: 12px;">\n    <div class="font-controls" style="display: flex; gap: 5px; background: var(--surface); padding: 4px; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow);">\n      <button id="fontSmall" title="Small Font" style="width:28px; height:28px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:50%; background:var(--bg); color:var(--text); border:1px solid var(--border); font-size:11px; cursor:pointer;">A-</button>\n      <button id="fontNormal" title="Normal Font" style="width:28px; height:28px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:50%; background:var(--primary); color:#fff; border:none; font-size:13px; cursor:pointer;">A</button>\n      <button id="fontBig" title="Big Font" style="width:28px; height:28px; padding:0; display:flex; align-items:center; justify-content:center; border-radius:50%; background:var(--bg); color:var(--text); border:1px solid var(--border); font-size:15px; cursor:pointer;">A+</button>\n    </div>\n    <button id="themeToggle" style="background:transparent; border:none; font-size:20px; cursor:pointer; padding:0; display:flex; align-items:center;" title="Toggle Dark Mode">🌙</button>\n  </div>\n</div>');

// Remove any other upload-area sections
content = content.replace(/<div class="upload-area">[\s\S]*?<\/div>/g, '');

// Remove any remaining file-upload sections
content = content.replace(/<div class="file-upload[^>]*>[\s\S]*?<\/div>/g, '');

// Ensure the file input is still present
if (!content.includes('<input type="file" id="fileInput"')) {
  content = content.replace('</body>', '<input type="file" id="fileInput" accept=".csv,.xlsx,.xls" style="display:none"></body>');
}

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');
console.log('File upload sections removed successfully!');