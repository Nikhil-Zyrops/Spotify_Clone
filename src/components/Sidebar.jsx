import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Mic2, 
  ListMusic, 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const Sidebar = () => {
  const { 
    currentView, 
    viewParam, 
    navigateTo, 
    playlists, 
    createPlaylist, 
    likedTrackIds
  } = usePlayer();

  const handleCreatePlaylist = () => {
    const num = playlists.length + 1;
    createPlaylist(`My Playlist #${num}`);
  };

  return (
    <aside className="spotify-sidebar">
      {/* Brand Header */}
      <div className="sidebar-top-card">
        <div className="brand-logo" onClick={() => navigateTo('home')}>
          <div className="brand-icon-wrapper">
            <svg viewBox="0 0 24 24" className="brand-svg-icon" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31a.754.754 0 0 1-1.037.25c-2.836-1.733-6.406-2.126-10.612-1.165a.755.755 0 0 1-.34-1.472c4.605-1.052 8.566-.605 11.74 1.349a.755.755 0 0 1 .25 1.038zm1.468-3.264a.945.945 0 0 1-1.3.312c-3.246-1.996-8.196-2.574-12.036-1.408a.946.946 0 0 1-.557-1.808c4.388-1.332 9.84-.69 13.58 1.608a.946.946 0 0 1 .313 1.288zm.125-3.402C15.21 8.358 8.84 8.15 5.146 9.27a1.135 1.135 0 0 1-.67-2.169c4.248-1.289 11.29-1.045 15.76 1.61a1.135 1.135 0 0 1-1.14 1.933z"/>
            </svg>
          </div>
          <span className="brand-name">Spotify</span>
          <span className="brand-badge">Clone</span>
        </div>

        {/* Primary Navigation */}
        <nav className="nav-menu">
          <button 
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('home')}
          >
            <Home className="nav-icon" size={24} />
            <span>Home</span>
          </button>

          <button 
            className={`nav-item ${currentView === 'search' ? 'active' : ''}`}
            onClick={() => navigateTo('search')}
          >
            <Search className="nav-icon" size={24} />
            <span>Search</span>
          </button>

          <button 
            className={`nav-item ${currentView === 'lyrics' ? 'active' : ''}`}
            onClick={() => navigateTo('lyrics')}
          >
            <Mic2 className="nav-icon" size={24} />
            <span>Live Lyrics</span>
          </button>

          <button 
            className={`nav-item ${currentView === 'queue' ? 'active' : ''}`}
            onClick={() => navigateTo('queue')}
          >
            <ListMusic className="nav-icon" size={24} />
            <span>Now Playing Queue</span>
          </button>
        </nav>
      </div>

      {/* Library Card */}
      <div className="sidebar-library-card">
        <div className="library-header">
          <div className="library-title-group" onClick={() => navigateTo('home')}>
            <Library className="library-icon" size={24} />
            <span>Your Library</span>
          </div>
          <button 
            className="create-playlist-btn" 
            title="Create Playlist"
            onClick={handleCreatePlaylist}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Liked Songs Item */}
        <div 
          className={`playlist-item ${currentView === 'liked' ? 'active' : ''}`}
          onClick={() => navigateTo('liked')}
        >
          <div className="liked-icon-box">
            <Heart size={18} fill="#ffffff" color="#ffffff" />
          </div>
          <div className="playlist-info">
            <span className="playlist-title">Liked Songs</span>
            <span className="playlist-subtitle">
              Playlist ? ${likedTrackIds.length} songs
            </span>
          </div>
        </div>

        {/* User & Curated Playlists List */}
        <div className="playlists-scroll-list">
          {playlists.map((playlist) => {
            const isCurrent = currentView === 'playlist' && viewParam === playlist.id;
            return (
              <div
                key={playlist.id}
                className={`playlist-item ${isCurrent ? 'active' : ''}`}
                onClick={() => navigateTo('playlist', playlist.id)}
              >
                <img 
                  src={playlist.coverUrl} 
                  alt={playlist.title} 
                  className="playlist-thumb"
                  loading="lazy"
                />
                <div className="playlist-info">
                  <span className="playlist-title">{playlist.title}</span>
                  <span className="playlist-subtitle">
                    Playlist ? ${playlist.owner}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
