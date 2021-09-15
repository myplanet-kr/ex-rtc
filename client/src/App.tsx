import React from 'react';
import './App.css';
import { getPeerConnection, useAddEventListen, useMediaList } from './hook/mediaUtil';

let i = 0;
function App() {
  const mediaList = useMediaList();
  const cameras = mediaList?.filter((device) => device.kind === "videoinput") || [];

  const conn = getPeerConnection();
  useAddEventListen('icecandidate', handleIce, conn);
  useAddEventListen('addstream', handleAddStream, conn);

  function handleIce(data) {
    // console.log("sent candidate");
    // socket.emit("ice", data.candidate, roomName);
  }
  
  function handleAddStream(data) {
    // const peerFace = document.getElementById("peerFace");
    // peerFace.srcObject = data.stream;
  }
  


  return (
    <div>Hello world! {i++}</div>
  );
}

export default App;
