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
      className="group relative flex flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 hover:border-[#CBD5E1] hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language Pill */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm"
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
              <FolderGit2 className="w-3 h-3 text-[#1E3A8A]" />
              {snippet.collection_name}
            </span>
          )}

          {/* AI Status Badge */}
          {snippet.analysis_status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-blue-50 text-[#1E3A8A] border border-blue-200 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin text-[#1E3A8A]" />
              AI Analyzing...
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-xl transition-colors ${
              snippet.is_favorite
                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                : 'text-[#94A3B8] hover:text-amber-500 hover:bg-[#F1F5F9]'
            }`}
            title={snippet.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 ${
                snippet.is_favorite ? 'fill-amber-500' : ''
              }`}
            />
          </button>

          {/* Context Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-[#E2E8F0] bg-white shadow-xl py-1 z-30 text-xs text-[#0F172A] animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenPublisher(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[#F1F5F9] text-[#1E3A8A] font-medium"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    Publish as Docs
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[#F1F5F9] text-[#0F172A]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#64748B]" />
                    Edit Snippet
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onSelect(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-[#F1F5F9] text-[#0F172A]"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#64748B]" />
                    Full Inspector
                  </button>
                  <div className="h-px bg-[#E2E8F0] my-1" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(snippet);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
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
      <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors line-clamp-1 mb-2 font-sans">
        {snippet.title}
      </h3>

      {/* Plain-English AI Summary */}
      {snippet.summary && snippet.summary !== 'Pending AI analysis...' && (
        <div className="mb-3 flex items-start gap-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 text-xs text-[#334155] leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
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
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors border border-[#E2E8F0] font-mono"
            >
              #{tag}
            </button>
          ))}
          {snippet.tags.length > 4 && (
            <span className="text-[10px] text-[#64748B] font-mono">
              +{snippet.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Card Footer Bar */}
      <div className="mt-auto pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
        <div className="flex items-center gap-1.5 text-[#64748B]">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenPublisher(snippet)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200 transition-all shadow-sm"
            title="Publish as Documentation"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
