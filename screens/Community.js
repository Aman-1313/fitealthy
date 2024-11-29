
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Card, Avatar, Button, Menu, Divider, Provider } from 'react-native-paper';
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, arrayUnion, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRoute } from '@react-navigation/native';

import CommentsModal from '../components/CommentsModal'
import UserProfileScreen from './UserProfileScreen'

const Community = ({ navigation }) => {
  const route = useRoute();
  const isTrainer  = route.params;
  const [posts, setPosts] = useState([]);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [userPosts, setUserPosts] = useState([]); // State for user's posts
  const [otherUserPosts, setOtherUserPosts] = useState([]);
  const [showUserPosts, setShowUserPosts] = useState(false); // State to toggle between all and user posts
  const [showOtherUserPosts, setShowOtherUserPosts] = useState(false);
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [menuVisible, setMenuVisible] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPostDescription, setEditingPostDescription] = useState('');
  const [editingPostImageUrl, setEditingPostImageUrl] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const [filterCategory, setFilterCategory] = useState('All');



  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(fetchedPosts);

    const user = auth.currentUser;
    if (user) {
      const userPosts = fetchedPosts.filter(post => post.userId === user.uid); // Filter for user's posts
      setUserPosts(userPosts);
    }
  };
  //category selection logic
    const filteredPosts = (showUserPosts ? userPosts : posts).filter(post =>
      filterCategory === 'All' || post.category === filterCategory
    );

  //Other user Profile
  const showOtherProfile = async (otherUserId) => {
    setSelectedUserId(otherUserId);
    if (otherUserId) {
      const userPosts = posts.filter(post => post.userId === otherUserId); // Filter for user's posts
      setUserPosts(userPosts);
    }
    setShowUserPosts(true);

  }
  const handleCreatePost = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let username = 'Unknown User';
        if (userDoc.exists()) {
          username = userDoc.data().username;
          profileImage = userDoc.data().profileImage;
        }
        const userProfileData = {
          userId: user.uid,
          username: username || 'Anonymous',
          profilePic: profileImage || 'https://example.com/default-profile.png',
        };
        await addDoc(collection(db, 'posts'), {
          ...userProfileData,
          imageUrl: newPostImageUrl,
          description: newPostDescription,
          category: selectedCategory,
          likes: [],
          comments: [],
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
    resetPostInputs();
    fetchPosts();
  };

  const handleEditPost = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      description: editingPostDescription,
      imageUrl: editingPostImageUrl,
      category: selectedCategory,
    });
    resetEditInputs();
    fetchPosts();
  };

  const handleDeletePost = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    fetchPosts();
  };

  const resetPostInputs = () => {
    setNewPostDescription('');
    setNewPostImageUrl('');
    setSelectedCategory('General');
  };

  const resetEditInputs = () => {
    setEditingPostId(null);
    setEditingPostDescription('');
    setEditingPostImageUrl('');
    setSelectedCategory('General');
    setIsCreatingPost(false);
  };

  const handleStartEdit = (post) => {
    setEditingPostId(post.id);
    setEditingPostDescription(post.description);
    setEditingPostImageUrl(post.imageUrl);
    setSelectedCategory(post.category);
    setIsCreatingPost(true);
  };

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      alert('Permission to access the library is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      uploadImage(pickerResult.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `images/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      if (editingPostId) {
        setEditingPostImageUrl(downloadURL);
      } else {
        setNewPostImageUrl(downloadURL);
      }
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  const handleLikePost = async (postId) => {
    const user = auth.currentUser;
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: arrayUnion(user.uid),
    });
    fetchPosts();
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);


   // Function to open the comments modal for a specific post
    const openCommentsModal = (postId, postComments) => {
      setSelectedPostId(postId);
      setComments(postComments || []);
      setIsCommentsModalVisible(true);
    };

    // Function to close the comments modal
    const closeCommentsModal = () => {
      setIsCommentsModalVisible(false);
      setSelectedPostId(null);
    };

    // Add a new comment to a post
    const onAddComment = async (postId, commentText) => {
      const user = auth.currentUser;
       if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          let username = 'Unknown User';
          if (userDoc.exists()) {
            username = userDoc.data().username;
          }
          const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
              comments: arrayUnion({ username: username || 'Anonymous', text: commentText }),
            });
            fetchPosts(); // Refresh posts to include new comment
       }

    };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.appbar}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => isTrainer ? navigation.navigate('TrainerAccountInfo') : navigation.navigate('AccountInfo')}
            >
                <Ionicons name="menu" size={30} color="#6200ea" />
            </TouchableOpacity>
            <Text style={styles.appTitle}>COMMUNITY</Text>
        </View>

        {showUserPosts && (<UserProfileScreen userId={selectedUserId}  />)}
        {/* Conditionally render the post creation container */}
        {isCreatingPost && (
          <View style={styles.createPostContainer}>
            <View style={styles.uploadSection}>
              <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                <Ionicons name="cloud-upload-outline" size={24} color="#fff" style={styles.uploadIcon} />
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
              </TouchableOpacity>

              {editingPostImageUrl || newPostImageUrl ? (
                <View style={styles.previewContainer}>
                  <Image source={{ uri: editingPostImageUrl || newPostImageUrl }} style={styles.previewImage} />
                </View>
              ) : (
                <Text style={styles.noImageText}>No image selected</Text>
              )}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Write a description"
              value={editingPostId ? editingPostDescription : newPostDescription}
              onChangeText={editingPostId ? setEditingPostDescription : setNewPostDescription}
            />

            <Menu
              visible={menuVisible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity onPress={openMenu}>
                  <View style={styles.menuTrigger}>
                    <Text style={styles.categoryButton}>Select Category</Text>
                    <Ionicons name="list" />
                  </View>
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => { setSelectedCategory('Diet'); closeMenu(); }} title="Diet" />
              <Divider />
              <Menu.Item onPress={() => { setSelectedCategory('General'); closeMenu(); }} title="General" />
            </Menu>

            <Text style={styles.selectedCategory}>Selected Category: {selectedCategory}</Text>

            {editingPostId ? (
              <View>
                <Button mode="contained" onPress={() => handleEditPost(editingPostId)} style={styles.createPostButton}>
                  Update Post
                </Button>
                <Button mode="contained" onPress={resetEditInputs} style={styles.cancelPostButton}>
                  Cancel Edit
                </Button>
              </View>
            ) : (
              <View>
                <Button mode="contained" onPress={handleCreatePost} style={styles.createPostButton}>
                  Create Post
                </Button>
                {/* Button to cancel post creation */}
                <Button mode="contained" onPress={() => setIsCreatingPost(false)} style={styles.cancelPostButton}>
                  Cancel
                </Button>
              </View>
            )}
          </View>
        )}

        {/* filter  post logic */}
       {!showUserPosts && ( <View horizontal  style={styles.categoryFilterContainer}>
             <Button
               mode={filterCategory === "text" }
               onPress={() => setFilterCategory('All')}
               style={styles.filterButton}
               labelStyle={styles.label} // Use consistent text style
               contentStyle={styles.buttonContent} // Ensure consistent button sizing
             >
               #All
             </Button>
             <Button
               mode={filterCategory === "text"}
               onPress={() => setFilterCategory('Diet')}
               style={styles.filterButton}
               labelStyle={styles.label} // Use consistent text style
               contentStyle={styles.buttonContent} // Ensure consistent button sizing
             >
               #Diet
             </Button>
             <Button
               mode={filterCategory === "text"}
               onPress={() => setFilterCategory('General')}
               style={styles.filterButton}
               labelStyle={styles.label} // Use consistent text style
               contentStyle={styles.buttonContent} // Ensure consistent button sizing
             >
               #General
             </Button>
       </View>)}
        {/* Comments Modal */}
       <CommentsModal
         visible={isCommentsModalVisible}
         onClose={closeCommentsModal}
         postId={selectedPostId}
         comments={comments}
         onAddComment={onAddComment}
       />

        <ScrollView style={styles.postContainer}>
          {(showUserPosts ? userPosts : filteredPosts).map(post => (
            <Card key={post.id} style={styles.postCard}>
              <Card.Content>
                <View style={styles.postHeader}>
                  <TouchableOpacity onPress={() => showOtherProfile(post.userId) }>
                    <Avatar.Image size={40} source={{ uri: post.profilePic }} />
                  </TouchableOpacity>
                  <View style={styles.userInfo}>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.category}>{post.category}</Text>
                  </View>
                </View>
                {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={styles.postImage} />}
                <Text style={styles.postDescription}>{post.description}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => handleLikePost(post.id)}>
                    <Ionicons name="heart-outline" size={24} color="#e63946" />
                  </TouchableOpacity>
                  <Text style={styles.likesCount}>{post.likes.length} Likes</Text>
                   <TouchableOpacity onPress={() => openCommentsModal(post.id, post.comments)}>
                        <Text style={styles.commentText}>Comment</Text>
                   </TouchableOpacity>
                </View>
              </Card.Content>
              <Card.Actions>
                {auth.currentUser && post.userId === auth.currentUser.uid && (
                  <>
                    <TouchableOpacity onPress={() => handleStartEdit(post)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePost(post.id)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </>
                )}
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>
        <View style={styles.toggleContainer}>
                  <TouchableOpacity
                  //onPress={() => navigation.navigate('UserProfileScreen', { userId: auth.currentUser.uid })}
                    onPress={() => setShowUserPosts(false)}
                    style={styles.profileButton}
                  >
                    <Ionicons name="home-outline" size={30} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                  //onPress={() => navigation.navigate('UserProfileScreen', { userId: auth.currentUser.uid })}
                    onPress={() => setIsCreatingPost(true)}
                    style={styles.profileButton}
                  >

                    <Ionicons name="add-circle-outline" size={30} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    //onPress={() => navigation.navigate('UserProfileScreen', { userId: auth.currentUser.uid })}
                    onPress={() => showOtherProfile(auth.currentUser.uid)}
                    style={styles.profileButton}
                  >
                    <Ionicons name="person-circle-outline" size={30} color="black" />
                  </TouchableOpacity>
                </View>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 15,
  },
  appbar: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  iconButton: {
    padding: 10,
  },
  appTitle: {
    fontSize: 20,
    color: '#6200ea',
    fontFamily: 'CustomFont-Bold',
  },
  greeting: {
    fontSize: 18,
    margin: 10,
    fontFamily: 'CustomFont-Bold',
  },
  createPostContainer: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  uploadSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#2a9d8f',
    padding: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewContainer: {
    marginLeft: 8,
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  noImageText: {
    color: '#aaa',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  menuTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#f1faee',
    padding: 8,
    borderRadius: 4,
    color: '#333',
  },
  selectedCategory: {
    marginBottom: 16,
    fontStyle: 'italic',
  },
  createPostButton: {
    marginVertical: 8,
    backgroundColor: "#6200ea",
    borderRadius: 4,
  },
  cancelPostButton: {
      marginVertical: 8,
      backgroundColor: "red",
      borderRadius: 4,
    },
  postCard: {
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#000',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    marginLeft: 8,
  },
  username: {
    fontWeight: 'bold',
  },
  category: {
    color: '#aaa',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  postDescription: {
    marginVertical: 8,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likesCount: {
    marginLeft: 8,
    color: '#333',
  },
  commentText: {
    color: '#457b9d',
  },
  toggleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',

  },
  profileButton: {
    marginHorizontal:25,
  },
  editButton: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
  },
  editButtonText: {
    color: '#457b9d',
  },
  deleteButton: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
  },
  deleteButtonText: {
    color: '#e63946',
  },

  categoryFilterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
  },
  filterButton: {
      marginRight: 10,
      minHeight: 50, // Fixed min width for consistent button sizes
  },
  label: {
      fontSize: 14,
      color: '#457b9d', // Default color for unselected buttons
  },
  postContainer: {
    marginVertical: 10,
  },

});

export default Community;
