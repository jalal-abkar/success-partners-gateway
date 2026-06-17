// src/firebase/init.js
// Initializes Firebase if CONFIG.firebase fields are set (placeholders used in src/config.js).
// This file expects src/config.js to export CONFIG (placeholders). Replace placeholders by env-managed values
// in production, or set CONFIG values locally for development.

import CONFIG from './config.js';

let firebaseApp = null;

export function initFirebase() {
  if (typeof window === 'undefined') return null;
  if (window.firebase && firebase.apps && firebase.apps.length) {
    firebaseApp = firebase.app();
    return firebaseApp;
  }

  if (!CONFIG || !CONFIG.firebase || CONFIG.firebase.apiKey === 'YOUR_FIREBASE_API_KEY') {
    console.warn('Firebase config not set. Skipping firebase initialization (use env vars or update src/config.js).');
    return null;
  }

  const fbConfig = {
    apiKey: CONFIG.firebase.apiKey,
    authDomain: CONFIG.firebase.authDomain,
    projectId: CONFIG.firebase.projectId,
    storageBucket: CONFIG.firebase.storageBucket,
    messagingSenderId: CONFIG.firebase.messagingSenderId,
    appId: CONFIG.firebase.appId,
  };

  firebaseApp = firebase.initializeApp(fbConfig);
  return firebaseApp;
}
