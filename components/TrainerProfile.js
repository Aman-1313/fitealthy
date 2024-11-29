import React, { useState }  from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Card, Divider, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig'; // Assuming firebaseConfig is set up
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';

export default function TrainerProfile({ route, navigation }) {
  const { trainer } = route.params;
  const [loading, setLoading] = useState(false);

    // Function to add the user to the trainer's clients in Firestore
    const handleBookSession = async () => {
        const userId = auth.currentUser?.uid; // Get the current user's ID
        if (!userId) {
          alert('You must be logged in to book a session.');
          return;
        }

        setLoading(true);
        try {
          const trainerDocRef = doc(db, 'trainers', trainer.id); // Assuming trainer.id is the document ID

          // First, check if the user is already in the client's list to avoid multiple bookings
          const trainerDoc = await getDoc(trainerDocRef);
          const trainerData = trainerDoc.data();
          const isAlreadyClient = trainerData.clients?.includes(userId);

          if (isAlreadyClient) {
            navigation.navigate("TrainerInteractionScreen",  { trainerId: trainer.id, userId: userId });
          } else {
            alert('Choose a Plan!');
            navigation.navigate("PaidPlansScreen",  { trainer: trainer });
          }
        } catch (error) {
          console.error("Error booking session:", error);
          alert("There was an error booking the session. Please try again.");
        } finally {
          setLoading(false);
        }
      };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Avatar.Image source={{ uri: trainer.imageUrl }} size={100} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{trainer.name}</Text>
            <Text style={styles.experience}>{trainer.specialty}</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        {/* Biography Section */}
        <Card.Content>
          <Text style={styles.label}>Biography</Text>
          <Text style={styles.info}>
            {trainer.description || "No biography available."}
          </Text>
        </Card.Content>

        {/* Rating and Clients Coached Section */}
        <Divider style={styles.divider} />
        <Card.Content>
          <View style={styles.infoRow}>
            <MaterialIcons name="star" size={24} color="#fbc02d" />
            <Text style={styles.infoText}>Rating: {trainer.rating} / 5</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="group" size={24} color="#6200ea" />
            <Text style={styles.infoText}>Clients Coached: {trainer.clients.length || "N/A"}</Text>
          </View>
        </Card.Content>


      </Card>
      <Card style={styles.card}>
          <Card.Title title="Services Offered" />
          <Divider />
          <Card.Content>
            <Text style={styles.serviceText}>• Personalized Diet Plans</Text>
            <Text style={styles.serviceText}>• Nutritional Guidance</Text>
            <Text style={styles.serviceText}>• Meal Prep Assistance</Text>
          </Card.Content>
      </Card>
      <Button mode="contained" onPress={handleBookSession} loading={loading} style={styles.bookButton}>
              Book a Session
      </Button>
      <Button mode="contained" onPress={handleBookSession} loading={loading} style={styles.bookButton}>
               Chat now
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
   marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  experience: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
  },
  bookButton: {
     marginTop: 10,
     backgroundColor: '#6200ea',
     borderRadius: 8,
  },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    infoText: {
      fontSize: 16,
      color: '#555',
      marginLeft: 10,
    },
    serviceText: {
      fontSize: 16,
      margin: 8,
      color: '#555',
    },
});
