import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../config/socket';

const InvitationToast = () => {
    const navigate = useNavigate();
    const [invitation, setInvitation] = useState(null); // Almacena la invitación recibida

    useEffect(() => {
        // Escucha el evento 'receiveInvitation' del servidor
        socket.on('receiveInvitation', data => {
            setInvitation(data);
        });

        // Escucha el evento 'startBattle' que ordena ir a la página de batalla
        socket.on('startBattle', ({ puzzleId }) => {
            navigate(`/battle/${puzzleId}`);
        });

        // Limpieza de los listeners
        return () => {
            socket.off('receiveInvitation');
            socket.off('startBattle');
        };
    }, [navigate]);

    if (!invitation) return null;

    const handleAccept = () => {
        // Envía la aceptación al servidor
        socket.emit('acceptInvitation', {
            inviterId: invitation.inviter.user_id,
            puzzleId: invitation.puzzleId,
        });
        setInvitation(null); // Oculta la notificación
    };

    const handleReject = () => {
        // Simplemente oculta la notificación
        setInvitation(null);
        // En una versión más avanzada, podrías notificar al otro jugador del rechazo
    };

    return (
        <div className='fixed bottom-5 right-5 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 w-80 z-50'>
            <p className='font-bold text-gray-800 dark:text-gray-100'>
                ¡Invitación a Batalla! ⚔️
            </p>
            <p className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
                <span className='font-semibold'>{invitation.inviter.name}</span>{' '}
                te ha invitado a jugar en{' '}
                <span className='font-semibold'>{invitation.puzzleTitle}</span>.
            </p>
            <div className='flex justify-end space-x-2 mt-4'>
                <button
                    onClick={handleReject}
                    className='px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300'
                >
                    Rechazar
                </button>
                <button
                    onClick={handleAccept}
                    className='px-3 py-1 text-sm rounded-md bg-green-500 text-white hover:bg-green-600'
                >
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default InvitationToast;
