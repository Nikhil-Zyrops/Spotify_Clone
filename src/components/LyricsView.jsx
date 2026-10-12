import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Mic2, Music } from 'lucide-react';

export const LyricsView = () => {
  const { currentTrack, currentTime, seekTo } = usePlayer();
  const activeLineRef = useRef(null);

  const lyrics = currentTrack?.lyrics || [];

  // Find the index of the active lyric line
  const activeIndex = lyrics.reduce((acc, line, idx) => {
    if (currentTime >= line.time) {
      return idx;
    }
    return acc;
  }, 0);

  // Smoothly scroll active lyric into view
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeIndex]);

  if (!currentTrack) return null;

  return (
    <div className="lyrics-view-container">
      {/* Dynamic Ambient Background with blur */}
      <div 
        className="lyrics-ambient-bg"
        style={{
          backgroundImage: `url(${currentTrack.coverUrl})`
        }}
      />
      <div className="lyrics-backdrop-overlay" />

      {/* Header Info */}
      <div className="lyrics-header-panel">
        <div className="lyrics-track-meta">
          <img src={currentTrack.coverUrl} alt={currentTrack.title} className="lyrics-header-thumb" />
          <div>
            <div className="lyrics-header-title">{currentTrack.title}</div>
            <div className="lyrics-header-artist">{currentTrack.artist}</div>
          </div>
        </div>
        <div className="lyrics-badge">
          <Mic2 size={16} />
          <span>Real-Time Synced Lyrics</span>
        </div>
      </div>

      {/* Lyrics Scrollable Lines */}
      <div className="lyrics-scroll-body">
        {lyrics.length > 0 ? (
          lyrics.map((line, index) => {
            const isActive = index === activeIndex;
            const isPassed = index < activeIndex;

            return (
              <div
                key={index}
                ref={isActive ? activeLineRef : null}
                className={`lyric-line ${isActive ? 'active-line' : ''} ${isPassed ? 'passed-line' : ''}`}
                onClick={() => seekTo(line.time)}
                title={`Click to jump to ${line.time}s`}
              >
                {line.text}
              </div>
            );
          })
        ) : (
          <div className="lyrics-empty-state">
            <Music size={48} />
            <h3>Instrumental track</h3>
            <p>Enjoy the sonic frequencies of {currentTrack.title}.</p>
          </div>
        )}
      </div>
    </div>
  );
};
