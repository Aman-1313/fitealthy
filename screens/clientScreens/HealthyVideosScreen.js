

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig'; // Import your firebase setup here
import YouTubeVideos from '../../components/YouTubeVideos';
import { collection, addDoc, getDocs, getDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';

const HealthyVideosScreen = () => {
  const [sampleVideos, setSampleVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch videos from Firebase Firestore
  const fetchVideosFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'videos')); // Replace with your collection name
      const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSampleVideos(videos); // Set fetched videos to state
    } catch (error) {
      console.error('Error fetching videos from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosFromFirestore();
  }, []); // Runs once on component mount

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  if (sampleVideos.length === 0) {
    return (
      <View style={styles.noVideosContainer}>
        <Text>No videos available.</Text>
      </View>
    );
  }

  return <YouTubeVideos videoIds={sampleVideos} />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVideosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HealthyVideosScreen;

