import {
  Snippet,
  Collection,
  User,
  AIPublishRequest,
  AIPublishResponse,
  AIAnalysisResponse,
} from '../types/snippet';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('vault_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['x-user-id'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('vault_auth_token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      localStorage.removeItem('vault_auth_token');
      return null;
    }
    const data = await res.json();
    return data.user || null;
  } catch (err) {
    return null;
  }
}

export async function loginUser(email: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed');
  }
  const data = await res.json();
  localStorage.setItem('vault_auth_token', data.token);
  return data;
}

export async function signupUser(email: string, name?: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Signup failed');
  }
  const data = await res.json();
  localStorage.setItem('vault_auth_token', data.token);
  return data;
}

export function logoutUser(): void {
  localStorage.removeItem('vault_auth_token');
}

export async function fetchSnippets(params?: {
  search?: string;
  language?: string;
  tag?: string;
  collection_id?: string;
  favorite?: boolean;
}): Promise<{ snippets: Snippet[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.language && params.language !== 'all') query.set('language', params.language);
  if (params?.tag) query.set('tag', params.tag);
  if (params?.collection_id && params.collection_id !== 'all') query.set('collection_id', params.collection_id);
  if (params?.favorite) query.set('favorite', 'true');

  const res = await fetch(`${API_BASE}/snippets?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch snippets');
  return res.json();
}

export async function fetchSnippetById(id: string): Promise<Snippet> {
  const res = await fetch(`${API_BASE}/snippets/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Snippet not found');
  const data = await res.json();
  return data.snippet;
}

export async function createSnippet(data: {
  title: string;
  code_content: string;
  language: string;
  notes?: string;
  collection_id?: string | null;
  is_favorite?: boolean;
  auto_analyze?: boolean;
}): Promise<Snippet> {
  const res = await fetch(`${API_BASE}/snippets`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save snippet');
  }
  const result = await res.json();
  return result.snippet;
}

export async function updateSnippet(
  id: string,
  data: Partial<Snippet> & { reanalyze?: boolean }
): Promise<Snippet> {
  const res = await fetch(`${API_BASE}/snippets/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update snippet');
  }
  const result = await res.json();
  return result.snippet;
}

export async function deleteSnippet(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/snippets/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete snippet');
}

export async function toggleFavoriteSnippet(id: string): Promise<{ is_favorite: boolean }> {
  const res = await fetch(`${API_BASE}/snippets/${id}/favorite`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to toggle favorite');
  return res.json();
}

export async function retryAnalyzeSnippet(id: string): Promise<Snippet> {
  const res = await fetch(`${API_BASE}/snippets/${id}/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to analyze snippet');
  }
  const result = await res.json();
  return result.snippet;
}

export async function fetchCollections(): Promise<Collection[]> {
  const res = await fetch(`${API_BASE}/collections`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch collections');
  const data = await res.json();
  return data.collections;
}

export async function createCollection(data: {
  name: string;
  description?: string;
  color: string;
}): Promise<Collection> {
  const res = await fetch(`${API_BASE}/collections`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create collection');
  }
  const result = await res.json();
  return result.collection;
}

export async function deleteCollection(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/collections/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete collection');
}

// -----------------------------------------------------------------------------
// Users RESTful CRUD API Client
// -----------------------------------------------------------------------------
export async function fetchUsers(params?: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<{ users: User[]; total: number; page: number; total_pages: number }> {
  const query = new URLSearchParams();
  if (params?.q) query.set('q', params.q);
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());

  const res = await fetch(`${API_BASE}/users?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchUserById(
  id: string
): Promise<{ user: User; stats: { snippet_count: number; collection_count: number; publication_count: number } }> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function createUser(data: {
  email: string;
  name?: string;
  bio?: string;
  role?: string;
  preferred_language?: string;
  avatar?: string;
}): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create user');
  }
  return res.json();
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update user profile');
  }
  return res.json();
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete user');
  }
}

// -----------------------------------------------------------------------------
// Publications RESTful CRUD API Client
// -----------------------------------------------------------------------------
export async function fetchPublications(params?: {
  snippet_id?: string;
  doc_type?: string;
  search?: string;
}): Promise<{ publications: any[]; total: number }> {
  const query = new URLSearchParams();
  if (params?.snippet_id) query.set('snippet_id', params.snippet_id);
  if (params?.doc_type && params.doc_type !== 'all') query.set('doc_type', params.doc_type);
  if (params?.search) query.set('search', params.search);

  const res = await fetch(`${API_BASE}/publications?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch publications');
  return res.json();
}

export async function fetchPublicationById(id: string): Promise<{ publication: any }> {
  const res = await fetch(`${API_BASE}/publications/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch publication');
  return res.json();
}

export async function createPublication(data: {
  snippet_id?: string | null;
  title: string;
  doc_type: string;
  markdown: string;
  audience?: string;
  tone?: string;
}): Promise<{ publication: any }> {
  const res = await fetch(`${API_BASE}/publications`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create publication');
  }
  return res.json();
}

export async function updatePublication(
  id: string,
  data: {
    title?: string;
    markdown?: string;
    doc_type?: string;
    audience?: string;
    tone?: string;
  }
): Promise<{ publication: any }> {
  const res = await fetch(`${API_BASE}/publications/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update publication');
  }
  return res.json();
}

export async function deletePublication(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/publications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete publication');
}

// -----------------------------------------------------------------------------
// Hugging Face Models & Inference Client
// -----------------------------------------------------------------------------
export async function fetchHFModels(): Promise<{ models: any[]; auth_header: string; default_model: string }> {
  const res = await fetch(`${API_BASE}/hf/models`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch Hugging Face models');
  return res.json();
}

export async function generateWithHF(payload: {
  model?: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  hf_token?: string;
}): Promise<{ model: string; generated_text: string; provider: string; note?: string }> {
  const headers: Record<string, string> = {
    ...getAuthHeaders() as Record<string, string>,
  };
  if (payload.hf_token) {
    headers['x-hf-token'] = payload.hf_token;
  }

  const res = await fetch(`${API_BASE}/hf/generate`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: payload.model,
      prompt: payload.prompt,
      max_tokens: payload.max_tokens,
      temperature: payload.temperature,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Hugging Face generation failed');
  }
  return res.json();
}

export async function fetchHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchOpenAPISpec(): Promise<any> {
  const res = await fetch(`${API_BASE}/openapi.json`);
  if (!res.ok) throw new Error('Failed to fetch OpenAPI spec');
  return res.json();
}

export async function directAIAnalyze(payload: {
  title: string;
  language: string;
  code_content: string;
  notes?: string;
}): Promise<AIAnalysisResponse> {
  const res = await fetch(`${API_BASE}/ai/analyze`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'AI analysis failed');
  }
  return res.json();
}

export async function directAIPublish(payload: AIPublishRequest): Promise<AIPublishResponse> {
  const res = await fetch(`${API_BASE}/ai/publish`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Documentation generation failed');
  }
  return res.json();
}

export async function directAIEnhance(payload: {
  title: string;
  language: string;
  code_content: string;
}): Promise<{ enhanced_code: string; explanation: string; improvements: string[] }> {
  const res = await fetch(`${API_BASE}/ai/enhance`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Code enhancement failed');
  }
  return res.json();
}
