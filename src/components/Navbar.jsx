import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import OnlineUsersPanel from './OnlineUsersPanel';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const activeLinkStyle = { color: '#2563EB', fontWeight: 'bold' };

    return (
        // El fondo del Navbar cambia en modo oscuro
        <>
            <nav className='bg-white dark:bg-gray-800 shadow-md z-50'>
                <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <Link
                            to='/dashboard'
                            className='text-2xl font-bold text-blue-600 dark:text-blue-400'
                        >
                            Crostic
                        </Link>

                        {user && (
                            <div className='hidden sm:flex items-center space-x-6'>
                                {/* Los enlaces también cambian de color */}
                                <NavLink
                                    to='/dashboard'
                                    style={({ isActive }) =>
                                        isActive ? activeLinkStyle : undefined
                                    }
                                    className='text-gray-600 dark:text-gray-300 hover:text-blue-600'
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to='/rankings'
                                    style={({ isActive }) =>
                                        isActive ? activeLinkStyle : undefined
                                    }
                                    className='text-gray-600 dark:text-gray-300 hover:text-blue-600'
                                >
                                    Ranking
                                </NavLink>
                                <NavLink
                                    to='/friends'
                                    style={({ isActive }) =>
                                        isActive ? activeLinkStyle : undefined
                                    }
                                    className='text-gray-600 dark:text-gray-300 hover:text-blue-600'
                                >
                                    Amigos
                                </NavLink>
                                {user.role === 'admin' && (
                                    <NavLink
                                        to='/admin/create'
                                        style={({ isActive }) =>
                                            isActive
                                                ? activeLinkStyle
                                                : undefined
                                        }
                                        className='text-gray-600 dark:text-gray-300 hover:text-blue-600'
                                    >
                                        Crear Crostic
                                    </NavLink>
                                )}
                            </div>
                        )}

                        <div className='flex items-center space-x-4'>
                            <button
                                onClick={toggleTheme}
                                className='p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition'
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            {user && (
                                <button
                                    onClick={() => setIsPanelOpen(true)}
                                    className='p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition'
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='24'
                                        height='24'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                    >
                                        <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                                        <circle cx='9' cy='7' r='4' />
                                        <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
                                        <path d='M16 3.13a4 4 0 0 1 0 7.75' />
                                    </svg>
                                </button>
                            )}

                            {user ? (
                                <div className='flex items-center space-x-4'>
                                    <NavLink
                                        to='/profile'
                                        style={({ isActive }) =>
                                            isActive
                                                ? activeLinkStyle
                                                : undefined
                                        }
                                        className='text-gray-700 dark:text-gray-300 hidden sm:block hover:text-blue-600'
                                    >
                                        Hola, {user.name}
                                    </NavLink>
                                    <button
                                        onClick={logout}
                                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-medium'
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to='/login'
                                    className='text-blue-600 dark:text-blue-400 hover:underline'
                                >
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <OnlineUsersPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
            />
        </>
    );
};

export default Navbar;
