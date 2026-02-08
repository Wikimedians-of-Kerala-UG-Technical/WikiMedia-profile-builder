# Architecture Guide

This document explains the architecture and design decisions of the Wiki Profile Builder application.

## Overview

Wiki Profile Builder is a modern web application built with Next.js 16 using the App Router architecture. It follows a component-based design with clear separation of concerns.

## Technology Stack

### Core Framework
- **Next.js 16.1**: React framework with App Router for server and client rendering
- **React 19.2**: UI library for building component-based interfaces
- **TypeScript 5.0**: Type-safe JavaScript with static typing

### Styling & UI
- **Tailwind CSS 4.0**: Utility-first CSS framework
- **Framer Motion 12**: Animation library for smooth transitions
- **Lucide React**: Icon library with consistent design

### State Management
- **Zustand 5.0**: Lightweight state management with persistence
- No Redux complexity - simple and performant

### Authentication
- **Firebase Auth**: Secure authentication with email/password
- Session persistence across page reloads

### External APIs
- **Wikimedia API**: Fetch and parse user profiles
- **Google Gemini AI**: AI-powered content generation
- **Axios**: HTTP client for API requests

### Development Tools
- **ESLint 9**: Code linting and style enforcement
- **PostCSS**: CSS processing for Tailwind
- **pnpm**: Fast, disk space efficient package manager

## Architecture Patterns

### 1. App Router Architecture

```
src/app/
├── page.tsx              # Home page (root route /)
├── layout.tsx            # Root layout with global providers
├── globals.css           # Global styles
├── editor/
│   └── page.tsx          # Editor page (/editor)
├── generator/
│   └── page.tsx          # Generator page (/generator)
├── login/
│   └── page.tsx          # Login page (/login)
├── register/
│   └── page.tsx          # Register page (/register)
└── api/
    ├── parse/
    │   └── route.ts      # API route for parsing wikitext
    ├── generate-profile/
    │   └── route.ts      # API route for profile generation
    └── ai-edit/
        └── route.ts      # API route for AI editing
```

**Benefits**:
- File-system based routing
- Server and client components
- API routes co-located with pages
- Automatic code splitting
- Built-in optimization

### 2. Component Architecture

Components are organized by functionality:

```
src/components/
├── auth/
│   └── AuthProvider.tsx      # Authentication context provider
├── editor/
│   └── AIEditModal.tsx       # AI editing modal component
├── layout/
│   └── Header.tsx            # Global header with navigation
├── profile/
│   ├── BasicInfoForm.tsx     # Profile creation form
│   ├── CategoryListEditor.tsx # Category management
│   ├── ColorPaletteEditor.tsx # Color customization
│   └── ImageUploader.tsx     # Image upload component
└── ui/
    ├── Button.tsx            # Reusable button component
    ├── Card.tsx              # Card container component
    ├── ErrorBanner.tsx       # Error display component
    ├── Input.tsx             # Form input component
    ├── Select.tsx            # Select dropdown component
    ├── Spinner.tsx           # Loading spinner component
    └── Textarea.tsx          # Text area component
```

**Design Principles**:
- **Single Responsibility**: Each component has one clear purpose
- **Reusability**: UI components are generic and reusable
- **Composability**: Complex UIs built from simple components
- **Type Safety**: All props are typed with TypeScript interfaces

### 3. State Management

**Zustand Store Structure**:

```typescript
// src/store/useStore.ts
interface Store {
  // User data
  username: string;
  selectedDomain: string;
  
  // Content
  rawWikitext: string;
  renderedHtml: string;
  
  // Profile creation
  categories: Category[];
  images: Image[];
  palette: ColorPalette;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUsername: (username: string) => void;
  setRawWikitext: (text: string) => void;
  // ... more actions
}
```

**Benefits**:
- No boilerplate (unlike Redux)
- Built-in persistence with localStorage
- TypeScript support out of the box
- React hooks integration
- Small bundle size

