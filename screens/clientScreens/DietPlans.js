import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, TextInput, Image } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import ContactUs from '../../components/ContactUs';

export default function DietPlans({ navigation }) {
  const [dietitians, setDietitians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDietitians, setFilteredDietitians] = useState([]);

  useEffect(() => {
    const fetchDietitians = async () => {
      setLoading(true);
      try {
        const trainersCollection = collection(db, 'trainers');
        const dietitiansQuery = query(trainersCollection, where('trainerType', '==', 'diet'));
        const dietitianSnapshot = await getDocs(dietitiansQuery);
        const dietitiansList = dietitianSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDietitians(dietitiansList);
        setFilteredDietitians(dietitiansList); // Initial load with all data
      } catch (error) {
        console.error("Error fetching dietitians:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDietitians();
  }, []);

  // Filter dietitians based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      setFilteredDietitians(dietitians.filter(dietitian =>
        dietitian.name.toLowerCase().includes(query.toLowerCase())
      ));
    } else {
      setFilteredDietitians(dietitians);
    }
  };

  const renderDietitian = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
        {item.profileImage ? (<Image source={{ uri: item.profileImage }} style={styles.avatar} />) :
          (<Ionicons name="person-circle-outline" size={100} color="gray" />)}
      </View>
      <Card.Content>
        <Text style={styles.cardText}>Experience: {item.experience} years</Text>
        <Text style={styles.cardText}>Clients Coached: {item.clients && item.clients.length > 0 ? item.clients.length : 'N/A'}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" style={styles.customButton} labelStyle={styles.customButtonLabel} onPress={() => navigation.navigate('DietitianProfile', { dietitian: item })}>
          View Profile
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Loading Dietitians...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AccountInfo')}>
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Certified Dietitians</Text>
      </View>

      <View style={styles.helpCard}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.cardText}>Talk to a counsellor to know the process</Text>
        <ContactUs />
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Search dietitians by name"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor = '#ccc'
      />

      <FlatList
        data={filteredDietitians}
        keyExtractor={(item) => item.id}
        renderItem={renderDietitian}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#6200ea',
  },
  card: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    
    padding: 20,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  helpCard :{
      marginVertical: 10,
      borderRadius: 12,
      backgroundColor: '#f1f1ff',
      
      padding: 20,
      borderWidth: 1,  // Adds a border to the card
      borderColor: '#000',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,  // Allow the title to take available space
    paddingRight: 10,  // Add space between title and avatar
  },
  avatar: {
     width: 100,
    height: 100,
    borderRadius: 10, // Slightly rounded corners
    borderWidth: 2,
    borderColor: '#555',
    backgroundColor: '#ccc',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  cardText: {
    fontSize: 16,
    marginTop: 8,
    color: '#555',
    textAlign: 'justify',
  },
  listContent: {
    paddingBottom: 20,
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
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 15,
  },
  appbar: {
    height: 60,                    // Height of the appbar
    backgroundColor: '#fff',     // Background color (customizable)
    flexDirection: 'row',           // Align items horizontally
    alignItems: 'center',           // Vertically center the icon and title
    paddingHorizontal: 10,          // Add horizontal padding for spacing
    justifyContent: 'space-between', // Space between the icon and title
    borderRadius: 10,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  iconButton: {
      padding: 10,                   // Adds padding around the icon for better tap experience
  },
  appTitle: {
     fontSize: 20,                  // Title size
    color: '#6200ea',                 // Title color
    fontFamily: 'CustomFont-Bold',
  },
  greeting: {
    marginTop: 5,
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
   searchBar: {
      height: 40,
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
});
