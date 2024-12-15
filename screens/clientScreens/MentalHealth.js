
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

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
  const [messages, setMessages] = useState([]);
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
    <KeyboardAvoidingView style={{ flex: 1, padding: 20 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Mental Health Chatbot</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text
            style={{
              fontWeight: item.sender === 'user' ? 'bold' : 'normal',
              textAlign: item.sender === 'user' ? 'right' : 'left',
            }}
          >
            {item.sender === 'user' ? 'You' : 'Bot'}: {item.text}
          </Text>
        )}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Ask me something..."
        style={{
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          marginTop: 20,
          marginBottom: 20,
        }}
      />
      <Button title={loading ? 'Loading...' : 'Send'} onPress={handleSendMessage} disabled={loading} />
    </KeyboardAvoidingView>
  );
}