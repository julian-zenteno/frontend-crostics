import React, { createRef, useRef } from 'react';

const BattleGrid = ({ quote, mappings, userAnswers, onGridChange }) => {
    if (!quote || !mappings) {
        return (
            <div className='text-center p-4 text-gray-500 dark:text-gray-400'>
                Cargando tablero...
            </div>
        );
    }

    const sanitizedQuote = quote.replace(/[^A-Z\s]/gi, '');
    const letterCount = sanitizedQuote.replace(/\s/g, '').length;

    const inputRefs = useRef(null);
    if (!inputRefs.current) {
        inputRefs.current = Array.from({ length: letterCount }, () =>
            createRef()
        );
    }

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

    // ✅ CORREGIDO: Busca con ambos formatos (guion bajo Y guion medio)
    const getGridValue = gridIndex => {
        const mapping = gridToClueMap[gridIndex];
        if (!mapping) return '';

        // Intentar primero con guion medio (como vienen del backend)
        const keyWithDash = `${mapping.clue_id}-${mapping.letter_position}`;
        const keyWithUnderscore = `${mapping.clue_id}_${mapping.letter_position}`;

        return userAnswers[keyWithDash] || userAnswers[keyWithUnderscore] || '';
    };

    const handleInputChange = (e, gridIndex) => {
        const value = e.target.value.toUpperCase();
        const letter = value.slice(-1);

        if (onGridChange) {
            onGridChange(gridIndex, letter);
        }

        if (letter) {
            for (let i = gridIndex + 1; i < letterCount; i++) {
                if (!getGridValue(i) && inputRefs.current[i]?.current) {
                    inputRefs.current[i].current.focus();
                    break;
                }
            }
        }
    };

    const handleKeyDown = (e, gridIndex) => {
        if (e.key === 'Backspace' && !getGridValue(gridIndex)) {
            const prevIndex = gridIndex - 1;
            if (prevIndex >= 0 && inputRefs.current[prevIndex]?.current) {
                inputRefs.current[prevIndex].current.focus();
            }
        }
    };

    let gridIndexCounter = -1;

    return (
        <div className='bg-blue-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-inner'>
            <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center'>
                Tablero Principal
            </h3>
            <div className='flex flex-wrap gap-1 justify-center max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 dark:scrollbar-thumb-gray-900 dark:scrollbar-track-gray-700'>
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

                    return (
                        <div
                            key={`grid-${gridIndex}`}
                            className='relative w-6 h-6 md:w-8 md:h-8 flex-shrink-0'
                        >
                            <span className='absolute top-0 left-0.5 text-[8px] md:text-[10px] text-gray-400 dark:text-gray-500 font-mono pointer-events-none z-10'>
                                {mappingInfo?.label || '?'}
                            </span>
                            <input
                                ref={inputRefs.current[gridIndex]}
                                type='text'
                                readOnly={true}
                                disabled={true}
                                maxLength='1'
                                value={getGridValue(gridIndex)}
                                // onChange={e => handleInputChange(e, gridIndex)}
                                // onKeyDown={e => handleKeyDown(e, gridIndex)}
                                className='w-full h-full text-center border-2 border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 rounded-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 text-sm md:text-lg font-bold uppercase dark:text-gray-100 transition-colors'
                                autoComplete='off'
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BattleGrid;