### 4. Service Layer

Services encapsulate external API interactions:

```typescript
// src/services/wikiService.ts
export async function fetchProfile(
  username: string,
  domain: string
): Promise<FetchProfileResult>

export async function parseWikitext(
  wikitext: string,
  domain: string
): Promise<ParseResult>
```

**Benefits**:
- Clean separation from UI components
- Easier testing and mocking
- Centralized error handling
- Type-safe API contracts

## Data Flow

### Fetching an Existing Profile

```
User Input (Home Page)
    ↓
Zustand Store (setUsername, setDomain)
    ↓
fetchProfile() Service (wikiService.ts)
    ↓
Wikimedia API Request
    ↓
Store Wikitext in Zustand
    ↓
Navigate to Editor (/editor)
    ↓
Editor Loads Wikitext from Store
    ↓
Auto-parse to HTML (parseWikitext)
    ↓
Display Split View (Code + Preview)
```

### Creating a New Profile

```
User Input (Home Page - Create Tab)
    ↓
BasicInfoForm Component
    ↓
Add Categories/Images/Colors
    ↓
Click Generate
    ↓
POST /api/generate-profile
    ↓
Gemini AI Generation (or Template Fallback)
    ↓
Store Generated Wikitext
    ↓
Navigate to Generator (/generator)
    ↓
Display Animated Code Output
    ↓
Navigate to Editor for Refinement
```

### Editing in the Editor

```
Load Wikitext from Store
    ↓
User Edits Wikitext (Code View)
    ↓
Debounced Parse Request
    ↓
POST /api/parse
    ↓
Update Preview Pane (HTML)
    ↓
User Can Toggle Views (Code/Preview/Split)
    ↓
Copy Final Wikitext to Clipboard
```

## Key Design Decisions

### 1. Why Next.js App Router?

**Chosen**: Next.js 16 with App Router
**Alternatives Considered**: Pages Router, Create React App, Vite

**Reasons**:
- Server components for better performance
- Built-in API routes (no separate backend needed)
- File-system based routing (intuitive)
- Excellent TypeScript support
- Vercel deployment optimization

### 2. Why Zustand over Redux?

**Chosen**: Zustand
**Alternatives Considered**: Redux Toolkit, Context API, Jotai

**Reasons**:
- Minimal boilerplate (5x less code than Redux)
- Built-in persistence
- No provider wrapping needed
- Better TypeScript inference
- Smaller bundle size (~1KB vs Redux ~20KB)

### 3. Why Tailwind CSS?

**Chosen**: Tailwind CSS 4.0
**Alternatives Considered**: CSS Modules, Styled Components, Emotion

**Reasons**:
- Rapid development with utility classes
- Consistent design system
- Built-in responsive design
- Tree-shaking for production (small CSS bundle)
- Great IDE support with IntelliSense

### 4. Why Firebase for Auth?

**Chosen**: Firebase Authentication
**Alternatives Considered**: NextAuth.js, Auth0, Supabase

**Reasons**:
- Easy setup and integration
- Handles security best practices
- Free tier generous for small projects
- Built-in session management
- Good documentation and community

### 5. Why Gemini AI?

**Chosen**: Google Gemini AI (gemini-2.5-flash)
**Alternatives Considered**: OpenAI GPT-4, Anthropic Claude

**Reasons**:
- Fast response times (flash model)
- Good at structured output (wikitext)
- Generous free tier
- Easy API integration
- Template fallback available if API fails

## Security Considerations

### Environment Variables
- All API keys stored in `.env.local` (not committed)
- Environment variables validated at runtime
- Separate public/private variables

### Content Sanitization
- **DOMPurify**: Sanitizes HTML before rendering
- Prevents XSS attacks in preview pane
- Filters dangerous tags and attributes

### Authentication
- Firebase handles secure password hashing
- Session tokens stored securely
- Protected routes check authentication state

### API Security
- Input validation on all API routes
- Rate limiting considerations for external APIs
- Error messages don't leak sensitive info

