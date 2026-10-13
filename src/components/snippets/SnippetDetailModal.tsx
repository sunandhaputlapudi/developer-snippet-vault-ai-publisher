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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold"
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
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                {snippet.collection_name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(snippet.id)}
              className={`p-2 rounded-lg transition-colors ${
                snippet.is_favorite
                  ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
              }`}
              title={snippet.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${snippet.is_favorite ? 'fill-amber-400' : ''}`}
              />
            </button>

            <button
              onClick={() => onEdit(snippet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenReadme?.(snippet);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition-colors"
              title="Generate a full GitHub README.md for this snippet"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Draft README</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPublisher(snippet);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open in AI Publisher</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title and metadata bar */}
        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800/60">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {snippet.title}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Created {new Date(snippet.created_at).toLocaleDateString()}
              </span>
            </div>
            {snippet.updated_at && snippet.updated_at !== snippet.created_at && (
              <span className="text-slate-500">
                • Updated {new Date(snippet.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Content Body: Split layout */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Code Viewer Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Source Code
              </span>
              <button
                onClick={handleEnhanceCode}
                disabled={isEnhancing}
                className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
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
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ai'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Developer Notes</span>
            </button>

            {enhancedResult && (
              <button
                onClick={() => setActiveTab('enhance')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'enhance'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>AI Refactored Code</span>
              </button>
            )}
          </div>

          {/* Tab 1: AI Insights */}
          {activeTab === 'ai' && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    AI Auto-Analysis &amp; Metadata
                  </span>
                </div>

                <button
                  onClick={handleRetryAI}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`}
                  />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
                </button>
              </div>

              {/* Summary */}
              <div className="rounded-lg bg-indigo-950/20 border border-indigo-900/40 p-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                  Plain-English Summary
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {snippet.summary || 'No summary generated yet.'}
                </p>
              </div>

              {/* Explanation */}
              {snippet.explanation && (
                <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Mechanism &amp; Pattern
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {snippet.explanation}
                  </p>
                </div>
              )}

              {/* Tags */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  AI-Generated Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700"
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
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Suggested Improvements
                    </span>
                    <ul className="space-y-2">
                      {snippet.suggested_improvements.map((imp, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-300"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              {snippet.notes ? (
                <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {snippet.notes}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No notes saved for this snippet yet. Click "Edit" above to add Markdown notes.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Enhanced Refactored Code */}
          {activeTab === 'enhance' && enhancedResult && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-200">
                    Gemini AI Refactored Version
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(enhancedResult.code);
                    setCopiedEnhanced(true);
                    setTimeout(() => setCopiedEnhanced(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  {copiedEnhanced ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Enhanced Code</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                {enhancedResult.explanation}
              </p>

              <CodeViewer
                code={enhancedResult.code}
                language={snippet.language}
                maxHeight="320px"
              />

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Key Changes Applied
                </span>
                <ul className="space-y-1.5">
                  {enhancedResult.improvements.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/90">
          <button
            onClick={() => {
              onClose();
              onDelete(snippet);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Snippet</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
