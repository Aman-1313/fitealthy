import 'react-native-get-random-values';

import React,  { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';
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
import StripeWebViewScreen from './screens/clientScreens/StripeWebViewScreen';
import Homepage from './screens/clientScreens/Homepage';
import BookTest from './screens/clientScreens/BookTest';
import MentalHealth from './screens/clientScreens/MentalHealth';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


enableScreens();

// Bottom Tab Navigator for Homepage and Community
function MainTabNavigator({ route }) {


  return (
     <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              }
//              else if (route.name === 'HealthyVideosScreen') {
//                 iconName = focused ? 'videocam' : 'videocam-outline';
//              }
              else if (route.name === 'TrackerTab') {
                iconName = focused ? 'fitness' : 'fitness-outline';
              } else if (route.name === 'PaidFeaturesScreen') {
                iconName = focused ? 'document' : 'document-outline';
              }else if (route.name === 'CommunityTab') {
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
            component={Homepage}
            options={{ title: 'Home' }}
          />
          {/*<Tab.Screen
              name="HealthyVideosScreen"
              component={HealthyVideosScreen}
              options={{ title: 'Media' }}
          />*/}
          <Tab.Screen
              name="CommunityTab"
              component={Community}
              options={{ title: 'Community' }}
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
{/*
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
*/}
// Login Stack
function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// Signup Stack
function SignupStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="UserDataForm" component={UserDataForm} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'CustomFont': require('./assets/fonts/SpaceMono-Regular.ttf'),
    'CustomFont-Bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
  });
  const [appState, setAppState] = useState(AppState.currentState);
  const [appData, setAppData] = useState({ username: '', loggedIn: false });
  const [user, setUser] = useState(null);
  const [initialRoute, setInitialRoute] = useState('LoginStack');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
      setUser(authenticatedUser);
      if (authenticatedUser) {
        const savedRoute = await AsyncStorage.getItem('@last_route');
        if (savedRoute) setInitialRoute(savedRoute);
      }
    });

    loadAppState();

    return () => {
      subscription.remove();
      unsubscribeAuth();
    };
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    if (appState.match(/active/) && nextAppState === 'background') {
      await saveAppState();
      await saveLastRoute();
    }
    setAppState(nextAppState);
  };

  const saveAppState = async () => {
    try {
      await AsyncStorage.setItem('@app_state', JSON.stringify(appData));
    } catch (e) {
      console.error('Failed to save app state:', e);
    }
  };

  const loadAppState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('@app_state');
      if (savedState) {
        setAppData(JSON.parse(savedState));
      }
    } catch (e) {
      console.error('Failed to load app state:', e);
    }
  };

  const saveLastRoute = async () => {
    try {
      const currentRoute = await AsyncStorage.getItem('@current_route');
      if (currentRoute) {
        await AsyncStorage.setItem('@last_route', currentRoute);
      }
    } catch (e) {
      console.error('Failed to save last route:', e);
    }
  };

  const trackCurrentRoute = async (routeName) => {
    try {
      await AsyncStorage.setItem('@current_route', routeName);
    } catch (e) {
      console.error('Failed to track current route:', e);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={initialRoute}
          >
            {user ? (
              <>
                <Stack.Screen
                  name="Main"
                  component={MainTabNavigator}
                  listeners={({ route }) => ({
                    state: () => trackCurrentRoute(route.name),
                  })}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="LoginStack1"
                  component={LoginStack}
                  listeners={({ route }) => ({
                    state: () => trackCurrentRoute(route.name),
                  })}
                />
                <Stack.Screen
                  name="SignupStack1"
                  component={SignupStack}
                  listeners={({ route }) => ({
                    state: () => trackCurrentRoute(route.name),
                  })}
                />
              </>
            )}
            {/* Other screens */}
            <Stack.Screen name="LoginStack" component={LoginStack} />
            <Stack.Screen name="UserDataForm" component={UserDataForm} />
            <Stack.Screen name="TrainerInteractionScreen" component={TrainerInteractionScreen} />
            <Stack.Screen name="TrainerMealsComponent" component={TrainerMealsComponent} />
            <Stack.Screen name="ClientList" component={ClientList} />
            <Stack.Screen name="DietPlans" component={DietPlans} />
            <Stack.Screen name="WorkoutTrainers" component={WorkoutTrainers} />
            <Stack.Screen name="ClothingStore" component={ClothingStore} />
            <Stack.Screen name="SupplementStore" component={SupplementStore} />
            <Stack.Screen name="CommunityTab" component={Community} />
            <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
            <Stack.Screen name="DietitianProfile" component={DietitianProfile} />
            <Stack.Screen name="TrainerProfile" component={TrainerProfile} />
            <Stack.Screen name="FAQ" component={FAQ} />
            <Stack.Screen name="BookTest" component={BookTest} />
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
            <Stack.Screen name="StripeWebView" component={StripeWebViewScreen} />
            <Stack.Screen name="MentalHealth" component={MentalHealth} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

