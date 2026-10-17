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
  Palette,
  Check,
  FileText,
  Menu,
  X,
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
  activeTab: 'vault' | 'publisher' | 'collections' | 'landing' | 'readme-generator';
  setActiveTab: (tab: 'vault' | 'publisher' | 'collections' | 'landing' | 'readme-generator') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleMobileSidebar?: () => void;
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
  onToggleMobileSidebar,
}) => {
  const [syntaxTheme, setSyntaxTheme] = useState<SyntaxTheme>(getStoredSyntaxTheme());
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#0F172A] text-white shadow-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mobile hamburger menu toggle */}
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] border border-[#334155] transition-colors"
              title="Toggle sidebar filters"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setActiveTab('vault')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] border border-[#334155] shadow-md group-hover:scale-105 transition-all">
              <Code2 className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#16A34A] border-2 border-[#0F172A] flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base md:text-lg tracking-tight text-white font-sans">
                  Snippet<span className="text-[#60A5FA]">Vault</span>
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#1E293B] text-[#93C5FD] border border-[#334155]">
                  AI v2.4
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] block -mt-0.5">
                Developer Knowledge Base &amp; Publisher
              </span>
            </div>
          </button>

          {/* Desktop tab navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveTab('vault')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'vault'
                  ? 'bg-[#1E293B] text-white border border-[#334155] shadow-sm font-semibold'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              Vault Dashboard
            </button>
            <button
              onClick={() => setActiveTab('publisher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'publisher'
                  ? 'bg-[#1E3A8A] text-white border border-[#3B82F6]/50 shadow-sm font-semibold'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>AI Publisher</span>
            </button>
            <button
              onClick={() => setActiveTab('readme-generator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'readme-generator'
                  ? 'bg-[#1E3A8A] text-white border border-[#3B82F6]/50 shadow-sm font-semibold'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>README Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                activeTab === 'landing'
                  ? 'bg-[#1E293B] text-white border border-[#334155] shadow-sm font-semibold'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Product Tour</span>
            </button>
          </nav>
        </div>

        {/* Search input (when in dashboard) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search code, titles, AI tags, summaries... (press / to focus)"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'vault') setActiveTab('vault');
              }}
              className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#60A5FA] focus:ring-1 focus:ring-[#60A5FA] transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#0F172A] text-[#94A3B8] border border-[#334155]">
              /
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick AI Publisher button */}
          <button
            onClick={() => {
              setActiveTab('publisher');
              onOpenPublisher();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white hover:bg-[#334155] bg-[#1E293B] border border-[#334155] transition-all shadow-sm"
            title="Launch AI Publisher"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span className="hidden xl:inline">AI Publisher</span>
          </button>

          {/* Primary Action Button: New Snippet (Crisp White contrast on Navy) */}
          <button
            onClick={onNewSnippet}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0F172A] bg-white hover:bg-slate-100 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-[#0F172A]" />
            <span className="hidden sm:inline">New Snippet</span>
          </button>

          {/* Syntax Theme Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium bg-[#1E293B] hover:bg-[#334155] text-[#CBD5E1] hover:text-white border border-[#334155] transition-colors"
              title="Syntax Highlighting Theme"
            >
              <Palette className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span className="hidden lg:inline">{SYNTAX_THEMES[syntaxTheme].shortLabel}</span>
            </button>

            {showThemeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl p-1.5 shadow-2xl border border-[#334155] bg-[#0F172A] z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[#334155] mb-1 font-sans">
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
                            ? 'bg-[#1E3A8A] text-white font-semibold shadow-sm'
                            : 'hover:bg-[#1E293B] text-[#CBD5E1] hover:text-white'
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
              </>
            )}
          </div>

          {/* User Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#334155]">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={onOpenAuth}
                title="Account Settings & Multi-user"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-[#3B82F6]/50 object-cover group-hover:border-[#60A5FA] transition-colors"
                />
                <div className="hidden xl:block text-left text-xs">
                  <span className="font-semibold text-white block truncate max-w-[100px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block truncate max-w-[100px]">
                    Pro Vault
                  </span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#1E293B] rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155] transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile navigation menu toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] border border-[#334155] transition-colors"
            title="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile nav bar drop */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-3 border-t border-[#1E293B] bg-[#0F172A] flex flex-col gap-2 text-xs animate-in slide-in-from-top-2 duration-150">
          <div className="mb-2 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search snippets, code, tags..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'vault') setActiveTab('vault');
                }}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-xs text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#60A5FA]"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setActiveTab('vault');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-left ${
              activeTab === 'vault'
                ? 'bg-[#1E293B] text-white border border-[#334155]'
                : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#60A5FA]" />
            <span>Vault Dashboard</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('publisher');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-left ${
              activeTab === 'publisher'
                ? 'bg-[#1E3A8A] text-white border border-[#3B82F6]/50'
                : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#60A5FA]" />
            <span>AI Publisher</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('readme-generator');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-left ${
              activeTab === 'readme-generator'
                ? 'bg-[#1E3A8A] text-white border border-[#3B82F6]/50'
                : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-[#93C5FD]" />
            <span>README Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('landing');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-left ${
              activeTab === 'landing'
                ? 'bg-[#1E293B] text-white border border-[#334155]'
                : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-[#94A3B8]" />
            <span>Product Tour</span>
          </button>
        </div>
      )}
    </header>
  );
};
