// In App.js or wherever you initialize your app:
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, Navigate } from "react-router-dom";
import { setAuthToken } from "./hooks/globalAuth";
import RouteManagement from "./components/RouteManagement";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import './App.css';
import { setLoginState } from './hooks/authSlice'; // Assuming you have a Redux action for this
import { LanguageProvider } from "./hooks/languageContext";

function App() {
  // const isLogin = useSelector((state) => state.auth.token);
  const token = localStorage.getItem('customer-token')
  const isLogin = token
  setAuthToken(isLogin);

  return (
    <LanguageProvider>
    <Routes>
      <Route
        path="/signup"
        element={!isLogin ? <SignUp /> : <p>Already logged in</p>}
      />
      <Route
        path="/login"
        element={!isLogin ? <Login /> : <p>Already logged in</p>}
      />
      <Route path="/*" element={<RouteManagement isLogin={isLogin} />} />
    </Routes>
    </LanguageProvider>
  );
}

export default App;
