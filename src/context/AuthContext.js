import React, {createContext, useEffect, useState} from "react";
import axios from "axios";
import CryptoJS from 'crypto-js';
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [token, setToken] = useState(() => {
        // Try to get the token from local storage
        const storedToken = localStorage.getItem('token');

        // If the token is found in local storage, return it as the initial value
        if (storedToken) {

            const bytes = CryptoJS.AES.decrypt(storedToken, 'my-secret-key');
            const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedToken;
        }

        // Otherwise, return null as the initial value
        return null;
    });

    useEffect(() => {
        // Whenever the token changes, update it in local storage
        const encryptedToken = CryptoJS.AES.encrypt(token, 'my-secret-key').toString();
        localStorage.setItem('token', encryptedToken);
    }, [token]);

    useEffect(() => {
        // Add an interceptor to add the Authorization header to each API request
        axios.interceptors.request.use(config => {
            const bytes = CryptoJS.AES.decrypt(localStorage.getItem('token'), 'my-secret-key');
            const token = bytes.toString(CryptoJS.enc.Utf8);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }, []);

    // const login = () => {
    //     setIsLoggedIn(true);
    // };
    //
    // const logout = () => {
    //     setIsLoggedIn(false);
    // };

    return (
        <AuthContext.Provider value={{ isLoggedIn, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;