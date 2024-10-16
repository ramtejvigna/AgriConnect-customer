import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar';
import Dashboard from "../Dashboard";
import VoiceRecognition from "./VoiceRecognition";
import BuyCrops from "../BuyCrops";

const RouteManagement = ({  }) => {
    const location = useLocation();
    const token = localStorage.getItem('customer-token');
    const isLogin = token
    const ProtectedRoute = ({ children, nextPath }) => {
        if (!isLogin) {
            return <Navigate to={`/login?nextpath=${nextPath}`} replace />;
        }
        return children;
    };

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="w-full h-full bg-white">
                    <Routes>
                        <Route
                            path='/dashboard'
                            element={
                                <ProtectedRoute nextPath={location.pathname}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/buyCrops'
                            element={
                                <ProtectedRoute nextPath={location.pathname}>
                                    <BuyCrops />
                                </ProtectedRoute>
                            }
                        />
                        <Route path='/' element={<Navigate to='/dashboard' replace />} />
                    </Routes>
                </div>
                <VoiceRecognition />
            </div>
        </div>
    );
}

export default RouteManagement;
