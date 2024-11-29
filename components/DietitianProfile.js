import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Avatar, Card, Button, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import { auth, db } from '../firebaseConfig'; // Assuming firebaseConfig is set up
import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import TrainerRatings from '../components/TrainerRatings';
import ContactUs from './ContactUs';
export default function DietitianProfile({ route, navigation }) {
  const { dietitian } = route.params; // Get the dietitian data passed from the previous screen
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
          const trainerDocRef = doc(db, 'trainers', dietitian.id); // Assuming trainer.id is the document ID

          // First, check if the user is already in the client's list to avoid multiple bookings
          const trainerDoc = await getDoc(trainerDocRef);
          const trainerData = trainerDoc.data();
          const isAlreadyClient = trainerData.clients?.includes(userId);

          if (isAlreadyClient) {
            navigation.navigate("TrainerInteractionScreen",  { trainerId: dietitian.id, userId: userId });
          } else {
            alert('Choose a Plan!');
            navigation.navigate("PaidPlansScreen", { trainer: dietitian }); // Navigate to the Paid Plans screen
          }
        } catch (error) {
          console.error("Error booking session:", error);
          alert("There was an error booking the session. Please try again.");
        } finally {
          setLoading(false);
        }
      };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        {/* Profile Header */}
        <View style={styles.header}>
          {dietitian.profileImage ? (
            <Image source={{ uri: dietitian.profileImage }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-outline" size={60} color="gray" style={styles.avatar} />
          )}
          <View style={styles.headerText}>
            <Text style={styles.name}>{dietitian.name.toUpperCase()}</Text>
            <Text style={styles.specialty}>{dietitian.specialty}</Text>
          </View>
        </View>
        <Divider style={styles.divider} />

        {/* Biography Section */}
        <Card.Content>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.bioText}>
            {dietitian.description || "No biography available."}
          </Text>
        </Card.Content>
        <Divider style={styles.divider} />

        {/* Rating and Clients Coached Section */}
        <Card.Content>
          <View style={styles.infoRow}>
            <MaterialIcons name="star" size={24} color="#fbc02d" />
            <Text style={styles.infoText}>Rating: {dietitian.rating.toFixed(1)} / 5</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="group" size={24} color="#6200ea" />
            <Text style={styles.infoText}>Clients Coached: {dietitian.clients && dietitian.clients.length > 0 ? dietitian.clients.length : 'N/A'}</Text>
          </View>
        </Card.Content>
        <Button mode="contained" onPress={handleBookSession} loading={loading} style={styles.button}>
                     Chat now
        </Button>
        <Button mode="contained" onPress={handleBookSession} loading={loading} style={styles.button}>
               Select Plans
        </Button>
      </Card>

      {/* Services Offered */}
      <Card style={styles.card}>
        <Card.Title title="Services Offered" />
        <Divider />
        <Card.Content>
          <Text style={styles.serviceText}>• Personalized Diet Plans</Text>
          <Text style={styles.serviceText}>• Nutritional Guidance</Text>
          <Text style={styles.serviceText}>• Meal Prep Assistance</Text>
        </Card.Content>
      </Card>
      <View style={styles.helpCard}>
           <Text style={styles.title}>Need Help?</Text>
           <Text style={styles.cardText}>Talk to a counsellor to know the process</Text>

          <ContactUs/>
      </View>
      <TrainerRatings trainerId={dietitian.id} />



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#ffffff',
    padding: 10,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  avatar: {
       width: 100,
      height: 100,
      borderRadius: 10, // Slightly rounded corners
      borderWidth: 2,
      borderColor: '#555',
      backgroundColor: '#ccc',
    },
  headerText: {
    marginHorizontal: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
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
  contactText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  button: {
      backgroundColor: '#6200ea',
      borderRadius: 8,
      marginVertical: 10,
    },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  helpCard :{
        marginVertical: 10,
        borderRadius: 12,
        backgroundColor: '#f1f1ff',
        overflow: 'hidden',
        padding: 20,
        borderWidth: 1,  // Adds a border to the card
        borderColor: '#000',
  },
});
