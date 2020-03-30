import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { Button, View, Text, TextInput } from "react-native";

import firebaseConfig from "./firebaseConfig";
import {
  makeLoginRequest,
  makeLogoutRequest,
  getRoomMessages,
  getUserRoom,
  createAndJoinRoom
} from "./src/util/request";
import * as websocket from "./src/util/websocket";
import Login from "./src/login";
import Chat from "./src/chat";

export default function App() {
  if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
  }

  // Set an initializing state until Firebase can connect
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [errorNotif, setErrorNotif] = useState();
  const [room, setRoom] = useState();
  const [messages, setMessages] = useState([]);

  // Handle user state changes
  async function onAuthStateChanged(firebaseUser) {
    if (firebase.auth().currentUser) {
      const backendUser = await makeLoginRequest();
      const roomUser = await getUserRoom(backendUser._id);
      const resMessages = await getRoomMessages(roomUser.roomId);
      websocket.connect();
      setUser(backendUser);
      setRoom(roomUser.roomId);
      setMessages(resMessages);

      websocket.getWebSocket().onmessage = e => {
        const data = JSON.parse(e.data);
        setMessages([...messages, data]);
      };
    } else {
      setUser();
    }

    if (initializing) setInitializing(false);
  }

  // Handle creating new account
  async function createAccount(email, password) {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorNotif(error.message);
    }
  }

  // Handle login attempt
  async function loginUser(email, password) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorNotif(error.message);
    }
  }

  // Logout
  function logoutUser() {
    firebase.auth().signOut();
    makeLogoutRequest();
  }

  // join room
  async function createRoom() {
    const roomId = await createAndJoinRoom(user._id);
    setUser(roomId);
  }

  // messaging
  function onSend(msg) {
    websocket.getWebSocket().send(msg);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text> </Text>
        <Text> </Text>
        <Login {...{ onLogin: loginUser, onCreateAccount: createAccount }} />
        {errorNotif && <Text>{errorNotif}</Text>}
      </View>
    );
  }

  return (
    <View>
      <Text> </Text>
      <Text> </Text>
      <Text>Welcome {firebase.auth().currentUser.email}</Text>
      <Text>User: {user._id}</Text>
      {room ? (
        <Text>room: {room}</Text>
      ) : (
        <Button title="create room" onPress={createRoom} />
      )}
      <Button title="logout" onPress={logoutUser} />
      <Chat {...{ onSend, messages }}></Chat>
    </View>
  );
}
