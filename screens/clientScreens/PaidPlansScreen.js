import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, FlatList, View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Card, Button, SegmentedButtons } from 'react-native-paper';
import { collection, doc, updateDoc, arrayUnion, getDoc, getDocs,arrayRemove } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function PaidPlansScreen({ route, navigation }) {
  const [paidPlans, setPaidPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDurations, setSelectedDurations] = useState({});
  const [trainerInfo, setTrainerInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPlanDetails, setCurrentPlanDetails] = useState(null);
  const { trainer } = route.params;
  const [bookPlanDetails, setBookPlanDetails] = useState(null);


 const handleBookSession = async () => {
     const userId = auth.currentUser?.uid;
     if (!userId) {
         alert('You must be logged in to book a session.');
         return;
     }
    console.log(bookPlanDetails.id)
     // Ensure currentPlanDetails is not null or undefined
     if (!currentPlanDetails || !bookPlanDetails.id) {
         alert("Please select a valid plan.");
         return;
     }

     const selectedDuration = selectedDurations[bookPlanDetails.id];
     console.log(selectedDuration)
     if (!selectedDuration) {
         alert("Please select a valid duration for the plan.");
         return;
     }

     setLoading(true);

     try {
         // User and Trainer Document References
         {/*const userDocRef = doc(db, 'users', userId);
         const trainerDocRef = doc(db, 'trainers', trainer.id);
         const userDoc = await getDoc(userDocRef);
         const trainerDoc = await getDoc(trainerDocRef);

         if (!userDoc.exists() || !trainerDoc.exists()) {
             alert("Could not fetch user or trainer information.");
             setLoading(false);
             return;
         }

         const userData = userDoc.data();
         const trainerData = trainerDoc.data();
         const isAlreadyClient = trainerData.clients?.includes(userId);

         // Check if user already has a paid plan
         if (userData.hasPaidPlan) {
             // Remove user from current trainer's current clients
             if (userData.assignedTrainer) {
                 const currentTrainerDocRef = doc(db, 'trainers', userData.assignedTrainer);
                 await updateDoc(currentTrainerDocRef, {
                     currentclients: arrayRemove(userId)
                 });
             }

             // Assign user to new trainer's current clients, retain in clients
             await updateDoc(trainerDocRef, {
                 currentclients: arrayUnion(userId),
                 clients: arrayUnion(userId),
             });
             await updateDoc(userDocRef, {
                  assignedTrainer: trainer.id,
                  hasPaidPlan: true
              });
         } else {
             // If user does not have a paid plan
             await updateDoc(trainerDocRef, {
                 clients: arrayUnion(userId),
                 currentclients: arrayUnion(userId),
             });

             // Update user's assigned trainer and mark as having a paid plan
             await updateDoc(userDocRef, {
                 assignedTrainer: trainer.id,
                 hasPaidPlan: true
             });
         }

         // Add selected plan details to the user's database
         const selectedPlanDetails = {
             planId: bookPlanDetails.id,
             duration: selectedDuration.duration,
             price: selectedDuration.price,
         };

         await updateDoc(userDocRef, {
             selectedPlan: selectedPlanDetails
         });

         alert('You have successfully booked a session!');*/}
         if(selectedDuration.link){
         if(selectedDuration.duration==8){
            navigation.navigate('StripeWebView', {link: selectedDuration.link})
         }else if(selectedDuration.duration==24){
            navigation.navigate('StripeWebView', {link: selectedDuration.link})
         }else{
            navigation.navigate('StripeWebView', {link: selectedDuration.link})
         }}

     } catch (error) {
         console.error("Error booking session:", error);
         alert("There was an error booking the session. Please try again.");
     } finally {
         setLoading(false);
     }
 };



  useEffect(() => {
    const fetchTrainerInfo = async () => {
      if (!trainer) return;

      try {
        const trainerDocRef = doc(db, 'trainers', trainer.id);
        const trainerDoc = await getDoc(trainerDocRef);
        if (trainerDoc.exists()) {
          setTrainerInfo(trainerDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching trainer data:", error);
      }
    };

    const fetchPaidPlans = async () => {
      try {
        const plansCollection = collection(db, 'paidPlans');
        const plansSnapshot = await getDocs(plansCollection);
        const plansList = plansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setPaidPlans(plansList);

        // Initialize durations and prices for each plan with default to 8 weeks price
        const initialDurations = plansList.reduce((acc, plan) => {
          acc[plan.id] = { duration: '8', price: plan.durationDetails['8'].price || 0 }; // Default to 8 weeks price
          return acc;
        }, {});
        setSelectedDurations(initialDurations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching paid plans:", error);
        setLoading(false);
      }
    };

    fetchTrainerInfo();
    fetchPaidPlans();
  }, [trainer]);

  const renderTrainerInfo = () => {
    if (!trainerInfo) return null;

    return (
      <Card style={styles.trainerCard}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{trainerInfo.name.toUpperCase()}</Text>
          {trainerInfo.profileImage ? (
            <Image source={{ uri: trainerInfo.profileImage }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="gray" />
          )}
        </View>
        <Card.Content>
          <Text style={styles.cardText}>Rating: {trainerInfo.rating}/5</Text>
          <Text style={styles.cardText}>Clients Coached: {trainerInfo.clients && trainerInfo.clients.length > 0 ? trainerInfo.clients.length : 'N/A'}</Text>
        </Card.Content>
      </Card>
    );
  };

  const handleDurationChange = (planId, duration) => {
    const updatedPrice = paidPlans.find(plan => plan.id === planId)?.durationDetails[duration]?.price || 0;
    const updatedLink = paidPlans.find(plan => plan.id === planId)?.durationDetails[duration]?.link || '';
    setSelectedDurations(prevState => ({
      ...prevState,
      [planId]: { duration, price: updatedPrice, link: updatedLink }
    }));
  };

  const renderPlan = ({ item }) => {
    const selectedDuration = selectedDurations[item.id];
    const planDetails = item.durationDetails[selectedDuration.duration];
    setBookPlanDetails(item);
    setCurrentPlanDetails(planDetails);
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.planTitle}>{item.name}</Text>
          <Text style={styles.planDescription}>{item.description}</Text>

          <SegmentedButtons
            value={selectedDuration?.duration || '8'}
            onValueChange={(duration) => handleDurationChange(item.id, duration)}
            buttons={[
              { value: '8', label: '8 Weeks' },
              { value: '24', label: '24 Weeks' },
              { value: '48', label: '48 Weeks' }
            ]}
            style={styles.segmentedButtons}
          />

          <Text style={styles.planPrice}>
            Price ${typeof selectedDuration?.price === 'number' ? selectedDuration.price.toFixed(2) : 0.00}/week
          </Text>


        </Card.Content>
        <Card.Actions>
          <Button
            mode="text"
            onPress={() => {
              setCurrentPlanDetails(planDetails);
              console.log(currentPlanDetails);
              setModalVisible(true);
            }}
          >
            See What This Plan Offers
          </Button>
          <Button mode="contained" onPress={handleBookSession}>
            Select Plan
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Loading Plans...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <View style={styles.appbar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AccountInfo')}>
          <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Plans</Text>
    </View>
    <Text style={styles.header}>Selected Trainer</Text>
      {renderTrainerInfo()}
      <Text style={styles.header}>Available Plans</Text>
      <FlatList
        data={paidPlans}
        keyExtractor={(item) => item.id}
        renderItem={renderPlan}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal for Plan Details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{currentPlanDetails?.details}</Text>
            <Button mode="contained" onPress={() => setModalVisible(false)}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: 'CustomFont-Bold',
    color: '#333',
  },
  trainerCard: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    padding: 20,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  card: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
    marginVertical: 8,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    paddingBottom: 20,
  },
  segmentedButtons: {
      marginVertical: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
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
});
