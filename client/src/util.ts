export type CameraConstraintType = {
  audio: boolean;
  video: Object;
};
export const API_SEVER = "http://localhost:3001";

export const IO_DEFAULT = Object.freeze({
  audio: false,
  video: false,
});

export const STUNS = [
  "stun:stun.l.google.com:19302",
  // "stun:stun1.l.google.com:19302",
  // "stun:stun2.l.google.com:19302",
  // "stun:stun3.l.google.com:19302",
  // "stun:stun4.l.google.com:19302",
];

export const getCameraConstraints = (deviceId?: string) => ({
  audio: IO_DEFAULT.audio,
  video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" },
});
