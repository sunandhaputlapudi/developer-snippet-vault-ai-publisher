import React, { useState, useEffect } from 'react';
import {
  Server,
  Play,
  Copy,
  Check,
  Download,
  Terminal,
  Database,
  Users,
  Code2,
  FolderGit2,
  BookOpen,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { APIEndpointDefinition } from '../../types/snippet';
import { fetchHealth, fetchOpenAPISpec } from '../../lib/api';

const ENDPOINTS: APIEndpointDefinition[] = [
  // --- USERS CRUD ---
  {
    method: 'GET',
    path: '/api/users',
    category: 'Users',
    summary: 'List all users with pagination and snippet counts',
    description: 'Retrieve registered developer users in the vault with optional query matching on name or email.',
    parameters: [
      { name: 'q', in: 'query', required: false, type: 'string', description: 'Search term for name or email' },
      { name: 'page', in: 'query', required: false, type: 'number', description: 'Page index (default: 1)' },
      { name: 'limit', in: 'query', required: false, type: 'number', description: 'Max items per page (default: 20)' },
    ],
    responses: {
      200: {
        description: 'Successfully retrieved user list',
        example: {
          users: [
            {
              id: 'usr_dev_master',
              email: 'tejaswanth899@gmail.com',
              name: 'Tejaswanth',
              role: 'Lead Architect',
              stats: { snippet_count: 5, collection_count: 4, publication_count: 1 },
            },
          ],
          total: 2,
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/users/:id',
    category: 'Users',
    summary: 'Get user profile by ID',
    description: 'Retrieve detailed information and statistics for a specific user ID.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'User ID (e.g. usr_dev_master)' },
    ],
    responses: {
      200: { description: 'User profile found' },
      404: { description: 'User not found' },
    },
  },
  {
    method: 'POST',
    path: '/api/users',
    category: 'Users',
    summary: 'Create a new user profile',
    description: 'Register a new developer profile with email, name, role, and preferred programming language.',
    requestBody: {
      type: 'application/json',
      example: {
        email: 'developer.new@example.com',
        name: 'Jordan Smith',
        role: 'Full Stack Engineer',
        preferred_language: 'typescript',
        bio: 'Passionate about React hooks and scalable cloud backends.',
      },
    },
    responses: {
      201: { description: 'User profile created successfully' },
      400: { description: 'Email is required or malformed' },
      409: { description: 'User with this email already exists' },
    },
  },
  {
    method: 'PUT',
    path: '/api/users/:id',
    category: 'Users',
    summary: 'Full update of user profile',
    description: 'Replace all modifiable user profile properties.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'User ID to update' },
    ],
    requestBody: {
      type: 'application/json',
      example: {
        name: 'Jordan Smith (Senior)',
        role: 'Senior Staff Engineer',
        preferred_language: 'go',
        bio: 'Architecting distributed Go concurrency worker pools.',
      },
    },
    responses: {
      200: { description: 'User profile updated' },
      404: { description: 'User not found' },
    },
  },
  {
    method: 'PATCH',
    path: '/api/users/:id',
    category: 'Users',
    summary: 'Partial update of user profile',
    description: 'Update specific fields without overwriting the entire profile.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'User ID' },
    ],
    requestBody: {
      type: 'application/json',
      example: {
        bio: 'Updated bio description',
      },
    },
    responses: {
      200: { description: 'Field updated' },
    },
  },
  {
    method: 'DELETE',
    path: '/api/users/:id',
    category: 'Users',
    summary: 'Delete user profile and cascade resources',
    description: 'Permanently remove a user profile along with all their snippets and collections.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'User ID' },
    ],
    responses: {
      200: { description: 'User and resources deleted' },
      403: { description: 'Cannot delete master system demo user' },
      404: { description: 'User not found' },
    },
  },

  // --- SNIPPETS CRUD ---
  {
    method: 'GET',
    path: '/api/snippets',
    category: 'Snippets',
    summary: 'List & search code snippets',
    description: 'Filter code snippets by title, content, language, collection, tag, and favorite status.',
    parameters: [
      { name: 'search', in: 'query', required: false, type: 'string', description: 'Text search in code or summary' },
      { name: 'language', in: 'query', required: false, type: 'string', description: 'Filter by language (e.g. python, sql)' },
      { name: 'collection_id', in: 'query', required: false, type: 'string', description: 'Filter by collection ID' },
      { name: 'favorite', in: 'query', required: false, type: 'boolean', description: 'Show only starred favorites' },
    ],
    responses: {
      200: { description: 'Returns snippets list and total count' },
    },
  },
  {
    method: 'GET',
    path: '/api/snippets/:id',
    category: 'Snippets',
    summary: 'Retrieve snippet by ID',
    description: 'Get full code content, AI metadata, tags, summary, and developer notes.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Snippet ID (e.g. snp_1)' },
    ],
    responses: {
      200: { description: 'Snippet details' },
      404: { description: 'Snippet not found' },
    },
  },
  {
    method: 'POST',
    path: '/api/snippets',
    category: 'Snippets',
    summary: 'Create code snippet',
    description: 'Save a new snippet into the vault with automatic Gemini AI tagging and summary analysis.',
    requestBody: {
      type: 'application/json',
      example: {
        title: 'Binary Search Algorithm',
        language: 'typescript',
        code_content: 'export function binarySearch(arr: number[], target: number): number {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const m = (l + r) >> 1;\n    if (arr[m] === target) return m;\n    if (arr[m] < target) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}',
        notes: 'Classic logarithmic O(log n) divide-and-conquer search.',
        is_favorite: false,
        auto_analyze: true,
      },
    },
    responses: {
      201: { description: 'Snippet created' },
      400: { description: 'Title or code content missing' },
    },
  },
  {
    method: 'PUT',
    path: '/api/snippets/:id',
    category: 'Snippets',
    summary: 'Full update of snippet',
    description: 'Update snippet title, language, code content, and trigger re-analysis if desired.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Snippet ID' },
    ],
    requestBody: {
      type: 'application/json',
      example: {
        title: 'Optimized Binary Search with Bitwise Shift',
        language: 'typescript',
        code_content: '// Updated code',
        reanalyze: true,
      },
    },
    responses: {
      200: { description: 'Snippet updated' },
    },
  },
  {
    method: 'PATCH',
    path: '/api/snippets/:id',
    category: 'Snippets',
    summary: 'Partial update of snippet',
    description: 'Update specific fields like favorite toggle or collection assignment.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Snippet ID' },
    ],
    requestBody: {
      type: 'application/json',
      example: {
        is_favorite: true,
      },
    },
    responses: {
      200: { description: 'Snippet updated' },
    },
  },
  {
    method: 'DELETE',
    path: '/api/snippets/:id',
    category: 'Snippets',
    summary: 'Delete snippet',
    description: 'Permanently remove a snippet from the vault.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Snippet ID' },
    ],
    responses: {
      200: { description: 'Snippet deleted' },
      404: { description: 'Snippet not found' },
    },
  },

  // --- COLLECTIONS CRUD ---
  {
    method: 'GET',
    path: '/api/collections',
    category: 'Collections',
    summary: 'List all collections',
    description: 'Retrieve folder collections with computed snippet counts.',
    responses: {
      200: { description: 'List of collections' },
    },
  },
  {
    method: 'GET',
    path: '/api/collections/:id',
    category: 'Collections',
    summary: 'Get collection details & snippets',
    description: 'Retrieve a specific collection and its member snippets.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Collection ID (e.g. col_react)' },
    ],
    responses: {
      200: { description: 'Collection details' },
      404: { description: 'Collection not found' },
    },
  },
  {
    method: 'POST',
    path: '/api/collections',
    category: 'Collections',
    summary: 'Create collection',
    description: 'Create a new folder collection with custom color and description.',
    requestBody: {
      type: 'application/json',
      example: {
        name: 'Microservices & gRPC',
        description: 'Protobuf definitions and RPC client interceptors',
        color: '#10b981',
      },
    },
    responses: {
      201: { description: 'Collection created' },
    },
  },
  {
    method: 'PUT',
    path: '/api/collections/:id',
    category: 'Collections',
    summary: 'Full update of collection',
    description: 'Update collection name, description, and accent color.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Collection ID' },
    ],
    requestBody: {
      type: 'application/json',
      example: {
        name: 'Microservices Architecture',
        description: 'Updated description',
        color: '#3b82f6',
      },
    },
    responses: {
      200: { description: 'Collection updated' },
    },
  },
  {
    method: 'DELETE',
    path: '/api/collections/:id',
    category: 'Collections',
    summary: 'Delete collection',
    description: 'Deletes collection container. Member snippets remain preserved.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Collection ID' },
    ],
    responses: {
      200: { description: 'Collection deleted' },
    },
  },

  // --- PUBLICATIONS CRUD ---
  {
    method: 'GET',
    path: '/api/publications',
    category: 'Publications',
    summary: 'List published documentation',
    description: 'Retrieve technical documentation published via the AI Publisher.',
    parameters: [
      { name: 'doc_type', in: 'query', required: false, type: 'string', description: 'readme_section, tutorial, api_reference' },
      { name: 'snippet_id', in: 'query', required: false, type: 'string', description: 'Filter by source snippet' },
    ],
    responses: {
      200: { description: 'List of published documents' },
    },
  },
  {
    method: 'GET',
    path: '/api/publications/:id',
    category: 'Publications',
    summary: 'Get publication by ID',
    description: 'Retrieve publication content and increment view counter.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Publication ID' },
    ],
    responses: {
      200: { description: 'Publication details' },
    },
  },
  {
    method: 'POST',
    path: '/api/publications',
    category: 'Publications',
    summary: 'Publish technical documentation',
    description: 'Save Markdown documentation generated from code snippets.',
    requestBody: {
      type: 'application/json',
      example: {
        snippet_id: 'snp_1',
        title: 'useDebounce Technical Guide',
        doc_type: 'readme_section',
        markdown: '# useDebounce Hook\n\nA React hook for debouncing fast state changes.',
        audience: 'intermediate',
        tone: 'comprehensive',
      },
    },
    responses: {
      201: { description: 'Publication saved' },
    },
  },
  {
    method: 'DELETE',
    path: '/api/publications/:id',
    category: 'Publications',
    summary: 'Delete publication',
    description: 'Permanently remove a published technical documentation document.',
    parameters: [
      { name: 'id', in: 'path', required: true, type: 'string', description: 'Publication ID' },
    ],
    responses: {
      200: { description: 'Publication removed' },
    },
  },

  // --- AI & MODELS ---
  {
    method: 'POST',
    path: '/api/ai/publish',
    category: 'AI & Models',
    summary: 'AI Documentation Publisher (Gemini)',
    description: 'Generates GitHub READMEs, tutorials, or API specs from code.',
    requestBody: {
      type: 'application/json',
      example: {
        title: 'Redis Sliding Window Rate Limiter',
        language: 'python',
        code_content: 'async def check_rate_limit(client_id: str): pass',
        doc_type: 'readme_section',
        audience: 'intermediate',
      },
    },
    responses: {
      200: { description: 'Generated Markdown response' },
    },
  },
  {
    method: 'GET',
    path: '/api/hf/models',
    category: 'AI & Models',
    summary: 'List Hugging Face coding models',
    description: 'Query open-source AI models available for code synthesis.',
    responses: {
      200: { description: 'Supported Hugging Face models list' },
    },
  },
  {
    method: 'POST',
    path: '/api/hf/generate',
    category: 'AI & Models',
    summary: 'Hugging Face Code Inference Proxy',
    description: 'Run inference using Hugging Face code models (StarCoder2, CodeLlama, Mistral). Supports optional x-hf-token header.',
    requestBody: {
      type: 'application/json',
      example: {
        model: 'bigcode/starcoder2-15b',
        prompt: '// Write a TypeScript function to parse JSON safely\n',
        max_tokens: 256,
      },
    },
    responses: {
      200: { description: 'Inference response' },
    },
  },
];

