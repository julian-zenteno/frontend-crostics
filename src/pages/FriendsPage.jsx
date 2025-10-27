import { useState } from 'react';
import FriendList from '../components/friends/FriendList';
import PendingInvites from '../components/friends/PendingInvites';
import UserSearch from '../components/friends/UserSearch';

const FriendsPage = () => {
    const [activeTab, setActiveTab] = useState('friends');

    const renderContent = () => {
        switch (activeTab) {
            case 'friends':
                return <FriendList />;
            case 'pending':
                return <PendingInvites />;
            case 'search':
                return <UserSearch />;
            default:
                return null;
        }
    };

    const tabClasses = tabName =>
        `px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 ${
            activeTab === tabName
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'
        }`;

    return (
        <div className='max-w-4xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6'>
                Amigos
            </h1>

            {/* Pestañas de Navegación */}
            <div className='flex border-b border-gray-200 dark:border-gray-700 mb-6'>
                <button
                    onClick={() => setActiveTab('friends')}
                    className={tabClasses('friends')}
                >
                    Mis Amigos
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={tabClasses('pending')}
                >
                    Solicitudes Pendientes
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={tabClasses('search')}
                >
                    Buscar Jugadores
                </button>
            </div>

            {/* Contenido de la Pestaña Activa */}
            <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                {renderContent()}
            </div>
        </div>
    );
};

export default FriendsPage;
