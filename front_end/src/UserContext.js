import React, { useState, createContext, useContext, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const UserContext = createContext(null)

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
    const [apiURL, setApiURL] = useState('http://localhost:8000') // for development
    // const [apiURL, setApiURL] = useState('https://backend-app-expenses-df71d5313106.herokuapp.com'); // for production
    const [token, setToken] = useState(Cookies.get('authToken') || '')
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) {
            Cookies.set('authToken', token, { expires: 7, secure: false, sameSite: 'strict' }); // for development
            // Cookies.set('authToken', token, { expires: 7, secure: true, sameSite: 'strict' }); // for production
        }
        else {
            Cookies.remove('authToken');
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ setToken, apiURL, loading, setLoading }}>
            {children}
        </UserContext.Provider>
    );
};
