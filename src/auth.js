// auth.js
import app from "./firebase-config";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const userRef = doc(db, "users", user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    lastSeen: new Date().toISOString()
  }, { merge: true });

  const adminRef = doc(db, "admins", user.email);
  const adminSnap = await getDoc(adminRef);
  const isAdmin = adminSnap.exists();

  return { user, isAdmin };
}

export function logout() {
  return signOut(auth);
}
