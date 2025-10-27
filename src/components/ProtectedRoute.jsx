import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                Cargando...
            </div>
        );
    }

    return token ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
