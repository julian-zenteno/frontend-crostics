import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CrosticGrid from '../components/game/CrosticGrid';
import CluesArea from '../components/game/CluesArea';

const GamePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [crosticData, setCrosticData] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [clueStatuses, setClueStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeSpent, setTimeSpent] = useState(0);
    const [isGameWon, setIsGameWon] = useState(false);
    const [saveStatus, setSaveStatus] = useState('Guardado');

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                setLoading(true);
                const [crosticRes, progressRes] = await Promise.all([
                    api.get(`/crostics/${id}`),
                    api.get(`/game/${id}/progress`),
                ]);
                setCrosticData(crosticRes.data);
                setUserAnswers(progressRes.data.progress.current_state || {});
                setTimeSpent(progressRes.data.progress.time_spent || 0);
                if (progressRes.data.progress.completed) setIsGameWon(true);
            } catch (err) {
                setError('No se pudo cargar el juego.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGameData();
    }, [id]);

    useEffect(() => {
        if (!loading && !isGameWon) {
            const timer = setInterval(
                () => setTimeSpent(prev => prev + 1),
                1000
            );
            return () => clearInterval(timer);
        }
    }, [loading, isGameWon]);

    useEffect(() => {
        if (loading || isGameWon) return;
        if (Object.keys(userAnswers).length === 0 && timeSpent < 2) {
            setSaveStatus('Guardado');
            return;
        }
        setSaveStatus('Guardando...');
        const debounceTimer = setTimeout(() => {
            api.post(`/game/${id}/progress`, {
                currentState: userAnswers,
                timeSpent,
            })
                .then(() => setSaveStatus('Guardado ✓'))
                .catch(() => setSaveStatus('Error al guardar ✗'));
        }, 2000);
        return () => clearTimeout(debounceTimer);
    }, [userAnswers, timeSpent, id, isGameWon, loading]);

    useEffect(() => {
        if (!crosticData) return;
        const newStatuses = {};
        for (const clue of crosticData.clues) {
            let currentAnswer = '';
            let isComplete = true;
            for (let i = 0; i < clue.answer.length; i++) {
                const mapping = crosticData.mappings.find(
                    m => m.clue_id === clue.clue_id && m.letter_position === i
                );
                if (mapping) {
                    const letter = userAnswers[mapping.grid_position];
                    if (letter) {
                        currentAnswer += letter;
                    } else {
                        isComplete = false;
                    }
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
    }, [userAnswers, crosticData]);

    const handleAnswerChange = useCallback(
        (clueId, letterPosition, letter) => {
            if (!crosticData) return;
            const mappingToUpdate = crosticData.mappings.find(
                m =>
                    m.clue_id === clueId && m.letter_position === letterPosition
            );
            if (mappingToUpdate) {
                setUserAnswers(prev => ({
                    ...prev,
                    [mappingToUpdate.grid_position]: letter.toUpperCase(),
                }));
            }
        },
        [crosticData]
    );

    const handleHint = async () => {
        const firstIncompleteClue = crosticData.clues
            .sort((a, b) => a.clue_order - b.clue_order)
            .find(clue => clueStatuses[clue.clue_id] !== 'correct');
        if (!firstIncompleteClue) {
            alert('¡Ya has completado todas las pistas!');
            return;
        }
        try {
            const res = await api.post(`/game/${id}/hint`, {
                clueId: firstIncompleteClue.clue_id,
            });
            handleAnswerChange(
                res.data.clueId,
                res.data.position,
                res.data.letter
            );
        } catch (error) {
            alert(error.response?.data?.message || 'Error al pedir la pista.');
        }
    };

    const handleComplete = async () => {
        try {
            const response = await api.post(`/game/${id}/complete`, {
                timeSpent,
            });
            setIsGameWon(true);
            alert(response.data.message);
        } catch (error) {
            alert(
                error.response?.data?.message || 'Error al completar el puzzle.'
            );
        }
    };

    const isPuzzleSolved =
        crosticData &&
        Object.values(clueStatuses).length > 0 &&
        Object.values(clueStatuses).every(status => status === 'correct');

    if (loading)
        return (
            <div className='text-center p-10 font-bold text-lg dark:text-gray-300'>
                Cargando juego... ⚙️
            </div>
        );
    if (error)
        return (
            <div className='text-center p-10 text-red-500 font-bold'>
                {error}
            </div>
        );
    if (!crosticData) return null;

    if (isGameWon) {
        return (
            <div className='text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl'>
                <h1 className='text-4xl font-bold text-green-500'>
                    ¡Felicidades! 🎉
                </h1>
                <p className='mt-4 text-lg dark:text-gray-200'>
                    Has completado el puzzle con éxito.
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className='mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition'
                >
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className='flex flex-wrap justify-between items-center mb-6 gap-4'>
                <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
                    {crosticData.title}
                </h1>
                <div className='flex items-center space-x-3'>
                    <span className='text-sm text-gray-500 dark:text-gray-400 min-w-[100px] text-right'>
                        {saveStatus}
                    </span>
                    <button
                        onClick={handleHint}
                        className='bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition'
                    >
                        💡 Pista
                    </button>
                    <button
                        onClick={handleComplete}
                        disabled={!isPuzzleSolved}
                        className='bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-600'
                    >
                        ✅ Completar
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 lg:gap-8'>
                <div>
                    <CrosticGrid
                        quote={crosticData.quote}
                        mappings={crosticData.mappings.map(m => ({
                            ...m,
                            clue_order: crosticData.clues.find(
                                c => c.clue_id === m.clue_id
                            ).clue_order,
                        }))}
                        userAnswers={userAnswers}
                    />
                </div>
                <div>
                    <CluesArea
                        clues={crosticData.clues}
                        mappings={crosticData.mappings}
                        userAnswers={userAnswers}
                        clueStatuses={clueStatuses}
                        onAnswerChange={handleAnswerChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default GamePage;
