import React, { useState, createContext, useContext } from 'react';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [globalUsername, setGlobalUsername] = useState('');

    return (
        <UserContext.Provider value={{ globalUsername, setGlobalUsername }}>
            {children}
        </UserContext.Provider>
    );
};
