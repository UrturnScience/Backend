import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";

function Login({ onLogin, onCreateAccount}) {
  const [emailInput, setEmailInput] = useState("Email");
  const [passwordInput, setPasswordInput] = useState("Password");

  return (
    <View>
      <Text>login:</Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1}}
        onChangeText={text => setEmailInput(text)}
        value={emailInput}
      />
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={text => setPasswordInput(text)}
        value={passwordInput}
      />
      <Button
        title="login"
        onPress={() => {
          onLogin(emailInput, passwordInput);
        }}
      />
      <Button
        title="create account"
        onPress={() => {
          onCreateAccount(emailInput, passwordInput);
        }}
      />      
    </View>
  );
}

export default Login;
