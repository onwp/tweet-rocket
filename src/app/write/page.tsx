"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Rocket,
  ArrowLeft,
  Copy,
  Check,
  Settings,
  X,
  Lightbulb,
  AlertTriangle,
  Loader2,
  Sparkles,
  RefreshCw,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { scoreTweet, getScoreColor, getScoreLabel } from "@/lib/algorithm";

interface TweetResult {
  text: string;
  score: number;
  hookAnalysis: string;
  algorithmNotes: string;
  tips: string[];
}

const TONES = [
  { value: "engaging", label: "Engaging" },
  { value: "bold", label: "Bold" },
  { value: "educational", label: "Educational" },
  { value: "witty", label: "Witty" },
  { value: "inspirational", label: "Inspirational" },
  { value: "controversial", label: "Spicy" },
];

const PLACEHOLDERS: Record<string, string> = {
  write:
    "Enter your topic or idea...\n\ne.g. \"Tips for first-time founders raising a seed round\"\ne.g. \"Why most people fail at building habits\"\ne.g. \"The hidden cost of premature optimization in startups\"",
  rewrite:
    "Paste your tweet here...\n\nWe'll analyze it against 19 algorithm signals and generate 3 optimized variations that keep your message but maximize reach.",
  reply:
    "Paste the tweet you want to reply to...\n\nWe'll craft 3 high-impact replies designed to maximize the 75x reply algorithm signal and grow your visibility.",
};

// ── Score Ring SVG ──
function ScoreRing({
  score,
  size = 120,
}: {
  score: number;
  size?: number;
}) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="-rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-[10px] text-muted uppercase tracking-wider">
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}

