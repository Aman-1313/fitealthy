import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import ContactUs from './ContactUs';
import { MaterialIcons } from '@expo/vector-icons';

export default function HelpAndSupportScreen() {
  const handleCallSupport = () => {
    const phoneNumber = 'tel:+1234567890'; // Replace with your support phone number
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert('Error', 'Unable to make a call at this time');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Help & Support</Text>
      <View style={styles.card}>
        <Text style={styles.paragraph}>
          If you have any questions or need assistance, our support team is here to help.
          Feel free to reach out, and we’ll be happy to assist you.
        </Text>
        <TouchableOpacity style={styles.callButton} onPress={handleCallSupport}>
          <MaterialIcons name="call" size={24} color="#ffffff" style={styles.callIcon} />
          <Text style={styles.callButtonText}>Call Support</Text>
        </TouchableOpacity>
        <ContactUs />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 26,
    fontFamily: 'CustomFont-Bold',
    color: '#6200ea',
    marginBottom: 15,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
    fontFamily: 'CustomFont',
    paddingHorizontal: 10,
  },
  callButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent:  'center',
    backgroundColor: '#6200ea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callIcon: {
    marginRight: 10,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'CustomFont-Bold',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000',
    margin:10
    },
});
