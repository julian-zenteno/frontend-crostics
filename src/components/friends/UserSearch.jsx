import { useState } from 'react';
import api from '../../services/api';

const UserSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchStatus, setSearchStatus] = useState(''); // Mensajes como "No se encontraron resultados"

    const handleSearch = async e => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;

        setLoading(true);
        setSearchStatus('');
        try {
            const response = await api.get(`/users/search?term=${searchTerm}`);
            setResults(response.data);
            if (response.data.length === 0) {
                setSearchStatus('No se encontraron jugadores con ese nombre.');
            }
        } catch (error) {
            setSearchStatus('Error al realizar la búsqueda.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvite = async recipientId => {
        try {
            await api.post('/friends/invite', { recipientId });
            // Actualiza la UI para mostrar que la invitación fue enviada
            setResults(prevResults =>
                prevResults.map(user =>
                    user.user_id === recipientId
                        ? { ...user, inviteSent: true }
                        : user
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    'No se pudo enviar la invitación.'
            );
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className='flex gap-2 mb-6'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder='Buscar por nombre...'
                    className='p-2 border rounded-md flex-grow dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                />
                <button
                    type='submit'
                    disabled={loading}
                    className='bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400'
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            <div className='space-y-4'>
                {results.length > 0 &&
                    results.map(user => (
                        <div
                            key={user.user_id}
                            className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
                        >
                            <div className='flex items-center space-x-3'>
                                <img
                                    src={user.avatar_url}
                                    alt={user.name}
                                    className='w-10 h-10 rounded-full'
                                />
                                <span className='font-medium text-gray-800 dark:text-gray-200'>
                                    {user.name}
                                </span>
                            </div>
                            <button
                                onClick={() => handleSendInvite(user.user_id)}
                                disabled={user.inviteSent}
                                className='bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                {user.inviteSent ? 'Enviada ✓' : 'Añadir Amigo'}
                            </button>
                        </div>
                    ))}
                {searchStatus && (
                    <p className='text-center text-gray-500 dark:text-gray-400'>
                        {searchStatus}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UserSearch;