## Performance Optimizations

### Code Splitting
- Next.js automatic code splitting per route
- Dynamic imports for heavy components
- Smaller initial bundle size

### Image Optimization
- Next.js Image component for optimized loading
- Lazy loading images below the fold
- WebP format with fallbacks

### Debouncing
- Parse requests debounced (useDebounce hook)
- Reduces API calls during typing
- Better UX with 500ms delay

### Caching
- Zustand state persisted to localStorage
- Reduces redundant API calls
- Faster page loads after first visit

### Bundle Size
- Tree-shaking removes unused code
- Lucide icons imported individually
- Total bundle ~200KB gzipped

## Error Handling

### Layered Error Handling

1. **Service Layer**: Catch API errors, return structured results
2. **Component Layer**: Display user-friendly error messages
3. **Global Layer**: Catch unexpected errors, show fallback UI

### Error Types

```typescript
// API Errors
{ success: false, error: "User not found" }

// Validation Errors
{ field: "username", error: "Username is required" }

// Network Errors
{ error: "Network request failed" }

// AI Errors
{ error: "AI service unavailable", fallback: true }
```

### User Feedback

- Toast notifications for temporary messages
- Inline error messages for form validation
- Error banners for page-level issues
- Fallback content when features unavailable

## Testing Strategy

### Recommended Testing Approach

1. **Unit Tests**: Test utility functions and hooks
2. **Component Tests**: Test components in isolation
3. **Integration Tests**: Test user flows end-to-end
4. **Manual Testing**: Test across browsers and devices

### Testing Tools (Not Yet Implemented)

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking

## Scalability Considerations

### Current Scale
- Designed for individual users
- Stateless API routes (horizontally scalable)
- Client-side rendering for most interactions

### Future Enhancements
- Add database for saving profiles
- Implement server-side caching
- Add CDN for static assets
- Implement real-time collaboration
- Add analytics and monitoring

## Deployment Architecture

### Recommended Deployment: Vercel

```
                    ┌──────────────┐
                    │   Vercel     │
                    │   (Hosting)  │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼─────┐ ┌─────▼────┐ ┌──────▼──────┐
     │  Next.js   │ │   API    │ │   Static    │
     │   Pages    │ │  Routes  │ │   Assets    │
     └──────┬─────┘ └─────┬────┘ └──────┬──────┘
            │              │              │
            └──────────────┼──────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼─────┐ ┌─────▼────┐ ┌──────▼──────┐
     │  Firebase  │ │ Wikimedia│ │   Gemini    │
     │    Auth    │ │    API   │ │     AI      │
     └────────────┘ └──────────┘ └─────────────┘
```

**Benefits**:
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Serverless functions for API routes
- Preview deployments for PRs

### Environment Configuration

```bash
# Production environment variables on Vercel
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
# ... other Firebase config

GEMINI_API_KEY=xxx (server-only, not exposed)
```

## File Structure Best Practices

```
wiki-profile-builder/
├── src/                    # Source code
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── store/              # State management
│   └── types/              # TypeScript types (if needed)
├── public/                 # Static files
├── docs/                   # Documentation (optional)
├── .env.local              # Local environment (not committed)
├── .env.example            # Example environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── postcss.config.mjs      # PostCSS configuration
└── README.md               # Project documentation
```

## Future Architecture Improvements

1. **Add Database Layer**: Store user profiles persistently
2. **Implement Caching**: Redis or in-memory cache for API responses
3. **Add Monitoring**: Sentry for error tracking, analytics
4. **Improve Testing**: Comprehensive test suite
5. **Add i18n**: Support multiple languages
6. **Optimize Builds**: Analyze bundle size, lazy load more
7. **Add Rate Limiting**: Protect API routes from abuse
8. **Implement Webhooks**: Integration with Wikimedia events

---

This architecture provides a solid foundation that's maintainable, scalable, and developer-friendly.
