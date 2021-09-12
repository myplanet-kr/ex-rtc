import React, { useEffect, useMemo, useState } from 'react';
// import SocketIO from 'socket.io';

export const useMediaList = () => {
  const [device, setDevices] = useState<any[]>();
  useEffect(() => {
    window.navigator.mediaDevices.enumerateDevices().then(r => setDevices(r));
  }, []);
  return device;
}

export const getCameraConstraints = (deviceId?: string) => ({
  audio: true,
  video: deviceId ? { deviceId: { exact: deviceId } }: { facingMode: "user" }
});

type CameraConstraintType = {
  audio: boolean,
  video: Object
}

export const useStream = (constraint: CameraConstraintType) => {
  const [stream, setStream] = useState<MediaStream>();
  const [mute, setMute] = useState(false);
  useEffect(() => {
    window.navigator.mediaDevices.getUserMedia(constraint).then(r => setStream(r));
  }, [constraint]);

  const soundToggle = () => {
    setMute((m) => {
      stream?.getAudioTracks().forEach((track) => track.enabled = !m);
      return !m;
    });
  }
  return { stream, mute, soundToggle };
}
// let myStream;
// let muted = false;
// let cameraOff = false;
// let roomName;
// let myPeerConnection;
// let myDataChannel;

// export async function getCameras() {
//     try {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const cameras = devices.filter((device) => device.kind === "videoinput");
//       const currentCamera = myStream.getVideoTracks()[0];
//       cameras.forEach((camera) => {
//         const option = document.createElement("option");
//         option.value = camera.deviceId;
//         option.innerText = camera.label;
//         if (currentCamera.label === camera.label) {
//           option.selected = true;
//         }
//         camerasSelect.appendChild(option);
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }
const STUNS = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
  "stun:stun2.l.google.com:19302",
  "stun:stun3.l.google.com:19302",
  "stun:stun4.l.google.com:19302",
]

export const getPeerConnection = () => {
  return new RTCPeerConnection({
    iceServers: [
      {
        urls: [...STUNS],
      },
    ],
  });
}

export const useAddEventListen = (event: string, fn: EventListenerOrEventListenerObject, target: EventTarget) => {
  target.addEventListener(event, fn);
  return () => target.removeEventListener(event, fn);
}

function makeConnection() {
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

  
//   export async function handleCameraChange() {
//     await getMedia(camerasSelect.value);
//     if (myPeerConnection) {
//       const videoTrack = myStream.getVideoTracks()[0];
//       const videoSender = myPeerConnection
//         .getSenders()
//         .find((sender) => sender.track.kind === "video");
//       videoSender.replaceTrack(videoTrack);
//     }
//   }
  