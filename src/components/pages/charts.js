import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import "../styles/home.css";

const Charts = ({ setIsAuth }) => {
  const navigate = useNavigate();

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
        <p className="nickname">Użytkownik</p>
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
      </main>
    </div>
  );
};

export default Charts;