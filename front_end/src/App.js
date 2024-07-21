import './App.css'

import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import HomePage from './components/HomePage'
import GroupsPage from './components/GroupsPage'
import ReportsPage from './components/ReportsPage'

import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home/:username" element={<HomePage />} />
          <Route path="/groups/:username" element={<GroupsPage />} />
          <Route path="/reports/:username" element={<ReportsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
