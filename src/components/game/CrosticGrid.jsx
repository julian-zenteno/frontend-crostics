import React from 'react';

const CrosticGrid = ({ quote, mappings, userAnswers }) => {
    const sanitizedQuote = quote.replace(/[^A-Z\s]/gi, ''); // Mantiene los espacios
    const gridToClueMap = React.useMemo(
        () =>
            mappings.reduce((acc, mapping) => {
                const clueNumber = String.fromCharCode(
                    65 + mapping.clue_order - 1
                );
                acc[mapping.grid_position] = `${clueNumber}${
                    mapping.letter_position + 1
                }`;
                return acc;
            }, {}),
        [mappings]
    );

    let gridIndexCounter = -1;

    return (
        <div className='bg-blue-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner'>
            <div className='flex flex-wrap gap-1'>
                {sanitizedQuote.split('').map((char, index) => {
                    if (char === ' ') {
                        return (
                            <div
                                key={index}
                                className='w-8 h-8 md:w-10 md:h-10'
                            ></div>
                        );
                    }
                    gridIndexCounter++;
                    const gridIndex = gridIndexCounter;

                    return (
                        <div
                            key={index}
                            className='relative w-8 h-8 md:w-10 md:h-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-sm'
                        >
                            <span className='absolute top-0 left-1 text-xs text-gray-400 dark:text-gray-500 font-mono'>
                                {gridToClueMap[gridIndex]}
                            </span>
                            <div className='w-full h-full flex items-center justify-center text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100'>
                                {userAnswers[gridIndex] || ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CrosticGrid;
