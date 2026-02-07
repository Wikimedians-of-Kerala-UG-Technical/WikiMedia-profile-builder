import { NextRequest, NextResponse } from 'next/server';

/**
 * Convert HTML to Wikitext
 * This is a simplified converter - for production, you'd use Parsoid or a more robust solution
 */
function htmlToWikitext(html: string): string {
  let wikitext = html;

  // Remove wrapper divs from MediaWiki parser output
  wikitext = wikitext.replace(/<div class="mw-parser-output">([\s\S]*?)<\/div>/gi, '$1');

  // Convert headings
  wikitext = wikitext.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '= $1 =\n');
  wikitext = wikitext.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '== $1 ==\n');
  wikitext = wikitext.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '=== $1 ===\n');
  wikitext = wikitext.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '==== $1 ====\n');
  wikitext = wikitext.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '===== $1 =====\n');
  wikitext = wikitext.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '====== $1 ======\n');

  // Convert bold and italic
  wikitext = wikitext.replace(/<b[^>]*>(.*?)<\/b>/gi, "'''$1'''");
  wikitext = wikitext.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "'''$1'''");
  wikitext = wikitext.replace(/<i[^>]*>(.*?)<\/i>/gi, "''$1''");
  wikitext = wikitext.replace(/<em[^>]*>(.*?)<\/em>/gi, "''$1''");

  // Convert links
  wikitext = wikitext.replace(/<a[^>]*href="\/wiki\/([^"]*)"[^>]*>(.*?)<\/a>/gi, '[[$1|$2]]');
  wikitext = wikitext.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$1 $2]');

  // Convert lists
  wikitext = wikitext.replace(/<ul[^>]*>/gi, '');
  wikitext = wikitext.replace(/<\/ul>/gi, '\n');
  wikitext = wikitext.replace(/<ol[^>]*>/gi, '');
  wikitext = wikitext.replace(/<\/ol>/gi, '\n');
  wikitext = wikitext.replace(/<li[^>]*>(.*?)<\/li>/gi, '* $1\n');

  // Convert paragraphs
  wikitext = wikitext.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Convert line breaks
  wikitext = wikitext.replace(/<br\s*\/?>/gi, '\n');

  // Convert horizontal rules
  wikitext = wikitext.replace(/<hr[^>]*>/gi, '----\n');

  // Convert code/pre
  wikitext = wikitext.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '<syntaxhighlight>\n$1\n</syntaxhighlight>\n');
  wikitext = wikitext.replace(/<code[^>]*>(.*?)<\/code>/gi, '<code>$1</code>');

  // Convert tables (basic)
  wikitext = wikitext.replace(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>/gi, '{| class="wikitable"\n');
  wikitext = wikitext.replace(/<table[^>]*>/gi, '{|\n');
  wikitext = wikitext.replace(/<\/table>/gi, '|}\n');
  wikitext = wikitext.replace(/<tr[^>]*>/gi, '|-\n');
  wikitext = wikitext.replace(/<\/tr>/gi, '');
  wikitext = wikitext.replace(/<th[^>]*>(.*?)<\/th>/gi, '! $1\n');
  wikitext = wikitext.replace(/<td[^>]*>(.*?)<\/td>/gi, '| $1\n');

  // Convert images
  wikitext = wikitext.replace(/<img[^>]*src="[^"]*\/([^/"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, '[[File:$1|$2]]');

  // Convert divs and spans (strip them but keep content)
  wikitext = wikitext.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n');
  wikitext = wikitext.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

  // Remove remaining HTML tags
  wikitext = wikitext.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  wikitext = wikitext.replace(/&nbsp;/g, ' ');
  wikitext = wikitext.replace(/&amp;/g, '&');
  wikitext = wikitext.replace(/&lt;/g, '<');
  wikitext = wikitext.replace(/&gt;/g, '>');
  wikitext = wikitext.replace(/&quot;/g, '"');
  wikitext = wikitext.replace(/&#39;/g, "'");

  // Clean up extra whitespace
  wikitext = wikitext.replace(/\n{3,}/g, '\n\n');
  wikitext = wikitext.trim();

  return wikitext;
}

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { success: false, error: 'No HTML provided' },
        { status: 400 }
      );
    }

    const wikitext = htmlToWikitext(html);

    return NextResponse.json({ success: true, wikitext });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
