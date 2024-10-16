import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Cloud, Leaf, DollarSign, Droplet, Sun, Wind,
  Thermometer, Calendar, Plus, ChevronDown, Settings, LogOut
} from 'lucide-react';
import axios from 'axios';
import LanguageDropdown from './Language';
import { useLanguage } from '../../hooks/languageContext.jsx';

// Mock data
const farmActivityData = [
  { name: 'Irrigation', value: 2.3, color: '#36A2EB' },
  { name: 'Fertilization', value: 1.5, color: '#FF6384' },
  { name: 'Harvesting', value: 3.2, color: '#FFCE56' },
];

const weatherData = [
  { day: 'Mon', temperature: 25, humidity: 60, rainfall: 10 },
  { day: 'Tue', temperature: 27, humidity: 55, rainfall: 5 },
  { day: 'Wed', temperature: 26, humidity: 58, rainfall: 15 },
  { day: 'Thu', temperature: 28, humidity: 52, rainfall: 8 },
  { day: 'Fri', temperature: 24, humidity: 65, rainfall: 20 },
  { day: 'Sat', temperature: 23, humidity: 68, rainfall: 12 },
  { day: 'Sun', temperature: 26, humidity: 62, rainfall: 6 },
];

const cropYieldData = [
  { name: 'Wheat', current: 4.5, target: 5.0 },
  { name: 'Rice', current: 5.2, target: 5.5 },
  { name: 'Corn', current: 6.8, target: 7.0 },
  { name: 'Soybeans', current: 3.9, target: 4.2 },
];

const sustainabilityScore = 78;

const farmingHabits = [
  { name: 'Crop Rotation', completedSessions: 3, totalSessions: 4, icon: <Leaf size={24} /> },
  { name: 'Water Conservation', completedSessions: 5, totalSessions: 6, icon: <Droplet size={24} /> },
  { name: 'Soil Health Management', completedSessions: 2, totalSessions: 3, icon: <Sun size={24} /> },
  { name: 'Integrated Pest Management', completedSessions: 4, totalSessions: 5, icon: <Wind size={24} /> },
];

