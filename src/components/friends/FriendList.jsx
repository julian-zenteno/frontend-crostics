import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const onlineUsers = useOnlineUsers();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await api.get('/friends');
                setFriends(response.data);
            } catch (error) {
                console.error('Error al cargar la lista de amigos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);

    // --- NUEVA FUNCIÓN ---
    // Maneja la eliminación de un amigo
    const handleRemoveFriend = async friendshipId => {
        if (
            window.confirm(
                '¿Estás seguro de que quieres eliminar a este amigo?'
            )
        ) {
            try {
                await api.delete(`/friends/${friendshipId}`);
                // Actualiza la UI para remover al amigo de la lista
                setFriends(prev =>
                    prev.filter(item => item.friendship_id !== friendshipId)
                );
            } catch (error) {
                alert('No se pudo eliminar al amigo.');
            }
        }
    };

    if (loading)
        return <p className='dark:text-gray-300'>Cargando amigos...</p>;

    return (
        <div>
            {friends.length > 0 ? (
                <div className='space-y-4'>
                    {friends.map(({ friendship_id, friend }) => {
                        const isOnline = onlineUsers.some(
                            onlineUser => onlineUser.user_id === friend.user_id
                        );
                        return (
                            <div
                                key={friendship_id}
                                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                            >
                                <div className='flex items-center space-x-4'>
                                    <div className='relative'>
                                        <img
                                            src={friend.avatar_url}
                                            alt={friend.name}
                                            className='w-12 h-12 rounded-full'
                                        />
                                        {isOnline && (
                                            <span className='absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-700'></span>
                                        )}
                                    </div>
                                    <span className='font-medium text-gray-800 dark:text-gray-200'>
                                        {friend.name}
                                    </span>
                                </div>
                                <div className='flex space-x-2'>
                                    <button className='bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full hover:bg-blue-600 transition'>
                                        Invitar
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRemoveFriend(friendship_id)
                                        }
                                        className='bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full hover:bg-red-600 transition'
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className='text-center text-gray-500 dark:text-gray-400'>
                    Aún no tienes amigos. ¡Busca a alguien y envíale una
                    solicitud!
                </p>
            )}
        </div>
    );
};

export default FriendList;
