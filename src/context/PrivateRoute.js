
import React from "react";
import { Navigate, Route } from "react-router-dom";
import useAuth from "./useAuth";

const PrivateRoute = ({ children }) => {
    const { token } = useAuth();

    if (!token) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return children;
    // return isLoggedIn ? (
    //     <Route {...props} path={path} />
    // ) : (
    //     <Navigate to="/login" replace />
    // );
};

export default PrivateRoute;
