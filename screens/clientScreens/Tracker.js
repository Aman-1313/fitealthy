import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Avatar, Button, Menu, Divider, Provider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const Tracker = ({ navigation }) => {

  const tools = [
    { name: 'BMI Calculator', screen: 'BMICalculator', icon: 'body-outline' },
    { name: 'Body Fat Calculator', screen: 'BodyFatCalculator', icon: 'fitness-outline' },
    { name: 'Calorie Calculator', screen: 'CalorieCalculator', icon: 'nutrition-outline' },

  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Ionicons name={item.icon} size={24} color="#007BFF" style={styles.itemIcon} />
      <Text style={styles.text}>{item.name}</Text>
      <Ionicons name="arrow-forward-outline" size={20} color="#555" />
    </TouchableOpacity>
  );

  return (
    <Provider>
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



        <Text style={styles.greeting}>Track your health progress with these tools!</Text>

        <FlatList
          data={tools}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Provider>
  );
};

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
  divider: {
    marginVertical: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 15,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    borderWidth: 1,  // Adds a border to the card
    borderColor: '#000',
  },
  itemIcon: {
    marginRight: 15,
    color:"#6200ea",
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Tracker;
