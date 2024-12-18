import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
const ENDPOINT = 'https://api.openai.com/v1/chat/completions';


export default function GenerateDietPlan({navigation}) {
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    setUserId(user.uid);
  }, [userId]);

  const generateDietPlan = async () => {
    setLoading(true);
    try {
      // Step 1: Generate diet plan using OpenAI
      const response = await axios.post(
        ENDPOINT,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a dietitian. Create a personalized diet plan based on a balanced diet." },
            { role: "user", content: `Create a diet plan for a day with 4 meals (Breakfast, Snack, Lunch, and Dinner). Each meal should include the following details:
                                         - Name: The name of the meal.
                                         - Recipe: A brief description of the recipe.
                                         - Calories: Approximate calorie count (e.g., '300 kcal').
                                         - Macronutrients: A breakdown of carbohydrates, protein, and fat (e.g., 'Carbohydrates: 30g, Protein: 20g, Fat: 10g').
                                         - Ingredients: A list of ingredients required for the meal.

                                         Return different types of meal plans using this sample response in this JSON structure:
                                         [
                                           {
                                             "name": "",
                                             "recipe": "",
                                             "calories": "300 kcal",
                                             "macronutrients": "Carbohydrates: 30g, Protein: 20g, Fat: 10g",
                                             "ingredients": [
                                               "",
                                               "",
                                               "",
                                               ""
                                             ]
                                           },
                                           {
                                             "name": "",
                                             "recipe": "",
                                             "calories": "200 kcal",
                                             "macronutrients": "Carbohydrates: 15g, Protein: 5g, Fat: 15g",
                                             "ingredients": [
                                               "1",
                                               "2 "
                                             ]
                                           },
                                           {
                                             "name": "",
                                             "recipe": "",
                                             "calories": "400 kcal",
                                             "macronutrients": "Carbohydrates: 20g, Protein: 30g, Fat: 20g",
                                             "ingredients": [
                                               "",
                                               "",
                                               "",
                                               "",
                                               ""
                                             ]
                                           },
                                           {
                                             "name": "",
                                             "recipe": "",
                                             "calories": "500 kcal",
                                             "macronutrients": "Carbohydrates: 40g, Protein: 30g, Fat: 20g",
                                             "ingredients": [
                                               "",
                                               "",
                                               ""
                                             ]
                                           }
                                         ]

                                         Ensure the JSON is well-formatted and avoid any additional commentary or explanations outside the JSON.` },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const plan = parseDietPlan(response.data.choices[0].message.content);

      setDietPlan(plan);

//      // Step 2: Save diet plan to Firebase
//      const today = new Date().toISOString().split("T")[0]; // e.g., "2024-12-18"
//      await setDoc(doc(db, `DietPlans/${userId}/${today}`), { [new Date().toISOString()]: plan });
    } catch (error) {
      console.error("Error generating diet plan:", error);
    } finally {
      setLoading(false);
    }
  };

const parseDietPlan = (dietPlanResponse) => {
  let cleanedResponse = dietPlanResponse;

  try {
    // Attempt to extract JSON array using regex
    const jsonMatch = dietPlanResponse.match(/\[.*\]/s); // Matches the first JSON array in the response
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    } else {
      console.error("No JSON array found in the response.");
      return [];
    }

    // Parse the extracted JSON
    const parsedResponse = JSON.parse(cleanedResponse);

    // Ensure parsedResponse is an array
    if (Array.isArray(parsedResponse)) {
      return parsedResponse.map((meal) => ({
        name: meal.name,
        recipe: meal.recipe,
        calories: meal.calories,
        macronutrients: meal.macronutrients,
        ingredients: meal.ingredients || [], // Default to empty array if ingredients is missing
      }));
    } else {
      console.error("Parsed response is not an array:", parsedResponse);
      return [];
    }
  } catch (error) {
    console.error("Error parsing diet plan response:", error);
    return [];
  }
};




  return (
    <View style={styles.container}>
      <View style={styles.testContainer}>
          <Card style={styles.testCard}>
          <View style={styles.imageWrapper}>
            <Image source={require('../../assets/png/nutrition.jpg')} style={styles.testImage} />
            <View style={styles.overlay}>
              <Text style={styles.testTitle}>Get a free Diet Plan</Text>
              <Text style={styles.description1}>Generate personalized meal plans tailored to your dietary needs and preferences.</Text>
              <Button mode="contained" onPress={generateDietPlan} labelStyle={{ color: '#000',fontFamily: 'CustomFont-Bold', }} style={styles.button}>
                Generate Plan
              </Button>
            </View>
          </View>
          </Card>
      </View>


      {/* Generate Plan Button */}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && dietPlan.length > 0 && (
        <FlatList
          data={dietPlan}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.meal}>
              <Text style={styles.mealTitle}>{item.name}</Text>
              <Text style={styles.mealText}>Recipe: {item.recipe}</Text>
              <Text style={styles.mealText}>Calories: {item.calories}</Text>
              <Text style={styles.mealText}>Macronutrients: {item.macronutrients}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#fff',
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
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeMessage: {
    fontSize: 14,
    fontFamily: 'CustomFont-Bold',

    margin: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  meal: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,

  },
  mealTitle: {
    fontSize: 18,
    fontFamily: 'CustomFont-Bold',
    textAlign: 'center',
  },
  mealText: {
      fontSize: 14,
      fontFamily: 'CustomFont',

  },
  button: {
      marginVertical: 8,
      backgroundColor: "#fff",
      borderRadius: 4,

  },
  testContainer: {
    padding: 16,
    width:'100%',
    backgroundColor: '#fff',
  },
  testCard: {
    backgroundColor: '#fff',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  testImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
  },
  testTitle: {
    fontSize: 18,
    fontFamily: 'CustomFont-Bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 8,

  },
  description1: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'CustomFont',
    marginBottom: 16,
  },
});
