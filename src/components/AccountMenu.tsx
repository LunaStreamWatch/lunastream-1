import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { User, LogIn, LogOut, UserCircle, X, Mail, Lock, ImageIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AVATAR_OPTIONS = [
  { id: 'default', label: 'Default', emoji: '👤' },
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' },
  { id: 'fox', label: 'Fox', emoji: '🦊' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'koala', label: 'Koala', emoji: '🐨' },
  { id: 'lion', label: 'Lion', emoji: '🦁' },
  { id: 'tiger', label: 'Tiger', emoji: '🐯' },
  { id: 'bear', label: 'Bear', emoji: '🐻' },
  { id: 'frog', label: 'Frog', emoji: '🐸' },
  { id: 'penguin', label: 'Penguin', emoji: '🐧' },
  { id: 'owl', label: 'Owl', emoji: '🦉' },
];

export const AccountMenu: React.FC = () => {
  const { user, profile, loading, signUp, signIn, signOut, updateProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'signin' | 'signup' | 'profile'>('menu');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username);
      setSelectedAvatar(profile.avatar);
    }
  }, [profile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        resetForm();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyTouch = (document.body.style as any).touchAction;
      const prevHtmlOverscroll = (document.documentElement.style as any).overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      (document.body.style as any).touchAction = 'none';
      (document.documentElement.style as any).overscrollBehavior = 'contain';
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        (document.body.style as any).touchAction = prevBodyTouch;
        (document.documentElement.style as any).overscrollBehavior = prevHtmlOverscroll;
      };
    }
  }, [open]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setSuccess('');
    setView('menu');
    setEditingUsername(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProcessing(true);

    if (!email || !password || !username) {
      setError('All fields are required');
      setProcessing(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setProcessing(false);
      return;
    }

    const { error } = await signUp(email, password, username);
    setProcessing(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Account created successfully!');
      setTimeout(() => {
        resetForm();
        setOpen(false);
      }, 1500);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setProcessing(true);

    if (!email || !password) {
      setError('Email and password are required');
      setProcessing(false);
      return;
    }

    const { error } = await signIn(email, password);
    setProcessing(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Signed in successfully!');
      setTimeout(() => {
        resetForm();
        setOpen(false);
      }, 1000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    resetForm();
    setOpen(false);
  };

  const handleUpdateUsername = async () => {
    if (!newUsername || newUsername === profile?.username) {
      setEditingUsername(false);
      return;
    }

    if (newUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setError('');
    setProcessing(true);
    const { error } = await updateProfile({ username: newUsername });
    setProcessing(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Username updated!');
      setEditingUsername(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleUpdateAvatar = async (avatarId: string) => {
    setError('');
    setSelectedAvatar(avatarId);
    const { error } = await updateProfile({ avatar: avatarId });

    if (error) {
      setError(error.message);
      setSelectedAvatar(profile?.avatar || 'default');
    } else {
      setSuccess('Avatar updated!');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const getAvatarEmoji = (avatarId: string) => {
    return AVATAR_OPTIONS.find(a => a.id === avatarId)?.emoji || '👤';
  };

  if (loading) {
    return (
      <button
        className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Loading account"
      >
        <User className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Account menu"
      >
        {user && profile ? (
          <div className="text-xl">{getAvatarEmoji(profile.avatar)}</div>
        ) : (
          <User className="w-5 h-5" />
        )}
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[9999]" aria-modal="true" role="dialog">
          <div onClick={() => { setOpen(false); resetForm(); }} className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

          <div ref={ref} className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md sm:rounded-2xl rounded-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
                    <UserCircle className="w-5 h-5" />
                    {view === 'menu' && 'Account'}
                    {view === 'signin' && 'Sign In'}
                    {view === 'signup' && 'Sign Up'}
                    {view === 'profile' && 'Profile'}
                  </div>
                  <button
                    onClick={() => { setOpen(false); resetForm(); }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {view === 'menu' && !user && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Sign in to sync your watchlist, continue watching, and favourites across devices.
                    </p>
                    <button
                      onClick={() => setView('signin')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white font-medium hover:shadow-lg transition-shadow"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                    <button
                      onClick={() => setView('signup')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Create Account
                    </button>
                  </div>
                )}

                {view === 'menu' && user && profile && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="text-4xl">{getAvatarEmoji(profile.avatar)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{profile.username}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setView('profile')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      Edit Profile
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}

                {view === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                        {success}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Signing in...' : 'Sign In'}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setView('menu'); setError(''); }}
                      className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Back
                    </button>
                  </form>
                )}

                {view === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                        {success}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                        minLength={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Lock className="w-4 h-4 inline mr-1" />
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        required
                        minLength={6}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Creating account...' : 'Create Account'}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setView('menu'); setError(''); }}
                      className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      Back
                    </button>
                  </form>
                )}

                {view === 'profile' && profile && (
                  <div className="space-y-6">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                        {success}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Username
                      </label>
                      {editingUsername ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            minLength={3}
                          />
                          <button
                            onClick={handleUpdateUsername}
                            disabled={processing}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditingUsername(false); setNewUsername(profile.username); setError(''); }}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-900 dark:text-white">{profile.username}</span>
                          <button
                            onClick={() => setEditingUsername(true)}
                            className="text-sm text-pink-500 hover:text-pink-600"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        <ImageIcon className="w-4 h-4 inline mr-1" />
                        Avatar
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {AVATAR_OPTIONS.map((avatar) => (
                          <button
                            key={avatar.id}
                            onClick={() => handleUpdateAvatar(avatar.id)}
                            className={`p-3 rounded-lg border-2 text-2xl transition-all ${
                              selectedAvatar === avatar.id
                                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            title={avatar.label}
                          >
                            {avatar.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => { setView('menu'); setError(''); setSuccess(''); }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
};

export default AccountMenu;
