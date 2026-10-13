import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  BookOpen,
  Search,
  ShieldCheck,
  Zap,
  Terminal,
  ArrowRight,
  Layers,
  Copy,
  Check,
  Star,
  FileCode2,
} from 'lucide-react';
import { CodeViewer } from '../snippets/CodeViewer';

interface LandingShowcaseProps {
  onEnterVault: () => void;
  onOpenPublisher: () => void;
}

const SAMPLE_DEMO_CODE = `export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoffMs = 500
): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    return (await res.json()) as T;
  } catch (err) {
    if (retries <= 1) throw err;
    await new Promise((r) => setTimeout(r, backoffMs));
    return fetchWithRetry<T>(url, options, retries - 1, backoffMs * 2);
  }
}`;

export const LandingShowcase: React.FC<LandingShowcaseProps> = ({
  onEnterVault,
  onOpenPublisher,
}) => {
  const [activeFeature, setActiveFeature] = useState<'tagging' | 'publishing' | 'search'>('publishing');

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center space-y-6 pt-8 pb-12">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Powered by Google Gemini 3.8 Flash SDK</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto font-sans">
          Your Personal Developer Knowledge Base &amp;{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            AI Publisher
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Store code snippets, organize them automatically with AI tags and plain-English summaries,
          search your personal library, and publish technical documentation with zero friction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onEnterVault}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 text-sm"
          >
            <Code2 className="w-4 h-4" />
            <span>Open Developer Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPublisher}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all text-sm"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Launch AI Publisher</span>
          </button>
        </div>

        {/* Badges bar */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Full Isolation &amp; Persistence
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" /> Real-time Gemini Tagging
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-indigo-400" /> 20+ Languages Supported
          </span>
        </div>
      </section>

      {/* Interactive Live Playground Showcase */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Live Interactive Architecture
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              See how Google Gemini transforms a raw TypeScript function into structured metadata &amp; technical documentation.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveFeature('publishing')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeFeature === 'publishing'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI Publisher
            </button>
            <button
              onClick={() => setActiveFeature('tagging')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeFeature === 'tagging'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Auto-Tags &amp; Summary
            </button>
            <button
              onClick={() => setActiveFeature('search')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeFeature === 'search'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Smart Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
          {/* Left: Input Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1. Input Code Snippet
              </span>
              <span className="text-xs text-indigo-400 font-mono">fetchWithRetry.ts</span>
            </div>
            <CodeViewer
              code={SAMPLE_DEMO_CODE}
              language="typescript"
              maxHeight="340px"
              showLineNumbers={true}
            />
          </div>

          {/* Right: AI Output depending on active tab */}
          <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Gemini Output
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Generated in 320ms
              </span>
            </div>

            {activeFeature === 'publishing' && (
              <div className="space-y-3 text-xs text-slate-300 flex-1 overflow-y-auto max-h-[300px]">
                <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40 font-mono text-[11px] text-indigo-200">
                  # Module: \`fetchWithRetry\` API Utility
                </div>
                <div>
                  <span className="font-semibold text-slate-200 block mb-1">Overview:</span>
                  <p className="text-slate-400 leading-relaxed">
                    A resilient HTTP fetch wrapper featuring exponential backoff retries, JSON deserialization, and strict generic response typing.
                  </p>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                  <span className="text-slate-400">// Ready to paste into GitHub README</span><br />
                  <span className="text-indigo-400">const</span> data = <span className="text-indigo-400">await</span> fetchWithRetry&lt;UserProfile&gt;(<span className="text-emerald-400">'/api/user'</span>, &#123;&#125;, 3, 500);
                </div>
                <ul className="space-y-1 list-disc list-inside text-slate-400 text-[11px]">
                  <li>Handles transient 500 &amp; 503 network flakiness.</li>
                  <li>Exponential delay doubles between successive failures.</li>
                </ul>
              </div>
            )}

            {activeFeature === 'tagging' && (
              <div className="space-y-4 text-xs text-slate-300 flex-1">
                <div>
                  <span className="text-slate-400 font-semibold block mb-1.5">
                    1-Sentence Plain English Summary:
                  </span>
                  <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40 text-indigo-200 leading-relaxed">
                    "Executes an HTTP fetch request with recursive retry logic and exponential backoff timing to gracefully handle network failures."
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold block mb-1.5">
                    Categorized AI Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['typescript', 'async-await', 'exponential-backoff', 'fetch-api', 'resilience'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-slate-900 text-indigo-300 border border-slate-800 font-mono text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'search' && (
              <div className="space-y-3 text-xs text-slate-300 flex-1">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-400">
                  <Search className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Query: "exponential backoff network"</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-slate-300">
                  <span className="font-semibold text-white block mb-1">
                    Matched: fetchWithRetry Hook
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Matches concept via AI summary and tag semantic association without requiring exact keyword phrasing in code.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Built Specifically for Modern Software Engineers
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Every feature is engineered to streamline how you build, save, and share reusable code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Automated AI Categorization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini generates 3–5 modern technical tags and a plain-English 1-sentence explanation for every snippet you paste.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">The AI Publisher</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn a bare function into a GitHub README section, API reference, or step-by-step developer tutorial with markdown export.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Full-Stack Data Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full user-scoped data, collections, instant filtering, and responsive syntax highlighting across 20+ programming languages.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/50 text-center space-y-4 shadow-2xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Ready to supercharge your developer snippet vault?
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Access your personal snippets, star your favorites, and publish technical guides in seconds.
        </p>
        <button
          onClick={onEnterVault}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 text-sm"
        >
          <Code2 className="w-4 h-4" />
          <span>Launch My Vault Now</span>
        </button>
      </section>
    </div>
  );
};
