// FetchSelectedPlan.js

import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { Button, Divider, Avatar } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function FetchSelectedPlan({navigation}) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSelectedPlan = async () => {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setLoading(false);
        alert('You must be logged in to access this screen.');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSelectedPlan(userData.selectedPlan || null);
        }
      } catch (error) {
        console.error("Error fetching selected plan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedPlan();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#6200ea" />
        <Text>Loading selected plan...</Text>
      </View>
    );
  }

  return selectedPlan ? (
    <View style={styles.Container} >
        <View style={styles.planContainer}>
            <Text style={styles.planTitle}>Your Selected Plan</Text>
            <Text style={styles.planText}>Plan ID: {selectedPlan.planId}</Text>
            <Text style={styles.planText}>Duration: {selectedPlan.duration} weeks</Text>
            <Text style={styles.planText}>Price: ${selectedPlan.price}</Text>
          </View>
        <Button mode="contained" style={styles.button1} onPress={() =>  navigation.navigate('DietPlans')}>
            Edit Subscription
        </Button>

        <Button mode="contained" style={styles.button2} onPress={() =>  console.log('Cancel')}>
            Cancel Subscription
        </Button>
    </View>
  ) : (
    <Text style={styles.noPlanText}>No plan selected.</Text>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  Container: {
      padding:18,
      backgroundColor: '#fff',
      flex:1,
    },
  planContainer: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,

  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  planText: {
    fontSize: 16,
  },
  noPlanText: {
    padding: 20,
    fontSize: 16,
  },
  button2: {
    backgroundColor: 'red',
    marginTop:10
  },
  button1: {
      marginTop:10,
    }

});
