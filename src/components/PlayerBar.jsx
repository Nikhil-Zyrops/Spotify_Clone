import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Heart, 
  Mic2, 
  ListMusic, 
  Laptop2, 
  Maximize2
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const PlayerBar = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    playNext, 
    playPrevious, 
    currentTime, 
    duration, 
    seekTo, 
    volume, 
    changeVolume, 
    isMuted, 
    toggleMute, 
    isShuffle, 
    toggleShuffle, 
    repeatMode, 
    toggleRepeat, 
    likedTrackIds, 
    toggleLikeTrack,
    currentView,
    navigateTo,
    setIsExpandedPlayerOpen,
    isDevicePickerOpen,
    setIsDevicePickerOpen,
    activeDevice,
    isLosslessMode
  } = usePlayer();

  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [hoverTime, setHoverTime] = useState(null);
  const progressBarRef = useRef(null);

  if (!currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekTo(ratio * duration);
  };

  const handleProgressMouseMove = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setHoverTime(ratio * duration);
  };

  const renderVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <footer className="spotify-player-bar">
      {/* Left: Track Details, Lossless Pill & Like */}
      <div className="player-track-info">
        <div 
          className="player-artwork-wrapper" 
          onClick={() => setIsExpandedPlayerOpen(true)}
          title="Click to expand full player with Spectrum Visualizer"
        >
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.title} 
            className={`player-artwork-img ${isPlaying ? 'playing-pulse' : ''}`}
          />
          <div className="artwork-overlay">
            <Maximize2 size={14} />
          </div>
        </div>

        <div className="player-metadata">
          <div className="player-track-title-row">
            <span className="player-track-title" title={currentTrack.title}>
              {currentTrack.title}
            </span>
            <span 
              className={`player-lossless-badge ${isLosslessMode ? 'active' : ''}`}
              title="24-bit / 96kHz Lossless Master Audio Stream Active"
            >
              LOSSLESS
            </span>
          </div>
          <div className="player-track-artist" title={currentTrack.artist}>
            {currentTrack.artist}
          </div>
        </div>

        <button 
          className={`player-like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => toggleLikeTrack(currentTrack.id)}
          title={isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
        >
          <Heart size={18} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "currentColor"} />
        </button>
      </div>

      {/* Center: Controls & Timeline */}
      <div className="player-center-controls">
        <div className="playback-buttons-row">
          {/* Shuffle */}
          <button 
            className={`control-btn ${isShuffle ? 'active-green' : ''}`}
            onClick={toggleShuffle}
            title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
          >
            <Shuffle size={18} />
            {isShuffle && <span className="active-dot"></span>}
          </button>

          {/* Previous */}
          <button 
            className="control-btn" 
            onClick={playPrevious}
            title="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play / Pause Primary Button */}
          <button 
            className="play-pause-circle-btn" 
            onClick={togglePlayPause}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="#000000" color="#000000" />
            ) : (
              <Play size={20} fill="#000000" color="#000000" style={{ marginLeft: '2px' }} />
            )}
          </button>

          {/* Next */}
          <button 
            className="control-btn" 
            onClick={playNext}
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button 
            className={`control-btn ${repeatMode !== 'off' ? 'active-green' : ''}`}
            onClick={toggleRepeat}
            title={`Repeat mode: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            {repeatMode !== 'off' && <span className="active-dot"></span>}
          </button>
        </div>

        {/* Timeline Progress Bar */}
        <div className="timeline-container">
          <span className="timestamp-text">{formatTime(currentTime)}</span>
          
          <div 
            className="progress-bar-rail"
            ref={progressBarRef}
            onClick={handleProgressClick}
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
            onMouseMove={handleProgressMouseMove}
          >
            <div 
              className={`progress-bar-fill ${isHoveringProgress ? 'hover' : ''}`}
              style={{ width: `${progressPercent}%` }}
            >
              <div className="progress-thumb-knob"></div>
            </div>
            {isHoveringProgress && hoverTime !== null && (
              <div 
                className="progress-hover-tooltip"
                style={{ left: `${(hoverTime / duration) * 100}%` }}
              >
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          <span className="timestamp-text">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extra Utilities */}
      <div className="player-right-utilities">
        {/* Lyrics */}
        <button 
          className={`utility-btn ${currentView === 'lyrics' ? 'active-green' : ''}`}
          onClick={() => navigateTo(currentView === 'lyrics' ? 'home' : 'lyrics')}
          title="Lyrics"
        >
          <Mic2 size={18} />
        </button>

        {/* Queue */}
        <button 
          className={`utility-btn ${currentView === 'queue' ? 'active-green' : ''}`}
          onClick={() => navigateTo(currentView === 'queue' ? 'home' : 'queue')}
          title="Queue"
        >
          <ListMusic size={18} />
        </button>

        {/* Device Picker */}
        <button 
          className={`utility-btn ${isDevicePickerOpen ? 'active-green' : ''}`}
          onClick={() => setIsDevicePickerOpen(prev => !prev)}
          title={`Connect to a device (Currently: ${activeDevice?.name})`}
        >
          <Laptop2 size={18} />
        </button>

        {/* Volume Slider Group */}
        <div className="volume-slider-group">
          <button 
            className="volume-icon-btn" 
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {renderVolumeIcon()}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="volume-range-input"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>

        {/* Expand Player Modal */}
        <button 
          className="utility-btn"
          onClick={() => setIsExpandedPlayerOpen(true)}
          title="Open Fullscreen Player"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </footer>
  );
};

