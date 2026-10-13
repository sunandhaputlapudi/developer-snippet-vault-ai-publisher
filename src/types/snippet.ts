export type SupportedLanguage =
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'go'
  | 'rust'
  | 'sql'
  | 'html'
  | 'css'
  | 'json'
  | 'bash'
  | 'dockerfile'
  | 'yaml'
  | 'markdown'
  | 'csharp'
  | 'cpp'
  | 'java'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin';

export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  code_content: string;
  language: SupportedLanguage | string;
  notes: string;
  tags: string[];
  summary: string;
  is_favorite: boolean;
  collection_id?: string | null;
  collection_name?: string | null;
  analysis_status: 'pending' | 'ready' | 'failed';
  analysis_error?: string | null;
  explanation?: string;
  suggested_improvements?: string[];
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  snippet_count?: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
  preferred_language?: string;
  created_at: string;
}

export interface Publication {
  id: string;
  user_id: string;
  snippet_id?: string | null;
  title: string;
  doc_type: DocumentationType;
  markdown: string;
  audience?: string;
  tone?: string;
  views?: number;
  created_at: string;
  updated_at: string;
}

export interface APIEndpointDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  category: 'Users' | 'Snippets' | 'Collections' | 'Publications' | 'AI & Models';
  summary: string;
  description: string;
  parameters?: Array<{
    name: string;
    in: 'path' | 'query' | 'header';
    required: boolean;
    type: string;
    description: string;
  }>;
  requestBody?: {
    type: string;
    example: any;
  };
  responses: Record<number, { description: string; example?: any }>;
}

export type DocumentationType =
  | 'readme_section'
  | 'full_readme'
  | 'tutorial'
  | 'api_reference'
  | 'usage_guide'
  | 'troubleshooting';

export type SyntaxTheme = 'dark' | 'light' | 'high-contrast' | 'dracula';

export interface AIAnalysisResponse {
  tags: string[];
  summary: string;
  explanation?: string;
  suggestedImprovements?: string[];
}

export interface AIPublishRequest {
  snippet_id?: string;
  title: string;
  language: string;
  code_content: string;
  notes?: string;
  doc_type: DocumentationType;
  tone?: 'concise' | 'comprehensive' | 'step-by-step';
  audience?: 'beginner' | 'intermediate' | 'expert';
}

export interface AIPublishResponse {
  markdown: string;
  title: string;
  doc_type: DocumentationType;
  generated_at: string;
}
