import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Divider } from 'react-native-paper';
import { fetchDietPlanForDate, markDietPlanAsFollowed } from '../../firebaseService';
import { collection, getDocs, doc, listCollections } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const DietScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [dietPlans, setDietPlans] = useState({});
  const [selectedPlan1, setSelectedPlan1] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [mealRecipe, setMealRecipe] = useState(null);
  const userId = auth.currentUser.uid;
  const [isClientRecipeModalVisible, setIsClientRecipeModalVisible] = useState(false);

  // New state for showing more ingredients
  const [showFullIngredients, setShowFullIngredients] = useState(false);
  //logic for fetching dates
  const [dates, setDates] = useState([]); // State to store dates of the current month

  const getDatesInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the current month
    const dateList = [];

    for (let day = 1; day <= daysInMonth; day++) {
      // Format the date as 'yyyy-mm-dd'
      const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      dateList.push(date); // Add each date to the list
    }

    return dateList;
  };

  const onMonthChange = (month) => {
    const { year, month: currentMonth } = month;
    const monthDates = getDatesInMonth(year, currentMonth);
    setDates(monthDates); // Update the state with the list of dates for the current month
    fetchAllUserDietPlans(monthDates);
  };
  //ends
  useEffect(() => {
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
    const currentYear = new Date().getFullYear(); // Get current year
    const monthDates = getDatesInMonth(currentYear, currentMonth); // Get all dates of the current month
    setDates(monthDates);
    fetchAllUserDietPlans(monthDates);
  }, []);

  const fetchAllUserDietPlans = async (dates) => {
    try {
      const plans = {}; // Initialize an empty object to store meals

          for (const date of dates) {
            // Reference the times within the current date collection
            const timesCollectionRef = collection(db, `DietPlans/${userId}/${date}`);
            const timeSnapshots = await getDocs(timesCollectionRef);

            // If there are any documents for this date, proceed with adding it to plans
            if (!timeSnapshots.empty) {
              plans[date] = {};
            }
          }
      setDietPlans(plans);
    } catch (error) {
      console.error("Error fetching diet plans:", error);
    }
  };




  const handleDayPress = async (day) => {
    const plan = await fetchDietPlanForDate(userId, day.dateString);

    setSelectedDate(day.dateString);
    setSelectedPlan1(plan);
    console.log(selectedPlan1);
    setModalVisible(true);
  };

  const markAsFollowed = async () => {
    await markDietPlanAsFollowed(userId, selectedDate);
    setModalVisible(false);
    fetchAllUserDietPlans(dates); // Refresh the plans
  };

  const openClientRecipeModal = (meal) => {
    setMealRecipe(meal.recipe);
    setIsClientRecipeModalVisible(true);
  }
  const closeClientRecipeModal = () => {

  setIsClientRecipeModalVisible(false);
  setMealRecipe(null);
  }



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Diet Plans</Text>
      <Calendar
        onDayPress={handleDayPress}
        onMonthChange={onMonthChange}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
          ...Object.keys(dietPlans).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: 'green' };
            return acc;
          }, {}),
        }}
      />

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalContent}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
            <Ionicons name="close" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.dateTitle}>Meal Plan for {selectedDate}</Text>
           {selectedPlan1 ? (
            <View>
              <Text style={styles.planTitle}>Meals:</Text>
              <ScrollView showsHorizontalScrollIndicator={false} style={styles.mealScrollContainer}>
                {Object.entries(selectedPlan1).map(([date, meals]) => (
                  <View key={date} style={styles.dateSection}>
                    {/* Each date section */}


                    {/* Horizontal ScrollView for the meals of a specific date */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalMealContainer}>
                      {meals.map((meal, index) => (
                        <View key={index} style={styles.mealCard}>
                          <Text style={styles.mealName}>{meal.name}</Text>
                          <Divider style={styles.divider} />
                          <Text style={styles.text}>{meal.calories} kcal</Text>
                          <Divider style={styles.divider} />
                          <Text style={styles.text}>Time: {meal.time}</Text>
                          <Divider style={styles.divider} />
                          <Text style={styles.text}>{meal.macronutrients}</Text>

                          {/* Button to open the recipe modal */}
                            <Button mode="contained" onPress={() => openClientRecipeModal(meal)}  style={styles.openButton}>
                              View Recipe
                            </Button>
                            
                        </View>

                      ))}
                    </ScrollView>
                    {/* Modal for viewing the recipe */}
                    <Modal visible={isClientRecipeModalVisible} transparent={true}  onRequestClose={() => setIsClientRecipeModalVisible(false)}>
                            <View style={styles.modalOverlay}>
                              <View style={styles.recipeCard}>
                                <TouchableOpacity onPress={closeClientRecipeModal} style={styles.modalCloseButton}>
                                  <Ionicons name="close" size={30} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.planTitle}>Recipe Details</Text>
                                <ScrollView style={styles.recipeScroll}>
                                  <Text style={styles.recipeText}>{mealRecipe || "No recipe available!"}</Text>
                                </ScrollView>
                                
                              </View>
                            </View>
                          </Modal>
                  </View>
                ))}
              </ScrollView>
              <Divider style={styles.divider} />
            </View>
          ) : (
            <Text>No diet plan for this day.</Text>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalContent: {
    padding: 20,
  },
  dateTitle: {
    fontSize: 20,
    fontFamily: 'CustomFont-Bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  planTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealScrollContainer: {
    paddingVertical: 10,
  },
  mealCard: {
    backgroundColor: '#f1f1ff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    width: 200,
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 18,
    fontFamily: 'CustomFont-Bold',
    marginBottom: 5,
  },
  text: {
    fontFamily: 'CustomFont',
    fontSize: 15,
  },
  divider: {
    marginVertical: 10,
  },
  followButton: {
    marginTop: 10,
    backgroundColor: '#6200ea',
    borderRadius: 8,
    marginBottom: 30,
  },
  modalCloseButton: {
    marginVertical: 10,
    alignSelf: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  recipeCard: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recipeScroll: {
    maxHeight: 200,
    marginBottom: 10,
  },
  recipeText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#6200ea',
    borderRadius: 8,
    marginTop: 10,
  },
  showMoreButton: {
    marginTop: 10,
  },
  openButton: {
    backgroundColor: '#6200ea',
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default DietScreen;
