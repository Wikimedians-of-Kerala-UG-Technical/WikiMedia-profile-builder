import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ProfileData {
  username: string;
  realName?: string;
  location?: string;
  languages?: string;
  interests?: string;
  aboutMe?: string;
  occupation?: string;
  joinYear?: string;
}

const SYSTEM_PROMPT = `You are an expert Wikimedia markup generator. Generate a professional user profile page in MediaWiki wikitext format based.Always Add beautiful styling to it.

IMPORTANT GUIDELINES:
1. Use proper MediaWiki syntax (not Markdown)
2. Include inline CSS styling within wiki tables for visual appeal
3. Use wikitable class with custom styling (background colors, borders, padding)
4. Create an attractive user information box (infobox style) on the right side
5. Use proper wiki heading syntax (== Heading ==)
6. Use wiki list syntax (* for bullets, # for numbered)
7. Include relevant categories at the end
8. Use wiki link syntax [[Page|Display Text]] for internal links
9. Add userboxes if appropriate using {{Babel}} or similar templates where applicable
10. Make the profile look professional and well-formatted

Output ONLY the wikitext code, no explanations or markdown code blocks.`;

export async function POST(request: NextRequest) {
  let body: ProfileData | null = null;
  
  try {
    body = await request.json();
    
    // Validate required fields
    if (!body?.username?.trim()) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Fallback to template-based generation if no API key
      const wikitext = generateFallbackMarkup(body);
      return NextResponse.json({ wikitext, source: 'template' });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-1.5-flash as it's more widely available
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const userPrompt = buildUserPrompt(body);

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: userPrompt }
      ]);

      const response = result.response;
      const wikitext = response.text().trim();

      // Clean up any markdown code block wrappers if present
      const cleanedWikitext = wikitext
        .replace(/^```(?:wikitext|mediawiki|wiki)?\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();

      return NextResponse.json({ wikitext: cleanedWikitext, source: 'ai' });
    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      // Fall through to template-based generation
      const wikitext = generateFallbackMarkup(body);
      return NextResponse.json({ wikitext, source: 'template' });
    }

  } catch (error) {
    console.error('Profile generation error:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // If AI fails and we have the body, try fallback
    if (body?.username) {
      try {
        const wikitext = generateFallbackMarkup(body);
        return NextResponse.json({ wikitext, source: 'template' });
      } catch (fallbackError) {
        console.error('Fallback generation error:', fallbackError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    );
  }
}

function buildUserPrompt(data: ProfileData): string {
  const parts: string[] = [
    `Generate a Wikimedia user profile page for the following user:`,
    ``,
    `Username: ${data.username}`,
  ];

  if (data.realName) {
    parts.push(`Real Name: ${data.realName}`);
  }
  if (data.location) {
    parts.push(`Location: ${data.location}`);
  }
  if (data.occupation) {
    parts.push(`Occupation: ${data.occupation}`);
  }
  if (data.joinYear) {
    parts.push(`Member since: ${data.joinYear}`);
  }
  if (data.languages) {
    parts.push(`Languages: ${data.languages}`);
  }
  if (data.interests) {
    parts.push(`Interests/Hobbies: ${data.interests}`);
  }
  if (data.aboutMe) {
    parts.push(`About Me: ${data.aboutMe}`);
  }

  parts.push('');
  parts.push('Create a visually appealing profile with:');
  parts.push('- A styled infobox/userbox on the right with user details');
  parts.push('- Proper section headings');
  parts.push('- Styled tables with inline CSS (background colors like #0057B7 for headers)');
  parts.push('- Language babel boxes if languages are provided');
  parts.push('- Appropriate categories');
  parts.push('- A welcoming talk page link');

  return parts.join('\n');
}

function generateFallbackMarkup(data: ProfileData): string {
  const sections: string[] = [];

  // Header with styled user info box
  sections.push(`{| class="wikitable" style="float:right; margin-left:1em; width:280px; border:2px solid #0057B7;"`);
  sections.push(`|-`);
  sections.push(`! colspan="2" style="background:#0057B7; color:white; font-size:1.2em; padding:10px;" | ${data.username || 'User'}`);
  
  if (data.realName) {
    sections.push(`|-`);
    sections.push(`| style="background:#f8f9fa; padding:5px; font-weight:bold;" | Name`);
    sections.push(`| style="padding:5px;" | ${data.realName}`);
  }
  
  if (data.location) {
    sections.push(`|-`);
    sections.push(`| style="background:#f8f9fa; padding:5px; font-weight:bold;" | Location`);
    sections.push(`| style="padding:5px;" | ${data.location}`);
  }
  
  if (data.occupation) {
    sections.push(`|-`);
    sections.push(`| style="background:#f8f9fa; padding:5px; font-weight:bold;" | Occupation`);
    sections.push(`| style="padding:5px;" | ${data.occupation}`);
  }
  
  if (data.joinYear) {
    sections.push(`|-`);
    sections.push(`| style="background:#f8f9fa; padding:5px; font-weight:bold;" | Member since`);
    sections.push(`| style="padding:5px;" | ${data.joinYear}`);
  }
  
  sections.push(`|}`);
  sections.push('');

  // Welcome message
  sections.push(`<div style="font-size:1.1em; color:#333;">`);
  sections.push(`'''Welcome to my user page!''' I am an active contributor to the Wikimedia projects.`);
  sections.push(`</div>`);
  sections.push('');

  // About Me section
  if (data.aboutMe) {
    sections.push(`== About me ==`);
    sections.push(`<div style="background:#f8f9fa; padding:15px; border-radius:8px; border-left:4px solid #0057B7;">`);
    sections.push(data.aboutMe);
    sections.push(`</div>`);
    sections.push('');
  }

  // Languages section with styled list
  if (data.languages) {
    sections.push(`== Languages ==`);
    sections.push(`{| class="wikitable" style="border-collapse:collapse;"`);
    sections.push(`|-`);
    sections.push(`! style="background:#0057B7; color:white; padding:8px;" | Language`);
    sections.push(`! style="background:#0057B7; color:white; padding:8px;" | Proficiency`);
    
    const langs = data.languages.split(',').map(l => l.trim()).filter(Boolean);
    langs.forEach(lang => {
      const parts = lang.match(/(.+?)\s*\((.+?)\)/) || [lang, lang, 'Native/Fluent'];
      sections.push(`|-`);
      sections.push(`| style="padding:6px;" | ${parts[1]}`);
      sections.push(`| style="padding:6px;" | ${parts[2] || 'Fluent'}`);
    });
    sections.push(`|}`);
    sections.push('');
  }

  // Interests section
  if (data.interests) {
    sections.push(`== Interests ==`);
    sections.push(`<div style="display:flex; flex-wrap:wrap; gap:8px;">`);
    const interestList = data.interests.split(',').map(i => i.trim()).filter(Boolean);
    interestList.forEach(interest => {
      sections.push(`<span style="background:#e3f2fd; color:#0057B7; padding:5px 12px; border-radius:15px; font-size:0.9em;">{{·}} ${interest}</span>`);
    });
    sections.push(`</div>`);
    sections.push('');
  }

  // Contact section
  sections.push(`== Contact ==`);
  sections.push(`{| style="background:#fff3cd; padding:15px; border-radius:8px; border:1px solid #ffc107; width:100%;"`);
  sections.push(`|-`);
  sections.push(`| style="font-size:1.1em;" | 📬 Feel free to leave a message on my [[User talk:${data.username || 'Username'}|talk page]]!`);
  sections.push(`|}`);
  sections.push('');

  // Categories
  sections.push(`[[Category:Wikipedians]]`);
  if (data.location) {
    sections.push(`[[Category:Wikipedians in ${data.location.split(',')[0].trim()}]]`);
  }

  return sections.join('\n');
}
