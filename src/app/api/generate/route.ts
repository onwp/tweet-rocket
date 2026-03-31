import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ALGORITHM_SYSTEM_PROMPT } from '@/lib/algorithm';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const apiKey =
      process.env.ANTHROPIC_API_KEY || request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'API key required',
          message:
            'Set ANTHROPIC_API_KEY in your environment or provide your key in Settings.',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mode, content, tone } = body as {
      mode: 'write' | 'rewrite' | 'reply';
      content: string;
      tone?: string;
    };

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Content too long (max 2000 characters)' },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });

    let userPrompt: string;

    if (mode === 'reply') {
      userPrompt = `You are crafting high-impact REPLIES to someone else's tweet. The goal is to write replies that:
1. Maximize the 75x reply algorithm signal (the #1 ranking factor)
2. Add genuine value so the original author responds back (creating the coveted back-and-forth conversation loop)
3. Make the replier look like a knowledgeable, interesting person worth following (drives profile clicks + follows)
4. Get bookmarked/liked by others reading the thread

Original tweet to reply to:
"""
${content.trim()}
"""

Tone: ${tone || 'engaging'}

Generate 3 reply variations using DIFFERENT strategies:
- Variation 1: Add unique insight or data the original tweet missed
- Variation 2: Share a personal experience or contrarian but respectful take
- Variation 3: Ask a thought-provoking follow-up question that deepens the conversation

Requirements:
- Each reply MUST be under 280 characters
- Be genuinely valuable — not "Great post!" fluff
- Replies should make the original author WANT to respond
- NO external links
- Be conversational and authentic, not try-hard
- Show expertise without being condescending
- Each reply should work as a standalone valuable comment`;
    } else if (mode === 'rewrite') {
      userPrompt = `Rewrite this tweet to maximize algorithmic reach on X. Generate 3 optimized variations that keep the core message but dramatically improve engagement potential.

Original tweet:
"""
${content.trim()}
"""

Requirements:
- Keep the core message/meaning intact
- Each variation should use a DIFFERENT hook and structure
- Apply all algorithm optimization principles
- Each tweet MUST be under 280 characters
- NO external links in tweet text (suggest putting them in a reply if relevant)
- Improve hook, add line breaks, encourage replies
- Be specific and valuable, not generic engagement-bait`;
    } else {
      userPrompt = `Write 3 viral tweet variations about this topic/idea:

"""
${content.trim()}
"""

Tone: ${tone || 'engaging'}

Requirements:
- Each tweet MUST be under 280 characters
- Each variation should use a DIFFERENT hook style
- Apply all algorithm optimization principles
- Be specific, actionable, and genuinely valuable
- NO external links
- Use line breaks for readability
- Include a natural question or CTA to drive replies`;
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      system: ALGORITHM_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text =
      response.content[0].type === 'text' ? response.content[0].text : '';

    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*"tweets"[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: text },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const error = err as Error & { status?: number };
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
