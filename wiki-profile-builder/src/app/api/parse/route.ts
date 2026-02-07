import { NextRequest, NextResponse } from 'next/server';

const USER_AGENT = 'WikiProfileBuilder/1.0 (https://github.com/wiki-profile-builder; contact@example.com)';

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

    const formData = new URLSearchParams({
      action: 'parse',
      text: text,
      prop: 'text',
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

    if (!html) {
      return NextResponse.json(
        { success: false, error: 'Failed to parse wikitext' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, html });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
