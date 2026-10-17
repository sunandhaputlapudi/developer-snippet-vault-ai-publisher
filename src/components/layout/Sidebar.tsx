import React from 'react';
import {
  Code2,
  Star,
  BookOpen,
  FolderPlus,
  Hash,
  Sparkles,
  CheckCircle,
  X,
} from 'lucide-react';
import { Collection } from '../../types/snippet';
import { getLanguageMeta } from '../../lib/languages';

interface SidebarProps {
  totalCount: number;
  favoriteCount: number;
  collections: Collection[];
  selectedCollectionId: string | null;
  onSelectCollection: (id: string | null) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: (favOnly: boolean) => void;
  onOpenPublisher: () => void;
  onOpenNewCollection: () => void;
  availableLanguages: { lang: string; count: number }[];
  popularTags: string[];
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  totalCount,
  favoriteCount,
  collections,
  selectedCollectionId,
  onSelectCollection,
  selectedLanguage,
  onSelectLanguage,
  activeTag,
  onSelectTag,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onOpenPublisher,
  onOpenNewCollection,
  availableLanguages,
  popularTags,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col gap-6 p-4">
      {/* Mobile close header */}
      {onCloseMobile && (
        <div className="md:hidden flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Vault Filters &amp; Workspaces
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Vault Workspace Views */}
      <div>
        <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-2 font-mono">
          Workspace
        </div>
        <div className="space-y-1">
          <button
            onClick={() => {
              onToggleFavoritesOnly(false);
              onSelectCollection(null);
              onSelectLanguage('all');
              onSelectTag(null);
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              !showFavoritesOnly && !selectedCollectionId && selectedLanguage === 'all' && !activeTag
                ? 'bg-white text-[#0F172A] font-bold shadow-md'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Code2 className={`w-4 h-4 ${!showFavoritesOnly && !selectedCollectionId && selectedLanguage === 'all' && !activeTag ? 'text-[#0F172A]' : 'text-[#60A5FA]'}`} />
              <span>All Snippets</span>
            </div>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
              !showFavoritesOnly && !selectedCollectionId && selectedLanguage === 'all' && !activeTag
                ? 'bg-[#0F172A] text-white'
                : 'bg-[#1E293B] text-[#CBD5E1] border border-[#334155]'
            }`}>
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => {
              onToggleFavoritesOnly(true);
              onSelectCollection(null);
              onSelectTag(null);
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              showFavoritesOnly
                ? 'bg-amber-400 text-[#0F172A] font-bold shadow-md'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className={`w-4 h-4 ${showFavoritesOnly ? 'text-[#0F172A] fill-[#0F172A]' : 'text-amber-400 fill-amber-400/40'}`} />
              <span>Favorites</span>
            </div>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded-full ${
              showFavoritesOnly
                ? 'bg-[#0F172A] text-white'
                : 'bg-[#1E293B] text-amber-300 border border-[#334155]'
            }`}>
              {favoriteCount}
            </span>
          </button>

          <button
            onClick={() => {
              onOpenPublisher();
              onCloseMobile?.();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-[#60A5FA] group-hover:scale-110 transition-transform" />
              <span>AI Publisher</span>
            </div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1E293B] text-[#93C5FD] border border-[#334155]">
              Generate
            </span>
          </button>
        </div>
      </div>

      {/* Collections Section */}
      <div>
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
            Collections
          </span>
          <button
            onClick={onOpenNewCollection}
            className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#1E293B] transition-colors"
            title="Create new collection"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          {collections.length === 0 ? (
            <p className="px-3 py-2 text-[11px] text-[#94A3B8]/70 italic">
              No collections yet. Group snippets together.
            </p>
          ) : (
            collections.map((col) => {
              const isSelected = selectedCollectionId === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => {
                    onSelectCollection(isSelected ? null : col.id);
                    onToggleFavoritesOnly(false);
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#1E293B] text-white border border-[#3B82F6]/50 shadow-sm font-semibold'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: col.color || '#3B82F6' }}
                    />
                    <span className="truncate">{col.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    {col.snippet_count || 0}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Languages Section */}
      <div>
        <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-2 font-mono">
          Languages
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => {
              onSelectLanguage('all');
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedLanguage === 'all'
                ? 'bg-[#1E293B] text-white border border-[#334155] font-semibold'
                : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]/70'
            }`}
          >
            <span>All Languages</span>
            <span className="font-mono text-[11px] text-[#94A3B8]">{totalCount}</span>
          </button>

          {availableLanguages.map(({ lang, count }) => {
            const meta = getLanguageMeta(lang);
            const isSelected = selectedLanguage.toLowerCase() === lang.toLowerCase();
            return (
              <button
                key={lang}
                onClick={() => {
                  onSelectLanguage(isSelected ? 'all' : lang);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#1E293B] text-white border border-[#334155] font-semibold'
                    : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E293B]/70'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="truncate">{meta.name}</span>
                </div>
                <span className="font-mono text-[11px] text-[#94A3B8]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags Cloud */}
      {popularTags.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono">
              Popular Tags
            </span>
            {activeTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="text-[10px] text-[#60A5FA] hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 px-1">
            {popularTags.map((tag) => {
              const isSelected = activeTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    onSelectTag(isSelected ? null : tag);
                    onCloseMobile?.();
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all ${
                    isSelected
                      ? 'bg-white text-[#0F172A] font-bold shadow-sm'
                      : 'bg-[#1E293B] text-[#CBD5E1] hover:text-white hover:bg-[#334155] border border-[#334155]'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Engine Status Card */}
      <div className="mt-auto pt-3 border-t border-[#1E293B]">
        <div className="rounded-xl bg-[#1E293B] border border-[#334155] p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-white">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
              AI Studio Engine
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              Online
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] leading-normal">
            Auto-tagging, plain-English summaries &amp; documentation publisher.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 hidden md:flex flex-col rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-lg self-start sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Sidebar Modal/Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#0F172A] border-r border-[#1E293B] shadow-2xl overflow-y-auto z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
