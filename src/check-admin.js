// check-admin.js
import app from "./firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

export function initAuthListener({ onSignedOut, onSignedIn }) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      onSignedOut && onSignedOut();
      return;
    }

    // update UI with user info
    onSignedIn && onSignedIn({ displayName: user.displayName, photoURL: user.photoURL, email: user.email });

    // check admin
    const adminRef = doc(db, "admins", user.email);
    const adminSnap = await getDoc(adminRef);
    const isAdmin = adminSnap.exists();
    return { user, isAdmin };
  });
}
