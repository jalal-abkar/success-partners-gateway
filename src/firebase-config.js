// firebase-config.js
// Placeholder file: copy your Firebase client config here or set environment variables before build.
// Recommended: set environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY) and use them in your build.

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "<API_KEY>",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "<PROJECT>.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "<PROJECT>",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "<PROJECT>.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "<SENDER_ID>",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "<APP_ID>",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined
};

const app = initializeApp(firebaseConfig);
export default app;
