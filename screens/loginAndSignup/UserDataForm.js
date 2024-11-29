import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Text, Menu } from 'react-native-paper';
import { auth, db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { PaperProvider } from 'react-native-paper';
import { DefaultTheme  } from 'react-native-paper';

const customTheme = {
  ...DefaultTheme,  // Import DefaultTheme from 'react-native-paper' if needed
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ea', // Customize your primary color
    accent: '#03dac4',  // Customize your accent color
    background: '#f5f5f5',  // Customize background
    surface: '#ffffff',  // Customize surface (Card, Button background)
    text: '#333333',  // Customize text color
  },
  roundness: 12,  // Change corner radius for components like Button, TextInput
};

export default function UserDataForm({ navigation }) {
  const [step, setStep] = useState(1);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  const [activityLevelMenuVisible, setActivityLevelMenuVisible] = useState(false);

  const [userData, setUserData] = useState({
    height: '',
    weight: '',
    fitnessGoal: '',
    activityLevel: '',
    age: '',
    gender: '',
    heardAboutApp: ''
  });

  const handleNext = () => {
    if (step === 1 && (!userData.height || !userData.weight || !userData.age || !userData.gender)) {
      Alert.alert('Validation Error', 'Please fill in all fields in Step 1.');
    } else if (step === 2 && !userData.fitnessGoal) {
      Alert.alert('Validation Error', 'Please enter your fitness goal.');
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!userData.activityLevel || !userData.heardAboutApp) {
      Alert.alert('Validation Error', 'Please fill in all fields in Step 3.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          height: userData.height,
          weight: userData.weight,
          fitnessGoal: userData.fitnessGoal,
          activityLevel: userData.activityLevel,
          age: userData.age,
          gender: userData.gender,
          heardAboutApp: userData.heardAboutApp,
          updatedAt: new Date(),
        });
        console.log('User data saved in Firestore');
        navigation.navigate('Main', { userId: user.uid });
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
  <PaperProvider theme={customTheme}>
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="User Information" />
        <Card.Content>
          {step === 1 && (
            <>
              <Text style={styles.label}>Step 1: Enter your personal details</Text>
              <TextInput
                label="Height (cm)"
                value={userData.height}
                keyboardType="numeric"
                onChangeText={(text) => setUserData({ ...userData, height: text })}
                style={styles.input}
              />
              <TextInput
                label="Weight (kg)"
                value={userData.weight}
                keyboardType="numeric"
                onChangeText={(text) => setUserData({ ...userData, weight: text })}
                style={styles.input}
              />
              <TextInput
                label="Age"
                value={userData.age}
                keyboardType="numeric"
                onChangeText={(text) => setUserData({ ...userData, age: text })}
                style={styles.input}
              />

                  {/* Gender Dropdown Menu */}
                  <Menu
                    visible={genderMenuVisible}
                    onDismiss={() => setGenderMenuVisible(false)}
                    anchor={
                      <Button mode="outlined" onPress={() => setGenderMenuVisible(true)}>
                        Gender: {userData.gender || 'Select'}
                      </Button>
                    }
                  >
                    <Menu.Item onPress={() => setUserData({ ...userData, gender: 'Male' })} title="Male" />
                    <Menu.Item onPress={() => setUserData({ ...userData, gender: 'Female' })} title="Female" />
                    <Menu.Item onPress={() => setUserData({ ...userData, gender: 'Other' })} title="Other" />
                  </Menu>

              <Button mode="contained" onPress={handleNext} style={styles.button}>
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.label}>Step 2: Enter your fitness goal</Text>
              <TextInput
                label="Fitness Goal"
                value={userData.fitnessGoal}
                onChangeText={(text) => setUserData({ ...userData, fitnessGoal: text })}
                style={styles.input}
              />
              <Button mode="outlined" onPress={handlePrev} style={styles.button}>
                Back
              </Button>
              <Button mode="contained" onPress={handleNext} style={styles.button}>
                Next
              </Button>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.label}>Step 3: Enter additional information</Text>

              {/* Activity Level Dropdown Menu */}
              <Menu
                visible={activityLevelMenuVisible}
                onDismiss={() => setActivityLevelMenuVisible(false)}
                anchor={
                  <Button mode="outlined" onPress={() => setActivityLevelMenuVisible(true)}>
                    Activity Level: {userData.activityLevel || 'Select'}
                  </Button>
                }
              >
                <Menu.Item onPress={() => setUserData({ ...userData, activityLevel: 'Low' })} title="Low" />
                <Menu.Item onPress={() => setUserData({ ...userData, activityLevel: 'Moderate' })} title="Moderate" />
                <Menu.Item onPress={() => setUserData({ ...userData, activityLevel: 'High' })} title="High" />
              </Menu>

              <TextInput
                label="How did you hear about us?"
                value={userData.heardAboutApp}
                onChangeText={(text) => setUserData({ ...userData, heardAboutApp: text })}
                style={styles.input}
              />
              <Button mode="outlined" onPress={handlePrev} style={styles.button}>
                Back
              </Button>
              <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                Submit
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
  },
});
