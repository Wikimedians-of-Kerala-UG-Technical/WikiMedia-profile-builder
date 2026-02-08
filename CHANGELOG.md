# Changelog

All notable changes to the Wiki Profile Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive project documentation
  - User Guide for end users
  - API Documentation for developers
  - Architecture Guide explaining design decisions
  - Deployment Guide for various platforms
  - Contributing guidelines
  - Environment configuration examples

### Changed
- Updated README.md with detailed project overview
- Enhanced wiki-profile-builder/README.md with local setup instructions

### Fixed
- Fixed .gitignore to properly include .env.example file

## [0.1.0] - 2026-02-08

### Initial Release

#### Added
- Next.js 16 application with App Router
- User profile fetching from Wikimedia projects
  - Meta-Wiki
  - English Wikipedia
  - Wikimedia Commons
  - Wikidata
  - English Wiktionary
- AI-powered profile generation using Google Gemini
- Template-based profile generation (fallback)
- Live wikitext editor with real-time HTML preview
- Visual editing capabilities
- Firebase authentication (email/password)
- Color palette customization
- Custom sections/categories management
- Image upload and embedding support
- Copy to clipboard functionality
- Responsive design with Tailwind CSS
- State management with Zustand
- Smooth animations with Framer Motion

#### Technical Stack
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5.0
- Tailwind CSS 4.0
- Firebase 12.9.0
- Google Generative AI 0.24.1
- Zustand 5.0.11
- Axios 1.13.4
- DOMPurify 3.3.1
- Framer Motion 12.33.0
- Lucide React 0.563.0

---

## Changelog Guidelines

### Types of Changes

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Version Format

- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major**: Incompatible API changes
- **Minor**: Backwards-compatible new features
- **Patch**: Backwards-compatible bug fixes

### Example Entry Format

```markdown
## [1.2.3] - 2026-03-15

### Added
- New feature description (#123)
- Another new feature (#124)

### Changed
- Modified behavior description (#125)

### Fixed
- Bug fix description (#126)
- Another bug fix (#127)

### Security
- Security vulnerability fix (#128)
```

---

[Unreleased]: https://github.com/MabelMoncy/TharangRepo/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/MabelMoncy/TharangRepo/releases/tag/v0.1.0
