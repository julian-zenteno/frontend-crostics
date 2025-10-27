import React from 'react';

const CrosticCard = ({ crostic, isAdmin }) => {
    // Colores para las etiquetas de dificultad, con soporte para modo oscuro.
    const difficultyColors = {
        basico: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        intermedio:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        avanzado: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    // Estilo visual si el puzzle está inactivo (visible para admins).
    const inactiveClasses = !crostic.is_active ? 'opacity-50' : '';

    return (
        // El contenedor principal solo muestra la información, no es un enlace.
        <div className={`p-6 flex-grow ${inactiveClasses}`}>
            {/* Etiqueta "INACTIVO" visible solo para administradores si el puzzle está desactivado. */}
            {isAdmin && !crostic.is_active && (
                <span className='absolute top-2 left-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded'>
                    INACTIVO
                </span>
            )}

            <div className='flex justify-between items-start'>
                <h3 className='text-xl font-bold text-gray-800 dark:text-white pr-4'>
                    {crostic.title}
                </h3>
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                        difficultyColors[crostic.difficulty] ||
                        'bg-gray-100 text-gray-800'
                    }`}
                >
                    {crostic.difficulty}
                </span>
            </div>
            <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Autor: {crostic.author || 'Anónimo'}
            </p>
        </div>
    );
};

export default CrosticCard;
