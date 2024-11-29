import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Avatar, Button, Divider } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';  // Make sure this path is correct
import { Ionicons } from '@expo/vector-icons';
export default function WorkoutTrainers({ navigation }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      setLoading(true); // make sure loading is set to true at the start
      try {
        // Create a query to fetch trainers where trainerType is "fitness"
        const trainersCollection = collection(db, 'trainers');
        const fitnessTrainersQuery = query(trainersCollection, where('trainerType', '==', 'fitness'));

        // Get the documents from the query
        const trainerSnapshot = await getDocs(fitnessTrainersQuery);
        const trainersList = trainerSnapshot.docs.map(doc => ({
          id: doc.id, // Include the document ID if needed
          ...doc.data() // Spread the document data
        }));

        setTrainers(trainersList); // Update the state with fetched trainers
      } catch (error) {
        console.error("Error fetching fitness trainers:", error);
      } finally {
        setLoading(false); // Make sure loading is stopped in the end
      }
    };

    fetchTrainers();
  }, []);

  const renderTrainer = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TrainerProfile', { trainer: item })}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Avatar.Image source={{ uri: item.imageUrl }} size={70} style={styles.avatar} />
        </View>
        <Card.Content>
          <Text style={styles.cardText}>
            {item.experience} years of experience. Specializes in {item.specialty}.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button  mode="outlined" style={styles.customButton} labelStyle={styles.customButtonLabel} onPress={() => navigation.navigate('TrainerProfile', { trainer: item })}>
            View Profile
          </Button>
        </Card.Actions>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Loading Trainers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AccountInfo')}
        >
            <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Fitness Trainers</Text>
      </View>

      <FlatList
        data={trainers}
        keyExtractor={(item) => item.name}
        renderItem={renderTrainer}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F1FF',
    padding: 16,
  },
  card: {
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      padding: 10,
      borderWidth: 1,  // Adds a border to the card
      borderColor: '#000',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    marginTop: 8,
    color: '#555',
    textAlign: 'justify',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ea',
  },
  appbar: {
     height: 60,                    // Height of the appbar
     backgroundColor: '#6200ee',     // Background color (customizable)
     flexDirection: 'row',           // Align items horizontally
     alignItems: 'center',           // Vertically center the icon and title
     paddingHorizontal: 15,          // Add horizontal padding for spacing
     justifyContent: 'space-between', // Space between the icon and title
     elevation: 4,                   // Adds shadow to the appbar for a material effect
     borderRadius: 10,
     marginBottom: 20,
  },
  iconButton: {
       padding: 10,                   // Adds padding around the icon for better tap experience
  },
  appTitle: {
   fontSize: 20,                  // Title size
   fontWeight: 'bold',            // Bold title
   color: '#fff',                 // Title color
  },
  greeting: {
      marginTop: 5,
      fontSize: 18,
      color: '#555',
      textAlign: 'center',
      marginBottom: 16,
    },
  listContent: {
    paddingBottom: 20,
  },
  customButton: {
      borderColor: '#000000',  // Black border
      backgroundColor: '#ffffff',  // White background
      borderWidth: 1,  // Border width for the button
      borderRadius: 8,  // Rounded corners
      paddingVertical: 5,  // Vertical padding inside the button
      paddingHorizontal: 20,  // Horizontal padding inside the button
  },
  customButtonLabel: {
      color: '#000000',  // Black font color
      fontWeight: 'bold',  // Make the text bold if needed
  },
  avatar: {
      backgroundColor: '#f5f5f5',
    },
});
