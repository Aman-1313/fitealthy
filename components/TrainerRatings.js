import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path as needed
import { MaterialIcons } from '@expo/vector-icons'; // For icons
const TrainerRatings = ({ trainerId }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsCollection = collection(db, 'trainers', trainerId, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsCollection);
        const ratingsList = await Promise.all(
          ratingsSnapshot.docs.map(async (docu) => {
            const ratingData = docu.data();
            let username = 'Unknown User';

            // Only attempt to fetch username if userId exists
            if (ratingData.userId) {
              try {
                const userId = ratingData.userId;
                const userDoc = await getDoc(doc(db, 'users', userId));
                username = userDoc.exists() ? userDoc.data().username : 'Unknown User';
              } catch (error) {
                console.error('Error fetching user document:', error);
              }
            }

            return {
              id: docu.id,
              rating: ratingData.rating,
              username: username,
            };
          })
        );
        setRatings(ratingsList);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [trainerId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  if (ratings.length === 0) {
    return <Text style={styles.noRatingsText}>No ratings yet.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Ratings</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {ratings.map((rating) => (
          <View key={rating.id} style={styles.ratingCard}>
            <Text style={styles.username}>{rating.username.toUpperCase()}</Text>
            <View style={styles.infoRow}>
                <Text style={styles.rating}>Rating: {rating.rating.toFixed(1)}</Text>
                <MaterialIcons name="star" size={24} color="#fbc02d" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRatingsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#888',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingCard: {
    marginRight: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  username: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  rating: {
    color: '#555',
    fontSize: 16,
  },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
});

export default TrainerRatings;
