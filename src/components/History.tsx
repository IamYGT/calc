import React, { useState } from 'react';
import { Trash2, Search, Filter } from 'lucide-react';

interface HistoryProps {
  user: string;
  isDarkMode: boolean;
}

const History: React.FC<HistoryProps> = ({ user, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getHistory = () => {
    return JSON.parse(localStorage.getItem(`${user}_history`) || '[]').reverse();
  };

  const clearHistory = () => {
    localStorage.setItem(`${user}_history`, '[]');
    window.location.reload();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const history = getHistory().filter((item: any) => {
    const matchesSearch = item.equation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.result.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`space-y-4 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          İşlem Geçmişi
        </h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className={`flex items-center gap-2 px-3 py-2 text-sm ${
              isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
            } rounded-lg transition-colors`}
          >
            <Trash2 size={16} />
            Geçmişi Temizle
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <div className={`flex-1 relative ${isDarkMode ? 'text-white' : ''}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="İşlem geçmişinde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600'
                  : 'bg-gray-100 text-gray-800 placeholder-gray-500 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="standard">Standart</option>
            <option value="scientific">Bilimsel</option>
            <option value="conversion">Dönüşüm</option>
          </select>
        </div>
      </div>

      {history.length === 0 ? (
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {searchTerm || selectedCategory !== 'all'
            ? 'Aramanızla eşleşen sonuç bulunamadı.'
            : 'Henüz işlem geçmişi bulunmuyor.'}
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(item.timestamp)}
              </div>
              <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {item.equation} = {item.result}
              </div>
              <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Kategori: {item.category || 'standard'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;