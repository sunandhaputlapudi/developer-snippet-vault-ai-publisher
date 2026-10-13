import React, { useState } from 'react';
import { X, User, Mail, ArrowRight } from 'lucide-react';
import { loginUser, signupUser } from '../../lib/api';
import { User as UserType } from '../../types/snippet';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType) => void;
  currentUser: UserType | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  currentUser,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      let res;
      if (mode === 'login') {
        res = await loginUser(email.trim());
      } else {
        res = await signupUser(email.trim(), name.trim());
      }
      onAuthSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              {currentUser ? 'Developer Profile' : mode === 'login' ? 'Sign In to Vault' : 'Create Vault Account'}
            </h3>
            <p className="text-xs text-slate-400">
              Personalized snippet workspace &amp; AI publisher
            </p>
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

        {/* Current profile status if logged in */}
        {currentUser && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full border border-indigo-500/40"
            />
            <div className="flex-1 truncate">
              <span className="font-semibold text-slate-200 block truncate">
                {currentUser.name}
              </span>
              <span className="text-slate-400 block truncate">{currentUser.email}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Active
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Developer Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="developer@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
