import React from 'react';

const OpponentBattleGrid = ({ quote, mappings, userAnswers, isComplete }) => {
    if (!isComplete) {
        return null;
    }

    if (!quote || !mappings) {
        return (
            <div className='text-center p-4 text-gray-500 dark:text-gray-400'>
                Cargando tablero...
            </div>
        );
    }

    const sanitizedQuote = quote.replace(/[^A-Z\s]/gi, '');

    const gridToClueMap = React.useMemo(
        () =>
            mappings.reduce((acc, mapping) => {
                const clueNumber = String.fromCharCode(
                    65 + mapping.clue_order - 1
                );
                acc[mapping.grid_position] = {
                    label: `${clueNumber}${mapping.letter_position + 1}`,
                    clue_id: mapping.clue_id,
                    letter_position: mapping.letter_position,
                };
                return acc;
            }, {}),
        [mappings]
    );

    const getGridValue = gridIndex => {
        const mapping = gridToClueMap[gridIndex];
        if (!mapping) return '';

        const keyWithDash = `${mapping.clue_id}-${mapping.letter_position}`;
        const keyWithUnderscore = `${mapping.clue_id}_${mapping.letter_position}`;

        return userAnswers[keyWithDash] || userAnswers[keyWithUnderscore] || '';
    };

    let gridIndexCounter = -1;

    return (
        <div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg shadow-inner border-2 border-red-300 dark:border-red-700'>
            <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center'>
                {isComplete
                    ? '✅ Tablero del Oponente (Completado)'
                    : '🔒 Tablero Bloqueado'}
            </h3>
            <div className='flex flex-wrap gap-1 justify-center max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-200 dark:scrollbar-thumb-red-700 dark:scrollbar-track-gray-700'>
                {sanitizedQuote.split('').map((char, index) => {
                    if (char === ' ') {
                        return (
                            <div
                                key={`space-${index}`}
                                className='w-6 h-6 md:w-8 md:h-8'
                            />
                        );
                    }

                    gridIndexCounter++;
                    const gridIndex = gridIndexCounter;
                    const mappingInfo = gridToClueMap[gridIndex];
                    const value = isComplete ? getGridValue(gridIndex) : '';

                    return (
                        <div
                            key={`grid-${gridIndex}`}
                            className='relative w-6 h-6 md:w-8 md:h-8 flex-shrink-0'
                        >
                            <span className='absolute top-0 left-0.5 text-[8px] md:text-[10px] text-gray-400 dark:text-gray-500 font-mono pointer-events-none z-10'>
                                {mappingInfo?.label || '?'}
                            </span>
                            <div
                                className={`w-full h-full text-center border-2 rounded-sm text-sm md:text-lg font-bold uppercase flex items-center justify-center transition-all ${
                                    isComplete
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : 'border-gray-400 bg-gray-200 dark:bg-gray-700 text-gray-500'
                                }`}
                            >
                                {isComplete ? value : '🔒'}
                            </div>
                        </div>
                    );
                })}
            </div>
            {!isComplete && (
                <p className='text-center text-xs mt-2 text-gray-500 dark:text-gray-400'>
                    El oponente debe completar todas las pistas para ver su
                    tablero
                </p>
            )}
        </div>
    );
};

export default OpponentBattleGrid;
