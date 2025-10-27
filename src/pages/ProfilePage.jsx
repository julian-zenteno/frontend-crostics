import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [statsRes, achievementsRes] = await Promise.all([
                    api.get('/users/stats'),
                    api.get('/achievements/my-achievements'),
                ]);
                setStats(statsRes.data);
                setAchievements(achievementsRes.data);
            } catch (err) {
                setError('No se pudieron cargar los datos del perfil.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    if (loading)
        return (
            <div className='text-center p-10 font-bold text-lg'>
                Cargando perfil...
            </div>
        );
    if (error)
        return (
            <div className='text-center p-10 text-red-500 font-bold'>
                {error}
            </div>
        );

    return (
        <div className='space-y-8'>
            {/* Tarjeta de Perfil */}
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-6'>
                <img
                    src={user?.avatar_url}
                    alt={user?.name}
                    className='w-24 h-24 rounded-full border-4 border-blue-500'
                />
                <div>
                    <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
                        {user?.name}
                    </h1>
                    <p className='text-gray-500 dark:text-gray-400'>
                        {user?.email}
                    </p>
                    <span className='mt-2 inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full capitalize'>
                        {user?.current_level}
                    </span>
                </div>
            </div>

            {/* Tarjeta de Estadísticas */}
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4'>
                    Estadísticas 📊
                </h2>
                {stats && (
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                        <div>
                            <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                                {stats.puzzles_completed}
                            </p>
                            <p className='text-gray-500 dark:text-gray-400'>
                                Puzzles Completados
                            </p>
                        </div>
                        <div>
                            <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                                {stats.experience_points}
                            </p>
                            <p className='text-gray-500 dark:text-gray-400'>
                                Puntos de Exp.
                            </p>
                        </div>
                        <div>
                            <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                                {stats.puzzles_played}
                            </p>
                            <p className='text-gray-500 dark:text-gray-400'>
                                Puzzles Jugados
                            </p>
                        </div>
                        <div>
                            <p className='text-3xl font-bold text-blue-600 dark:text-blue-400'>
                                {stats.average_time_per_puzzle}s
                            </p>
                            <p className='text-gray-500 dark:text-gray-400'>
                                Tiempo Promedio
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Tarjeta de Logros */}
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4'>
                    Logros Desbloqueados 🏆
                </h2>
                {achievements.length > 0 ? (
                    <div className='space-y-4'>
                        {achievements.map(ach => (
                            <div
                                key={ach.achievement_id}
                                className='bg-yellow-50 dark:bg-gray-700 border-l-4 border-yellow-400 p-4 rounded-r-lg'
                            >
                                <h3 className='font-bold text-yellow-800 dark:text-yellow-300'>
                                    {ach.name}
                                </h3>
                                <p className='text-sm text-yellow-700 dark:text-yellow-400'>
                                    {ach.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-gray-500 dark:text-gray-400'>
                        Aún no has desbloqueado ningún logro. ¡Sigue jugando!
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
