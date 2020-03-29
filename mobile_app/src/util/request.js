import * as firebase from "firebase";
import Axios from "axios";

const httpUrl = "http://192.168.0.10:3000";
const wsUrl = "ws://192.168.0.10:3000";

export async function makeLoginRequest() {
  // create account with our backend
  const token = await firebase.auth().currentUser.getIdToken();
  const config = { headers: { Authorization: token } };
  const res = await Axios.post(`${httpUrl}/user/login`, null, config);
}

export async function makeLogoutRequest() {
  const res = await Axios.delete(`${httpUrl}/user/logout`);
}

export { httpUrl, wsUrl };
