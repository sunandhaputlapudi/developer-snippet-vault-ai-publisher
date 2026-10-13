import { Snippet } from '../types/snippet';

export interface ExportMarkdownOptions {
  includeToc?: boolean;
  includeAiSummary?: boolean;
  includeTags?: boolean;
  includeNotes?: boolean;
  filterLabel?: string;
}

export function generateSnippetsMarkdownBundle(
  snippets: Snippet[],
  options: ExportMarkdownOptions = {}
): string {
  const {
    includeToc = true,
    includeAiSummary = true,
    includeTags = true,
    includeNotes = true,
    filterLabel,
  } = options;

  const timestamp = new Date().toISOString().split('T')[0];
  const lines: string[] = [];

  // Main Header
  lines.push('# Developer Snippet Vault — Code Export');
  lines.push('');
  lines.push(`> Exported on **${new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}** | Total Snippets: **${snippets.length}**${filterLabel ? ` | Scope: **${filterLabel}**` : ''}`);
  lines.push('');

  // Table of Contents
  if (includeToc && snippets.length > 0) {
    lines.push('## Table of Contents');
    lines.push('');
    snippets.forEach((snippet, index) => {
      // Create clean github-compatible anchor slug
      const slug = snippet.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      const langBadge = snippet.language ? `\`${snippet.language}\`` : '';
      lines.push(`${index + 1}. [${snippet.title}](#${slug}) — ${langBadge}`);
    });
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Snippets
  snippets.forEach((snippet, index) => {
    lines.push(`## ${snippet.title}`);
    lines.push('');

    // Meta badges
    const metaParts: string[] = [];
    if (snippet.language) metaParts.push(`**Language:** \`${snippet.language}\``);
    if (snippet.collection_name) metaParts.push(`**Collection:** \`${snippet.collection_name}\``);
    if (snippet.is_favorite) metaParts.push(`⭐ **Starred Favorite**`);
    if (metaParts.length > 0) {
      lines.push(metaParts.join(' • '));
      lines.push('');
    }

    // AI Summary
    if (includeAiSummary && snippet.summary && snippet.summary !== 'Pending AI analysis...') {
      lines.push(`> 💡 **AI Summary:** ${snippet.summary}`);
      lines.push('');
    }

    // AI Tags
    if (includeTags && snippet.tags && snippet.tags.length > 0) {
      const tagBadges = snippet.tags.map((t) => `\`#${t}\``).join(' ');
      lines.push(`**Tags:** ${tagBadges}`);
      lines.push('');
    }

    // Code Content
    lines.push(`\`\`\`${(snippet.language || 'text').toLowerCase()}`);
    lines.push(snippet.code_content);
    lines.push('```');
    lines.push('');

    // Developer Notes
    if (includeNotes && snippet.notes && snippet.notes.trim()) {
      lines.push('### Notes & Documentation');
      lines.push(snippet.notes.trim());
      lines.push('');
    }

    // Separator between snippets
    if (index < snippets.length - 1) {
      lines.push('---');
      lines.push('');
    }
  });

  // Footer
  lines.push('');
  lines.push('---');
  lines.push('Generated with [Developer Snippet Vault & AI Publisher](https://github.com)');

  return lines.join('\n');
}

export function downloadMarkdownFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
