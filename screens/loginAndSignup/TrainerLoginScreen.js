import React, { useState } from 'react';
import { View, Image, StyleSheet, Alert, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function TrainerLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrainerLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is a trainer
      const trainerDoc = await getDoc(doc(db, 'trainers', user.uid)); // Assuming trainers are stored in 'trainers' collection
      if (trainerDoc.exists()) {
        const trainerData = trainerDoc.data();
        Alert.alert('Success', 'Trainer logged in successfully!');
        setEmail('');
        setPassword('');
        navigation.navigate('Main2', { userId: user.uid, trainerName: trainerData.name });
      } else {
        Alert.alert('Error', 'Trainer info not found!');
      }
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
          <Text style={styles.title}>Trainer Login</Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            mode="outlined"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button mode='contained' onPress={handleTrainerLogin} loading={loading} style={styles.button}>
            Trainer Login
          </Button>

          <Button mode="text" onPress={() => navigation.navigate('TrainerSignupScreen')} style={styles.toggleButton}>
            Don't have an account? Sign up
          </Button>
           {/* New Button for Trainer Login */}
            <Button mode="text" onPress={() => navigation.navigate('Login')} style={styles.trainerButton}>
              Not a trainer? User Login here
            </Button>
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
  innerContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    paddingHorizontal: 16,
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
