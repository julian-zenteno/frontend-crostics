import { useState, useEffect } from 'react';
import { socket } from '../config/socket';

export const useOnlineUsers = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        // Escucha el evento del servidor que envía la lista actualizada
        socket.on('updateOnlineUsers', users => {
            setOnlineUsers(users);
        });

        // Función de limpieza para dejar de escuchar cuando el componente se desmonte
        return () => {
            socket.off('updateOnlineUsers');
        };
    }, []);

    return onlineUsers;
};