export const RestApiExplorerView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEndpoint, setActiveEndpoint] = useState<APIEndpointDefinition>(ENDPOINTS[0]);
  const [testPathParams, setTestPathParams] = useState<Record<string, string>>({ id: 'usr_dev_master' });
  const [testQueryParams, setTestQueryParams] = useState<Record<string, string>>({});
  const [testBody, setTestBody] = useState<string>('');
  const [hfTokenInput, setHfTokenInput] = useState<string>('');

  // Execution result
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);

  // Initialize test inputs when active endpoint changes
  useEffect(() => {
    if (activeEndpoint.requestBody?.example) {
      setTestBody(JSON.stringify(activeEndpoint.requestBody.example, null, 2));
    } else {
      setTestBody('');
    }

    const defaultPath: Record<string, string> = {};
    if (activeEndpoint.path.includes(':id')) {
      if (activeEndpoint.category === 'Users') defaultPath.id = 'usr_dev_master';
      else if (activeEndpoint.category === 'Snippets') defaultPath.id = 'snp_1';
      else if (activeEndpoint.category === 'Collections') defaultPath.id = 'col_react';
      else if (activeEndpoint.category === 'Publications') defaultPath.id = 'pub_1';
    }
    setTestPathParams(defaultPath);
    setTestQueryParams({});
    setResponseStatus(null);
    setResponseData(null);
  }, [activeEndpoint]);

  useEffect(() => {
    fetchHealth().then(setHealthData).catch(() => {});
  }, []);

  const categories = ['All', 'Users', 'Snippets', 'Collections', 'Publications', 'AI & Models'];

  const filteredEndpoints =
    selectedCategory === 'All'
      ? ENDPOINTS
      : ENDPOINTS.filter((e) => e.category === selectedCategory);

  // Build current test URL
  let resolvedUrl = activeEndpoint.path;
  Object.entries(testPathParams).forEach(([key, val]) => {
    resolvedUrl = resolvedUrl.replace(`:${key}`, encodeURIComponent(val));
  });

  const queryEntries = Object.entries(testQueryParams).filter(([_, v]) => v.trim());
  if (queryEntries.length > 0) {
    const q = new URLSearchParams();
    queryEntries.forEach(([k, v]) => q.append(k, v));
    resolvedUrl += `?${q.toString()}`;
  }

  // Construct copyable curl command
  const curlCommand = `curl -X ${activeEndpoint.method} "http://localhost:3000${resolvedUrl}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer usr_dev_master"${
    hfTokenInput ? ` \\\n  -H "x-hf-token: ${hfTokenInput}"` : ''
  }${
    activeEndpoint.method !== 'GET' && testBody
      ? ` \\\n  -d '${testBody.replace(/'/g, "\\'")}'`
      : ''
  }`;

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseData(null);
    const start = performance.now();

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer usr_dev_master',
      };
      if (hfTokenInput.trim()) {
        headers['x-hf-token'] = hfTokenInput.trim();
      }

      const options: RequestInit = {
        method: activeEndpoint.method,
        headers,
      };

      if (activeEndpoint.method !== 'GET' && testBody.trim()) {
        options.body = testBody;
      }

      const res = await fetch(resolvedUrl, options);
      const elapsed = Math.round(performance.now() - start);
      setExecutionTimeMs(elapsed);
      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : ''));

      const resHeaders: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaders[key] = val;
      });
      setResponseHeaders(resHeaders);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponseData(json);
      } else {
        const text = await res.text();
        setResponseData(text);
      }
    } catch (err: any) {
      setResponseStatus(500);
      setResponseStatusText('Network / Client Error');
      setResponseData({ error: err.message || 'Execution error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadOpenAPI = async () => {
    try {
      const spec = await fetchOpenAPISpec();
      const blob = new Blob([JSON.stringify(spec, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'openapi-snippet-vault.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'POST':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'PUT':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'PATCH':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                RESTful API Gateway &amp; Interactive Explorer
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                v2.4 OAS3
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Standard REST architecture handling complete CRUD operations for <strong>Users</strong>,{' '}
              <strong>Snippets</strong>, <strong>Collections</strong>, and <strong>Technical Publications</strong>,
              alongside Google Gemini &amp; Hugging Face AI endpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDownloadOpenAPI}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Download OpenAPI 3.0 specification JSON"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export OpenAPI</span>
          </button>

          {healthData && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono bg-slate-950 border border-slate-800 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{healthData.status.toUpperCase()} ({healthData.uptime_seconds}s)</span>
            </div>
          )}
        </div>
      </div>

      {/* Hugging Face API key info note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Hugging Face Integration:</strong> Pass your Hugging Face User Access Token via the{' '}
            <code className="text-amber-300 font-mono">x-hf-token</code> header below or configure{' '}
            <code className="text-indigo-300 font-mono">HUGGINGFACE_API_KEY</code>.
          </span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="password"
            placeholder="Optional Hugging Face token (hf_...)"
            value={hfTokenInput}
            onChange={(e) => setHfTokenInput(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs w-full sm:w-64 font-mono focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-slate-500 text-[11px] font-mono ml-auto hidden sm:inline">
          {filteredEndpoints.length} endpoints
        </span>
      </div>

      {/* Main Dual Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Endpoints List */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 max-h-[750px] overflow-y-auto space-y-2">
          {filteredEndpoints.map((ep, idx) => {
            const isSelected =
              activeEndpoint.method === ep.method && activeEndpoint.path === ep.path;
            return (
              <button
                key={`${ep.method}-${ep.path}-${idx}`}
                onClick={() => setActiveEndpoint(ep)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getMethodBadge(
                        ep.method
                      )}`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs text-slate-200 font-semibold truncate">
                      {ep.path}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                    {ep.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{ep.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Right: Live Request Tester & Inspector */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
          {/* Endpoint Header Bar */}
          <div className="p-5 border-b border-slate-800 bg-slate-900">
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${getMethodBadge(
                    activeEndpoint.method
                  )}`}
                >
                  {activeEndpoint.method}
                </span>
                <span className="font-mono text-sm font-bold text-white">
                  {resolvedUrl}
                </span>
              </div>

              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{activeEndpoint.description}</p>
          </div>

          <div className="p-5 space-y-4 max-h-[680px] overflow-y-auto text-xs">
            {/* Path Parameters (if any) */}
            {activeEndpoint.parameters?.some((p) => p.in === 'path') && (
              <div>
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] block mb-2">
                  Path Parameters
                </span>
                <div className="space-y-2">
                  {activeEndpoint.parameters
                    .filter((p) => p.in === 'path')
                    .map((p) => (
                      <div key={p.name} className="flex items-center gap-3">
                        <span className="w-24 font-mono text-indigo-300 font-semibold text-xs">
                          {p.name}*
                        </span>
                        <input
                          type="text"
                          value={testPathParams[p.name] || ''}
                          onChange={(e) =>
                            setTestPathParams({ ...testPathParams, [p.name]: e.target.value })
                          }
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Query Parameters (if any) */}
            {activeEndpoint.parameters?.some((p) => p.in === 'query') && (
              <div>
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] block mb-2">
                  Query Parameters
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activeEndpoint.parameters
                    .filter((p) => p.in === 'query')
                    .map((p) => (
                      <div key={p.name}>
                        <label className="block text-[11px] text-slate-400 font-mono mb-1">
                          {p.name} ({p.type})
                        </label>
                        <input
                          type="text"
                          placeholder={p.description}
                          value={testQueryParams[p.name] || ''}
                          onChange={(e) =>
                            setTestQueryParams({ ...testQueryParams, [p.name]: e.target.value })
                          }
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Request Body (if POST/PUT/PATCH) */}
            {activeEndpoint.requestBody && (
              <div>
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] block mb-2">
                  JSON Request Body
                </span>
                <textarea
                  rows={6}
                  value={testBody}
                  onChange={(e) => setTestBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 resize-y focus:outline-none focus:border-indigo-500"
                  spellCheck={false}
                />
              </div>
            )}

            {/* Curl Command Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  cURL Equivalent
                </span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(curlCommand);
                    setCopiedCurl(true);
                    setTimeout(() => setCopiedCurl(false), 2000);
                  }}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {copiedCurl ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy cURL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                {curlCommand}
              </pre>
            </div>

            {/* Live Response Panel */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                  Server Response
                </span>
                {responseStatus !== null && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        responseStatus >= 200 && responseStatus < 300
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {responseStatus} {responseStatusText}
                    </span>
                    {executionTimeMs !== null && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {executionTimeMs}ms
                      </span>
                    )}
                  </div>
                )}
              </div>

              {responseStatus !== null ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 max-h-72 overflow-auto font-mono text-[11px] text-emerald-300">
                  <pre className="whitespace-pre-wrap break-all">
                    {typeof responseData === 'object'
                      ? JSON.stringify(responseData, null, 2)
                      : responseData}
                  </pre>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-xl">
                  Click <strong>"Send Request"</strong> above to execute this endpoint live.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
