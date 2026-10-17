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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[#0F172A]/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A]/5 border border-[#0F172A]/15 text-xs font-mono text-[#0F172A] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
          <span>Powered by Google Gemini 3.8 Flash SDK</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0F172A] tracking-tight leading-tight max-w-4xl mx-auto font-sans">
          Your Personal Developer Knowledge Base &amp;{' '}
          <span className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-blue-600 bg-clip-text text-transparent">
            AI Publisher
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
          Store code snippets, organize them automatically with AI tags and plain-English summaries,
          search your personal library, and publish technical documentation with zero friction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onEnterVault}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] shadow-md shadow-[#0F172A]/20 transition-all hover:scale-105 text-sm cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Open Developer Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPublisher}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] transition-all text-sm shadow-sm cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#0F172A]" />
            <span>Launch AI Publisher</span>
          </button>
        </div>

        {/* Badges bar */}
        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-[#64748B] flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Full Isolation &amp; Persistence
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Real-time Gemini Tagging
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-[#0F172A]" /> 20+ Languages Supported
          </span>
        </div>
      </section>

      {/* Interactive Live Playground Showcase */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] tracking-tight flex items-center gap-2 font-sans">
              <Sparkles className="w-5 h-5 text-[#0F172A]" />
              Live Interactive Architecture
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              See how Google Gemini transforms a raw TypeScript function into structured metadata &amp; technical documentation.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] text-xs">
            <button
              onClick={() => setActiveFeature('publishing')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFeature === 'publishing'
                  ? 'bg-[#0F172A] text-white font-semibold shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              AI Publisher
            </button>
            <button
              onClick={() => setActiveFeature('tagging')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFeature === 'tagging'
                  ? 'bg-[#0F172A] text-white font-semibold shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Auto-Tags &amp; Summary
            </button>
            <button
              onClick={() => setActiveFeature('search')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeFeature === 'search'
                  ? 'bg-[#0F172A] text-white font-semibold shadow-sm'
                  : 'text-[#64748B] hover:text-[#0F172A]'
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
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider font-mono">
                1. Input Code Snippet
              </span>
              <span className="text-xs text-[#0F172A] font-mono font-semibold">fetchWithRetry.ts</span>
            </div>
            <CodeViewer
              code={SAMPLE_DEMO_CODE}
              language="typescript"
              maxHeight="340px"
              showLineNumbers={true}
            />
          </div>

          {/* Right: AI Output depending on active tab */}
          <div className="flex flex-col rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
              <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
                Gemini Output
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300">
                Generated in 320ms
              </span>
            </div>

            {activeFeature === 'publishing' && (
              <div className="space-y-3 text-xs text-[#334155] flex-1 overflow-y-auto max-h-[300px]">
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] font-mono text-[11px] text-[#0F172A] font-semibold">
                  # Module: `fetchWithRetry` API Utility
                </div>
                <div>
                  <span className="font-semibold text-[#0F172A] block mb-1">Overview:</span>
                  <p className="text-[#64748B] leading-relaxed">
                    A resilient HTTP fetch wrapper featuring exponential backoff retries, JSON deserialization, and strict generic response typing.
                  </p>
                </div>
                <div className="bg-[#0F172A] p-2.5 rounded-xl border border-[#334155] font-mono text-[11px] text-white">
                  <span className="text-[#94A3B8]">// Ready to paste into GitHub README</span><br />
                  <span className="text-blue-300">const</span> data = <span className="text-blue-300">await</span> fetchWithRetry&lt;UserProfile&gt;(<span className="text-emerald-400">'/api/user'</span>, &#123;&#125;, 3, 500);
                </div>
                <ul className="space-y-1 list-disc list-inside text-[#64748B] text-[11px]">
                  <li>Handles transient 500 &amp; 503 network flakiness.</li>
                  <li>Exponential delay doubles between successive failures.</li>
                </ul>
              </div>
            )}

            {activeFeature === 'tagging' && (
              <div className="space-y-4 text-xs text-[#334155] flex-1">
                <div>
                  <span className="text-[#64748B] font-semibold block mb-1.5 font-mono">
                    1-Sentence Plain English Summary:
                  </span>
                  <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] leading-relaxed">
                    "Executes an HTTP fetch request with recursive retry logic and exponential backoff timing to gracefully handle network failures."
                  </div>
                </div>

                <div>
                  <span className="text-[#64748B] font-semibold block mb-1.5 font-mono">
                    Categorized AI Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['typescript', 'async-await', 'exponential-backoff', 'fetch-api', 'resilience'].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-white text-[#0F172A] border border-[#CBD5E1] font-mono text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeature === 'search' && (
              <div className="space-y-3 text-xs text-[#334155] flex-1">
                <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] flex items-center gap-2 text-[#64748B]">
                  <Search className="w-3.5 h-3.5 text-[#0F172A]" />
                  <span>Query: "exponential backoff network"</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A]">
                  <span className="font-semibold text-[#0F172A] block mb-1">
                    Matched: fetchWithRetry Hook
                  </span>
                  <p className="text-[11px] text-[#64748B]">
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
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight font-sans">
            Built Specifically for Modern Software Engineers
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Every feature is engineered to streamline how you build, save, and share reusable code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0F172A]/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Automated AI Categorization</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Google Gemini generates 3–5 modern technical tags and a plain-English 1-sentence explanation for every snippet you paste.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0F172A]/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">The AI Publisher</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Turn a bare function into a GitHub README section, API reference, or step-by-step developer tutorial with markdown export.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0F172A]/40 shadow-sm transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">Full-Stack Data Isolation</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Full user-scoped data, collections, instant filtering, and responsive syntax highlighting across 20+ programming languages.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action footer banner */}
      <section className="p-8 md:p-12 rounded-3xl bg-[#0F172A] border border-[#1E293B] text-center space-y-4 shadow-xl text-white">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
          Ready to supercharge your developer snippet vault?
        </h2>
        <p className="text-xs md:text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          Access your personal snippets, star your favorites, and publish technical guides in seconds.
        </p>
        <button
          onClick={onEnterVault}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#0F172A] bg-white hover:bg-[#F8FAFC] shadow-lg transition-all hover:scale-105 text-sm cursor-pointer"
        >
          <Code2 className="w-4 h-4" />
          <span>Launch My Vault Now</span>
        </button>
      </section>
    </div>
  );
};
