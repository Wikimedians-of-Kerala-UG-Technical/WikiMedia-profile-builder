# API Documentation

This document describes the API endpoints and services used in the Wiki Profile Builder application.

## Table of Contents

- [API Routes](#api-routes)
  - [Parse Wikitext](#parse-wikitext)
  - [Generate Profile](#generate-profile)
  - [AI Edit](#ai-edit)
- [External Services](#external-services)
  - [Wikimedia API](#wikimedia-api)
  - [Firebase](#firebase)
  - [Google Gemini AI](#google-gemini-ai)

## API Routes

All API routes are located in `src/app/api/` and are Next.js API routes.

### Parse Wikitext

**Endpoint**: `POST /api/parse`

Converts wikitext markup to HTML using the Wikimedia API.

**Request Body**:
```json
{
  "wikitext": "== Heading ==\n* List item",
  "domain": "meta.wikimedia.org"
}
```

**Response** (Success):
```json
{
  "html": "<h2>Heading</h2><ul><li>List item</li></ul>"
}
```

**Response** (Error):
```json
{
  "error": "Error message"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `500`: Server error

**Implementation**: `src/app/api/parse/route.ts`

---

### Generate Profile

**Endpoint**: `POST /api/generate-profile`

Generates a Wikimedia user profile in wikitext format using AI or template-based generation.

**Request Body**:
```json
{
  "username": "JohnDoe",
  "realName": "John Doe",
  "location": "New York, USA",
  "occupation": "Software Engineer",
  "joinYear": "2024",
  "languages": "English (native), Spanish (fluent)",
  "interests": "Programming, Photography, Travel",
  "aboutMe": "I'm a software engineer passionate about open source.",
  "categories": [
    {
      "id": "contrib-1",
      "label": "My Contributions",
      "description": "Articles I've edited..."
    }
  ],
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "caption": "Photo description"
    }
  ],
  "palette": {
    "primary": "#0057B7",
    "accent": "#e3f2fd",
    "background": "#ffffff",
    "text": "#202122"
  }
}
```

**Response** (Success):
```json
{
  "wikitext": "Generated wikitext markup...",
  "source": "ai" // or "template"
}
```

**Response** (Error):
```json
{
  "error": "Username is required"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request (missing username)
- `500`: Server error

**Features**:
- Uses Google Gemini AI if `GEMINI_API_KEY` is configured
- Falls back to template-based generation if AI fails or is not configured
- Supports custom color palettes, categories, and images
- Generates MediaWiki-compatible markup with inline CSS styling

**Implementation**: `src/app/api/generate-profile/route.ts`

---

### AI Edit

**Endpoint**: `POST /api/ai-edit`

Uses AI to edit or refine a section of wikitext based on user instructions.

**Request Body**:
```json
{
  "wikitext": "Current wikitext content...",
  "instruction": "Make it more professional and add details"
}
```

**Response** (Success):
```json
{
  "wikitext": "Improved wikitext content..."
}
```

**Response** (Error):
```json
{
  "error": "Error message"
}
```

**Status Codes**:
- `200`: Success
- `400`: Invalid request
- `500`: Server error or AI not configured

**Implementation**: `src/app/api/ai-edit/route.ts`

---

## External Services

### Wikimedia API

The application integrates with the MediaWiki API to fetch and parse user profiles.

**Service File**: `src/services/wikiService.ts`

#### Functions

##### `fetchProfile(username, domain, signal?)`

Fetches a user's profile page from Wikimedia.

**Parameters**:
- `username` (string): The Wikimedia username
- `domain` (string): Wiki domain (e.g., "meta.wikimedia.org")
- `signal` (AbortSignal, optional): For cancelling requests

**Returns**: `Promise<FetchProfileResult>`
```typescript
interface FetchProfileResult {
  success: boolean;
  wikitext?: string;
  missing?: boolean;
  error?: string;
}
```

**Example**:
```typescript
const result = await fetchProfile('JohnDoe', 'en.wikipedia.org');
if (result.success && !result.missing) {
  console.log(result.wikitext);
}
```

##### `parseWikitext(wikitext, domain?)`

Converts wikitext to HTML using Wikimedia's parser.

**Parameters**:
- `wikitext` (string): The wikitext to parse
- `domain` (string, optional): Wiki domain for parsing context

**Returns**: `Promise<ParseResult>`
```typescript
interface ParseResult {
  success: boolean;
  html?: string;
  error?: string;
}
```

##### `convertHtmlToWikitext(html, domain?)`

Attempts to convert HTML back to wikitext (experimental).

**Parameters**:
- `html` (string): HTML content
- `domain` (string, optional): Wiki domain

**Returns**: `Promise<string>`

#### Supported Wikimedia Projects

```typescript
export const WIKI_DOMAINS = [
  { value: 'meta.wikimedia.org', label: 'Meta-Wiki' },
  { value: 'en.wikipedia.org', label: 'English Wikipedia' },
  { value: 'commons.wikimedia.org', label: 'Wikimedia Commons' },
  { value: 'www.wikidata.org', label: 'Wikidata' },
  { value: 'en.wiktionary.org', label: 'English Wiktionary' },
];
```

#### API Endpoints Used

- `action=query` - Fetch page content
- `action=parse` - Parse wikitext to HTML

**Rate Limiting**: The Wikimedia API has rate limits. The application includes a User-Agent header to identify itself.

---

### Firebase

Firebase is used for user authentication.

**Service File**: `src/services/firebase.ts`

#### Configuration

Set the following environment variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### Authentication Methods

- Email/Password authentication
- User registration
- User login
- Password reset
- Session persistence

#### Usage Example

```typescript
import { auth } from '@/services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

async function login(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}
```

---

### Google Gemini AI

Google's Gemini AI is used for intelligent profile generation and editing.

**Configuration**:
```env
GEMINI_API_KEY=your_api_key_here
```

#### Profile Generation

The AI generates complete Wikimedia user profiles from structured data.

**Model Used**: `gemini-2.5-flash`

**System Prompt**: Instructs the AI to:
- Use proper MediaWiki syntax
- Include inline CSS styling
- Create attractive infoboxes
- Format content professionally
- Add appropriate categories

#### AI Edit Feature

Allows users to refine sections of their profile using natural language instructions.

**Example Instructions**:
- "Make this section more professional"
- "Add more detail about my contributions"
- "Rewrite this in a friendlier tone"

#### Fallback Behavior

If the Gemini API is not configured or fails:
- Profile generation falls back to template-based generation
- AI edit features are disabled with appropriate error messages
- Users can still create profiles using templates

---

## Error Handling

All API routes follow consistent error handling patterns:

1. **Validation Errors** (400): Invalid input parameters
2. **Server Errors** (500): Internal errors or external API failures
3. **Success** (200): Request completed successfully

**Error Response Format**:
```json
{
  "error": "Human-readable error message"
}
```

## Rate Limiting

- **Wikimedia API**: Respects Wikimedia's rate limits
- **Gemini AI**: Subject to Google Cloud quotas
- **Firebase**: Subject to Firebase plan limits

## Security Considerations

- API keys are stored in environment variables
- User input is validated and sanitized
- DOMPurify is used to sanitize HTML content
- Firebase handles authentication securely
- CORS is configured for Next.js API routes

## Testing APIs

### Using cURL

**Parse Wikitext**:
```bash
curl -X POST http://localhost:3000/api/parse \
  -H "Content-Type: application/json" \
  -d '{"wikitext":"== Hello ==\nWorld","domain":"meta.wikimedia.org"}'
```

**Generate Profile**:
```bash
curl -X POST http://localhost:3000/api/generate-profile \
  -H "Content-Type: application/json" \
  -d '{"username":"TestUser","aboutMe":"Test description"}'
```

### Using Postman or Insomnia

1. Set method to `POST`
2. Set URL to the endpoint
3. Add `Content-Type: application/json` header
4. Add JSON body according to the schema
5. Send request

---

For implementation details, refer to the source code in `src/app/api/` and `src/services/`.
