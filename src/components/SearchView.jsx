import React, { useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Search as SearchIcon, 
  Sparkles, 
  Flame, 
  Loader2,
  Zap
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { GENRE_CATEGORIES } from '../data/mockData';

export const SearchView = () => {
  const { 
    tracks, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    searchQuery, 
    setSearchQuery,
    searchResults,
    isSearching,
    trendingTracks,
    likedTrackIds, 
    toggleLikeTrack,
    isLosslessMode,
    toggleLosslessMode,
    searchFilter,
    setSearchFilter
  } = usePlayer();

  const displayedTracks = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    let list = [];
    if (searchResults && searchResults.length > 0) {
      list = searchResults;
    } else {
      const q = searchQuery.toLowerCase();
      list = tracks.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q)
      );
    }

    if (searchFilter === 'lossless') {
      return list.filter(t => t.isLossless);
    }
    return list;
  }, [searchQuery, searchResults, searchFilter, tracks]);

  const topResult = displayedTracks.length > 0 ? displayedTracks[0] : null;

  const handleTrackClick = (track, list = displayedTracks) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, list.length > 0 ? list : tracks);
    }
  };

  return (
    <div className="search-view-container">
      {/* Top Search Controls Header */}
      <div className="search-controls-header">
        <div className="search-filter-pills">
          <button 
            className={`filter-pill ${searchFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSearchFilter('all')}
          >
            All Songs
          </button>
          <button 
            className={`filter-pill ${searchFilter === 'lossless' ? 'active' : ''}`}
            onClick={() => setSearchFilter('lossless')}
          >
            <Sparkles size={13} style={{ marginRight: '4px' }} />
            Hi-Res Lossless (320kbps)
          </button>
        </div>

        {/* Live Lossless Audio DSP Indicator */}
        <div 
          className="lossless-status-badge"
          onClick={toggleLosslessMode}
          title="Click to toggle Web Audio API 24-bit Lossless DSP Engine"
        >
          <span className={`lossless-pulse ${isLosslessMode ? 'active' : 'inactive'}`}></span>
          <span className="lossless-badge-label">
            {isLosslessMode ? '24-Bit / 96kHz Lossless DSP' : 'Standard Audio'}
          </span>
          <span className="lossless-toggle-hint">
            {isLosslessMode ? 'ACTIVE' : 'OFF'}
          </span>
        </div>
      </div>

      {/* When Search Query is present */}
      {searchQuery.trim() ? (
        <div className="search-results-section">
          {isSearching ? (
            <div className="search-loading-container">
              <Loader2 size={36} className="search-spinner-icon" />
              <h3>Finding full studio master songs...</h3>
              <p>Fetching 320kbps full uncut audio stream directly</p>
            </div>
          ) : displayedTracks.length > 0 ? (
            <div className="search-results-layout">
              {/* Top Result Card */}
              {topResult && (
                <div className="top-result-column">
                  <h2 className="search-subheading">Top result</h2>
                  <div 
                    className="top-result-card"
                    onClick={() => handleTrackClick(topResult)}
                  >
                    <div className="top-result-image-wrapper">
                      <img 
                        src={topResult.coverUrl} 
                        alt={topResult.title} 
                        className="top-result-artwork" 
                      />
                      <span className="lossless-card-badge full-song-chip">
                        ⚡ FULL SONG
                      </span>
                    </div>

                    <div className="top-result-title">{topResult.title}</div>
                    <div className="top-result-meta">
                      <span className="top-result-artist">{topResult.artist}</span>
                      <span className="top-result-tag">Song</span>
                      <span className="top-result-year">{topResult.durationFormatted}</span>
                    </div>

                    <div className="top-result-quality-pill">
                      <Zap size={12} color="#1db954" />
                      <span>{topResult.audioQuality || '320kbps Full Studio Master'}</span>
                    </div>

                    <button 
                      className="top-result-play-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackClick(topResult);
                      }}
                      title={currentTrack?.id === topResult.id && isPlaying ? "Pause" : "Play"}
                    >
                      {currentTrack?.id === topResult.id && isPlaying ? (
                        <Pause size={24} fill="#000" color="#000" />
                      ) : (
                        <Play size={24} fill="#000" color="#000" style={{ marginLeft: '3px' }} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Matching Songs List */}
              <div className="matching-songs-column">
                <div className="matching-songs-header">
                  <h2 className="search-subheading">Songs</h2>
                  <span className="results-count-tag">{displayedTracks.length} full songs</span>
                </div>

                <div className="matching-songs-list">
                  {displayedTracks.slice(0, 10).map((track) => {
                    const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                    const isLiked = likedTrackIds.includes(track.id);

                    return (
                      <div 
                        key={track.id} 
                        className={`matching-song-row ${currentTrack?.id === track.id ? 'is-active-row' : ''}`}
                        onClick={() => handleTrackClick(track)}
                      >
                        <div className="song-row-thumb-box">
                          <img src={track.coverUrl} alt={track.title} className="song-row-thumb" />
                          <div className="song-row-play-overlay">
                            {isThisPlaying ? (
                              <Pause size={16} fill="#fff" color="#fff" />
                            ) : (
                              <Play size={16} fill="#fff" color="#fff" style={{ marginLeft: '2px' }} />
                            )}
                          </div>
                        </div>

                        <div className="song-row-info">
                          <div className="song-row-title-line">
                            <span className={`song-row-title ${currentTrack?.id === track.id ? 'green-text' : ''}`}>
                              {track.title}
                            </span>
                            <span className="row-full-song-badge" title="Full Uncut Song">
                              FULL SONG
                            </span>
                          </div>
                          <div className="song-row-artist-line">
                            <span className="song-row-artist">{track.artist}</span>
                            <span className="song-row-bullet">•</span>
                            <span className="song-row-album">{track.album}</span>
                          </div>
                        </div>

                        <button 
                          className={`song-row-like-btn ${isLiked ? 'liked' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLikeTrack(track.id);
                          }}
                          title={isLiked ? "Unlike" : "Like"}
                        >
                          <Heart size={16} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "currentColor"} />
                        </button>

                        <div className="song-row-duration">{track.durationFormatted}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="search-empty-state">
              <SearchIcon size={48} className="empty-search-icon" />
              <h3>No results found for "{searchQuery}"</h3>
              <p>Try searching for songs like "Believer", "Starboy", "Blinding Lights", "Espresso", or "Cruel Summer".</p>
            </div>
          )}
        </div>
      ) : (
        /* Default Browse Section with Real-Time Full-Length Trending Songs + Genres */
        <div className="search-default-browse">
          {/* Real-time Global Trending Songs (Full Length) */}
          {trendingTracks && trendingTracks.length > 0 && (
            <div className="trending-section">
              <div className="trending-section-header">
                <div className="trending-title-group">
                  <Flame size={22} color="#f97316" />
                  <h2 className="search-main-heading" style={{ marginBottom: 0 }}>Trending Full Songs</h2>
                </div>
                <span className="trending-live-tag">100% WHOLE SONGS ONLY</span>
              </div>

              <div className="trending-cards-grid">
                {trendingTracks.slice(0, 6).map((track) => {
                  const isThisPlaying = currentTrack?.id === track.id && isPlaying;
                  return (
                    <div 
                      key={track.id} 
                      className="trending-card"
                      onClick={() => handleTrackClick(track, trendingTracks)}
                    >
                      <div className="trending-card-artwork-box">
                        <img src={track.coverUrl} alt={track.title} className="trending-card-artwork" />
                        <span className="trending-lossless-chip">FULL SONG</span>
                        <button 
                          className="trending-play-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackClick(track, trendingTracks);
                          }}
                          title={isThisPlaying ? "Pause" : "Play"}
                        >
                          {isThisPlaying ? (
                            <Pause size={20} fill="#000" color="#000" />
                          ) : (
                            <Play size={20} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                          )}
                        </button>
                      </div>
                      <div className="trending-card-title" title={track.title}>{track.title}</div>
                      <div className="trending-card-artist" title={track.artist}>{track.artist}</div>
                      <div className="trending-card-duration">{track.durationFormatted}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Browse All Genres */}
          <div className="browse-categories-section">
            <h2 className="search-main-heading">Browse all</h2>
            <div className="categories-grid">
              {GENRE_CATEGORIES.map((cat) => (
                <div 
                  key={cat.id} 
                  className="category-tile"
                  style={{ backgroundColor: cat.color }}
                  onClick={() => setSearchQuery(cat.name)}
                  title={`Search full ${cat.name} songs`}
                >
                  <span className="category-name">{cat.name}</span>
                  <img src={cat.image} alt={cat.name} className="category-artwork-img" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
