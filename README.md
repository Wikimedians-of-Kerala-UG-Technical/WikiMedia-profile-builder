# Wiki Media Profile Builder.

A modern **Wiki Profile Builder** application that allows users to fetch, edit, and generate their profile for their Wikimedia account across multiple wiki projects.

## 📋 Overview

Wiki Profile Builder is a Next.js-based web application that provides an intuitive interface for managing Wikipedia and Wikimedia user profiles. The application supports fetching existing profiles from various Wikimedia projects, editing them with a visual editor, and generating new profiles from scratch using AI assistance.

## ✨ Features

- **Multi-Wiki Support**: Work with profiles across multiple Wikimedia projects:
  - Meta-Wiki
  - English Wikipedia
  - Wikimedia Commons
  - Wikidata
  - English Wiktionary

- **Profile Management**:
  - Fetch existing user profiles from any supported wiki
  - Live Wikitext editing with real-time preview
  - Parse and render Wikitext to HTML
  - Create new profiles from scratch

- **AI-Powered Generation**: 
  - Generate profile content using Google's Generative AI
  - Smart suggestions for profile improvements

- **Firebase Integration**:
  - User authentication (Email/Password & Google Sign-In)
  - Cloud storage for profile images
  - Persistent user sessions

- **Modern UI/UX**:
  - Clean, responsive design with Tailwind CSS
  - Smooth animations using Framer Motion
  - Icon support via Lucide React
  - Real-time validation and error handling

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16.1.6](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.3](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion 12.33.0](https://www.framer.com/motion/)** - Animation library
- **[Zustand 5.0.11](https://zustand-demo.pmnd.rs/)** - State management

### Backend & Services
- **[Firebase 12.9.0](https://firebase.google.com/)**:
  - Authentication (Email & Google OAuth)
  - Cloud Storage for images
- **[Google Generative AI 0.24.1](https://ai.google.dev/)** - AI content generation
- **[Axios 1.13.4](https://axios-http.com/)** - HTTP client for API requests

### Development Tools
- **[ESLint 9](https://eslint.org/)** - Code linting
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

## 📦 Installation

### Prerequisites
- Node.js 20.x or higher
- pnpm (recommended) or npm/yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MabelMoncy/TharangRepo.git
   cd TharangRepo/wiki-profile-builder
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
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

   # Google Generative AI (Optional for AI features)
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Usage

### Fetching an Existing Profile
1. Select your target wiki from the dropdown
2. Enter your wiki username
3. Click "Fetch Profile" to load your existing profile
4. Edit the Wikitext in the editor
5. Preview changes in real-time

### Creating a New Profile
1. Switch to the "Create New" tab
2. Fill in your basic information
3. Add categories and images
4. Use AI suggestions (optional)
5. Generate and preview your profile

## 📁 Project Structure

```
wiki-profile-builder/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── parse/         # Wikitext parser endpoint
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   ├── profile/           # Profile-related components
│   │   └── ui/                # Reusable UI components
│   ├── services/              # External service integrations
│   │   ├── firebase.ts        # Firebase configuration & helpers
│   │   └── wikiService.ts     # Wikimedia API client
│   └── store/                 # State management
│       └── useStore.ts        # Zustand store
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
```

## 🌐 Wikimedia API Integration

The application uses the [MediaWiki Action API](https://www.mediawiki.org/wiki/API:Main_page) to:
- Fetch user profile pages
- Parse Wikitext to HTML
- Handle ResourceLoader modules for proper styling

All API requests follow Wikimedia's [API Etiquette](https://www.mediawiki.org/wiki/API:Etiquette) guidelines with proper user-agent strings.

## 🔐 Security Features

- DOMPurify integration for XSS protection
- Firebase Authentication for secure user management
- Environment variable protection for sensitive keys
- CORS-aware API routes

## 📄 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

For questions or support, please open an issue in the [GitHub repository](https://github.com/MabelMoncy/TharangRepo/issues).

## 🙏 Acknowledgments

- [Wikimedia Foundation](https://wikimediafoundation.org/) for their APIs and documentation
- [Next.js Team](https://nextjs.org/) for the excellent React framework
- [Vercel](https://vercel.com/) for hosting and deployment platform
- All open-source contributors who made this project possible

---

**Built with ❤️ for the Wikimedia community**
