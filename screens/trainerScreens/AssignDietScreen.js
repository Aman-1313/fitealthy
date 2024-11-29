import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveDietPlan, saveMeal, getMealsByName } from '../../firebaseService';
import { Ionicons } from '@expo/vector-icons';

const AssignDietScreen = ({ route, navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mealName, setMealName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [recipe, setRecipe] = useState('');
  const [meals, setMeals] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const { userId } = route.params;


   const handleRecipeChange = (text) => {
      const formattedText = text
        .split('\n') // Split text into lines
        .map(line => line.startsWith('\u2022') ? line : `\u2022 ${line}`) // Add bullet if not already present
        .join('\n'); // Join lines back into a single string
      setRecipe(formattedText);
    };
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (event.type === 'dismissed') return;
    if (date) {
      const adjustedDate = new Date(date);
      adjustedDate.setHours(0, 0, 0, 0);
      setSelectedDates((prevDates) => {
        const dateExists = prevDates.some(existingDate =>
          existingDate.getTime() === adjustedDate.getTime()
        );
        if (!dateExists) {
          return [...prevDates, adjustedDate];
        }
        return prevDates;
      });
      setSelectedDate(adjustedDate);
    }
  };

  const onTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (event.type === 'dismissed') return;
    if (time) {
      const adjustedTime = new Date(selectedDate);
      adjustedTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
      setSelectedTime(adjustedTime);
    }
  };

  const removeDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(date => date !== dateToRemove));
  };

  const addMeal = async () => {
    if (!mealName || !calories) return;

    const meal = {
      name: mealName,
      calories: parseInt(calories),
      ingredients: ingredients.split(',').map(item => item.trim()),
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      recipe,
      time: selectedTime.toLocaleTimeString(),
    };

    try {
      await saveMeal(meal);
      setMeals([...meals, meal]);  // Add to local state for UI display

      setMealName('');
      setCalories('');
      setIngredients('');
      setProtein('');
      setCarbs('');
      setFat('');
      setRecipe('');
      Alert.alert("Meal added and saved to Firebase!");
    } catch (error) {
      Alert.alert("Error", "Failed to save the meal. Please try again.");
    }
  };

  const assignDietPlan = async () => {
    if (meals.length === 0 || selectedDates.length === 0) return;
    for (const date of selectedDates) {
      const formattedDate = date.toISOString().split('T')[0];
      await saveDietPlan(userId, formattedDate, meals);
    }
    alert("Diet Plan Saved for selected dates!");
    setMeals([]);
    setSelectedDates([]);
  };

  const deleteMeal = (index) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          const newMeals = meals.filter((_, mealIndex) => mealIndex !== index);
          setMeals(newMeals);
        }},
      ],
      { cancelable: false }
    );
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    const results = await getMealsByName(searchTerm);
    setSearchResults(results);
  };

  const addSearchedMeal = (meal) => {
    setMeals([...meals, meal]);
  };

  const openRecipeModal = () => {
    setModalVisible(true);
  };

  const closeRecipeModal = () => {
    setModalVisible(false);
  };

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
      <Text style={styles.title}>Assign Diet Plan</Text>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Search for Meals</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter meal name"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#888"
        />
        <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
          Search Meals
        </Button>

        <ScrollView style={styles.searchResults}>
          {searchResults.map((meal, index) => (
            <View key={index} style={styles.searchResultItem}>
              <Text style={styles.mealText}>{meal.name}</Text>
              <Button mode="contained" onPress={() => addSearchedMeal(meal)}>
                Add Meal
              </Button>
            </View>
          ))}
        </ScrollView>
      </View >
      <View style={styles.card}>
       <Text style={styles.subtitle}>Add Meals Manually</Text>


        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>Select Date</Text>
          <Ionicons name="calendar" size={24} color="#6200ea" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.note}>You can select multiple dates!</Text>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            onChange={onDateChange}
          />
        )}



        <View style={styles.selectedDatesContainer}>
          {selectedDates.map((date, index) => (
            <View key={index} style={styles.selectedDateItem}>
              <Text style={styles.selectedDateText}>{date.toISOString().split('T')[0]}</Text>
              <TouchableOpacity onPress={() => removeDate(date)}>
                <Ionicons name="close-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>Meal Time {selectedTime ? selectedTime.toLocaleTimeString() : <Ionicons name="time" size={24} style={styles.icon} />}</Text>
          <Ionicons name="time" size={24} style={styles.icon} color="#6200ea" />
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="spinner"
            onChange={onTimeChange}
          />
        )}


        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={mealName}
          onChangeText={setMealName}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.input}
          placeholder="Calories"
          value={calories}
          keyboardType="numeric"
          onChangeText={setCalories}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChangeText={setIngredients}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Protein (%)"
          value={protein}
          keyboardType="numeric"
          onChangeText={setProtein}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Carbs (%)"
          value={carbs}
          keyboardType="numeric"
          onChangeText={setCarbs}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Fat (%)"
          value={fat}
          keyboardType="numeric"
          onChangeText={setFat}
          placeholderTextColor="#888"
        />

        <Button mode="contained" onPress={openRecipeModal} style={styles.addButton}>
            Add Recipe to Meal
          </Button>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Recipe</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipe details"
                value={recipe}
                onChangeText={handleRecipeChange}
                placeholderTextColor="#888"
                multiline={true}
              />
              <Button mode="contained" onPress={closeRecipeModal} style={styles.closeButton}>
                Save Recipe
              </Button>
            </View>
          </View>
        </Modal>


        <Button mode="contained" onPress={addMeal} style={styles.addButton}>
          Add Meal
        </Button>
        <Text style={styles.subtitle}>Meals List</Text>
        <ScrollView style={styles.mealList}>
          {meals.map((meal, index) => (
            <View key={index} style={styles.mealItem}>
              <Text style={styles.mealText}>{index + 1}.</Text>
              <Text style={styles.mealText}>{meal.name}</Text>
              <Text style={styles.mealText}>{meal.calories} kcal</Text>
              <Text style={styles.mealText}>{meal.time}</Text>
              <TouchableOpacity onPress={() => deleteMeal(index)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}><Ionicons name="close-circle" size={20} color="red" /></Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Button mode="contained" onPress={assignDietPlan} style={styles.saveButton}>
          Save Diet Plan
        </Button>
      </View>
    </ScrollView>
  );
};

// Styles remain unchanged

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
     modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background for focus
      },
      modalContent: {
        width: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 15,
        alignSelf: 'center',
      },
      input: {
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 12,
        minHeight: 120,
        textAlignVertical: 'top', // Ensures text starts from the top for multiline
      },
      closeButton: {
        backgroundColor: '#6200ea',
        borderRadius: 8,
        marginTop: 10,
      },
    title: { marginVertical: 10, fontSize: 22, color: '#333', fontFamily: 'CustomFont-Bold', alignSelf: 'center' },
    subtitle: { fontSize: 18, fontFamily: 'CustomFont', marginVertical: 10, alignSelf: 'center' },
    note: { color: '#888', marginBottom: 10 },
    dateInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 15, marginBottom: 12, borderWidth: 1, borderColor: '#BBDEFB', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
    dateText: { fontSize: 16, color: '#6200ea', fontWeight: 'bold', marginRight: 10, flex: 1 },
    input: { backgroundColor: '#FFF', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: '#DDD' },
    searchButton: { borderRadius: 8, marginTop: 10, backgroundColor: '#6200ea' },
    searchResults: { maxHeight: 150, marginVertical: 10, backgroundColor: '#FFF', padding: 10, borderRadius: 8, borderColor: '#DDD', borderWidth: 1 },
    searchResultItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    mealText: { fontSize: 16, color: '#333' },
    addButton:{backgroundColor: '#6200ea', borderRadius: 8, marginVertical: 5},
    saveButton: { backgroundColor: '#2196F3', borderRadius: 8, marginVertical: 5 },
    appbar: { height: 60, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'space-between', borderRadius: 10, borderWidth: 1, borderColor: '#000' },
    iconButton: { padding: 10 },
    appTitle: { fontSize: 20, color: '#6200ea', fontFamily: 'CustomFont-Bold' },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      elevation: 4,
      padding: 16,
      borderWidth: 1,
      borderColor: '#000',
      marginVertical:20,
    },
});

export default AssignDietScreen;
