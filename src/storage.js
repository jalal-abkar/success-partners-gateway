// storage.js
import app from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const storage = getStorage(app);
const db = getFirestore(app);

export async function uploadProfileImage(file, uid) {
  if (!file || !uid) throw new Error("file and uid are required");
  const storageRef = ref(storage, `profile-images/${uid}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { photoURL: url }).catch(async err => {
    // If the user doc doesn't exist yet, create it
    await setDoc(userRef, { photoURL: url }, { merge: true });
  });

  return url;
}
