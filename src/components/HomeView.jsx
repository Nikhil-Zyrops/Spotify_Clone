import React from 'react';
import { Play, Pause } from 'lucide-react';
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
        {/* 1. Regional Trending Section */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {userRegion?.headline || `Trending in ${userRegion?.countryName || 'India'}`}
              </h2>
              <p className="section-subtitle">
                {userRegion?.subtitle || 'Popular songs streaming in your location right now'}
              </p>
            </div>
            <button className="section-show-all-btn" onClick={() => navigateTo('playlist', 'playlist-top-hits')}>
              Show all
            </button>
          </div>

          <div className="tracks-cards-row">
            {displayRegional.map((track) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id}
                  className={`spotify-media-card ${currentTrack?.id === track.id ? 'is-active-media' : ''}`}
                  onClick={() => handleTrackClick(track, displayRegional)}
                >
                  <div className="card-artwork-wrapper">
                    <img src={track.coverUrl} alt={track.title} className="card-artwork-img" loading="lazy" />
                    
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
              <h2 className="section-title">International Hits</h2>
              <p className="section-subtitle">
                The biggest chartbusters streaming worldwide
              </p>
            </div>
            <button className="section-show-all-btn" onClick={() => navigateTo('playlist', 'playlist-top-hits')}>
              Show all
            </button>
          </div>

          <div className="tracks-cards-row">
            {displayInternational.map((track) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id}
                  className={`spotify-media-card ${currentTrack?.id === track.id ? 'is-active-media' : ''}`}
                  onClick={() => handleTrackClick(track, displayInternational)}
                >
                  <div className="card-artwork-wrapper">
                    <img src={track.coverUrl} alt={track.title} className="card-artwork-img" loading="lazy" />
                    
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
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Clean "Made For You" Section */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Made For You</h2>
              <p className="section-subtitle">
                Recommendations inspired by your recent listening
              </p>
            </div>
          </div>

          <div className="tracks-cards-row">
            {displayMadeForYou.map((track) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;

              return (
                <div 
                  key={track.id}
                  className={`spotify-media-card ${currentTrack?.id === track.id ? 'is-active-media' : ''}`}
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
                    <div className="card-description">
                      {track.recommendationReason ? (
                        <span className="clean-rec-reason">{track.recommendationReason}</span>
                      ) : (
                        track.artist
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Curated Playlists */}
        <section className="home-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Your Playlists</h2>
              <p className="section-subtitle">Curated collections for every mood</p>
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
