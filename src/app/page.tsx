import Link from "next/link";
import {
  Rocket,
  MessageSquare,
  Bookmark,
  Share2,
  Clock,
  Link2Off,
  Target,
  Zap,
  ArrowRight,
  Github,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react";

const signals = [
  {
    icon: MessageSquare,
    title: "Reply + Respond",
    weight: "75x",
    description:
      "Back-and-forth conversation is the #1 algorithm signal. Design tweets that demand responses.",
    color: "#22c55e",
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    weight: "50x",
    description:
      "Content worth saving gets 50x more algorithmic weight than a simple like.",
    color: "#3b82f6",
  },
  {
    icon: Share2,
    title: "Shares & DMs",
    weight: "40x",
    description:
      "Private sharing via DM or copy-link signals deep value to the algorithm.",
    color: "#8b5cf6",
  },
  {
    icon: Clock,
    title: "First 30 Minutes",
    weight: "Critical",
    description:
      "Early engagement velocity determines if your post ever reaches the For You feed.",
    color: "#f97316",
  },
  {
    icon: Link2Off,
    title: "No External Links",
    weight: "-400%",
    description:
      "External links in tweet body reduce reach by up to 400%. Always put links in replies.",
    color: "#ef4444",
  },
  {
    icon: Target,
    title: "Niche Consistency",
    weight: "Required",
    description:
      "SimClusters enforce topical fidelity. Drifting from your niche kills distribution.",
    color: "#eab308",
  },
];

const steps = [
  {
    num: "01",
    title: "Write or Paste",
    description:
      "Enter your topic idea or paste an existing tweet you want to optimize.",
    icon: Sparkles,
  },
  {
    num: "02",
    title: "AI Analyzes",
    description:
      "Our AI scores your tweet against 19 algorithm signals and identifies weaknesses.",
    icon: TrendingUp,
  },
  {
    num: "03",
    title: "Get Viral Variants",
    description:
      "Receive 3 optimized variations with score breakdowns. Copy and post on X.",
    icon: Rocket,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-background/80 border-b border-border z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Rocket className="w-4.5 h-4.5 text-primary" />
            </div>
            TweetRocket
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#signals"
              className="text-muted hover:text-foreground transition-colors"
            >
              Algorithm Signals
            </a>
            <a
              href="#how-it-works"
              className="text-muted hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <Link
              href="/write"
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Start Writing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link
            href="/write"
            className="md:hidden bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Start Writing
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href="https://github.com/xai-org/x-algorithm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border hover:border-border-hover text-sm text-muted-foreground mb-8 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            Powered by xai-org/x-algorithm
            <ArrowRight className="w-3 h-3" />
          </a>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Write Tweets That
            <br />
            <span className="bg-gradient-to-r from-primary via-sky-300 to-primary bg-clip-text text-transparent">
              Break the Algorithm
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            TweetRocket analyzes your tweets against 19 ranking signals from
            X&apos;s actual Grok-powered algorithm to craft content that
            maximizes your reach.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/write"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] pulse-glow"
            >
              <Rocket className="w-5 h-5" />
              Start Writing Free
            </Link>
            <a
              href="#signals"
              className="inline-flex items-center justify-center gap-2 border border-border hover:border-border-hover text-foreground px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors"
            >
              See Algorithm Signals
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>
                <strong className="text-foreground">19</strong> Ranking Signals
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-4 h-4 text-success" />
              <span>
                <strong className="text-foreground">75x</strong> Reply Weight
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bookmark className="w-4 h-4 text-accent" />
              <span>
                <strong className="text-foreground">50x</strong> Bookmark Power
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4 text-warning" />
              <span>
                <strong className="text-foreground">30 min</strong> Velocity
                Window
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithm Weight Visual */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="border border-border rounded-2xl bg-card p-6 md:p-8">
            <h3 className="text-sm font-mono text-muted uppercase tracking-wider mb-6">
              Algorithm Engagement Weights
            </h3>
            <div className="space-y-4">
              {[
                { label: "Reply + Author Response", value: 75, color: "#22c55e" },
                { label: "Bookmarks", value: 50, color: "#3b82f6" },
                { label: "Share via DM", value: 40, color: "#8b5cf6" },
                { label: "Quote Tweet", value: 30, color: "#a855f7" },
                { label: "Repost", value: 20, color: "#06b6d4" },
                { label: "Follow After Seeing", value: 15, color: "#14b8a6" },
                { label: "Likes", value: 1, color: "#71717a" },
                { label: "External Links", value: -50, color: "#ef4444" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-48 shrink-0 text-right hidden sm:block">
                    {item.label}
                  </span>
                  <span className="text-xs text-muted-foreground w-28 shrink-0 sm:hidden">
                    {item.label}
                  </span>
                  <div className="flex-1 h-7 bg-border/50 rounded-md overflow-hidden relative">
                    {item.value > 0 ? (
                      <div
                        className="h-full rounded-md"
                        style={{
                          width: `${(item.value / 75) * 100}%`,
                          background: item.color,
                          minWidth: "2%",
                        }}
                      />
                    ) : (
                      <div
                        className="h-full rounded-md"
                        style={{
                          width: `${(Math.abs(item.value) / 75) * 100}%`,
                          background: `${item.color}40`,
                          border: `1px solid ${item.color}`,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-sm font-mono font-bold w-12 shrink-0"
                    style={{ color: item.color }}
                  >
                    {item.value > 0 ? `${item.value}x` : `${item.value}%`}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-4">
              Relative weights based on X algorithm source code analysis. Likes
              = 1x baseline.
            </p>
          </div>
        </div>
      </section>

      {/* Algorithm Signals */}
      <section id="signals" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              The Signals That Matter
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              X&apos;s Grok-powered Phoenix model predicts 19 engagement
              probabilities for every post. Here are the signals that actually
              move the needle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {signals.map((signal) => (
              <div
                key={signal.title}
                className="group border border-border hover:border-border-hover rounded-xl p-6 bg-card transition-all hover:bg-card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${signal.color}15` }}
                  >
                    <signal.icon
                      className="w-5 h-5"
                      style={{ color: signal.color }}
                    />
                  </div>
                  <span
                    className="text-sm font-mono font-bold px-2.5 py-0.5 rounded-md"
                    style={{
                      color: signal.color,
                      background: `${signal.color}15`,
                    }}
                  >
                    {signal.weight}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{signal.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {signal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Three Steps to Viral
            </h2>
            <p className="text-muted-foreground text-lg">
              From idea to algorithm-optimized tweet in seconds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xs font-mono text-primary mb-2">
                  STEP {step.num}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dos and Don'ts */}
      <section className="py-24 px-6 border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12">
            What the Algorithm{" "}
            <span className="text-danger">Doesn&apos;t</span> Want You to Do
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {[
              {
                bad: "Put links in your tweet",
                good: "Put links in your first reply",
              },
              {
                bad: "Chase likes as your main metric",
                good: "Optimize for replies and bookmarks",
              },
              {
                bad: "Post and ghost your comments",
                good: "Reply to every comment in the first hour",
              },
              {
                bad: "Post about random topics",
                good: "Stay consistent in your niche",
              },
              {
                bad: "Write combative, negative content",
                good: "Write constructive, positive takes",
              },
              {
                bad: "Post 20 low-effort tweets a day",
                good: "Post 3-5 high-signal tweets",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="border border-border rounded-xl p-5 bg-card"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-danger text-lg mt-0.5">&#x2715;</span>
                  <p className="text-sm text-muted-foreground line-through">
                    {item.bad}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-success text-lg mt-0.5">&#x2713;</span>
                  <p className="text-sm text-foreground font-medium">
                    {item.good}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to Go Viral?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Stop guessing what works. Let the algorithm tell you. Write tweets
            backed by 19 ranking signals.
          </p>
          <Link
            href="/write"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] pulse-glow"
          >
            <Rocket className="w-5 h-5" />
            Launch TweetRocket
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-primary" />
            <span>TweetRocket</span>
          </div>
          <p>
            Built on insights from{" "}
            <a
              href="https://github.com/xai-org/x-algorithm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              xai-org/x-algorithm
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
