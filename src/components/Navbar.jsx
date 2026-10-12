import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X, 
  Users, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

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
    liveListeners,
    liveSyncTime,
    isFriendsPanelOpen,
    setIsFriendsPanelOpen,
    setIsSpotifyInfoOpen
  } = usePlayer();

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
          placeholder="Search real songs, artists, or albums (Lossless Audio)..." 
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

      {/* Real-time Status & Header Actions */}
      <div className="navbar-right-actions">
        {/* Real-Time Sync Indicator */}
        <div className="live-sync-pill" title={`Real-time sync active • Last heartbeat ${liveSyncTime}`}>
          <span className="live-pulse-dot"></span>
          <span className="live-sync-text">LIVE SYNC</span>
          <span className="live-listener-count">
            {liveListeners.toLocaleString()} listening
          </span>
        </div>

        {/* Spotify Architecture Deep Dive Trigger */}
        <button 
          className="navbar-guide-btn"
          onClick={() => setIsSpotifyInfoOpen(true)}
          title="Learn how Spotify streaming architecture works"
        >
          <Sparkles size={16} />
          <span>How Spotify Works</span>
        </button>

        {/* Toggle Friends Activity Panel */}
        <button 
          className={`navbar-icon-btn ${isFriendsPanelOpen ? 'active' : ''}`}
          onClick={() => setIsFriendsPanelOpen(prev => !prev)}
          title={isFriendsPanelOpen ? "Hide Friend Activity" : "Show Friend Activity"}
        >
          <Users size={19} />
        </button>

        {/* User Profile Pill */}
        <div className="user-profile-pill" title="Nikhil (Zyrops Pro Account)">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
            alt="Profile Avatar" 
            className="user-profile-avatar"
          />
          <span className="user-profile-name">Nikhil</span>
        </div>
      </div>
    </header>
  );
};
