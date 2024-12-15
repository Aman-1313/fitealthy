import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Avatar, Button, Menu, Divider, Provider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
const Tracker = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');

    const [userData, setUserData] = useState(null);
    const [bmi, setBmi] = useState(null);
    const [bmiInterpretation, setBmiInterpretation] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          if(!data.height){
              navigation.navigate('UserDataForm');
          }
          const heightInMeters = data.height / 100;
          const calculatedBmi = data.weight / (heightInMeters * heightInMeters);
          setBmi(calculatedBmi.toFixed(2));
          setBmiInterpretation(getBmiInterpretation(calculatedBmi));
          setUsername(data.username)
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Could not fetch user data.');
      }
    };

    useEffect(() => {
      fetchUserData();
    }, [userId]);

    const getBmiInterpretation = (bmi) => {
      if (bmi < 18.5) {
        return 'You are underweight. Consider consulting a healthcare provider for guidance on achieving a healthy weight.';
      } else if (bmi >= 18.5 && bmi < 25) {
        return 'You have a normal weight. Great job maintaining a healthy lifestyle!';
      } else if (bmi >= 25 && bmi < 30) {
        return 'You are overweight. It might be beneficial to assess your diet and activity levels.';
      } else {
        return 'You are classified as obese. Consider seeking advice from a healthcare professional for personalized guidance.';
      }
    };

  const tools = [
    { name: 'BMI Calculator', screen: 'BMICalculator', icon: 'body-outline' },
    { name: 'Body Fat Calculator', screen: 'BodyFatCalculator', icon: 'fitness-outline' },
    { name: 'Calorie Calculator', screen: 'CalorieCalculator', icon: 'nutrition-outline' },

  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={24} color="#007BFF" style={styles.itemIcon} />
      <Text style={styles.text}>{item.name}</Text>
      <Ionicons name="arrow-forward-outline" size={20} color="#555" />
    </TouchableOpacity>
  );

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.appbar}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('AccountInfo')}
            >
                <Ionicons name="menu" size={30} color="#6200ea" />
            </TouchableOpacity>
            <Text style={styles.appTitle}>HEALTH TRACKERS</Text>
        </View>
        {userData && (
        <View style={styles.bmiContainer}>
          <Text style={styles.bmiText}>Your BMI: {bmi}</Text>
          <Text style={styles.bmiInterpretation}>{bmiInterpretation}</Text>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate("BMICalculator")}> Re-Calculate BMI </Button>
        </View>
        )}
        <FlatList
          data={tools}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
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
  divider: {
    marginVertical: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  itemIcon: {
    marginRight: 15,
    color:"#6200ea",
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  bmiContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Light background color for contrast
    padding: 20,
    borderRadius: 10, // Rounded corners
    elevation: 5, // Shadow effect
    marginVertical: 16, // Margin around the container
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  bmiText: {
    fontSize: 28, // Font size for BMI display
    fontWeight: 'bold', // Bold font for emphasis
    color: '#4CAF50', // Green color for positivity
    marginBottom: 8, // Spacing below the BMI text
  },
  bmiInterpretation: {
    fontSize: 18, // Font size for interpretation text
    color: '#555', // Dark gray color for readability
    textAlign: 'center', // Centered text
    marginVertical: 10,
    paddingHorizontal: 10, // Horizontal padding
  },
  button: {
      marginVertical: 8,
      backgroundColor: "#6200ea",
      borderRadius: 4,
  },
});

export default Tracker;
