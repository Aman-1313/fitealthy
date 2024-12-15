import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity  } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firebase configuration
export default function StoryOfTheMonth() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const toggleDescription = () => {
      setShowFullDescription(!showFullDescription);
  };
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyDoc = await getDoc(doc(db, 'stories', 'currentMonth')); // Firestore document reference
        if (storyDoc.exists()) {
          setStory(storyDoc.data());
        } else {
          console.log('No such story document!');
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, []);

  if ( loading) {
      return <ActivityIndicator size="large" color="#00ff00" />;
    }

  return (
    story ? (
      <View style={styles.container}>
        <Text style={styles.title}>{story.title}</Text>
        <Image source={{ uri: story.imageUrl }} style={styles.image} resizeMode="contain" />
        <Text style={styles.description}>
            {showFullDescription ? story.description : `${story.description.slice(0, 100)}...`}
        </Text>

        <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.viewMoreButton}>
              {showFullDescription ? 'View Less' : 'View More'}
            </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <Text style={styles.errorText}>No story available for this month.</Text>
    )
  );
}

const styles = StyleSheet.create({
  container: {
     backgroundColor: '#ffffff',
      borderRadius: 12,
      elevation: 4,
      padding: 16,
      borderWidth: 1,
      borderColor: '#000',
      marginVertical: 10,
  },
  title: {
    fontSize: 20,
    color: '#6200ea',
    marginBottom: 16,
    fontWeight: "bold",
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#34495E',
    lineHeight: 24,

  },
  viewMoreButton: {
      fontSize: 14,
      color: '#6200ea',
      fontWeight: 'bold',
      textAlign: 'right',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
