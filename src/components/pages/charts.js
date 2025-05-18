import React, {useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../config/firebase";
import { collection, query, where, getDocs} from "firebase/firestore";
import "../styles/home.css";

const Charts = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setNickname(user.displayName || user.email || "Użytkownik");
      fetchMeasurements(user.uid);
    }
  }, []);

const fetchMeasurements = async (userId) => {
    try {
      const q = query(
        collection(db, "circumference"),
        where("user_id", "==", userId)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.date.toDate()) - new Date(a.date.toDate()));
      setMeasurements(data);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuth(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
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
        <h2>Wykresy</h2>
        <h2>Historia pomiarów</h2>
        <table className="measurement-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Waga (kg)</th>
              <th>Klatka (cm)</th>
              <th>Pas (cm)</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map(item => (
              <tr key={item.id}>
                <td>{new Date(item.date.toDate()).toLocaleDateString()}</td>
                <td>{item.weight}</td>
                <td>{item.chest}</td>
                <td>{item.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Charts;