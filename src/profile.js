// src/profile.js
// Profile helper: preview and upload profile image (Firebase Storage if available), fallback to localStorage

import CONFIG from './config.js';
import { initFirebase } from './firebase/init.js';

export async function previewSchoolLogoFile(file, previewImgElId='chosenLogoImg') {
  const reader = new FileReader();
  reader.onload = function(e) {
    const output = document.getElementById(previewImgElId);
    if (!output) return;
    output.src = e.target.result;
    output.style.display = 'block';
    const icon = document.getElementById('logoIcon'); if (icon) icon.style.display = 'none';
    const hint = document.getElementById('logoTextHint'); if (hint) hint.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

export async function uploadProfileImage(file, userId) {
  // Try Firebase Storage if initialized
  const app = initFirebase();
  if (app && window.firebase && firebase.storage) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`profiles/${userId}/${Date.now()}_${file.name}`);
    const snap = await fileRef.put(file);
    const url = await snap.ref.getDownloadURL();
    return url;
  }

  // Fallback: store as data URL in localStorage (only for prototype)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const key = `profile_image_${userId}`;
      try { localStorage.setItem(key, reader.result); resolve(reader.result); } catch (e) { reject(e); }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
