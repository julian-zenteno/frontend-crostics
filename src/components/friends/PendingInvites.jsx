import { useState, useEffect } from 'react';
import api from '../../services/api';

const PendingInvites = () => {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvites = async () => {
            try {
                const response = await api.get('/friends/pending');
                setInvites(response.data);
            } catch (error) {
                console.error('Error al cargar solicitudes pendientes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvites();
    }, []);

    // Maneja tanto la aceptación como el rechazo de una invitación
    const handleResponse = async (friendshipId, action) => {
        try {
            if (action === 'accept') {
                await api.put(`/friends/accept/${friendshipId}`);
            } else if (action === 'reject') {
                // Llama a la ruta DELETE que ahora funciona
                await api.delete(`/friends/${friendshipId}`);
            }
            // Elimina la invitación de la lista en la UI para una respuesta instantánea
            setInvites(prev =>
                prev.filter(invite => invite.friendship_id !== friendshipId)
            );
        } catch (error) {
            alert(
                `Error al ${
                    action === 'accept' ? 'aceptar' : 'rechazar'
                } la invitación.`
            );
        }
    };

    if (loading)
        return <p className='dark:text-gray-300'>Cargando solicitudes...</p>;

    return (
        <div>
            {invites.length > 0 ? (
                <div className='space-y-4'>
                    {invites.map(invite => (
                        <div
                            key={invite.friendship_id}
                            className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                        >
                            <div className='flex items-center space-x-3'>
                                <img
                                    src={invite.actionUser.avatar_url}
                                    alt={invite.actionUser.name}
                                    className='w-10 h-10 rounded-full'
                                />
                                <span className='font-medium text-gray-800 dark:text-gray-200'>
                                    {invite.actionUser.name}
                                </span>
                            </div>
                            <div className='flex space-x-2'>
                                <button
                                    onClick={() =>
                                        handleResponse(
                                            invite.friendship_id,
                                            'accept'
                                        )
                                    }
                                    className='bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full hover:bg-green-600 transition'
                                >
                                    Aceptar
                                </button>
                                <button
                                    onClick={() =>
                                        handleResponse(
                                            invite.friendship_id,
                                            'reject'
                                        )
                                    }
                                    className='bg-gray-500 text-white text-sm font-bold px-3 py-1 rounded-full hover:bg-gray-600 transition'
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-center text-gray-500 dark:text-gray-400'>
                    No tienes solicitudes de amistad pendientes.
                </p>
            )}
        </div>
    );
};

export default PendingInvites;
