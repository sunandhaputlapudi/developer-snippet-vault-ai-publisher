import React, { useState } from 'react';
import {
  Code2,
  Sparkles,
  Mail,
  User as UserIcon,
  ArrowRight,
  Shield,
  BookOpen,
  FileText,
  Terminal,
  Cpu,
  Download,
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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between selection:bg-[#0F172A] selection:text-white">
      {/* Top Navbar Header */}
      <header className="border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] shadow-md shadow-[#0F172A]/20">
              <Code2 className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#0F172A] font-sans">
                Snippet<span className="text-[#1E3A8A]">Vault</span>
              </span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#0F172A]/10 text-[#0F172A] border border-[#0F172A]/20">
                AI v2.4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#64748B]">
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Isolated Vault</span>
            </span>
            <span className="hidden sm:inline text-[#CBD5E1]">•</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-[#0F172A] font-semibold">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/15 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#0F172A]" />
              <span>Next-Gen Engineering Knowledge Base</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight font-sans">
              Organize code. <br />
              <span className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-blue-600 bg-clip-text text-transparent">
                Publish documentation.
              </span>
            </h1>

            <p className="text-[#475569] text-sm md:text-base leading-relaxed max-w-lg">
              Sign in to access your personal high-speed code snippet vault, AI-powered syntax tagging,
              automated GitHub <code className="bg-[#E2E8F0] text-[#0F172A] px-1.5 py-0.5 rounded font-mono text-xs">README.md</code> generator, and instant documentation publisher.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#0F172A]/5 text-[#0F172A] shrink-0 border border-[#0F172A]/10">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Syntax Highlighting</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Deep Navy, Light, High Contrast (WCAG AAA), and Dracula themes.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#0F172A]/5 text-[#0F172A] shrink-0 border border-[#0F172A]/10">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">README.md Studio</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Draft full GitHub project documentation with badges in seconds.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#0F172A]/5 text-[#0F172A] shrink-0 border border-[#0F172A]/10">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Dual AI Engine</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Gemini 3.8 Flash + Hugging Face StarCoder2 &amp; CodeLlama models.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-200">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Markdown Export</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Export filtered snippet bundles with tables of contents and summaries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Authentication Card (5 columns) */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-xl p-6 sm:p-8 space-y-6">
              {/* Form Mode Selector */}
              <div className="flex rounded-xl bg-[#F1F5F9] p-1 border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A]'
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
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0F172A]">
                  {mode === 'login' ? 'Welcome Back, Developer' : 'Create Your Vault Account'}
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  {mode === 'login'
                    ? 'Enter your email to load your snippets and collections.'
                    : 'Set up your developer profile to start organizing and publishing code.'}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[#0F172A] font-semibold mb-1.5 font-mono">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <input
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1.5 font-mono">Developer Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <input
                      type="email"
                      required
                      placeholder="developer@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#0F172A] font-semibold mb-1.5 font-mono">Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Backend Engineer"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#0F172A] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[#0F172A] font-semibold mb-1.5 font-mono">Primary Language</label>
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#0F172A] focus:bg-white font-sans"
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
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 transition-all shadow-md shadow-[#0F172A]/15 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Open Developer Vault' : 'Create & Enter Vault'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-[#64748B] font-mono font-semibold">Or Quick Start Demo</span>
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
                  className="flex flex-col items-start p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#0F172A]/40 transition-all text-left group disabled:opacity-50 cursor-pointer"
                >
                  <span className="font-semibold text-[#0F172A] text-xs group-hover:text-[#1E3A8A]">Tejaswanth</span>
                  <span className="text-[10px] text-[#64748B] font-mono">Lead Architect</span>
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
                  className="flex flex-col items-start p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#0F172A]/40 transition-all text-left group disabled:opacity-50 cursor-pointer"
                >
                  <span className="font-semibold text-[#0F172A] text-xs group-hover:text-[#1E3A8A]">Alex Rivera</span>
                  <span className="text-[10px] text-[#64748B] font-mono">Backend Engineer</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[11px] text-[#64748B]">
                <span>By continuing, your vault will be encrypted with your developer identity.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white px-6 py-4 text-center text-xs text-[#64748B]">
        <p>Developer Snippet Vault &amp; AI Publisher • Secure Code Repository</p>
      </footer>
    </div>
  );
};
