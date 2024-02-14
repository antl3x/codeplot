import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:4000");

export function WebRTC() {
  useEffect(() => {
    const peerConnection = new RTCPeerConnection();

    const dataChannel = peerConnection.createDataChannel("channel");

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };

    const handleAnswer = async (answer) => {
      if (peerConnection.signalingState === "closed") {
        console.log("PeerConnection is closed, ignoring answer");
        return;
      }
      console.log("Received answer");
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    };

    const handleIceCandidate = (candidate) => {
      if (peerConnection.signalingState === "closed") {
        console.log("PeerConnection is closed, ignoring ICE candidate");
        return;
      }
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer).then(() => {
        socket.emit("offer", offer);
      });
    });

    dataChannel.onopen = () => {
      console.log("Channel Opened");
      dataChannel.send("Ping");
    };

    dataChannel.onmessage = (e) => {
      console.log("Message from Python:", e.data);
      dataChannel.send("Ping");
    };

    // Cleanup function
    return () => {
      peerConnection.close();
      console.log("PeerConnection closed");
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>React WebRTC and Python</p>
      </header>
    </div>
  );
}
