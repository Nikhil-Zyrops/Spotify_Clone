import React from 'react';
import { 
  Laptop, 
  Smartphone, 
  Speaker, 
  Check, 
  X, 
  Radio, 
  Info 
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export const DevicePickerModal = () => {
  const { 
    isDevicePickerOpen, 
    setIsDevicePickerOpen, 
    devices, 
    activeDevice, 
    selectDevice 
  } = usePlayer();

  if (!isDevicePickerOpen) return null;

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Smartphone':
        return <Smartphone size={24} />;
      case 'Speaker':
        return <Speaker size={24} />;
      case 'Computer':
      default:
        return <Laptop size={24} />;
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={() => setIsDevicePickerOpen(false)}>
      <div className="device-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="device-modal-header">
          <div className="device-modal-title">
            <Radio size={20} className="green-accent" />
            <span>Connect to a device</span>
          </div>
          <button 
            className="modal-close-icon-btn" 
            onClick={() => setIsDevicePickerOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <p className="device-modal-subtitle">
          Control your music across all devices seamlessly using Spotify Connect protocol.
        </p>

        <div className="device-list">
          {devices.map((device) => {
            const isCurrent = device.id === activeDevice.id;

            return (
              <div 
                key={device.id}
                className={`device-card-item ${isCurrent ? 'is-active-device' : ''}`}
                onClick={() => selectDevice(device.id)}
              >
                <div className="device-icon-box">
                  {getDeviceIcon(device.type)}
                </div>

                <div className="device-info-col">
                  <div className={`device-name ${isCurrent ? 'green-accent' : ''}`}>
                    {device.name}
                  </div>
                  <div className="device-status">
                    {isCurrent ? (
                      <span className="device-listening-badge">
                        <span className="live-dot-pulse"></span>
                        Listening on this device
                      </span>
                    ) : (
                      `Spotify Connect • ${device.type}`
                    )}
                  </div>
                </div>

                {isCurrent && (
                  <div className="device-active-check">
                    <Check size={20} className="green-accent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="device-connect-explainer">
          <Info size={16} />
          <span>
            Spotify Connect uses Hermes WebSockets to broadcast playback state (track, time, volume) to all authenticated clients in under 100ms.
          </span>
        </div>
      </div>
    </div>
  );
};
