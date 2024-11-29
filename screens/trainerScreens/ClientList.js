import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, Image } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../../firebaseConfig';
import { doc, getDoc, getDocs, query, collection, where } from 'firebase/firestore';


const ClientList = ({navigation}) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchClients = async () => {
      const trainerUid = auth.currentUser.uid;
      const trainerDoc = await getDoc(doc(db, 'trainers', trainerUid));

      if (trainerDoc.exists()) {
        const clientIds = trainerDoc.data().clients || [];

        // Fetch client details based on their IDs from the 'users' collection
        const clientsQuery = query(collection(db, 'users'), where('__name__', 'in', clientIds));
        const querySnapshot = await getDocs(clientsQuery);

        const fetchedClients = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(fetchedClients);
      } else {
        console.error('Trainer not found!');
      }

      setLoading(false);
    };

    fetchClients();
  }, []);

  const handleChatPress = (client) => {
    // Navigate to the TrainerInteractionScreen with the selected client details
    navigation.navigate('TrainerInteractionScreen', { trainerId: auth.currentUser.uid, userId: client.id  });
  };

  const handleDietPress = (client) => {
      // Navigate to the TrainerInteractionScreen with the selected client details
      navigation.navigate('AssignDietScreen', { userId: client.id  });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (clients.length === 0) {
    return <Text>No clients found!</Text>;
  }

  return (
    <View style={styles.listContainer}>
    <View style={styles.appbar}>
      <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('TrainerAccountInfo')}
      >
          <Ionicons name="menu" size={30} color="#6200ea" />
      </TouchableOpacity>
      <Text style={styles.appTitle}>Clients</Text>
    </View>
    <Text style={styles.title}>Client List</Text>
    <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        contentContainerStyle={clients.length === 0 ? styles.emptyContainer : styles.listContainer} // Adjust container style
        renderItem={({ item }) => (
          <View style={styles.clientCard} >
            <View style={styles.userInfo}>
                {item.profileImage? (
                    <Image source={{ uri: item.profileImage }} style={styles.avatar} />
                  ) : (
                    <Ionicons name="person-circle" size={80} color="gray" />
                  )}

                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{item.username}</Text>
                  <Text style={styles.clientEmail}>{item.email}</Text>
                </View>
            </View>
            <View style={styles.clientButtons}>
              <Button mode="contained-tonal" style={styles.button} onPress={() => handleDietPress(item)}> Diet Plan </Button>
              <Button mode="contained-tonal" style={styles.button} onPress={() => handleChatPress(item)}> Chat </Button>
              <Button mode="contained-tonal" style={styles.button} onPress={() => navigation.navigate('ClientInfoScreen', { clientId: item.id })}> Info </Button>

            </View>
           </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No clients available.</Text>}
      />
    </View>


  );
};

const styles = StyleSheet.create({
  listContainer: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
    },
    emptyContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    clientCard: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginVertical:10,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 10,
    },
    clientInfo: {
     flexDirection: 'column',
     alignItems: 'center',

    },
    userInfo : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap : 'wrap',
        margin : 20,
        alignItems: 'center',
    },
    clientName: {
      fontWeight: 'bold',
      fontSize: 16,
      marginRight: 10,
    },
    clientEmail: {
      color: '#777',
      marginRight: 10,
    },
    clientButtons: {
     flexDirection: 'row',
     justifyContent: 'space-evenly',
     flexWrap : 'wrap',
     marginBottom: 10,
    },
    emptyText: {
      textAlign: 'center',
      color: '#999',
      fontSize: 16,
      marginTop: 20,
    },
    button: {
      borderRadius: 8,
      marginVertical:5,
      width: '40%',
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
    title: {

      marginVertical: 10,
      fontSize: 22,
      color: '#333',
      fontFamily: 'CustomFont-Bold',
    },
});

export default ClientList;
