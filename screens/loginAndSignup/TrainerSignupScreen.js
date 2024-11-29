import React, { useState } from 'react';
import { ScrollView, Image, View, Dimensions, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function TrainerSignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrainerSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save trainer data to the 'trainers' collection
      await setDoc(doc(db, 'trainers', user.uid), {
        email: user.email,
        createdAt: new Date(),
        name: name,
      });

      Alert.alert('Success', 'Trainer account created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      navigation.navigate('TrainerDataForm', { trainerId: user.uid }); // Navigate to the trainer's main screen
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/png/logo-no-background.png')} style={styles.logo} />
          </View>
          <Text style={styles.title}>Trainer Sign Up</Text>
          <ScrollView style={styles.scrollContainer}>
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button mode="contained" onPress={handleTrainerSignup} loading={loading} style={styles.button}>
              Sign Up
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('TrainerLoginScreen')} style={styles.toggleButton}>
              Already have an account? Login
            </Button>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain',
  },
  innerContainer: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 16,
    backgroundColor: '#ff1c08',
  },
  toggleButton: {
    marginTop: 10,
    alignSelf: 'center',
    color: '#ff1c08',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
