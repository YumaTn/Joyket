import React, { useState, useEffect, useRef } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import * as Speech from "expo-speech";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { MaterialIcons } from '@expo/vector-icons';
import { LogoIcon } from "../../assets/icon";

const ChatboxAI = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showStopIcon, setShowStopIcon] = useState(false);
  const flatListRef = useRef(null); // ref cho FlatList

  const API_KEY = "AIzaSyCKn23x9AORW8M0y3ecj7HOwDj2tdVXIls";

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "hello!";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      showMessage({
        message: "Welcome to Elaine Chat 🤖",
        description: text,
        type: "info",
        icon: "info",
        duration: 2000,
      });
      setMessages([
        {
          text,
          user: false,
          botName: "Elaine",
        },
      ]);
    };
    startChat();
  }, []);

  const sendMessage = async () => {
    setLoading(true);
    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    setMessages((prevMessages) => [...prevMessages, { text, user: false, botName: "Elaine" }]);
    setLoading(false);
    setUserInput("");

    // Tự động cuộn xuống cuối
    flatListRef.current.scrollToEnd({ animated: true });

    if (text && !isSpeaking) {
      Speech.speak(text);
      setIsSpeaking(true);
      setShowStopIcon(true);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      if (messages.length > 0) { // Check if there are any messages
        Speech.speak(messages[messages.length - 1].text);
        setIsSpeaking(true);
      } else {
        showMessage({
          message: "Không có tin nhắn nào để phát âm.",
          type: "info",
        });
      }
    }
  };

  const ClearMessage = () => {
    setMessages([]);
    setIsSpeaking(false);
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text style={[styles.messageText, item.user && styles.userMessage]}>
        {item.user ? item.text : `${item.botName}: ${item.text}`}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/chill.jpg")} // Đường dẫn đến hình nền
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.titleContainer}>
              <MaterialIcons style={{ marginLeft: 10, color: '#F7C945' }} name="keyboard-arrow-left" size={24} color="black" />
              <Text style={styles.info}>Trợ giúp</Text>
            </View>
          </TouchableOpacity>
          <View style={{marginRight:15,marginBottom:10}}>
          <LogoIcon/>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()} // Sử dụng index làm keyExtractor
          inverted={false}
          style={styles.flatList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message"
            onChangeText={setUserInput}
            value={userInput}
            onSubmitEditing={sendMessage}
            style={styles.input}
            placeholderTextColor="#fff"
          />
          {showStopIcon && (
            <TouchableOpacity style={styles.stopIcon} onPress={ClearMessage}>
              <Entypo name="controller-stop" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
  },
  messageText: {
    fontSize: 18,
    color: 'white',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 10,
    height: 50,
    color: "white",
  },
  micIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  stopIcon: {
    padding: 10,
    backgroundColor: "#131314",
    borderRadius: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 10,
  },
  info: {
    fontSize: 20,
    color: '#F7C945',
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    marginLeft: -5,
    justifyContent: "center",
  },
  iconCenter: {
    justifyContent: "center",
    alignItems: "center",
    color: '#F7C945',
  },
});

export default ChatboxAI;
