import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Importación de Componentes de Estructura y Protección
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './components/MainLayout';
import InvitationToast from './components/InvitationToast'; // Componente para notificaciones

// Importación de Páginas
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import RankingsPage from './pages/RankingPage';
import BattlePage from './pages/BattlePage';
import CreateCrosticPage from './pages/CreateCrosticPage';
import EditCrosticPage from './pages/EditCrosticPage';
import FriendsPage from './pages/FriendsPage';

function App() {
    const { token } = useAuth();

    return (
        <>
            <Routes>
                {/* --- Rutas Públicas --- */}
                {/* Si el usuario ya está logueado, lo redirige al dashboard al intentar ir a /login */}
                <Route
                    path='/login'
                    element={
                        token ? <Navigate to='/dashboard' /> : <LoginPage />
                    }
                />

                {/* --- Rutas Protegidas (Requieren inicio de sesión) --- */}
                <Route element={<ProtectedRoute />}>
                    {/* Todas las rutas aquí dentro usarán el MainLayout (Navbar, etc.) */}
                    <Route element={<MainLayout />}>
                        {/* Rutas para usuarios estándar */}
                        <Route path='/dashboard' element={<DashboardPage />} />

                        {/* CORRECCIÓN: La ruta para el juego no debe incluir '/api' */}
                        <Route path='/game/:id' element={<GamePage />} />

                        <Route path='/profile' element={<ProfilePage />} />
                        <Route path='/rankings' element={<RankingsPage />} />
                        <Route path='/friends' element={<FriendsPage />} />
                        <Route path='/battle/:id' element={<BattlePage />} />

                        {/* Rutas solo para Administradores */}
                        <Route element={<AdminRoute />}>
                            <Route
                                path='/admin/create'
                                element={<CreateCrosticPage />}
                            />
                            <Route
                                path='/admin/edit/:id'
                                element={<EditCrosticPage />}
                            />
                        </Route>
                    </Route>
                </Route>

                {/* --- Redirección por Defecto --- */}
                {/* Atrapa cualquier otra URL y redirige al dashboard o al login */}
                <Route
                    path='*'
                    element={<Navigate to={token ? '/dashboard' : '/login'} />}
                />
            </Routes>

            {/* Componente de Notificaciones */}
            {/* Se coloca aquí para que pueda aparecer encima de cualquier página si el usuario está logueado */}
            {token && <InvitationToast />}
        </>
    );
}

export default App;
