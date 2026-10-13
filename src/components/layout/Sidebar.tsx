import React from 'react';
import {
  Code2,
  Star,
  BookOpen,
  FolderPlus,
  Hash,
  Layers,
  Sparkles,
  ChevronRight,
  Database,
  CheckCircle,
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
}) => {
  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm self-start sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Vault Views */}
      <div>
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Workspace
        </div>
        <div className="space-y-1">
          <button
            onClick={() => {
              onToggleFavoritesOnly(false);
              onSelectCollection(null);
              onSelectLanguage('all');
              onSelectTag(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              !showFavoritesOnly && !selectedCollectionId && selectedLanguage === 'all' && !activeTag
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>All Snippets</span>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {totalCount}
            </span>
          </button>

          <button
            onClick={() => {
              onToggleFavoritesOnly(true);
              onSelectCollection(null);
              onSelectTag(null);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              showFavoritesOnly
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/40" />
              <span>Favorites</span>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {favoriteCount}
            </span>
          </button>

          <button
            onClick={onOpenPublisher}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/30 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>AI Publisher</span>
            </div>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              New
            </span>
          </button>
        </div>
      </div>

      {/* Collections Section */}
      <div>
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Collections
          </span>
          <button
            onClick={onOpenNewCollection}
            className="text-slate-400 hover:text-indigo-300 p-1 rounded hover:bg-slate-800 transition-colors"
            title="Add collection"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          {collections.map((col) => {
            const isSelected = selectedCollectionId === col.id;
            return (
              <button
                key={col.id}
                onClick={() => {
                  onSelectCollection(isSelected ? null : col.id);
                  onToggleFavoritesOnly(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-slate-800 text-slate-100 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: col.color || '#6366f1' }}
                  />
                  <span className="truncate">{col.name}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">
                  {col.snippet_count || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages Section */}
      <div>
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Languages
        </div>
        <div className="space-y-1">
          <button
            onClick={() => onSelectLanguage('all')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectedLanguage === 'all'
                ? 'bg-slate-800 text-indigo-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span>All Languages</span>
            <span className="font-mono text-[11px] text-slate-500">{totalCount}</span>
          </button>

          {availableLanguages.map(({ lang, count }) => {
            const meta = getLanguageMeta(lang);
            const isSelected = selectedLanguage.toLowerCase() === lang.toLowerCase();
            return (
              <button
                key={lang}
                onClick={() => onSelectLanguage(isSelected ? 'all' : lang)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span>{meta.name}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags Cloud */}
      {popularTags.length > 0 && (
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Popular Tags
            </span>
            {activeTag && (
              <button
                onClick={() => onSelectTag(null)}
                className="text-[10px] text-indigo-400 hover:underline"
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
                  onClick={() => onSelectTag(isSelected ? null : tag)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-mono transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-indigo-300 hover:bg-slate-700/80'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gemini AI Status Box */}
      <div className="mt-auto pt-3 border-t border-slate-800/80">
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Gemini Engine
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Auto-tagging, plain-English summaries &amp; documentation publisher.
          </p>
        </div>
      </div>
    </aside>
  );
};