const Card = ({ children, className = '' }) => (
  <motion.div
    className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-4 py-3 bg-gray-50 border-b border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

const SidebarIcon = ({ icon: Icon, active }) => (
  <div className={`p-3 rounded-full ${active ? 'bg-green-100' : 'hover:bg-gray-100'}`}>
    <Icon size={24} className={active ? 'text-green-600' : 'text-gray-600'} />
  </div>
);

const CalendarCon = ({ month, year, activeDays, onDayClick }) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-1">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
        <div key={day} className="text-center text-xs font-medium text-gray-500">{day}</div>
      ))}
      {Array(firstDay).fill(null).map((_, i) => (
        <div key={`empty-${i}`} className="h-8"></div>
      ))}
      {days.map(day => (
        <div
          key={day}
          className={`h-8 flex items-center justify-center rounded-full text-sm cursor-pointer
            ${activeDays.includes(day) ? 'bg-green-500 text-white' : 'text-gray-700'}`}
          onClick={() => onDayClick(day)}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

const ProgressBar = ({ value, max, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
    <div
      className="bg-green-600 h-2.5 rounded-full"
      style={{ width: `${(value / max) * 100}%` }}
    ></div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDays, setActiveDays] = useState([1, 5, 12, 17, 23, 28]);
  const { language } = useLanguage();

  const texts = {
    en: {
      greeting: 'Hi, Farmer John!',
      subtitle: 'Let\'s check your farm\'s activity today',
      searchPlaceholder: 'Search for farm data',
      upgrade: 'Upgrade',
      weatherData: 'Weather Data',
      farmingDays: 'Your Farming Days',
      farmActivity: 'Your Farm Activity for Today',
      cropYield: 'Crop Yield Progress',
      sustainabilityScore: 'Sustainability Score',
      farmingHabits: 'My Farming Habits',
      addNew: 'Add New',
      sessionsCompleted: 'Sessions completed:',
      greatJob: 'Great job! Your farm is on track for sustainability.',
    },
    hi: {
      greeting: 'नमस्ते, फार्मर जॉन!',
      subtitle: 'आज आपके फार्म की गतिविधि देखें',
      searchPlaceholder: 'फार्म डेटा खोजें',
      upgrade: 'अपग्रेड करें',
      weatherData: 'मौसम डेटा',
      farmingDays: 'आपके फार्मिंग दिन',
      farmActivity: 'आज आपकी फार्म गतिविधि',
      cropYield: 'फसल उत्पादन प्रगति',
      sustainabilityScore: 'स्थायित्व स्कोर',
      farmingHabits: 'मेरी फार्मिंग आदतें',
      addNew: 'नया जोड़ें',
      sessionsCompleted: 'सत्र पूरा हुआ:',
      greatJob: 'शाबाश! आपका फार्म स्थायित्व के लिए सही रास्ते पर है।',
    },
    te: {
      greeting: 'హలో, ఫార్మర్ జాన్!',
      subtitle: 'మీ ఫార్మ్ యొక్క చర్యలను ఈ రోజు చూడండి',
      searchPlaceholder: 'ఫార్మ్ డేటా కోసం శోధించండి',
      upgrade: 'అప్‌గ్రేడ్ చేయండి',
      weatherData: 'వాతావరణ డేటా',
      farmingDays: 'మీ ఫార్మింగ్ డేస్',
      farmActivity: 'ఈ రోజు మీ ఫార్మ్ చర్య',
      cropYield: 'పంట ఉత్పత్తి పురోగతి',
      sustainabilityScore: 'స్థిరత్వ స్కోర్',
      farmingHabits: 'నా ఫార్మింగ్ అలవాట్లు',
      addNew: 'కొత్తది జోడించండి',
      sessionsCompleted: 'సెషన్లు పూర్తయ్యాయి:',
      greatJob: 'బాగుంది! మీ ఫార్మ్ స్థిరత్వం కోసం సరైన పథంలో ఉంది.',
    },
  };

  const handleDayClick = async (day) => {
    // Update the active days
    setActiveDays(prevDays => {
      if (prevDays.includes(day)) {
        return prevDays.filter(d => d !== day);
      } else {
        return [...prevDays, day];
      }
    });

    // Send the update to the backend
    try {
      await axios.post('/api/update-status', { day });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  

  return (
    <div className="flex h-full overflow-y-auto bg-gray-100 w-full">
      <div className="flex-1 p-10 overflow-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{texts[language].greeting}</h1>
            <p className="text-gray-600">{texts[language].subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder={texts[language].searchPlaceholder}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <svg className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <LanguageDropdown />
           
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>{texts[language].weatherData}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                  <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="rainfall" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{texts[language].farmingDays}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">June</span>
                <button className="text-gray-600 hover:text-gray-800">
                  <ChevronDown size={20} />
                </button>
              </div>
              <CalendarCon month={5} year={2023} activeDays={activeDays} onDayClick={handleDayClick} />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>{texts[language].farmActivity}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={farmActivityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {farmActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around mt-4">
                {farmActivityData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value}h</div>
                    <div className="text-gray-600">{item.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{texts[language].cropYield}</CardTitle>
            </CardHeader>
            <CardContent className='h-5/6 flex items-center justify-center'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cropYieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="current" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="target" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{texts[language].sustainabilityScore}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-300"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-green-500"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - sustainabilityScore / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                    {sustainabilityScore}%
                  </span>
                </div>
              </div>
              <p className="text-center mt-4 text-gray-600">{texts[language].greatJob}</p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>{texts[language].farmingHabits}</CardTitle>
              <button className="text-green-500 hover:text-green-600 flex items-center">
                <Plus size={20} className="mr-1" /> {texts[language].addNew}
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {farmingHabits.map((habit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-gray-600 p-2 rounded-full mr-4">
                      {habit.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{habit.name}</span>
                        <span className="text-sm text-gray-500">
                          {texts[language].sessionsCompleted} {habit.completedSessions}/{habit.totalSessions}
                        </span>
                      </div>
                      <ProgressBar value={habit.completedSessions} max={habit.totalSessions} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
