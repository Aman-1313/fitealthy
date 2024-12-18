import React, { useState, useEffect, useCallback  } from 'react';
import {ScrollView, FlatList, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig'; // Assuming these are initialized
import AssignedTrainer from '../../components/AssignedTrainer';
import DietScreen from './DietScreen';
import GenerateDietPlan from './GenerateDietPlan';
import AssignDietScreen from '../trainerScreens/AssignDietScreen';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function PaidFeaturesScreen({navigation}) {
  const [isPaid, setIsPaid] = useState(false); // State to manage paid status
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0); // Current rating
  const [submitted, setSubmitted] = useState(false); // Whether the rating is submitted
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  useFocusEffect(
      useCallback(() => {
    const checkUserSubscription = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setLoading(false);
        alert('You must be logged in to access this screen.');
        navigation.navigate('Login'); // Redirect to login if not logged in
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        const userData = userDoc.data();
        setIsPaid(userData?.hasPaidPlan || false); // Check if the user has a paid plan
        const trainerId = userData.assignedTrainer;
        if (trainerId) {
          const ratingDoc = await getDoc(doc(db, 'trainers', trainerId, 'ratings', userId));
          if (ratingDoc.exists()) {
            setAlreadyRated(true); // User has already rated
            setRating(ratingDoc.data().rating); // Set the rating the user has already given
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSelectedPlan = async () => {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            alert('You must be logged in to access this screen.');
            navigation.navigate('Login'); // Redirect to login if not logged in
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

    checkUserSubscription();
  }, []) // Empty dependency array to only reset data when screen refocuses
    );

  const handleSubmitRating = async (newRating) => {
    if (alreadyRated) {
      // If the user has already rated, prevent further rating submission
      alert('You have already rated this trainer.');
      return;
    }
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
           const trainerRef = doc(db, 'trainers', trainerId);
                 const trainerDoc = await getDoc(trainerRef);

                 // Fetch current rating and rating count from trainer
                 const { rating: currentRating, ratingCount } = trainerDoc.data();

                 // Update the trainer's rating and rating count
                 const updatedRatingCount = ratingCount ? ratingCount + 1 : 1;
                 const updatedRating = ((currentRating || 5) * ratingCount + newRating) / updatedRatingCount;

                 await updateDoc(trainerRef, {
                   rating: updatedRating,
                   ratingCount: updatedRatingCount,
                 });

                 // Store the user's rating to ensure they can't rate again
                 await setDoc(doc(db, 'trainers', trainerId, 'ratings', userId), {
                   rating: newRating,
                   userId: userId,
                   timestamp: new Date(),
                 });

                 setSubmitted(true);
                 setRating(newRating);
                 setAlreadyRated(true);
          }
        }
      }catch (error) {
          console.error('Error fetching trainer data:', error);
      }
  };
  const renderHeader = () => {
    return (
      <View style={styles.appbar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AccountInfo')}
        >
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>MY PLAN</Text>
      </View>
    );
  };
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleSubmitRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={40}
            color={i <= rating ? '#ffcc00' : '#ccc'}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Checking your subscription status...</Text>
      </View>
    );
  }

  if (!isPaid) {
    return (
      <FlatList
            data={[1]} // Just a placeholder, FlatList needs data array
            keyExtractor={(item) => item.toString()}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }) => (
              <ScrollView style={styles.container} nestedScrollEnabled={true}>
                <View style={styles.card}>
                  <Text style={styles.title}>Restricted Content</Text>
                  <Text style={styles.message}>
                    You need to subscribe to access these exclusive features.
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('DietPlans')}
                    labelStyle={{ color: '#fff', fontFamily: 'CustomFont-Bold' }}
                    style={styles.subscribeButton}
                  >
                    Choose Subscription
                  </Button>
                </View>
                <GenerateDietPlan />
              </ScrollView>
            )}
            contentContainerStyle={styles.contentContainerStyle} // Ensure padding and layout
          />
    );
  }

  // Render the content for users with a paid plan
  return (
    <ScrollView style={styles.container}>
      <View style={styles.appbar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('AccountInfo')}
        >
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>MY PLAN</Text>
      </View>

      {!selectedPlan ? (
        <Text style={{ padding: 20, fontSize: 16 }}>No plan selected.</Text>
         ) : ( <View style={styles.ratingContainer}>
                          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Your Selected Plan</Text>
                          <Text style={{ fontSize: 16 }}>{selectedPlan.planId}</Text>
                          <Text style={{ fontSize: 16 }}>Duration: {selectedPlan.duration} weeks</Text>
                          <Text style={{ fontSize: 16 }}>Price: ${selectedPlan.price}</Text>
                      </View>
              )}
      <Text style={styles.title}>Exclusive Features</Text>
      <AssignedTrainer />

      <DietScreen/>

        <View style={styles.ratingContainer}>
          <Text style={styles.title}>Rate Your Trainer</Text>
          {!alreadyRated ? (
          <View style={styles.starContainer}>
            {renderStars()}
          </View>
           ) : (<Text>You have already rated your trainer.</Text>
                )}
          {submitted && <Text style={styles.thankYou}>Thank you for your rating!</Text>}
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        elevation: 4,
        padding: 16,
        borderWidth: 1,
        borderColor: '#000',
        margin:15,
  },
  title: {
    fontSize: 24,
    fontFamily: 'CustomFont-Bold',
    marginVertical: 10,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  star: {
    marginHorizontal: 5,
  },
  ratingContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginVertical:20,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  thankYou: {
    color: 'green',
    marginTop: 10,
  },
  featureList: {
    marginTop: 20,
    width: '100%',
  },
  featureItem: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: '#6200ea',
    borderRadius: 8,
    marginTop: 10,
  },
  message: {
    fontFamily: 'CustomFont',
  },

});