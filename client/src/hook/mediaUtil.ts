import { useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { CameraConstraintType, IO_DEFAULT, STUNS } from "../util";

export const roomName = "roomName";
export const useMediaList = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>();

  useEffect(() => {
    async function loadDevices() {
      const loadDevices =
        await window.navigator.mediaDevices.enumerateDevices();
      setDevices(loadDevices);
    }
    loadDevices();
  }, []);

  return {
    devices,
    mikes: devices?.filter((x) => x.kind === "audioinput") || [],
    cameras: devices?.filter((x) => x.kind === "videoinput") || [],
  };
};

export const useStream = (constraint: CameraConstraintType) => {
  const [stream, setStream] = useState<MediaStream>();
  const [mute, setMute] = useState(IO_DEFAULT.audio);
  const [view, setView] = useState(IO_DEFAULT.video);

  useEffect(() => {
    async function loadUserMedia(constraint: CameraConstraintType) {
      const mediaStream = await window.navigator.mediaDevices.getUserMedia(
        constraint
      );
      setStream(mediaStream);
    }
    loadUserMedia(constraint);
  }, [constraint]);

  const soundToggle = () => {
    if (stream) {
      setMute((m) => {
        stream.getAudioTracks().forEach((track) => (track.enabled = !m));
        return !m;
      });
    }
  };
  const viewToggle = () => {
    if (stream) {
      setView((v) => {
        stream.getVideoTracks().forEach((track) => (track.enabled = !v));
        return !v;
      });
    }
  };
  return { stream, mute, view, soundToggle, viewToggle };
};

export const getPeerConnection = () => {
  return new RTCPeerConnection({
    iceServers: [
      {
        urls: [...STUNS],
      },
    ],
  });
};

export const useWebRTC = (conn: RTCPeerConnection, socket: Socket) => {
  const [channel, setChannel] = useState<RTCDataChannel | null>(null);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  useAddEventListen(
    "icecandidate",
    (data: any) => {
      socket.emit("ice", data.candidate, roomName);
    },
    conn
  );
  useEffect(() => {
    socket.on("welcome", async () => {
      setChannel(conn.createDataChannel("chat"));
      const offer = await conn.createOffer();
      conn.setLocalDescription(offer);
      socket.emit("offer", offer, roomName);
    });

    socket.on("offer", async (offer) => {
      conn.addEventListener("datachannel", (event) => {
        setDataChannel(event.channel);
        dataChannel?.addEventListener("message", (event) => console.log(event));
      });
      conn.setRemoteDescription(offer);
      const answer = await conn.createAnswer();
      conn.setLocalDescription(answer);
      socket.emit("answer", answer, roomName);
    });

    socket.on("answer", (answer) => {
      conn.setRemoteDescription(answer);
    });

    socket.on("ice", (ice) => {
      conn.addIceCandidate(ice);
    });
  }, [channel, conn, dataChannel, socket]);
  return conn;
};

export const useAddEventListen = (
  event: string,
  fn: EventListenerOrEventListenerObject,
  target: EventTarget
) => {
  target.addEventListener(event, fn);
  return () => target.removeEventListener(event, fn);
};

// function makeConnection() {
//   myStream
//     .getTracks()
//     .forEach((track) => myPeerConnection.addTrack(track, myStream));
// }

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
