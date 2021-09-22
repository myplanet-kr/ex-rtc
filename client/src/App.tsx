import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { roomName, useMediaList, useStream, useWebRTC } from "./hook/mediaUtil";
import { API_SEVER, CameraConstraintType, getCameraConstraints } from "./util";

function App() {
  const mediaList = useMediaList();
  const meVideo = useRef<HTMLVideoElement>(null);
  const otherVideo = useRef<HTMLVideoElement>(null);
  const socket = useMemo(() => io(API_SEVER), []);
  const [constraint, setConstraint] = useState<CameraConstraintType>(
    getCameraConstraints()
  );

  useEffect(() => {
    const cameras =
      mediaList?.filter((device) => device.kind === "videoinput") || [];
    const camerasConstraint = getCameraConstraints(cameras[0]?.deviceId);
    setConstraint(camerasConstraint);
  }, [mediaList]);
  const { stream, mute, soundToggle } = useStream(constraint);

  if (meVideo.current && stream) {
    meVideo.current.srcObject = stream;
  }
  const conn = useWebRTC(socket, otherVideo);
  console.log(conn);
  useEffect(() => {
    if (stream) {
      stream.getTracks().forEach((t) => conn.addTrack(t, stream));
    }
  }, [stream, conn]);

  return (
    <>
      ME VIDEO <br />
      <video ref={meVideo} autoPlay={true} playsInline={true}></video>
      YOU VIDEO <br />
      <video ref={otherVideo} autoPlay={true} playsInline={true}></video>
      <button
        onClick={(e) => {
          e.preventDefault();
          socket.emit("join_room", roomName);
        }}
      >
        방참여
      </button>
    </>
  );
}

export default App;
