import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../config/socket';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import BattleClues from '../components/game/BattleClues';
import BattleGrid from '../components/game/BattleGrid';
import OpponentBattleGrid from '../components/game/OpponentBattleGrid';
import ChatBox from '../components/game/ChatBox';

const BattlePage = () => {
    const { id: puzzleId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [crosticData, setCrosticData] = useState(null);
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState({});
    const [clueStatuses, setClueStatuses] = useState({});
    const [opponentClueStatuses, setOpponentClueStatuses] = useState({});
    const [winner, setWinner] = useState(null);
    const [time, setTime] = useState(0);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gridAnswers, setGridAnswers] = useState({});

    // Efecto para la conexión y los eventos de Socket.IO
    useEffect(() => {
        if (!currentUser) return;
        socket.connect();
        socket.emit('joinBattle', { puzzleId, user: currentUser });
        socket.on('battleUpdate', ({ players, gameState, startTime }) => {
            setPlayers(players);
            setGameState(gameState);
            if (startTime && !window.battleTimer) {
                window.battleTimer = setInterval(
                    () => setTime(Math.floor((Date.now() - startTime) / 1000)),
                    1000
                );
            }
        });
        socket.on('receiveChatMessage', newMessage =>
            setMessages(prev => [...prev, newMessage])
        );

        socket.on('gameWon', winnerUser => {
            setWinner(winnerUser);
            if (window.battleTimer) clearInterval(window.battleTimer);
            socket.disconnect();
        });

        // Función de limpieza al salir de la página
        return () => {
            if (window.battleTimer) clearInterval(window.battleTimer);
            window.battleTimer = null;
            socket.emit('leaveBattle', { puzzleId, user: currentUser });
            socket.off('battleUpdate');
            socket.off('receiveChatMessage');
            socket.off('gameWon');
            socket.disconnect();
        };
    }, [puzzleId, currentUser]);

    // Efecto para cargar los datos del puzzle
    useEffect(() => {
        const fetchCrostic = async () => {
            try {
                const res = await api.get(`/crostics/${puzzleId}`);
                setCrosticData(res.data);
                setLoading(false);
            } catch (error) {
                console.error(
                    'Error al cargar la información del puzzle',
                    error
                );
                setLoading(false);
            }
        };
        fetchCrostic();
    }, [puzzleId]);

    // Calcular progreso basado en pistas completamente correctas

    // Función genérica para validar las pistas y devolver sus estados
    const validateClues = (answers, clues) => {
        if (!answers || !clues) return {};
        const newStatuses = {};

        for (const clue of clues) {
            let currentAnswer = '';
            let isComplete = true;

            for (let i = 0; i < clue.answer.length; i++) {
                // Intentar ambos formatos: con guion medio y guion bajo
                const keyWithDash = `${clue.clue_id}-${i}`;
                const keyWithUnderscore = `${clue.clue_id}_${i}`;
                const letter =
                    answers[keyWithDash] || answers[keyWithUnderscore];

                if (letter) {
                    currentAnswer += letter;
                } else {
                    isComplete = false;
                }
            }

            if (!isComplete) {
                newStatuses[clue.clue_id] = 'incomplete';
            } else if (currentAnswer === clue.answer.toUpperCase()) {
                newStatuses[clue.clue_id] = 'correct';
            } else {
                newStatuses[clue.clue_id] = 'incorrect';
            }
        }

        return newStatuses;
    };

    // Efectos para validar las respuestas de cada jugador por separado
    useEffect(() => {
        if (crosticData && gameState[currentUser.user_id]) {
            setClueStatuses(
                validateClues(gameState[currentUser.user_id], crosticData.clues)
            );
        }
    }, [gameState, crosticData, currentUser.user_id]);

    useEffect(() => {
        const opponent = players.find(p => p.user_id !== currentUser.user_id);
        if (crosticData && opponent && gameState[opponent.user_id]) {
            setOpponentClueStatuses(
                validateClues(gameState[opponent.user_id], crosticData.clues)
            );
        }
    }, [gameState, crosticData, players, currentUser.user_id]);

    // Sincronizar gridAnswers con gameState
    useEffect(() => {
        if (!crosticData || !gameState[currentUser.user_id]) return;

        const myAnswers = gameState[currentUser.user_id];
        const newGridAnswers = {};

        crosticData.mappings.forEach(mapping => {
            const key = `${mapping.clue_id}_${mapping.letter_position}`;
            const letter = myAnswers[key];
            if (letter) {
                newGridAnswers[mapping.grid_position] = letter;
            }
        });

        setGridAnswers(newGridAnswers);
    }, [gameState, crosticData, currentUser.user_id]);

    const handleAnswerChange = (clueId, letterPosition, letter) => {
        socket.emit('playerAction', {
            puzzleId,
            user: currentUser,
            clueId,
            letterPosition,
            letter,
        });
    };

    const handleGridChange = (gridIndex, letter) => {
        const newGridAnswers = { ...gridAnswers, [gridIndex]: letter };
        setGridAnswers(newGridAnswers);

        const mapping = crosticData.mappings.find(
            m => m.grid_position === gridIndex
        );
        if (mapping) {
            handleAnswerChange(
                mapping.clue_id,
                mapping.letter_position,
                letter
            );
        }
    };

    const handleSendMessage = messageText => {
        socket.emit('sendChatMessage', { puzzleId, message: messageText });
    };

    // Calcular si un jugador completó todas las pistas correctamente
    const isPlayerComplete = (statuses, totalClues) => {
        const correctCount = Object.values(statuses).filter(
            s => s === 'correct'
        ).length;
        return correctCount === totalClues;
    };

    if (!crosticData || loading)
        return (
            <div className='text-center p-10 dark:text-gray-300'>
                Cargando batalla... ⚔️
            </div>
        );

    const opponent = players.find(p => p.user_id !== currentUser.user_id);
    const myAnswers = gameState[currentUser.user_id] || {};
    const opponentAnswers = opponent ? gameState[opponent.user_id] || {} : {};

    const myCorrectClues = Object.values(clueStatuses).filter(
        s => s === 'correct'
    ).length;
    const opponentCorrectClues = Object.values(opponentClueStatuses).filter(
        s => s === 'correct'
    ).length;

    const totalClues = crosticData.clues.length;
    const myPercentage = Math.round((myCorrectClues / totalClues) * 100);
    const opponentPercentage = Math.round(
        (opponentCorrectClues / totalClues) * 100
    );

    // ✅ NUEVO: Verificar si los jugadores completaron todo
    const isMyGridComplete = isPlayerComplete(clueStatuses, totalClues);
    const isOpponentGridComplete = isPlayerComplete(
        opponentClueStatuses,
        totalClues
    );

    if (winner) {
        return (
            <div className='text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl'>
                <h1 className='text-4xl font-bold text-yellow-500'>
                    ¡Batalla Terminada!
                </h1>
                <p className='mt-4 text-2xl dark:text-gray-200'>
                    El ganador es:{' '}
                    <span className='font-bold text-green-500'>
                        {winner.name}
                    </span>{' '}
                    🏆
                </p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className='mt-8 bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition'
                >
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-shrink-0'>
                <h1 className='text-3xl font-bold text-center mb-4 dark:text-gray-100'>
                    ¡Batalla Crostic!
                </h1>
            </div>
            <div className='flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 min-h-0'>
                <div className='md:col-span-1 overflow-y-auto p-2'>
                    <h2 className='text-xl font-bold mb-2 text-center dark:text-gray-200'>
                        {currentUser.name} (Tú)
                    </h2>
                    <BattleClues
                        isInteractive={true}
                        clues={crosticData.clues}
                        mappings={crosticData.mappings}
                        userAnswers={myAnswers}
                        onAnswerChange={handleAnswerChange}
                    />
                </div>

                <div className='md:col-span-1 flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-lg gap-4 min-h-0'>
                    {/* Temporizador */}
                    <div className='flex-shrink-0 text-center'>
                        <p className='text-lg font-bold dark:text-gray-300'>
                            Tiempo
                        </p>
                        <p className='text-4xl font-mono font-bold dark:text-white'>
                            {new Date(time * 1000).toISOString().substr(14, 5)}
                        </p>
                    </div>

                    {/* Barras de Progreso */}
                    <div className='flex-shrink-0 w-full mt-10'>
                        <p className='text-center font-bold mb-2 dark:text-gray-300'>
                            Pistas Encontradas
                        </p>
                        <div className='flex justify-between items-center mb-1'>
                            <span className='text-sm font-medium dark:text-gray-200'>
                                {currentUser.name}
                            </span>
                            <span className='text-sm font-medium dark:text-gray-200'>
                                {myCorrectClues}/{totalClues} ({myPercentage}%)
                            </span>
                        </div>
                        <div className='w-full bg-gray-300 rounded-full h-4 dark:bg-gray-600'>
                            <div
                                className='bg-blue-600 h-4 rounded-full'
                                style={{
                                    width: `${
                                        (myCorrectClues /
                                            (crosticData.clues.length || 2)) *
                                        100
                                    }%`,
                                }}
                            ></div>
                        </div>
                        {opponent ? (
                            <>
                                <div className='flex justify-between items-center mt-4 mb-1'>
                                    <span className='text-sm font-medium dark:text-gray-200'>
                                        {opponent.name}
                                    </span>
                                    <span className='text-sm font-medium dark:text-gray-200'>
                                        {opponentCorrectClues}/{totalClues} (
                                        {opponentPercentage}%)
                                    </span>
                                </div>
                                <div className='w-full bg-gray-300 rounded-full h-4 dark:bg-gray-600'>
                                    <div
                                        className='bg-red-600 h-4 rounded-full'
                                        style={{
                                            width: `${
                                                (opponentCorrectClues /
                                                    (crosticData.clues.length ||
                                                        1)) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </>
                        ) : (
                            <p className='text-center mt-6 text-sm dark:text-gray-400'>
                                Esperando oponente...
                            </p>
                        )}
                    </div>

                    {/* BattleGrid */}
                    {/* <p>{opponent.name}</p> */}
                    <div className='flex-shrink-0 overflow-y-auto'>
                        <BattleGrid
                            quote={crosticData.quote}
                            mappings={crosticData.mappings.map(m => ({
                                ...m,
                                clue_order: crosticData.clues.find(
                                    c => c.clue_id === m.clue_id
                                ).clue_order,
                            }))}
                            userAnswers={myAnswers}
                            onGridChange={handleGridChange}
                        />
                    </div>

                    {/* ✅ NUEVO: Tablero del Oponente (solo visible si completó todo) */}
                    {/* {opponent && ( */}
                    <div className='flex-shrink-0 overflow-y-auto'>
                        <OpponentBattleGrid
                            quote={crosticData.quote}
                            mappings={crosticData.mappings}
                            userAnswers={opponentAnswers}
                            isComplete={isOpponentGridComplete}
                        />
                    </div>
                    {/* )} */}

                    {/* ChatBox */}
                    <div className='flex-grow min-h-0'>
                        <ChatBox
                            messages={messages}
                            onSendMessage={handleSendMessage}
                        />
                    </div>
                </div>

                <div className='md:col-span-1 overflow-y-auto p-2'>
                    <h2 className='text-xl font-bold mb-2 text-center dark:text-gray-200'>
                        {opponent ? opponent.name : 'Oponente'}
                    </h2>
                    {opponent ? (
                        <BattleClues
                            isInteractive={false}
                            clues={crosticData.clues}
                            mappings={crosticData.mappings}
                            userAnswers={opponentAnswers}
                        />
                    ) : (
                        <p className='text-center dark:text-gray-300'>
                            Esperando a que un oponente se una...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BattlePage;
