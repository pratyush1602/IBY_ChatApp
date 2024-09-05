import { Navigate } from "react-router-dom";

// Example of a simple function that checks if a user is authenticated
// This could come from your Redux store or localStorage.
const isAuthenticated = () => {
    return localStorage.getItem("token") !== null;  // Check if the user has a token stored
};

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;
