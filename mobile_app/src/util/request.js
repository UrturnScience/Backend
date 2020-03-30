import * as firebase from "firebase";
import Axios from "axios";

const httpUrl = "http://192.168.0.10:3000";
const wsUrl = "ws://192.168.0.10:3000";

export async function makeLoginRequest() {
  // create account with our backend
  const token = await firebase.auth().currentUser.getIdToken();
  const config = { headers: { Authorization: token } };
  const res = await Axios.post(`${httpUrl}/user/login`, null, config);
  return res.data.user;
}

export async function makeLogoutRequest() {
  const res = await Axios.delete(`${httpUrl}/user/logout`);
}

export async function getRoomMessages(roomId) {
  const res = await Axios.get(`${httpUrl}/message/room/${roomId}`);
  return res.data.messages;
}

export async function getUserRoom(userId) {
  const res = await Axios.get(`${httpUrl}/roomuser/user/${userId}`);
  return res.data.roomUsers && res.data.roomUsers[0];
}

export async function createAndJoinRoom(userId) {
  const roomRes = await Axios.post(`${httpUrl}/room/create`);
  const roomId = roomRes.data.room._id;
  const roomUser = await Axios.post(
    `${httpUrl}/roomuser/add/${roomId}/${userId}`
  );
  return roomId;
}

export { httpUrl, wsUrl };
