import React from 'react';

const CluesArea = ({
    clues,
    mappings,
    userAnswers,
    clueStatuses,
    onAnswerChange,
}) => {
    // Si las props esenciales no han llegado, no renderices nada.
    if (!clues || !mappings) {
        return <div className='dark:text-gray-300'>Cargando pistas...</div>;
    }

    const isInteractive = typeof onAnswerChange === 'function';

    const handleInputChange = (e, clueId, letterIndex) => {
        if (!isInteractive) return;
        const value = e.target.value.toUpperCase();
        onAnswerChange(clueId, letterIndex, value.slice(-1));
        if (value && e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
        }
    };

    const handleKeyDown = (e, clueId, letterIndex) => {
        if (!isInteractive) return;
        if (
            e.key === 'Backspace' &&
            !e.target.value &&
            e.target.previousElementSibling
        ) {
            onAnswerChange(clueId, letterIndex - 1, '');
            e.target.previousElementSibling.focus();
        }
    };

    const answerToGridMap = React.useMemo(
        () =>
            mappings.reduce((acc, map) => {
                if (!acc[map.clue_id]) acc[map.clue_id] = {};
                acc[map.clue_id][map.letter_position] = map.grid_position;
                return acc;
            }, {}),
        [mappings]
    );

    const statusColors = {
        correct:
            'bg-green-50 dark:bg-green-900/50 border-green-300 dark:border-green-700',
        incorrect:
            'bg-red-50 dark:bg-red-900/50 border-red-300 dark:border-red-700',
        incomplete:
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600',
    };

    return (
        <div className='mt-8 lg:mt-0'>
            <h2 className='text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100'>
                Pistas
            </h2>
            <div className='space-y-4'>
                {clues
                    .sort((a, b) => a.clue_order - b.clue_order)
                    .map(clue => {
                        const clueLetter = String.fromCharCode(
                            65 + clue.clue_order - 1
                        );
                        const status =
                            clueStatuses?.[clue.clue_id] || 'incomplete';
                        return (
                            <div
                                key={clue.clue_id}
                                className={`p-4 rounded-lg shadow-sm border-2 transition-colors duration-300 ${statusColors[status]}`}
                            >
                                <p className='text-gray-700 dark:text-gray-300 mb-2'>
                                    <span className='font-bold'>
                                        {clueLetter}.
                                    </span>{' '}
                                    {clue.clue_text}
                                </p>
                                <div className='flex flex-wrap gap-1'>
                                    {clue.answer.split('').map((_, index) => {
                                        const gridPosition =
                                            answerToGridMap[clue.clue_id]?.[
                                                index
                                            ];
                                        const value =
                                            userAnswers[gridPosition] || '';
                                        return (
                                            <input
                                                key={index}
                                                type='text'
                                                maxLength='1'
                                                readOnly={!isInteractive}
                                                value={value}
                                                onChange={e =>
                                                    handleInputChange(
                                                        e,
                                                        clue.clue_id,
                                                        index
                                                    )
                                                }
                                                onKeyDown={e =>
                                                    handleKeyDown(
                                                        e,
                                                        clue.clue_id,
                                                        index
                                                    )
                                                }
                                                className={`w-8 h-8 md:w-10 md:h-10 text-center border-2 rounded-md text-xl font-bold uppercase ${
                                                    isInteractive
                                                        ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:border-blue-500'
                                                        : 'border-gray-200 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100 cursor-default'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default CluesArea;
