import React, { useState, createContext, useContext } from 'react'

const UserContext = createContext(null)

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
    const [globalUsername, setGlobalUsername] = useState('')
    const [apiURL, setApiURL] = useState('http://localhost:8000') // for development
    // const [apiURL, setApiURL] = useState('https://backend-app-expenses-df71d5313106.herokuapp.com') // for production

    return (
        <UserContext.Provider value={{ globalUsername, setGlobalUsername, apiURL }}>
            {children}
        </UserContext.Provider>
    )
}
