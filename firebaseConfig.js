// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBjrY0iI806yVGlx9VaUWjpoRJUqtgHWEY",
    authDomain: "alpha-cf25d.firebaseapp.com",
    projectId: "alpha-cf25d",
    storageBucket: "alpha-cf25d.appspot.com",
    messagingSenderId: "676508521353",
    appId: "1:676508521353:web:42a91c6ee07a2a2b380758",
    measurementId: "G-FDKZHBZF1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// initialize Firebase Auth for that app immediately
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore(app);
const storage = getStorage(app);
export { app, auth, getApp, getAuth, db, storage};

//android: 113398220397-1cciq0hktkkca7v6t8isa4nin1ncnmds.apps.googleusercontent.com

//rules_version = '2';
//
//service cloud.firestore {
//  match /databases/{database}/documents {
//
//    // Rules for user profiles
//    match /users/{userId} {
//      allow read: if request.auth != null; // Allow any authenticated user to read user profiles
//      allow write: if request.auth != null && request.auth.uid == userId; // Only allow users to write to their own profile
//    }
//
//    // Rules for posts
//    match /posts/{postId} {
//      allow read: if request.auth != null; // Any authenticated user can read posts
//      allow create: if request.auth != null && request.auth.uid == resource.data.userId; // Only the post creator can write
//      allow delete: if request.auth != null && request.auth.uid == resource.data.userId; // Only post creator can delete
//
//      // Comments subcollection for each post
//      match /comments/{commentId} {
//        allow read: if request.auth != null; // Allow any authenticated user to read comments
//        allow write: if request.auth != null && request.auth.uid == request.resource.data.userId; // Allow users to create and edit their own comments
//      }
//    }
//
//    // Rules for user following relationships
//    match /users/{userId}/following/{followedUserId} {
//      allow read: if request.auth != null && request.auth.uid == userId; // Only allow user to read their own following list
//      allow write: if request.auth != null && request.auth.uid == userId; // Only allow user to modify their own following list
//    }
//
//    // Chat functionality rules
//    match /chats/{chatId} {
//      allow read, write: if request.auth != null;
//
//      // Messages subcollection within each chat
//      match /messages/{messageId} {
//        allow read, write: if request.auth != null;
//      }
//    }
//
//    // Trainer-specific rules (if applicable to other parts of your app)
//    match /meals/{trainerId} {
//      allow read, write: if request.auth != null && request.auth.uid == trainerId;
//
//      match /trainerMeals/{mealId} {
//        allow read, write: if request.auth != null && request.auth.uid == trainerId;
//      }
//    }
//
//    match /trainers/{trainerId} {
//      allow read: if request.auth != null;
//      allow write: if request.auth.uid == trainerId;
//    }
//
//    match /trainers/{trainerId}/ratings/{userId} {
//      allow read: if request.auth != null;
//      allow create, update: if request.auth.uid == userId;
//    }
//
//    // Diet Plans and Paid Plans access
//    match /dietPlans/{userId}/plans/{planId} {
//      allow read, write: if request.auth != null && request.auth.uid == userId;
//    }
//
//    match /paidPlans/{planId} {
//      allow read: if true; // Public access for viewing available paid plans
//      allow write: if request.auth != null;
//    }
//
//    // Community stories
//    match /stories/{storyId} {
//      allow read: if true;
//      allow write: if request.auth != null;
//    }
//  }
//}
