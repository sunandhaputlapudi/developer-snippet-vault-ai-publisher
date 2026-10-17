import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Edit,
  Code2,
  CheckCircle2,
  FolderOpen,
  Layers,
  Settings,
  Plus,
  Trash2,
  Shield,
  Sliders,
  ExternalLink,
  ChevronRight,
  Save,
  BookOpen,
} from 'lucide-react';
import { Snippet, Publication } from '../../types/snippet';
import { directAIPublish, createPublication, generateWithHF } from '../../lib/api';
import { CodeViewer } from '../snippets/CodeViewer';

interface ReadmeGeneratorViewProps {
  snippets: Snippet[];
  initialSnippet?: Snippet | null;
  onOpenPublisher?: () => void;
}

export const ReadmeGeneratorView: React.FC<ReadmeGeneratorViewProps> = ({
  snippets,
  initialSnippet,
}) => {
  // Selected snippet(s)
  const [selectedSnippetIds, setSelectedSnippetIds] = useState<string[]>(
    initialSnippet ? [initialSnippet.id] : snippets.length > 0 ? [snippets[0].id] : []
  );

  // Readme Project Configuration
  const primarySnippet = snippets.find((s) => s.id === selectedSnippetIds[0]) || snippets[0] || null;

  const [projectName, setProjectName] = useState(
    primarySnippet ? primarySnippet.title : 'My Project'
  );
  const [projectDescription, setProjectDescription] = useState(
    primarySnippet?.summary || 'A high-performance production module built for modern cloud engineering.'
  );
  const [authorName, setAuthorName] = useState('Developer');
  const [licenseType, setLicenseType] = useState<'MIT' | 'Apache-2.0' | 'BSD-3-Clause'>('MIT');
  const [packageManager, setPackageManager] = useState<'npm' | 'pip' | 'cargo' | 'go'>('npm');

  // Section Toggles
  const [includeBadges, setIncludeBadges] = useState(true);
  const [includeToc, setIncludeToc] = useState(true);
  const [includeTree, setIncludeTree] = useState(true);
  const [includeInstall, setIncludeInstall] = useState(true);
  const [includeApiTable, setIncludeApiTable] = useState(true);
  const [includeContributing, setIncludeContributing] = useState(true);

  // AI Engine
  const [aiEngine, setAiEngine] = useState<'gemini' | 'huggingface'>('gemini');
  const [hfModel, setHfModel] = useState('bigcode/starcoder2-15b');

  // Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [markdownOutput, setMarkdownOutput] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-update project name when primary snippet changes if default
  useEffect(() => {
    if (primarySnippet) {
      setProjectName(primarySnippet.title);
      setProjectDescription(primarySnippet.summary || `A production module for ${primarySnippet.language}.`);

      const lang = primarySnippet.language.toLowerCase();
      if (lang === 'python') setPackageManager('pip');
      else if (lang === 'rust') setPackageManager('cargo');
      else if (lang === 'go') setPackageManager('go');
      else setPackageManager('npm');
    }
  }, [selectedSnippetIds]);

  const handleToggleSnippet = (id: string) => {
    if (selectedSnippetIds.includes(id)) {
      if (selectedSnippetIds.length > 1) {
        setSelectedSnippetIds(selectedSnippetIds.filter((s) => s !== id));
      }
    } else {
      setSelectedSnippetIds([...selectedSnippetIds, id]);
    }
  };

  const handleGenerateReadme = async () => {
    if (selectedSnippetIds.length === 0) return;

    setIsGenerating(true);
    setError(null);

    const activeSnippets = snippets.filter((s) => selectedSnippetIds.includes(s.id));
    const combinedCode = activeSnippets
      .map((s) => `// =================== Module: ${s.title} (${s.language}) ===================\n${s.code_content}`)
      .join('\n\n');

    const combinedNotes = activeSnippets
      .map((s) => `### ${s.title}\n${s.summary}\n${s.notes || ''}`)
      .join('\n\n');

    try {
      if (aiEngine === 'huggingface') {
        const prompt = `Generate a complete professional GitHub README.md for project "${projectName}".
Description: ${projectDescription}
License: ${licenseType}
Code:
\`\`\`${primarySnippet?.language || 'typescript'}
${combinedCode.slice(0, 4000)}
\`\`\``;
        const res = await generateWithHF({
          model: hfModel,
          prompt,
          max_tokens: 1024,
        });
        setMarkdownOutput(res.generated_text);
        setViewMode('preview');
      } else {
        const res = await directAIPublish({
          title: projectName,
          language: primarySnippet?.language || 'typescript',
          code_content: combinedCode,
          notes: `${projectDescription}\n\nSections requested: Badges: ${includeBadges}, TOC: ${includeToc}, FileTree: ${includeTree}, Install: ${includeInstall}, APITable: ${includeApiTable}, Contributing: ${includeContributing}\n\n${combinedNotes}`,
          doc_type: 'full_readme',
          audience: 'intermediate',
          tone: 'comprehensive',
        });
        setMarkdownOutput(res.markdown);
        setViewMode('preview');
      }
    } catch (err: any) {
      setError(err.message || 'README generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!markdownOutput) return;
    try {
      await navigator.clipboard.writeText(markdownOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    if (!markdownOutput) return;
    const blob = new Blob([markdownOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSavePublication = async () => {
    if (!markdownOutput) return;
    try {
      await createPublication({
        snippet_id: primarySnippet?.id || null,
        title: `${projectName} — README.md`,
        doc_type: 'full_readme',
        markdown: markdownOutput,
        audience: 'intermediate',
        tone: 'comprehensive',
      });
      setPublished(true);
      setTimeout(() => setPublished(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save publication');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-[#0F172A]/5 border border-[#0F172A]/15 text-[#0F172A] mt-1 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight font-sans">
                GitHub README.md Studio
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#0F172A]/10 text-[#0F172A] border border-[#0F172A]/20">
                PRO v2.4
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              Synthesize production-grade, publication-ready GitHub <code className="text-[#0F172A] bg-[#F1F5F9] px-1.5 py-0.5 rounded border border-[#E2E8F0] font-mono">README.md</code> documentation files
              from snippet metadata, code signatures, shields.io badges, and installation recipes.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateReadme}
          disabled={isGenerating || selectedSnippetIds.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] shadow-md shadow-[#0F172A]/15 transition-all disabled:opacity-50 shrink-0 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Drafting README.md...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Generate README.md</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700 font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dual Pane Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Config & Snippet Selector (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Project Details Box */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3.5 text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-mono">
                <Settings className="w-3.5 h-3.5 text-[#0F172A]" />
                Project Metadata
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">Step 1</span>
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">Project Name / Title</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-sans focus:outline-none focus:border-[#0F172A] focus:bg-white"
                placeholder="e.g. FastAPI Sliding Window Rate Limiter"
              />
            </div>

            <div>
              <label className="block text-[#475569] font-medium mb-1">Tagline / Short Pitch</label>
              <textarea
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-sans resize-none focus:outline-none focus:border-[#0F172A] focus:bg-white"
                placeholder="Concise plain-English summary of what this code accomplishes."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#475569] font-medium mb-1">Package Manager</label>
                <select
                  value={packageManager}
                  onChange={(e) => setPackageManager(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-sans focus:outline-none focus:border-[#0F172A] focus:bg-white"
                >
                  <option value="npm">npm / pnpm / yarn</option>
                  <option value="pip">pip / poetry</option>
                  <option value="cargo">cargo (Rust)</option>
                  <option value="go">go install (Go)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#475569] font-medium mb-1">License</label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-sans focus:outline-none focus:border-[#0F172A] focus:bg-white"
                >
                  <option value="MIT">MIT License</option>
                  <option value="Apache-2.0">Apache 2.0</option>
                  <option value="BSD-3-Clause">BSD 3-Clause</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Checklist */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 text-xs shadow-sm">
            <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] block border-b border-[#E2E8F0] pb-2 font-mono">
              Sections to Include
            </span>
            <div className="grid grid-cols-2 gap-2.5 text-[#334155]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeBadges}
                  onChange={(e) => setIncludeBadges(e.target.checked)}
                  className="rounded bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] focus:ring-0"
                />
                <span>Shields.io Badges</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeToc}
                  onChange={(e) => setIncludeToc(e.target.checked)}
                  className="rounded bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] focus:ring-0"
                />
                <span>Table of Contents</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeTree}
                  onChange={(e) => setIncludeTree(e.target.checked)}
                  className="rounded bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] focus:ring-0"
                />
                <span>Project File Tree</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeInstall}
                  onChange={(e) => setIncludeInstall(e.target.checked)}
                  className="rounded bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] focus:ring-0"
                />
                <span>Install Instructions</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeApiTable}
                  onChange={(e) => setIncludeApiTable(e.target.checked)}
                  className="rounded bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] focus:ring-0"
                />
                <span>API &amp; Options Table</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={includeContributing}
                  onChange={(e) => setIncludeContributing(e.target.checked)}
                  className="rounded bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] focus:ring-0"
                />
                <span>Contributing Guide</span>
              </label>
            </div>
          </div>

          {/* Snippet Picker for README Content */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 space-y-3 text-xs shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-mono">
                <Code2 className="w-3.5 h-3.5 text-[#0F172A]" />
                Select Vault Snippet(s) ({selectedSnippetIds.length})
              </span>
              <span className="text-[10px] text-[#64748B] font-mono">Step 2</span>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {snippets.map((s) => {
                const isChecked = selectedSnippetIds.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => handleToggleSnippet(s.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#0F172A]/5 border-[#0F172A] text-[#0F172A]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#475569] hover:border-[#0F172A]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                          isChecked
                            ? 'bg-[#0F172A] border-[#0F172A] text-white font-bold'
                            : 'border-[#CBD5E1] bg-white'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <span className="truncate font-medium text-xs">{s.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white font-mono shrink-0 border border-[#CBD5E1] text-[#64748B]">
                      {s.language}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Pane: Live Studio & Markdown Renderer (7 columns) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm min-h-[640px]">
          {/* Action Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'preview'
                    ? 'bg-white text-[#0F172A] border border-[#CBD5E1] font-semibold shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-[#0F172A]" />
                <span>GitHub Preview</span>
              </button>

              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  viewMode === 'raw'
                    ? 'bg-white text-[#0F172A] border border-[#CBD5E1] font-semibold shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!markdownOutput}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-40 cursor-pointer ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]'
                }`}
                title="Copy markdown"
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
                onClick={handleDownload}
                disabled={!markdownOutput}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] disabled:opacity-40 transition-colors cursor-pointer"
                title="Download README.md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>

              <button
                onClick={handleSavePublication}
                disabled={!markdownOutput || published}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#0F172A] disabled:opacity-40 transition-all shadow-sm cursor-pointer"
              >
                {published ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Published!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Docs</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main Markdown Body */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {isGenerating ? (
              <div className="h-96 flex flex-col items-center justify-center gap-3 text-[#64748B] text-center">
                <RefreshCw className="w-8 h-8 text-[#0F172A] animate-spin" />
                <p className="text-sm font-semibold text-[#0F172A]">
                  Architecting full GitHub README.md...
                </p>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Drafting Badges, Architecture Overview, API Reference, Installation Recipes, and Code Examples.
                </p>
              </div>
            ) : !markdownOutput ? (
              <div className="h-96 flex flex-col items-center justify-center gap-3 text-[#64748B] text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A]">
                  <FileText className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-[#0F172A]">
                  Ready to draft your GitHub project README.md
                </p>
                <p className="text-xs text-[#64748B] max-w-sm">
                  Select snippets and modules on the left, customize your settings, and click{' '}
                  <span className="text-[#0F172A] font-semibold">"Generate README.md"</span>.
                </p>
              </div>
            ) : viewMode === 'raw' ? (
              <textarea
                value={markdownOutput}
                onChange={(e) => setMarkdownOutput(e.target.value)}
                className="w-full h-[540px] font-mono text-xs text-[#F8FAFC] bg-[#0F172A] p-4 rounded-xl border border-[#334155] resize-none focus:outline-none focus:border-[#475569] leading-relaxed shadow-inner"
                spellCheck={false}
              />
            ) : (
              <div className="prose-vault max-w-none">
                <div className="space-y-4 text-xs md:text-sm text-[#334155] leading-relaxed font-sans">
                  {markdownOutput.split('\n').map((line, idx) => {
                    if (line.startsWith('# ')) {
                      return (
                        <h1 key={idx} className="text-2xl font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-2 mt-6 mb-3">
                          {line.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-lg font-bold text-[#1E3A8A] border-b border-[#E2E8F0] pb-1.5 mt-5 mb-2">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (line.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-base font-semibold text-[#0F172A] mt-3 mb-1">
                          {line.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return (
                        <li key={idx} className="ml-4 list-disc my-1">
                          {line.replace(/^[-*]\s+/, '')}
                        </li>
                      );
                    }
                    if (line.startsWith('> ')) {
                      return (
                        <blockquote key={idx} className="border-l-4 border-[#0F172A] bg-[#F8FAFC] px-4 py-2 my-2 rounded-r-lg italic text-[#1E293B]">
                          {line.replace(/^>\s+/, '')}
                        </blockquote>
                      );
                    }
                    if (line.trim() === '') return <div key={idx} className="h-2" />;
                    return <p key={idx} className="my-1.5">{line}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
