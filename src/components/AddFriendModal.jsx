import React, { useState } from 'react';
import { X, UserPlus, Music, Sparkles, Check } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
];

const SONG_PRESETS = [
  { track: 'Starboy', artist: 'The Weeknd', album: 'Starboy', audioUrl: 'https://aac.saavncdn.com/820/5ddb9a79a5218f85ca9be0ebad158654_320.mp4' },
  { track: 'Espresso', artist: 'Sabrina Carpenter', album: 'Short n\' Sweet', audioUrl: 'https://aac.saavncdn.com/111/cf81f6eb5b6768fe2e1dd63cb53531fb_320.mp4' },
  { track: 'Believer', artist: 'Imagine Dragons', album: 'Evolve', audioUrl: 'https://aac.saavncdn.com/248/46944eb7b4b31f5b0abf5eb2e1be2d2a_320.mp4' },
  { track: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', audioUrl: 'https://aac.saavncdn.com/228/a4c61b868434d166db417ea18b2b64d0_320.mp4' }
];

export const AddFriendModal = () => {
  const { isAddFriendOpen, setIsAddFriendOpen, addFriend } = usePlayer();

  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [selectedSong, setSelectedSong] = useState(SONG_PRESETS[0]);
  const [customSong, setCustomSong] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const [isCustomSong, setIsCustomSong] = useState(false);

  if (!isAddFriendOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const trackTitle = isCustomSong ? (customSong.trim() || 'Favorite Track') : selectedSong.track;
    const artistName = isCustomSong ? (customArtist.trim() || 'Artist') : selectedSong.artist;
    const albumName = isCustomSong ? 'Single' : selectedSong.album;
    const audioUrl = isCustomSong ? '' : selectedSong.audioUrl;

    addFriend({
      name: name.trim(),
      avatar: selectedAvatar,
      track: trackTitle,
      artist: artistName,
      album: albumName,
      audioUrl: audioUrl
    });

    setName('');
    setCustomSong('');
    setCustomArtist('');
    setIsAddFriendOpen(false);
  };

  return (
    <div className="spotify-modal-backdrop" onClick={() => setIsAddFriendOpen(false)}>
      <div className="add-friend-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header-row">
          <div className="modal-title-with-icon">
            <UserPlus size={20} color="#1db954" />
            <h3>Add to Friend Activity</h3>
          </div>
          <button 
            className="modal-close-icon-btn"
            onClick={() => setIsAddFriendOpen(false)}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-friend-form">
          {/* Friend Name */}
          <div className="form-group">
            <label className="form-label">Friend's Name</label>
            <input 
              type="text" 
              placeholder="e.g. Sarah, Marcus, Liam..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-text-input"
              autoFocus
              required
            />
          </div>

          {/* Avatar Selector */}
          <div className="form-group">
            <label className="form-label">Choose Profile Picture</label>
            <div className="avatar-selection-grid">
              {PRESET_AVATARS.map((url, i) => (
                <div 
                  key={i} 
                  className={`avatar-choice-box ${selectedAvatar === url ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(url)}
                >
                  <img src={url} alt={`Avatar ${i + 1}`} className="avatar-choice-img" />
                  {selectedAvatar === url && (
                    <div className="avatar-check-overlay">
                      <Check size={14} color="#fff" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Jam */}
          <div className="form-group">
            <label className="form-label">What are they listening to?</label>
            <div className="song-preset-chips">
              {SONG_PRESETS.map((song, i) => (
                <button
                  type="button"
                  key={i}
                  className={`song-preset-pill ${!isCustomSong && selectedSong.track === song.track ? 'active' : ''}`}
                  onClick={() => {
                    setIsCustomSong(false);
                    setSelectedSong(song);
                  }}
                >
                  <Music size={12} style={{ marginRight: '4px' }} />
                  {song.track} • {song.artist}
                </button>
              ))}
              <button
                type="button"
                className={`song-preset-pill ${isCustomSong ? 'active' : ''}`}
                onClick={() => setIsCustomSong(true)}
              >
                <Sparkles size={12} style={{ marginRight: '4px' }} />
                Custom Song...
              </button>
            </div>

            {isCustomSong && (
              <div className="custom-song-inputs">
                <input 
                  type="text" 
                  placeholder="Song title (e.g. Birds of a Feather)"
                  value={customSong}
                  onChange={(e) => setCustomSong(e.target.value)}
                  className="modal-text-input small"
                  required={isCustomSong}
                />
                <input 
                  type="text" 
                  placeholder="Artist name (e.g. Billie Eilish)"
                  value={customArtist}
                  onChange={(e) => setCustomArtist(e.target.value)}
                  className="modal-text-input small"
                  required={isCustomSong}
                />
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="modal-actions-row">
            <button 
              type="button" 
              className="modal-secondary-btn"
              onClick={() => setIsAddFriendOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="modal-primary-btn"
              disabled={!name.trim()}
            >
              Add Friend
            </button>
          </div>
        </form>

        <div className="modal-footer-note">
          <p>Tip: You can also open this Spotify Clone in another tab to broadcast your live listening activity automatically!</p>
        </div>
      </div>
    </div>
  );
};
