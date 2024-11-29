import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../../firebaseConfig';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const TrainerMealsComponent = ({navigation}) => {
  const [meals, setMeals] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [mealUpdates, setMealUpdates] = useState({});

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    // Update filteredMeals when searchText changes
    setFilteredMeals(
      meals.filter((meal) =>
        meal.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, meals]);

  const fetchMeals = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const trainerMealsRef = collection(db, 'meals', user.uid, 'trainerMeals');
        const mealQuery = query(trainerMealsRef);
        const querySnapshot = await getDocs(mealQuery);

        const fetchedMeals = [];
        querySnapshot.forEach((doc) => {
          fetchedMeals.push({ id: doc.id, ...doc.data() });
        });

        setMeals(fetchedMeals);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      Alert.alert('Error', 'Failed to load meals.');
    }
  };

  const handleEditMeal = (mealId) => {
    setIsEditing(mealId);
    setMealUpdates({}); // Clear previous edits when switching to a new meal
  };
  const handleRecipeChange = (text) => {
      const formattedText = text
        .split('\n') // Split text into lines
        .map(line => line.startsWith('\u2022') ? line : `\u2022 ${line}`) // Add bullet if not already present
        .join('\n'); // Join lines back into a single string
      setMealUpdates((prev) => ({ ...prev, recipe: formattedText }));
    };

  const handleSaveMeal = async (mealId) => {
    try {
      const mealRef = doc(db, 'meals', auth.currentUser.uid, 'trainerMeals', mealId);
      await updateDoc(mealRef, mealUpdates);
      Alert.alert('Success', 'Meal updated successfully!');

      // Update local state
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === mealId ? { ...meal, ...mealUpdates } : meal
        )
      );

      setIsEditing(null);
    } catch (error) {
      console.error('Error updating meal:', error);
      Alert.alert('Error', 'Failed to update meal.');
    }
  };

  const renderMealItem = ({ item }) => (
      <View style={styles.mealItem}>

        {isEditing === item.id ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Meal Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Edit meal name"
                value={mealUpdates.name || item.name}
                onChangeText={(text) =>
                  setMealUpdates((prev) => ({ ...prev, name: text }))
                }
              />

              <Text style={styles.inputLabel}>Calories</Text>
              <TextInput
                style={styles.input}
                placeholder="Edit calories"
                keyboardType="numeric"
                value={(mealUpdates.calories || item.calories).toString()}
                onChangeText={(text) =>
                  setMealUpdates((prev) => ({ ...prev, calories: parseInt(text) || 0 }))
                }
              />

              <Text style={styles.inputLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="Edit carbs"
                keyboardType="numeric"
                value={(mealUpdates.carbs || item.carbs).toString()}
                onChangeText={(text) =>
                  setMealUpdates((prev) => ({ ...prev, carbs: parseInt(text) || 0 }))
                }
              />

              <Text style={styles.inputLabel}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="Edit fat"
                keyboardType="numeric"
                value={(mealUpdates.fat || item.fat).toString()}
                onChangeText={(text) =>
                  setMealUpdates((prev) => ({ ...prev, fat: parseInt(text) || 0 }))
                }
              />

              <Text style={styles.inputLabel}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="Edit protein"
                keyboardType="numeric"
                value={(mealUpdates.protein || item.protein).toString()}
                onChangeText={(text) =>
                  setMealUpdates((prev) => ({ ...prev, protein: parseInt(text) || 0 }))
                }
              />

               <Text style={styles.inputLabel}>Recipe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Edit recipe"
                  multiline
                  value={mealUpdates.recipe || item.recipe}
                  onChangeText={handleRecipeChange}
                />

              <Text style={styles.inputLabel}>Ingredients (comma-separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="Edit ingredients (comma-separated)"
                value={mealUpdates.ingredients ? mealUpdates.ingredients.join(", ") : item.ingredients.join(", ")}
                onChangeText={(text) =>
                  setMealUpdates((prev) => ({ ...prev, ingredients: text.split(",").map((ing) => ing.trim()) }))
                }
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSaveMeal(item.id)}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleEditMeal()}
            >
              <Text style={styles.saveButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.mealHeader}>
            <Text style={styles.mealName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleEditMeal(item.id)}>
              <MaterialIcons name="edit" size={24} color="#6200ea" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );


  return (
    <View style={styles.container}>
      <View style={styles.appbar}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('TrainerAccountInfo')}
            >
                <Ionicons name="menu" size={30} color="#6200ea" />
            </TouchableOpacity>
            <Text style={styles.appTitle}>Meals</Text>
          </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search meals by name..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id}
        renderItem={renderMealItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  searchBar: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginVertical: 16,
  },
  mealItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealDescription: {
    fontSize: 14,
    color: 'gray',
  },
  inputLabel: {
      fontSize: 16,
      fontWeight:'bold',
      color: '#333',
      marginBottom: 4,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#6200ea',
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
      backgroundColor: 'red',
      padding: 8,
      borderRadius: 5,
      marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    textAlign: 'center',
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
  mealHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Space out the text and icon
      paddingVertical: 8,
  },
  mealName: {
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1, // Allow name to take available space
  },
});

export default TrainerMealsComponent;
