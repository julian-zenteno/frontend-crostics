import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditCrosticPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState({
        loading: true,
        error: null,
        success: null,
    });

    // Carga los datos del crostic a editar cuando la página se monta.
    useEffect(() => {
        const fetchCrostic = async () => {
            try {
                // CORRECCIÓN: Se quita '/api' de la ruta.
                const res = await api.get(`/crostics/${id}`);
                setFormData({
                    title: res.data.title,
                    difficulty: res.data.difficulty,
                    author: res.data.author || '',
                    quote: res.data.quote,
                    clues: res.data.clues.sort(
                        (a, b) => a.clue_order - b.clue_order
                    ),
                });
            } catch (err) {
                setStatus({
                    error: 'No se pudo cargar el crostic para editar.',
                });
            } finally {
                setStatus(s => ({ ...s, loading: false }));
            }
        };
        fetchCrostic();
    }, [id]);

    // Manejadores para actualizar el estado del formulario.
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClueChange = (index, field, value) => {
        const newClues = [...formData.clues];
        newClues[index][field] = value;
        setFormData(prev => ({ ...prev, clues: newClues }));
    };

    const addClue = () => {
        setFormData(prev => ({
            ...prev,
            clues: [...prev.clues, { clue_text: '', answer: '' }],
        }));
    };

    const removeClue = index => {
        setFormData(prev => ({
            ...prev,
            clues: prev.clues.filter((_, i) => i !== index),
        }));
    };

    // Maneja el envío del formulario al backend.
    const handleSubmit = async e => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: null });

        // Formatea el payload para el backend, asegurando el orden y mayúsculas.
        const payload = {
            ...formData,
            quote: formData.quote.toUpperCase(),
            clues: formData.clues.map((clue, index) => ({
                clue_text: clue.clue_text,
                answer: clue.answer.toUpperCase(),
                clue_order: index + 1, // Reasigna el orden para consistencia
            })),
        };

        try {
            // CORRECCIÓN: Se quita '/api' de la ruta.
            await api.put(`/crostics/${id}`, payload);
            setStatus({
                success: '¡Crostic actualizado con éxito!',
                loading: false,
                error: null,
            });
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setStatus({
                error: err.response?.data?.message || 'Error al actualizar.',
                loading: false,
                success: null,
            });
        }
    };

    if (status.loading && !formData) return <div>Cargando editor...</div>;
    if (!formData) return <div className='text-red-500'>{status.error}</div>;

    return (
        // Se añaden estilos de modo oscuro al contenedor principal.
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6'>
                Editar Crostic
            </h1>
            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Campos Principales con estilos dark */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input
                        type='text'
                        value={formData.title}
                        onChange={e =>
                            handleInputChange('title', e.target.value)
                        }
                        required
                        className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                    />
                    <select
                        value={formData.difficulty}
                        onChange={e =>
                            handleInputChange('difficulty', e.target.value)
                        }
                        className='p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                    >
                        <option value='basico'>Básico</option>
                        <option value='intermedio'>Intermedio</option>
                        <option value='avanzado'>Avanzado</option>
                    </select>
                    <input
                        type='text'
                        value={formData.author}
                        onChange={e =>
                            handleInputChange('author', e.target.value)
                        }
                        className='p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                    />
                    <input
                        type='text'
                        value={formData.quote}
                        onChange={e =>
                            handleInputChange('quote', e.target.value)
                        }
                        required
                        className='p-2 border rounded uppercase dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'
                    />
                </div>

                {/* Pistas Dinámicas con estilos dark */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-semibold dark:text-gray-200'>
                        Pistas y Respuestas
                    </h2>
                    {formData.clues.map((clue, index) => (
                        <div
                            key={index}
                            className='flex items-center space-x-2 p-2 border rounded-md dark:border-gray-600'
                        >
                            <span className='font-bold text-gray-500 dark:text-gray-400'>
                                {index + 1}.
                            </span>
                            <input
                                type='text'
                                value={clue.clue_text}
                                onChange={e =>
                                    handleClueChange(
                                        index,
                                        'clue_text',
                                        e.target.value
                                    )
                                }
                                required
                                className='p-2 border rounded flex-grow dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200'
                            />
                            <input
                                type='text'
                                value={clue.answer}
                                onChange={e =>
                                    handleClueChange(
                                        index,
                                        'answer',
                                        e.target.value
                                    )
                                }
                                required
                                className='p-2 border rounded uppercase dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200'
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

                {/* Botón de Envío y Mensajes de Estado con estilos dark */}
                <div>
                    <button
                        type='submit'
                        disabled={status.loading}
                        className='w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 dark:disabled:bg-gray-500'
                    >
                        {status.loading ? 'Actualizando...' : 'Guardar Cambios'}
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

export default EditCrosticPage;
