import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Radio, 
  Cpu, 
  Server, 
  Layers, 
  Activity, 
  Key, 
  Database,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const SpotifyArchitectureModal = () => {
  const { isSpotifyInfoOpen, setIsSpotifyInfoOpen, liveSyncTime, liveListeners } = usePlayer();
  const [activeTab, setActiveTab] = useState('overview');
  const [spotifyClientId, setSpotifyClientId] = useState('');
  const [apiStatus, setApiStatus] = useState('Idle');

  if (!isSpotifyInfoOpen) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={() => setIsSpotifyInfoOpen(false)}>
      <div className="architecture-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="arch-modal-header">
          <div className="arch-title-group">
            <div className="arch-badge-sparkle">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="arch-main-title">How Spotify Works Internally</h2>
              <p className="arch-sub-title">System Architecture, Real-Time Sync & Audio Streaming Pipeline</p>
            </div>
          </div>
          <button 
            className="modal-close-icon-btn"
            onClick={() => setIsSpotifyInfoOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="arch-tabs-nav">
          <button 
            className={`arch-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={16} /> Overview
          </button>
          <button 
            className={`arch-tab-btn ${activeTab === 'streaming' ? 'active' : ''}`}
            onClick={() => setActiveTab('streaming')}
          >
            <Radio size={16} /> Audio Pipeline
          </button>
          <button 
            className={`arch-tab-btn ${activeTab === 'realtime' ? 'active' : ''}`}
            onClick={() => setActiveTab('realtime')}
          >
            <Activity size={16} /> Real-Time Sync
          </button>
          <button 
            className={`arch-tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <Cpu size={16} /> AI & BaRT Engine
          </button>
          <button 
            className={`arch-tab-btn ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            <Key size={16} /> Web API & SDK
          </button>
        </div>

        {/* Tab Body */}
        <div className="arch-tabs-content">
          {activeTab === 'overview' && (
            <div className="arch-section-body">
              <div className="arch-highlight-grid">
                <div className="arch-highlight-card">
                  <Server className="arch-card-icon" size={24} />
                  <h4>Microservices Mesh</h4>
                  <p>Over 1,200 microservices communicating via gRPC and Apache Kafka for event-driven telemetry and catalog operations.</p>
                </div>

                <div className="arch-highlight-card">
                  <Activity className="arch-card-icon" size={24} />
                  <h4>Hermes / Mercury Protocol</h4>
                  <p>Spotify's proprietary bidirectional messaging protocol over WebSockets that manages instant playback syncing across devices.</p>
                </div>

                <div className="arch-highlight-card">
                  <Database className="arch-card-icon" size={24} />
                  <h4>Storage & Caching</h4>
                  <p>Google Cloud Bigtable, Cassandra, and multi-tier Edge CDNs caching 100M+ master audio tracks closer to users.</p>
                </div>

                <div className="arch-highlight-card">
                  <Cpu className="arch-card-icon" size={24} />
                  <h4>BaRT (Bandits as Treatments)</h4>
                  <p>Reinforcement learning combining collaborative filtering, raw audio spectrogram analysis, and NLP to curate Discover Weekly.</p>
                </div>
              </div>

              <div className="arch-diagram-box">
                <h4>Spotify High-Level Architectural Flow:</h4>
                <div className="arch-flow-diagram">
                  <div className="diagram-node">Client App (Web / Desktop / Mobile)</div>
                  <div className="diagram-arrow">⇄ (Hermes WS & HTTPS)</div>
                  <div className="diagram-node">API Gateway / Edge Router (Envoy)</div>
                  <div className="diagram-arrow">⇄</div>
                  <div className="diagram-node">Kafka Bus & Microservices Mesh</div>
                  <div className="diagram-arrow">⇄</div>
                  <div className="diagram-node">CDN Storage (Ogg/AAC Chunks)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'streaming' && (
            <div className="arch-section-body">
              <h3>Audio Pipeline & Zero-Latency Chunking</h3>
              <p>
                Spotify achieves near-instant song playback through a combination of smart audio encoding, HTTP 206 partial content streaming, and predictive pre-buffering:
              </p>
              
              <ul className="arch-feature-list">
                <li>
                  <strong>Audio Formats & Bitrates:</strong>
                  <span> Desktop and Android stream Ogg Vorbis (96, 160, 320 kbps). iOS and Web Players stream AAC (128, 256 kbps). Free users stream at 160kbps; Premium gets 320kbps.</span>
                </li>
                <li>
                  <strong>HTTP Byte-Range Chunking:</strong>
                  <span> Rather than downloading entire 40MB audio files, tracks are partitioned into small 128KB chunks. The client immediately fetches chunk 0 for instantaneous sound initiation.</span>
                </li>
                <li>
                  <strong>Predictive Gapless Pre-Buffering:</strong>
                  <span> 10–15 seconds before the current track finishes, the client silently downloads the header and first chunks of the next queued track, eliminating any audio gap between songs.</span>
                </li>
                <li>
                  <strong>DRM & Audio Decryption:</strong>
                  <span> Master files are encrypted with Widevine / FairPlay DRM keys that are securely negotiated with Spotify's licensing key servers upon token authentication.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'realtime' && (
            <div className="arch-section-body">
              <h3>Spotify Connect & Real-Time Sync Engine</h3>
              <p>
                Spotify Connect synchronizes playback state (current track, elapsed milliseconds, volume, shuffle, repeat, queue) across all active hardware in under 100 milliseconds.
              </p>

              <div className="arch-callout-box">
                <div className="callout-header">
                  <Radio size={16} />
                  <span>Live Simulator Telemetry:</span>
                </div>
                <div className="callout-metrics">
                  <div><strong>Active Channel:</strong> Hermes-WS (PubSub)</div>
                  <div><strong>Last Heartbeat:</strong> {liveSyncTime}</div>
                  <div><strong>Global Live Listeners:</strong> {liveListeners.toLocaleString()}</div>
                  <div><strong>Simulated Transport Latency:</strong> ~28ms</div>
                </div>
              </div>

              <div className="arch-sync-steps">
                <div className="sync-step">
                  <span className="step-num">1</span>
                  <div>
                    <strong>Action Initiated:</strong> User hits "Play" or skips track on iPhone.
                  </div>
                </div>
                <div className="sync-step">
                  <span className="step-num">2</span>
                  <div>
                    <strong>Hermes Publish:</strong> iPhone emits a WebSocket state packet to the user's active session cluster.
                  </div>
                </div>
                <div className="sync-step">
                  <span className="step-num">3</span>
                  <div>
                    <strong>Broker Fan-Out:</strong> Mercury protocol pushes the delta update to desktop app, web player, smart speakers, and friends' activity feeds simultaneously.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="arch-section-body">
              <h3>Recommendation Architecture: How Spotify Know What You Love</h3>
              <p>
                Spotify's recommendation system combines three powerful machine learning models known collectively as <strong>BaRT (Bandits for Recommendations as Treatments)</strong>:
              </p>

              <div className="ai-models-grid">
                <div className="ai-model-card">
                  <h4>1. Collaborative Filtering</h4>
                  <p>Matrix Factorization analyzing billions of user playlists. If User A likes Songs 1, 2, 3 and User B likes Songs 1, 2, 4, Spotify recommends Song 3 to User B.</p>
                </div>

                <div className="ai-model-card">
                  <h4>2. Convolutional Spectrograms</h4>
                  <p>Convolutional Neural Networks (CNNs) analyze raw waveforms of new tracks, evaluating acousticness, danceability, energy, tempo (BPM), and key signature.</p>
                </div>

                <div className="ai-model-card">
                  <h4>3. Natural Language Processing</h4>
                  <p>Web scrapers index music blogs, artist reviews, social feeds, and forum discussions to generate descriptive vectors for every song and artist.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="arch-section-body">
              <h3>Spotify Web API & Web Playback SDK</h3>
              <p>
                To connect third-party apps directly with Spotify's real catalog, Spotify provides two foundational developer tools:
              </p>

              <div className="api-cards-container">
                <div className="api-card">
                  <div className="api-card-badge">REST API</div>
                  <h4>Spotify Web API</h4>
                  <p>Provides OAuth 2.0 PKCE access to user profile, playlists, top artists, search catalog, and player endpoints:</p>
                  <code>GET https://api.spotify.com/v1/me/player</code>
                  <code>GET https://api.spotify.com/v1/search?q=artist&type=track</code>
                </div>

                <div className="api-card">
                  <div className="api-card-badge">Client SDK</div>
                  <h4>Spotify Web Playback SDK</h4>
                  <p>A client-side JavaScript SDK that allows web apps to stream full Spotify tracks directly in the browser using EME (Encrypted Media Extensions).</p>
                  <code>window.onSpotifyWebPlaybackSDKReady = () =&gt; ...</code>
                </div>
              </div>

              {/* Interactive Client ID Tester */}
              <div className="client-id-tester-card">
                <h4>Connect Your Own Spotify Developer App (Optional)</h4>
                <p>If you have a Spotify Developer Client ID, you can test it here or use OAuth PKCE login:</p>
                <div className="tester-input-row">
                  <input 
                    type="text" 
                    placeholder="Enter Spotify Client ID..." 
                    value={spotifyClientId}
                    onChange={(e) => setSpotifyClientId(e.target.value)}
                    className="spotify-client-input"
                  />
                  <button 
                    className="test-spotify-btn"
                    onClick={() => {
                      if (!spotifyClientId.trim()) {
                        setApiStatus('Please enter a valid Client ID from developer.spotify.com');
                      } else {
                        setApiStatus(`Configured Client ID: ${spotifyClientId.slice(0, 6)}... (Ready for OAuth PKCE redirect)`);
                      }
                    }}
                  >
                    Validate Key
                  </button>
                </div>
                {apiStatus !== 'Idle' && (
                  <div className="api-status-notice">{apiStatus}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="arch-modal-footer">
          <span className="arch-footer-meta">
            Built for Zyrops Spotify Clone • Interactive Audio & Architecture Demonstration
          </span>
          <button 
            className="arch-close-action-btn"
            onClick={() => setIsSpotifyInfoOpen(false)}
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
