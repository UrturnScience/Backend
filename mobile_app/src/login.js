import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";

function Login({ onLogin, onCreateAccount}) {
  const [usernameInput, setUsernameInput] = useState("Username");
  const [passwordInput, setPasswordInput] = useState("Password");

  return (
    <View>
      <Text>login:</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1}}
        onChangeText={text => setUsernameInput(text)}
        value={usernameInput}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={text => setPasswordInput(text)}
        value={passwordInput}
      />
      <Button
        title="login"
        onPress={() => {
          onLogin(usernameInput, passwordInput);
        }}
      />
      <Button
        title="create account"
        onPress={() => {
          onCreateAccount(usernameInput, passwordInput);
        }}
      />      
    </View>
  );
}

export default Login;
