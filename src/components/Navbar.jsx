import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Users, 
  Loader2,
  LogOut,
  UserCheck,
  ChevronDown,
  History
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { 
    canGoBack, 
    canGoForward, 
    goBack, 
    goForward, 
    currentView, 
    navigateTo, 
    searchQuery, 
    setSearchQuery,
    isSearching,
    isFriendsPanelOpen,
    setIsFriendsPanelOpen
  } = usePlayer();

  const { currentUser, logout, switchAccount, accounts, getUserPlaybackProgress } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (currentView !== 'search') {
      navigateTo('search');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const savedPlayback = getUserPlaybackProgress();

  return (
    <header className="spotify-navbar">
      {/* Navigation History Controls */}
      <div className="nav-history-controls">
        <button 
          className="history-nav-btn" 
          onClick={goBack} 
          disabled={!canGoBack}
          title="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        <button 
          className="history-nav-btn" 
          onClick={goForward} 
          disabled={!canGoForward}
          title="Go forward"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Real-time Search Input Bar */}
      <div className="navbar-search-wrapper">
        {isSearching ? (
          <Loader2 className="search-input-icon search-spin" size={19} color="#1db954" />
        ) : (
          <Search className="search-input-icon" size={20} />
        )}
        <input 
          type="text" 
          placeholder="What do you want to play?" 
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (currentView !== 'search') navigateTo('search');
          }}
          className="navbar-search-input"
        />
        {searchQuery && (
          <button className="search-clear-btn" onClick={handleClearSearch} title="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Header Actions */}
      <div className="navbar-right-actions">
        {/* Toggle Friends Activity Panel */}
        <button 
          className={`navbar-icon-btn ${isFriendsPanelOpen ? 'active' : ''}`}
          onClick={() => setIsFriendsPanelOpen(prev => !prev)}
          title={isFriendsPanelOpen ? "Hide Friend Activity" : "Show Friend Activity"}
        >
          <Users size={19} />
        </button>

        {/* User Profile Pill & Dropdown */}
        {currentUser ? (
          <div className="user-profile-menu-container" ref={menuRef}>
            <button 
              className={`user-profile-pill ${isUserMenuOpen ? 'active' : ''}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title={`Logged in as ${currentUser.name} (${currentUser.email})`}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="user-profile-avatar"
              />
              <span className="user-profile-name">{currentUser.name}</span>
              <ChevronDown size={14} className={`user-profile-arrow ${isUserMenuOpen ? 'open' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="user-profile-dropdown">
                {/* Account Summary */}
                <div className="dropdown-account-header">
                  <img src={currentUser.avatar} alt={currentUser.name} className="dropdown-user-avatar" />
                  <div className="dropdown-user-details">
                    <span className="dropdown-user-name">{currentUser.name}</span>
                    <span className="dropdown-user-email">{currentUser.email}</span>
                    <span className="dropdown-user-plan">{currentUser.plan || 'Spotify Premium'}</span>
                  </div>
                </div>

                {/* Last Listening Progress */}
                {savedPlayback && savedPlayback.track && (
                  <div className="dropdown-playback-progress-box">
                    <div className="dropdown-progress-label">
                      <History size={12} color="#1db954" />
                      <span>Last Listened Progress</span>
                    </div>
                    <div className="dropdown-progress-track">
                      <img src={savedPlayback.track.coverUrl} alt="Cover" className="dropdown-progress-thumb" />
                      <div className="dropdown-progress-meta">
                        <span className="progress-track-name">{savedPlayback.track.title}</span>
                        <span className="progress-track-time">
                          Left off at {Math.floor(savedPlayback.currentTime / 60)}:{Math.floor(savedPlayback.currentTime % 60).toString().padStart(2, '0')} ({savedPlayback.percent}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="dropdown-divider"></div>

                {/* Switch Account Quick List */}
                <div className="dropdown-switch-section">
                  <span className="dropdown-section-title">Switch Account (Multi-Session):</span>
                  {accounts.map(acc => (
                    <button
                      key={acc.id}
                      className={`dropdown-account-choice ${acc.id === currentUser.id ? 'current' : ''}`}
                      onClick={() => {
                        switchAccount(acc.id);
                        setIsUserMenuOpen(false);
                      }}
                    >
                      <img src={acc.avatar} alt={acc.name} className="choice-avatar" />
                      <div className="choice-meta">
                        <span className="choice-name">{acc.name}</span>
                        <span className="choice-email">{acc.email}</span>
                      </div>
                      {acc.id === currentUser.id && (
                        <UserCheck size={14} color="#1db954" className="choice-check" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="dropdown-divider"></div>

                {/* Log Out Button */}
                <button 
                  className="dropdown-logout-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={15} />
                  <span>Log out of Spotify</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="navbar-login-btn"
            onClick={() => logout()}
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
};
