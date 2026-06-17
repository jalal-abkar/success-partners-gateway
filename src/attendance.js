// src/attendance.js
// Simple attendance marking scaffold. Stores records in Firestore if available, else localStorage.

import { initFirebase } from './firebase/init.js';

const COLLECTION = 'attendance_records';

export async function markAttendance(studentId, dateISO, status = 'present') {
  const app = initFirebase();
  const payload = { studentId, date: dateISO, status, updatedAt: new Date().toISOString() };
  if (app && window.firebase && firebase.firestore) {
    const db = firebase.firestore();
    const id = `${studentId}_${dateISO}`;
    await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
    return true;
  }
  const arr = JSON.parse(localStorage.getItem(COLLECTION) || '[]');
  const idx = arr.findIndex(r => r.studentId === studentId && r.date === dateISO);
  if (idx !== -1) arr[idx] = { ...arr[idx], ...payload }; else arr.push(payload);
  localStorage.setItem(COLLECTION, JSON.stringify(arr));
  return true;
}

export async function getAttendanceByDate(dateISO) {
  const app = initFirebase();
  if (app && window.firebase && firebase.firestore) {
    const snap = await firebase.firestore().collection(COLLECTION).where('date', '==', dateISO).get();
    return snap.docs.map(d => d.data());
  }
  return JSON.parse(localStorage.getItem(COLLECTION) || '[]').filter(r => r.date === dateISO);
}

export function exportAttendanceCSV(dateISO) {
  const rows = [['studentId','date','status','updatedAt']];
  const arr = JSON.parse(localStorage.getItem(COLLECTION) || '[]').filter(r => r.date === dateISO);
  arr.forEach(r => rows.push([r.studentId, r.date, r.status, r.updatedAt]));
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `attendance_${dateISO}.csv`; document.body.appendChild(a); a.click(); a.remove();
}
