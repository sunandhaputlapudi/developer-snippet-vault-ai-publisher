export interface LanguageMeta {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  badgeBorder: string;
  extension: string;
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageMeta> = {
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    color: '#3178c6',
    bgLight: 'rgba(49, 120, 198, 0.12)',
    badgeBorder: 'rgba(49, 120, 198, 0.3)',
    extension: '.ts',
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    color: '#f7df1e',
    bgLight: 'rgba(247, 223, 30, 0.12)',
    badgeBorder: 'rgba(247, 223, 30, 0.3)',
    extension: '.js',
  },
  python: {
    id: 'python',
    name: 'Python',
    color: '#38bdf8',
    bgLight: 'rgba(56, 189, 248, 0.12)',
    badgeBorder: 'rgba(56, 189, 248, 0.3)',
    extension: '.py',
  },
  go: {
    id: 'go',
    name: 'Go',
    color: '#00add8',
    bgLight: 'rgba(0, 173, 216, 0.12)',
    badgeBorder: 'rgba(0, 173, 216, 0.3)',
    extension: '.go',
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    color: '#f97316',
    bgLight: 'rgba(249, 115, 22, 0.12)',
    badgeBorder: 'rgba(249, 115, 22, 0.3)',
    extension: '.rs',
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    color: '#10b981',
    bgLight: 'rgba(16, 185, 129, 0.12)',
    badgeBorder: 'rgba(16, 185, 129, 0.3)',
    extension: '.sql',
  },
  html: {
    id: 'html',
    name: 'HTML',
    color: '#e34f26',
    bgLight: 'rgba(227, 79, 38, 0.12)',
    badgeBorder: 'rgba(227, 79, 38, 0.3)',
    extension: '.html',
  },
  css: {
    id: 'css',
    name: 'CSS',
    color: '#264de4',
    bgLight: 'rgba(38, 77, 228, 0.12)',
    badgeBorder: 'rgba(38, 77, 228, 0.3)',
    extension: '.css',
  },
  json: {
    id: 'json',
    name: 'JSON',
    color: '#a855f7',
    bgLight: 'rgba(168, 85, 247, 0.12)',
    badgeBorder: 'rgba(168, 85, 247, 0.3)',
    extension: '.json',
  },
  bash: {
    id: 'bash',
    name: 'Bash / Shell',
    color: '#4ade80',
    bgLight: 'rgba(74, 222, 128, 0.12)',
    badgeBorder: 'rgba(74, 222, 128, 0.3)',
    extension: '.sh',
  },
  dockerfile: {
    id: 'dockerfile',
    name: 'Dockerfile',
    color: '#2496ed',
    bgLight: 'rgba(36, 150, 237, 0.12)',
    badgeBorder: 'rgba(36, 150, 237, 0.3)',
    extension: '.dockerfile',
  },
  yaml: {
    id: 'yaml',
    name: 'YAML',
    color: '#ec4899',
    bgLight: 'rgba(236, 72, 153, 0.12)',
    badgeBorder: 'rgba(236, 72, 153, 0.3)',
    extension: '.yaml',
  },
  markdown: {
    id: 'markdown',
    name: 'Markdown',
    color: '#94a3b8',
    bgLight: 'rgba(148, 163, 184, 0.12)',
    badgeBorder: 'rgba(148, 163, 184, 0.3)',
    extension: '.md',
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    color: '#00599c',
    bgLight: 'rgba(0, 89, 156, 0.12)',
    badgeBorder: 'rgba(0, 89, 156, 0.3)',
    extension: '.cpp',
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    color: '#9b4993',
    bgLight: 'rgba(155, 73, 147, 0.12)',
    badgeBorder: 'rgba(155, 73, 147, 0.3)',
    extension: '.cs',
  },
  java: {
    id: 'java',
    name: 'Java',
    color: '#b07219',
    bgLight: 'rgba(176, 114, 25, 0.12)',
    badgeBorder: 'rgba(176, 114, 25, 0.3)',
    extension: '.java',
  },
};

export function getLanguageMeta(lang: string): LanguageMeta {
  const normalized = (lang || '').toLowerCase().trim();
  if (SUPPORTED_LANGUAGES[normalized]) {
    return SUPPORTED_LANGUAGES[normalized];
  }
  return {
    id: normalized || 'text',
    name: normalized ? normalized.toUpperCase() : 'Plain Text',
    color: '#64748b',
    bgLight: 'rgba(100, 116, 139, 0.12)',
    badgeBorder: 'rgba(100, 116, 139, 0.3)',
    extension: '.txt',
  };
}

export function detectLanguageFromCode(code: string): string {
  const trimmed = code.trim();
  if (/^FROM\s+[\w:.-]+/im.test(trimmed)) return 'dockerfile';
  if (/^package\s+main/im.test(trimmed) || /func\s+\w+\s*\(/.test(trimmed)) return 'go';
  if (/def\s+\w+\s*\(|import\s+sys|async\s+def\s+/m.test(trimmed)) return 'python';
  if (/fn\s+\w+\s*\(|pub\s+struct|let\s+mut\s+/m.test(trimmed)) return 'rust';
  if (/SELECT\s+.+\s+FROM|WITH\s+RECURSIVE|CREATE\s+TABLE/im.test(trimmed)) return 'sql';
  if (/import\s+React|export\s+default\s+function|const\s+\[\w+,\s*set\w+\]\s*=/m.test(trimmed)) return 'typescript';
  if (/interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|any)/m.test(trimmed)) return 'typescript';
  if (/#!/m.test(trimmed) || /echo\s+"|sudo\s+|chmod\s+/m.test(trimmed)) return 'bash';
  if (/^(\{|\})/m.test(trimmed) && /"[^"]+"\s*:\s*/m.test(trimmed)) return 'json';
  if (/^<(!DOCTYPE|html|div|svg)/im.test(trimmed)) return 'html';
  return 'typescript';
}
