import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Your Firebase configuration
import { useNavigation } from '@react-navigation/native';

export default function AssignedTrainer(){
  const [assignedTrainer, setAssignedTrainer] = useState(null);
  const [assignedTrainerId, setAssignedTrainerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchTrainerData = async () => {
      const userId = auth.currentUser?.uid; // Get the current user's ID
      if (!userId) {
        console.error('User not authenticated.');
        return;
      }

      try {
        // Fetch the user document
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const trainerId = userData.assignedTrainer; // Get assignedTrainer ID

          if (trainerId) {
            // Fetch the trainer document based on assignedTrainer ID
            const trainerDocRef = doc(db, 'trainers', trainerId);
            const trainerDoc = await getDoc(trainerDocRef);

            if (trainerDoc.exists()) {
              setAssignedTrainer(trainerDoc.data());
              setAssignedTrainerId(trainerId)
            } else {
              console.error('Trainer not found.');
            }
          }
        } else {
          console.error('User document not found.');
        }
      } catch (error) {
        console.error('Error fetching trainer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  const handleNavigateToChat = () => {
    if (assignedTrainer) {
      // Navigate to the interaction screen with the assigned trainer
      navigation.navigate('TrainerInteractionScreen', {
        trainerId: assignedTrainerId, // Pass trainerId to the chat screen
        userId: auth.currentUser?.uid, // Pass current userId
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading your assigned trainer...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {assignedTrainer ? (
        <View style={styles.trainerContainer}>
          <Text style={styles.trainerTitle}>Your Assigned Trainer</Text>
          <Text style={styles.trainerName}>{assignedTrainer.name}</Text>
          <Text style={styles.trainerSpecialty}>{assignedTrainer.specialty}</Text>

          <TouchableOpacity style={styles.chatButton} onPress={handleNavigateToChat}>
            <Text style={styles.chatButtonText}>Chat with {assignedTrainer.name}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>No assigned trainer found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   marginVertical:20,
   backgroundColor: '#F1F1FF',

  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  trainerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trainerName: {
    fontSize: 18,
    color: '#6200ea',
    marginBottom: 5,
  },
  trainerSpecialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  chatButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

