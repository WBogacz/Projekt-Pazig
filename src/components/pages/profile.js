import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../pages/profil.png";

const Profile = ({ setIsAuth }) => {
  const [targetWaist, setTargetWaist] = useState("");
  const [targetChest, setTargetChest] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [currentTargetWeight, setCurrentTargetWeight] = useState(null);
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setNickname(user.displayName || user.email || "Użytkownik");

      const q = query(
        collection(db, "progress"),
        where("user_id", "==", user.uid)
      );

      getDocs(q)
        .then(snapshot => {
          if (!snapshot.empty) {
            const latest = snapshot.docs
              .map(doc => doc.data())
              .sort((a, b) => new Date(b.date.toDate()) - new Date(a.date.toDate()))[0];

            if (latest.target_weight) {
              setCurrentTargetWeight(latest.target_weight);
            }
          }
        })
        .catch(error => {
          console.error("Błąd pobierania celu:", error);
        });
    }
  }, []);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Musisz być zalogowany, aby zapisać dane.");
      return;
    }

    try {
      await addDoc(collection(db, "progress"), {
        user_id: user.uid,
        target_waist: parseFloat(targetWaist),
        target_chest: parseFloat(targetChest),
        target_weight: parseFloat(targetWeight),
        date: new Date(),
      });
      alert("Cel zapisany pomyślnie!");
      setTargetWaist("");
      setTargetChest("");
      setTargetWeight("");

      setCurrentTargetWeight(parseFloat(targetWeight));
    } catch (error) {
      console.error("Błąd zapisu celu:", error);
      alert("Coś poszło nie tak przy zapisie danych.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      setIsAuth(false); 
      alert("Wylogowano.");
      navigate("/login");
    } catch (error) {
      console.error("Błąd przy wylogowaniu:", error);
      alert("Coś poszło nie tak przy wylogowaniu.");
    }
  };

  return (
    <div className="home-container">
      <aside className="sidebar">
        <div className="profile-icon" />
        <p className="nickname">{nickname}</p>
        <div className="menu">
          <Link to="/" className="menu-item">Strona Główna</Link>
          <Link to="/Charts" className="menu-item">Wykresy</Link>
          <Link to="/Profile" className="menu-item">Profil</Link>
          <button className="menu-item" onClick={handleLogout}>Wyloguj</button>
        </div>
        <button className="pdf-button">Generuj PDFa</button>
      </aside>

      <main className="content">
        <h2>Profil</h2>

        <img
          src={profileImg}
          alt="Profil"
          style={{ width: "120px", borderRadius: "50%", marginBottom: "20px" }}
        />

        <div className="form-section">
          <label>Docelowa waga (kg)</label>
          <input
            type="number"
            step="0.01"
            placeholder="np. 70.00"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="input-box"
          />

          {currentTargetWeight !== null && (
            <p style={{ marginTop: "8px", fontSize: "14px", color: "#555" }}>
              Aktualna docelowa waga: <strong>{currentTargetWeight} kg</strong>
            </p>
          )}

          <div className="button-row">
            <button className="confirm-button" onClick={handleSubmit}>
              Zapisz cel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
