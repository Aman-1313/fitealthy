
import React, { useState } from 'react';
import { ScrollView, Image, View, Dimensions, StyleSheet, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification  } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
        username: username,
      });
      // Send verification email
      await sendEmailVerification(user);
      Alert.alert(
          'Verify Your Email',
          'A verification email has been sent to your email address. Please verify your email to log in.'
      );

      Alert.alert('Success', 'Logged in successfully!');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      navigation.navigate('UserDataForm');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
//  const handleSignup = async () => {
//    if (password !== confirmPassword) {
//      setError('Passwords do not match');
//      return;
//    }
//    setLoading(true);
//    try {
//      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//      const user = userCredential.user;
//
//      await setDoc(doc(db, 'users', user.uid), {
//        email: user.email,
//        createdAt: new Date(),
//        username: username,
//      });
//
//      // Send verification email
//      await sendEmailVerification(user);
//      Alert.alert(
//        'Verify Your Email',
//        'A verification email has been sent to your email address. Please verify your email to log in.'
//      );
//
//      // Clear input fields
//      setUsername('');
//      setEmail('');
//      setPassword('');
//      setConfirmPassword('');
//
//      // Navigate to login screen
//      navigation.navigate('Login');
//    } catch (err) {
//      setError(err.message);
//    } finally {
//      setLoading(false);
//    }
//  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/png/logo-no-background.png')} style={styles.logo} />
          </View>
          <Text style={styles.title}>Sign Up</Text>
          <ScrollView style={styles.scrollContainer}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
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
            <Button mode="contained" onPress={handleSignup} loading={loading} style={styles.button}>
              Sign Up
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Login')} style={styles.toggleButton}>
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
  trainerButton: {
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
