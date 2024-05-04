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
          <Route path="/login" element={<LoginPage />} index />
          <Route path="/signup" element={<SignupPage />} index />
          <Route path="/home" element={<HomePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
