import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { Button, View, Text, TextInput } from "react-native";

import firebaseConfig from "./firebaseConfig";
import { makeLoginRequest, makeLogoutRequest } from "./src/util/request";
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

  // Handle user state changes
  async function onAuthStateChanged(user) {
    setUser(user);

    if (firebase.auth().currentUser) {
      await makeLoginRequest();
      websocket.connect();
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
      <Text>Welcome {user.email}</Text>
      <Button title="logout" onPress={logoutUser} />
      <Chat></Chat>
    </View>
  );
}
