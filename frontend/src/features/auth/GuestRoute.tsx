import { Navigate, Outlet } from 'react-router-dom';
import { hasAuthSession } from './authSession';

export function GuestRoute() {
    if (hasAuthSession()) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
}
