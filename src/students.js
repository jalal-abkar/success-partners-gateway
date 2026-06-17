// src/students.js
// Students CRUD helpers using Firestore
import app from './firebase-config';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const db = getFirestore(app);
const studentsCol = collection(db, 'students');

export async function addStudent(data) {
  // data: {name, nationalId, class, phone, guardianEmail, ...}
  const docRef = await addDoc(studentsCol, { ...data, createdAt: new Date().toISOString() });
  return docRef.id;
}

export async function updateStudent(id, data) {
  const d = doc(db, 'students', id);
  await updateDoc(d, { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteStudent(id) {
  const d = doc(db, 'students', id);
  await deleteDoc(d);
}

export async function getStudents({ name, firstChar, className, schoolNumber, limit = 50 } = {}) {
  let q = studentsCol;
  const conditions = [];
  if (className) conditions.push(where('class', '==', className));
  if (schoolNumber) conditions.push(where('schoolNumber', '==', schoolNumber));
  // simple name filter will be client-side if needed
  if (conditions.length) q = query(studentsCol, ...conditions, orderBy('createdAt', 'desc'));
  const snaps = await getDocs(q);
  let items = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
  if (name) items = items.filter(i => (i.name || '').toLowerCase().includes(name.toLowerCase()));
  if (firstChar) items = items.filter(i => (i.name || '').startsWith(firstChar));
  return items.slice(0, limit);
}

export async function markAttendance(studentId, dateISO, status) {
  // status: 'present'|'absent'|'late'
  const ref = doc(db, `attendance/${dateISO}/students`, studentId);
  await setDoc(ref, { status, updatedAt: new Date().toISOString() }, { merge: true });
}
