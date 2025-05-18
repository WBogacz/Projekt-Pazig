import {useState} from 'react';
import { auth } from '../config/firebase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import { useNavigate } from 'react-router-dom';


export const Auth=({setIsAuth}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signUp = async() =>{
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            alert('Utworzono konto');
        }catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                alert("Ten adres e-mail jest już zarejestrowany.");
            } else if (err.code === 'auth/invalid-email') {
                alert("Nieprawidłowy format adresu e-mail.");
            } else if (err.code === 'auth/weak-password') {
                alert("Hasło jest zbyt słabe (minimum 6 znaków).");
            } else {
                console.error(err);
                alert("Wystąpił błąd: " + err.message);
            }
        }
    };

    const signIn = async () => {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          alert('Zalogowano');
          setIsAuth(true);
          navigate('/');  
        } catch (err) {
          if (err.code === 'auth/user-not-found') {
            alert('Nie znaleziono użytkownika o tym adresie e-mail.');
          } else if (err.code === 'auth/invalid-credential') {
            alert('Nieprawidłowe hasło.');
          } else {
            console.error(err);
            alert('Wystąpił błąd: ' + err.message);
          }
        }
      };

    console.log(auth?.currentUser?.email);

   return (
     <div className="auth-container">
      <input
        placeholder="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Hasło"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="auth-buttons">
        <button onClick={signUp}>Załóż konto</button>
        <button onClick={signIn}>Zaloguj</button>
      </div>
    </div>

    );

};