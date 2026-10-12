import React from 'react';
import { Users, X, UserPlus, Play, Trash2, Radio } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const FriendsActivityPanel = () => {
  const { 
    friends, 
    isFriendsPanelOpen, 
    setIsFriendsPanelOpen, 
    playTrack, 
    tracks,
    setIsAddFriendOpen,
    removeFriend
  } = usePlayer();

  if (!isFriendsPanelOpen) return null;

  const handleListenAlong = (friend) => {
    if (friend.audioUrl) {
      playTrack({
        id: `friend-track-${friend.id}`,
        title: friend.track,
        artist: friend.artist,
        album: friend.album,
        duration: friend.duration || 210,
        durationFormatted: "3:30",
        coverUrl: friend.coverUrl || friend.avatar,
        audioUrl: friend.audioUrl,
        genre: 'Pop',
        accentColor: '#1db954',
        isFullSong: true,
        isLossless: true
      });
      return;
    }

    // Match with current catalog
    const match = tracks.find(t => 
      t.title.toLowerCase().includes(friend.track.toLowerCase().slice(0, 4))
    ) || tracks[0];
    playTrack(match);
  };

  return (
    <aside className="friends-activity-panel">
      {/* Panel Header */}
      <div className="friends-header">
        <div className="friends-header-title">
          <Users size={18} />
          <span>Friend Activity</span>
        </div>
        <div className="friends-header-actions">
          <button 
            className="friends-add-quick-btn"
            onClick={() => setIsAddFriendOpen(true)}
            title="Add a friend"
          >
            <UserPlus size={16} />
          </button>
          <button 
            className="friends-close-btn"
            onClick={() => setIsFriendsPanelOpen(false)}
            title="Close Friend Activity"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {friends.length > 0 ? (
        <>
          <div className="friends-live-notice">
            <Radio size={14} className="live-stream-icon" />
            <span>Live Real-Time Activity ({friends.length})</span>
          </div>

          <div className="friends-list">
            {friends.map((friend) => (
              <div key={friend.id} className="friend-activity-card">
                <div className="friend-avatar-wrapper">
                  <img src={friend.avatar} alt={friend.name} className="friend-avatar-img" />
                  {friend.isLive && <span className="friend-online-dot"></span>}
                </div>

                <div className="friend-info">
                  <div className="friend-name-row">
                    <span className="friend-name">{friend.name}</span>
                    <span className="friend-time">{friend.timeAgo || 'Listening now'}</span>
                  </div>

                  <div 
                    className="friend-track-title" 
                    title={`${friend.track} • Click to listen along`}
                    onClick={() => handleListenAlong(friend)}
                  >
                    {friend.track}
                  </div>

                  <div className="friend-artist-album">
                    {friend.artist} • {friend.album}
                  </div>

                  {friend.isLive && (
                    <div className="friend-live-bar-container">
                      <div 
                        className="friend-live-bar-fill"
                        style={{ width: `${friend.progressPercent || 25}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="friend-card-hover-actions">
                  <button 
                    className="friend-action-btn play"
                    onClick={() => handleListenAlong(friend)}
                    title="Listen along"
                  >
                    <Play size={13} fill="#000" color="#000" style={{ marginLeft: '1px' }} />
                  </button>
                  <button 
                    className="friend-action-btn remove"
                    onClick={() => removeFriend(friend.id)}
                    title="Remove friend"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="friends-footer-actions">
            <button 
              className="friends-add-more-btn"
              onClick={() => setIsAddFriendOpen(true)}
            >
              <UserPlus size={14} style={{ marginRight: '6px' }} />
              Add more friends
            </button>
          </div>
        </>
      ) : (
        /* Empty State: If no friends are added */
        <div className="friends-empty-container">
          <div className="friends-empty-icon-circle">
            <UserPlus size={32} color="#1db954" />
          </div>
          <h3 className="friends-empty-title">See what friends are playing</h3>
          <p className="friends-empty-desc">
            Connect with your real friends to see their live listening feeds, share whole songs, and tune into their sessions.
          </p>
          <button 
            className="friends-empty-add-btn"
            onClick={() => setIsAddFriendOpen(true)}
          >
            <UserPlus size={16} style={{ marginRight: '6px' }} />
            Add Friends
          </button>
          <div className="friends-empty-hint">
            <span>Tip: Open another browser tab to broadcast live playback between friends!</span>
          </div>
        </div>
      )}
    </aside>
  );
};
