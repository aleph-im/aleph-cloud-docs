#!/usr/bin/env node

/**
 * Script to manage links in markdown files
 * This script can:
 * - Find broken internal links in markdown files
 * - List all links in the documentation
 * - Generate a summary of link types and destinations
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const docsDir = path.resolve(__dirname, '../docs');
const outputFile = path.resolve(docsDir, 'tools/broken-links.md');
const excludeDirs = ['node_modules', '.vitepress/cache', '.vitepress/dist'];

// Parse command line arguments
const args = process.argv.slice(2);
const forceFlag = args.includes('--force');
const promptFlag = args.includes('--prompt');
const listBrokenLinksFlag = args.includes('--list-broken-links');
const summaryFlag = args.includes('--summary');
const helpFlag = args.includes('--help');

// Display help information if --help flag is used
if (helpFlag) {
  displayHelp();
  process.exit(0);
}

// Helper function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Helper function to resolve a link to a file path
function resolveLink(link, basePath) {
  // Handle anchor links (links to sections within the same page)
  if (link.startsWith('#')) {
    return { path: basePath, isAnchor: true };
  }

  // Handle external links
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
    return { path: link, isExternal: true };
  }

  // Handle root-relative links
  let targetPath;
  if (link.startsWith('/')) {
    targetPath = path.join(docsDir, link.slice(1));
  } else {
    // Handle relative links
    const baseDir = path.dirname(basePath);
    targetPath = path.resolve(baseDir, link);
  }

  // Clean up the path
  targetPath = targetPath.split('#')[0]; // Remove any anchor
  targetPath = targetPath.split('?')[0]; // Remove any query string

  // Handle directory links (e.g., /about/ -> /about/index.md)
  if (!path.extname(targetPath)) {
    if (targetPath.endsWith('/')) {
      targetPath = path.join(targetPath, 'index.md');
    } else {
      // Check if it's a directory or a file without extension
      if (fileExists(targetPath) && fs.statSync(targetPath).isDirectory()) {
        targetPath = path.join(targetPath, 'index.md');
      } else {
        targetPath += '.md';
      }
    }
  }

  return { path: targetPath, isInternal: true };
}

// Extract markdown links from content
function extractLinks(content) {
  const links = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  // Calculate line numbers for positions
  const lines = content.split('\n');
  const linePositions = [];
  let position = 0;
  
  for (const line of lines) {
    linePositions.push(position);
    position += line.length + 1; // +1 for the newline character
  }

  // Function to get line number from character position
  const getLineNumber = (charPosition) => {
    for (let i = 1; i < linePositions.length; i++) {
      if (linePositions[i] > charPosition) {
        return i; // Line numbers are 1-based
      }
    }
    return lines.length;
  };

  while ((match = linkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkUrl = match[2].trim();

    // Skip image links
    if (match[0].startsWith('![')) {
      continue;
    }

    links.push({
      text: linkText,
      url: linkUrl,
      fullMatch: match[0],
      index: match.index,
      lineNumber: getLineNumber(match.index)
    });
  }

  return links;
}

// Check if a link is broken
function isLinkBroken(link, filePath) {
  // Skip external links, we're only checking internal links
  if (link.url.startsWith('http://') || link.url.startsWith('https://') || link.url.startsWith('mailto:')) {
    return false;
  }

  // Skip anchor links (links to sections within the same page)
  if (link.url.startsWith('#')) {
    return false;
  }

  // Resolve the link to a file path
  const resolved = resolveLink(link.url, filePath);

  // Skip external links
  if (resolved.isExternal) {
    return false;
  }

  // Skip anchor links
  if (resolved.isAnchor) {
    return false;
  }

  // Check if the file exists
  const exists = fileExists(resolved.path);

  // If the link is broken, return details
  if (!exists) {
    return {
      file: filePath,
      linkText: link.text,
      linkUrl: link.url,
      resolvedPath: resolved.path,
      lineNumber: link.lineNumber
    };
  }

  return false;
}

// Main function to find broken links
async function findBrokenLinks() {
  // Check if broken-links.md exists and delete it if it does
  if (fileExists(outputFile)) {
    fs.unlinkSync(outputFile);
    styledConsole('Deleted existing broken-links.md to avoid false positives.', 'warning');
  }

  const brokenLinks = [];

  // Find all markdown files
  const files = glob.sync('**/*.md', {
    cwd: docsDir,
    ignore: excludeDirs.map(dir => `**/${dir}/**`),
    absolute: true
  });

  styledConsole('Scanning for broken links...', 'info');

  // Check each file for broken links
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const links = extractLinks(content);

    for (const link of links) {
      const broken = isLinkBroken(link, file);
      if (broken) {
        // Create a relative path for display
        const relativeFilePath = path.relative(docsDir, file);
        
        styledConsole(`⚠️  Broken link: "${broken.linkText}" (${broken.linkUrl}) in ${relativeFilePath} on line ${broken.lineNumber}`, 'warning');
        
        brokenLinks.push({
          file: relativeFilePath,
          linkText: broken.linkText,
          linkUrl: broken.linkUrl,
          lineNumber: broken.lineNumber
        });
      }
    }
  }

  return brokenLinks;
}

