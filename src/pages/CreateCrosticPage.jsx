import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateCrosticPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState('basico');
    const [author, setAuthor] = useState('');
    const [quote, setQuote] = useState('');
    const [clues, setClues] = useState([{ clue_text: '', answer: '' }]);
    const [status, setStatus] = useState({
        loading: false,
        error: null,
        success: null,
    });

    const handleClueChange = (index, field, value) => {
        const newClues = [...clues];
        newClues[index][field] = value;
        setClues(newClues);
    };

    const addClue = () => {
        setClues([...clues, { clue_text: '', answer: '' }]);
    };

    const removeClue = index => {
        const newClues = clues.filter((_, i) => i !== index);
        setClues(newClues);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: null });

        const formattedClues = clues.map((clue, index) => ({
            clue_order: index + 1,
            clue_text: clue.clue_text,
            answer: clue.answer.toUpperCase(),
        }));

        const payload = {
            title,
            difficulty,
            author,
            quote: quote.toUpperCase(),
            language: 'es',
            clues: formattedClues,
        };

        try {
            // CORRECCIÓN: Se quita '/api' de la ruta
            await api.post('/crostics', payload);
            setStatus({
                loading: false,
                success: '¡Crostic creado con éxito!',
                error: null,
            });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setStatus({
                loading: false,
                error:
                    err.response?.data?.message || 'Error al crear el crostic.',
                success: null,
            });
        }
    };

    return (
        // Se añaden estilos de modo oscuro al contenedor principal
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6'>
                Crear Nuevo Crostic
            </h1>
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Campos Principales */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input
                        type='text'
                        placeholder='Título'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400'
                    />
                    <select
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        className='p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                    >
                        <option value='basico'>Básico</option>
                        <option value='intermedio'>Intermedio</option>
                        <option value='avanzado'>Avanzado</option>
                    </select>
                    <input
                        type='text'
                        placeholder='Autor (Opcional)'
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400'
                    />
                    <input
                        type='text'
                        placeholder='Frase Oculta (QUOTE)'
                        value={quote}
                        onChange={e => setQuote(e.target.value)}
                        required
                        className='p-2 border rounded uppercase dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400'
                    />
                </div>

                {/* Pistas Dinámicas */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold dark:text-gray-200'>
                        Pistas y Respuestas
                    </h2>
                    {clues.map((clue, index) => (
                        <div
                            key={index}
                            className='flex items-center space-x-2 p-2 border rounded-md dark:border-gray-600'
                        >
                            <span className='font-bold text-gray-500 dark:text-gray-400'>
                                {index + 1}.
                            </span>
                            <input
                                type='text'
                                placeholder='Texto de la pista'
                                value={clue.clue_text}
                                onChange={e =>
                                    handleClueChange(
                                        index,
                                        'clue_text',
                                        e.target.value
                                    )
                                }
                                required
                                className='p-2 border rounded flex-grow dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:placeholder-gray-400'
                            />
                            <input
                                type='text'
                                placeholder='Respuesta'
                                value={clue.answer}
                                onChange={e =>
                                    handleClueChange(
                                        index,
                                        'answer',
                                        e.target.value
                                    )
                                }
                                required
                                className='p-2 border rounded uppercase dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:placeholder-gray-400'
                            />
                            <button
                                type='button'
                                onClick={() => removeClue(index)}
                                className='bg-red-500 text-white p-2 rounded hover:bg-red-600'
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        type='button'
                        onClick={addClue}
                        className='w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    >
                        Añadir Pista +
                    </button>
                </div>

                {/* Botón de Envío y Mensajes de Estado */}
                <div>
                    <button
                        type='submit'
                        disabled={status.loading}
                        className='w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-500'
                    >
                        {status.loading ? 'Creando...' : 'Crear Crostic'}
                    </button>
                    {status.error && (
                        <p className='text-red-500 dark:text-red-400 mt-2 text-center'>
                            {status.error}
                        </p>
                    )}
                    {status.success && (
                        <p className='text-green-500 dark:text-green-400 mt-2 text-center'>
                            {status.success}
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CreateCrosticPage;
