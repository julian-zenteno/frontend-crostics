import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Pega aquí la configuración de tu App Web de Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyDLsbMOpXVz6_wyA5Q7GRX2Y-kczCeGYmw',
    authDomain: 'crostic-ling.firebaseapp.com',
    projectId: 'crostic-ling',
    storageBucket: 'crostic-ling.firebasestorage.app',
    messagingSenderId: '505773088777',
    appId: '1:505773088777:web:d04e1010a8efcece80d8d8',
    measurementId: 'G-5PZZ6YXXTG',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
