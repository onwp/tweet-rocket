<p align="center">
  <img src="extension/icons/icon128.png" width="80" alt="TweetRocket" />
</p>

<h1 align="center">TweetRocket</h1>

<p align="center">
  <strong>Write viral tweets powered by X's actual algorithm signals + AI</strong>
</p>

<p align="center">
  Free &amp; open source Chrome extension that scores your tweets against 19 ranking signals from X's Grok-powered algorithm and generates optimized variations using Claude AI.
</p>

<p align="center">
  <a href="#installation">Install</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#how-it-works">How It Works</a> &bull;
  <a href="#algorithm-signals">Algorithm</a> &bull;
  <a href="#contributing">Contributing</a>
</p>

---

## Why TweetRocket?

Most people chase likes. The X algorithm doesn't care about likes.

A single reply where the author responds back is worth **75x** more than a like. A bookmark is worth **50x**. An external link in your tweet **kills 30-50% of your reach**.

TweetRocket is built on these insights, extracted from [X's open-sourced algorithm](https://github.com/xai-org/x-algorithm). It scores your tweets against the signals that actually matter and uses Claude AI to rewrite them for maximum algorithmic reach.

## Features

### Three Modes

| Mode | What it does |
|------|-------------|
| **Write** | Enter a topic or idea. Get 3 algorithm-optimized tweet variations. |
| **Rewrite** | Paste an existing tweet. Get 3 improved versions that score higher. |
| **Reply** | Paste someone's tweet. Get 3 high-signal replies (75x algorithm weight). |

### Real-Time Algorithm Scoring

Every tweet gets scored 0-100 as you type, broken down into four components:

- **Hook** (0-25) - First-line impact, pattern matching, scroll-stopping power
- **Length** (0-20) - Optimal range is 100-220 characters
- **Engagement** (0-25) - Questions, CTAs, bookmark triggers, specificity
- **Readability** (0-20) - Line breaks, formatting, scannability

Penalties are applied for external links (-25), excessive hashtags, ALL CAPS, and too many @mentions.

### More

- **6 tones** - Engaging, Bold, Educational, Witty, Inspirational, Spicy
- **Generation history** - Last 50 generations saved locally
- **Popup & Sidebar** - Use as a quick popup or pin to the side of your browser
- **Privacy-first** - Your API key stays in your browser. Nothing is sent to any server except Anthropic's API.

## Algorithm Signals

Engagement weights from X's ranking algorithm (relative to Like = 1x):

```
Reply + Author responds    ██████████████████████████████████████  75x
Bookmark                   █████████████████████████              50x
Share via DM               ████████████████████                   40x
Copy link share            ██████████████████                     35x
Quote tweet                ████████████████                       30x
Repost                     ██████████                             20x
Follow after seeing        ████████                               15x
Profile click              █████                                  10x
Like                       █                                       1x
External links             ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓         -50%
```

### Key Algorithm Rules

1. **First 30 minutes decide everything.** Early engagement velocity determines whether your post reaches the For You feed at all.
2. **External links kill reach.** 30-50% reduction. Put links in your first reply instead.
3. **Stay in your niche.** SimClusters enforce topical consistency. Drifting = near-zero distribution.
4. **Author diversity decay.** Each additional post in the same feed refresh gets ~halved. Quality > quantity.
5. **Positive > negative.** Grok reads sentiment. Constructive content gets wider distribution.

## Installation

### Chrome Extension

1. Clone or download this repo
2. Go to `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the `extension/` folder
5. Click the TweetRocket icon in your toolbar
6. Open Settings (gear icon) and paste your [Anthropic API key](https://console.anthropic.com)

That's it. Start writing.

### Web App (optional)

There's also a Next.js web version if you prefer a full-page editor:

```bash
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm run dev             # http://localhost:3000
```

## How It Works

1. **You provide your own [Anthropic API key](https://console.anthropic.com)** - costs ~$0.003 per generation (~3 tweets). Your key is stored locally and only sent to Anthropic.
2. **Client-side scoring** - The algorithm scoring runs entirely in your browser. No server needed.
3. **AI generation** - When you click Generate, your input is sent to Claude Sonnet 4.5 along with a detailed system prompt encoding X's algorithm weights, rules, and optimization strategies.
4. **You get back 3 variations** - Each with a score, hook analysis, algorithm notes, and actionable improvement tips.

## Project Structure

```
extension/               Chrome extension (standalone, no build step)
  ├── manifest.json      Manifest V3
  ├── app.html           Popup & sidebar UI
  ├── app.css            Dark theme
  ├── app.js             App logic, generation, rendering
  ├── algorithm.js       Scoring algorithm + system prompt
  ├── background.js      Service worker (popup/sidebar switching)
  └── icons/             16, 48, 128px icons

src/                     Next.js web app
  ├── app/
  │   ├── page.tsx       Landing page
  │   ├── write/         Full-page editor
  │   └── api/generate/  Server-side generation endpoint
  └── lib/
      └── algorithm.ts   Scoring algorithm (TypeScript version)
```

The Chrome extension is fully self-contained - no build step, no dependencies, no server. It talks directly to the Anthropic API from your browser.

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Extension | Vanilla JS, Chrome Manifest V3 |
| Web app | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| AI model | Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) |
| Scoring | Custom heuristic algorithm (client-side) |
| Icons | Generated with pure Node.js (no dependencies) |

## Contributing

Contributions welcome. Some ideas:

- **More scoring signals** - The heuristic algorithm can always be improved
- **Thread support** - Multi-tweet thread generation
- **Firefox port** - Adapt manifest for Firefox
- **Analytics** - Track score improvements over time
- **i18n** - Support for non-English tweets

To contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a Pull Request

## License

Free for personal and non-commercial use. Commercial use requires a license. See [LICENSE](LICENSE) for details.

Want to use TweetRocket commercially or collaborate? Reach out at [github.com/onwp](https://github.com/onwp).

## Acknowledgments

- Algorithm data from [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) (Jan 2026 open-source release)
- AI powered by [Anthropic Claude](https://www.anthropic.com)
