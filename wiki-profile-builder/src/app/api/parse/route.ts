import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT = 'WikiProfileBuilder/1.0 (https://github.com/wiki-profile-builder; contact@example.com)';

/**
 * Fetch CSS for ResourceLoader modules from MediaWiki's load.php
 * These are additional styles used by templates (userboxes, infoboxes, etc.)
 */
async function fetchModuleStyles(modules: string[], domain: string): Promise<string> {
  if (!modules || modules.length === 0) {
    return '';
  }

  try {
    // ResourceLoader accepts pipe-separated module names
    const moduleList = modules.join('|');
    const loadUrl = `https://${domain}/w/load.php?modules=${encodeURIComponent(moduleList)}&only=styles`;

    const response = await fetch(loadUrl, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch module styles: ${response.status}`);
      return '';
    }

    const css = await response.text();
    return css;
  } catch (error) {
    console.warn('Error fetching module styles:', error);
    return '';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, domain = 'meta.wikimedia.org' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'No text provided' },
        { status: 400 }
      );
    }

    const baseUrl = `https://${domain}/w/api.php`;

    // Request text, modules, and modulestyles from MediaWiki API
    // - text: parsed HTML (includes inline <templatestyles> CSS automatically)
    // - modulestyles: list of ResourceLoader CSS modules used by templates
    const formData = new URLSearchParams({
      action: 'parse',
      text: text,
      prop: 'text|modulestyles',
      disablelimitreport: '1',
      format: 'json',
      origin: '*',
      contentmodel: 'wikitext',
    });

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Api-User-Agent': USER_AGENT,
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const html = data.parse?.text?.['*'];
    const moduleStyles: string[] = data.parse?.modulestyles || [];

    if (!html) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse wikitext' },
        { status: 500 }
      );
    }

    // Fetch CSS for any ResourceLoader modules used by templates
    // This handles styles for userboxes, infoboxes, and other wiki components
    const modulesCss = await fetchModuleStyles(moduleStyles, domain);

    // Prepend module styles to the HTML so they apply to the parsed content
    // The HTML already contains inline <style> tags for <templatestyles> (MediaWiki does this automatically)
    let enhancedHtml = html;
    if (modulesCss) {
      enhancedHtml = `<style data-wiki-modules>${modulesCss}</style>${html}`;
    }

    return NextResponse.json({ 
      success: true, 
      html: enhancedHtml,
      // Include module info for debugging purposes
      modulesLoaded: moduleStyles.length > 0 ? moduleStyles : undefined
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
