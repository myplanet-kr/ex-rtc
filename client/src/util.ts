export type CameraConstraintType = {
  audio: boolean;
  video: Object;
};
export const API_SEVER = "http://localhost:3001";

export const STUNS = [
  "stun:stun.l.google.com:19302",
  // "stun:stun1.l.google.com:19302",
  // "stun:stun2.l.google.com:19302",
  // "stun:stun3.l.google.com:19302",
  // "stun:stun4.l.google.com:19302",
];

export const getCameraConstraints = (deviceId?: string) => ({
  audio: true,
  video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" },
});
