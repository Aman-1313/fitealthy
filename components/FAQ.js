import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ContactUs from './ContactUs';
const FAQ = ({navigation}) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const faqData = [
    {
      id: '1',
      question: 'How do I book a session ?',
      answer: 'To book a session, navigate to the "Trainers" section, choose your preferred trainer, and select a plan to get started.',
    },
    {
      id: '2',
      question: 'How can I view my progress?',
      answer: 'You can view your fitness progress in the "Tracker" section of the app, where all your workout data and goals are stored.',
    },
    {
      id: '3',
      question: 'Can I cancel a session after booking?',
      answer: 'Yes, you can cancel a session up to 24 hours before the scheduled time without any penalty. After that, cancellations may incur a fee.',
    },
    {
      id: '4',
      question: 'What payment methods are supported?',
      answer: 'We accept all major credit cards, as well as payments through Stripe and PayPal.',
    },
    {
      id: '5',
      question: 'How do I contact my trainer?',
      answer: 'You can chat with your assigned trainer via the "Interaction" screen. There, you can discuss plans, ask questions, and more.',
    },
  ];

  const toggleQuestion = (id) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={() => toggleQuestion(item.id)} style={styles.questionContainer}>
        <Text style={styles.question}>{item.question}</Text>
        <MaterialIcons
          name={expandedQuestion === item.id ? 'expand-less' : 'expand-more'}
          size={24}
          color='#6200ea'
        />
      </TouchableOpacity>
      {expandedQuestion === item.id && <Text style={styles.answer}>{item.answer}</Text>}
    </View>
  );

  return (
  <View style={styles.container}>

      <View style={styles.appbar}>
        <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('AccountInfo')}
        >
            <Ionicons name="menu" size={30} color="#6200ea" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>FAQ</Text>
      </View>
      <View style={styles.helpCard}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.cardText}>Talk to a counsellor to know the process</Text>
        <ContactUs />
      </View>
      <FlatList
        data={faqData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
  </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    flex: 1,
  },
  appbar: {
    height: 60,                    // Height of the appbar
    backgroundColor: '#fff',     // Background color (customizable)
    flexDirection: 'row',           // Align items horizontally
    alignItems: 'center',           // Vertically center the icon and title
    paddingHorizontal: 10,          // Add horizontal padding for spacing
    justifyContent: 'space-between', // Space between the icon and title
    borderRadius: 10,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  iconButton: {
    padding: 10,                   // Adds padding around the icon for better tap experience
  },
  appTitle: {
    fontSize: 20,                  // Title size
    color: '#6200ea',                 // Title color
    fontFamily: 'CustomFont-Bold',
  },
  helpCard :{
      marginVertical: 10,
      borderRadius: 12,
      backgroundColor: '#f1f1ff',
      overflow: 'hidden',
      padding: 20,
      borderWidth: 1,  // Adds a border to the card
      borderColor: '#000',
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 10,
  },
  cardText: {
      fontSize: 16,
      marginTop: 8,
      color: '#555',
      textAlign: 'justify',
  },
  faqItem: {
    marginVertical: 10,
    borderRadius: 8,
    padding: 12,
    borderBottomWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  answer: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default FAQ;
