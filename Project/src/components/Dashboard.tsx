import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from '../contexts/LocationContext';
import { PriceChecker } from './PriceChecker';
import { DoctorFinder } from './DoctorFinder';
import { SettingsMenu } from './SettingsMenu';
import { BarChart3, Stethoscope } from 'lucide-react';

export function Dashboard() {
  const { isDark } = useTheme();
  const { userLocation } = useLocation();
  const [activeTab, setActiveTab] = useState<'prices' | 'doctors'>('doctors');

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/vc.png" alt="VigourCare Logo" className="w-8 h-8" />
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>VigourCare</h1>
            </div>
            <div className="flex items-center gap-4">
              {userLocation && (
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Location: {userLocation.lat.toFixed(2)}, {userLocation.lng.toFixed(2)}
                </span>
              )}
              <SettingsMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`mb-6 flex gap-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'doctors'
                ? 'text-blue-600 border-blue-600'
                : isDark
                ? 'text-gray-400 border-transparent hover:text-gray-300'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            Find Doctors
          </button>
          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'prices'
                ? 'text-blue-600 border-blue-600'
                : isDark
                ? 'text-gray-400 border-transparent hover:text-gray-300'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Price Checker
          </button>
        </div>

        <div>
          {activeTab === 'doctors' ? <DoctorFinder /> : <PriceChecker />}
        </div>
      </div>
    </div>
  );
}
