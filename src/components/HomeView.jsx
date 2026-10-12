import React from 'react';
import { Play, Pause, TrendingUp } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const HomeView = () => {
  const { 
    tracks, 
    playlists, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    navigateTo, setIsSpotifyInfoOpen,
    liveListeners
  } = usePlayer();

  const [greeting] = React.useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  const getGreeting = () => greeting;

  const quickTracks = tracks.slice(0, 6);
  const trendingTracks = tracks.slice(0, 5);

  const handleTrackClick = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, tracks);
    }
  };

  return (
    <div className="home-view-container">
      {/* Ambient Gradient Header */}
      <div className="home-hero-header">
        <div className="home-top-meta">
          <span className="live-realtime-badge">
            <span className="live-pulsing-dot"></span>
            REAL-TIME SPOTIFY STREAMING ENGINE
          </span>
          <span className="live-network-count">
            <TrendingUp size={14} />
            {liveListeners.toLocaleString()} concurrent listeners
          </span>
        </div>
        <h1 className="home-greeting-heading">{getGreeting()}</h1>

        {/* 6 Quick Play Cards Grid */}
        <div className="quick-play-grid">
          {quickTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div 
                key={track.id} 
                className={`quick-play-card ${currentTrack?.id === track.id ? 'active-track' : ''}`}
                onClick={() => handleTrackClick(track)}
              >
                <img src={track.coverUrl} alt={track.title} className="quick-play-thumb" />
                <span className="quick-play-title">{track.title}</span>
                <button 
                  className={`quick-play-btn ${isThisPlaying ? 'visible' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackClick(track);
                  }}
                  title={isThisPlaying ? "Pause" : "Play"}
                >
                  {isThisPlaying ? (
                    <Pause size={18} fill="#000" color="#000" />
                  ) : (
                    <Play size={18} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Home Sections */}
      <div className="home-content-sections">
        {/* Real-time Trending Hits */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Trending Right Now</h2>
              <p className="section-subtitle">Updated in real-time based on global listener activity</p>
            </div>
            <button className="section-show-all-btn" onClick={() => navigateTo('playlist', 'playlist-top-hits')}>
              Show all
            </button>
          </div>

          <div className="tracks-cards-row">
            {trendingTracks.map((track, index) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id}
                  className={`spotify-media-card ${currentTrack?.id === track.id ? 'is-active-media' : ''}`}
                  onClick={() => handleTrackClick(track)}
                >
                  <div className="card-artwork-wrapper">
                    <img src={track.coverUrl} alt={track.title} className="card-artwork-img" loading="lazy" />
                    <span className="card-rank-badge">#{index + 1}</span>
                    
                    <button 
                      className={`card-play-fab ${isThisPlaying ? 'is-playing' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackClick(track);
                      }}
                      title={isThisPlaying ? "Pause" : "Play"}
                    >
                      {isThisPlaying ? (
                        <Pause size={22} fill="#000" color="#000" />
                      ) : (
                        <Play size={22} fill="#000" color="#000" style={{ marginLeft: '3px' }} />
                      )}
                    </button>
                  </div>

                  <div className="card-info">
                    <div className="card-title" title={track.title}>{track.title}</div>
                    <div className="card-description">{track.artist}</div>
                    <div className="card-meta-row">
                      <span className="card-genre-pill">{track.genre}</span>
                      <span className="card-plays-text">{track.plays} plays</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Featured Curated Playlists */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Made For You</h2>
              <p className="section-subtitle">Algorithmic recommendation mixes tailored to your listening habits</p>
            </div>
          </div>

          <div className="tracks-cards-row">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="spotify-media-card"
                onClick={() => navigateTo('playlist', playlist.id)}
              >
                <div className="card-artwork-wrapper">
                  <img src={playlist.coverUrl} alt={playlist.title} className="card-artwork-img" loading="lazy" />
                  <button 
                    className="card-play-fab"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('playlist', playlist.id);
                    }}
                    title="Open playlist"
                  >
                    <Play size={22} fill="#000" color="#000" style={{ marginLeft: '3px' }} />
                  </button>
                </div>
                <div className="card-info">
                  <div className="card-title">{playlist.title}</div>
                  <div className="card-description">{playlist.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Dive Banner */}
        <div className="architecture-banner-card">
          <div className="banner-content">
            <span className="banner-tag">SPOTIFY INTERNAL ARCHITECTURE</span>
            <h3 className="banner-title">Understand How Spotify Works Under the Hood</h3>
            <p className="banner-description">
              Explore how Spotify streams audio with Ogg Vorbis/AAC chunking, edge CDN caching, real-time Spotify Connect synchronization, and collaborative filtering recommendation engines.
            </p>
          </div>
          <button 
            className="banner-cta-btn"
            onClick={() => setIsSpotifyInfoOpen(true)}
          >
            Explore Architecture
          </button>
        </div>
      </div>
    </div>
  );
};

