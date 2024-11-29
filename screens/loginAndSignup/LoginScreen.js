
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      //Checks for email verification!
//      if (user.emailVerified) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            Alert.alert('Success', 'Logged in successfully!');
            setEmail('');
            setPassword('');
            console.log([userData.username, user.uid])
            navigation.navigate('Main', { username: userData.username, userId: user.uid });
          } else {
            Alert.alert('Error', 'User info not found!');
          }
//      } else {
//        // Email is not verified
//         Alert.alert(
//            'Email Not Verified',
//            'Please verify your email before logging in.',
//            [
//              {
//                text: 'Cancel',
//                style: 'cancel',
//              },
//              {
//                text: 'Resend Email',
//                onPress: resendVerificationEmail,
//              },
//            ]
//          );
//
//
//        await auth.signOut(); // Log the user out since they aren't verified
//      }


    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        Alert.alert('Verification Email Sent', 'Please check your email to verify your account.');
      } catch (error) {
        Alert.alert('Error', 'Could not send verification email. Please try again later.');
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/png/logo-no-background.png')} style={styles.logo} />
          </View>
          <Text style={styles.title}>Login</Text>

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

          <Button mode='contained' onPress={handleLogin} loading={loading} style={styles.button}>
            Login
          </Button>

          {/* Link to Signup */}
          <Button mode="text" onPress={() => navigation.navigate('Signup')} style={styles.toggleButton}>
            Don't have an account? Sign up
          </Button>

          {/* New Button for Trainer Login */}
          <Button mode="text" onPress={() => navigation.navigate('TrainerLoginScreen')} style={styles.trainerButton}>
            Are you a trainer? Login here
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
  trainerButton: {
    marginTop: 20,
    alignSelf: 'center',
    color: '#ff1c08',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
