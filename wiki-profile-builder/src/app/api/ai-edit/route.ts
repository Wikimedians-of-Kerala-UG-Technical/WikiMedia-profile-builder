import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface EditRequest {
  originalWikitext: string;
  selectedText: string;
  instruction: string;
  context?: string;
}

const SYSTEM_PROMPT = `You are an expert Wikimedia markup editor. Your task is to modify ONLY the selected portion of wikitext based on the user's instruction.

CRITICAL RULES:
1. ONLY modify the specific selected text provided
2. Keep all other parts of the wikitext EXACTLY the same
3. Use proper MediaWiki syntax (not Markdown)
4. Preserve any existing styling and formatting in the selection
5. If adding new content, match the style of the surrounding content
6. Output the complete modified wikitext with ONLY the targeted section changed

FORMATTING GUIDELINES:
- Use proper wiki heading syntax (== Heading ==)
- Use wiki list syntax (* for bullets, # for numbered)
- Use wiki link syntax [[Page|Display Text]] for internal links
- Include inline CSS styling within wiki tables for visual appeal
- Use '''bold''' and ''italic'' wiki formatting

You MUST output ONLY the complete modified wikitext. No explanations, no markdown code blocks.`;

export async function POST(request: NextRequest) {
  let body: EditRequest | null = null;

  try {
    body = await request.json();

    // Validate required fields
    if (!body?.originalWikitext?.trim()) {
      return NextResponse.json(
        { error: 'Original wikitext is required' },
        { status: 400 }
      );
    }

    if (!body?.instruction?.trim()) {
      return NextResponse.json(
        { error: 'Edit instruction is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'AI editing requires a Gemini API key. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 400 }
      );
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Use gemini-2.5-flash to match generate-profile route
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const userPrompt = buildEditPrompt(body);

      const result = await model.generateContent([
        { text: SYSTEM_PROMPT },
        { text: userPrompt },
      ]);

      const response = result.response;
      const modifiedWikitext = response.text().trim();

      // Clean up any markdown code block wrappers if present
      const cleanedWikitext = modifiedWikitext
        .replace(/^```(?:wikitext|mediawiki|wiki)?\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();

      return NextResponse.json({ wikitext: cleanedWikitext, success: true });
    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      
      // Return more specific error message
      const errorMessage = aiError instanceof Error ? aiError.message : 'Unknown AI error';
      return NextResponse.json(
        { error: `AI service error: ${errorMessage}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('AI edit error:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      return NextResponse.json(
        { error: `Request error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process AI edit request' },
      { status: 500 }
    );
  }
}

function buildEditPrompt(data: EditRequest): string {
  const parts: string[] = [
    `Here is the complete wikitext content:`,
    ``,
    `---BEGIN WIKITEXT---`,
    data.originalWikitext,
    `---END WIKITEXT---`,
    ``,
  ];

  if (data.selectedText?.trim()) {
    parts.push(`The user has selected this specific text to modify:`);
    parts.push(`---BEGIN SELECTION---`);
    parts.push(data.selectedText);
    parts.push(`---END SELECTION---`);
    parts.push(``);
  }

  parts.push(`User's edit instruction: "${data.instruction}"`);
  parts.push(``);
  parts.push(`IMPORTANT: Modify ONLY the selected text (or apply the instruction minimally if no selection). Keep everything else EXACTLY the same.`);
  parts.push(``);
  parts.push(`Output the complete modified wikitext:`);

  return parts.join('\n');
}
