import React from 'react';
import { Play, Pause, Heart, ListMusic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const QueueView = () => {
  const { 
    currentTrack, 
    queue, 
    queueIndex, 
    playTrack, 
    togglePlayPause, 
    isPlaying, 
    likedTrackIds, 
    toggleLikeTrack 
  } = usePlayer();

  const nextTracks = queue.slice(queueIndex + 1);

  return (
    <div className="queue-view-container">
      <div className="queue-header-row">
        <h1 className="queue-main-title">Play Queue</h1>
      </div>

      {/* Now Playing Block */}
      <section className="queue-section">
        <h2 className="queue-section-heading">Now playing</h2>
        {currentTrack && (
          <div className="queue-track-card is-current">
            <div className="queue-thumb-box">
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="queue-thumb" />
              <button className="queue-play-btn" onClick={togglePlayPause}>
                {isPlaying ? <Pause size={18} fill="#000" /> : <Play size={18} fill="#000" />}
              </button>
            </div>

            <div className="queue-info">
              <div className="queue-title-green">{currentTrack.title}</div>
              <div className="queue-artist">{currentTrack.artist} • {currentTrack.album}</div>
            </div>

            <div className="queue-eq-badge">
              {isPlaying && (
                <div className="mini-equalizer">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>

            <button 
              className="queue-like-btn"
              onClick={() => toggleLikeTrack(currentTrack.id)}
            >
              <Heart 
                size={18} 
                fill={likedTrackIds.includes(currentTrack.id) ? "#1db954" : "none"} 
                color={likedTrackIds.includes(currentTrack.id) ? "#1db954" : "currentColor"} 
              />
            </button>

            <span className="queue-duration">{currentTrack.durationFormatted}</span>
          </div>
        )}
      </section>

      {/* Next In Queue */}
      <section className="queue-section">
        <h2 className="queue-section-heading">Next up ({nextTracks.length})</h2>
        {nextTracks.length > 0 ? (
          <div className="queue-list">
            {nextTracks.map((track, idx) => (
              <div 
                key={`${track.id}-${idx}`}
                className="queue-track-card"
                onClick={() => playTrack(track, queue)}
              >
                <span className="queue-index-num">{idx + 1}</span>
                <div className="queue-thumb-box">
                  <img src={track.coverUrl} alt={track.title} className="queue-thumb" />
                  <button className="queue-play-btn">
                    <Play size={16} fill="#000" />
                  </button>
                </div>

                <div className="queue-info">
                  <div className="queue-title">{track.title}</div>
                  <div className="queue-artist">{track.artist}</div>
                </div>

                <button 
                  className="queue-like-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLikeTrack(track.id);
                  }}
                >
                  <Heart 
                    size={16} 
                    fill={likedTrackIds.includes(track.id) ? "#1db954" : "none"} 
                    color={likedTrackIds.includes(track.id) ? "#1db954" : "currentColor"} 
                  />
                </button>

                <span className="queue-duration">{track.durationFormatted}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="queue-empty-box">
            <ListMusic size={36} />
            <p>Your queue is empty. Choose tracks to play next.</p>
          </div>
        )}
      </section>
    </div>
  );
};
