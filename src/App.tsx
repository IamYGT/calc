import React, { useState, useEffect } from 'react';
import { History, Calculator as CalculatorIcon, LogOut } from 'lucide-react';
import Login from './components/Login';
import Calculator from './components/Calculator';
import HistoryComponent from './components/History';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('calculatorTheme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('calculatorUser');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUser(loggedInUser);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calculatorTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser('');
    localStorage.removeItem('calculatorUser');
  };

  if (!isLoggedIn) {
    return <Login onLogin={(username) => {
      setIsLoggedIn(true);
      setUser(username);
      localStorage.setItem('calculatorUser', username);
    }} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 to-indigo-900'
        : 'bg-gradient-to-br from-indigo-100 to-purple-100'
    } p-6`}>
      <div className="max-w-md mx-auto">
        <div className={`rounded-2xl shadow-xl overflow-hidden ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className={`p-4 ${
            isDarkMode ? 'bg-indigo-900' : 'bg-indigo-600'
          } text-white flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Hoş Geldin, {user}</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
                title="Geçmiş"
              >
                <History size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {showHistory ? (
              <HistoryComponent user={user} isDarkMode={isDarkMode} />
            ) : (
              <Calculator
                user={user}
                isDarkMode={isDarkMode}
                onThemeToggle={() => setIsDarkMode(!isDarkMode)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;