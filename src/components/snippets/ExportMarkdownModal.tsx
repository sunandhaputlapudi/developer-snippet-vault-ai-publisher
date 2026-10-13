import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Eye,
  Edit,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { Snippet } from '../../types/snippet';
import {
  generateSnippetsMarkdownBundle,
  downloadMarkdownFile,
  ExportMarkdownOptions,
} from '../../lib/exportMarkdown';

interface ExportMarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  snippets: Snippet[];
  activeFilterDescription: string;
}

export const ExportMarkdownModal: React.FC<ExportMarkdownModalProps> = ({
  isOpen,
  onClose,
  snippets,
  activeFilterDescription,
}) => {
  const [includeToc, setIncludeToc] = useState(true);
  const [includeAiSummary, setIncludeAiSummary] = useState(true);
  const [includeTags, setIncludeTags] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [filename, setFilename] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return `snippets-vault-export-${today}.md`;
  });

  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const markdownContent = useMemo(() => {
    const options: ExportMarkdownOptions = {
      includeToc,
      includeAiSummary,
      includeTags,
      includeNotes,
      filterLabel: activeFilterDescription,
    };
    return generateSnippetsMarkdownBundle(snippets, options);
  }, [snippets, includeToc, includeAiSummary, includeTags, includeNotes, activeFilterDescription]);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadMarkdownFile(markdownContent, filename || 'snippets-export.md');
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Export Snippets as Markdown
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download a single comprehensive .md document containing your current filtered list.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter badge note */}
        {activeFilterDescription && (
          <div className="px-6 py-2.5 bg-indigo-950/30 border-b border-indigo-900/40 flex items-center gap-2 text-xs text-indigo-200">
            <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              Active Filter: <strong>{activeFilterDescription}</strong>
            </span>
          </div>
        )}

        {/* Options Toolbar */}
        <div className="p-6 pb-2 border-b border-slate-800 space-y-4 text-xs">
          {/* Filename input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-slate-400 font-semibold mb-1 text-[11px] uppercase tracking-wider">
                Export File Name
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Toggle checkboxes */}
            <div className="flex items-center gap-4 flex-wrap pt-2 sm:pt-4 text-slate-300 select-none">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeToc}
                  onChange={(e) => setIncludeToc(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-950 border-slate-800"
                />
                <span>Table of Contents</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAiSummary}
                  onChange={(e) => setIncludeAiSummary(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-950 border-slate-800"
                />
                <span>AI Summaries</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTags}
                  onChange={(e) => setIncludeTags(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-950 border-slate-800"
                />
                <span>Tags</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-indigo-600 bg-slate-950 border-slate-800"
                />
                <span>Dev Notes</span>
              </label>
            </div>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Formatted Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'raw'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
          {activeTab === 'raw' ? (
            <textarea
              readOnly
              value={markdownContent}
              className="w-full h-96 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 resize-none focus:outline-none leading-relaxed"
            />
          ) : (
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs md:text-sm text-slate-200 space-y-3 leading-relaxed">
              <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                {markdownContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/90">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Copy Markdown
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download Markdown ({snippets.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
