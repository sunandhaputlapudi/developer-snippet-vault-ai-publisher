import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Sparkles,
  Plus,
  Search,
  Star,
  SlidersHorizontal,
  Grid3X3,
  List,
  BookOpen,
  FolderGit2,
  Filter,
  Check,
  RefreshCw,
  Clock,
  Layers,
  Download,
} from 'lucide-react';
import { Snippet, Collection, User } from './types/snippet';
import {
  fetchSnippets,
  fetchCollections,
  getCurrentUser,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  toggleFavoriteSnippet,
  createCollection,
  deleteCollection,
  logoutUser,
} from './lib/api';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SnippetCard } from './components/snippets/SnippetCard';
import { SnippetDetailModal } from './components/snippets/SnippetDetailModal';
import { SnippetFormModal } from './components/snippets/SnippetFormModal';
import { CollectionsModal } from './components/collections/CollectionsModal';
import { AIPublisherView } from './components/publisher/AIPublisherView';
import { LandingShowcase } from './components/landing/LandingShowcase';
import { ReadmeGeneratorView } from './components/readme/ReadmeGeneratorView';
import { AuthModal } from './components/auth/AuthModal';
import { LoginPage } from './components/auth/LoginPage';
import { getLanguageMeta } from './lib/languages';

export default function App() {
  // Navigation & User
  const [activeTab, setActiveTab] = useState<'vault' | 'publisher' | 'collections' | 'landing' | 'readme-generator'>('vault');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Snippets & Collections data
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'language'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Modals
  const [inspectingSnippet, setInspectingSnippet] = useState<Snippet | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [publisherTargetSnippet, setPublisherTargetSnippet] = useState<Snippet | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial session verification
  useEffect(() => {
    checkInitialSession();
  }, []);

  const checkInitialSession = async () => {
    try {
      const u = await getCurrentUser();
      if (u) {
        setUser(u);
        await Promise.all([loadCollectionsData(), loadSnippetsData()]);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setIsAuthChecking(false);
    }
  };

  const handleLoginSuccess = async (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setActiveTab('vault');
    showToast(`Welcome back, ${authenticatedUser.name}!`);
    await Promise.all([loadCollectionsData(), loadSnippetsData()]);
  };

  const loadCollectionsData = async () => {
    try {
      const cols = await fetchCollections();
      setCollections(cols);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSnippetsData = async () => {
    setLoading(true);
    try {
      const { snippets: data } = await fetchSnippets();
      setSnippets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Sorted Snippets
  const filteredSnippets = useMemo(() => {
    let result = [...snippets];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.code_content.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Language filter
    if (selectedLanguage !== 'all') {
      result = result.filter(
        (s) => s.language.toLowerCase() === selectedLanguage.toLowerCase()
      );
    }

    // Collection filter
    if (selectedCollectionId) {
      result = result.filter((s) => s.collection_id === selectedCollectionId);
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((s) =>
        s.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((s) => s.is_favorite);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'language') {
        return a.language.localeCompare(b.language);
      }
      return 0;
    });

    return result;
  }, [
    snippets,
    searchQuery,
    selectedLanguage,
    selectedCollectionId,
    selectedTag,
    showFavoritesOnly,
    sortBy,
  ]);

  // Available languages with counts
  const availableLanguages = useMemo(() => {
    const counts: Record<string, number> = {};
    snippets.forEach((s) => {
      const l = s.language.toLowerCase();
      counts[l] = (counts[l] || 0) + 1;
    });
    return Object.entries(counts).map(([lang, count]) => ({ lang, count }));
  }, [snippets]);

  // Popular tags
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    snippets.forEach((s) => {
      s.tags.forEach((t) => {
        const clean = t.toLowerCase();
        counts[clean] = (counts[clean] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag);
  }, [snippets]);

  const favoriteCount = useMemo(
    () => snippets.filter((s) => s.is_favorite).length,
    [snippets]
  );

  // Actions
  const handleSaveSnippet = async (data: {
    id?: string;
    title: string;
    code_content: string;
    language: string;
    notes?: string;
    collection_id?: string | null;
    is_favorite?: boolean;
    auto_analyze?: boolean;
  }) => {
    if (data.id) {
      // Edit
      const updated = await updateSnippet(data.id, {
        title: data.title,
        code_content: data.code_content,
        language: data.language,
        notes: data.notes,
        collection_id: data.collection_id,
        is_favorite: data.is_favorite,
        reanalyze: data.auto_analyze,
      });
      setSnippets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      if (inspectingSnippet?.id === updated.id) {
        setInspectingSnippet(updated);
      }
      showToast('Snippet updated successfully');
    } else {
      // Create
      const created = await createSnippet({
        title: data.title,
        code_content: data.code_content,
        language: data.language,
        notes: data.notes,
        collection_id: data.collection_id,
        is_favorite: data.is_favorite,
        auto_analyze: data.auto_analyze,
      });
      setSnippets((prev) => [created, ...prev]);
      showToast('Snippet added to your Vault!');
    }
    loadCollectionsData();
  };

  const handleDeleteSnippet = async (snippet: Snippet) => {
    if (!confirm(`Are you sure you want to delete "${snippet.title}"?`)) return;
    try {
      await deleteSnippet(snippet.id);
      setSnippets((prev) => prev.filter((s) => s.id !== snippet.id));
      if (inspectingSnippet?.id === snippet.id) {
        setInspectingSnippet(null);
      }
      showToast('Snippet deleted');
      loadCollectionsData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    // Optimistic UI update
    setSnippets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_favorite: !s.is_favorite } : s))
    );
    if (inspectingSnippet?.id === id) {
      setInspectingSnippet((prev) =>
        prev ? { ...prev, is_favorite: !prev.is_favorite } : null
      );
    }

    try {
      await toggleFavoriteSnippet(id);
    } catch (e) {
      // revert on error
      loadSnippetsData();
    }
  };

  const handleCreateCollection = async (data: {
    name: string;
    description?: string;
    color: string;
  }) => {
    const col = await createCollection(data);
    setCollections((prev) => [...prev, col]);
    showToast(`Collection "${col.name}" created`);
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Delete this collection? Snippets will not be deleted.')) return;
    await deleteCollection(id);
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (selectedCollectionId === id) setSelectedCollectionId(null);
    showToast('Collection removed');
  };

  const handleOpenPublisherWithSnippet = (snippet: Snippet) => {
    setPublisherTargetSnippet(snippet);
    setActiveTab('publisher');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    showToast('Signed out of vault');
  };

  const handleExportVault = () => {
    const backupData = {
      exported_at: new Date().toISOString(),
      vault_version: '2.4.0',
      user: user?.name || 'Developer',
      snippets,
      collections,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `developer-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vault library exported to JSON!');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-3 text-[#64748B] font-sans">
        <RefreshCw className="w-8 h-8 text-[#0F172A] animate-spin" />
        <p className="text-xs font-mono text-[#64748B]">Initializing developer vault session...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-[#0F172A] selection:text-white">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-2xl text-xs text-white animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewSnippet={() => {
          setEditingSnippet(null);
          setIsFormModalOpen(true);
        }}
        onOpenPublisher={() => {
          setPublisherTargetSnippet(snippets[0] || null);
          setActiveTab('publisher');
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {activeTab === 'landing' ? (
          <LandingShowcase
            onEnterVault={() => setActiveTab('vault')}
            onOpenPublisher={() => {
              setPublisherTargetSnippet(snippets[0] || null);
              setActiveTab('publisher');
            }}
          />
        ) : activeTab === 'publisher' ? (
          <AIPublisherView
            snippets={snippets}
            selectedSnippet={publisherTargetSnippet}
            onSnippetUpdated={(updated) => {
              setSnippets((prev) =>
                prev.map((s) => (s.id === updated.id ? updated : s))
              );
            }}
          />
        ) : activeTab === 'readme-generator' ? (
          <ReadmeGeneratorView
            snippets={snippets}
            initialSnippet={publisherTargetSnippet}
          />
        ) : (
          <div className="flex gap-8 items-start">
            {/* Left Sidebar */}
            <Sidebar
              totalCount={snippets.length}
              favoriteCount={favoriteCount}
              collections={collections}
              selectedCollectionId={selectedCollectionId}
              onSelectCollection={setSelectedCollectionId}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              activeTag={selectedTag}
              onSelectTag={setSelectedTag}
              showFavoritesOnly={showFavoritesOnly}
              onToggleFavoritesOnly={setShowFavoritesOnly}
              onOpenPublisher={() => {
                setPublisherTargetSnippet(snippets[0] || null);
                setActiveTab('publisher');
              }}
              onOpenNewCollection={() => setIsCollectionsModalOpen(true)}
              availableLanguages={availableLanguages}
              popularTags={popularTags}
              isMobileOpen={isMobileSidebarOpen}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />

            {/* Right Main Vault View */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Stats & Overview Header Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider font-mono">
                    Total Snippets
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-extrabold text-[#0F172A] font-mono">
                      {snippets.length}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">saved</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider font-mono">
                    Starred Favorites
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-extrabold text-amber-500 font-mono">
                      {favoriteCount}
                    </span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider font-mono">
                    Languages
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-extrabold text-[#1E3A8A] font-mono">
                      {availableLanguages.length}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-mono">dialects</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-[#64748B] block uppercase tracking-wider font-mono">
                    AI Publisher
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#1E3A8A]" /> Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-xs">
                {/* Search / Filter summary */}
                <div className="flex items-center gap-2 flex-wrap">
                  {showFavoritesOnly && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Favorites Only
                    </span>
                  )}

                  {selectedCollectionId && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1E3A8A] border border-blue-200 font-medium">
                      <FolderGit2 className="w-3 h-3 text-[#1E3A8A]" />
                      {collections.find((c) => c.id === selectedCollectionId)?.name}
                    </span>
                  )}

                  {selectedLanguage !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1] capitalize">
                      {selectedLanguage}
                    </span>
                  )}

                  {selectedTag && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#1E3A8A] border border-blue-200 font-mono">
                      #{selectedTag}
                    </span>
                  )}

                  {(showFavoritesOnly || selectedCollectionId || selectedLanguage !== 'all' || selectedTag || searchQuery) && (
                    <button
                      onClick={() => {
                        setShowFavoritesOnly(false);
                        setSelectedCollectionId(null);
                        setSelectedLanguage('all');
                        setSelectedTag(null);
                        setSearchQuery('');
                      }}
                      className="text-[#64748B] hover:text-[#0F172A] underline text-[11px] ml-1 transition-colors"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>

                {/* Right controls: Sort dropdown & Grid/List toggle */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <div className="flex items-center gap-1.5 text-[#64748B]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white border border-[#CBD5E1] text-[#0F172A] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#0F172A] transition-colors"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title (A-Z)</option>
                      <option value="language">Language</option>
                    </select>
                  </div>

                  <div className="flex items-center border border-[#CBD5E1] rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-[#0F172A] text-white'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                      title="Grid layout"
                    >
                      <Grid3X3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('compact')}
                      className={`p-1.5 transition-colors ${
                        viewMode === 'compact'
                          ? 'bg-[#0F172A] text-white'
                          : 'text-[#64748B] hover:text-[#0F172A]'
                      }`}
                      title="Compact layout"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleExportVault}
                    className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                    title="Export Vault to JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Snippets Grid */}
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#64748B]">
                  <RefreshCw className="w-8 h-8 text-[#0F172A] animate-spin" />
                  <p className="text-sm font-medium">Loading your developer snippets...</p>
                </div>
              ) : filteredSnippets.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4 text-center border border-dashed border-[#CBD5E1] rounded-2xl bg-white p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">No snippets found</h3>
                    <p className="text-xs text-[#64748B] max-w-sm mt-1">
                      {searchQuery
                        ? `No code snippets match "${searchQuery}". Try adjusting your keywords or clearing filters.`
                        : 'Your vault is ready for code. Save your first function or algorithm to get started.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSnippet(null);
                      setIsFormModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] shadow-md transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span>Create New Snippet</span>
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 lg:grid-cols-2 gap-5'
                      : 'space-y-3'
                  }
                >
                  {filteredSnippets.map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onSelect={(s) => setInspectingSnippet(s)}
                      onEdit={(s) => {
                        setEditingSnippet(s);
                        setIsFormModalOpen(true);
                      }}
                      onDelete={handleDeleteSnippet}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenPublisher={handleOpenPublisherWithSnippet}
                      onSelectTag={(t) => setSelectedTag(t)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <SnippetDetailModal
        snippet={inspectingSnippet}
        onClose={() => setInspectingSnippet(null)}
        onEdit={(s) => {
          setInspectingSnippet(null);
          setEditingSnippet(s);
          setIsFormModalOpen(true);
        }}
        onDelete={handleDeleteSnippet}
        onToggleFavorite={handleToggleFavorite}
        onOpenPublisher={handleOpenPublisherWithSnippet}
        onOpenReadme={(s) => {
          setPublisherTargetSnippet(s);
          setActiveTab('readme-generator');
        }}
        onSnippetUpdated={(updated) => {
          setSnippets((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
          setInspectingSnippet(updated);
        }}
      />

      <SnippetFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingSnippet(null);
        }}
        onSave={handleSaveSnippet}
        initialSnippet={editingSnippet}
        collections={collections}
      />

      <CollectionsModal
        isOpen={isCollectionsModalOpen}
        onClose={() => setIsCollectionsModalOpen(false)}
        collections={collections}
        onCreateCollection={handleCreateCollection}
        onDeleteCollection={handleDeleteCollection}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          showToast(`Logged in as ${u.name}`);
          loadSnippetsData();
          loadCollectionsData();
        }}
        currentUser={user}
      />
    </div>
  );
}
