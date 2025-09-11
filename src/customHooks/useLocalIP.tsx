"use client"; // Required for client-side hooks in Next.js

import { useState, useEffect } from 'react';

export default function useLocalIP() {
  const [localIP, setLocalIP] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocalIP() {
      try {
        // WebRTC Trick to get local IP
        const peerConnection = new RTCPeerConnection({ iceServers: [] });
        peerConnection.createDataChannel(''); // Dummy channel
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        peerConnection.onicecandidate = (ice) => {
          if (ice.candidate) {
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
            const ipMatch = ice.candidate.candidate.match(ipRegex);
            if (ipMatch) {
              setLocalIP(ipMatch[1]);
              peerConnection.close();
            }
          }
        };
      } catch (err) {
        setError("Failed to fetch local IP. Browser may block WebRTC.");
      }
    }

    fetchLocalIP();
  }, []);

  return { localIP, error };
}