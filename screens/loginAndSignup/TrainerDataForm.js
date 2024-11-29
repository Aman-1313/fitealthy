import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { db } from '../../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export default function TrainerDataForm({ route, navigation }) {
  const { trainerId } = route.params;
  const [description, setDescription] = useState('');
  const [experience, setExperience] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [trainerType, setTrainerType] = useState('fitness');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'trainers', trainerId), {
        description: description,
        experience: experience,
        specialty: specialty,
        trainerType: trainerType,
        rating: 5,
      });

      Alert.alert('Success', 'Trainer data saved successfully!');
      navigation.navigate('TrainerDashboardScreen');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Trainer Profile</Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter a brief description"
      />

      <Text style={styles.label}>Experience</Text>
      <TextInput
        style={styles.input}
        value={experience}
        onChangeText={(text) => setExperience(text.replace(/[^0-9]/g, ''))} // Only allows numeric input
        placeholder="Enter your experience"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Specialty</Text>
      <TextInput
        style={styles.input}
        value={specialty}
        onChangeText={setSpecialty}
        placeholder="Enter your specialty"
      />

      <Text style={styles.label}>Select Trainer Type:</Text>
      <RadioButton.Group
        onValueChange={newValue => setTrainerType(newValue)}
        value={trainerType}
      >
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Fitness Trainer" value="fitness" />
          <RadioButton.Item label="Diet Trainer" value="diet" />
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSave} disabled={loading}>Save</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
});
