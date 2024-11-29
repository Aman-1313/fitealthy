import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, Card, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
export default function CalorieCalculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [gender, setGender] = useState('');
  const [calories, setCalories] = useState(null);
  const [showCaloriesInfo, setShowCaloriesInfo] = useState(false);
  const validateInputs = () => {
    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      Alert.alert('Invalid Input', 'Please enter a valid age between 10 and 120.');
      return false;
    }

    // Validate weight
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid weight (kg).');
      return false;
    }

    // Validate height
    const heightNum = parseFloat(height);
    if (isNaN(heightNum) || heightNum <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid height (cm).');
      return false;
    }

    // Validate gender
    if (gender !== 'male' && gender !== 'female') {
      Alert.alert('Invalid Input', 'Gender should be "male" or "female".');
      return false;
    }

    // Validate activity level
    if (activityLevel !== 'low' && activityLevel !== 'moderate' && activityLevel !== 'high') {
      Alert.alert('Invalid Input', 'Activity level should be "low", "moderate", or "high".');
      return false;
    }

    return true;
  };

  const calculateCalories = () => {
    if (!validateInputs()) return;

    let bmr = 0;

    // Calculate BMR based on gender
    if (gender === 'male') {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else if (gender === 'female') {
      bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    // Apply activity multiplier
    let multiplier = 1.2;
    if (activityLevel === 'low') multiplier = 1.375;
    else if (activityLevel === 'moderate') multiplier = 1.55;
    else if (activityLevel === 'high') multiplier = 1.725;

    const totalCalories = bmr * multiplier;
    setCalories(totalCalories.toFixed(2)); // Set calculated calories
  };

  return (
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Text style={styles.greeting}>Calorie Calculator</Text>

            <Card.Content>
              <TextInput
                label="Age"
                value={age}
                keyboardType="numeric"
                onChangeText={(text) => setAge(text)}
                style={styles.input}
              />
              <TextInput
                label="Weight (kg)"
                value={weight}
                keyboardType="numeric"
                onChangeText={(text) => setWeight(text)}
                style={styles.input}
              />
              <TextInput
                label="Height (cm)"
                value={height}
                keyboardType="numeric"
                onChangeText={(text) => setHeight(text)}
                style={styles.input}
              />
              <TextInput
                label="Gender (male/female)"
                value={gender}
                onChangeText={(text) => setGender(text.toLowerCase())}
                style={styles.input}
              />
              <TextInput
                label="Activity Level (low/moderate/high)"
                value={activityLevel}
                onChangeText={(text) => setActivityLevel(text.toLowerCase())}
                style={styles.input}
              />

              <Button mode="contained" onPress={calculateCalories} style={styles.button}>
                Calculate
              </Button>

              {calories && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>Estimated Daily Caloric Needs: {calories} kcal</Text>
                </View>
              )}
            </Card.Content>
            {/* Calories Info Card */}
            <TouchableOpacity onPress={() => setShowCaloriesInfo(!showCaloriesInfo)}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>What is Calorie Calculation?</Text>
                <IconButton icon={showCaloriesInfo ? "chevron-up" : "chevron-down"} />
              </View>
            </TouchableOpacity>

            {showCaloriesInfo && (
              <View style={styles.infoContent}>
                <Text style={styles.infoText}>
                  A calorie is a unit of energy that we get from food. In the context of a calorie calculator, it helps determine the number of calories
                  you need to maintain, lose, or gain weight based on your daily activities and metabolic rate.
                </Text>
                <Text style={styles.infoText}>
                  The calculation usually factors in:
                  {"\n"}
                  <Text style={styles.boldText}>1. Basal Metabolic Rate (BMR):</Text>
                  The number of calories your body needs to perform basic functions like breathing and digestion.
                  {"\n"}
                  <Text style={styles.boldText}>2. Physical Activity Level (PAL):</Text>
                  The number of calories burned through physical activities such as exercise, walking, etc.
                  {"\n"}
                  <Text style={styles.boldText}>3. Total Daily Energy Expenditure (TDEE):</Text>
                  The total number of calories you burn in a day, combining BMR and PAL.
                </Text>

                <Text style={styles.infoText}>
                  Caloric needs are typically classified as:
                  {"\n"}
                  <Text style={styles.boldText}>- Maintenance:</Text>
                  Calories required to maintain current weight.
                  {"\n"}
                  <Text style={styles.boldText}>- Weight Loss:</Text>
                  A caloric deficit (usually 500-1000 calories less than TDEE) to lose weight.
                  {"\n"}
                  <Text style={styles.boldText}>- Weight Gain:</Text>
                  A caloric surplus (usually 250-500 calories more than TDEE) to gain weight.
                </Text>
              </View>
            )}
          </Card>
      </ScrollView>
    </View>
  );
}

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
  greeting: {
    fontSize: 18,
    fontFamily: 'CustomFont-Bold',
    marginVertical: 15,
    color: '#333',
    alignSelf: 'center',
  },
  card: {
    borderRadius: 10,
    marginVertical: 10,
    elevation: 3,
    backgroundColor: '#fff',
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#6200ea',
    borderRadius: 10,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryText: {
    fontSize: 16,
    color: '#666',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: 10,
    borderColor: '#000',
   padding: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'CustomFont-Bold',
  },
  infoContent: {
    margin:10,
    padding: 10,
    backgroundColor: '#f0f0f5',
    borderRadius: 8,
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    paddingVertical: 5,
    fontFamily: 'CustomFont',
  },
  boldText: {
      fontWeight: 'bold',  // This makes the text bold
      fontSize: 14,  // Ensure the font size matches the surrounding text
      color: '#555', // Optional: match the color to the normal text
    },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
