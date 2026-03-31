// TweetRocket Chrome Extension — Main App Logic

const TONES = [
  { value: 'engaging', label: 'Engaging' },
  { value: 'bold', label: 'Bold' },
  { value: 'educational', label: 'Educational' },
  { value: 'witty', label: 'Witty' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'controversial', label: 'Spicy' },
];

const PLACEHOLDERS = {
  write: 'Enter your topic or idea...\n\ne.g. "Tips for first-time founders raising a seed round"',
  rewrite: 'Paste your tweet here...\n\nWe\'ll analyze it against 19 algorithm signals and generate 3 optimized variations.',
  reply: 'Paste the tweet you want to reply to...\n\nWe\'ll craft 3 high-impact replies designed to maximize the 75x reply algorithm signal.',
};

const GENERATE_LABELS = {
  write: 'Generate Viral Tweets',
  rewrite: 'Optimize This Tweet',
  reply: 'Generate Replies',
};

// ── State ──
let currentMode = 'write';
let currentTone = 'engaging';
let apiKey = '';
let extensionMode = 'popup';
let loading = false;

// ── DOM refs ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const inputEl = $('#input');
const charCountEl = $('#charCount');
const generateBtn = $('#generateBtn');
const generateLabel = $('#generateLabel');
const errorBox = $('#errorBox');
const errorText = $('#errorText');
const resultsEl = $('#results');
const toneBtn = $('#toneBtn');
const toneLabel = $('#toneLabel');
const toneMenu = $('#toneMenu');
const toneWrap = $('#toneWrap');
const scoreRingEl = $('#scoreRing');
const scoreBarsEl = $('#scoreBars');
const tipsSection = $('#tipsSection');
const tipsList = $('#tipsList');

// ── SVG helpers (static, no user input) ──
function createCopySvg(color) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', color || 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', '14');
  rect.setAttribute('height', '14');
  rect.setAttribute('x', '8');
  rect.setAttribute('y', '8');
  rect.setAttribute('rx', '2');
  rect.setAttribute('ry', '2');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2');
  svg.appendChild(rect);
  svg.appendChild(path);
  return svg;
}

function createCheckSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', '#22c55e');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', '20 6 9 17 4 12');
  svg.appendChild(polyline);
  return svg;
}

function setCopyBtnState(btn, copied) {
  btn.textContent = '';
  if (copied) {
    btn.appendChild(createCheckSvg());
    btn.appendChild(document.createTextNode(' Copied'));
  } else {
    btn.appendChild(createCopySvg());
    btn.appendChild(document.createTextNode(' Copy'));
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Load saved state
  chrome.storage.local.get(['tr_api_key', 'tr_mode', 'tr_tone'], (data) => {
    if (data.tr_api_key) apiKey = data.tr_api_key;
    if (data.tr_mode) extensionMode = data.tr_mode;
    if (data.tr_tone) currentTone = data.tr_tone;
    toneLabel.textContent = TONES.find(t => t.value === currentTone)?.label || 'Engaging';
    updateModeToggle();
  });

  // Set shortcut hint
  const isMac = navigator.userAgent.includes('Mac');
  $('#shortcutHint').textContent = `${isMac ? '⌘' : 'Ctrl'}+Enter`;

  // Build tone menu
  buildToneMenu();

  // Initial score
  updateScore();

  // Events
  inputEl.addEventListener('input', onInput);
  generateBtn.addEventListener('click', generate);
  $('#settingsBtn').addEventListener('click', openSettings);
  $('#settingsClose').addEventListener('click', closeSettings);
  $('#settingsBackdrop').addEventListener('click', closeSettings);
  $('#settingsCancel').addEventListener('click', closeSettings);
  $('#settingsSave').addEventListener('click', saveSettings);
  $('#historyBtn').addEventListener('click', openHistory);
  $('#historyClose').addEventListener('click', closeHistory);
  $('#historyBackdrop').addEventListener('click', closeHistory);
  $('#clearHistory').addEventListener('click', clearHistory);

  toneBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toneMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', () => toneMenu.classList.add('hidden'));

  // Tab clicks
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  // Cmd+Enter
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      generate();
    }
  });

  // Mode toggle clicks
  $$('#modeToggle .mode-option').forEach(btn => {
    btn.addEventListener('click', () => {
      extensionMode = btn.dataset.mode;
      updateModeToggle();
    });
  });
}

