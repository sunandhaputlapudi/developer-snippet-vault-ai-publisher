import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Mail,
  User as UserIcon,
  ArrowRight,
  Shield,
  Layers,
  BookOpen,
  FileText,
  Lock,
  CheckCircle2,
  Terminal,
  Cpu,
} from 'lucide-react';
import { loginUser, signupUser } from '../../lib/api';
import { User } from '../../types/snippet';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [preferredLanguage, setPreferredLanguage] = useState('typescript');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide a valid developer email.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let res;
      if (mode === 'login') {
        res = await loginUser(email.trim());
      } else {
        res = await signupUser(email.trim(), name.trim() || undefined);
      }
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar Header */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Code2 className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-slate-950" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">
                Snippet<span className="text-indigo-400">Vault</span>
              </span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                AI v2.4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Telemetry Vault</span>
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-indigo-300">
              <Cpu className="w-3.5 h-3.5" />
              <span>Gemini 3.8 &amp; Hugging Face</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Section */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Product Showcase & Value Proposition (7 columns) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Next-Gen Engineering Knowledge Base</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Organize code. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Publish documentation.
              </span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg">
              Sign in to access your personal high-speed code snippet vault, AI-powered syntax tagging,
              automated GitHub <code>README.md</code> generator, and interactive REST API explorer.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Prism Syntax Highlighting</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dark, Light, High Contrast (WCAG AAA), and Dracula themes.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">README.md Studio</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Draft full GitHub project documentation with badges in seconds.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Dual AI Engine</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Gemini 3.8 Flash + Hugging Face StarCoder2 &amp; CodeLlama models.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Interactive REST API</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    18 live endpoints with OpenAPI 3.0 specification export.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Authentication Card (5 columns) */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Form Mode Selector */}
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'login'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'signup'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  {mode === 'login' ? 'Welcome Back, Developer' : 'Create Your Vault Account'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {mode === 'login'
                    ? 'Enter your email to load your snippets and collections.'
                    : 'Set up your developer profile to start organizing and publishing code.'}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Developer Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="developer@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Engineering Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Backend Engineer"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1.5">Primary Language</label>
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans"
                      >
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="sql">SQL</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.01]"
                >
                  <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Open Developer Vault' : 'Create & Enter Vault'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-slate-900/90 px-2 text-slate-500 font-mono">Or Quick Start Demo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      setError(null);
                      try {
                        const res = await loginUser('tejaswanth899@gmail.com');
                        onLoginSuccess(res.user);
                      } catch (err: any) {
                        setError(err.message || 'Login failed');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="flex flex-col items-start p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group disabled:opacity-50"
                  >
                    <span className="font-semibold text-slate-200 text-xs group-hover:text-indigo-400">Tejaswanth</span>
                    <span className="text-[10px] text-slate-400 font-mono">Lead Architect</span>
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={async () => {
                      setLoading(true);
                      setError(null);
                      try {
                        const res = await loginUser('alex.rivera@example.dev');
                        onLoginSuccess(res.user);
                      } catch (err: any) {
                        setError(err.message || 'Login failed');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="flex flex-col items-start p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 hover:border-indigo-500/50 transition-all text-left group disabled:opacity-50"
                  >
                    <span className="font-semibold text-slate-200 text-xs group-hover:text-indigo-400">Alex Rivera</span>
                    <span className="text-[10px] text-slate-400 font-mono">Backend Engineer</span>
                  </button>
                </div>

                <div className="pt-2 text-center text-[11px] text-slate-500">
                  <span>By continuing, your vault will be encrypted with your developer identity.</span>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        <p>Developer Snippet Vault &amp; AI Publisher • Production REST Engine</p>
      </footer>
    </div>
  );
};
