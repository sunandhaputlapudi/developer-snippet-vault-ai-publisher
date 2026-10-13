import React, { useState } from 'react';
import { X, FolderPlus, Trash2, FolderGit2 } from 'lucide-react';
import { Collection } from '../../types/snippet';

interface CollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collections: Collection[];
  onCreateCollection: (data: { name: string; description?: string; color: string }) => Promise<void>;
  onDeleteCollection: (id: string) => Promise<void>;
}

const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#64748b', // Slate
];

export const CollectionsModal: React.FC<CollectionsModalProps> = ({
  isOpen,
  onClose,
  collections,
  onCreateCollection,
  onDeleteCollection,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await onCreateCollection({
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
      });
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manage Collections</h3>
              <p className="text-xs text-slate-400">Group your snippets into organized workspaces</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Create new collection form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Collection Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js Auth, Python Microservices"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Short description of items in this folder"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Color Accent
            </label>
            <div className="flex items-center gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    selectedColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <FolderPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create Collection'}</span>
          </button>
        </form>

        {/* Existing collections list */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Existing Collections ({collections.length})
          </span>
          <div className="max-h-48 overflow-y-auto space-y-1.5">
            {collections.map((col) => (
              <div
                key={col.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  <div>
                    <span className="font-semibold text-slate-200 block truncate">
                      {col.name}
                    </span>
                    {col.description && (
                      <span className="text-[11px] text-slate-400 block truncate">
                        {col.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[11px] text-slate-400">
                    {col.snippet_count || 0} items
                  </span>
                  <button
                    onClick={() => onDeleteCollection(col.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    title="Delete collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
