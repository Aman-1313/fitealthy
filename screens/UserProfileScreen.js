import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet, Image, Modal, ScrollView, TextInput, Button } from 'react-native';

import { setDoc, getDoc, doc, collection, query, where, onSnapshot, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
const UserProfileScreen = ({ userId }) => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState('n/a');
  const [followersCount, setFollowersCount] = useState('n/a');
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const currentUserId = auth.currentUser.uid;
  const screenWidth = Dimensions.get('window').width;
  const postImageWidth = (screenWidth / 3) - 10;

  useEffect(() => {
    const userRef = doc(db, 'users', userId);
    getDoc(userRef).then(docSnap => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });
  }, [userId]);

  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const userPostsQuery = query(postsRef, where('userId', '==', userId));
    const unsubscribe = onSnapshot(userPostsQuery, snapshot => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
    });
    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    const followsRef = collection(db, `users/${currentUserId}/following`);
    const unsubscribe = onSnapshot(followsRef, snapshot => {
      const following = snapshot.docs.map(doc => doc.id);
      setIsFollowing(following.includes(userId));
    });
    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    const followersRef = collection(db, `users/${userId}/followers`);
    const unsubscribe = onSnapshot(followersRef, (snapshot) => {
      setFollowersCount(snapshot.size);
    });
    return unsubscribe;
  }, [userId]);

  useEffect(() => {
    const followingRef = collection(db, `users/${userId}/following`);
    const unsubscribe = onSnapshot(followingRef, (snapshot) => {
      setFollowingCount(snapshot.size);
    });
    return unsubscribe;
  }, [userId]);

  const handleFollowToggle = async () => {
    try {
      const followRef = doc(db, `users/${currentUserId}/following/${userId}`);
      const followerRef = doc(db, `users/${userId}/followers/${currentUserId}`);
      if (isFollowing) {
        await deleteDoc(followRef);
        await deleteDoc(followerRef);
        setIsFollowing(false);
      } else {
        await setDoc(followRef, { followedAt: new Date() });
        await setDoc(followerRef, { followedAt: new Date() });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };
  const handleLike = async (postId) => {
      const user = auth.currentUser;
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
      });

    };


  // Add a new comment to a post
  const handleAddComment = async (postId, newComment) => {
    const user = auth.currentUser;
     if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let username = 'Unknown User';
        if (userDoc.exists()) {
          username = userDoc.data().username;
        }
        const postRef = doc(db, 'posts', postId);
          await updateDoc(postRef, {
            comments: arrayUnion({ username: username || 'Anonymous', text: newComment }),
          });
         setNewComment('');
     }

  };

  return (
     <>
     {userData && (
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={{ uri: userData.profileImage }} style={styles.profilePic} />
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>{userPosts.length}</Text>
              <Text style={styles.statsLabel}>Posts</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>{followersCount}</Text>
              <Text style={styles.statsLabel}>Followers</Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>{followingCount}</Text>
              <Text style={styles.statsLabel}>Following</Text>
            </View>
          </View>
          <Text style={styles.userName}>{userData.username}</Text>
          <TouchableOpacity
            style={styles.following}
            onPress={handleFollowToggle}
          >
            <Text style={styles.followButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>
     )}</>

  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical:10,
  },
  appTitle: {
      fontSize: 20,
      color: '#6200ea',
      fontFamily: 'CustomFont-Bold',
    },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,

  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  statsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsLabel: {
    fontSize: 14,
    color: '#888',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',

  },
  following: {
    alignSelf: 'center',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#6200ea',
  },
  followButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

});

export default UserProfileScreen;
