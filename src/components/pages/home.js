import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import "../styles/home.css";

const Home = ({ setIsAuth }) => {
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [weight, setWeight] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
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
      await addDoc(collection(db, "circumference"), {
        user_id: user.uid,
        waist: parseFloat(waist),
        chest: parseFloat(chest),
        weight: parseFloat(weight),
        date: new Date(),
      });
      alert("Dane zapisane pomyślnie!");
      setWaist("");
      setChest("");
      setWeight("");
    } catch (error) {
      console.error("Błąd przy dodawaniu danych:", error);
      alert("Coś poszło nie tak przy zapisywaniu danych.");
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
        <nav className="menu">
          <ul>
            <li><Link to="/">Strona Główna</Link></li>
            <li><Link to="/Charts">Wykresy</Link></li>
            <li><Link to="/Profile">Profil</Link></li>
            <li><button onClick={handleLogout}>Wyloguj</button></li>
          </ul>
        </nav>
        <button className="pdf-button">Generuj PDFa</button>
      </aside>

      <main className="content">
        <h2>Podaj swoje dane</h2>

        <div className="form-section">
          <label>Obwód klatki piersiowej (cm)</label>
          <input
            type="number"
            placeholder="cm"
            value={chest}
            onChange={(e) => setChest(e.target.value)}
            className="input-box"
          />

          <label>Obwód w pasie (cm)</label>
          <input
            type="number"
            placeholder="cm"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className="input-box"
          />

          <label>Waga (kg)</label>
          <input
            type="number"
            placeholder="kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-box"
          />

          <div className="button-row">
            <button className="confirm-button" onClick={handleSubmit}>
              Zatwierdź
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
