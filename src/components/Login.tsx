import React, { useState } from 'react';
import { Calculator as CalculatorIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Kullanıcı adı en az 3 karakter olmalıdır');
      return;
    }
    onLogin(username.trim());
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode
        ? 'bg-gradient-to-br from-gray-900 to-indigo-900'
        : 'bg-gradient-to-br from-indigo-100 to-purple-100'
    } flex items-center justify-center p-6`}>
      <div className="w-full max-w-md">
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-2xl shadow-xl p-8`}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <CalculatorIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Hesap Makinesi</h1>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            } mt-2`}>Devam etmek için giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className={`block text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-2`}
              >
                Kullanıcı Adı
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-white text-gray-800 border-gray-300'
                } border focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors`}
                placeholder="Kullanıcı adınızı girin"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;