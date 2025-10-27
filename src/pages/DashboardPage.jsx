import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import CrosticCard from '../components/CrosticCard';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
    const { user } = useAuth();
    const [crostics, setCrostics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCrostics = async () => {
            try {
                const response = await api.get('/crostics');
                setCrostics(response.data.data);
            } catch (err) {
                setError(
                    'No se pudieron cargar los puzzles. Inténtalo de nuevo más tarde.'
                );
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCrostics();
    }, []);

    const handleDelete = async crosticId => {
        if (
            window.confirm(
                '¿Estás seguro de que quieres DESACTIVAR este crostic?'
            )
        ) {
            try {
                await api.delete(`/crostics/${crosticId}`);
                setCrostics(prev =>
                    prev.map(c =>
                        c.crostic_id === crosticId
                            ? { ...c, is_active: false }
                            : c
                    )
                );
            } catch (err) {
                alert('No se pudo desactivar el crostic.');
            }
        }
    };

    if (loading)
        return (
            <div className='text-center p-10 dark:text-gray-300'>
                Cargando puzzles... ⚙️
            </div>
        );
    if (error)
        return <div className='text-center text-red-500 p-10'>{error}</div>;

    return (
        <div>
            <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6'>
                Elige tu Desafío
            </h1>
            {crostics.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {crostics.map(crostic => (
                        <div
                            key={crostic.crostic_id}
                            className='relative group bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col transition-all duration-300 hover:shadow-xl'
                        >
                            <CrosticCard
                                crostic={crostic}
                                isAdmin={user?.role === 'admin'}
                            />
                            <div className='border-t border-gray-200 dark:border-gray-700 mt-auto p-4 flex justify-around'>
                                <Link
                                    to={`/game/${crostic.crostic_id}`}
                                    className='font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors'
                                >
                                    Jugar Solo
                                </Link>
                                <Link
                                    to={`/battle/${crostic.crostic_id}`}
                                    className='font-bold text-red-600 dark:text-red-400 hover:underline transition-colors'
                                >
                                    Batalla ⚔️
                                </Link>
                            </div>
                            {user?.role === 'admin' && (
                                <div className='absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <Link
                                        to={`/admin/edit/${crostic.crostic_id}`}
                                        className='bg-yellow-400 text-white text-xs font-bold p-2 rounded-full hover:bg-yellow-500 shadow-md'
                                    >
                                        ✏️
                                    </Link>
                                    {crostic.is_active && (
                                        <button
                                            onClick={() =>
                                                handleDelete(crostic.crostic_id)
                                            }
                                            className='bg-red-500 text-white text-xs font-bold p-2 rounded-full hover:bg-red-600 shadow-md'
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className='text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md'>
                    <p className='text-gray-600 dark:text-gray-300'>
                        No hay puzzles disponibles en este momento. ¡Crea uno
                        nuevo!
                    </p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
