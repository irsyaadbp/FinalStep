import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: ('student' | 'admin')[] }) {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
