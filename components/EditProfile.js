import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Button, Divider, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { auth, db, storage } from '../firebaseConfig'; // Firebase config, Firestore database, and Firebase storage
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage functions
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons for icons

const EditProfile = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true); // Toggle edit mode
  const [updatedData, setUpdatedData] = useState({}); // To store temporary edited data
  const [profileImage, setProfileImage] = useState(null); // To store the profile image

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setUpdatedData(userDoc.data()); // Populate form with current data
          if (userDoc.data().profileImage) {
            setProfileImage(userDoc.data().profileImage); // Set profile image if it exists
          }
        } else {
          console.log('No such user document!');
        }
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to pick an image
  const pickImage = async () => {
    // Ask for permission to access the gallery
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'You need to allow permission to access the gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Makes the selected image square
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri); // Set the picked image
      setIsEditing(true);
    }
  };

  const uploadProfileImage = async (uri) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image: ', error);
      return null;
    }
  };

  const handleSave = async () => {
    const validationErrors = validateInputs(updatedData);
    if (validationErrors.length > 0) {
      Alert.alert('Validation Error', validationErrors.join('\n'));
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        let profileImageUrl = userData.profileImage; // Keep the old profile image by default

        if (profileImage && profileImage !== userData.profileImage) {
          profileImageUrl = await uploadProfileImage(profileImage); // Upload new profile image
        }

        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          ...updatedData,
          profileImage: profileImageUrl,
        }); // Update Firestore with edited data

        setUserData({ ...updatedData, profileImage: profileImageUrl }); // Update the UI with the new data
        setIsEditing(false); // Switch back to view mode
        Alert.alert('Profile Updated', 'Your profile information has been successfully updated.');
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const validateInputs = (data) => {
    const errors = [];
    // Validate username
    if (!data.username || data.username.trim() === '') {
      errors.push('Username cannot be empty.');
    }
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
      errors.push('Please enter a valid email address.');
    }
    // Validate gender
    if (!['Male', 'Female'].includes(data.gender)) {
      errors.push('Please select either Male or Female for gender.');
    }
    // Validate age
    if (!data.age || isNaN(data.age) || data.age < 10) {
      errors.push('Age must be a number and at least 10.');
    }
    return errors;
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('LoginStack'); // Navigate to the login screen after successful logout
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
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
            <Avatar.Text size={80} label={userData.username ? userData.username[0].toUpperCase() : '?'} />
          )}
        </TouchableOpacity>
        {!isEditing ? (
          <>
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person-outline" size={24} color="gray" />
              <TextInput
                style={styles.input}
                value={updatedData.username}
                onChangeText={(text) => setUpdatedData({ ...updatedData, username: text })}
                placeholder="Enter your username"
                placeholderTextColor="gray"
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={24} color="gray" />
              <TextInput
                style={styles.input}
                value={updatedData.email}
                onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor="gray"
              />
            </View>
          </>
        )}
      </View>

      <Divider bold={true} style={styles.divider} />

      <View style={styles.infoSection}>
        {!isEditing ? (
          <>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{userData.gender || 'Not provided'}</Text>

            <Text style={styles.infoLabel}>Age:</Text>
            <Text style={styles.infoValue}>{userData.age || 'Not provided'}</Text>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <MaterialIcons name="wc" size={24} color="gray" />
              <TextInput
                style={styles.input}
                value={updatedData.gender}
                onChangeText={(text) => setUpdatedData({ ...updatedData, gender: text })}
                placeholder="Enter your gender (Male/Female)"
                placeholderTextColor="gray"
              />
            </View>
            <View style={styles.inputContainer}>
              <MaterialIcons name="cake" size={24} color="gray" />
              <TextInput
                style={styles.input}
                value={updatedData.age ? updatedData.age.toString() : ''}
                onChangeText={(text) => setUpdatedData({ ...updatedData, age: text })}
                placeholder="Enter your age"
                placeholderTextColor="gray"
                keyboardType="numeric"
              />
            </View>
          </>
        )}
      </View>

      <Divider bold={true} style={styles.divider} />

      <Button mode="contained" onPress={isEditing ? handleSave : () => setIsEditing(true)} style={styles.editButton}>
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </Button>

      <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
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
  divider: {
    marginVertical: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    marginBottom: 10,
  },
  editButton: {
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'red',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;
