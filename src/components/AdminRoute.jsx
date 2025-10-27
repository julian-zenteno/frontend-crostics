import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>;
    }

    // Si el usuario está logueado Y tiene el rol de 'admin', permite el paso.
    // De lo contrario, lo redirige al dashboard.
    return user?.role === 'admin' ? (
        <Outlet />
    ) : (
        <Navigate to='/dashboard' replace />
    );
};

export default AdminRoute;
