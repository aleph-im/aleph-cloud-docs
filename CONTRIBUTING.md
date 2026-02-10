# Contributing to Aleph Cloud Documentation

Thank you for your interest in contributing to the Aleph Cloud documentation! This guide will help you get started.

## Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/aleph-cloud-docs.git
   cd aleph-cloud-docs
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the dev server:**
   ```bash
   npm run docs:dev
   ```
5. **Make your changes** and preview at http://localhost:5173

## Types of Contributions

### 📝 Documentation Improvements
- Fix typos, grammar, or unclear explanations
- Add missing information or examples
- Improve code samples
- Update outdated content

### 🆕 New Content
- Tutorials and guides
- API documentation
- Integration examples
- FAQ entries

### 🐛 Bug Fixes
- Fix broken links (run `npm run links` to find them)
- Fix formatting issues
- Correct technical inaccuracies

### 🎨 Design/UX
- Improve navigation
- Enhance readability
- Add helpful diagrams or illustrations

## Documentation Style Guide

### Writing Style
- **Be concise:** Get to the point quickly
- **Be practical:** Include working examples
- **Be inclusive:** Avoid jargon when possible, explain terms when necessary
- **Use active voice:** "Run the command" not "The command should be run"

### Formatting
- Use **headers** to organize content (H2 for main sections, H3 for subsections)
- Use **code blocks** with language hints for all code:
  ```python
  # Like this
  print("Hello, Aleph!")
  ```
- Use **admonitions** for important notes:
  ```md
  ::: tip
  Helpful tips go here
  :::

  ::: warning
  Important warnings go here
  :::
  ```

### File Organization
- Place new pages in the appropriate directory under `/docs/`
- Update the sidebar in `/docs/.vitepress/config.mts` if adding new pages
- Use kebab-case for file names: `my-new-page.md`

## Submitting Changes

### Before Submitting
1. **Run the link checker:**
   ```bash
   npm run links
   ```
2. **Build the docs:**
   ```bash
   npm run docs:build
   ```
3. **Preview your changes:**
   ```bash
   npm run docs:preview
   ```

### Pull Request Process
1. Create a descriptive branch: `docs/improve-vm-tutorial`
2. Make your changes
3. Commit with clear messages: `docs: add GPU instance setup guide`
4. Push to your fork
5. Open a PR against `main`

### PR Description Template
```markdown
## Summary
Brief description of your changes.

## Type of Change
- [ ] Documentation improvement
- [ ] New content
- [ ] Bug fix
- [ ] Other (please describe)

## Checklist
- [ ] I ran `npm run links` and fixed any broken links
- [ ] I ran `npm run docs:build` successfully
- [ ] I previewed my changes locally
```

## Need Help?

- **Questions about contributing:** Open a [GitHub Discussion](https://github.com/aleph-im/aleph-cloud-docs/discussions)
- **Found a bug:** Open a [GitHub Issue](https://github.com/aleph-im/aleph-cloud-docs/issues)
- **Community chat:** Join us on [Telegram](https://t.me/alaboratory)

## Code of Conduct

Please be respectful and inclusive. We're building decentralized infrastructure together!

---

Thank you for helping make Aleph Cloud documentation better! 🚀
