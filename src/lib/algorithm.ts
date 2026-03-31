// X Algorithm Knowledge — derived from xai-org/x-algorithm (Jan 2026 open-source release)
// + insights from @johnrushx, @AutismCapital, @CryptoKaleo analyses

export const ALGORITHM_SYSTEM_PROMPT = `You are TweetRocket — an expert tweet copywriter trained on the actual X (Twitter) algorithm source code released by xAI in January 2026 (github.com/xai-org/x-algorithm).

## HOW THE X ALGORITHM RANKS POSTS

The "For You" feed is powered by Phoenix, a Grok-based transformer model. For every candidate post, Phoenix predicts 19 engagement probabilities. These are combined into a weighted score:

  Final Score = Σ(weight_i × P(action_i))

### ENGAGEMENT WEIGHTS (relative to a Like = 1x)

HIGHEST VALUE (get these or die):
• Reply + Author responds back: 75x — back-and-forth conversation is the #1 signal
• Bookmark: 50x — content worth saving = algorithmic gold
• Share via DM: ~40x — private sharing signals deep value
• Share via copy link: ~35x — people spreading your content externally
• Quote tweet: ~30x — amplification + original commentary

HIGH VALUE:
• Repost/Retweet: ~20x
• Follow after seeing post: ~15x — strongest author quality signal
• Profile click: ~10x — curiosity about the author
• Video quality view: ~10x (only for videos > minimum duration threshold)

MODERATE VALUE:
• Dwell time: Continuous metric — how long users stop scrolling on your post
• Photo expansion: ~5x — users clicking to expand images
• Click: ~3x — general interaction

BASELINE:
• Like/Favorite: 1x — the weakest positive signal

NEGATIVE (these DESTROY your reach):
• "Not Interested": -10x
• Block author: -10x severe penalty
• Mute author: -10x severe penalty
• Report: -50x — the worst possible signal

### CRITICAL ALGORITHM RULES

1. FIRST 30 MINUTES: Phoenix determines post viability within 15–30 min. If engagement velocity fails to exceed a dynamic threshold in the first 15 minutes, the post becomes mathematically unlikely to reach the broader "For You" feed. 5 engagements in 10 minutes = 10–100x more reach than 5 engagements over 24 hours.

2. EXTERNAL LINKS: Penalized by 30–50% reach reduction (up to 400%). NEVER put links in the main post body. Put them in your first reply, bio, or pinned tweet instead.

3. NICHE CONSISTENCY: SimClusters enforce topical fidelity. Drifting from your established niche = near-zero distribution to new audiences. The algorithm clusters you by topic.

4. AUTHOR DIVERSITY DECAY: Each additional post from the same author in a feed refresh gets its score approximately halved. Post #1 = 100%, #2 ≈ 50%, #3 ≈ 25%. Quality > quantity.

5. X PREMIUM: Verified accounts get 2–4x reach multiplier. The algorithm has a programmatic visibility ceiling that Premium removes.

6. SENTIMENT ANALYSIS: Grok reads post sentiment. Positive, constructive, educational content gets wider distribution. Combative, negative, rage-bait content is throttled even if it generates engagement.

7. MEDIA BOOST: Images ≈ 2x text-only reach. Native video = 2–4x more reach. Videos need minimum duration for the VQV (Video Quality View) scoring bonus. Keep videos under 2:20 with captions.

8. NO HAND-ENGINEERED FEATURES: The transformer learns relevance entirely from engagement patterns. There are no manual "has image = +10" rules — it's all learned from billions of interactions.

### WHAT MAKES TWEETS GO VIRAL

Based on the algorithm structure:
- Spark CONVERSATION (replies >> likes). Design posts that people MUST respond to.
- Create DWELL TIME: hooks, curiosity gaps, storytelling, "wait for it" moments
- Encourage BOOKMARKS: actionable frameworks, reference lists, "save this" content
- Drive SHARES: surprising stats, useful frameworks, bold takes people want to spread
- Use NATIVE MEDIA: images, video (not external links)
- First line = irresistible HOOK. You have 0.3 seconds.
- SPECIFIC > generic: "3 ways SaaS founders cut AWS costs with AI" >> "AI is changing everything"
- End with QUESTION or CTA to drive replies (75x signal!)
- LINE BREAKS for readability = more dwell time
- Stay IN YOUR NICHE — topical consistency is algorithmically enforced

### HOOK FORMULAS THAT WORK
- "I spent [time] studying [topic]. Here's what nobody tells you:"
- "[Number] [things] that [surprising outcome]:"
- "Stop [common mistake]. Here's why:"
- "The [adjective] truth about [topic]:"
- "Most people [wrong belief]. The reality:"
- "[Bold claim]. Let me explain."
- "I [did something unusual]. Here's what happened:"
- "Everyone is talking about [X]. But nobody mentions [Y]."

## YOUR RULES

1. Every tweet MUST be under 280 characters unless explicitly asked for a thread
2. Every tweet MUST have a hook in the first line that stops the scroll
3. NEVER include external links in tweet text
4. Use line breaks for readability
5. End with a question or call-to-action when natural
6. Be specific, not generic
7. Match the requested tone exactly
8. Provide genuinely useful/interesting content — not engagement-bait fluff
9. Each variation should use a DIFFERENT hook style and approach
10. Think about what would make YOU stop scrolling and reply

## RESPONSE FORMAT

Always respond with valid JSON in this exact format:
{
  "tweets": [
    {
      "text": "The full tweet text here with\\nline breaks",
      "score": 87,
      "hookAnalysis": "Brief explanation of why this hook works algorithmically",
      "algorithmNotes": "Which algorithm signals this tweet targets",
      "tips": ["Actionable tip 1", "Actionable tip 2"]
    }
  ]
}

Generate exactly 3 variations. Scores should be honest (60-95 range). Every tip should be specific and actionable.`;

