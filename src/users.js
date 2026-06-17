// src/users.js
// User and roles helpers (Firebase modular SDK)
import app from './firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

export async function saveUserIfNotExists(user) {
  if (!user) return null;
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email || '',
      photoURL: user.photoURL || '',
      role: 'visitor', // default role
      createdAt: new Date().toISOString()
    });
  }
  return userRef;
}

export async function getUserRoleByEmail(email) {
  if (!email) return null;
  const adminRef = doc(db, 'admins', email);
  const adminSnap = await getDoc(adminRef);
  if (adminSnap.exists()) return 'admin';
  // fallback: check users collection by email
  // This function can be extended
  return null;
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null);
    await saveUserIfNotExists(user);
    const role = await getUserRoleByEmail(user.email);
    callback({ uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL, role: role || 'user' });
  });
}
