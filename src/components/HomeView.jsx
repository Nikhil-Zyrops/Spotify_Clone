import React from 'react';
import { Play, Pause, Sparkles, Globe, MapPin } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const HomeView = () => {
  const { 
    tracks, 
    playlists, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    navigateTo,
    userRegion,
    regionalTrending,
    internationalTrending,
    madeForYouTracks
  } = usePlayer();

  const [greeting] = React.useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  const getGreeting = () => greeting;

  const quickTracks = tracks.slice(0, 6);
  const displayRegional = regionalTrending.length > 0 ? regionalTrending.slice(0, 6) : tracks.slice(0, 6);
  const displayInternational = internationalTrending.length > 0 ? internationalTrending.slice(0, 6) : tracks.slice(2, 8);
  const displayMadeForYou = madeForYouTracks.length > 0 ? madeForYouTracks.slice(0, 6) : tracks.slice(1, 7);

  const handleTrackClick = (track, list = tracks) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, list);
    }
  };

  return (
    <div className="home-view-container">
      {/* Ambient Gradient Header */}
      <div className="home-hero-header">
        <h1 className="home-greeting-heading">{getGreeting()}</h1>

        {/* 6 Quick Play Cards Grid */}
        <div className="quick-play-grid">
          {quickTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div 
                key={track.id} 
                className={`quick-play-card ${currentTrack?.id === track.id ? 'active-track' : ''}`}
                onClick={() => handleTrackClick(track, quickTracks)}
              >
                <img src={track.coverUrl} alt={track.title} className="quick-play-thumb" />
                <span className="quick-play-title">{track.title}</span>
                <button 
                  className={`quick-play-btn ${isThisPlaying ? 'visible' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackClick(track, quickTracks);
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
        {/* 1. Regional Trending Section (Public IP Based) */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <div className="section-title-with-pill">
                <h2 className="section-title">
                  {userRegion?.headline || `Trending in ${userRegion?.countryName || 'Your Region'}`}
                </h2>
                <span className="regional-flag-pill">
                  <MapPin size={12} color="#1db954" />
                  {userRegion?.flag || '??'} {userRegion?.countryName || 'Public IP Region'}
                </span>
              </div>
              <p className="section-subtitle">
                {userRegion?.subtitle || 'Latest hits streaming right now based on your location'}
              </p>
            </div>
            <button className="section-show-all-btn" onClick={() => navigateTo('playlist', 'playlist-top-hits')}>
              Show all
            </button>
          </div>

          <div className="tracks-cards-row">
            {displayRegional.map((track, index) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id}
                  className={`spotify-media-card ${currentTrack?.id === track.id ? 'is-active-media' : ''}`}
                  onClick={() => handleTrackClick(track, displayRegional)}
                >
                  <div className="card-artwork-wrapper">
                    <img src={track.coverUrl} alt={track.title} className="card-artwork-img" loading="lazy" />
                    <span className="card-rank-badge">#{index + 1}</span>
                    
                    <button 
                      className={`card-play-fab ${isThisPlaying ? 'is-playing' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackClick(track, displayRegional);
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
                      <span className="card-genre-pill">{track.genre || 'Regional'}</span>
                      <span className="card-plays-text">{track.plays || '1.2M'} plays</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. International Trending Section */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <div className="section-title-with-pill">
                <h2 className="section-title">International Trending</h2>
                <span className="international-pill">
                  <Globe size={12} color="#38bdf8" />
                  Global Chartbusters
                </span>
              </div>
              <p className="section-subtitle">
                Worldwide Top 50 megahits streaming across continents
              </p>
            </div>
            <button className="section-show-all-btn" onClick={() => navigateTo('playlist', 'playlist-top-hits')}>
              Show all
            </button>
          </div>

          <div className="tracks-cards-row">
            {displayInternational.map((track, index) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id}
                  className={`spotify-media-card ${currentTrack?.id === track.id ? 'is-active-media' : ''}`}
                  onClick={() => handleTrackClick(track, displayInternational)}
                >
                  <div className="card-artwork-wrapper">
                    <img src={track.coverUrl} alt={track.title} className="card-artwork-img" loading="lazy" />
                    <span className="card-rank-badge">#{index + 1}</span>
                    
                    <button 
                      className={`card-play-fab ${isThisPlaying ? 'is-playing' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackClick(track, displayInternational);
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
                      <span className="card-genre-pill">{track.genre || 'Pop'}</span>
                      <span className="card-plays-text">{track.plays || '3.5M'} plays</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Dynamic "Made For You" Recommendation Engine */}
        <section className="home-section made-for-you-section">
          <div className="section-header">
            <div>
              <div className="section-title-with-pill">
                <h2 className="section-title">Made For You</h2>
                <span className="personalized-pill">
                  <Sparkles size={12} color="#1db954" />
                  Live Taste Recommendation
                </span>
              </div>
              <p className="section-subtitle">
                Personalized tracks similar to what you listened to ? Dynamically updates to your taste
              </p>
            </div>
          </div>

          <div className="tracks-cards-row">
            {displayMadeForYou.map((track) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id}
                  className={`spotify-media-card recommendation-media-card ${currentTrack?.id === track.id ? 'is-active-media' : ''}`}
                  onClick={() => handleTrackClick(track, displayMadeForYou)}
                >
                  <div className="card-artwork-wrapper">
                    <img src={track.coverUrl} alt={track.title} className="card-artwork-img" loading="lazy" />
                    
                    <button 
                      className={`card-play-fab ${isThisPlaying ? 'is-playing' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrackClick(track, displayMadeForYou);
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
                    
                    {/* Dynamic Taste Similarity Badge */}
                    <div className="card-recommendation-tag" title={track.recommendationReason || "Matches your recent listening"}>
                      <Sparkles size={11} />
                      <span>{track.recommendationReason || "Matches your taste"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Curated Playlists & Mixes */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Your Playlists & Featured Mixes</h2>
              <p className="section-subtitle">Curated collections and community playlists</p>
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
      </div>
    </div>
  );
};
