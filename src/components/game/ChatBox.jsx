import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import EmojiPicker from 'emoji-picker-react';

const ChatBox = ({ messages, onSendMessage }) => {
    const { user: currentUser } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);

    // Este efecto hace scroll hacia el último mensaje cuando llegan nuevos.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const onEmojiClick = emojiObject => {
        setNewMessage(prevInput => prevInput + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    const formatTimestamp = timestamp => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        // El contenedor principal es flexible y ocupa el 100% de la altura que le da su padre.
        <div className='flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-inner'>
            {/* Cabecera (tamaño fijo) */}
            <div className='flex-shrink-0 p-3 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-lg font-semibold text-center text-gray-800 dark:text-gray-100'>
                    ⚔💬 Chat temporal de Batalla 🗨⚔
                </h3>
            </div>

            {/* Área de Mensajes (crece y permite scroll) */}
            <div className='flex-grow p-4 space-y-4 overflow-y-auto max-h-40 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 dark:scrollbar-thumb-gray-900 dark:scrollbar-track-gray-700 hover:scrollbar-thumb-gray-800 dark:hover:scrollbar-thumb-gray-800'>
                {messages.map((msg, index) => {
                    const isCurrentUser =
                        msg.sender.user_id === currentUser.user_id;
                    return (
                        <div
                            key={index}
                            className={`flex items-end gap-2 ${
                                isCurrentUser ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <span
                                className={`text-xs text-gray-400 ${
                                    isCurrentUser ? 'order-1' : 'order-2'
                                }`}
                            >
                                {formatTimestamp(msg.timestamp)}
                            </span>
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                    isCurrentUser
                                        ? 'bg-blue-500 text-white order-2'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 order-1'
                                }`}
                            >
                                {!isCurrentUser && (
                                    <p className='text-xs font-bold text-blue-600 dark:text-blue-400'>
                                        {msg.sender.name}
                                    </p>
                                )}
                                <p className='break-words'>{msg.text}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Área de Input (tamaño fijo) */}
            <div className='flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 relative'>
                {showEmojiPicker && (
                    <div className='absolute bottom-full mb-2 right-4'>
                        <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            height={350}
                            width='100%'
                        />
                    </div>
                )}
                <form onSubmit={handleSubmit} className='space-y-2'>
                    <div className='relative flex items-center'>
                        <textarea
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            placeholder='Escribe un mensaje...'
                            className='w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
                        />
                        <button
                            type='button'
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-xl rounded-md hover:bg-gray-200 dark:hover:bg-gray-600'
                        >
                            😎
                        </button>
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition'
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
