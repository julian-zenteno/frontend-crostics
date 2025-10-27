import { useOnlineUsers } from '../hooks/useOnlineUsers';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../config/socket';

const OnlineUsersPanel = ({ isOpen, onClose }) => {
    const onlineUsers = useOnlineUsers();
    const { user: currentUser } = useAuth();

    if (!isOpen) return null;

    const otherUsers = onlineUsers.filter(
        user => user.user_id !== currentUser.user_id
    );

    // --- FUNCIÓN CORREGIDA ---
    const handleInvite = recipientId => {
        // 1. Usamos 'prompt' para pedir al usuario el ID del puzzle.
        const puzzleId = window.prompt(
            'Ingresa el ID del puzzle al que quieres invitar:'
        );

        // 2. Validamos la entrada.
        if (!puzzleId || isNaN(puzzleId)) {
            alert('ID de puzzle inválido.');
            return;
        }

        // Por ahora, el título es genérico. En una versión avanzada,
        // buscaríamos el título del puzzle correspondiente.
        const puzzleTitle = `Puzzle #${puzzleId}`;

        socket.emit('sendInvitation', {
            recipientId,
            puzzleId: parseInt(puzzleId), // Aseguramos que sea un número
            puzzleTitle,
        });

        alert(`Invitación enviada para el puzzle: ${puzzleTitle}`);
        onClose();
    };

    return (
        <div
            className='fixed inset-0 bg-black bg-opacity-50 z-40'
            onClick={onClose}
        >
            <div
                className='fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl z-50'
                onClick={e => e.stopPropagation()}
            >
                <div className='p-4 border-b dark:border-gray-700'>
                    <h3 className='text-lg font-bold text-gray-800 dark:text-gray-100'>
                        Jugadores en Línea ({otherUsers.length})
                    </h3>
                </div>

                <div className='overflow-y-auto h-full p-4'>
                    {otherUsers.length > 0 ? (
                        <ul className='space-y-4'>
                            {otherUsers.map(user => (
                                <li
                                    key={user.user_id}
                                    className='flex items-center justify-between'
                                >
                                    <div className='flex items-center space-x-3'>
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className='w-10 h-10 rounded-full'
                                        />
                                        <span className='font-medium text-gray-700 dark:text-gray-300'>
                                            {user.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleInvite(user.user_id)
                                        }
                                        className='bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-blue-600 transition'
                                    >
                                        Invitar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-10'>
                            Nadie más está conectado.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnlineUsersPanel;
