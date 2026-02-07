import axios from 'axios';

const USER_AGENT = 'WikiProfileBuilder/1.0 (https://github.com/wiki-profile-builder; contact@example.com)';

/**
 * Get the base API URL for a Wikimedia project
 */
export const getBaseUrl = (domain: string = 'meta.wikimedia.org'): string => {
  return `https://${domain}/w/api.php`;
};

/**
 * Available Wikimedia domains
 */
export const WIKI_DOMAINS = [
  { value: 'meta.wikimedia.org', label: 'Meta-Wiki' },
  { value: 'en.wikipedia.org', label: 'English Wikipedia' },
  { value: 'commons.wikimedia.org', label: 'Wikimedia Commons' },
  { value: 'www.wikidata.org', label: 'Wikidata' },
  { value: 'en.wiktionary.org', label: 'English Wiktionary' },
] as const;

export interface FetchProfileResult {
  success: boolean;
  wikitext?: string;
  missing?: boolean;
  error?: string;
}

export interface ParseResult {
  success: boolean;
  html?: string;
  error?: string;
}

/**
 * Fetch a user's profile page wikitext from Wikimedia
 */
export async function fetchProfile(
  username: string,
  domain: string = 'meta.wikimedia.org',
  signal?: AbortSignal
): Promise<FetchProfileResult> {
  try {
    const baseUrl = getBaseUrl(domain);
    const params = new URLSearchParams({
      action: 'query',
      titles: `User:${username}`,
      prop: 'revisions',
      rvprop: 'content',
      rvslots: 'main',
      format: 'json',
      origin: '*',
    });

    const response = await axios.get(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Api-User-Agent': USER_AGENT,
      },
      signal,
    });

    const pages = response.data.query?.pages;
    if (!pages) {
      return { success: false, error: 'Invalid API response' };
    }

    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (page.missing !== undefined) {
      return { success: true, missing: true };
    }

    const wikitext = page.revisions?.[0]?.slots?.main?.['*'] || 
                     page.revisions?.[0]?.['*'] || '';

    return { success: true, wikitext };
  } catch (error) {
    if (axios.isCancel(error)) {
      return { success: false, error: 'Request cancelled' };
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

/**
 * Parse Wikitext to HTML using local API route (avoids CORS issues)
 */
export async function parseWikitext(
  text: string,
  domain: string = 'meta.wikimedia.org',
  signal?: AbortSignal
): Promise<ParseResult> {
  try {
    const response = await fetch('/api/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, domain }),
      signal,
    });

    const data = await response.json();
    
    if (!data.success) {
      return { success: false, error: data.error || 'Failed to parse wikitext' };
    }

    return { success: true, html: data.html };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export interface ConvertResult {
  success: boolean;
  wikitext?: string;
  error?: string;
}

/**
 * Convert edited HTML back to Wikitext
 */
export async function convertHtmlToWikitext(
  html: string,
  signal?: AbortSignal
): Promise<ConvertResult> {
  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html }),
      signal,
    });

    const data = await response.json();
    
    if (!data.success) {
      return { success: false, error: data.error || 'Failed to convert HTML' };
    }

    return { success: true, wikitext: data.wikitext };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Request cancelled' };
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}
