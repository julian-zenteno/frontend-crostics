import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import RankingRow from '../components/RankingRow';

const RankingsPage = () => {
    const { user } = useAuth();
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                // CORRECCIÓN: Se quita '/api' de la URL de la petición.
                const response = await api.get('/rankings/global');
                setRankings(response.data.data);
            } catch (err) {
                setError('No se pudo cargar la tabla de clasificación.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading)
        return (
            // Se añaden estilos de modo oscuro al mensaje de carga.
            <div className='text-center p-10 font-bold text-lg text-gray-700 dark:text-gray-300'>
                Cargando ranking... 🏆
            </div>
        );
    if (error)
        return (
            <div className='text-center p-10 text-red-500 font-bold'>
                {error}
            </div>
        );

    return (
        // Se añaden estilos de modo oscuro a la tarjeta principal.
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
            <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6'>
                Tabla de Clasificación 🏆
            </h1>
            <div className='overflow-x-auto'>
                {/* Se añaden estilos de modo oscuro a la tabla y sus divisores. */}
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                    <thead className='bg-gray-50 dark:bg-gray-700'>
                        <tr>
                            <th
                                scope='col'
                                className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                            >
                                Rango
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                            >
                                Jugador
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                            >
                                Completados
                            </th>
                            <th
                                scope='col'
                                className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                            >
                                Puntos
                            </th>
                        </tr>
                    </thead>
                    {/* El componente RankingRow ya tiene sus propios estilos de modo oscuro. */}
                    <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                        {rankings.map((entry, index) => (
                            <RankingRow
                                key={entry.user.user_id}
                                rank={index + 1}
                                user={entry}
                                isCurrentUser={
                                    user?.user_id === entry.user.user_id
                                }
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RankingsPage;
