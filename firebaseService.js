import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db, auth } from './firebaseConfig'; // Firebase Firestore configuration

// Fetch diet plan for a specific date
export const fetchDietPlanForDate = async (userId, date) => {
  try {
    const plans = {}; // Object to store plans for the date
    const timesCollectionRef = collection(db, `DietPlans/${userId}/${date}`);
    const timeSnapshots = await getDocs(timesCollectionRef);

    // If there are any documents for this date, proceed with adding them to the plans
    if (!timeSnapshots.empty) {
      plans[date] = []; // Initialize an array for the meals on this date

      timeSnapshots.forEach((timeDoc) => {
        const time = timeDoc.id; // Get the time (document ID)
        const meals = timeDoc.data().meals || []; // Fetch the meals array (default to empty if not found)

        // Add meals to the plans array, including the time in each meal
        meals.forEach(meal => {
          plans[date].push({
            ...meal, // Spread the meal data
            time,     // Add the time to each meal
          });
        });
      });

      return plans; // Return the structured plans with meals
    } else {
      return null; // No plan for this date
    }
  } catch (error) {
    console.error("Error fetching diet plan:", error);
    return null;
  }
};



export const saveDietPlan = async (userId, date, meals) => {
  const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);
  try {
    await setDoc(doc(db, `dietPlans/${userId}/plans`, date), {
      meals,
      totalCalories,
      followed: false, // Initially set to not followed
    });
    console.log("Diet plan saved successfully!");
  } catch (error) {
    console.error("Error saving diet plan:", error);
  }
};

// Mark diet plan as followed
export const markDietPlanAsFollowed = async (userId, date) => {
  try {
    const docRef = doc(db, `dietPlans/${userId}/plans`, date);
    await updateDoc(docRef, {
      followed: true,
    });
    console.log("Marked as followed!");
  } catch (error) {
    console.error("Error updating followed status:", error);
  }
};

export const saveMeal = async (meal) => {
  try {
    const trainerId = auth.currentUser?.uid; // Get the current trainer's UID

    if (!trainerId) {
      console.error("No trainer ID found.");
      return;
    }

    // Save the meal under the trainer's specific subcollection
    await setDoc(doc(db, "meals", trainerId, "trainerMeals", meal.name), meal);
    console.log("Meal saved successfully for trainer:", trainerId);
  } catch (error) {
    console.error("Error saving meal:", error);
  }
};
// Search meals by name
export const getMealsByName = async (partialName) => {
  try {
    const trainerId = auth.currentUser?.uid; // Get the current trainer's UID

    if (!trainerId) {
      console.error("No trainer ID found.");
      return [];
    }

    const mealsCollection = collection(db, "meals", trainerId, "trainerMeals");
    const querySnapshot = await getDocs(mealsCollection);

    const meals = [];
    querySnapshot.forEach((doc) => {
      const meal = doc.data();
      if (meal.name.toLowerCase().includes(partialName.toLowerCase())) {
        meals.push({ id: doc.id, ...meal });
      }
    });

    return meals;
  } catch (error) {
    console.error("Error fetching meals by name:", error);
    return [];
  }
};