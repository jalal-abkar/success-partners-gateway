// src/chat.js
// Basic chat helpers: create room, send message, listen messages
import app from './firebase-config';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const db = getFirestore(app);
const storage = getStorage(app);

export async function createRoom(name, meta = {}) {
  const roomsCol = collection(db, 'rooms');
  const docRef = await addDoc(roomsCol, { name, meta, createdAt: serverTimestamp() });
  return docRef.id;
}

export function listenMessages(roomId, callback) {
  if (!roomId) return () => {};
  const msgsCol = collection(db, `rooms/${roomId}/messages`);
  const q = query(msgsCol, orderBy('createdAt', 'asc'));
  const unsub = onSnapshot(q, snap => {
    const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(msgs);
  });
  return unsub;
}

export async function sendTextMessage(roomId, user, text) {
  if (!roomId || !user) throw new Error('roomId and user required');
  const msgsCol = collection(db, `rooms/${roomId}/messages`);
  await addDoc(msgsCol, { type: 'text', text, uid: user.uid, displayName: user.displayName, photoURL: user.photoURL || '', createdAt: serverTimestamp() });
}

export async function uploadMediaFile(file, pathPrefix = 'chat-media') {
  const storageRef = ref(storage, `${pathPrefix}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function sendMediaMessage(roomId, user, file, mimeType) {
  const url = await uploadMediaFile(file);
  const msgsCol = collection(db, `rooms/${roomId}/messages`);
  await addDoc(msgsCol, { type: mimeType.startsWith('image') ? 'image' : mimeType.startsWith('audio') ? 'audio' : 'file', url, name: file.name, uid: user.uid, displayName: user.displayName, createdAt: serverTimestamp() });
}
