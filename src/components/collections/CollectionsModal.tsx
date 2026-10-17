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
  '#0F172A', // Deep Navy
  '#1E3A8A', // Navy Accent
  '#2563EB', // Blue
  '#0284C7', // Sky
  '#059669', // Emerald
  '#D97706', // Amber
  '#EA580C', // Orange
  '#DC2626', // Red
  '#7C3AED', // Violet
  '#475569', // Slate
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/10">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Manage Collections</h3>
              <p className="text-xs text-[#64748B]">Group your snippets into organized workspaces</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
            {error}
          </div>
        )}

        {/* Create new collection form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1 font-mono">
              Collection Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js Auth, Python Microservices"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1 font-mono">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Short description of items in this folder"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5 font-mono">
              Color Accent
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    selectedColor === color ? 'scale-125 ring-2 ring-[#0F172A] ring-offset-2 ring-offset-white' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 transition-all shadow-md shadow-[#0F172A]/15 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create Collection'}</span>
          </button>
        </form>

        {/* Existing collections list */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-2 font-mono">
            Existing Collections ({collections.length})
          </span>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {collections.map((col) => (
              <div
                key={col.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: col.color }}
                  />
                  <div className="truncate">
                    <span className="font-semibold text-[#0F172A] block truncate">
                      {col.name}
                    </span>
                    {col.description && (
                      <span className="text-[11px] text-[#64748B] block truncate">
                        {col.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-[11px] text-[#64748B]">
                    {col.snippet_count || 0} items
                  </span>
                  <button
                    onClick={() => onDeleteCollection(col.id)}
                    className="p-1 rounded-lg text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
