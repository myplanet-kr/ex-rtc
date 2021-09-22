import "bootstrap/dist/css/bootstrap.min.css";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  FormControl,
  InputGroup,
  Row,
  Stack,
} from "react-bootstrap";
import { io } from "socket.io-client";
import "./App.css";
import { useMediaList, useStream, useWebRTC } from "./hook/mediaUtil";
import { API_SEVER, CameraConstraintType, getCameraConstraints } from "./util";

function App() {
  const [mikes, setMikes] = useState<MediaDeviceInfo[]>([]);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const mediaList = useMediaList();
  const roomNameInputRef = createRef<HTMLInputElement>();

  useEffect(() => {
    setMikes(mediaList?.filter((x) => x.kind === "audioinput") || []);
    setCameras(mediaList?.filter((x) => x.kind === "videoinput") || []);
  }, [mediaList]);

  const meVideo = useRef<HTMLVideoElement>(null);
  const otherVideo = useRef<HTMLVideoElement>(null);
  const socket = useMemo(() => io(API_SEVER), []);
  const conn = useWebRTC(socket, otherVideo);
  const [constraint, setConstraint] = useState<CameraConstraintType>(
    getCameraConstraints()
  );

  useEffect(() => {
    const cameras =
      mediaList?.filter((device) => device.kind === "videoinput") || [];
    const camerasConstraint = getCameraConstraints(cameras[0]?.deviceId);
    setConstraint(camerasConstraint);
  }, [mediaList]);
  const { stream, mute, soundToggle, view, viewToggle } = useStream(constraint);

  if (meVideo.current && stream) {
    meVideo.current.srcObject = stream;
  }
  useEffect(() => {
    if (stream) {
      stream.getTracks().forEach((t) => conn.addTrack(t, stream));
    }
  }, [stream, conn]);

  return (
    <>
      <Row>
        <Row>
          <Col>ME VIDEO</Col>
          <Col>YOU VIDEO</Col>
        </Row>
        <Row>
          <Col>
            <video
              ref={meVideo}
              autoPlay={true}
              playsInline={true}
              width={"100%"}
              height={"100%"}
            />
          </Col>
          <Col>
            <video
              ref={otherVideo}
              autoPlay={true}
              playsInline={true}
              width={"100%"}
              height={"100%"}
            />
          </Col>
        </Row>
        <Row></Row>
      </Row>
      <Stack gap={3} className="col-md-5 mx-auto">
        <Col>
          <Form.Select>
            {mikes.map((x) => (
              <option>{x.label}</option>
            ))}
          </Form.Select>
          <Form.Select>
            {cameras.map((x) => (
              <option>{x.label}</option>
            ))}
          </Form.Select>
        </Col>
        <Col></Col>
        <Col>
          <InputGroup>
            <FormControl
              placeholder="Channel"
              ref={roomNameInputRef}
              onChange={(e) => {
                e.preventDefault();
                // setRoomName(e.target.value);
              }}
            />
            <Button
              variant="outline-secondary"
              onClick={(e) => {
                e.preventDefault();
                const room = roomNameInputRef.current;
                socket.emit("join_room", room?.value);
              }}
            >
              대화시작
            </Button>
          </InputGroup>
        </Col>
        <Col>
          <Button
            variant={mute ? "primary" : "secondary"}
            onClick={(e) => {
              e.preventDefault();
              soundToggle();
            }}
          >
            {mute ? "Mike ON" : "Mike OFF"}
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              viewToggle();
            }}
          >
            Screen {view ? "ON" : "OFF"}
          </Button>
        </Col>
      </Stack>
    </>
  );
}

export default App;
