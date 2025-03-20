import React, { useEffect, useRef, useState } from 'react';
import { Peer } from 'peerjs';
import Webcam from 'react-webcam';
import './VideoCall.scss';

const VideoCall = ({ socket, roomId, userName, participants }) => {
  const [myStream, setMyStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const myVideo = useRef();
  const peerRef = useRef();
  const connectionsRef = useRef({});
  const streamRef = useRef();

  // Initialize user media and peer connection
  useEffect(() => {
    // Get user media
    const getMedia = async () => {
      try {
        // Create a random peer ID (you could use socket.id or generate a UUID)
        const peerId = `${roomId}-${userName}-${Math.random().toString(36).substring(2, 9)}`;
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        setMyStream(stream);
        streamRef.current = stream;
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
        
        // Initialize the PeerJS client
        const peer = new Peer(peerId, {
          config: {
            'iceServers': [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });
        
        peerRef.current = peer;
        
        peer.on('open', (id) => {
          console.log('My peer ID is:', id);
          
          // Notify server that we're ready for video calls
          socket.emit('video-ready', { roomId, userName, peerId: id });
        });
        
        peer.on('call', (call) => {
          // Answer incoming call with our stream
          call.answer(stream);
          
          // Handle the received stream
          call.on('stream', (incomingStream) => {
            const callerId = call.peer;
            const callerInfo = participants.find(p => p.peerId === callerId);
            
            setPeers(prevPeers => ({
              ...prevPeers,
              [callerId]: { 
                call,
                userName: callerInfo?.name || 'Unknown' 
              }
            }));
            
            connectionsRef.current[callerId] = call;
          });
        });
        
        // Handle cleanup
        return () => {
          stream.getTracks().forEach(track => track.stop());
          Object.values(connectionsRef.current).forEach(call => call.close());
          peer.destroy();
        };
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
    
    if (socket.connected) {
      getMedia();
    }
    
    // Listen for new users joining
    socket.on('user-joined-video', ({ userId, userName: peerName, peerId }) => {
      if (peerRef.current && streamRef.current && peerId) {
        // Call the new user
        const call = peerRef.current.call(peerId, streamRef.current);
        
        call.on('stream', (incomingStream) => {
          setPeers(prevPeers => ({
            ...prevPeers,
            [peerId]: { 
              call,
              userName: peerName 
            }
          }));
          
          connectionsRef.current[peerId] = call;
        });
      }
    });
    
    // Handle user leaving
    socket.on('user-left-video', ({ userId, peerId }) => {
      if (connectionsRef.current[peerId]) {
        connectionsRef.current[peerId].close();
        delete connectionsRef.current[peerId];
        
        setPeers(prevPeers => {
          const peers = { ...prevPeers };
          delete peers[peerId];
          return peers;
        });
      }
    });
    
    return () => {
      socket.off('user-joined-video');
      socket.off('user-left-video');
    };
  }, [socket, roomId, userName, participants]);
  
  // Toggle camera on/off
  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setCameraEnabled(!cameraEnabled);
    }
  };
  
  // Toggle mic on/off
  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setMicEnabled(!micEnabled);
    }
  };
  
  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!sharingScreen) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        // Replace video track with screen sharing track
        const videoTrack = screenStream.getVideoTracks()[0];
        
        Object.values(connectionsRef.current).forEach(call => {
          const sender = call.peerConnection.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        // Update my video
        if (myVideo.current) {
          myVideo.current.srcObject = screenStream;
        }
        
        // Listen for when user stops screen sharing
        videoTrack.onended = () => {
          stopScreenSharing();
        };
        
        setSharingScreen(true);
      } catch (err) {
        console.error("Error sharing screen:", err);
      }
    } else {
      stopScreenSharing();
    }
  };
  
  // Stop screen sharing
  const stopScreenSharing = () => {
    if (streamRef.current) {
      // Get back to camera video track
      const videoTrack = streamRef.current.getVideoTracks()[0];
      
      Object.values(connectionsRef.current).forEach(call => {
        const sender = call.peerConnection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
      
      // Update my video
      if (myVideo.current) {
        myVideo.current.srcObject = streamRef.current;
      }
      
      setSharingScreen(false);
    }
  };

  return (
    <div className={`video-call-container ${isMinimized ? 'minimized' : ''}`}>
      <div className="video-header">
        <div className="title">Video Call</div>
        <div className="controls">
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="settings-btn"
            title="Settings"
          >
            ⚙️
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)} 
            className="minimize-btn"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="video-grid">
            <div className="video-item local-video">
              {myStream ? (
                <Webcam 
                  ref={myVideo} 
                  muted 
                  autoPlay 
                  mirrored
                />
              ) : (
                <div className="video-placeholder">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <div className="video-label">You</div>
              {!cameraEnabled && (
                <div className="video-disabled-overlay">
                  <div className="video-disabled-icon">🎥❌</div>
                </div>
              )}
            </div>
            
            {Object.entries(peers).map(([userId, { call, userName: peerName }]) => (
              <PeerVideo 
                key={userId} 
                call={call} 
                userName={peerName} 
              />
            ))}
          </div>
          
          <div className="video-controls">
            <button 
              onClick={toggleMic} 
              className={`control-btn ${!micEnabled ? 'disabled' : ''}`}
              title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
            >
              {micEnabled ? '🎤' : '🔇'}
            </button>
            <button 
              onClick={toggleCamera} 
              className={`control-btn ${!cameraEnabled ? 'disabled' : ''}`}
              title={cameraEnabled ? "Turn Off Camera" : "Turn On Camera"}
            >
              {cameraEnabled ? '📹' : '📷❌'}
            </button>
            <button 
              onClick={toggleScreenShare} 
              className={`control-btn ${sharingScreen ? 'active' : ''}`}
              title={sharingScreen ? "Stop Sharing Screen" : "Share Screen"}
            >
              {sharingScreen ? '🖥️❌' : '🖥️'}
            </button>
          </div>
        </>
      )}
      
      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>Settings</h3>
            <button onClick={() => setShowSettings(false)}>✖️</button>
          </div>
          <div className="settings-content">
            <div className="setting-item">
              <label>Camera:</label>
              <select>
                <option value="default">Default Camera</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Microphone:</label>
              <select>
                <option value="default">Default Microphone</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PeerVideo component using PeerJS
const PeerVideo = ({ call, userName }) => {
  const ref = useRef();
  const [videoActive, setVideoActive] = useState(true);
  
  useEffect(() => {
    // Set the received stream to the video element
    ref.current.srcObject = call.remoteStream;
    
    // Check if video tracks are enabled
    const videoTrack = call.remoteStream?.getVideoTracks()[0];
    if (videoTrack) {
      setVideoActive(videoTrack.enabled);
      
      // Listen for track ended event
      videoTrack.onended = () => {
        setVideoActive(false);
      };
    }
  }, [call]);

  return (
    <div className="video-item">
      <video ref={ref} autoPlay />
      <div className="video-label">{userName}</div>
      {!videoActive && (
        <div className="video-disabled-overlay">
          <div className="video-disabled-icon">🎥❌</div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;