
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button, Divider, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const TrainerAccountInfoScreen = ({ navigation }) => {
  const [trainerData, setTrainerData] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const fetchTrainerData = async () => {
    try {
      const trainer = auth.currentUser;
      if (trainer) {
        const trainerDocRef = doc(db, 'trainers', trainer.uid);

        const trainerDoc = await getDoc(trainerDocRef);
        console.log(trainerDoc.data())
        if (trainerDoc.exists()) {
          setTrainerData(trainerDoc.data());
          setProfileImage(trainerDoc.data().profileImage);
        }
      }
    } catch (error) {
      console.error('Error fetching trainer data: ', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'You need to allow permission to access the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const iconButtons = [
    { name: 'edit', label: 'Edit Profile', screen: 'EditProfileTrainer' },
    { name: 'subscriptions', label: 'My Clients', screen: 'ClientList' },
    { name: 'support', label: 'Help and Support', screen: 'HelpAndSupportScreen' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Avatar.Image size={80} source={{ uri: profileImage }} />
          ) : (
            <Avatar.Text size={80} label={trainerData.username ? trainerData.username[0].toUpperCase() : '?'} />
          )}
        </TouchableOpacity>
        <Text style={styles.username}>{trainerData.username}</Text>
        <Text style={styles.email}>{trainerData.email}</Text>
      </View>

      <Divider bold={true} style={styles.divider} />

      {iconButtons.map((button) => (
        <View key={button.name}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate(button.screen)}
          >
            <MaterialIcons name={button.name} size={24} color="gray" />
            <Text style={styles.iconButtonText}>{button.label}</Text>
          </TouchableOpacity>
          <Divider bold={true} style={styles.divider} />
        </View>
      ))}

      <Button mode="contained" onPress={handleSignOut} style={styles.logoutButton}>
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
  divider: {
    marginVertical: 20,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'black',
  },
  logoutButton: {
    backgroundColor: 'red',
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrainerAccountInfoScreen;
