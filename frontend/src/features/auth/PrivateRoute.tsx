import { Navigate, Outlet } from 'react-router-dom';
import { hasAuthSession } from './authSession';

export function PrivateRoute() {
    if (!hasAuthSession()) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
}