// ── Score Bar ──
function ScoreBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.max(0, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono" style={{ color }}>
          {value}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ── Result Card ──
function ResultCard({
  tweet,
  index,
}: {
  tweet: TweetResult;
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(tweet.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = tweet.text.length;
  const scoreColor = getScoreColor(tweet.score);

  return (
    <div
      className="border border-border rounded-xl p-5 bg-card hover:bg-card-hover transition-colors animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted">
            #{index + 1}
          </span>
          <span
            className="text-xs font-mono font-bold px-2 py-0.5 rounded"
            style={{ color: scoreColor, background: `${scoreColor}15` }}
          >
            Score: {tweet.score}
          </span>
          <span className="text-xs text-muted font-mono">
            {charCount}/280
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-border"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4 font-[family-name:var(--font-geist-sans)]">
        {tweet.text}
      </p>

      <div className="border-t border-border pt-3 space-y-2">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Hook:</strong>{" "}
          {tweet.hookAnalysis}
        </p>
        {tweet.tips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tweet.tips.map((tip, i) => (
              <span
                key={i}
                className="text-[11px] text-muted-foreground bg-border/50 px-2 py-0.5 rounded"
              >
                {tip}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Loading Skeleton ──
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="border border-border rounded-xl p-5 animate-fade-in"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="shimmer h-4 w-8 rounded" />
            <div className="shimmer h-4 w-20 rounded" />
          </div>
          <div className="space-y-2">
            <div className="shimmer h-4 w-full rounded" />
            <div className="shimmer h-4 w-4/5 rounded" />
            <div className="shimmer h-4 w-3/5 rounded" />
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <div className="shimmer h-3 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Settings Modal ──
function SettingsModal({
  open,
  onClose,
  apiKey,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
}) {
  const [key, setKey] = useState(apiKey);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Settings</h3>
          <button
            onClick={onClose}
            className="p-1 text-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-sm text-muted-foreground block mb-2">
            Anthropic API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-ant-..."
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors font-mono"
          />
          <p className="text-xs text-muted mt-2">
            Your key is stored locally in your browser and never sent to our
            servers. Get a key at{" "}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              console.anthropic.com
            </a>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-card-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(key);
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function WritePage() {
  const [mode, setMode] = useState<"write" | "rewrite" | "reply">("write");
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("engaging");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TweetResult[]>([]);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showToneDropdown, setShowToneDropdown] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const score = scoreTweet(input);

  useEffect(() => {
    const saved = localStorage.getItem("tr_api_key");
    if (saved) setApiKey(saved);
  }, []);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    if (key) localStorage.setItem("tr_api_key", key);
    else localStorage.removeItem("tr_api_key");
  };

  const generate = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {}),
        },
        body: JSON.stringify({ mode, content: input, tone }),
      });

      if (res.status === 401) {
        setError("API key required. Click the gear icon to add your Anthropic API key.");
        setShowSettings(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setResults(data.tweets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [input, mode, tone, apiKey]);

  // Cmd+Enter to generate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [generate]);

  // Close tone dropdown on outside click
  useEffect(() => {
    if (!showToneDropdown) return;
    const handler = () => setShowToneDropdown(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showToneDropdown]);

  const charCount = input.length;
  const charColor =
    charCount > 280 ? "#ef4444" : charCount > 240 ? "#eab308" : "#71717a";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm">TweetRocket</span>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
            <button
              onClick={() => setMode("write")}
              className={`px-2 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "write"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 inline sm:mr-1.5" />
              <span className="hidden sm:inline">Write</span>
            </button>
            <button
              onClick={() => setMode("rewrite")}
              className={`px-2 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "rewrite"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 inline sm:mr-1.5" />
              <span className="hidden sm:inline">Rewrite</span>
            </button>
            <button
              onClick={() => setMode("reply")}
              className={`px-2 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                mode === "reply"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 inline sm:mr-1.5" />
              <span className="hidden sm:inline">Reply</span>
            </button>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-card"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Left: Editor */}
          <div className="space-y-4">
            {/* Textarea */}
            <div className="border border-border rounded-xl bg-card focus-within:border-primary/50 transition-colors">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={PLACEHOLDERS[mode]}
                rows={6}
                className="w-full bg-transparent px-5 pt-5 pb-2 text-sm resize-none focus:outline-none placeholder:text-muted/50 leading-relaxed"
              />
              <div className="flex items-center justify-between px-5 pb-3">
                <div className="flex items-center gap-3">
                  {(mode === "write" || mode === "reply") && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowToneDropdown(!showToneDropdown);
                        }}
                        className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg border border-border hover:border-border-hover"
                      >
                        Tone: {TONES.find((t) => t.value === tone)?.label}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {showToneDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg py-1 min-w-[140px] z-10 shadow-xl">
                          {TONES.map((t) => (
                            <button
                              key={t.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                setTone(t.value);
                                setShowToneDropdown(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                                tone === t.value
                                  ? "text-primary bg-primary/5"
                                  : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-xs font-mono" style={{ color: charColor }}>
                  {charCount}/280
                </span>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:hover:bg-primary text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.005] active:scale-[0.995] disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Rocket className="w-4.5 h-4.5" />
                  {mode === "write"
                    ? "Generate Viral Tweets"
                    : mode === "rewrite"
                    ? "Optimize This Tweet"
                    : "Generate Replies"}
                  <span className="text-xs opacity-60 ml-1">
                    {navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl"}+Enter
                  </span>
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-danger/30 bg-danger/5 text-sm animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                <p className="text-danger/90">{error}</p>
              </div>
            )}

            {/* Results */}
            {loading && <LoadingSkeleton />}
            {!loading && results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Generated Variations
                </h3>
                {results.map((tweet, i) => (
                  <ResultCard key={i} tweet={tweet} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Score Panel */}
          <div className="space-y-4">
            {/* Algorithm Score */}
            <div className="border border-border rounded-xl bg-card p-5 sticky top-20">
              <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-4">
                Algorithm Score
              </h3>

              <div className="flex justify-center mb-5">
                <ScoreRing score={score.total} />
              </div>

              <div className="space-y-3 mb-5">
                <ScoreBar
                  label="Hook"
                  value={score.breakdown.hook}
                  max={25}
                  color="#1d9bf0"
                />
                <ScoreBar
                  label="Length"
                  value={score.breakdown.length}
                  max={20}
                  color="#3b82f6"
                />
                <ScoreBar
                  label="Engagement Triggers"
                  value={score.breakdown.engagement}
                  max={25}
                  color="#22c55e"
                />
                <ScoreBar
                  label="Readability"
                  value={score.breakdown.readability}
                  max={20}
                  color="#8b5cf6"
                />
                {score.breakdown.penalties < 0 && (
                  <ScoreBar
                    label="Penalties"
                    value={Math.abs(score.breakdown.penalties)}
                    max={30}
                    color="#ef4444"
                  />
                )}
              </div>

              {/* Tips */}
              {score.tips.length > 0 && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-3.5 h-3.5 text-warning" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tips
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {score.tips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5 shrink-0">
                          &#x2022;
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Reference */}
            <div className="border border-border rounded-xl bg-card p-5">
              <h3 className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
                Quick Reference
              </h3>
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Replies</span>
                  <span className="font-mono text-success">75x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bookmarks</span>
                  <span className="font-mono text-accent">50x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shares</span>
                  <span className="font-mono text-[#8b5cf6]">40x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Likes</span>
                  <span className="font-mono text-muted">1x</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span>External links</span>
                  <span className="font-mono text-danger">-400%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Blocks/Mutes</span>
                  <span className="font-mono text-danger">-10x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        apiKey={apiKey}
        onSave={saveApiKey}
      />
    </div>
  );
}
