import {useState} from 'react';
import { auth } from '../config/firebase';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'

export const Auth=() => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const logout = async() =>{
        try{
            await signOut(auth);
            alert("Wylogowano.");
            setEmail('');
            setPassword('');
        }catch(err){
            console.error(err)
        }
    };

    console.log(auth?.currentUser?.email);

   return (
    <div>
        <input placeholder="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
         />

        <input placeholder="Password" 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={signUp}>Sign up</button>
        <button onClick={signIn}>Log in</button>
        <button onClick={logout}>Logout</button>
        
    </div>
    );

};

