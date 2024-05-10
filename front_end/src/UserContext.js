import React, { useState, createContext, useContext, useEffect } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [globalUsername, setGlobalUsername] = useState(() => { return localStorage.getItem('globalUsername') || '' })
    const [apiURL, setApiURL] = useState('http://localhost:8000'); // for development
    // const [apiURL, setApiURL] = useState('https://backend-app-expenses-df71d5313106.herokuapp.com'); // for production

    useEffect(() => {
        localStorage.setItem('globalUsername', globalUsername);
    }, [globalUsername]);

    return (
        <UserContext.Provider value={{ globalUsername, setGlobalUsername, apiURL }}>
            {children}
        </UserContext.Provider>
    );
};
