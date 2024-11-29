import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Linking, Modal } from 'react-native';
import { Avatar } from 'react-native-paper';
import { auth, db, storage } from '../firebaseConfig'; // Firebase initialization
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';

export default function TrainerInteractionScreen({ route }) {
  const { trainerId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState(null);
  const [chatId, setChatId] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // For modal

  const checkAndCreateChat = async (userId, trainerId) => {
    const generatedChatId = `${userId}_${trainerId}`;
    const chatRef = doc(db, 'chats', generatedChatId);

    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        userId: userId,
        trainerId: trainerId,
        createdAt: Timestamp.now(),
      });
    }

    return generatedChatId;
  };

  useEffect(() => {
    const initializeChat = async () => {
      const generatedChatId = await checkAndCreateChat(userId, trainerId);
      setChatId(generatedChatId);

      const q = query(
        collection(db, 'chats', generatedChatId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let msgs = [];
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        setMessages(msgs);
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initializeChat();
  }, [userId, trainerId]);

  const sendMessage = async (type = 'text', mediaUrl = null, fileName = null) => {
    if (inputText.trim() === '' && !mediaUrl) return;

    const messageData = {
      text: type === 'text' ? inputText : null,
      senderId: auth.currentUser.uid,
      type: type,
      mediaUrl: mediaUrl,
      fileName: fileName,
      timestamp: Timestamp.now(),
    };

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);
      setInputText('');
      setMedia(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];

      try {
        const blob = await (await fetch(uri)).blob();
        const storageRef = ref(storage, `chat_media/${new Date().toISOString()}`);
        await uploadBytes(storageRef, blob);

        const downloadUrl = await getDownloadURL(storageRef);
        sendMessage('image', downloadUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const document = result.assets[0];
        const { uri, name, mimeType } = document;

        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `chat_documents/${name}_${Date.now()}`);
        const uploadTask = await uploadBytes(storageRef, blob, { contentType: mimeType });

        const downloadUrl = await getDownloadURL(uploadTask.ref);
        sendMessage('document', downloadUrl, name);
      } else {
        console.log('Document selection canceled or no document found');
      }
    } catch (error) {
      console.error('Error picking or uploading document:', error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.senderId === auth.currentUser.uid ? styles.sentMessageContainer : styles.receivedMessageContainer}>
      {item.senderId !== auth.currentUser.uid && (
        <Ionicons name="person-circle-outline" size={40} color="gray" style={styles.avatar} />
      )}
      <View style={item.senderId === auth.currentUser.uid ? styles.sentMessage : styles.receivedMessage}>
        {item.type === 'text' ? (
          <Text style={styles.messageText}>{item.text}</Text>
        ) : item.type === 'image' ? (
          <TouchableOpacity onPress={() => setSelectedImage(item.mediaUrl)}>
            <Image source={{ uri: item.mediaUrl }} style={styles.mediaImage} />
          </TouchableOpacity>
        ) : item.type === 'document' ? (
          <TouchableOpacity onPress={() => Linking.openURL(item.mediaUrl)}>
            <Text style={styles.documentText}>📄 {item.fileName || "View Document"}</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.timestamp}>
          {item.timestamp.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AccountInfo')}
        >
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>MESSAGES</Text>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
          />
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Ionicons name="image-outline" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickDocument}>
              <Ionicons name="document-outline" size={28} color="black" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message"
            />
            <TouchableOpacity onPress={() => sendMessage()}>
              <Ionicons name="send" size={28} color="#6200ea" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal visible={!!selectedImage} transparent={true} onRequestClose={() => setSelectedImage(null)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.modalCloseButton}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.modalImage} />}
        </View>
      </Modal>
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
    fontSize: 16,
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
