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
  const [authorName, setAuthorName] = useState('Tejaswanth');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-blue-900/40 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mt-1">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white tracking-tight">
                GitHub README.md Generator Studio
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO v2.4
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Synthesize production-grade, publication-ready GitHub <code>README.md</code> documentation files
              from snippet metadata, code signatures, shields.io badges, and installation recipes.
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerateReadme}
          disabled={isGenerating || selectedSnippetIds.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 shrink-0"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Drafting README.md...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate README.md</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dual Pane Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Config & Snippet Selector (5 columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Project Details Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-blue-400" />
                Project Metadata
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Step 1</span>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Project Name / Title</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-sans focus:outline-none focus:border-blue-500"
                placeholder="e.g. FastAPI Sliding Window Rate Limiter"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Tagline / Short Pitch</label>
              <textarea
                rows={2}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-sans resize-none focus:outline-none focus:border-blue-500"
                placeholder="Concise plain-English summary of what this code accomplishes."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Package Manager</label>
                <select
                  value={packageManager}
                  onChange={(e) => setPackageManager(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-sans focus:outline-none focus:border-blue-500"
                >
                  <option value="npm">npm / pnpm / yarn</option>
                  <option value="pip">pip / poetry</option>
                  <option value="cargo">cargo (Rust)</option>
                  <option value="go">go install (Go)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">License</label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs font-sans focus:outline-none focus:border-blue-500"
                >
                  <option value="MIT">MIT License</option>
                  <option value="Apache-2.0">Apache 2.0</option>
                  <option value="BSD-3-Clause">BSD 3-Clause</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section Checklist */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] block border-b border-slate-800 pb-2">
              Sections to Include
            </span>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeBadges}
                  onChange={(e) => setIncludeBadges(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span>Shields.io Badges</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeToc}
                  onChange={(e) => setIncludeToc(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span>Table of Contents</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeTree}
                  onChange={(e) => setIncludeTree(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span>Project File Tree</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeInstall}
                  onChange={(e) => setIncludeInstall(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span>Install Instructions</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeApiTable}
                  onChange={(e) => setIncludeApiTable(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span>API &amp; Options Table</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={includeContributing}
                  onChange={(e) => setIncludeContributing(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span>Contributing Guide</span>
              </label>
            </div>
          </div>

          {/* Snippet Picker for README Content */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                Select Vault Snippet(s) ({selectedSnippetIds.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Step 2</span>
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
                        ? 'bg-blue-950/40 border-blue-500/60 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                          isChecked
                            ? 'bg-blue-600 border-blue-500 text-white font-bold'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <span className="truncate font-medium text-xs">{s.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono shrink-0">
                      {s.language}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Pane: Live Studio & Markdown Renderer (7 columns) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl min-h-[640px]">
          {/* Action Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>GitHub Preview</span>
              </button>

              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'raw'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Raw README.md</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!markdownOutput}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Copy raw Markdown"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-40 transition-colors"
                title="Download README.md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export README.md</span>
              </button>

              <button
                onClick={handleSavePublication}
                disabled={!markdownOutput || published}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-40 transition-colors"
                title="Save into Published Docs"
              >
                {published ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Publish Doc</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Studio Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isGenerating ? (
              <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-400 text-center">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-sm font-medium text-slate-200">
                  Synthesizing complete README.md with AI Engine...
                </p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Formatting badges, ASCII project directory structure, installation recipes, and API reference tables.
                </p>
              </div>
            ) : !markdownOutput ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-500 text-center">
                <div className="p-4 rounded-2xl bg-blue-600/10 text-blue-400">
                  <FileText className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Draft a Professional README.md in 1 Click
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Select your project snippet(s), customize title &amp; badges on the left, and click{' '}
                    <span className="text-blue-400 font-semibold">"Generate README.md"</span>.
                  </p>
                </div>
              </div>
            ) : viewMode === 'raw' ? (
              <textarea
                value={markdownOutput}
                onChange={(e) => setMarkdownOutput(e.target.value)}
                className="w-full h-[540px] font-mono text-xs text-slate-200 bg-slate-950 p-4 rounded-xl border border-slate-800 resize-none focus:outline-none focus:border-blue-500 leading-relaxed"
                spellCheck={false}
              />
            ) : (
              <div className="space-y-4 text-slate-200 text-sm leading-relaxed font-sans">
                {/* Clean GitHub Markdown preview rendering */}
                <RenderedReadme markdown={markdownOutput} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// High-fidelity GitHub-style README Preview Renderer
function RenderedReadme({ markdown }: { markdown: string }) {
  const lines = markdown.split('\n');

  return (
    <div className="space-y-3.5 font-sans text-slate-200 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Level 1 Heading
        if (line.startsWith('# ')) {
          return (
            <h1
              key={idx}
              className="text-2xl font-extrabold text-white pb-2 border-b border-slate-800 mt-2 mb-3"
            >
              {line.replace('# ', '')}
            </h1>
          );
        }

        // Level 2 Heading
        if (line.startsWith('## ')) {
          return (
            <h2
              key={idx}
              className="text-lg font-bold text-slate-100 pb-1.5 border-b border-slate-800/80 mt-5 mb-2"
            >
              {line.replace('## ', '')}
            </h2>
          );
        }

        // Level 3 Heading
        if (line.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-sm font-bold text-slate-200 mt-3 mb-1">
              {line.replace('### ', '')}
            </h3>
          );
        }

        // Horizontal rule
        if (trimmed === '---') {
          return <hr key={idx} className="border-slate-800 my-4" />;
        }

        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-blue-500 pl-3 py-1 my-2 bg-blue-950/20 text-slate-300 text-xs italic rounded-r-lg"
            >
              {line.replace('> ', '')}
            </blockquote>
          );
        }

        // Bullet point
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={idx} className="ml-5 list-disc text-slate-300 text-xs my-0.5">
              {line.replace(/^[-*]\s+/, '')}
            </li>
          );
        }

        // Simple code block detection or table
        if (line.startsWith('```')) {
          return null; // Grouped inside rendered pre
        }

        if (trimmed.startsWith('|')) {
          return (
            <div key={idx} className="font-mono text-[11px] text-slate-300 bg-slate-950/60 px-3 py-1 border-x border-slate-800">
              {line}
            </div>
          );
        }

        // Paragraph
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p key={idx} className="text-xs text-slate-300 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}
