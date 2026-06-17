// scripts/add-admin.js
// One-time script to add the Super Admin into Firestore. RUN LOCALLY only after setting up firebase-config.js

import app from "../src/firebase-config";
import { getFirestore, setDoc, doc } from "firebase/firestore";

async function addAdmin(email) {
  const db = getFirestore(app);
  await setDoc(doc(db, "admins", email), {
    role: "super",
    addedAt: new Date().toISOString()
  });
  console.log("Admin added:", email);
}

// run via: node ./scripts/add-admin.js <email>
if (require.main === module) {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node ./scripts/add-admin.js <email>");
    process.exit(1);
  }
  addAdmin(email).catch(err => { console.error(err); process.exit(1); });
}
