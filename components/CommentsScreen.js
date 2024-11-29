import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Card, Text, IconButton, Divider } from 'react-native-paper';
import { addDoc, collection, getDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; // Import auth for current user

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts', postId, 'comments'));
    const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(fetchedComments);
  };

  const handleAddComment = async () => {
    if (newComment) {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid)); // Fetch the user document to get username
          let username = 'Unknown User'; // Default username
          if (userDoc.exists()) {
            username = userDoc.data().username; // Get the username from user document
          }

          // Save the comment with username
          await addDoc(collection(db, 'posts', postId, 'comments'), {
            userId: user.uid,
            username: username, // Save username with comment
            comment: newComment,
            createdAt: serverTimestamp(),
          });
          setNewComment('');
          fetchComments(); // Refresh comments after adding a new one
        } catch (error) {
          console.error("Error adding comment: ", error);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.commentCard}>
                <Card.Content>
                  <Text style={styles.usernameText}>{item.username}</Text>
                  <Text style={styles.commentText}>{item.comment}</Text>
                </Card.Content>
              </Card>
            )}
            ItemSeparatorComponent={Divider} // Optional divider between comments
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              placeholderTextColor="#888"
              selectionColor="#6200ea" // Customize selection color
            />
            <IconButton
              icon="send"
              size={28}
              onPress={handleAddComment}
              style={styles.sendButton}
              color="#6200ea" // Customize icon color
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  commentCard: {
    marginBottom: 10,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#f9f9f9',
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eaeaea',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  sendButton: {
    backgroundColor: '#f9f9f9', // Example background color
    borderRadius: 20,
  },
});

export default CommentsScreen;
