import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator,TouchableOpacity, } from 'react-native';
import { Avatar } from 'react-native-paper';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
const ClientInfoScreen = ({ route, navigation }) => {
  const { clientId } = route.params; // Get clientId from route parameters
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const clientDocRef = doc(db, 'users', clientId); // Access the 'users' collection using clientId
      const clientDoc = await getDoc(clientDocRef);
      if (clientDoc.exists()) {
        setClientData(clientDoc.data());
      } else {
        console.log('No such client document!');
      }
    } catch (error) {
      console.error('Error fetching client data: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading client information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <View style={styles.appbar}>
             <TouchableOpacity
                 style={styles.iconButton}
                 onPress={() => navigation.navigate('TrainerAccountInfo')}
             >
                 <Ionicons name="menu" size={30} color="#6200ea" />
             </TouchableOpacity>
             <Text style={styles.appTitle}>ALPHA</Text>
           </View>
      <View style={styles.infoSection}>
        <Text style={styles.title}>Client Information</Text>

        <Text style={styles.infoLabel}>Name:</Text>
        <Text style={styles.infoValue}>{clientData.username || 'N/A'}</Text>

        <Text style={styles.infoLabel}>Gender:</Text>
        <Text style={styles.infoValue}>{clientData.gender || 'N/A'}</Text>

        <Text style={styles.infoLabel}>Age:</Text>
        <Text style={styles.infoValue}>{clientData.age || 'N/A'}</Text>

        <Text style={styles.infoLabel}>Fitness Goal:</Text>
        <Text style={styles.infoValue}>{clientData.fitnessGoal || 'N/A'}</Text>

        <Text style={styles.infoLabel}>Activity Level:</Text>
        <Text style={styles.infoValue}>{clientData.activityLevel || 'N/A'}</Text>

        <Text style={styles.infoLabel}>Height:</Text>
        <Text style={styles.infoValue}>{clientData.height || 'N/A'} cm</Text>

        <Text style={styles.infoLabel}>Weight:</Text>
        <Text style={styles.infoValue}>{clientData.weight || 'N/A'} kg</Text>
        {/* Add more client details as needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  clientName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoSection: {
     backgroundColor: '#ffffff',
     borderRadius: 12,
     elevation: 4,
     padding: 16,
     borderWidth: 1,
     borderColor: '#000',
     marginVertical: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginVertical: 10,
    fontSize: 22,
    color: '#333',
    fontFamily: 'CustomFont-Bold',
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
});

export default ClientInfoScreen;
