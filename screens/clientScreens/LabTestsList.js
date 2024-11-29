import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const LabTestsList = ({ navigation }) => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    // Fetch lab tests data from Firebase Firestore
    const fetchLabTests = async () => {
      try {
        const labTestsCollection = collection(db, 'labTests');
        const labTestsSnapshot = await getDocs(labTestsCollection);
        const labTestsData = labTestsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTests(labTestsData);
      } catch (error) {
        console.error("Error fetching lab tests: ", error);
      }
    };

    fetchLabTests();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LabTestDetails', { testId: item.id })}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#555',
  },
});

export default LabTestsList;
