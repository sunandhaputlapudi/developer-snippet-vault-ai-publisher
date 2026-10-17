import React, { useState } from 'react';
import {
  X,
  Star,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  Edit3,
  Trash2,
  RefreshCw,
  FolderGit2,
  Calendar,
  Lightbulb,
  FileText,
  Zap,
  Code2,
} from 'lucide-react';
import { Snippet } from '../../types/snippet';
import { getLanguageMeta } from '../../lib/languages';
import { CodeViewer } from './CodeViewer';
import { retryAnalyzeSnippet, directAIEnhance } from '../../lib/api';

interface SnippetDetailModalProps {
  snippet: Snippet | null;
  onClose: () => void;
  onEdit: (snippet: Snippet) => void;
  onDelete: (snippet: Snippet) => void;
  onToggleFavorite: (id: string) => void;
  onOpenPublisher: (snippet: Snippet) => void;
  onOpenReadme?: (snippet: Snippet) => void;
  onSnippetUpdated: (snippet: Snippet) => void;
}

export const SnippetDetailModal: React.FC<SnippetDetailModalProps> = ({
  snippet,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpenPublisher,
  onOpenReadme,
  onSnippetUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'notes' | 'enhance'>('ai');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<{
    code: string;
    explanation: string;
    improvements: string[];
  } | null>(null);
  const [copiedEnhanced, setCopiedEnhanced] = useState(false);

  if (!snippet) return null;

  const langMeta = getLanguageMeta(snippet.language);

  const handleRetryAI = async () => {
    setIsAnalyzing(true);
    try {
      const updated = await retryAnalyzeSnippet(snippet.id);
      onSnippetUpdated(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnhanceCode = async () => {
    setIsEnhancing(true);
    try {
      const res = await directAIEnhance({
        title: snippet.title,
        language: snippet.language,
        code_content: snippet.code_content,
      });
      setEnhancedResult({
        code: res.enhanced_code,
        explanation: res.explanation,
        improvements: res.improvements,
      });
      setActiveTab('enhance');
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-[#CBD5E1] bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0F172A] text-white">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm"
              style={{
                color: langMeta.color,
                backgroundColor: langMeta.bgLight,
                border: `1px solid ${langMeta.badgeBorder}`,
              }}
            >
              <Code2 className="w-3.5 h-3.5" />
              {langMeta.name}
            </span>

            {snippet.collection_name && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1E293B] text-[#CBD5E1] border border-[#334155]">
                <FolderGit2 className="w-3.5 h-3.5 text-[#60A5FA]" />
                {snippet.collection_name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(snippet.id)}
              className={`p-2 rounded-xl transition-colors ${
                snippet.is_favorite
                  ? 'text-amber-400 bg-amber-400/20'
                  : 'text-[#94A3B8] hover:text-amber-300 hover:bg-[#1E293B]'
              }`}
              title={snippet.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${snippet.is_favorite ? 'fill-amber-400' : ''}`}
              />
            </button>

            <button
              onClick={() => onEdit(snippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#CBD5E1]" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenReadme?.(snippet);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white border border-[#3B82F6]/50 transition-all shadow-sm"
              title="Generate a full GitHub README.md for this snippet"
            >
              <FileText className="w-3.5 h-3.5 text-[#93C5FD]" />
              <span>Draft README</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPublisher(snippet);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-[#0F172A] shadow-md transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0F172A]" />
              <span>AI Publisher</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title and metadata bar */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight font-sans">
            {snippet.title}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>
                Created {new Date(snippet.created_at).toLocaleDateString()}
              </span>
            </div>
            {snippet.updated_at && snippet.updated_at !== snippet.created_at && (
              <span className="text-[#64748B]">
                • Updated {new Date(snippet.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Content Body: Split layout */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Code Viewer Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">
                Source Code
              </span>
              <button
                onClick={handleEnhanceCode}
                disabled={isEnhancing}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:text-[#0F172A] transition-colors disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>{isEnhancing ? 'Enhancing...' : 'Suggest AI Improvements'}</span>
              </button>
            </div>
            <CodeViewer
              code={snippet.code_content}
              language={snippet.language}
              maxHeight="380px"
              showLineNumbers={true}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-[#E2E8F0]">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'ai'
                  ? 'border-[#0F172A] text-[#0F172A] font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
              <span>AI Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                activeTab === 'notes'
                  ? 'border-[#0F172A] text-[#0F172A] font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#1E3A8A]" />
              <span>Developer Notes</span>
            </button>

            {enhancedResult && (
              <button
                onClick={() => setActiveTab('enhance')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                  activeTab === 'enhance'
                    ? 'border-[#0F172A] text-[#0F172A] font-bold'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>AI Refactored Code</span>
              </button>
            )}
          </div>

          {/* Tab 1: AI Insights */}
          {activeTab === 'ai' && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                  <span className="text-sm font-bold text-[#0F172A]">
                    AI Auto-Analysis &amp; Metadata
                  </span>
                </div>

                <button
                  onClick={handleRetryAI}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-[#1E3A8A] ${isAnalyzing ? 'animate-spin' : ''}`}
                  />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
                </button>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 shadow-sm">
                <span className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider block mb-1 font-mono">
                  Plain-English Summary
                </span>
                <p className="text-sm text-[#0F172A] leading-relaxed">
                  {snippet.summary || 'No summary generated yet.'}
                </p>
              </div>

              {/* Explanation */}
              {snippet.explanation && (
                <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 shadow-sm">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-1 font-mono">
                    Mechanism &amp; Pattern
                  </span>
                  <p className="text-sm text-[#334155] leading-relaxed">
                    {snippet.explanation}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2 font-mono">
                  AI-Generated Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-50 text-[#1E3A8A] border border-blue-200 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Improvements */}
              {snippet.suggested_improvements &&
                snippet.suggested_improvements.length > 0 && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2 font-mono">
                      Suggested Improvements
                    </span>
                    <ul className="space-y-2">
                      {snippet.suggested_improvements.map((imp, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-[#334155] bg-white p-3 rounded-xl border border-[#E2E8F0] shadow-sm"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}

          {/* Tab 2: Notes */}
          {activeTab === 'notes' && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
              {snippet.notes ? (
                <div className="max-w-none text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap font-mono">
                  {snippet.notes}
                </div>
              ) : (
                <div className="text-center py-8 text-[#64748B] text-sm">
                  No notes saved for this snippet yet. Click "Edit" above to add Markdown notes.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Enhanced Refactored Code */}
          {activeTab === 'enhance' && enhancedResult && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-[#0F172A]">
                    AI Refactored Version
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(enhancedResult.code);
                    setCopiedEnhanced(true);
                    setTimeout(() => setCopiedEnhanced(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] transition-colors shadow-sm"
                >
                  {copiedEnhanced ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#1E3A8A]" />
                      <span>Copy Enhanced Code</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#334155] bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-sm">
                {enhancedResult.explanation}
              </p>

              <CodeViewer
                code={enhancedResult.code}
                language={snippet.language}
                maxHeight="320px"
              />

              <div>
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-2 font-mono">
                  Key Changes Applied
                </span>
                <ul className="space-y-1.5">
                  {enhancedResult.improvements.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#334155]"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            onClick={() => {
              onClose();
              onDelete(snippet);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Snippet</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
