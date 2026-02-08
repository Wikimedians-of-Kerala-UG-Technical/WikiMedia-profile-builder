# Wiki Profile Builder

A modern Next.js application for creating and editing Wikimedia user profile pages with AI-powered assistance and real-time preview.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

## 📖 Overview

Wiki Profile Builder is a powerful tool designed to help Wikimedia contributors create, edit, and manage their user profile pages. Whether you're an experienced Wikipedian or just getting started, this application simplifies the process of working with MediaWiki markup.

### Key Features

- **🔍 Profile Fetching**: Import existing user profiles from multiple Wikimedia projects (Wikipedia, Meta-Wiki, Commons, Wikidata, Wiktionary)
- **✨ AI-Powered Generation**: Create professional profile pages from basic information using Google's Gemini AI
- **📝 Live Editor**: Real-time wikitext editor with instant HTML preview
- **🎨 Visual Customization**: Customize colors, add images, and organize content sections
- **🔄 Bidirectional Conversion**: Convert between HTML and wikitext seamlessly
- **👁️ Split View**: Edit wikitext and preview rendered HTML side-by-side
- **🚀 Template Fallback**: Generates beautiful profiles even without AI API access
- **🔐 Firebase Authentication**: Secure user authentication and session management

## 🏗️ Architecture

```
TharangRepo/
├── wiki-profile-builder/          # Main Next.js application
│   ├── src/
│   │   ├── app/                   # Next.js App Router pages
│   │   │   ├── page.tsx           # Home page (fetch/create profile)
│   │   │   ├── editor/            # Profile editor with live preview
│   │   │   ├── generator/         # Generated code display
│   │   │   ├── login/             # Authentication pages
│   │   │   ├── register/
│   │   │   └── api/               # API routes
│   │   │       ├── parse/         # Wikitext to HTML conversion
│   │   │       ├── generate-profile/  # AI profile generation
│   │   │       └── ai-edit/       # AI-powered editing
│   │   ├── components/
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── editor/            # Editor-specific components
│   │   │   ├── layout/            # Layout components (Header, etc.)
│   │   │   ├── profile/           # Profile creation components
│   │   │   └── ui/                # Reusable UI components
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # External API services
│   │   │   ├── wikiService.ts     # Wikimedia API integration
│   │   │   └── firebase.ts        # Firebase configuration
│   │   └── store/                 # Zustand state management
│   ├── public/                    # Static assets
│   └── package.json
├── LICENSE
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (recommended)
- **pnpm** (package manager)
- **Firebase Account** (for authentication)
- **Google Gemini API Key** (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MabelMoncy/TharangRepo.git
   cd TharangRepo/wiki-profile-builder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `wiki-profile-builder` directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google Gemini API (Optional - for AI features)
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Usage Guide

### Fetching an Existing Profile

1. Select the "Fetch Existing Profile" tab on the home page
2. Enter your Wikimedia username
3. Choose the wiki project (e.g., Meta-Wiki, English Wikipedia)
4. Click "Fetch Your Profile"
5. The wikitext will be loaded into the editor for editing

### Creating a New Profile

1. Select the "Create New Profile" tab on the home page
2. Fill in your basic information:
   - Username (required)
   - Real name, location, occupation
   - Languages you speak
   - Interests and hobbies
   - About me section
3. Add custom sections/categories as needed
4. Upload images (optional)
5. Customize the color palette
6. Click "Generate Profile"
7. Review and edit the generated wikitext in the editor

### Using the Editor

- **Code View**: Edit raw wikitext markup
- **Preview View**: See the rendered HTML output
- **Split View**: Edit and preview simultaneously
- **Visual Editing**: Click "Edit Visually" to modify HTML directly
- **AI Assistance**: Use the AI edit feature to refine sections
- **Copy Code**: Click the copy button to copy wikitext to clipboard
- **Reset**: Revert to original wikitext if needed

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Copy your Firebase configuration to `.env.local`

### Gemini AI Setup (Optional)

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add the key to `.env.local` as `GEMINI_API_KEY`
3. Without an API key, the app uses template-based profile generation

## 🧪 Development

### Available Scripts

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

### Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Authentication**: Firebase Auth
- **AI**: Google Generative AI (Gemini)
- **HTTP Client**: Axios
- **Sanitization**: DOMPurify
- **Icons**: Lucide React

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linter (`pnpm lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Wikimedia Foundation](https://www.wikimedia.org/) for providing the MediaWiki API
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Google](https://ai.google.dev/) for the Gemini AI API
- All contributors who help improve this project

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/MabelMoncy/TharangRepo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MabelMoncy/TharangRepo/discussions)

## 🗺️ Roadmap

- [ ] Add support for more Wikimedia projects
- [ ] Implement collaborative editing
- [ ] Add profile templates library
- [ ] Support for multiple languages/i18n
- [ ] Export to PDF
- [ ] Mobile app version
- [ ] Integration with Wikimedia Commons for image upload

---

Made with ❤️ by [Mabel Anto Moncy](https://github.com/MabelMoncy)