// Generate markdown report for broken links
function generateReport(brokenLinks) {
  if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  }

  let reportContent = `# Broken Links Report\n\n`;
  
  if (brokenLinks.length === 0) {
    reportContent += `No broken links found! 🎉\n\n`;
    reportContent += `*Report generated on ${new Date().toLocaleString()}*\n`;
    fs.writeFileSync(outputFile, reportContent);
    return 0;
  }

  reportContent += `Found ${brokenLinks.length} broken links in the documentation.\n\n`;
  reportContent += `## List of Broken Links\n\n`;
  reportContent += `| File | Link Text | Link URL |\n`;
  reportContent += `| ---- | --------- | ------- |\n`;

  for (const link of brokenLinks) {
    const fileLink = `[${link.file}](/${link.file.replace(/\.md$/, '')})`;
    reportContent += `| ${fileLink} | ${link.lineNumber} | ${link.linkText} | \`${link.linkUrl}\` |\n`;
  }

  reportContent += `\n*Report generated on ${new Date().toLocaleString()}*\n`;

  fs.writeFileSync(outputFile, reportContent);
  styledConsole(`Report generated at: ${outputFile}`, 'link');

  return brokenLinks.length;
}

// Helper function for styled console output
function styledConsole(message, type = 'info') {
  const styles = {
    header: '\x1b[1;35m', // Bold Magenta
    subheader: '\x1b[36m', // Cyan
    success: '\x1b[32m',  // Green
    error: '\x1b[31m',    // Red
    warning: '\x1b[33m',  // Yellow
    info: '\x1b[0m',      // Default
    link: '\x1b[34m'      // Blue
  };
  
  console.log(`${styles[type]}${message}\x1b[0m`);
}

// Helper function to print a divider line
function printDivider() {
  console.log('\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
}

// Display help information
function displayHelp() {
  printDivider();
  styledConsole('🔍 LINKS MANAGEMENT TOOL - HELP', 'header');
  printDivider();
  
  console.log('\nUsage: node scripts/links.js [options]\n');
  
  console.log('Options:');
  console.log('  --help                 Display this help information');
  console.log('  --force                Report broken links but continue regardless');
  console.log('  --prompt               Ask whether to continue when broken links are found');
  console.log('  --list-broken-links    List broken links without affecting the build process');
  console.log('  --summary              Generate a summary of all links in the documentation');
  
  console.log('\nExamples:');
  console.log('  node scripts/links.js                   # Check for broken links (exits with error if found)');
  console.log('  node scripts/links.js --force           # Check for broken links but continue regardless');
  console.log('  node scripts/links.js --summary         # Generate a summary of all links');
  console.log('  node scripts/links.js --help            # Display this help information');
  
  console.log('\nNote:');
  console.log('  The build and preview commands already include the --prompt flag by default:');
  console.log('  npm run docs:build                      # Will prompt if broken links are found');
  console.log('  npm run docs:preview                    # Will prompt if broken links are found');
  
  printDivider();
}

// Prompt the user to continue despite broken links
function promptToContinue() {
  return new Promise((resolve) => {
    process.stdout.write('\x1b[33m⚠️  Broken links found. Do you want to continue anyway? (y/N): \x1b[0m');
    
    process.stdin.once('data', (data) => {
      const input = data.toString().trim().toLowerCase();
      resolve(input === 'y' || input === 'yes');
    });
  });
}

// Function to list all links in the documentation
async function listAllLinks() {
  const allLinks = [];

  // Find all markdown files
  const files = glob.sync('**/*.md', {
    cwd: docsDir,
    ignore: excludeDirs.map(dir => `**/${dir}/**`),
    absolute: true
  });

  // Extract links from each file
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const links = extractLinks(content);
    
    if (links.length > 0) {
      const relativeFilePath = path.relative(docsDir, file);
      
      for (const link of links) {
        allLinks.push({
          file: relativeFilePath,
          linkText: link.text,
          linkUrl: link.url
        });
      }
    }
  }

  return allLinks;
}

