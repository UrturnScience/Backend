import React, { useState, useEffect } from "react";
import { Button, View, Text, TextInput } from "react-native";
import Login from "./src/login";
import auth from "@react-native-firebase/auth";
import Axios from "axios";

function App() {
  // Set an initializing state whilst Firebase connects
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
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorNotif(error.message);
    }
  }

  // Handle creating new account
  function onCreateAccount(email, password) {
    auth().createUserWithEmailAndPassword(email, password);
  }

  // Loggin out
  function onLogout() {
    auth().signOut();
  }

  // Make ping request
  async function pingRequest() {
    const res = await Axios.get("http://localhost:8080/ping");
    console.log(res.data);
  }

  // Make an authenticated request
  // sends firebase Id token as JWT
  async function authenticatedRequest() {
    const token = await auth().currentUser.getIdToken();
    const config = { headers: { Authorization: token } };

    try {
      const res = await Axios.get("http://localhost:8080/authPing", config);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
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

export default App;
