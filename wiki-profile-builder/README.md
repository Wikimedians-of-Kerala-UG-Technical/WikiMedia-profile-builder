# Wiki Profile Builder

A Next.js application for creating and editing Wikimedia user profile pages.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Configure your environment variables in .env.local
# See .env.example for details

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Setup

This application requires environment variables for Firebase authentication and optionally for AI features.

See `.env.example` for the complete list of required variables.

### Required (Firebase):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Optional (AI Features):
- `GEMINI_API_KEY` - For AI-powered profile generation

**Note**: The app works without Gemini API key using template-based generation.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Home page
│   ├── editor/             # Profile editor
│   ├── generator/          # Code generator display
│   ├── login/              # Authentication pages
│   ├── register/
│   └── api/                # API routes
│       ├── parse/          # Wikitext parsing
│       ├── generate-profile/ # Profile generation
│       └── ai-edit/        # AI editing
├── components/
│   ├── auth/               # Authentication components
│   ├── editor/             # Editor components
│   ├── layout/             # Layout components
│   ├── profile/            # Profile creation components
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── services/               # External API services
│   ├── wikiService.ts      # Wikimedia API
│   └── firebase.ts         # Firebase config
└── store/                  # Zustand state management
```

## Available Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Features

- 🔍 Fetch existing Wikimedia profiles
- ✨ AI-powered profile generation
- 📝 Live wikitext editor with HTML preview
- 🎨 Visual customization (colors, images, sections)
- 🔄 Bidirectional conversion (wikitext ↔ HTML)
- 🔐 Firebase authentication
- 📋 Copy to clipboard functionality

## Technology Stack

- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Zustand** - State management
- **Firebase** - Authentication
- **Framer Motion** - Animations
- **Google Gemini AI** - AI features (optional)

## Development

### Adding New Features

1. Create components in appropriate folders
2. Add API routes in `src/app/api/`
3. Update types in component files
4. Test locally before committing

### Code Style

- Follow existing patterns
- Use TypeScript for type safety
- Keep components small and focused
- Use Tailwind for styling

## Documentation

For more detailed information, see:

- [Root README](../README.md) - Project overview
- [API Documentation](../docs/API.md) - API endpoints
- [Architecture Guide](../docs/ARCHITECTURE.md) - System design
- [User Guide](../docs/USER_GUIDE.md) - How to use the app
- [Deployment Guide](../docs/DEPLOYMENT.md) - Deploy the app
- [Contributing](../CONTRIBUTING.md) - Contribution guidelines

## Building for Production

```bash
# Create optimized production build
pnpm build

# Test production build locally
pnpm start
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

See [Deployment Guide](../docs/DEPLOYMENT.md) for detailed instructions.

## Troubleshooting

**Build fails**:
- Delete `node_modules`, `.next`, and `pnpm-lock.yaml`
- Run `pnpm install` and try again

**Environment variables not working**:
- Restart dev server after changing `.env.local`
- Ensure file is named exactly `.env.local`

**Authentication not working**:
- Verify all Firebase env variables are set
- Check Firebase console for errors

## License

MIT License - see [LICENSE](../LICENSE) for details

## Support

- Report issues: [GitHub Issues](https://github.com/MabelMoncy/TharangRepo/issues)
- Ask questions: [GitHub Discussions](https://github.com/MabelMoncy/TharangRepo/discussions)
