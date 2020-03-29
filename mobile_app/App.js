import Axios from "axios";
import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import { Button, View, Text, TextInput } from "react-native";

import firebaseConfig from "./firebaseConfig";
import Login from "./src/login";

const url = "http://192.168.0.10:3000"

export default function App() {
  if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig);
  }

  // Set an initializing state until Firebase can connect
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [errorNotif, setErrorNotif] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // Handle login attempt
  async function onLogin(email, password) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorNotif(error.message);
    }
  }

  // Handle creating new account
  function onCreateAccount(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  // Loggin out
  function onLogout() {
    firebase.auth().signOut();
  }
  // Make ping request
  async function pingRequest() {
    const res = await Axios.get(`${url}/ping`);
    console.log(res.data);
  }

  // Make an authenticated request
  // sends firebase Id token as JWT
  async function authenticatedRequest() {
    const token = await firebase.auth().currentUser.getIdToken();
    const config = { headers: { Authorization: token } };

    try {
      const res = await Axios.get(`${url}/authPing`, config);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
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
        <Login {...{ onLogin, onCreateAccount }} />
        {errorNotif && <Text>{errorNotif}</Text>}
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
      <Button title="logout" onPress={onLogout} />
      <Button title="ping server" onPress={pingRequest} />
      <Button
        title="authenticated ping server"
        onPress={authenticatedRequest}
      />
    </View>
  );
}