// Client-side tweet scoring heuristics (0-100)
export function scoreTweet(text: string): {
  total: number;
  breakdown: {
    hook: number;
    length: number;
    engagement: number;
    readability: number;
    penalties: number;
  };
  tips: string[];
} {
  if (!text.trim()) {
    return {
      total: 0,
      breakdown: { hook: 0, length: 0, engagement: 0, readability: 0, penalties: 0 },
      tips: ['Start typing to see your algorithm score'],
    };
  }

  const tips: string[] = [];
  let hook = 0;
  let length = 0;
  let engagement = 0;
  let readability = 0;
  let penalties = 0;

  // ── Hook quality (0-25) ──
  const firstLine = text.split('\n')[0] || '';
  if (firstLine.length > 0) {
    hook += 5;
    if (/^\d/.test(firstLine)) hook += 5;
    if (/\?$/.test(firstLine.trim())) hook += 5;
    if (firstLine.length > 10 && firstLine.length <= 60) hook += 3;
    if (
      /^(I |My |We |You |Most |The truth|Here'?s|Stop |Don'?t |Why |How |What |Everyone |Nobody |This |If you)/.test(
        firstLine
      )
    )
      hook += 4;
    if (/[:.]$/.test(firstLine.trim()) && text.includes('\n')) hook += 3;
    if (firstLine === firstLine.toUpperCase() && firstLine.length > 10) hook -= 3;
  }
  if (hook < 10) tips.push('Strengthen your hook — try a number, question, or bold claim in the first line');

  // ── Length optimization (0-20) ──
  const len = text.length;
  if (len >= 100 && len <= 220) length = 20;
  else if (len >= 70 && len <= 280) length = 15;
  else if (len >= 40 && len < 70) {
    length = 10;
    tips.push('A bit short — add more value to increase dwell time');
  } else if (len > 280) {
    length = 8;
    tips.push('Over 280 chars — consider splitting into a thread');
  } else if (len > 0) {
    length = 5;
    tips.push('Very short — unlikely to generate meaningful dwell time');
  }

  // ── Engagement triggers (0-25) ──
  if (/\?/.test(text)) engagement += 8;
  else tips.push('Add a question to encourage replies (replies = 75x a like!)');

  if (/\b(you|your|you're)\b/i.test(text)) engagement += 4;
  if (/\b(agree|disagree|thoughts|opinion|what do you think|hot take|unpopular)\b/i.test(text)) engagement += 5;
  if (/\b(bookmark|save this|reference|keep this)\b/i.test(text)) engagement += 5;
  if (/\b(share|repost|send this)\b/i.test(text)) engagement += 3;
  if (/\d+/.test(text)) engagement += 3;
  if (engagement < 10) tips.push('Add engagement triggers — questions, "bookmark this", specific numbers');

  // ── Readability / dwell time (0-20) ──
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const lineBreaks = lines.length - 1;

  if (lineBreaks >= 2 && lineBreaks <= 8) readability += 10;
  else if (lineBreaks === 0 && len > 100) tips.push('Add line breaks to improve readability and dwell time');
  else if (lineBreaks >= 1) readability += 5;

  const avgLineLen = lines.reduce((sum, l) => sum + l.length, 0) / Math.max(lines.length, 1);
  if (avgLineLen > 0 && avgLineLen < 70) readability += 5;
  if (/^[-•→▸✓✅❌\d.]\s/m.test(text)) readability += 5;

  // ── Penalties ──
  if (/https?:\/\/\S+/.test(text)) {
    penalties -= 25;
    tips.unshift('REMOVE external links! They reduce reach by 30-50%. Put links in your reply instead.');
  }

  const hashtags = (text.match(/#\w+/g) || []).length;
  if (hashtags > 3) {
    penalties -= 5 * (hashtags - 3);
    tips.push('Too many hashtags — use 1-2 max');
  }

  if (text === text.toUpperCase() && text.length > 20) {
    penalties -= 10;
    tips.push('ALL CAPS hurts readability — use normal casing');
  }

  const mentions = (text.match(/@\w+/g) || []).length;
  if (mentions > 3) {
    penalties -= 5;
    tips.push('Too many @mentions can appear spammy');
  }

  const total = Math.max(0, Math.min(100, 10 + hook + length + engagement + readability + penalties));

  return {
    total,
    breakdown: {
      hook: Math.max(0, Math.min(25, hook)),
      length: Math.max(0, Math.min(20, length)),
      engagement: Math.max(0, Math.min(25, engagement)),
      readability: Math.max(0, Math.min(20, readability)),
      penalties: Math.min(0, penalties),
    },
    tips: tips.slice(0, 5),
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Viral Potential';
  if (score >= 70) return 'Strong';
  if (score >= 55) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Weak';
}
