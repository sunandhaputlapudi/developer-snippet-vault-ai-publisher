import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Save,
  Wand2,
  AlertCircle,
  FolderGit2,
  Code2,
} from 'lucide-react';
import { Snippet, Collection } from '../../types/snippet';
import { SUPPORTED_LANGUAGES, detectLanguageFromCode } from '../../lib/languages';
import { directAIAnalyze } from '../../lib/api';

interface SnippetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    title: string;
    code_content: string;
    language: string;
    notes?: string;
    collection_id?: string | null;
    is_favorite?: boolean;
    auto_analyze?: boolean;
  }) => Promise<void>;
  initialSnippet?: Snippet | null;
  collections: Collection[];
}

export const SnippetFormModal: React.FC<SnippetFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSnippet,
  collections,
}) => {
  const [title, setTitle] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [notes, setNotes] = useState('');
  const [collectionId, setCollectionId] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  // Pre-analysis preview state
  const [isPreviewingAI, setIsPreviewingAI] = useState(false);
  const [previewAnalysis, setPreviewAnalysis] = useState<{
    tags: string[];
    summary: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialSnippet) {
      setTitle(initialSnippet.title);
      setCodeContent(initialSnippet.code_content);
      setLanguage(initialSnippet.language || 'typescript');
      setNotes(initialSnippet.notes || '');
      setCollectionId(initialSnippet.collection_id || '');
      setIsFavorite(initialSnippet.is_favorite || false);
      setAutoAnalyze(true);
      setPreviewAnalysis(null);
    } else {
      setTitle('');
      setCodeContent('');
      setLanguage('typescript');
      setNotes('');
      setCollectionId('');
      setIsFavorite(false);
      setAutoAnalyze(true);
      setPreviewAnalysis(null);
    }
    setError(null);
  }, [initialSnippet, isOpen]);

  if (!isOpen) return null;

  const handleAutoDetectLang = () => {
    if (!codeContent.trim()) return;
    const detected = detectLanguageFromCode(codeContent);
    setLanguage(detected);
  };

  const handlePreviewAI = async () => {
    if (!codeContent.trim()) {
      setError('Please provide code before running AI analysis.');
      return;
    }
    setError(null);
    setIsPreviewingAI(true);
    try {
      const result = await directAIAnalyze({
        title: title || 'Untitled Snippet',
        language,
        code_content: codeContent,
        notes,
      });
      setPreviewAnalysis({
        tags: result.tags,
        summary: result.summary,
      });
    } catch (err: any) {
      setError(err.message || 'AI preview failed');
    } finally {
      setIsPreviewingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!codeContent.trim()) {
      setError('Code content cannot be empty.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSave({
        id: initialSnippet?.id,
        title: title.trim(),
        code_content: codeContent.trim(),
        language,
        notes: notes.trim(),
        collection_id: collectionId || null,
        is_favorite: isFavorite,
        auto_analyze: autoAnalyze,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save snippet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enable tab indentation in the code textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode =
        codeContent.substring(0, start) + '  ' + codeContent.substring(end);
      setCodeContent(newCode);

      // Restore cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const lineCount = codeContent.split('\n').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#CBD5E1] bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0F172A] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center text-white">
              <Code2 className="w-4 h-4 text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialSnippet ? 'Edit Snippet' : 'Create New Snippet'}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Store in your developer vault with AI tags and plain-English summary
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {/* Row 1: Title */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5 font-mono">
              Snippet Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Recursive Tree CTE or useDebounce Hook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-sm focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-colors"
            />
          </div>

          {/* Row 2: Language & Collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A] font-mono">
                  Programming Language
                </label>
                <button
                  type="button"
                  onClick={handleAutoDetectLang}
                  className="text-[11px] font-semibold text-[#1E3A8A] hover:text-[#0F172A] flex items-center gap-1 transition-colors"
                >
                  <Wand2 className="w-3 h-3 text-[#1E3A8A]" />
                  Auto-detect
                </button>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#0F172A] transition-colors capitalize"
              >
                {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5 font-mono">
                Collection / Folder
              </label>
              <select
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-sm focus:outline-none focus:border-[#0F172A] transition-colors"
              >
                <option value="">No Collection (General)</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    📁 {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Code Content Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#0F172A] font-mono">
                Code Content <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3 text-[11px] text-[#64748B] font-mono">
                <span>{lineCount} lines</span>
                <span>{codeContent.length} chars</span>
              </div>
            </div>

            <div className="relative rounded-xl border border-[#1E293B] bg-[#0F172A] overflow-hidden focus-within:border-[#3B82F6] focus-within:ring-1 focus-within:ring-[#3B82F6] transition-all">
              <textarea
                required
                rows={12}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`// Paste your ${language} code here...\nfunction example() {\n  return "clean code";\n}`}
                className="w-full p-4 font-mono text-xs md:text-sm text-[#F8FAFC] bg-transparent resize-y focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Row 4: Developer Notes */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5 font-mono">
              Markdown Notes &amp; Context (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why this exists, caveats, environment variables required, benchmarks..."
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs md:text-sm focus:outline-none focus:border-[#0F172A] transition-colors"
            />
          </div>

          {/* AI Pre-Analysis Section */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#0F172A] font-medium">
                <input
                  type="checkbox"
                  checked={autoAnalyze}
                  onChange={(e) => setAutoAnalyze(e.target.checked)}
                  className="w-4 h-4 rounded border-[#CBD5E1] text-[#0F172A] focus:ring-[#0F172A]"
                />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" />
                  Auto-run AI tagging &amp; summary on save
                </span>
              </label>

              <button
                type="button"
                onClick={handlePreviewAI}
                disabled={isPreviewingAI || !codeContent.trim()}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1E3A8A] border border-blue-200 transition-colors disabled:opacity-40 font-semibold"
              >
                <Sparkles className="w-3 h-3 text-[#1E3A8A]" />
                <span>{isPreviewingAI ? 'Analyzing...' : 'Preview AI Output'}</span>
              </button>
            </div>

            {/* AI Preview Result display */}
            {previewAnalysis && (
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] space-y-2 text-xs shadow-sm">
                <div>
                  <span className="font-bold text-[#1E3A8A] block mb-0.5 font-mono">
                    AI Summary:
                  </span>
                  <p className="text-[#334155]">{previewAnalysis.summary}</p>
                </div>
                <div>
                  <span className="font-bold text-[#1E3A8A] block mb-1 font-mono">
                    AI Tags:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewAnalysis.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#1E3A8A] border border-blue-200 text-[11px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Row 5: Favorite checkbox */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#334155] font-medium">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded border-[#CBD5E1] text-amber-500 focus:ring-amber-400"
              />
              <span>Star snippet as favorite</span>
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] shadow-md transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{isSubmitting ? 'Saving Snippet...' : 'Save Snippet to Vault'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
