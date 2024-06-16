import './App.css';

import LoginPage from './LoginPage.js';
import SignupPage from './SignupPage.js';
import HomePage from './HomePage.js';
import GroupsPage from './GroupsPage.js';
import ReportsPage from './ReportsPage.js';

import { BrowserRouter, Routes, Route } from "react-router-dom";

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
  );
}

export default App;
