import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../services/api';
import { socket } from '../config/socket'; // 1. Importamos la conexión de socket

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Efecto para mantener la sesión y conectar/desconectar el socket
    useEffect(() => {
        const checkUserSession = async () => {
            const storedToken = localStorage.getItem('api_token');
            if (storedToken) {
                api.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${storedToken}`;
                try {
                    const response = await api.get('/auth/me');
                    const currentUser = response.data;
                    setUser(currentUser);
                    setToken(storedToken);

                    // 2. Conectamos al socket y anunciamos que el usuario está en línea
                    socket.connect();
                    socket.emit('userConnected', currentUser);
                } catch (error) {
                    // Si el token es inválido, limpiamos todo
                    localStorage.removeItem('api_token');
                    api.defaults.headers.common['Authorization'] = null;
                }
            }
            setLoading(false);
        };

        checkUserSession();

        // 3. Función de limpieza que se ejecuta al cerrar la app
        return () => {
            socket.disconnect();
        };
    }, []);

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            const response = await api.post('/auth/firebase-login', {
                idToken,
            });

            const { token: apiToken, user: userData } = response.data;

            localStorage.setItem('api_token', apiToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
            setToken(apiToken);
            setUser(userData);

            // 4. Al iniciar sesión, conectamos y anunciamos al usuario
            socket.connect();
            socket.emit('userConnected', userData);

            navigate('/dashboard');
        } catch (error) {
            console.error('Error durante el inicio de sesión:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('api_token');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);

        // 5. Al cerrar sesión, nos desconectamos del socket
        socket.disconnect();

        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
