import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PlayerBar } from './components/PlayerBar';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { PlaylistView } from './components/PlaylistView';
import { LyricsView } from './components/LyricsView';
import { QueueView } from './components/QueueView';
import { FriendsActivityPanel } from './components/FriendsActivityPanel';
import { ExpandedPlayerModal } from './components/ExpandedPlayerModal';
import { DevicePickerModal } from './components/DevicePickerModal';
import { AddFriendModal } from './components/AddFriendModal';
import { Play, X } from 'lucide-react';
import './App.css';

const MainLayout = () => {
  const { currentView, resumeNotice, clearResumeNotice, togglePlayPause, isPlaying } = usePlayer();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'search':
        return <SearchView />;
      case 'playlist':
        return <PlaylistView />;
      case 'liked':
        return <PlaylistView isLikedView={true} />;
      case 'lyrics':
        return <LyricsView />;
      case 'queue':
        return <QueueView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="spotify-app-layout">
      {/* Resume Playback Floating Toast */}
      {resumeNotice && (
        <div className="resume-playback-toast">
          <div className="resume-toast-info">
            <span className="resume-pulse-dot"></span>
            <span>
              Resumed where you left off: <strong>{resumeNotice.track.title}</strong> by {resumeNotice.track.artist} ({Math.floor(resumeNotice.currentTime / 60)}:{Math.floor(resumeNotice.currentTime % 60).toString().padStart(2, '0')})
            </span>
          </div>
          <div className="resume-toast-actions">
            {!isPlaying && (
              <button className="resume-toast-play-btn" onClick={togglePlayPause}>
                <Play size={12} fill="#000" color="#000" style={{ marginLeft: '1px' }} />
                <span>Continue</span>
              </button>
            )}
            <button className="resume-toast-close-btn" onClick={clearResumeNotice} title="Dismiss">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Center Main Scrollable Panel */}
      <div className="spotify-main-panel">
        <Navbar />
        <main className="spotify-view-content">
          {renderCurrentView()}
        </main>
      </div>

      {/* Friends Activity Panel */}
      <FriendsActivityPanel />

      {/* Bottom Fixed Player Bar */}
      <PlayerBar />

      {/* Interactive Overlays & Modals */}
      <ExpandedPlayerModal />
      <DevicePickerModal />
      <AddFriendModal />
    </div>
  );
};

const AppRoot = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppRoot />
      </PlayerProvider>
    </AuthProvider>
  );
}
