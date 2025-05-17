import '../styles/login.css';
import avatar from '../pages/profil.png';
import { Auth } from '../auth.js';


function Login({ setIsAuth }) {
  return (
    <div className="login-container">
      <img src={avatar} alt="Avatar" className="login-avatar" />
      <Auth setIsAuth={setIsAuth} />
    </div>
  );
}

export default Login;
