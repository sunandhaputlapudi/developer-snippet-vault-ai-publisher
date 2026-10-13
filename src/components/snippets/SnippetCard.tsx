import React, { useState } from 'react';
import {
  Star,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
  Clock,
  FolderGit2,
  RefreshCw,
} from 'lucide-react';
import { Snippet } from '../../types/snippet';
import { getLanguageMeta } from '../../lib/languages';
import { CodeViewer } from './CodeViewer';

interface SnippetCardProps {
  snippet: Snippet;
  onSelect: (snippet: Snippet) => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  onToggleFavorite: (id: string) => void;
  onOpenPublisher: (snippet: Snippet) => void;
  onSelectTag?: (tag: string) => void;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({
  snippet,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenPublisher,
  onSelectTag,
}) => {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const langMeta = getLanguageMeta(snippet.language);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.code_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(snippet.id);
  };

  const formattedDate = new Date(snippet.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      onClick={() => onSelect(snippet)}
      className="group relative flex flex-col rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 hover:bg-slate-900/90 hover:border-slate-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Pill */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
            style={{
              color: langMeta.color,
              backgroundColor: langMeta.bgLight,
              border: `1px solid ${langMeta.badgeBorder}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: langMeta.color }}
            />
            {langMeta.name}
          </span>

          {/* Collection Pill */}
          {snippet.collection_name && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
              <FolderGit2 className="w-3 h-3 text-indigo-400" />
              {snippet.collection_name}
            </span>
          )}

          {/* AI Status Badge */}
          {snippet.analysis_status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              AI Analyzing...
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg transition-colors ${
              snippet.is_favorite
                ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                : 'text-slate-500 hover:text-amber-300 hover:bg-slate-800'
            }`}
            title={snippet.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 ${
                snippet.is_favorite ? 'fill-amber-400' : ''
              }`}
            />
          </button>

          {/* Context Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-md shadow-2xl py-1 z-30 text-xs text-slate-300">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPublisher(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-white"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    Publish as Docs
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-white"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                    Edit Snippet
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onSelect(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    Full Inspector
                  </button>
                  <div className="h-px bg-slate-800 my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Snippet
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Snippet Title */}
      <h3 className="text-base font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1 mb-2">
        {snippet.title}
      </h3>

      {/* Plain-English AI Summary */}
      {snippet.summary && snippet.summary !== 'Pending AI analysis...' && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-indigo-950/20 border border-indigo-900/40 p-2.5 text-xs text-indigo-200/90 leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2">{snippet.summary}</p>
        </div>
      )}

      {/* Compact Code Preview */}
      <div className="mb-3 pointer-events-none" onClick={(e) => e.stopPropagation()}>
        <CodeViewer
          code={snippet.code_content}
          language={snippet.language}
          maxHeight="160px"
          showLineNumbers={false}
        />
      </div>

      {/* Tags Chips */}
      {snippet.tags && snippet.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {snippet.tags.slice(0, 4).map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTag?.(tag);
              }}
              className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-indigo-300 hover:bg-slate-700/80 transition-colors border border-slate-700/40"
            >
              #{tag}
            </button>
          ))}
          {snippet.tags.length > 4 && (
            <span className="text-[10px] text-slate-500 font-mono">
              +{snippet.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Card Footer Bar */}
      <div className="mt-auto pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenPublisher(snippet)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 transition-colors"
            title="Publish as Documentation"
          >
            <BookOpen className="w-3 h-3" />
            <span>Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
