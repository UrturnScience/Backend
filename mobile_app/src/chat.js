import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

function MessageItem({ message }) {
  return (
    <View>
      <Text>{message.senderId} sent "{message.data}"</Text>
    </View>
  );
}

function Chat({ onSend, messages }) {
  const [message, setMessage] = useState("enter text...");

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageItem message={item}></MessageItem>}
        keyExtractor={item => item._id}
      ></FlatList>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={text => setMessage(text)}
        value={message}
      ></TextInput>
      <Button
        title="send"
        onPress={() => {
          onSend(message);
        }}
      ></Button>
    </View>
  );
}

export default Chat;
