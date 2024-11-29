import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Button, Divider, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MaterialIcons } from '@expo/vector-icons';

const EditProfileTrainer = ({ navigation }) => {
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

  const uploadProfileImage = async (uri) => {
    const trainer = auth.currentUser;
    if (!trainer) return null;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profileImages/${trainer.uid}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      const trainer = auth.currentUser;
      if (trainer) {
        let profileImageUrl = trainerData.profileImage;

        if (profileImage && profileImage !== trainerData.profileImage) {
          profileImageUrl = await uploadProfileImage(profileImage);
        }

        const trainerDocRef = doc(db, 'trainers', trainer.uid);
        await updateDoc(trainerDocRef, {
          ...trainerData,
          profileImage: profileImageUrl,
        });

        setTrainerData({ ...trainerData, profileImage: profileImageUrl });
        Alert.alert('Profile Updated', 'Your profile information has been successfully updated.');
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleChange = (field, value) => {
    setTrainerData({ ...trainerData, [field]: value });
  };

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
            <Avatar.Text size={80} label={trainerData.name ? trainerData.name[0].toUpperCase() : '?'} />
          )}
        </TouchableOpacity>
        <Text style={styles.username}>{trainerData.name}</Text>
        <Text style={styles.email}>{trainerData.email}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.inputContainer}>
        <Text style={styles.header}>Description </Text>
        <MaterialIcons name="description" size={16} color='#6200ea' />
        <TextInput
          style={styles.input}
          value={trainerData.description}
          onChangeText={(text) => handleChange('description', text)}
          placeholder="Description"
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.inputContainer}>
      <Text style={styles.header}>Experience (years) </Text>
        <MaterialIcons name="work" size={16} color='#6200ea' />
        <TextInput
          style={styles.input}
          value={trainerData.experience}
          onChangeText={(text) => handleChange('experience', text)}
          placeholder="Experience (e.g., 5 years)"
          placeholderTextColor="gray"
          keyboardType="numeric"
        />

      </View>

      <View style={styles.inputContainer}>
      <Text style={styles.header}>Trainer Specialty </Text>
        <MaterialIcons name="fitness-center" size={16} color='#6200ea' />
        <TextInput
          style={styles.input}
          value={trainerData.specialty}
          onChangeText={(text) => handleChange('specialty', text)}
          placeholder="Specialty (e.g., Weight Loss)"
          placeholderTextColor="gray"
        />
      </View>


      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Save Changes
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    padding: 8,
    color: 'black',
  },
  saveButton: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header:{
    fontSize: 15,
    color: '#6200ea',
    fontFamily: 'CustomFont-Bold',
  }
});

export default EditProfileTrainer;
