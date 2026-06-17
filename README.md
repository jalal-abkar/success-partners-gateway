# success-partners-gateway

This repository contains the Success Partners Gateway front-end.

## Phase‑1: Setup & Local Development

These instructions help you get the project running locally and configure Firebase (Auth, Firestore, Storage) and deployment on Vercel.

### Prerequisites
- Node.js (16+ recommended)
- npm or pnpm
- A Firebase project (client config)
- A Vercel account (optional, for deployment)

### 1) Install dependencies
```bash
# using npm
npm install

# or using pnpm
pnpm install
```

### 2) Firebase client config
Create a file `src/firebase-config.js` (or `firebase-config.js` at project root) and paste your Firebase client config object. Do NOT put service account keys or any server-secret in the repo.

Example `firebase-config.js` (client-only):

```javascript
// firebase-config.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT>.firebaseapp.com",
  projectId: "<PROJECT>",
  storageBucket: "<PROJECT>.appspot.com",
  messagingSenderId: "<SENDER_ID>",
  appId: "<APP_ID>",
  measurementId: "<MEASUREMENT_ID>" // optional
};

const app = initializeApp(firebaseConfig);
export default app;
```

> If you already supplied a config (client values only), place those values into the file above.

### 3) Authentication + Super Admin
There are two recommended ways to manage the Super Admin account (`g774000655@gmail.com`):

Option A (recommended): Add an `admins` document manually in Firestore Console.
- Go to Firebase Console → Firestore → Create collection `admins`.
- Add a document with ID equal to the admin email, e.g. `g774000655@gmail.com` and fields like `{ role: "super", addedAt: "2026-06-17T..." }`.
- Use Firestore security rules to prevent writes from untrusted clients (example below).

Option B: Bootstrap via a one-time script in development (not recommended for production) that writes an `admins` doc.

### 4) Example client code (what to add)
Add a small auth helper to sign in with Google and persist user data to Firestore, upload profile images to Storage, and check admin status. Example files were provided in project notes (`auth.js`, `storage.js`, `check-admin.js`).

### 5) Firestore & Storage rules (suggested)
Firestore rules (example):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /admins/{email} {
      allow read: if request.auth != null;
      allow write: if false; // add admins from Console or trusted backend only
    }
  }
}
```

Storage rules (example):

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 6) Run the app locally
```bash
# dev server
npm run dev
# or
pnpm run dev
```

Check the project's package.json scripts if the commands differ.

### 7) Deployment (Vercel)
1. Create a Vercel project and connect the GitHub repo.
2. In Vercel project settings, add any required Environment Variables (if you prefer not to commit the firebase config file). For a front-end-only app, the Firebase client config can live in the code, but secrets should go into env vars.
3. Deploy — Vercel will run the build script defined in `package.json`.

### Security notes
- NEVER commit service account JSON or other secrets to the repository. Use Vercel environment variables or a secure backend.
- Restrict writes to `admins` collection via Firestore rules and add admins via Console or a secure backend.

### What I updated / Next steps
- Add a `firebase-config.js` file with your client config.
- Add the Google Sign‑In logic and Storage upload helpers (see project notes).
- Add the `admins` document for `g774000655@gmail.com` in Firestore (recommended to add via Console).

If you want, I can: 
- Create a branch and open a PR with the `firebase-config.js` placeholder, the auth/storage helper files, and an updated README. (I'll need write access to the repo.)
- Or you can upload a ZIP and I'll return updated files.

Tell me which you prefer and I'll proceed.
