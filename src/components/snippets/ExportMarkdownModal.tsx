import React, { useState, useMemo } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  FileText,
  Eye,
  Filter,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-[#0F172A]/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/15">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Export Snippets as Markdown
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/10 text-blue-200 border border-white/20">
                  {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'}
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Download a single comprehensive .md document containing your current filtered list.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter badge note */}
        {activeFilterDescription && (
          <div className="px-6 py-2.5 bg-[#F1F5F9] border-b border-[#E2E8F0] flex items-center gap-2 text-xs text-[#0F172A]">
            <Filter className="w-3.5 h-3.5 text-[#0F172A] shrink-0" />
            <span>
              Active Filter: <strong className="text-[#0F172A]">{activeFilterDescription}</strong>
            </span>
          </div>
        )}

        {/* Options Toolbar */}
        <div className="p-6 pb-4 border-b border-[#E2E8F0] space-y-4 text-xs bg-white">
          {/* Filename input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[#0F172A] font-semibold mb-1 text-[11px] uppercase tracking-wider font-mono">
                Export File Name
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
              />
            </div>

            {/* Toggle checkboxes */}
            <div className="flex items-center gap-4 flex-wrap pt-2 sm:pt-4 text-[#334155] select-none">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeToc}
                  onChange={(e) => setIncludeToc(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0F172A] bg-[#F8FAFC] border-[#CBD5E1] focus:ring-0"
                />
                <span>Table of Contents</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeAiSummary}
                  onChange={(e) => setIncludeAiSummary(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0F172A] bg-[#F8FAFC] border-[#CBD5E1] focus:ring-0"
                />
                <span>AI Summaries</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeTags}
                  onChange={(e) => setIncludeTags(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0F172A] bg-[#F8FAFC] border-[#CBD5E1] focus:ring-0"
                />
                <span>Tags</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeNotes}
                  onChange={(e) => setIncludeNotes(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#0F172A] bg-[#F8FAFC] border-[#CBD5E1] focus:ring-0"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-[#0F172A] text-white font-semibold shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Formatted Preview</span>
              </button>

              <button
                onClick={() => setActiveTab('raw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'raw'
                    ? 'bg-[#0F172A] text-white font-semibold shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>

            <button
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                  : 'bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
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
        <div className="flex-1 p-6 overflow-y-auto max-h-[500px] bg-[#F8FAFC]">
          {activeTab === 'raw' ? (
            <textarea
              readOnly
              value={markdownContent}
              className="w-full h-96 p-4 rounded-xl bg-[#0F172A] border border-[#334155] font-mono text-xs text-[#F8FAFC] resize-none focus:outline-none leading-relaxed shadow-inner"
            />
          ) : (
            <div className="p-6 rounded-xl bg-[#0F172A] border border-[#334155] font-sans text-xs md:text-sm text-[#F8FAFC] space-y-3 leading-relaxed shadow-inner">
              <pre className="font-mono text-xs text-[#E2E8F0] whitespace-pre-wrap leading-relaxed select-text">
                {markdownContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E2E8F0] bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] shadow-md shadow-[#0F172A]/15 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .md Bundle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
