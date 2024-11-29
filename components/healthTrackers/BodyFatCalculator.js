import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button, Card, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function BodyFatCalculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [gender, setGender] = useState('');
  const [bodyFat, setBodyFat] = useState(null);
  const [showBodyFatInfo, setShowBodyFatInfo] = useState(false);
  const calculateBodyFat = () => {
    let bodyFatPercentage = 0;

    // Validate input
    if (!age || !weight || !height || !waist || !gender) {
      alert("Please fill in all fields.");
      return;
    }

    // Calculate body fat based on gender
    if (gender === 'male') {
      bodyFatPercentage = 86.010 * Math.log10(waist) - 70.041 * Math.log10(height) + 36.76;
    } else if (gender === 'female') {
      bodyFatPercentage = 163.205 * Math.log10(waist) - 97.684 * Math.log10(height) - 78.387;
    } else {
      alert("Please enter a valid gender (male/female).");
      return;
    }

    setBodyFat(bodyFatPercentage.toFixed(2)); // Set calculated body fat percentage
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
      <Text style={styles.greeting}>Body Fat Calculator</Text>
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
            label="Waist Circumference (cm)"
            value={waist}
            keyboardType="numeric"
            onChangeText={(text) => setWaist(text)}
            style={styles.input}
          />
          <TextInput
            label="Gender (male/female)"
            value={gender}
            onChangeText={(text) => setGender(text.toLowerCase())}
            style={styles.input}
          />

          <Button mode="contained" onPress={calculateBodyFat} style={styles.button}>
            Calculate
          </Button>

          {bodyFat && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>Estimated Body Fat Percentage: {bodyFat}%</Text>
            </View>
          )}
        </Card.Content>
        {/* Body Fat Info Card */}
        <TouchableOpacity onPress={() => setShowBodyFatInfo(!showBodyFatInfo)}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>What is Body Fat Percentage?</Text>
            <IconButton icon={showBodyFatInfo ? "chevron-up" : "chevron-down"} />
          </View>
        </TouchableOpacity>

        {showBodyFatInfo && (
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              Body Fat Percentage (BFP) is the percentage of your body mass that is made up of fat. It is an important measure of body composition
              and helps assess whether you are at a healthy weight. BFP can be determined using various methods, including skinfold measurements,
              bioelectrical impedance, and DEXA scans.
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>1. Essential Fat: </Text>10-13% (Women), 2-5% (Men)
              {"\n"}

              <Text style={styles.boldText}>2. Athletes: </Text>14-20% (Women), 6-13% (Men){"\n"}
              <Text style={styles.boldText}>3. Fitness: </Text>21-24% (Women), 14-17% (Men){"\n"}
              <Text style={styles.boldText}>4. Acceptable: </Text>25-31% (Women), 18-24% (Men){"\n"}
              <Text style={styles.boldText}>5. Obesity: </Text>32%+ (Women), 25%+ (Men){"\n"}
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
      fontSize: 15,  // Ensure the font size matches the surrounding text
      color: '#555', // Optional: match the color to the normal text
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
});
