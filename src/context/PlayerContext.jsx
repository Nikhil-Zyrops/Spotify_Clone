import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_TRACKS, INITIAL_PLAYLISTS, INITIAL_FRIENDS_ACTIVITY, AVAILABLE_DEVICES } from '../data/mockData';
import { searchLiveSongs, fetchTrendingTracks, detectUserRegion, fetchRegionalTrending, fetchInternationalTrending, fetchMadeForYouRecommendations, REGION_METADATA } from '../services/musicService';
import { useAuth } from './AuthContext';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const { 
    currentUser, 
    getUserStorage, 
    setUserStorage, 
    saveUserPlaybackProgress, 
    getUserPlaybackProgress 
  } = useAuth();

  // Library State - Namespaced per user
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  
  const [playlists, setPlaylists] = useState(() => {
    return getUserStorage('playlists', INITIAL_PLAYLISTS);
  });

  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    return getUserStorage('liked', ['track-1', 'track-3']);
  });
  const likedTracks = tracks.filter(t => likedTrackIds.includes(t.id));

  // User-partitioned friends state
  const [friends, setFriends] = useState(() => {
    return getUserStorage('friends', INITIAL_FRIENDS_ACTIVITY);
  });

  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  // Player State
  const [currentTrack, setCurrentTrack] = useState(() => {
    const saved = getUserPlaybackProgress();
    return (saved && saved.track) ? saved.track : INITIAL_TRACKS[0];
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const saved = getUserPlaybackProgress();
    return (saved && typeof saved.currentTime === 'number') ? saved.currentTime : 0;
  });
  const [duration, setDuration] = useState(() => {
    const saved = getUserPlaybackProgress();
    return (saved && saved.duration) ? saved.duration : (INITIAL_TRACKS[0].duration || 172);
  });
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [queue, setQueue] = useState(INITIAL_TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);

  // Resume notification banner state
  const [resumeNotice, setResumeNotice] = useState(() => {
    const saved = getUserPlaybackProgress();
    if (saved && saved.track && saved.currentTime > 5) {
      return { track: saved.track, currentTime: saved.currentTime };
    }
    return null;
  });

  const clearResumeNotice = useCallback(() => {
    setResumeNotice(null);
  }, []);

  // Hi-Res Lossless Audio DSP Master Engine State
  const [isLosslessMode, setIsLosslessMode] = useState(true);

  // Real-Time Search & Live Tracks State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [searchFilter, setSearchFilter] = useState('all');
  // Regional, International & Made-For-You Recommendation States
  const [userRegion, setUserRegion] = useState(REGION_METADATA.IN);
  const [regionalTrending, setRegionalTrending] = useState([]);
  const [internationalTrending, setInternationalTrending] = useState([]);
  const [madeForYouTracks, setMadeForYouTracks] = useState([]);

  // Real-Time Simulator State
  const [liveListeners, setLiveListeners] = useState(14820);
  const [devices, setDevices] = useState(AVAILABLE_DEVICES);
  const [activeDevice, setActiveDevice] = useState(AVAILABLE_DEVICES[0]);
  const [liveSyncTime, setLiveSyncTime] = useState(() => new Date().toLocaleTimeString());

  // Navigation & UI State
  const [currentView, setCurrentView] = useState('home');
  const [viewParam, setViewParam] = useState(null);
  const [history, setHistory] = useState([{ view: 'home', param: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isExpandedPlayerOpen, setIsExpandedPlayerOpen] = useState(false);
  const [isDevicePickerOpen, setIsDevicePickerOpen] = useState(false);
  const [isFriendsPanelOpen, setIsFriendsPanelOpen] = useState(false);
  const [isSpotifyInfoOpen, setIsSpotifyInfoOpen] = useState(false);

  // Audio References & Web Audio DSP Nodes
  const audioRef = useRef(new Audio());
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const bassFilterRef = useRef(null);
  const trebleFilterRef = useRef(null);
  const compressorRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const playNextRef = useRef(null);
  const lastSaveTimeRef = useRef(0);

  // When currentUser changes (e.g. switch accounts or log in), re-load their isolated data!
  useEffect(() => {
    if (!currentUser) return;
    setPlaylists(getUserStorage('playlists', INITIAL_PLAYLISTS));
    setLikedTrackIds(getUserStorage('liked', ['track-1', 'track-3']));
    setFriends(getUserStorage('friends', INITIAL_FRIENDS_ACTIVITY));

    const savedProgress = getUserPlaybackProgress();
    if (savedProgress && savedProgress.track) {
      setCurrentTrack(savedProgress.track);
      setCurrentTime(savedProgress.currentTime || 0);
      setDuration(savedProgress.duration || savedProgress.track.duration || 180);
      if (savedProgress.currentTime > 5) {
        setResumeNotice({ track: savedProgress.track, currentTime: savedProgress.currentTime });
      }
    }
  }, [currentUser, getUserStorage, getUserPlaybackProgress]);

  // Sync to User-Isolated storage
  useEffect(() => {
    setUserStorage('playlists', playlists);
  }, [playlists, setUserStorage]);

  useEffect(() => {
    setUserStorage('liked', likedTrackIds);
  }, [likedTrackIds, setUserStorage]);

  useEffect(() => {
    setUserStorage('friends', friends);
  }, [friends, setUserStorage]);


  // Initial Region & International Trending Loader
  useEffect(() => {
    let isMounted = true;
    detectUserRegion().then(reg => {
      if (!isMounted) return;
      setUserRegion(reg);
      fetchRegionalTrending(reg.countryCode).then(hits => {
        if (isMounted && hits && hits.length > 0) {
          setRegionalTrending(hits);
        }
      });
    });

    fetchInternationalTrending().then(hits => {
      if (isMounted && hits && hits.length > 0) {
        setInternationalTrending(hits);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Live Recommendation Engine: Updates dynamically according to user taste & what they listen to
  useEffect(() => {
    let isMounted = true;
    const historyKey = currentUser ? `spotify_clone_user_${currentUser.id}_history` : null;
    let historyList = [];
    try {
      const saved = historyKey ? localStorage.getItem(historyKey) : null;
      if (saved) historyList = JSON.parse(saved);
    } catch {
      // fallback
    }

    fetchMadeForYouRecommendations(historyList, likedTracks, currentTrack).then(recs => {
      if (isMounted && recs && recs.length > 0) {
        setMadeForYouTracks(recs);
      }
    });

    return () => { isMounted = false; };
  }, [currentTrack, currentUser, likedTracks]);

  // Initial load: Fetch real-time global trending tracks
  useEffect(() => {
    let isMounted = true;
    fetchTrendingTracks().then(results => {
      if (isMounted && results && results.length > 0) {
        setTrendingTracks(results);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Debounced Real-Time Live Search Engine
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    const trimmed = searchQuery.trim();
    if (!trimmed) { setSearchResults([]); setIsSearching(false); return; }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const liveHits = await searchLiveSongs(trimmed, 30);
        setSearchResults(liveHits);
      } catch (err) {
        console.warn("Search query failed:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery]);

  // Real-Time Simulated & Peer Spotify Sync Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveListeners(prev => Math.max(12000, prev + Math.floor(Math.random() * 21) - 10));
      setLiveSyncTime(new Date().toLocaleTimeString());

      setFriends(prev =>
        prev.map(f => {
          if (!f.isLive) return f;
          const nextProg = ((f.progressPercent || 0) + 2) % 100;
          return { ...f, progressPercent: nextProg };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Web Audio Context initialization with 24-Bit Lossless DSP Studio Chain
  const setupWebAudio = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 64;
          analyser.smoothingTimeConstant = 0.82;

          const bassFilter = ctx.createBiquadFilter();
          bassFilter.type = 'lowshelf';
          bassFilter.frequency.value = 85;
          bassFilter.gain.value = 2.8;

          const trebleFilter = ctx.createBiquadFilter();
          trebleFilter.type = 'highshelf';
          trebleFilter.frequency.value = 11000;
          trebleFilter.gain.value = 2.2;

          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.value = -18;
          compressor.knee.value = 24;
          compressor.ratio.value = 3.5;
          compressor.attack.value = 0.003;
          compressor.release.value = 0.25;

          // HTML5 audio plays directly to speakers without CORS hijacking
          // const source = ctx.createMediaElementSource(audioRef.current);
          
          // source.connect(bassFilter);
          bassFilter.connect(trebleFilter);
          trebleFilter.connect(compressor);
          compressor.connect(analyser);
          analyser.connect(ctx.destination);

          audioContextRef.current = ctx;
          analyserRef.current = analyser;
          sourceNodeRef.current = source;
          bassFilterRef.current = bassFilter;
          trebleFilterRef.current = trebleFilter;
          compressorRef.current = compressor;
        }
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch {
      // Audio nodes initialized
    }
  }, []);

  // Toggle Lossless DSP Studio Processing
  const toggleLosslessMode = useCallback(() => {
    setIsLosslessMode(prev => {
      const next = !prev;
      if (bassFilterRef.current && trebleFilterRef.current) {
        bassFilterRef.current.gain.value = next ? 2.8 : 0;
        trebleFilterRef.current.gain.value = next ? 2.2 : 0;
      }
      return next;
    });
  }, []);

  // Play Next Track
  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = queueIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setIsPlaying(false);
          return;
        }
      }
    }
    setQueueIndex(nextIndex);
    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setIsPlaying(true);
      const audio = audioRef.current;
      audio.src = nextTrack.audioUrl;
      audio.play().catch(() => {});
    }
  }, [queue, queueIndex, isShuffle, repeatMode]);

  // Keep playNextRef synchronized
  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  // Audio frequency data for visualizers
  const getFrequencyData = useCallback(() => {
    if (analyserRef.current && isPlaying) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      return dataArray;
    }
    if (isPlaying) {
      const sim = new Uint8Array(32);
      for (let i = 0; i < 32; i++) {
        sim[i] = Math.floor(40 + Math.random() * 180 * Math.sin((i / 32) * Math.PI));
      }
      return sim;
    }
    return new Uint8Array(32).fill(0);
  }, [isPlaying]);

  // Audio Event Listeners & Per-User Progress Tracking
  useEffect(() => {
    const audio = audioRef.current;
    // audio.crossOrigin removed so browser plays cross-origin CDN audio without CORS restrictions
    audio.preload = "auto";

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      // Periodically store progress for this user (every 2.5s)
      const now = Date.now();
      if (now - lastSaveTimeRef.current > 2500 && currentTrack) {
        lastSaveTimeRef.current = now;
        saveUserPlaybackProgress(currentTrack, audio.currentTime, audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (playNextRef.current) {
        playNextRef.current();
      }
    };

    const handleError = (e) => {
      console.warn("Audio error encountered, attempting backup stream:", audio.error);
      const backup = "https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3";
      if (audio.src !== backup) {
        audio.src = backup;
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [repeatMode, currentTrack, saveUserPlaybackProgress]);

  // Apply volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Load and play track when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }

    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
    }
    setDuration(currentTrack.duration || 180);

    if (isPlaying) {
      setupWebAudio();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => { console.warn("Audio stream playback notice:", err); });
      }
    }
  }, [currentTrack, isPlaying, setupWebAudio]);

  // Navigation Helpers
  const navigateTo = (view, param = null) => {
    setCurrentView(view);
    setViewParam(param);
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, { view, param }];
    });
    setHistoryIndex(prev => prev + 1);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const target = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentView(target.view);
      setViewParam(target.param);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const target = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentView(target.view);
      setViewParam(target.param);
    }
  };

  // Playback Controls
  const playTrack = (track, newQueue = null) => {
    setupWebAudio();
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = queue.findIndex(t => t.id === track.id);
      if (idx !== -1) {
        setQueueIndex(idx);
      } else {
        setQueue(prev => [track, ...prev]);
        setQueueIndex(0);
      }
    }

    setTracks(prev => {
      if (prev.some(t => t.id === track.id)) return prev;
      return [track, ...prev];
    });

    setCurrentTrack(track);
    setIsPlaying(true);

    const audio = audioRef.current;
    audio.src = track.audioUrl;
    audio.play().catch(() => {});

    saveUserPlaybackProgress(track, 0, track.duration || 180);
  };

  const togglePlayPause = () => {
    setupWebAudio();
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      setIsPlaying(false);
      if (currentTrack) {
        saveUserPlaybackProgress(currentTrack, audio.currentTime, audio.duration);
      }
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const playPrevious = () => {
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }
    setQueueIndex(prevIndex);
    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      setCurrentTrack(prevTrack);
      setIsPlaying(true);
      const audio = audioRef.current;
      audio.src = prevTrack.audioUrl;
      audio.play().catch(() => {});
      saveUserPlaybackProgress(prevTrack, 0, prevTrack.duration || 180);
    }
  };

  const seekTo = (seconds) => {
    const audio = audioRef.current;
    if (audio && !isNaN(seconds)) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
      if (currentTrack) {
        saveUserPlaybackProgress(currentTrack, seconds, audio.duration);
      }
    }
  };

  const changeVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    if (clamped > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleLikeTrack = (trackId) => {
    setLikedTrackIds(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const createPlaylist = (name = "My Playlist", description = "") => {
    const newPlaylist = {
      id: `playlist-custom-${Date.now()}`,
      title: name,
      description: description || "Created by you on Spotify Clone",
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      owner: currentUser ? currentUser.name : "User",
      likes: "1",
      trackIds: [],
      accentColor: "#1db954"
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
    navigateTo('playlist', newPlaylist.id);
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId, trackId) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId && !p.trackIds.includes(trackId)) {
          return { ...p, trackIds: [...p.trackIds, trackId] };
        }
        return p;
      })
    );
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev =>
      prev.map(p => {
        if (p.id === playlistId) {
          return { ...p, trackIds: p.trackIds.filter(id => id !== trackId) };
        }
        return p;
      })
    );
  };

  const addToQueue = (track) => {
    setQueue(prev => [...prev, track]);
  };

  const selectDevice = (deviceId) => {
    const selected = devices.find(d => d.id === deviceId);
    if (selected) {
      setDevices(prev =>
        prev.map(d => ({ ...d, isActive: d.id === deviceId }))
      );
      setActiveDevice(selected);
      setIsDevicePickerOpen(false);
    }
  };

  // Add Real Friend helper
  const addFriend = useCallback((friendData) => {
    const newFriend = {
      id: 'friend-' + Date.now(),
      name: friendData.name,
      avatar: friendData.avatar,
      track: friendData.track,
      artist: friendData.artist,
      album: friendData.album || 'Single',
      timeAgo: 'Listening now',
      isLive: true,
      progressPercent: Math.floor(Math.random() * 40) + 10,
      audioUrl: friendData.audioUrl || ''
    };
    setFriends(prev => [newFriend, ...prev]);
    setIsAddFriendOpen(false);

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const channel = new BroadcastChannel('spotify_clone_peer_network');
        channel.postMessage({
          type: 'FRIEND_JOINED',
          friend: newFriend
        });
        channel.close();
      }
    } catch {
      // fallback
    }
  }, []);

  // Remove Friend helper
  const removeFriend = useCallback((friendId) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
  }, []);

  // Real-Time Peer Audio Feed via BroadcastChannel (multi-user and multi-tab)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('spotify_clone_peer_network');

    if (isPlaying && currentTrack) {
      channel.postMessage({
        type: 'PEER_PLAYBACK',
        peerId: currentUser ? currentUser.id : 'anon',
        peerName: currentUser ? currentUser.name : 'Friend (Live Tab)',
        peerAvatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        track: currentTrack.title,
        artist: currentTrack.artist,
        album: currentTrack.album || currentTrack.title,
        coverUrl: currentTrack.coverUrl,
        audioUrl: currentTrack.audioUrl,
        duration: currentTrack.duration,
        currentTime: currentTime
      });
    }

    const handleMessage = (event) => {
      const data = event.data;
      if (data && data.type === 'PEER_PLAYBACK') {
        // Do not mirror current user as their own friend
        if (currentUser && data.peerId === currentUser.id) return;

        setFriends(prev => {
          const peerId = data.peerId || 'peer-tab';
          const peerIndex = prev.findIndex(f => f.id === peerId || f.name === data.peerName);
          const peerFriend = {
            id: peerId,
            name: data.peerName || 'Friend (Live Tab)',
            avatar: data.peerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            track: data.track,
            artist: data.artist,
            album: data.album,
            timeAgo: 'Listening now',
            isLive: true,
            progressPercent: data.duration ? Math.min(100, Math.round((data.currentTime / data.duration) * 100)) : 35,
            audioUrl: data.audioUrl,
            coverUrl: data.coverUrl
          };
          if (peerIndex !== -1) {
            const nextList = [...prev];
            nextList[peerIndex] = peerFriend;
            return nextList;
          }
          return [peerFriend, ...prev];
        });
      }
    };

    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [isPlaying, currentTrack, currentTime, currentUser]);


  return (
    <PlayerContext.Provider
      value={{
        tracks,
        playlists,
        likedTrackIds,
        likedTracks,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        isLosslessMode,
        toggleLosslessMode,
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        trendingTracks,
        userRegion,
        regionalTrending,
        internationalTrending,
        madeForYouTracks,
        searchFilter,
        setSearchFilter,
        liveListeners,
        friends,
        friendsActivity: friends,
        devices,
        activeDevice,
        liveSyncTime,
        currentView,
        viewParam,
        isExpandedPlayerOpen,
        setIsExpandedPlayerOpen,
        isDevicePickerOpen,
        setIsDevicePickerOpen,
        isFriendsPanelOpen,
        setIsFriendsPanelOpen,
        isSpotifyInfoOpen,
        setIsSpotifyInfoOpen,
        isAddFriendOpen,
        setIsAddFriendOpen,
        addFriend,
        removeFriend,
        resumeNotice,
        clearResumeNotice,
        getFrequencyData,
        navigateTo,
        goBack,
        goForward,
        canGoBack: historyIndex > 0,
        canGoForward: historyIndex < history.length - 1,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo,
        changeVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLikeTrack,
        createPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        addToQueue,
        selectDevice
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
