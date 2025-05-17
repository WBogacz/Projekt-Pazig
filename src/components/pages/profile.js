import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../pages/profil.png";

const Profile = ({ setIsAuth }) => {
  const [targetWaist, setTargetWaist] = useState("");
  const [targetChest, setTargetChest] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Jeśli chcesz, możesz pobrać displayName z usera
      setNickname(user.displayName || user.email || "Użytkownik");
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
    } catch (error) {
      console.error("Błąd zapisu celu:", error);
      alert("Coś poszło nie tak przy zapisie danych.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut(); // wyloguj użytkownika w Firebase
      setIsAuth(false); // ustaw stan w aplikacji
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
        <nav className="menu">
          <ul>
            <li><Link to="/">Strona Główna</Link></li>
            <li><Link to="/Charts">Wykresy</Link></li>
            <li><Link to="/Profile">Profil</Link></li>
            <li>
              <button onClick={handleLogout}>Wyloguj</button>
            </li>
          </ul>
        </nav>
        <button className="pdf-button">Generuj PDFa</button>
      </aside>

      <main className="content">
        <h2>Profil</h2>

        {/* Tutaj dodajemy zdjęcie */}
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
