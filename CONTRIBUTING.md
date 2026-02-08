# Contributing to Wiki Profile Builder

Thank you for your interest in contributing to Wiki Profile Builder! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and considerate in all interactions.

### Our Standards

- **Be Respectful**: Treat everyone with respect and kindness
- **Be Collaborative**: Work together towards common goals
- **Be Patient**: Help others learn and grow
- **Be Constructive**: Provide helpful feedback
- **Be Inclusive**: Welcome diverse perspectives

## Getting Started

1. **Fork the Repository**: Click the "Fork" button on GitHub
2. **Clone Your Fork**: 
   ```bash
   git clone https://github.com/YOUR_USERNAME/TharangRepo.git
   cd TharangRepo/wiki-profile-builder
   ```
3. **Add Upstream Remote**:
   ```bash
   git remote add upstream https://github.com/MabelMoncy/TharangRepo.git
   ```

## Development Setup

### Prerequisites

- Node.js 20 or higher
- pnpm package manager
- Git
- A code editor (VS Code recommended)

### Setup Steps

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Environment**
   
   Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. **Verify Setup**
   
   Open http://localhost:3000 and ensure the application loads correctly.

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Fixes**: Fix issues and improve stability
- ✨ **New Features**: Add new functionality
- 📝 **Documentation**: Improve or add documentation
- 🎨 **UI/UX**: Enhance user interface and experience
- ♿ **Accessibility**: Improve accessibility features
- 🌍 **Internationalization**: Add translations
- ⚡ **Performance**: Optimize code and performance
- 🧪 **Tests**: Add or improve tests

### Finding Issues to Work On

- Check the [Issues](https://github.com/MabelMoncy/TharangRepo/issues) page
- Look for issues labeled `good first issue` if you're new
- Issues labeled `help wanted` need community support
- Comment on an issue to express interest before starting work

### Creating New Issues

Before creating a new issue:

1. **Search Existing Issues**: Check if the issue already exists
2. **Provide Clear Description**: Explain the problem or feature request
3. **Add Context**: Include screenshots, error messages, or examples
4. **Specify Environment**: Mention browser, OS, Node version if relevant

## Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Avoid `any` types - use proper type definitions
- Use interfaces for object shapes
- Use type aliases for unions and primitives
- Export types that are used in multiple files

### Code Style

We use ESLint for code style enforcement:

```bash
# Run linter
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

**Key Guidelines:**

- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use async/await over raw promises
- Prefer functional programming patterns
- Use early returns to reduce nesting

### Component Guidelines

**React Components:**

```typescript
// Use functional components with TypeScript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  // Component implementation
}
```

**File Organization:**

- One component per file
- Co-locate styles with components (Tailwind CSS)
- Use `index.ts` for barrel exports when appropriate
- Keep component files under 300 lines

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use semantic color names from the design system
- Avoid inline styles unless necessary for dynamic values

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(editor): add syntax highlighting for wikitext
fix(auth): resolve firebase authentication timeout
docs(readme): update installation instructions
refactor(api): simplify profile generation logic
```

## Pull Request Process

### Before Submitting

1. **Update Your Fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, well-documented code
   - Follow coding standards
   - Add tests if applicable

4. **Test Your Changes**
   ```bash
   pnpm build
   pnpm lint
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add awesome feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the PR

1. **Create Pull Request** on GitHub
2. **Fill Out the Template** with:
   - Description of changes
   - Related issue numbers
   - Screenshots (for UI changes)
   - Testing performed

3. **Link Related Issues**: Use keywords like "Fixes #123" or "Closes #456"

### PR Review Process

- Maintainers will review your PR
- Address feedback and requested changes
- Keep the PR updated with main branch
- Be patient and responsive to comments

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] No new warnings or errors
- [ ] Tests added/updated if applicable
- [ ] All tests passing
- [ ] PR description is clear and complete

## Issue Guidelines

### Bug Reports

Include the following information:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, Node version
- **Screenshots**: If applicable
- **Error Messages**: Console errors or stack traces

### Feature Requests

Include the following information:

- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives Considered**: Other solutions you've thought about
- **Additional Context**: Screenshots, mockups, examples

## Development Tips

### Useful Commands

```bash
# Install a new dependency
pnpm add <package-name>

# Install dev dependency
pnpm add -D <package-name>

# Update dependencies
pnpm update

# Clean install
rm -rf node_modules .next
pnpm install
```

### Debugging

- Use Chrome DevTools for frontend debugging
- Use `console.log` for quick debugging (remove before committing)
- Use VS Code debugger for complex issues
- Check browser console for errors
- Review Network tab for API issues

### Testing Locally

1. Test with different browsers (Chrome, Firefox, Safari)
2. Test responsive design at various screen sizes
3. Test with slow network conditions
4. Test error scenarios
5. Test authentication flows

## Getting Help

If you need help:

- 💬 Ask in [GitHub Discussions](https://github.com/MabelMoncy/TharangRepo/discussions)
- 🐛 Check existing [Issues](https://github.com/MabelMoncy/TharangRepo/issues)
- 📚 Read the [Documentation](README.md)
- 📧 Contact maintainers

## Recognition

Contributors will be recognized in:

- GitHub Contributors page
- Release notes for significant contributions
- Project documentation (if applicable)

Thank you for contributing to Wiki Profile Builder! 🎉
