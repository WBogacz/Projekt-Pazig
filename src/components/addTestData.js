import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";

const AddTestData = () => {
  const handleAdd = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("Brak zalogowanego użytkownika.");
      return;
    }

    try {
      await addDoc(collection(db, "circumference"), {
        user_id: user.uid,
        waist: 86.2,
        chest: 104.5,
        date: new Date()
      });
      console.log("Dodano dane do kolekcji 'circumference'");
    } catch (error) {
      console.error("Błąd przy dodawaniu dokumentu:", error);
    }
  };

  return (
    <div>
      <button onClick={handleAdd}>Dodaj dane testowe</button>
    </div>
  );
};

export default AddTestData;
