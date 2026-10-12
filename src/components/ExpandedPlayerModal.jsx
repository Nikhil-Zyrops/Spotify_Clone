import React, { useEffect, useRef } from 'react';
import { 
  Minimize2, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Heart, 
  Mic2,
  Disc3
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const ExpandedPlayerModal = () => {
  const { 
    isExpandedPlayerOpen, 
    setIsExpandedPlayerOpen, 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    playNext, 
    playPrevious, 
    currentTime, 
    duration, 
    seekTo, 
    isShuffle, 
    toggleShuffle, 
    repeatMode, 
    toggleRepeat, 
    likedTrackIds, 
    toggleLikeTrack,
    getFrequencyData,
    navigateTo
  } = usePlayer();

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Live Canvas Audio Visualizer
  useEffect(() => {
    if (!isExpandedPlayerOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      const freqData = getFrequencyData();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = freqData.length;
      const barWidth = (width / barCount) - 3;

      for (let i = 0; i < barCount; i++) {
        const val = freqData[i] || 0;
        const percent = val / 255;
        const barHeight = Math.max(4, percent * height);

        const x = i * (barWidth + 3);
        const y = height - barHeight;

        // Gradient color from Spotify Green to Cyan/Purple
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#1db954');
        gradient.addColorStop(0.6, '#10b981');
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isExpandedPlayerOpen, getFrequencyData]);

  if (!isExpandedPlayerOpen || !currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="expanded-modal-fullscreen">
      {/* Blurred Album Backdrop */}
      <div 
        className="expanded-modal-bg"
        style={{
          backgroundImage: `url(${currentTrack.coverUrl})`
        }}
      />
      <div className="expanded-modal-gradient-overlay" />

      {/* Top Header Bar */}
      <div className="expanded-top-bar">
        <div className="expanded-header-left">
          <Disc3 size={24} className={`spinning-disc-icon ${isPlaying ? 'spin' : ''}`} />
          <div>
            <span className="expanded-play-from-text">PLAYING FROM PLAYLIST</span>
            <span className="expanded-album-name">{currentTrack.album}</span>
          </div>
        </div>

        <button 
          className="expanded-minimize-btn"
          onClick={() => setIsExpandedPlayerOpen(false)}
          title="Minimize player"
        >
          <Minimize2 size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="expanded-content-grid">
        {/* Left: Giant Album Art & Glow */}
        <div className="expanded-art-column">
          <div className="expanded-art-frame">
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className={`expanded-large-artwork ${isPlaying ? 'artwork-breathing' : ''}`}
            />
          </div>

          {/* Real-Time Live Visualizer Canvas */}
          <div className="expanded-visualizer-container">
            <div className="visualizer-header">
              <span className="live-eq-dot"></span>
              <span>LIVE FREQUENCY SPECTRUM (WEB AUDIO API)</span>
            </div>
            <canvas ref={canvasRef} width={480} height={70} className="visualizer-canvas" />
          </div>
        </div>

        {/* Right: Meta & Large Controls */}
        <div className="expanded-controls-column">
          <div className="expanded-meta-block">
            <div className="expanded-title-row">
              <div>
                <h1 className="expanded-track-title">{currentTrack.title}</h1>
                <h2 className="expanded-track-artist">{currentTrack.artist}</h2>
              </div>
              <button 
                className={`expanded-like-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => toggleLikeTrack(currentTrack.id)}
              >
                <Heart size={32} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "#ffffff"} />
              </button>
            </div>

            <div className="expanded-badges-row">
              <span className="expanded-badge">{currentTrack.genre}</span>
              <span className="expanded-badge">{currentTrack.plays} plays</span>
              <span className="expanded-badge">Released {currentTrack.releaseYear || '2024'}</span>
            </div>
          </div>

          {/* Timeline Scrubber */}
          <div className="expanded-timeline-wrapper">
            <div 
              className="expanded-timeline-rail"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                seekTo(ratio * duration);
              }}
            >
              <div 
                className="expanded-timeline-fill"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="expanded-timeline-thumb"></div>
              </div>
            </div>
            <div className="expanded-timeline-timestamps">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Expanded Playback Buttons */}
          <div className="expanded-buttons-row">
            <button 
              className={`expanded-ctrl-btn ${isShuffle ? 'active-green' : ''}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={24} />
            </button>

            <button 
              className="expanded-ctrl-btn"
              onClick={playPrevious}
              title="Previous"
            >
              <SkipBack size={28} fill="currentColor" />
            </button>

            <button 
              className="expanded-play-circle"
              onClick={togglePlayPause}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={32} fill="#000" color="#000" />
              ) : (
                <Play size={32} fill="#000" color="#000" style={{ marginLeft: '4px' }} />
              )}
            </button>

            <button 
              className="expanded-ctrl-btn"
              onClick={playNext}
              title="Next"
            >
              <SkipForward size={28} fill="currentColor" />
            </button>

            <button 
              className={`expanded-ctrl-btn ${repeatMode !== 'off' ? 'active-green' : ''}`}
              onClick={toggleRepeat}
              title="Repeat"
            >
              <Repeat size={24} />
            </button>
          </div>

          {/* Lyrics Shortcut Box */}
          <div 
            className="expanded-lyrics-teaser"
            onClick={() => {
              setIsExpandedPlayerOpen(false);
              navigateTo('lyrics');
            }}
          >
            <div className="teaser-top">
              <Mic2 size={18} />
              <span>Synced Lyrics Available</span>
            </div>
            <div className="teaser-lyric-preview">
              "{currentTrack.lyrics?.[0]?.text || 'Tap to view line-by-line scrolling lyrics'}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
