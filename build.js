const fs = require('fs');
const path = require('path');
const htmlMinifier = require('html-minifier-terser');
const { minify } = require('terser');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Function to minify JavaScript
async function minifyJS(jsCode) {
  const result = await minify(jsCode, {
    compress: {
      drop_console: true,
      drop_debugger: true,
      dead_code: true,
      unused: true,
      collapse_vars: true,
      reduce_vars: true
    },
    mangle: {
      toplevel: true,
      reserved: ['el', 'initLogin', 'toggleLock', 'showFlashMessage'] // Keep important function names
    },
    output: {
      comments: false
    }
  });
  return result.code;
}

// Function to minify HTML with inline CSS and JS
async function minifyHTML(htmlCode) {
  // Minify inline JavaScript
  let minifiedHTML = htmlCode;
  
  // Extract and minify <script> tags
  minifiedHTML = minifiedHTML.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, async (match, jsCode) => {
    if (match.includes('src=')) {
      // External script, leave as is
      return match;
    }
    try {
      const minifiedJS = await minifyJS(jsCode);
      return `<script>${minifiedJS}</script>`;
    } catch (error) {
      console.error('Error minifying JS:', error);
      return match;
    }
  });

  // Minify the entire HTML
  const finalMinified = await htmlMinifier.minify(minifiedHTML, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: false, // Already minified JS
    removeAttributeQuotes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    html5: true
  });

  return finalMinified;
}

// Process all HTML files
async function processFiles() {
  const files = ['index.html', 'credential-generator.html'];
  
  for (const file of files) {
    try {
      const filePath = path.join(__dirname, file);
      const htmlCode = fs.readFileSync(filePath, 'utf8');
      const minifiedHTML = await minifyHTML(htmlCode);
      
      const outputPath = path.join(distDir, file);
      fs.writeFileSync(outputPath, minifiedHTML, 'utf8');
      
      console.log(`✓ Minified ${file} successfully`);
      console.log(`  Original size: ${htmlCode.length.toLocaleString()} bytes`);
      console.log(`  Minified size: ${minifiedHTML.length.toLocaleString()} bytes`);
      console.log(`  Reduction: ${((1 - minifiedHTML.length / htmlCode.length) * 100).toFixed(2)}%`);
      console.log();
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error);
      console.log();
    }
  }
  
  console.log('Build completed! Minified files are in the dist directory.');
}

// Run the build process
processFiles();