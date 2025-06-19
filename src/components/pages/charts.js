import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import "../styles/home.css";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

const Charts = ({ setIsAuth }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [measurements, setMeasurements] = useState([]);
  const chartRef = useRef(null);

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
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(a.date.toDate()) - new Date(b.date.toDate()));
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

  const handleGeneratePDF = async () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Historia pomiarów", 14, 22);

    const textInfo = `Użytkownik: ${nickname}\nData wygenerowania: ${new Date().toLocaleDateString()}`;
    pdf.setFontSize(12);
    pdf.text(textInfo, 14, 32);

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = pdf.internal.pageSize.getWidth() - 28;
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 14, 40, pdfWidth, imgHeight);
      pdf.addPage();
    }

    const rows = measurements.map((item) => [
      new Date(item.date.toDate()).toLocaleDateString(),
      item.weight,
      item.chest,
      item.waist,
    ]);

    autoTable(pdf, {
      startY: 20,
      head: [["Data", "Waga (kg)", "Obwód klatki piersiowej (cm)", "Obwód pasa (cm)"]],
      body: rows,
    });

    pdf.save("raport.pdf");
  };

  const chartData = measurements.map((item) => ({
    date: new Date(item.date.toDate()).toLocaleDateString(),
    Klatka: item.chest,
    Pas: item.waist,
  }));

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
        <button className="pdf-button" onClick={handleGeneratePDF}>Generuj PDFa</button>
      </aside>

      <main className="content">
        <div ref={chartRef} style={{ width: "100%", maxWidth: "800px", marginTop: "20px", background: "white" }}>
          <h3>Obwód klatki piersiowej</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Klatka" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          <h3 style={{ marginTop: "40px" }}>Obwód w pasie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Pas" stroke="#f08080" />
            </LineChart>
          </ResponsiveContainer>
        </div>

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
            {measurements.map((item) => (
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