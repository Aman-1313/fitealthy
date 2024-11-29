// TrainerDashboardScreen.js
import React from 'react';
import { Image, View, ScrollView, StyleSheet, Alert, Linking, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';



const TrainerDashboardScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.container}>
       <View style={styles.appbar}>
          <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TrainerAccountInfo')}
          >
              <Ionicons name="menu" size={30} color="#6200ea" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>ALPHA</Text>
      </View>
      <Text style={styles.title}>Trainer Dashboard</Text>
      {/* Current Clients Card */}
      <View style={styles.currentClients}>
            <Card
              style={styles.currentClientsCard}
            >
            <Card.Content style={styles.cardContent}>
                <Ionicons name="people" size={24} color="#6200EE" style={styles.cardIcon} />
                <View style={styles.textContainer}>
                  <Title style={styles.cardTitle}>Current Clients</Title>
                  <Paragraph style={styles.communityCardDescription}>
                    Interact with your current clients, and assign their diet plans!
                  </Paragraph>
                </View>
                <Button  mode="contained-tonal" style={styles.button} onPress={ () => navigation.navigate('ClientList')}>
                   Current Clients
                </Button>
              </Card.Content>
            </Card>
      </View>
      {/* Trainer Meals card */}
        <View style={styles.currentClients}>
              <Card
                style={styles.currentClientsCard}
              >
              <Card.Content style={styles.cardContent}>
                  <Ionicons name="document" size={24} color="#6200EE" style={styles.cardIcon} />
                  <View style={styles.textContainer}>
                    <Title style={styles.cardTitle}>Meals Database</Title>
                    <Paragraph style={styles.communityCardDescription}>
                      Scroll through the list of your saved meals, update or add new meals!
                    </Paragraph>
                  </View>
                   <Button  mode="contained-tonal" style={styles.button} onPress={ () => navigation.navigate('TrainerMealsComponent')}>
                        Saved Meals
                   </Button>
                </Card.Content>
              </Card>
        </View>
        <View style={styles.currentClients}>
          <Card style={styles.currentClientsCard} >
          <Card.Content style={styles.cardContent}>
              <Ionicons name="people" size={24} color="#6200EE" style={styles.cardIcon} />
              <View style={styles.textContainer}>
                <Title style={styles.title}>Community </Title>
                <Paragraph style={styles.communityCardDescription}>
                  Share your success stories, training tips, and recipes with the community members!
                </Paragraph>
              </View>
              <Button  mode="contained-tonal" style={styles.button} onPress={() => navigation.navigate('CommunityTab', {isTrainer: true})}>
                  Community Screen
              </Button>
            </Card.Content>
          </Card>
      </View>

    </ScrollView>
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
  title: {
      marginTop: 10,
      fontSize: 22,
      color: '#333',
      fontFamily: 'CustomFont-Bold',
  },
  cardTitle : {
    fontSize: 22,
    fontWeight: 'bold',
  },
  currentClients: {
    marginBottom: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  currentClientsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: '#000',
  },
  button: {
    borderRadius: 8,
    margin:10,
  },
});

export default TrainerDashboardScreen;
