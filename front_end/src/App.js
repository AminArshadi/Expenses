import './App.css';

import LoginPage from './LoginPage.js';
import SignupPage from './SignupPage.js';
import HomePage from './HomePage.js';
import ReportsPage from './ReportsPage.js';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
