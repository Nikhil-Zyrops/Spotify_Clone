import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Clock, 
  MoreHorizontal, 
  Music,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const PlaylistView = ({ isLikedView = false }) => {
  const { 
    viewParam, 
    playlists, 
    tracks, 
    likedTracks, 
    likedTrackIds, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    toggleLikeTrack,
    addTrackToPlaylist
  } = usePlayer();

  let playlist = null;
  let playlistTracks = [];

  if (isLikedView) {
    playlist = {
      id: 'liked-songs',
      title: 'Liked Songs',
      description: 'All your favorite songs stored safely in your personal Spotify library.',
      coverUrl: null, // Will use custom gradient heart
      owner: 'Nikhil',
      likes: `${likedTracks.length} tracks`,
      accentColor: '#4c1d95'
    };
    playlistTracks = likedTracks;
  } else {
    playlist = playlists.find(p => p.id === viewParam) || playlists[0];
    if (playlist) {
      playlistTracks = tracks.filter(t => playlist.trackIds?.includes(t.id));
    }
  }

  if (!playlist) return null;

  const isCurrentPlaylistPlaying = 
    isPlaying && playlistTracks.some(t => t.id === currentTrack?.id);

  const handlePlayPlaylist = () => {
    if (playlistTracks.length === 0) return;
    if (isCurrentPlaylistPlaying) {
      togglePlayPause();
    } else {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  const handleRowClick = (track) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track, playlistTracks);
    }
  };

  return (
    <div className="playlist-view-container">
      {/* Dynamic Ambient Hero Header */}
      <div 
        className="playlist-hero-header"
        style={{
          background: `linear-gradient(180deg, ${playlist.accentColor || '#1db954'}88 0%, rgba(18, 18, 18, 0.95) 100%)`
        }}
      >
        <div className="hero-artwork-box">
          {isLikedView ? (
            <div className="liked-hero-art">
              <Heart size={68} fill="#ffffff" color="#ffffff" />
            </div>
          ) : (
            <img 
              src={playlist.coverUrl} 
              alt={playlist.title} 
              className="hero-artwork-img" 
            />
          )}
        </div>

        <div className="hero-meta-details">
          <span className="hero-type-tag">Playlist</span>
          <h1 className="hero-title">{playlist.title}</h1>
          <p className="hero-description">{playlist.description}</p>
          <div className="hero-stats-row">
            <span className="hero-owner">{playlist.owner}</span>
            <span className="meta-bullet">•</span>
            <span>{playlistTracks.length} songs</span>
            <span className="meta-bullet">•</span>
            <span className="hero-likes-meta">{playlist.likes}</span>
          </div>
        </div>
      </div>

      {/* Playlist Actions Row */}
      <div className="playlist-actions-row">
        <button 
          className="playlist-primary-play-btn"
          onClick={handlePlayPlaylist}
          disabled={playlistTracks.length === 0}
          title={isCurrentPlaylistPlaying ? "Pause playlist" : "Play playlist"}
        >
          {isCurrentPlaylistPlaying ? (
            <Pause size={28} fill="#000000" color="#000000" />
          ) : (
            <Play size={28} fill="#000000" color="#000000" style={{ marginLeft: '4px' }} />
          )}
        </button>

        <button className="playlist-action-icon-btn" title="Save to library">
          <Heart size={28} />
        </button>

        <button className="playlist-action-icon-btn" title="More options">
          <MoreHorizontal size={28} />
        </button>
      </div>

      {/* Songs Table */}
      <div className="songs-table-container">
        <div className="songs-table-header">
          <div className="col-index">#</div>
          <div className="col-title">Title</div>
          <div className="col-album">Album</div>
          <div className="col-date">Date added</div>
          <div className="col-duration">
            <Clock size={16} />
          </div>
        </div>

        <div className="songs-table-body">
          {playlistTracks.length > 0 ? (
            playlistTracks.map((track, index) => {
              const isThisPlaying = currentTrack?.id === track.id && isPlaying;
              const isThisCurrent = currentTrack?.id === track.id;
              const isLiked = likedTrackIds.includes(track.id);

              return (
                <div 
                  key={track.id}
                  className={`song-table-row ${isThisCurrent ? 'is-active-row' : ''}`}
                  onClick={() => handleRowClick(track)}
                >
                  {/* # or Animated Equalizer */}
                  <div className="col-index">
                    {isThisPlaying ? (
                      <div className="playing-eq-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <span className="row-number-text">{index + 1}</span>
                    )}
                    <button 
                      className="row-play-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(track);
                      }}
                    >
                      {isThisPlaying ? (
                        <Pause size={14} fill="currentColor" />
                      ) : (
                        <Play size={14} fill="currentColor" style={{ marginLeft: '1px' }} />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist with Thumbnail */}
                  <div className="col-title song-title-cell">
                    <img src={track.coverUrl} alt={track.title} className="table-track-thumb" />
                    <div className="table-track-info">
                      <div className={`table-track-name ${isThisCurrent ? 'active-green-text' : ''}`}>
                        {track.title}
                      </div>
                      <div className="table-track-artist">{track.artist}</div>
                    </div>
                  </div>

                  {/* Album */}
                  <div className="col-album">{track.album}</div>

                  {/* Date */}
                  <div className="col-date">{track.releaseYear || '2024'}</div>

                  {/* Like Button & Duration */}
                  <div className="col-duration duration-cell">
                    <button 
                      className={`table-like-btn ${isLiked ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeTrack(track.id);
                      }}
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart size={16} fill={isLiked ? "#1db954" : "none"} color={isLiked ? "#1db954" : "currentColor"} />
                    </button>
                    <span className="table-duration-text">{track.durationFormatted}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-playlist-notice">
              <Music size={42} className="empty-playlist-icon" />
              <h3>This playlist is empty</h3>
              <p>Add songs from search or recommended tracks to build this playlist.</p>
              
              {/* Quick Add Section */}
              <div className="quick-add-section">
                <h4>Recommended to add:</h4>
                <div className="quick-add-list">
                  {tracks.slice(0, 4).map(t => (
                    <div key={t.id} className="quick-add-item">
                      <img src={t.coverUrl} alt={t.title} className="quick-add-thumb" />
                      <div className="quick-add-info">
                        <span className="quick-add-name">{t.title}</span>
                        <span className="quick-add-artist">{t.artist}</span>
                      </div>
                      <button 
                        className="quick-add-action-btn"
                        onClick={() => addTrackToPlaylist(playlist.id, t.id)}
                      >
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
