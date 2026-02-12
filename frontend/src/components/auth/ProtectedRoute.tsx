
import { Navigate } from "react-router";

// Mock Auth Check - In a real app, this would use a context or hook
const isAuthenticated = () => {
    // Replace with real auth check
    return true; 
};

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
}
