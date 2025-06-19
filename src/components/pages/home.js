import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import "../styles/home.css";

const Home = ({ setIsAuth }) => {
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [weight, setWeight] = useState("");
  const [nickname, setNickname] = useState("");
  const [measurements, setMeasurements] = useState([]);
  const [targetWeight, setTargetWeight] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setNickname(user.displayName || user.email || "Użytkownik");
      getMeasurements(user.uid);
      getTarget(user.uid);
    }
  }, []);

  const getMeasurements = async (userId) => {
    try {
      const q = query(
        collection(db, "circumference"),
        where("user_id", "==", userId)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort(
          (a, b) => new Date(b.date.toDate()) - new Date(a.date.toDate())
        );
      setMeasurements(data);
    } catch (error) {
      console.error("Błąd pobierania pomiarów:", error);
    }
  };

  const getTarget = async (userId) => {
    try {
      const q = query(
        collection(db, "progress"),
        where("user_id", "==", userId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const allData = snapshot.docs.map(doc => doc.data());
        const sorted = allData.sort(
          (a, b) => new Date(b.date.toDate()) - new Date(a.date.toDate())
        );
        const latest = sorted[0];

        if (latest.target_weight) {
          setTargetWeight(latest.target_weight);
        }
      }
    } catch (error) {
      console.error("Błąd pobierania celu:", error);
    }
  };


  const formatDecimalInput = (value) => {
    let val = value.replace(/[^\d.,]/g, "");
    val = val.replace(/,/g, ".");
    const parts = val.split(".");
    if (parts.length > 2) {
      val = parts[0] + "." + parts.slice(1).join("");
    }
    return val;
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await addDoc(collection(db, "circumference"), {
        user_id: user.uid,
        waist: parseFloat(waist),
        chest: parseFloat(chest),
        weight: parseFloat(weight),
        date: new Date(),
      });

      await getMeasurements(user.uid);
      await getTarget(user.uid);

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

  const startWeight = measurements.length > 0
    ? measurements[measurements.length - 1].weight
    : null;

  const latestWeight = measurements.length > 0
    ? measurements[0].weight
    : null;

  let weightProgress = null;
  let weightRemaining = null;
  if (startWeight !== null && targetWeight !== null && latestWeight !== null) {
    const totalToLose = startWeight - targetWeight;
    const lost = startWeight - latestWeight;
    weightProgress = Math.min(100, Math.max(0, ((lost / totalToLose) * 100).toFixed(1)));
    weightRemaining = (latestWeight - targetWeight).toFixed(1);
  }

  const getProgressColor = (progress) => {
    if (progress < 50) return "#f87171";
    if (progress < 80) return "#fbbf24";
    return "#34d399";
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
        <h2>Podaj swoje dane</h2>

        <div className="form-section">
          <label>Obwód klatki piersiowej (cm)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="cm"
            value={chest}
            onChange={(e) => setChest(formatDecimalInput(e.target.value))}
            className="input-box"
          />

          <label>Obwód w pasie (cm)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="cm"
            value={waist}
            onChange={(e) => setWaist(formatDecimalInput(e.target.value))}
            className="input-box"
          />

          <label>Waga (kg)</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="kg"
            value={weight}
            onChange={(e) => setWeight(formatDecimalInput(e.target.value))}
            className="input-box"
          />

          <div className="button-row">
            <button className="confirm-button" onClick={handleSubmit}>
              Zatwierdź
            </button>
          </div>
        </div>
        {weightProgress !== null && (
          <div className="progress-display">
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${weightProgress}%`,
                  backgroundColor: getProgressColor(weightProgress),
                }}
              />
            </div>
            <h3 style={{ marginTop: "10px" }}>Postęp: {weightProgress}%</h3>
            <p>Pozostało do celu: {weightRemaining} kg</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default Home;
