<p align="center">
  <img src="./docs/public/aleph-cloud-logo-dark-bg.svg" alt="Aleph Cloud Logo" width="250">
</p>

# Aleph Cloud Documentation
## Overview

This repository contains the official documentation for Aleph Cloud, a decentralized cloud platform that provides storage, computing, and indexing services. The documentation is built using [VitePress](https://vitepress.dev/), a modern static site generator powered by Vue.js.

The Aleph Cloud documentation covers:

- Platform overview and architecture
- Node setup and management
- Developer guides and tutorials
- API references and SDKs
- Tools and resources

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) version 18 or higher
- npm, yarn, or pnpm package manager

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/aleph-im/aleph-docs.git
   cd aleph-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:

```bash
npm run docs:dev
```

This will start a local server at http://localhost:5173. The site will automatically reload as you make changes to the content.

### Build

To build the documentation for production:

```bash
npm run docs:build
```

The built files will be in the `docs/.vitepress/dist` directory.

> **Note:** The build process includes a broken links checker that will prompt you to continue or halt the build if any broken internal links are found. A report will be generated at `/docs/tools/broken-links.md` with details about the broken links.

### Preview Production Build

To preview the production build locally:

```bash
npm run docs:preview
```

> **Note:** Like the build process, the preview command also runs the broken links checker with a prompt before starting the preview server.

### Finding Broken Links

You can run the links management tool separately with:

```bash
npm run links
```

This will scan all markdown files for broken internal links and generate a report at `/docs/tools/broken-links.md`. The report includes:

- A table of all broken links with their locations and URLs
- Links to the files containing broken links
- Instructions for fixing the broken links

#### Options for the Links Tool

You can pass additional flags to control how links are managed:

```bash
# Prompt to continue or halt if broken links are found (default in build/preview)
npm run links -- --prompt

# Always continue despite broken links
npm run links -- --force

# Only list broken links without affecting the build process
npm run links -- --list-broken-links

# Generate a summary of all links in the documentation
npm run links -- --summary

# Display help information about available options
npm run links -- --help
```

The `--prompt` flag is already included in the build and preview commands, allowing you to decide whether to proceed with broken links on a case-by-case basis.

| Command | Description |
|---------|-------------|
| `npm run links` | Default mode - exits with error if broken links are found |
| `npm run links -- --force` | Reports broken links but continues regardless |
| `npm run links -- --prompt` | Asks whether to continue when broken links are found |
| `npm run links -- --list-broken-links` | Lists broken links without affecting the build process |
| `npm run links -- --summary` | Generates a summary of all links in the documentation |
| `npm run links -- --help` | Displays help information about available options |

The build and preview commands already include the `--prompt` flag by default:

```bash
# These commands will prompt you if broken links are found
npm run docs:build
npm run docs:preview
```

The links summary feature is particularly useful for understanding the structure and connectivity of your documentation. It provides statistics on internal vs. external links, top destinations, and files with the most links.

## Documentation Structure

- `/docs/` - Main documentation content
  - `/docs/.vitepress/` - VitePress configuration
  - `/docs/public/` - Static assets like images and logos
  - `/docs/index.md` - Homepage
  - `/docs/about/` - About Aleph Cloud
  - `/docs/nodes/` - Node documentation
  - `/docs/devhub/` - Developer Hub
  - `/docs/tools/` - Tools and utilities
    - `/docs/tools/broken-links.md` - Report of broken internal links
- `/scripts/` - Utility scripts
  - `/scripts/links.js` - Links management tool for finding broken links and analyzing link structure

## Customization

The documentation uses a custom theme with:

- Purple (#7B3FE4) and yellow/lime (#D4FF00) as primary colors
- Organic, artistic backgrounds with blob shapes and animations
- Custom font styling with Rigid Square font for headers
- Light theme with soft purple backgrounds (#f3ebff, #EDE4FB)
- Dark theme with deep blue-black backgrounds (#08080f, #0f0f1c)
- Responsive design for all devices

## Contributing

Contributions to improve the documentation are welcome! Please feel free to submit pull requests or open issues to suggest improvements.

## License

[MIT License](./LICENSE)