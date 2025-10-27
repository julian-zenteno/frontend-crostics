import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const MainLayout = () => {
    return (
        // Usamos un layout de flexbox vertical que ocupa toda la altura de la pantalla
        <div className='flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
            {/* 1. El Navbar ahora es un elemento flex que no se encoge ni crece */}
            <header className='flex-shrink-0'>
                <Navbar />
            </header>

            {/* 2. El área de contenido principal es la que crece para ocupar el espacio restante y permite el scroll si es necesario */}
            <main className='flex-grow overflow-y-auto'>
                <div className='container mx-auto p-4 md:p-6 lg:p-8'>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
