import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, Card, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const calculateBMI = () => {
    // Validate input
    if (!weight || !height) {
      alert("Please fill in all fields.");
      return;
    }

    const heightInMeters = height / 100; // Convert height from cm to meters
    const calculatedBMI = weight / (heightInMeters * heightInMeters);

    setBmi(calculatedBMI.toFixed(2)); // Set calculated BMI to two decimal places

    // Determine BMI category
    if (calculatedBMI < 18.5) {
      setCategory('Underweight');
    } else if (calculatedBMI < 24.9) {
      setCategory('Normal weight');
    } else if (calculatedBMI < 29.9) {
      setCategory('Overweight');
    } else {
      setCategory('Obesity');
    }
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
          <Text style={styles.greeting}>BMI CALCULATOR</Text>
          <Card.Content>
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

            <Button mode="contained" onPress={calculateBMI} style={styles.button}>
              Calculate BMI
            </Button>

            {bmi && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>Your BMI: {bmi}</Text>
                <Text style={styles.categoryText}>Category: {category}</Text>
              </View>
            )}
          </Card.Content>

        {/* Info Card */}
        <TouchableOpacity onPress={() => setShowInfo(!showInfo)}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>What is BMI?</Text>
            <IconButton icon={showInfo ? "chevron-up" : "chevron-down"} />
          </View>
        </TouchableOpacity>

        {showInfo && (
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              BMI (Body Mass Index) is a simple index of weight-for-height commonly used to classify underweight, overweight, and obesity in adults.
              It is calculated by dividing a person’s weight in kilograms by the square of their height in meters.
            </Text>
            <Text style={styles.infoText}>
              {"- Underweight: BMI < 18.5\n"}
              {"- Normal weight: BMI 18.5 – 24.9\n"}
              {"- Overweight: BMI 25 – 29.9\n"}
              {"- Obesity: BMI 30 or above"}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
