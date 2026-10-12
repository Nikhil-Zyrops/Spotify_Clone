import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const INITIAL_ACCOUNTS = [
  {
    id: 'user-nikhil-1',
    name: 'Nikhil',
    email: 'nikhil@zyrops.in',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    plan: 'Premium Lossless (Family Owner)',
    createdAt: '2026-01-10'
  },
  {
    id: 'user-sarah-2',
    name: 'Sarah Jenkins',
    email: 'sarah@music.io',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    plan: 'Premium Individual',
    createdAt: '2026-02-15'
  },
  {
    id: 'user-alex-3',
    name: 'Alex Rivera',
    email: 'alex@audiophile.fm',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    plan: 'Hi-Fi Studio Master',
    createdAt: '2026-03-01'
  }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // All registered accounts stored in localStorage
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('spotify_clone_all_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      localStorage.setItem('spotify_clone_all_accounts', JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  // Current active user for this session/tab
  // SessionStorage provides per-tab isolation so multiple accounts can run simultaneously without clashing!
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const sessionUserId = sessionStorage.getItem('spotify_clone_session_user_id');
      if (sessionUserId) {
        const found = accounts.find(a => a.id === sessionUserId);
        if (found) return found;
      }
      const lastUserId = localStorage.getItem('spotify_clone_last_user_id');
      if (lastUserId) {
        const found = accounts.find(a => a.id === lastUserId);
        if (found) {
          sessionStorage.setItem('spotify_clone_session_user_id', found.id);
          return found;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  // Sync accounts list whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('spotify_clone_all_accounts', JSON.stringify(accounts));
    } catch {
      // quota or local storage error fallback
    }
  }, [accounts]);

  // Sync current user session
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('spotify_clone_session_user_id', currentUser.id);
        localStorage.setItem('spotify_clone_last_user_id', currentUser.id);
      } else {
        sessionStorage.removeItem('spotify_clone_session_user_id');
      }
    } catch {
      // fallback
    }
  }, [currentUser]);

  // Login handler
  const login = useCallback((email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const user = accounts.find(
      a => a.email.toLowerCase() === cleanEmail && a.password === cleanPassword
    );

    if (!user) {
      // Check if email exists with wrong password
      const emailMatch = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (emailMatch) {
        throw new Error('Incorrect password. Please try again.');
      }
      throw new Error('No Spotify Clone account found with that email address.');
    }

    setCurrentUser(user);
    sessionStorage.setItem('spotify_clone_session_user_id', user.id);
    localStorage.setItem('spotify_clone_last_user_id', user.id);
    return user;
  }, [accounts]);

  // Signup handler
  const signup = useCallback((name, email, password) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName) throw new Error('Please enter your name.');
    if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('Please enter a valid email address.');
    if (cleanPassword.length < 6) throw new Error('Password must be at least 6 characters long.');

    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account already exists with this email address. Please log in.');
    }

    // Default avatars rotation
    const avatarList = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
    ];
    const assignedAvatar = avatarList[accounts.length % avatarList.length];

    const newUser = {
      id: 'user-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      avatar: assignedAvatar,
      plan: 'Spotify Premium (Individual)',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAccounts(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    sessionStorage.setItem('spotify_clone_session_user_id', newUser.id);
    localStorage.setItem('spotify_clone_last_user_id', newUser.id);
    return newUser;
  }, [accounts]);

  // Logout handler
  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('spotify_clone_session_user_id');
    localStorage.removeItem('spotify_clone_last_user_id');
  }, []);

  // Quick switch to any existing account
  const switchAccount = useCallback((userId) => {
    const target = accounts.find(a => a.id === userId);
    if (target) {
      setCurrentUser(target);
      sessionStorage.setItem('spotify_clone_session_user_id', target.id);
      localStorage.setItem('spotify_clone_last_user_id', target.id);
    }
  }, [accounts]);

  // Save playback progress specifically under this user's isolated storage
  const saveUserPlaybackProgress = useCallback((track, currentTime, duration) => {
    if (!currentUser || !track) return;
    try {
      const progressKey = `spotify_clone_user_${currentUser.id}_playback`;
      const historyKey = `spotify_clone_user_${currentUser.id}_history`;

      const progressData = {
        trackId: track.id,
        track: {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album || track.title,
          coverUrl: track.coverUrl,
          audioUrl: track.audioUrl,
          duration: duration || track.duration || 180
        },
        currentTime: Math.round(currentTime * 10) / 10,
        duration: duration || track.duration || 180,
        percent: Math.min(100, Math.round(((currentTime) / (duration || track.duration || 180)) * 100)),
        lastPlayedAt: new Date().toISOString()
      };

      localStorage.setItem(progressKey, JSON.stringify(progressData));

      // Append/Update history list
      const savedHistory = localStorage.getItem(historyKey);
      let historyList = savedHistory ? JSON.parse(savedHistory) : [];
      historyList = historyList.filter(item => item.trackId !== track.id);
      historyList.unshift(progressData);
      if (historyList.length > 20) historyList = historyList.slice(0, 20);
      localStorage.setItem(historyKey, JSON.stringify(historyList));
    } catch {
      // fallback
    }
  }, [currentUser]);

  // Get saved playback progress for the current user
  const getUserPlaybackProgress = useCallback(() => {
    if (!currentUser) return null;
    try {
      const progressKey = `spotify_clone_user_${currentUser.id}_playback`;
      const saved = localStorage.getItem(progressKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [currentUser]);

  // User-isolated generic storage getter
  const getUserStorage = useCallback((subKey, fallbackValue) => {
    if (!currentUser) return fallbackValue;
    try {
      const fullKey = `spotify_clone_user_${currentUser.id}_${subKey}`;
      const saved = localStorage.getItem(fullKey);
      return saved ? JSON.parse(saved) : fallbackValue;
    } catch {
      return fallbackValue;
    }
  }, [currentUser]);

  // User-isolated generic storage setter
  const setUserStorage = useCallback((subKey, value) => {
    if (!currentUser) return;
    try {
      const fullKey = `spotify_clone_user_${currentUser.id}_${subKey}`;
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch {
      // fallback
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        accounts,
        login,
        signup,
        logout,
        switchAccount,
        saveUserPlaybackProgress,
        getUserPlaybackProgress,
        getUserStorage,
        setUserStorage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
