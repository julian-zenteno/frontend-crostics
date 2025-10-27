import React from 'react';

const RankingRow = ({ rank, user, isCurrentUser }) => {
    // Asigna una medalla según la posición
    const getMedal = rank => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    return (
        // Aplicamos las clases 'dark:' para el fondo de la fila.
        // Si es el usuario actual, el fondo será azul claro (light) o gris oscuro (dark).
        // Si no, será blanco (light) o un gris más oscuro (dark).
        <tr
            className={
                isCurrentUser
                    ? 'bg-blue-100 dark:bg-gray-700'
                    : 'bg-white dark:bg-gray-800'
            }
        >
            {/* Rango */}
            <td className='px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-700 dark:text-gray-300 text-center'>
                {getMedal(rank)}
            </td>

            {/* Jugador */}
            <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                        <img
                            className='h-10 w-10 rounded-full'
                            src={user.user.avatar_url}
                            alt={user.user.name}
                        />
                    </div>
                    <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                            {user.user.name}
                        </div>
                    </div>
                </div>
            </td>

            {/* Puzzles Completados */}
            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center'>
                {user.total_completed}
            </td>

            {/* Puntos */}
            <td className='px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 dark:text-blue-400 text-center'>
                {user.level_points}
            </td>
        </tr>
    );
};

export default RankingRow;