// ── Tab switching ──
function setMode(mode) {
  currentMode = mode;
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  inputEl.placeholder = PLACEHOLDERS[mode];
  generateLabel.textContent = GENERATE_LABELS[mode];

  // Show/hide tone selector for write and reply modes
  if (mode === 'rewrite') {
    toneWrap.style.visibility = 'hidden';
  } else {
    toneWrap.style.visibility = 'visible';
  }
}

// ── Tone menu ──
function buildToneMenu() {
  toneMenu.textContent = '';
  TONES.forEach(t => {
    const btn = document.createElement('button');
    btn.className = `tone-option ${t.value === currentTone ? 'active' : ''}`;
    btn.textContent = t.label;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentTone = t.value;
      toneLabel.textContent = t.label;
      toneMenu.classList.add('hidden');
      chrome.storage.local.set({ tr_tone: t.value });
      $$('.tone-option').forEach(o => o.classList.toggle('active', o.textContent === t.label));
    });
    toneMenu.appendChild(btn);
  });
}

// ── Input handling ──
function onInput() {
  const len = inputEl.value.length;
  const color = len > 280 ? '#ef4444' : len > 240 ? '#eab308' : '#71717a';
  charCountEl.textContent = `${len}/280`;
  charCountEl.style.color = color;
  generateBtn.disabled = !inputEl.value.trim() || loading;
  updateScore();
}

// ── Score update ──
function updateScore() {
  const score = scoreTweet(inputEl.value);
  renderScoreRing(score.total);
  renderScoreBars(score.breakdown);
  renderTips(score.tips);
}

function renderScoreRing(total) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (total / 100) * circumference;
  const color = getScoreColor(total);
  const label = getScoreLabel(total);

  // Build score ring using DOM methods
  scoreRingEl.textContent = '';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100');
  svg.setAttribute('height', '100');
  svg.setAttribute('viewBox', '0 0 100 100');

  const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bgCircle.setAttribute('cx', '50');
  bgCircle.setAttribute('cy', '50');
  bgCircle.setAttribute('r', String(radius));
  bgCircle.setAttribute('fill', 'none');
  bgCircle.setAttribute('stroke', '#1a1a1a');
  bgCircle.setAttribute('stroke-width', '7');

  const fgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  fgCircle.setAttribute('cx', '50');
  fgCircle.setAttribute('cy', '50');
  fgCircle.setAttribute('r', String(radius));
  fgCircle.setAttribute('fill', 'none');
  fgCircle.setAttribute('stroke', color);
  fgCircle.setAttribute('stroke-width', '7');
  fgCircle.setAttribute('stroke-linecap', 'round');
  fgCircle.setAttribute('stroke-dasharray', String(circumference));
  fgCircle.setAttribute('stroke-dashoffset', String(offset));
  fgCircle.style.transition = 'stroke-dashoffset 0.7s ease-out';

  svg.appendChild(bgCircle);
  svg.appendChild(fgCircle);

  const labelDiv = document.createElement('div');
  labelDiv.className = 'score-ring-label';

  const valueSpan = document.createElement('span');
  valueSpan.className = 'score-ring-value';
  valueSpan.style.color = color;
  valueSpan.textContent = String(total);

  const textSpan = document.createElement('span');
  textSpan.className = 'score-ring-text';
  textSpan.textContent = label;

  labelDiv.appendChild(valueSpan);
  labelDiv.appendChild(textSpan);

  scoreRingEl.appendChild(svg);
  scoreRingEl.appendChild(labelDiv);
}

function renderScoreBars(breakdown) {
  const bars = [
    { label: 'Hook', value: breakdown.hook, max: 25, color: '#1d9bf0' },
    { label: 'Length', value: breakdown.length, max: 20, color: '#3b82f6' },
    { label: 'Engagement', value: breakdown.engagement, max: 25, color: '#22c55e' },
    { label: 'Readability', value: breakdown.readability, max: 20, color: '#8b5cf6' },
  ];

  if (breakdown.penalties < 0) {
    bars.push({ label: 'Penalties', value: Math.abs(breakdown.penalties), max: 30, color: '#ef4444' });
  }

  scoreBarsEl.textContent = '';

  bars.forEach(b => {
    const pct = b.max > 0 ? Math.max(0, (b.value / b.max) * 100) : 0;

    const wrapper = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'score-bar-header';

    const labelSpan = document.createElement('span');
    labelSpan.textContent = b.label;

    const valueSpan = document.createElement('span');
    valueSpan.style.color = b.color;
    valueSpan.textContent = `${b.value}/${b.max}`;

    header.appendChild(labelSpan);
    header.appendChild(valueSpan);

    const track = document.createElement('div');
    track.className = 'score-bar-track';

    const fill = document.createElement('div');
    fill.className = 'score-bar-fill';
    fill.style.width = `${pct}%`;
    fill.style.background = b.color;

    track.appendChild(fill);

    wrapper.appendChild(header);
    wrapper.appendChild(track);

    scoreBarsEl.appendChild(wrapper);
  });
}

