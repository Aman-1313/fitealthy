import React, { useState } from 'react';
import { View, StyleSheet, StatusBar  } from 'react-native';

import LoginScreen from './screens/loginAndSignup/LoginScreen';
import TrainerLoginScreen from './screens/loginAndSignup/TrainerLoginScreen';
import SignupScreen from './screens/loginAndSignup/SignupScreen';
import TrainerSignupScreen from './screens/loginAndSignup/TrainerSignupScreen';
import UserDataForm from './screens/loginAndSignup/UserDataForm';
import TrainerDataForm from './screens/loginAndSignup/TrainerDataForm';

import TrainerInteractionScreen from './screens/TrainerInteractionScreen';

import UserProfileScreen from './screens/UserProfileScreen';

import TrainerDashboardScreen from './screens/trainerScreens/TrainerDashboardScreen';
import TrainerAccountInfoScreen from './screens/trainerScreens/TrainerAccountInfoScreen';
import ClientInfoScreen from './screens/trainerScreens/ClientInfoScreen';
import EditProfileTrainer from './screens/trainerScreens/EditProfileTrainer';

import Homepage from './screens/clientScreens/Homepage';

import DietPlans from './screens/clientScreens/DietPlans'; // Add these components
import WorkoutTrainers from './screens/WorkoutTrainers';
import ClothingStore from './screens/ClothingStore';
import SupplementStore from './screens/clientScreens/SupplementStore';
import Community from './screens/Community';
import CommentsScreen from './components/CommentsScreen';
import FAQ from './components/FAQ';
import AboutUsScreen from './components/AboutUsScreen';
import HelpAndSupportScreen from './components/HelpAndSupportScreen';



import Tracker from './screens/clientScreens/Tracker';
import BMICalculator from './components/healthTrackers/BMICalculator';
import BodyFatCalculator from './components/healthTrackers/BodyFatCalculator';
import CalorieCalculator from './components/healthTrackers/CalorieCalculator';

import DietitianProfile from './components/DietitianProfile';
import TrainerProfile from './components/TrainerProfile';
import TrainerMealsComponent from './components/trainerComponents/TrainerMealsComponent';

import EditProfile from './components/EditProfile';
import FetchSelectedPlan from './components/FetchSelectedPlan';



import AccountInfo from './screens/clientScreens/AccountInfo';

import ClientList from './screens/trainerScreens/ClientList';
import  AssignDietScreen from './screens/trainerScreens/AssignDietScreen';

import PaidPlansScreen from './screens/clientScreens/PaidPlansScreen';
import PaidFeaturesScreen from './screens/clientScreens/PaidFeaturesScreen';
import LabTestsList from './screens/clientScreens/LabTestsList';
import HealthyVideosScreen from './screens/clientScreens/HealthyVideosScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { useFonts } from 'expo-font';
// Bottom Tab Navigator for Homepage and Community
function MainTabNavigator({ route }) {
const { username, userId } = route.params;

  return (
     <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'HealthyVideosScreen') {
                 iconName = focused ? 'videocam' : 'videocam-outline';
              } else if (route.name === 'TrackerTab') {
                iconName = focused ? 'fitness' : 'fitness-outline';
              } else if (route.name === 'PaidFeaturesScreen') {
                iconName = focused ? 'document' : 'document-outline';
              }


              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="HomeTab"
            component={Homepage}
            options={{ title: 'Home' }}
            initialParams={{ username: username, userId: userId }}
          />
          <Tab.Screen
              name="HealthyVideosScreen"
              component={HealthyVideosScreen}
              options={{ title: 'Media' }}
            />
          <Tab.Screen
            name="PaidFeaturesScreen"
            component={PaidFeaturesScreen}
            options={{ title: 'My Plan' }}
          />

          <Tab.Screen
            name="TrackerTab"
            component={Tracker}
            options={{ title: 'Tracker' }}
          />
        </Tab.Navigator>
  );
}

function MainTabNavigatorTrainer({ route }) {
const { username, userId } = route.params;
  return (
     <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'CommunityTab') {
                iconName = focused ? 'people' : 'people-outline';
              }


              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="HomeTab"
            component={TrainerDashboardScreen}
            options={{ title: 'Home' }}

          />

          <Tab.Screen
            name="CommunityTab"
            component={Community}
            options={{ title: 'Community' }}
            initialParams={{isTrainer: true }}
          />

        </Tab.Navigator>
  );
}

export default function App() {
    const [fontsLoaded] = useFonts({
      'CustomFont': require('./assets/fonts/SpaceMono-Regular.ttf'),
      'CustomFont-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
    });
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
         headerShown: false, // Hides the header for all screens
      }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />

              <Stack.Screen name="TrainerLoginScreen" component={TrainerLoginScreen} />
              <Stack.Screen name="TrainerSignupScreen" component={TrainerSignupScreen} />

              <Stack.Screen name="TrainerDataForm" component={TrainerDataForm} />
              <Stack.Screen name="TrainerDashboardScreen" component={TrainerDashboardScreen} />
              <Stack.Screen name="TrainerAccountInfo" component={TrainerAccountInfoScreen} />
              <Stack.Screen name="ClientInfoScreen" component={ClientInfoScreen} />
              <Stack.Screen name="EditProfileTrainer" component={EditProfileTrainer} />

              <Stack.Screen name="AssignDietScreen" component={AssignDietScreen} />
              <Stack.Screen name="TrainerInteractionScreen" component={TrainerInteractionScreen} />
              <Stack.Screen name="TrainerMealsComponent" component={TrainerMealsComponent} />

              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name="Main2" component={MainTabNavigatorTrainer} />

              <Stack.Screen name="ClientList" component={ClientList} />
              <Stack.Screen name="UserDataForm" component={UserDataForm} />
              <Stack.Screen name="DietPlans" component={DietPlans} />
              <Stack.Screen name="WorkoutTrainers" component={WorkoutTrainers} />
              <Stack.Screen name="ClothingStore" component={ClothingStore} />
              <Stack.Screen name="SupplementStore" component={SupplementStore} />

              <Stack.Screen name="CommunityTab" component={Community} />
              <Stack.Screen name="CommentsScreen" component={CommentsScreen} />

              <Stack.Screen name="DietitianProfile" component={DietitianProfile} />
              <Stack.Screen name="TrainerProfile" component={TrainerProfile} />
              <Stack.Screen name="FAQ" component={FAQ} />
              <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
              <Stack.Screen name="HelpAndSupportScreen" component={HelpAndSupportScreen} />
              <Stack.Screen name="PaidPlansScreen" component={PaidPlansScreen} />
              <Stack.Screen name="LabTestsList" component={LabTestsList} />
              <Stack.Screen name="EditProfile" component={EditProfile} />

              <Stack.Screen name="FetchSelectedPlan" component={FetchSelectedPlan} />


              <Stack.Screen name="AccountInfo" component={AccountInfo} />
              <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />

              <Stack.Screen name="BMICalculator" component={BMICalculator} />
              <Stack.Screen name="BodyFatCalculator" component={BodyFatCalculator} />
              <Stack.Screen name="CalorieCalculator" component={CalorieCalculator} />

      </Stack.Navigator>
      </NavigationContainer>
    );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#ff5', // Add background color to match app theme
  },
});