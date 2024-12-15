import React, { useEffect, useState, useCallback } from 'react';
import { Image, View, ScrollView, StyleSheet, Alert, Linking, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';

import { Divider } from 'react-native-paper';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import StoryOfTheMonth from '../../components/StoryOfTheMonth';
import ContactUs from '../../components/ContactUs';

const HomePage = ({ navigation}) => {

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

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData().then(() => setRefreshing(false));
  }, [userId]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.appbar}>
          <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('AccountInfo')}
          >
              <Ionicons name="menu" size={30} color="#6200ea" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>DASHBOARD</Text>
      </View>
      <Text style={styles.greeting}>{username ? `Welcome, ${username.toUpperCase()}!` : 'Welcome!'}</Text>
      <Button mode="contained" onPress={() => navigation.navigate("MentalHealth")} style={styles.butt}>
        Book a Test
      </Button>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollContainer}>
       <TouchableOpacity style={styles.horizontalCard} onPress={() => handleNavigation('DietPlans')}>
         <Image source={require('../../assets/png/nutrition.jpg')} style={styles.horizontalCardImage} />
         <View style={styles.horizontalCardOverlay}>
           <Text style={styles.horizontalCardTitle}>Certified Dietitians</Text>
         </View>
       </TouchableOpacity>

       <TouchableOpacity style={styles.horizontalCard} onPress={() => handleNavigation('SupplementStore')}>
         <Image source={require('../../assets/png/suppliment.jpg')} style={styles.horizontalCardImage} />
         <View style={styles.horizontalCardOverlay}>
           <Text style={styles.horizontalCardTitle}>Alpha Supplement Store</Text>
         </View>
       </TouchableOpacity>
     </ScrollView>

        <View style={styles.testContainer}>
          <Card onPress={() => handleNavigation('BookTest')} style={styles.testCard}>
          <View style={styles.imageWrapper}>
            <Image source={require('../../assets/png/doctor.png')} style={styles.testImage} />
            <View style={styles.overlay}>
              <Text style={styles.testTitle}>REGULAR CHECK-UP</Text>
              <Text style={styles.description1}>Book a full body check-up at your home.</Text>
               <Button mode="contained" onPress={() => navigation.navigate("BookTest")} style={styles.butt}>
                 Book a Test
               </Button>
            </View>
          </View>
          </Card>
        </View>
        <StoryOfTheMonth/>




      <ContactUs/>
      {/*<View style={styles.labTestContainer}>
          <Image source={require('../../../assets/png/test.jpg')} style={styles.labTestBackgroundImage} />
          <View style={styles.labTestOverlay}>
            <Text style={styles.labTestTitle}>Book Your Lab Test</Text>
            <Text style={styles.labTestTitle}>Today!</Text>
            <Text style={styles.labTestDescription}>
              Receive a detailed health report at your door.
            </Text>
            <Button mode="text"  onPress={() => navigation.navigate("LabTestsList")}> Book now </Button>

          </View>
      </View>*/}

      <View style={styles.communityContainer}>
          <Card style={styles.communityCard} onPress={() => handleNavigation('CommunityTab')}>

          <Card.Content style={styles.cardContent}>
              <Ionicons name="people" size={24} color="#6200EE" style={styles.cardIcon} />
              <View style={styles.textContainer}>
                <Title style={styles.title}>Latest Fitness Tips</Title>
                <Paragraph style={styles.communityCardDescription}>
                  Check out the latest tips shared by our community members to enhance your fitness journey!
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
      </View>

      <View style={styles.communityContainer}>
        <Card onPress={() => handleNavigation('FAQ')} style={styles.communityCard}>
          <Card.Content>
            <Text style={styles.title}>Frequently Asked Questions</Text>
            <Text style={styles.description}>
              Have questions? Check out our FAQs for answers to common queries.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  horizontalScrollContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
  },
  horizontalCard: {
    width: 200, // Adjust width to control card size
    height: 160, // Adjust height for aspect ratio
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative',
  },
  horizontalCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  horizontalCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  horizontalCardTitle: {
    fontSize: 18,
    fontFamily: 'CustomFont-Bold',
    color: '#fff',
    textAlign: 'center',
  },

  greeting: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'CustomFont',
  },
   bmiContainer: {
      flex: 1,
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
  scrollContainer: {
    marginVertical: 10,
    flexDirection: 'row',
  },


  communityContainer: {
      backgroundColor: '#F1F1Ff',  // Light background for the section
      marginBottom: 24,
      borderRadius: 10,
      marginTop: 10,
    },
    communityHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
    },
  communityCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        elevation: 4,
        padding: 16,
        borderWidth: 1,
        borderColor: '#000',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    communityCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    communityCardDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'justify',
    },

  imageContainer: {
    alignItems: 'center',
  },
  transformationImage: {
    width: '90%',
    height: 150,
    borderRadius: 10,
  },
  storyDescription: {
    marginTop: 10,
  },
  cardContainer: {
      marginBottom: 10,
    },
  title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#6200ea',
  },
  description: {
    fontSize: 14,
    marginTop: 8,
    color: '#555',
  },
  testContainer: {
    padding: 16,
    width:'100%',
    backgroundColor: '#fff',
  },
  testCard: {
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  testImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent black overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  description1: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  butt: {
    marginVertical: 8,
    backgroundColor: "#6200ea",
    borderRadius: 4,
  },
});

export default HomePage;
