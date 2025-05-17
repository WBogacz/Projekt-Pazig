// src/services/firestoreService.js
import { db, auth } from "firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export const addCircumference = async (waist, chest) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "circumference"), {
    user_id: user.uid,
    waist: parseFloat(waist),
    chest: parseFloat(chest),
    date: new Date()
  });
};

export const addProgress = async (targetWaist, targetChest) => {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "progress"), {
    user_id: user.uid,
    target_waist: parseFloat(targetWaist),
    target_chest: parseFloat(targetChest),
    created_at: new Date(),
    updated_at: new Date()
  });
};

