import React, { useState, useEffect, useMemo } from 'react';
import {
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Code2,
  WrapText,
  Palette,
  ChevronDown,
} from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import { getLanguageMeta } from '../../lib/languages';
import { SyntaxTheme } from '../../types/snippet';
import {
  SYNTAX_THEMES,
  getStoredSyntaxTheme,
  setStoredSyntaxTheme,
} from '../../lib/theme';

interface CodeViewerProps {
  code: string;
  language: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
  title?: string;
  syntaxTheme?: SyntaxTheme;
  onThemeChange?: (theme: SyntaxTheme) => void;
  className?: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language,
  maxHeight,
  showLineNumbers = true,
  title,
  syntaxTheme: externalTheme,
  onThemeChange,
  className = '',
}) => {
  const [currentTheme, setCurrentTheme] = useState<SyntaxTheme>(
    externalTheme || getStoredSyntaxTheme()
  );
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(false);
  const [fontSize, setFontSize] = useState<'xs' | 'sm' | 'base'>('sm');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const langMeta = getLanguageMeta(language);

  // Sync with external prop or global theme event
  useEffect(() => {
    if (externalTheme) {
      setCurrentTheme(externalTheme);
    }
  }, [externalTheme]);

  useEffect(() => {
    const handleGlobalThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<SyntaxTheme>;
      if (customEvent.detail) {
        setCurrentTheme(customEvent.detail);
      }
    };
    window.addEventListener('syntax-theme-changed', handleGlobalThemeChange);
    return () => {
      window.removeEventListener('syntax-theme-changed', handleGlobalThemeChange);
    };
  }, []);

  const handleSelectTheme = (newTheme: SyntaxTheme) => {
    setCurrentTheme(newTheme);
    setStoredSyntaxTheme(newTheme);
    onThemeChange?.(newTheme);
    setShowThemeMenu(false);
  };

  const highlightedHtml = useMemo(() => {
    try {
      const cleanLang = (language || 'javascript').toLowerCase();
      const grammar =
        Prism.languages[cleanLang] ||
        (cleanLang === 'ts' ? Prism.languages.typescript : null) ||
        (cleanLang === 'js' ? Prism.languages.javascript : null) ||
        (cleanLang === 'dockerfile' ? Prism.languages.docker : null) ||
        (cleanLang === 'sh' || cleanLang === 'shell' ? Prism.languages.bash : null) ||
        Prism.languages.javascript ||
        Prism.languages.clike;

      if (grammar) {
        return Prism.highlight(code, grammar, cleanLang);
      }
    } catch (e) {
      // fallback
    }

    // Basic safe HTML escape
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }, [code, language]);

  const lines = useMemo(() => code.split('\n'), [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const fontSizeClasses = {
    xs: 'text-xs leading-5',
    sm: 'text-xs md:text-sm leading-6',
    base: 'text-sm md:text-base leading-7',
  }[fontSize];

  return (
    <div
      data-syntax-theme={currentTheme}
      className={`syntax-container relative rounded-xl border font-mono overflow-hidden shadow-2xl transition-all duration-200 ${
        isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''
      } ${className}`}
      style={{
        backgroundColor: 'var(--syntax-bg)',
        borderColor: 'var(--syntax-border)',
      }}
    >
      {/* Code Header Bar */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b backdrop-blur-sm select-none"
        style={{
          backgroundColor: 'var(--syntax-header-bg)',
          borderColor: 'var(--syntax-border)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Mac style dots */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div
            className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold tracking-wide"
            style={{
              color: langMeta.color,
              backgroundColor: langMeta.bgLight,
              border: `1px solid ${langMeta.badgeBorder}`,
            }}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>{langMeta.name}</span>
          </div>

          {title && (
            <span
              className="text-xs font-sans truncate max-w-[180px] md:max-w-xs"
              style={{ color: 'var(--syntax-text)', opacity: 0.8 }}
            >
              {title}
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 text-slate-400">
          {/* Syntax Theme Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Toggle syntax highlighting theme"
              className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-slate-800/60 transition-colors"
              style={{ color: 'var(--syntax-text)' }}
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline text-[11px] font-sans font-medium">
                {SYNTAX_THEMES[currentTheme].shortLabel}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showThemeMenu && (
              <div
                className="absolute right-0 mt-1 w-52 rounded-xl p-1.5 shadow-2xl border z-50 animate-in fade-in zoom-in-95 duration-150"
                style={{
                  backgroundColor: 'var(--syntax-header-bg)',
                  borderColor: 'var(--syntax-border)',
                }}
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans border-b border-slate-800/60 mb-1">
                  Syntax Themes
                </div>
                {(Object.keys(SYNTAX_THEMES) as SyntaxTheme[]).map((themeKey) => {
                  const themeObj = SYNTAX_THEMES[themeKey];
                  const isSelected = currentTheme === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => handleSelectTheme(themeKey)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-sans flex items-center justify-between gap-2 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{themeObj.label}</span>
                        <span className="text-[10px] opacity-70 font-mono">
                          {themeObj.id === 'high-contrast' ? 'Pure Black #000 (AAA)' : themeObj.shortLabel}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setWrapLines(!wrapLines)}
            title="Toggle word wrap"
            className={`p-1.5 rounded hover:bg-slate-800/60 transition-colors ${
              wrapLines ? 'text-indigo-400 bg-indigo-950/50' : 'hover:text-slate-200'
            }`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() =>
              setFontSize((prev) => (prev === 'xs' ? 'sm' : prev === 'sm' ? 'base' : 'xs'))
            }
            title="Cycle font size"
            className="px-2 py-1 text-xs rounded hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
          >
            {fontSize.toUpperCase()}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all duration-200 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
            }`}
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div
        className={`overflow-auto p-4 ${
          isFullscreen ? 'flex-1' : ''
        }`}
        style={{
          maxHeight: isFullscreen ? 'none' : maxHeight || '450px',
          backgroundColor: 'var(--syntax-bg)',
        }}
      >
        <div className={`flex ${fontSizeClasses}`}>
          {showLineNumbers && (
            <div
              className="select-none pr-4 text-right font-mono border-r mr-4"
              style={{
                color: 'var(--syntax-line-number)',
                borderRightColor: 'var(--syntax-line-border)',
              }}
            >
              {lines.map((_, i) => (
                <div key={i} className="leading-inherit">
                  {i + 1}
                </div>
              ))}
            </div>
          )}

          <pre
            className={`flex-1 font-mono ${
              wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
            }`}
            style={{ color: 'var(--syntax-text)' }}
          >
            <code
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              className={`language-${language}`}
            />
          </pre>
        </div>
      </div>

      {/* Bottom code stats bar */}
      <div
        className="flex items-center justify-between px-3 py-1 border-t text-[11px]"
        style={{
          backgroundColor: 'var(--syntax-footer-bg)',
          borderColor: 'var(--syntax-border)',
          color: 'var(--syntax-line-number)',
        }}
      >
        <span>{lines.length} lines</span>
        <span className="flex items-center gap-2">
          <span>Theme: {SYNTAX_THEMES[currentTheme].label}</span>
          <span>•</span>
          <span>{code.length} characters</span>
        </span>
      </div>
    </div>
  );
};
