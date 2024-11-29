import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ContactUs = () => {
  const openWhatsApp = () => {
    const phoneNumber = '917837500013'; // Replace with your business WhatsApp number
    const message = 'Hello, I would like to get more information about the plans.'; // Customize this default message
    const url = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'WhatsApp is not installed on your device');
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
        <MaterialIcons name="message" size={24} color="#ffffff" />
        <Text style={styles.buttonText}>Chat with Us on WhatsApp</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366', // WhatsApp's signature green color
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8,
     fontFamily: 'CustomFont-Bold',
  },
});

export default ContactUs;