function renderTips(tips) {
  if (!tips.length) {
    tipsSection.classList.add('hidden');
    return;
  }
  tipsSection.classList.remove('hidden');

  tipsList.textContent = '';
  tips.forEach(tip => {
    const item = document.createElement('div');
    item.className = 'tip-item';

    const bullet = document.createElement('span');
    bullet.className = 'tip-bullet';
    bullet.textContent = '\u2022';

    const text = document.createElement('span');
    text.textContent = tip;

    item.appendChild(bullet);
    item.appendChild(text);
    tipsList.appendChild(item);
  });
}

// ── Generate ──
async function generate() {
  const input = inputEl.value.trim();
  if (!input || loading) return;

  if (!apiKey) {
    showError('API key required. Click the gear icon to add your Anthropic API key.');
    openSettings();
    return;
  }

  loading = true;
  generateBtn.disabled = true;
  generateLabel.textContent = 'Generating...';
  generateBtn.querySelector('svg').classList.add('spin');
  hideError();
  renderSkeletons();

  try {
    const userPrompt = buildPrompt(currentMode, input, currentTone);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        system: ALGORITHM_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (response.status === 401) {
      showError('Invalid API key. Check your key in Settings.');
      openSettings();
      return;
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Generation failed');
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    const jsonMatch = text.match(/\{[\s\S]*"tweets"[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse AI response');

    const parsed = JSON.parse(jsonMatch[0]);
    const tweets = parsed.tweets || [];

    renderResults(tweets);
    saveToHistory(input, currentMode, currentTone, tweets);

  } catch (err) {
    showError(err.message || 'Something went wrong');
  } finally {
    loading = false;
    generateBtn.disabled = !inputEl.value.trim();
    generateLabel.textContent = GENERATE_LABELS[currentMode];
    generateBtn.querySelector('svg').classList.remove('spin');
  }
}

function buildPrompt(mode, content, tone) {
  if (mode === 'reply') {
    return `You are crafting high-impact REPLIES to someone else's tweet. The goal is to write replies that:
1. Maximize the 75x reply algorithm signal (the #1 ranking factor)
2. Add genuine value so the original author responds back
3. Make the replier look like a knowledgeable, interesting person worth following
4. Get bookmarked/liked by others reading the thread

Original tweet to reply to:
"""
${content}
"""

Tone: ${tone}

Generate 3 reply variations using DIFFERENT strategies:
- Variation 1: Add unique insight or data the original tweet missed
- Variation 2: Share a personal experience or contrarian but respectful take
- Variation 3: Ask a thought-provoking follow-up question

Requirements:
- Each reply MUST be under 280 characters
- Be genuinely valuable — not "Great post!" fluff
- Replies should make the original author WANT to respond
- NO external links
- Be conversational and authentic
- Each reply should work as a standalone valuable comment`;
  }

  if (mode === 'rewrite') {
    return `Rewrite this tweet to maximize algorithmic reach on X. Generate 3 optimized variations that keep the core message but dramatically improve engagement potential.

Original tweet:
"""
${content}
"""

Requirements:
- Keep the core message/meaning intact
- Each variation should use a DIFFERENT hook and structure
- Apply all algorithm optimization principles
- Each tweet MUST be under 280 characters
- NO external links in tweet text
- Improve hook, add line breaks, encourage replies`;
  }

  return `Write 3 viral tweet variations about this topic/idea:

"""
${content}
"""

Tone: ${tone}

Requirements:
- Each tweet MUST be under 280 characters
- Each variation should use a DIFFERENT hook style
- Apply all algorithm optimization principles
- Be specific, actionable, and genuinely valuable
- NO external links
- Use line breaks for readability
- Include a natural question or CTA to drive replies`;
}

// ── Render results ──
function renderResults(tweets) {
  resultsEl.textContent = '';
  if (!tweets.length) return;

  const header = document.createElement('div');
  header.className = 'results-header';
  header.textContent = 'Generated Variations';
  resultsEl.appendChild(header);

  tweets.forEach((tweet, i) => {
    const scoreColor = getScoreColor(tweet.score);

    const card = document.createElement('div');
    card.className = 'result-card';
    card.style.animationDelay = `${i * 100}ms`;

    // Header row
    const headerRow = document.createElement('div');
    headerRow.className = 'result-header';

    const meta = document.createElement('div');
    meta.className = 'result-meta';

    const num = document.createElement('span');
    num.className = 'result-num';
    num.textContent = `#${i + 1}`;

    const scoreBadge = document.createElement('span');
    scoreBadge.className = 'result-score';
    scoreBadge.style.color = scoreColor;
    scoreBadge.style.background = `${scoreColor}15`;
    scoreBadge.textContent = `Score: ${tweet.score}`;

    const chars = document.createElement('span');
    chars.className = 'result-chars';
    chars.textContent = `${tweet.text.length}/280`;

    meta.appendChild(num);
    meta.appendChild(scoreBadge);
    meta.appendChild(chars);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    setCopyBtnState(copyBtn, false);
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(tweet.text);
      setCopyBtnState(copyBtn, true);
      setTimeout(() => setCopyBtnState(copyBtn, false), 2000);
    });

    headerRow.appendChild(meta);
    headerRow.appendChild(copyBtn);

    // Text
    const textEl = document.createElement('div');
    textEl.className = 'result-text';
    textEl.textContent = tweet.text;

    // Analysis
    const analysis = document.createElement('div');
    analysis.className = 'result-analysis';

    if (tweet.hookAnalysis) {
      const hookP = document.createElement('p');
      hookP.className = 'result-hook';
      const hookStrong = document.createElement('strong');
      hookStrong.textContent = 'Hook: ';
      hookP.appendChild(hookStrong);
      hookP.appendChild(document.createTextNode(tweet.hookAnalysis));
      analysis.appendChild(hookP);
    }

    if (tweet.tips?.length) {
      const tipsWrap = document.createElement('div');
      tipsWrap.className = 'result-tips';
      tweet.tips.forEach(tip => {
        const tag = document.createElement('span');
        tag.className = 'result-tip-tag';
        tag.textContent = tip;
        tipsWrap.appendChild(tag);
      });
      analysis.appendChild(tipsWrap);
    }

    card.appendChild(headerRow);
    card.appendChild(textEl);
    card.appendChild(analysis);
    resultsEl.appendChild(card);
  });
}

function renderSkeletons() {
  resultsEl.textContent = '';
  for (let i = 0; i < 3; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.style.animationDelay = `${i * 100}ms`;

    const metaRow = document.createElement('div');
    metaRow.style.cssText = 'display:flex;gap:10px;margin-bottom:14px';

    const s1 = document.createElement('div');
    s1.className = 'shimmer';
    s1.style.cssText = 'height:14px;width:30px';

    const s2 = document.createElement('div');
    s2.className = 'shimmer';
    s2.style.cssText = 'height:14px;width:70px';

    metaRow.appendChild(s1);
    metaRow.appendChild(s2);

    const bodyCol = document.createElement('div');
    bodyCol.style.cssText = 'display:flex;flex-direction:column;gap:6px';

    [100, 80, 60].forEach(w => {
      const line = document.createElement('div');
      line.className = 'shimmer';
      line.style.cssText = `height:14px;width:${w}%`;
      bodyCol.appendChild(line);
    });

    const footer = document.createElement('div');
    footer.style.cssText = 'margin-top:14px;padding-top:10px;border-top:1px solid var(--border)';

    const fLine = document.createElement('div');
    fLine.className = 'shimmer';
    fLine.style.cssText = 'height:12px;width:66%';
    footer.appendChild(fLine);

    card.appendChild(metaRow);
    card.appendChild(bodyCol);
    card.appendChild(footer);
    resultsEl.appendChild(card);
  }
}

// ── Error ──
function showError(msg) {
  errorBox.classList.remove('hidden');
  errorText.textContent = msg;
}

function hideError() {
  errorBox.classList.add('hidden');
}

// ── Settings ──
function openSettings() {
  $('#settingsModal').classList.remove('hidden');
  $('#apiKeyInput').value = apiKey;
  updateModeToggle();
}

function closeSettings() {
  $('#settingsModal').classList.add('hidden');
}

function saveSettings() {
  const newKey = $('#apiKeyInput').value.trim();
  apiKey = newKey;
  chrome.storage.local.set({ tr_api_key: newKey, tr_mode: extensionMode });

  // Notify background about mode change
  chrome.runtime.sendMessage({ type: 'SET_MODE', mode: extensionMode });

  closeSettings();
}

function updateModeToggle() {
  $$('#modeToggle .mode-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === extensionMode);
  });
}

// ── History ──
function saveToHistory(input, mode, tone, tweets) {
  chrome.storage.local.get('tr_history', (data) => {
    const history = data.tr_history || [];
    history.unshift({
      input,
      mode,
      tone,
      tweets: tweets.map(t => ({ text: t.text, score: t.score })),
      timestamp: Date.now(),
    });
    // Keep last 50 entries
    chrome.storage.local.set({ tr_history: history.slice(0, 50) });
  });
}

function openHistory() {
  $('#historyModal').classList.remove('hidden');
  chrome.storage.local.get('tr_history', (data) => {
    const history = data.tr_history || [];
    const listEl = $('#historyList');

    listEl.textContent = '';

    if (!history.length) {
      const empty = document.createElement('p');
      empty.style.cssText = 'color:var(--muted);text-align:center;padding:20px 0;';
      empty.textContent = 'No history yet. Generate some tweets!';
      listEl.appendChild(empty);
      return;
    }

    history.forEach((entry, i) => {
      const date = new Date(entry.timestamp);
      const timeStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const modeLabel = entry.mode.charAt(0).toUpperCase() + entry.mode.slice(1);
      const inputPreview = entry.input.length > 60 ? entry.input.slice(0, 60) + '...' : entry.input;

      const card = document.createElement('div');
      card.style.cssText = 'border:1px solid var(--border);border-radius:10px;padding:10px;margin-bottom:8px;background:var(--card);cursor:pointer;';

      // Header: mode + time
      const headerDiv = document.createElement('div');
      headerDiv.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';

      const modeBadge = document.createElement('span');
      modeBadge.style.cssText = 'font-size:10px;font-weight:600;color:var(--primary);background:rgba(29,155,240,0.1);padding:2px 8px;border-radius:4px;';
      modeBadge.textContent = modeLabel;

      const timeSpan = document.createElement('span');
      timeSpan.style.cssText = 'font-size:10px;color:var(--muted);';
      timeSpan.textContent = timeStr;

      headerDiv.appendChild(modeBadge);
      headerDiv.appendChild(timeSpan);

      // Input preview
      const previewP = document.createElement('p');
      previewP.style.cssText = 'color:var(--muted-fg);font-size:11px;line-height:1.4;margin-bottom:6px;';
      previewP.textContent = inputPreview;

      // Score badges
      const scoresDiv = document.createElement('div');
      scoresDiv.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;';

      entry.tweets.forEach(t => {
        const badge = document.createElement('span');
        const c = getScoreColor(t.score);
        badge.style.cssText = `font-size:10px;font-family:monospace;color:${c};background:${c}15;padding:2px 6px;border-radius:3px;`;
        badge.textContent = String(t.score);
        scoresDiv.appendChild(badge);
      });

      card.appendChild(headerDiv);
      card.appendChild(previewP);
      card.appendChild(scoresDiv);

      // Click to load
      card.addEventListener('click', () => {
        inputEl.value = entry.input;
        setMode(entry.mode);
        onInput();
        closeHistory();

        if (entry.tweets.length) {
          const fullTweets = entry.tweets.map(t => ({
            text: t.text,
            score: t.score,
            hookAnalysis: '',
            tips: [],
          }));
          renderResults(fullTweets);
        }
      });

      listEl.appendChild(card);
    });
  });
}

function closeHistory() {
  $('#historyModal').classList.add('hidden');
}

function clearHistory() {
  chrome.storage.local.set({ tr_history: [] });
  const listEl = $('#historyList');
  listEl.textContent = '';
  const empty = document.createElement('p');
  empty.style.cssText = 'color:var(--muted);text-align:center;padding:20px 0;';
  empty.textContent = 'History cleared.';
  listEl.appendChild(empty);
}
