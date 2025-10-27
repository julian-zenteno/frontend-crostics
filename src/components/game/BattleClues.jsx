import React, { useState, useEffect, useMemo } from 'react';

const BattleClues = ({
    isInteractive,
    clues,
    mappings,
    userAnswers,
    onAnswerChange,
}) => {
    const [clueStatuses, setClueStatuses] = useState({});

    // Efecto para validar las respuestas y asignar colores
    useEffect(() => {
        if (!clues || !mappings || !userAnswers) return;
        const newStatuses = {};
        for (const clue of clues) {
            let currentAnswer = '';
            let isComplete = true;
            for (let i = 0; i < clue.answer.length; i++) {
                const answerKey = `${clue.clue_id}-${i}`;
                const letter = userAnswers[answerKey];
                if (letter) {
                    currentAnswer += letter;
                } else {
                    isComplete = false;
                }
            }
            if (!isComplete) newStatuses[clue.clue_id] = 'incomplete';
            else if (currentAnswer === clue.answer.toUpperCase())
                newStatuses[clue.clue_id] = 'correct';
            else newStatuses[clue.clue_id] = 'incorrect';
        }
        setClueStatuses(newStatuses);
    }, [userAnswers, clues, mappings]);

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

    const statusColors = {
        correct:
            'bg-green-50 dark:bg-green-900/50 border-green-300 dark:border-green-700',
        incorrect:
            'bg-red-50 dark:bg-red-900/50 border-red-300 dark:border-red-700',
        incomplete:
            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600',
    };

    return (
        <div className='space-y-4'>
            {clues
                .sort((a, b) => a.clue_order - b.clue_order)
                .map(clue => {
                    const clueLetter = String.fromCharCode(
                        65 + clue.clue_order - 1
                    );
                    const status = clueStatuses[clue.clue_id] || 'incomplete';
                    return (
                        <div
                            key={clue.clue_id}
                            className={`p-4 rounded-lg shadow-sm border-2 transition-colors duration-300 ${statusColors[status]}`}
                        >
                            <p className='text-gray-700 dark:text-gray-300 mb-2'>
                                <span className='font-bold'>{clueLetter}.</span>{' '}
                                {clue.clue_text}
                            </p>
                            <div className='flex flex-wrap gap-1'>
                                {clue.answer.split('').map((_, index) => {
                                    const answerKey = `${clue.clue_id}-${index}`;
                                    const value = userAnswers[answerKey] || '';
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
    );
};

export default BattleClues;
