
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
const ENDPOINT = 'https://api.openai.com/v1/chat/completions';

export default function MentalHealth() {

  const fetchAIResponse = async (message) => {
    try {
      const response = await axios.post(
        ENDPOINT,
        {
          model: 'gpt-3.5-turbo',  // You can use 'gpt-4' as well if available
          messages: [
            {
              role: 'system',
              content: 'You are a mental health advisor. Respond empathetically and respectfully to the following query. Avoid links, attachments, or any other external content. Just have a conversation as a counselor.',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 150,  // Reduced tokens for shorter responses
          temperature: 0.7,  // Reduced temperature for more stable responses
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error from OpenAI API:', error);
      return null;
    }
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([{
    sender: 'bot',
    text: "Hi there, how may I help you today.",
  }]);
  const [loading, setLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (message.trim()) {
      const userMessage = {
        sender: 'user',
        text: message,
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setMessage('');
      setLoading(true);

      const aiResponse = await fetchAIResponse(message);

      if (aiResponse) {
        const botMessage = {
          sender: 'bot',
          text: aiResponse.choices[0].message.content.trim(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: 'Sorry, I couldn’t get a response at the moment. Please try again later.' },
        ]);
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AccountInfo')}
        >
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>MENTAL HEALTH</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={
              item.sender === 'user'
                ? styles.sentMessageContainer
                : styles.receivedMessageContainer
            }
          >
          {item.sender !== 'user' && (
                  <Ionicons name="person-circle-outline" size={40} color="gray" style={styles.avatar} />
                )}
          <View
              style={
                item.sender === 'user' ? styles.sentMessage : styles.receivedMessage
              }
            >

              <Text style={styles.messageText}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
        
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Ask me something..."
          style={styles.textInput}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send" size={28} color="#6200ea" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  appbar: {
        height: 60,                    // Height of the appbar
        backgroundColor: '#fff',     // Background color (customizable)
        flexDirection: 'row',           // Align items horizontally
        alignItems: 'center',           // Vertically center the icon and title
        paddingHorizontal: 10,          // Add horizontal padding for spacing
        justifyContent: 'space-between', // Space between the icon and title
        borderRadius: 10,
        borderWidth: 1,  // Adds a border to the card
        borderColor: '#000',
  },
  iconButton: {
    padding: 10,                   // Adds padding around the icon for better tap experience
  },
  appTitle: {
    fontSize: 20,                  // Title size
    color: '#6200ea',                 // Title color
    fontFamily: 'CustomFont-Bold',
  },
  header: {
    padding: 16,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  messageList: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginHorizontal: 10,
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 5,
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: '#e1ffc7',
    borderRadius: 20,
    marginVertical: 5,
    padding: 10,
    maxWidth: '70%',
  },
  receivedMessage: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 5,
    padding: 10,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'CustomFont',
  },
  mediaImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  },
  documentText: {
    color: '#6200ea',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});