import React, { useState, useEffect } from "react";
import { Button, View, Text, TextInput } from "react-native";
import Login from "./src/login";
import auth from "@react-native-firebase/auth";

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
    </View>
  );
}

export default App;
