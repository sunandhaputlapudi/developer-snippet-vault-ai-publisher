import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Sliders,
  Eye,
  Edit,
  Code2,
  ExternalLink,
  Save,
  CheckCircle2,
  Trash2,
  FolderOpen,
  Layers,
  Key,
} from 'lucide-react';
import { Snippet, DocumentationType, AIPublishResponse, Publication } from '../../types/snippet';
import {
  directAIPublish,
  updateSnippet,
  fetchPublications,
  createPublication,
  deletePublication,
  generateWithHF,
  fetchHFModels,
} from '../../lib/api';
import { CodeViewer } from '../snippets/CodeViewer';

interface AIPublisherViewProps {
  snippets: Snippet[];
  selectedSnippet?: Snippet | null;
  onSnippetUpdated?: (snippet: Snippet) => void;
}

export const AIPublisherView: React.FC<AIPublisherViewProps> = ({
  snippets,
  selectedSnippet: initialSelectedSnippet,
  onSnippetUpdated,
}) => {
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>(
    initialSelectedSnippet?.id || (snippets[0]?.id ?? '')
  );

  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(
    initialSelectedSnippet || snippets[0] || null
  );

  // Model Provider selection
  const [modelProvider, setModelProvider] = useState<'gemini' | 'huggingface'>('gemini');
  const [hfModel, setHfModel] = useState<string>('bigcode/starcoder2-15b');
  const [hfToken, setHfToken] = useState<string>('');
  const [availableHFModels, setAvailableHFModels] = useState<any[]>([]);

  // Publisher configurations
  const [docType, setDocType] = useState<DocumentationType>('readme_section');
  const [audience, setAudience] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  const [tone, setTone] = useState<'concise' | 'comprehensive' | 'step-by-step'>('comprehensive');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<AIPublishResponse | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  // Publications state
  const [publications, setPublications] = useState<Publication[]>([]);
  const [showPublicationsDrawer, setShowPublicationsDrawer] = useState(false);
  const [savedAsPublication, setSavedAsPublication] = useState(false);

  // Clipboard & action states
  const [copied, setCopied] = useState(false);
  const [savedToNotes, setSavedToNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPublications();
    fetchHFModels()
      .then((res) => setAvailableHFModels(res.models))
      .catch(() => {});
  }, []);

  const loadPublications = async () => {
    try {
      const res = await fetchPublications();
      setPublications(res.publications);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (initialSelectedSnippet) {
      setSelectedSnippetId(initialSelectedSnippet.id);
      setActiveSnippet(initialSelectedSnippet);
    }
  }, [initialSelectedSnippet]);

  useEffect(() => {
    const found = snippets.find((s) => s.id === selectedSnippetId);
    if (found) {
      setActiveSnippet(found);
    }
  }, [selectedSnippetId, snippets]);

  const handleGenerate = async () => {
    if (!activeSnippet) return;

    setError(null);
    setIsGenerating(true);
    try {
      if (modelProvider === 'huggingface') {
        const prompt = `Write production-ready technical ${docType} markdown documentation for this ${activeSnippet.language} code:\nSnippet Title: ${activeSnippet.title}\nAudience: ${audience}\nTone: ${tone}\n\n\`\`\`${activeSnippet.language}\n${activeSnippet.code_content}\n\`\`\``;
        const hfRes = await generateWithHF({
          model: hfModel,
          prompt,
          max_tokens: 768,
          temperature: 0.2,
          hf_token: hfToken.trim() || undefined,
        });

        setMarkdownContent(hfRes.generated_text);
        setViewMode('preview');
      } else {
        const result = await directAIPublish({
          snippet_id: activeSnippet.id,
          title: activeSnippet.title,
          language: activeSnippet.language,
          code_content: activeSnippet.code_content,
          notes: activeSnippet.notes,
          doc_type: docType,
          audience,
          tone,
        });

        setGeneratedDoc(result);
        setMarkdownContent(result.markdown);
        setViewMode('preview');
      }
    } catch (err: any) {
      setError(err.message || 'Documentation generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAsPublication = async () => {
    if (!activeSnippet || !markdownContent) return;
    try {
      const pub = await createPublication({
        snippet_id: activeSnippet.id,
        title: `${activeSnippet.title} (${docType.replace('_', ' ').toUpperCase()})`,
        doc_type: docType,
        markdown: markdownContent,
        audience,
        tone,
      });
      setPublications((prev) => [pub.publication, ...prev]);
      setSavedAsPublication(true);
      setTimeout(() => setSavedAsPublication(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save publication');
    }
  };

  const handleDeletePublication = async (id: string) => {
    try {
      await deletePublication(id);
      setPublications((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCopyMarkdown = async () => {
    if (!markdownContent) return;
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!markdownContent) return;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (activeSnippet?.title || 'documentation')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    link.href = url;
    link.download = `${safeTitle}-${docType}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveToNotes = async () => {
    if (!activeSnippet || !markdownContent) return;
    try {
      const updatedNotes = activeSnippet.notes
        ? `${activeSnippet.notes}\n\n---\n## Generated ${docType.toUpperCase()} Documentation\n${markdownContent}`
        : markdownContent;

      const updated = await updateSnippet(activeSnippet.id, {
        notes: updatedNotes,
      });
      setActiveSnippet(updated);
      onSnippetUpdated?.(updated);
      setSavedToNotes(true);
      setTimeout(() => setSavedToNotes(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save to snippet notes');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[#1E3A8A] mt-1 shrink-0">
            <BookOpen className="w-6 h-6 text-[#1E3A8A]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight font-sans">
                AI Technical Publisher
              </h2>
              {/* Provider Badge Toggle */}
              <div className="inline-flex rounded-xl border border-[#CBD5E1] bg-[#F1F5F9] p-0.5 text-xs font-medium">
                <button
                  onClick={() => setModelProvider('gemini')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    modelProvider === 'gemini'
                      ? 'bg-[#0F172A] text-white font-bold shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Gemini 3.8 Flash
                </button>
                <button
                  onClick={() => setModelProvider('huggingface')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    modelProvider === 'huggingface'
                      ? 'bg-[#0F172A] text-white font-bold shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Hugging Face AI
                </button>
              </div>
            </div>
            <p className="text-xs md:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              Transform raw functions and code snippets into publication-grade Markdown documentation,
              README modules, formal API specs, or step-by-step developer tutorials in seconds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => setShowPublicationsDrawer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-all shadow-sm"
          >
            <FolderOpen className="w-4 h-4 text-[#1E3A8A]" />
            <span>Published Docs ({publications.length})</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !activeSnippet}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] shadow-md transition-all disabled:opacity-50 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate ({modelProvider === 'gemini' ? 'Gemini' : 'Hugging Face'})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hugging Face Settings Bar (When Hugging Face is selected) */}
      {modelProvider === 'huggingface' && (
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#1E3A8A]">Model Engine:</span>
            <select
              value={hfModel}
              onChange={(e) => setHfModel(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#0F172A]"
            >
              <option value="bigcode/starcoder2-15b">StarCoder2 (15B) - BigCode</option>
              <option value="codellama/CodeLlama-7b-hf">Code Llama (7B) - Meta</option>
              <option value="mistralai/Mistral-7B-Instruct-v0.2">Mistral 7B Instruct - Mistral AI</option>
              <option value="Salesforce/codegen-350M-mono">CodeGen 350M - Salesforce</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Key className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
            <input
              type="password"
              placeholder="Optional Hugging Face Token (hf_...)"
              value={hfToken}
              onChange={(e) => setHfToken(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs w-full sm:w-64 font-mono focus:outline-none focus:border-[#0F172A]"
            />
          </div>
        </div>
      )}

      {/* Control Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-xs">
        {/* Source Snippet Selector */}
        <div>
          <label className="block text-[#64748B] font-bold mb-1.5 font-mono">
            1. Source Snippet
          </label>
          <select
            value={selectedSnippetId}
            onChange={(e) => setSelectedSnippetId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-[#0F172A] text-xs font-sans"
          >
            {snippets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.language})
              </option>
            ))}
          </select>
        </div>

        {/* Document Type */}
        <div>
          <label className="block text-[#64748B] font-bold mb-1.5 font-mono">
            2. Document Type
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentationType)}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-[#0F172A] text-xs font-sans"
          >
            <option value="readme_section">📘 README Component & Badges</option>
            <option value="tutorial">🛠️ Step-by-Step Developer Tutorial</option>
            <option value="api_reference">📑 Formal API & Function Reference</option>
            <option value="usage_guide">💡 Practical Cookbook & Recipes</option>
            <option value="troubleshooting">🔍 Edge Cases & Troubleshooting</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className="block text-[#64748B] font-bold mb-1.5 font-mono">
            3. Target Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-[#0F172A] text-xs font-sans"
          >
            <option value="beginner">Junior / Beginner Developer</option>
            <option value="intermediate">Intermediate Full-Stack</option>
            <option value="expert">Senior Architect / Staff Engineer</option>
          </select>
        </div>

        {/* Tone */}
        <div>
          <label className="block text-[#64748B] font-bold mb-1.5 font-mono">
            4. Tone & Depth
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] focus:outline-none focus:border-[#0F172A] text-xs font-sans"
          >
            <option value="comprehensive">Comprehensive & Production-Ready</option>
            <option value="concise">Concise & Direct</option>
            <option value="step-by-step">Tutorial Style (Step-by-step)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Pane: Source Code Inspector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider font-mono">
              Source Code
            </span>
            {activeSnippet && (
              <span className="text-xs text-[#1E3A8A] font-semibold truncate max-w-xs">
                {activeSnippet.title}
              </span>
            )}
          </div>

          {activeSnippet ? (
            <CodeViewer
              code={activeSnippet.code_content}
              language={activeSnippet.language}
              maxHeight="580px"
              showLineNumbers={true}
            />
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-[#CBD5E1] rounded-2xl text-[#64748B] text-xs bg-white shadow-sm">
              No snippet selected
            </div>
          )}

          {activeSnippet?.notes && (
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-xs text-[#0F172A]">
              <span className="font-bold text-[#64748B] block mb-1">
                Developer Notes Context:
              </span>
              <p className="line-clamp-3 text-[#334155]">{activeSnippet.notes}</p>
            </div>
          )}
        </div>

        {/* Right Pane: Generated Documentation */}
        <div className="flex flex-col rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm min-h-[580px]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'preview'
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'raw'
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Markdown Editor</span>
              </button>
            </div>

            {/* Actions Toolbar */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyMarkdown}
                disabled={!markdownContent}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-40 ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]'
                }`}
                title="Copy raw Markdown"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={!markdownContent}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] disabled:opacity-40 transition-colors"
                title="Download as .md file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>

              <button
                onClick={handleSaveToNotes}
                disabled={!markdownContent || savedToNotes}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] disabled:opacity-40 transition-colors"
                title="Append to snippet notes"
              >
                {savedToNotes ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    <span>Save to Notes</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveAsPublication}
                disabled={!markdownContent || savedAsPublication}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#0F172A] hover:bg-[#1E293B] text-white disabled:opacity-40 transition-all shadow-sm"
                title="Save as permanent published document"
              >
                {savedAsPublication ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Published!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>Publish Doc</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {isGenerating ? (
              <div className="h-96 flex flex-col items-center justify-center gap-3 text-[#64748B] text-center">
                <RefreshCw className="w-8 h-8 text-[#0F172A] animate-spin" />
                <p className="text-sm font-bold text-[#0F172A]">
                  Synthesizing documentation with {modelProvider === 'gemini' ? 'Gemini 3.8 Flash' : hfModel}...
                </p>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Analyzing syntax, generating explanations, usage instructions, and structuring Markdown output.
                </p>
              </div>
            ) : !markdownContent ? (
              <div className="h-96 flex flex-col items-center justify-center gap-3 text-[#64748B] text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1E3A8A]">
                  <FileText className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-[#0F172A]">
                  Ready to publish technical documentation
                </p>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Select your snippet, configure the document type above, and click{' '}
                  <span className="text-[#1E3A8A] font-bold">"Generate"</span>.
                </p>
              </div>
            ) : viewMode === 'raw' ? (
              <textarea
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                className="w-full h-[520px] font-mono text-xs text-[#F8FAFC] bg-[#0F172A] p-4 rounded-xl border border-[#1E293B] resize-none focus:outline-none focus:border-[#3B82F6] leading-relaxed"
                spellCheck={false}
              />
            ) : (
              <div className="prose-vault max-w-none">
                <RenderedMarkdown markdown={markdownContent} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Published Documents Drawer/Modal */}
      {showPublicationsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl border border-[#CBD5E1] bg-white shadow-2xl p-6 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#1E3A8A] border border-blue-200">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Published Documentation Library</h3>
                  <p className="text-xs text-[#64748B]">
                    Saved technical guides, README modules, and API specifications
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPublicationsDrawer(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#CBD5E1] transition-all"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-3">
              {publications.length === 0 ? (
                <div className="text-center py-12 text-[#64748B] text-xs">
                  No documents published yet. Generate a document and click "Publish Doc" to save it here.
                </div>
              ) : (
                publications.map((pub) => (
                  <div
                    key={pub.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{pub.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-[#1E3A8A] border border-blue-200 uppercase font-semibold">
                          {pub.doc_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[#64748B] text-[11px]">
                        <span>{new Date(pub.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{pub.views || 0} views</span>
                        <span>•</span>
                        <span>Audience: {pub.audience || 'General'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setMarkdownContent(pub.markdown);
                          setViewMode('preview');
                          setShowPublicationsDrawer(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0F172A] text-white hover:bg-[#1E293B] transition-colors"
                      >
                        Open &amp; Edit
                      </button>
                      <button
                        onClick={() => handleDeletePublication(pub.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete publication"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Rendered Markdown visualizer with code block formatting
function RenderedMarkdown({ markdown }: { markdown: string }) {
  // Split markdown into sections and code blocks for crisp rendering
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.replace('```', '').trim() || 'text';
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        elements.push(
          <div key={`code-${i}`} className="my-4">
            <CodeViewer
              code={codeBuffer.join('\n')}
              language={codeLang}
              maxHeight="320px"
              showLineNumbers={true}
            />
          </div>
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1
          key={i}
          className="text-2xl font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-2 mt-6 mb-3 tracking-tight font-sans"
        >
          {line.replace('# ', '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={i}
          className="text-lg font-bold text-[#1E3A8A] border-b border-[#E2E8F0] pb-1.5 mt-5 mb-2 tracking-tight flex items-center gap-2 font-sans"
        >
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-[#0F172A] mt-4 mb-1 font-sans">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-4 list-disc text-[#334155] text-xs md:text-sm my-1">
          {line.replace(/^[-*]\s+/, '')}
        </li>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={i}
          className="border-l-4 border-[#0F172A] bg-[#F1F5F9] px-4 py-2 my-2 text-xs md:text-sm text-[#1E293B] rounded-r-lg italic"
        >
          {line.replace(/^>\s+/, '')}
        </blockquote>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-xs md:text-sm text-[#334155] my-1.5 leading-relaxed">
          {line}
        </p>
      );
    }
  }

  return <div>{elements}</div>;
}
