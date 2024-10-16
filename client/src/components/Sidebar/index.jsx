import React, { useState, useEffect } from "react";
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilSignOutAlt,
} from '@iconscout/react-unicons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import { useLanguage } from './../../hooks/languageContext';

const SidebarIcon = ({ icon: Icon, active, text, to, expanded }) => (
  <Link to={to}>
    <div className={`p-3 rounded-full flex items-center ${active ? 'bg-green-100' : 'hover:bg-gray-100'} transition-all duration-300 ease-in-out`}>
      <Icon size={24} className={active ? 'text-green-600' : 'text-gray-600'} />
      {expanded && <span className="ml-3 text-gray-600">{text}</span>}
    </div>
  </Link>
);

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const texts = {
    en: {
      profile: 'Profile',
      dashboard: 'Dashboard',
      buyCrops: 'Buy Crops',
      logout: 'Logout',
    },
    hi: {
      profile: 'डैशबोर्ड',
      dashboard: 'डैशबोर्ड',
      logout: 'लॉगआउट',
    },
    te: {
      profile: 'డాష్‌బోర్డ్',
      dashboard: 'డాష్‌బోర్డ్',
      logout: 'లాగ్‌అవుట్',
    },
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('customer-token');
    localStorage.removeItem('customer-userId');
    navigate('/login');
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') {
      setActiveTab('dashboard');
    } else if (path === '/profile') {
      setActiveTab('profile');
    } else if (path == '/buyCrops') {
      setActiveTab('buyCrops');
    }
  }, [location]);

  return (
    <div className={`bg-white border border-r-2 shadow-md flex flex-col py-8 px-2 space-y-8 transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'} h-screen overflow-hidden`}>
      {/* Sidebar Logo */}
      <div className={`flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ease-in-out ${expanded ? 'w-48 h-12 bg-green-500 px-4 rounded-2xl' : 'w-12 h-12 bg-green-500 rounded-full animate-pulse'}`}>
        {expanded ? 'Agri Connect' : 'AC'}
      </div>

      {/* Sidebar Toggle Button */}
      <div className="flex items-center justify-center w-full mt-4">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-green-600 transition-all duration-300 ease-in-out">
          {expanded ? '<' : '>'}
        </button>
      </div>

      {/* Sidebar Items */}
      <SidebarIcon to='/profile' icon={UilEstate} active={activeTab === 'profile'} text={texts[language].profile} expanded={expanded} />
      <SidebarIcon to='/dashboard' icon={UilEstate} active={activeTab === 'dashboard'} text={texts[language].dashboard} expanded={expanded} />
      <SidebarIcon to='/buyCrops' icon={UilEstate} active={activeTab === 'buyCrops'} text={texts[language].buyCrops} expanded={expanded} />

      {/* Logout Button */}
      <div className="mt-auto">
        <div onClick={handleLogout} className="p-3 rounded-full flex items-center cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out">
          <UilSignOutAlt size={24} className="text-gray-600" />
          {expanded && <span className="ml-3 text-gray-600">{texts[language].logout}</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
