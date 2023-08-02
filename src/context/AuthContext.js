import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import axios from "axios";
import CryptoJS from 'crypto-js';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);


    useEffect(() => {
        // When the component mounts, check if the user is already authenticated by looking for the token in the cookie
        const storedToken = Cookies.get('token');
        const storedUser = Cookies.get('user'); // Get the user role from cookie

        if (storedToken && storedUser) {
            setIsLoggedIn(true);
            setToken(storedToken);
            setUser(storedUser); // Set the user role
        }
    }, []);

    useEffect(() => {
        // Whenever the token or user role changes, update them in the cookies
        if (token) {
            Cookies.set('token', token, { expires: 7 }); // Cookie expires after 7 days
        }
        if (user) {
            Cookies.set('user', user, { expires: 7 }); // Cookie expires after 7 days
        }
    }, [token, user]);

    useEffect(() => {
        // Add request interceptor to set the token in request headers
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Clean up the interceptor on component unmount
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, [token]);
    // const login = () => {
    //     setIsLoggedIn(true);
    // };
    //
    // const logout = () => {
    //     setIsLoggedIn(false);
    // };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;