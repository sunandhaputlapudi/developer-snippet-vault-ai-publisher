import React, { useState, useEffect } from 'react';
import {
  Code2,
  Sparkles,
  Plus,
  BookOpen,
  Search,
  User,
  LogOut,
  Compass,
  Layers,
  Palette,
  Check,
  FileText,
} from 'lucide-react';
import { User as UserType, SyntaxTheme } from '../../types/snippet';
import {
  SYNTAX_THEMES,
  getStoredSyntaxTheme,
  setStoredSyntaxTheme,
} from '../../lib/theme';

interface NavbarProps {
  user: UserType | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNewSnippet: () => void;
  onOpenPublisher: () => void;
  activeTab: 'vault' | 'publisher' | 'collections' | 'landing' | 'api-explorer' | 'readme-generator';
  setActiveTab: (tab: 'vault' | 'publisher' | 'collections' | 'landing' | 'api-explorer' | 'readme-generator') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onNewSnippet,
  onOpenPublisher,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
}) => {
  const [syntaxTheme, setSyntaxTheme] = useState<SyntaxTheme>(getStoredSyntaxTheme());
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleGlobalTheme = (e: Event) => {
      const custom = e as CustomEvent<SyntaxTheme>;
      if (custom.detail) setSyntaxTheme(custom.detail);
    };
    window.addEventListener('syntax-theme-changed', handleGlobalTheme);
    return () => window.removeEventListener('syntax-theme-changed', handleGlobalTheme);
  }, []);

  const handleSelectTheme = (t: SyntaxTheme) => {
    setSyntaxTheme(t);
    setStoredSyntaxTheme(t);
    setShowThemeMenu(false);
  };
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <Code2 className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-slate-950" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-lg tracking-tight text-white font-sans">
                  Snippet<span className="text-indigo-400">Vault</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  AI v2.4
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                Developer Knowledge Base &amp; Publisher
              </span>
            </div>
          </button>

          {/* Quick tab switchers */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'vault'
                  ? 'bg-slate-800 text-indigo-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              Vault Dashboard
            </button>
            <button
              onClick={() => setActiveTab('publisher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'publisher'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Publisher</span>
            </button>
            <button
              onClick={() => setActiveTab('readme-generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'readme-generator'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>README Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('api-explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'api-explorer'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>REST API</span>
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'landing'
                  ? 'bg-slate-800 text-slate-200'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Product Tour</span>
            </button>
          </nav>
        </div>

        {/* Search input (when in dashboard) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, titles, AI tags, summaries... (press / to focus)"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'vault') setActiveTab('vault');
              }}
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
              /
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setActiveTab('publisher');
              onOpenPublisher();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/60 transition-colors shadow-sm"
            title="Launch AI Publisher"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">AI Publisher</span>
          </button>

          <button
            onClick={onNewSnippet}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Snippet</span>
          </button>

          {/* Syntax Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              title="Syntax Highlighting Theme"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">{SYNTAX_THEMES[syntaxTheme].shortLabel}</span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-1 w-56 rounded-xl p-1.5 shadow-2xl border border-slate-800 bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Syntax Themes
                </div>
                {(Object.keys(SYNTAX_THEMES) as SyntaxTheme[]).map((k) => {
                  const t = SYNTAX_THEMES[k];
                  const active = syntaxTheme === k;
                  return (
                    <button
                      key={k}
                      onClick={() => handleSelectTheme(k)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors ${
                        active
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{t.label}</span>
                        <span className="text-[10px] opacity-70">
                          {t.id === 'high-contrast' ? 'Pure Black #000 (AAA)' : t.shortLabel}
                        </span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={onOpenAuth}
                title="Account Settings &amp; Multi-user"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
                />
                <div className="hidden xl:block text-left text-xs">
                  <span className="font-semibold text-slate-200 block truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">
                    Pro Vault
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
