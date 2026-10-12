import React from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
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
import { SpotifyArchitectureModal } from './components/SpotifyArchitectureModal';
import { AddFriendModal } from './components/AddFriendModal';
import './App.css';

const MainLayout = () => {
  const { currentView } = usePlayer();

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
      <SpotifyArchitectureModal />
      <AddFriendModal />
    </div>
  );
};

export default function App() {
  return (
    <PlayerProvider>
      <MainLayout />
    </PlayerProvider>
  );
}
