import React, { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import Login from "./src/login";
import auth from "@react-native-firebase/auth";

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [value, onChangeText] = useState("Useless Multiline Placeholder");

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  // Handle login attempt
  function onLogin(username, password){
    console.log(username, password)
  }

  // Handle creating new account
  function onCreateAccount(username, password){
    console.log(username, password)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Login {...{onLogin, onCreateAccount}}/>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}

export default App;