// Generate a summary of all links
async function generateLinkSummary() {
  const allLinks = await listAllLinks();
  
  // Count by type
  const linkTypes = {
    internal: 0,
    external: 0,
    anchor: 0
  };
  
  // Count by destination
  const destinations = {};
  
  // Count by file
  const fileStats = {};
  
  for (const link of allLinks) {
    // Categorize by type
    if (link.linkUrl.startsWith('http://') || link.linkUrl.startsWith('https://')) {
      linkTypes.external++;
      
      // Track external domains
      try {
        const url = new URL(link.linkUrl);
        const domain = url.hostname;
        destinations[domain] = (destinations[domain] || 0) + 1;
      } catch (e) {
        // Invalid URL, skip
      }
    } else if (link.linkUrl.startsWith('#')) {
      linkTypes.anchor++;
    } else {
      linkTypes.internal++;
      
      // Track internal paths
      const pathParts = link.linkUrl.split('/');
      const topLevel = pathParts[1] || 'root';
      destinations[`/${topLevel}`] = (destinations[`/${topLevel}`] || 0) + 1;
    }
    
    // Track files with links
    fileStats[link.file] = (fileStats[link.file] || 0) + 1;
  }
  
  // Sort destinations by count
  const sortedDestinations = Object.entries(destinations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Sort files by link count
  const sortedFiles = Object.entries(fileStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Print summary
  printDivider();
  styledConsole('📊 LINK SUMMARY', 'header');
  printDivider();
  
  styledConsole(`Total links found: ${allLinks.length}`, 'subheader');
  console.log();
  
  styledConsole('Link Types:', 'subheader');
  console.log(`- Internal links: ${linkTypes.internal}`);
  console.log(`- External links: ${linkTypes.external}`);
  console.log(`- Anchor links: ${linkTypes.anchor}`);
  console.log();
  
  styledConsole('Top 10 Destinations:', 'subheader');
  sortedDestinations.forEach(([dest, count]) => {
    console.log(`- ${dest}: ${count} links`);
  });
  console.log();
  
  styledConsole('Top 10 Files with Most Links:', 'subheader');
  sortedFiles.forEach(([file, count]) => {
    console.log(`- ${file}: ${count} links`);
  });
  
  printDivider();
}

// Main execution
async function main() {
  try {
    printDivider();
    styledConsole('🔍 LINKS MANAGEMENT TOOL', 'header');
    printDivider();
    
    // Handle --summary flag
    if (summaryFlag) {
      await generateLinkSummary();
      process.exit(0);
    }
    
    // Handle --list-broken-links flag
    if (listBrokenLinksFlag) {
      styledConsole('Scanning documentation for broken internal links...', 'info');
      console.log();
      
      const brokenLinks = await findBrokenLinks();
      generateReport(brokenLinks);
      
      console.log();
      printDivider();
      
      if (brokenLinks.length > 0) {
        styledConsole(`❌ FOUND ${brokenLinks.length} BROKEN LINKS`, 'error');
        styledConsole(`Report generated at: ${outputFile}`, 'link');
      } else {
        styledConsole('✅ NO BROKEN LINKS FOUND', 'success');
      }
      
      printDivider();
      process.exit(0);
    }
    
    // Default behavior - check for broken links
    styledConsole('Scanning documentation for broken internal links...', 'info');
    console.log();
    
    const brokenLinks = await findBrokenLinks();
    const brokenCount = generateReport(brokenLinks);
    
    console.log();
    printDivider();
    
    if (brokenCount > 0) {
      styledConsole(`❌ FOUND ${brokenCount} BROKEN LINKS`, 'error');
      styledConsole(`Report generated at: ${outputFile}`, 'link');
      console.log();
      
      // Check if --force flag is used
      if (forceFlag) {
        styledConsole('⚠️  PROCEEDING WITH BUILD DESPITE BROKEN LINKS (--force flag used)', 'warning');
        printDivider();
        process.exit(0); // Exit with success code to allow build to continue
      }
      
      // Check if --prompt flag is used
      if (promptFlag) {
        const shouldContinue = await promptToContinue();
        if (shouldContinue) {
          styledConsole('⚠️  PROCEEDING WITH BUILD DESPITE BROKEN LINKS (user confirmed)', 'warning');
          printDivider();
          process.exit(0); // Exit with success code to allow build to continue
        } else {
          styledConsole('⚠️  BUILD PROCESS HALTED BY USER', 'warning');
          printDivider();
          process.exit(1); // Exit with error code to stop the build
        }
      }
      
      // Default behavior - halt the build
      styledConsole('⚠️  BUILD PROCESS HALTED', 'warning');
      styledConsole('Please fix the broken links before continuing.', 'warning');
      styledConsole('Run the following command to see the broken links report:', 'info');
      styledConsole('  npm run links', 'subheader');
      styledConsole('To proceed despite broken links, use one of these commands:', 'info');
      styledConsole('  npm run links -- --force', 'subheader');
      styledConsole('  npm run links -- --prompt', 'subheader');
      printDivider();
      // Exit with error code if broken links found
      process.exit(1);
    } else {
      styledConsole('✅ NO BROKEN LINKS FOUND', 'success');
      styledConsole('Documentation links are all valid!', 'success');
      console.log();
      styledConsole('▶️  BUILD PROCESS CONTINUING', 'info');
      printDivider();
      process.exit(0);
    }
  } catch (error) {
    console.log();
    printDivider();
    styledConsole('❌ ERROR CHECKING LINKS', 'error');
    console.error(error);
    styledConsole('⚠️  BUILD PROCESS HALTED DUE TO ERROR', 'warning');
    printDivider();
    process.exit(1);
  }
}

// Run the script
main();
