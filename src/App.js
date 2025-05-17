import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';

import Home from './components/pages/home';
import Charts from './components/pages/charts';
import Login from './components/pages/login';
import Profile from './components/pages/profile';

import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(null); // null = jeszcze nie wiemy, true/false po sprawdzeniu

  // 🔒 Sprawdzamy czy użytkownik jest zalogowany
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuth(!!user); // true jeśli user istnieje
    });

    return () => unsubscribe(); // sprzątanie
  }, []);

  // 🕒 Dopóki nie wiemy, czy zalogowany – nic nie renderujemy (możesz tu dać spinner)
  if (isAuth === null) {
    return <div>Ładowanie...</div>;
  }

  return (
    <Router>
      <div className="App">
        {isAuth ? (
          <Routes>
            <Route path="/" element={<Home setIsAuth={setIsAuth} />} />
            <Route path="/Charts" element={<Charts setIsAuth={setIsAuth} />} />
            <Route path="/Profile" element={<Profile setIsAuth={setIsAuth} />} />
            <Route path="/login" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
