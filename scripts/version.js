#!/usr/bin/env node

/**
 * Script to generate version information for the documentation
 * This creates a version.json file that contains:
 * - version: Based on date + git commit hash
 * - isLocal: Whether the build is running locally
 * - localUrl: The local URL if running in dev mode
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json to get the semantic version
const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Output file paths - one for the build process and one for the public directory
const versionFile = path.resolve(__dirname, '../docs/.vitepress/version.json');
const publicFile = path.resolve(__dirname, '../docs/public/version.json');

// Function to get git commit hash
function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.error('Error getting git commit hash:', error.message);
    return 'unknown';
  }
}

// Function to generate version string
function generateVersion() {
  const semanticVersion = packageJson.version || '1.0.0';
  const hash = getGitCommitHash();
  return `v${semanticVersion}-${hash}`;
}

// Function to check if running locally
function isLocalBuild() {
  // Check for build command in npm_lifecycle_event
  const npmCommand = process.env.npm_lifecycle_event || '';
  // Consider it a production build if it contains 'build' or 'preview'
  return !npmCommand.includes('build') && !npmCommand.includes('preview');
}

// Function to get local URL
function getLocalUrl() {
  // Default VitePress port is 5173
  return 'http://localhost:5173';
}

// Generate version data
const versionData = {
  version: generateVersion(),
  isLocal: isLocalBuild(),
  localUrl: getLocalUrl(),
  buildTime: new Date().toISOString()
};

// Write to files
fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));
fs.writeFileSync(publicFile, JSON.stringify(versionData, null, 2));

console.log(`Version information generated at:`);
console.log(`- ${versionFile}`);
console.log(`- ${publicFile}`);
console.log(`Version: ${versionData.version}`);
console.log(`Is Local: ${versionData.isLocal}`);
if (versionData.isLocal) {
  console.log(`Local URL: ${versionData.localUrl}`);
}
