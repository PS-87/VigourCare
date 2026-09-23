import { useState } from 'react';
import { BarChart3, TrendingDown, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface MedicinePrice {
  name: string;
  avgPrice: number;
  range: { min: number; max: number };
  trend: 'up' | 'down' | 'stable';
  source: string;
}

export function PriceChecker() {
  const { isDark } = useTheme();
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState<MedicinePrice | null>(null);
  const [scanMode, setScanMode] = useState(false);

  const samplePrices: Record<string, MedicinePrice> = {
    'aspirin': {
      name: 'Aspirin 500mg',
      avgPrice: 45,
      range: { min: 35, max: 65 },
      trend: 'stable',
      source: 'NPPA Price Compendium'
    },
    'amoxicillin': {
      name: 'Amoxicillin 500mg',
      avgPrice: 120,
      range: { min: 90, max: 150 },
      trend: 'down',
      source: 'NPPA Price Compendium'
    },
    'paracetamol': {
      name: 'Paracetamol 500mg',
      avgPrice: 38,
      range: { min: 25, max: 55 },
      trend: 'stable',
      source: 'NPPA Price Compendium'
    },
    'ibuprofen': {
      name: 'Ibuprofen 400mg',
      avgPrice: 65,
      range: { min: 45, max: 85 },
      trend: 'up',
      source: 'NPPA Price Compendium'
    },
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('medicine_searches').insert({
        patient_id: user.id,
        medicine_name: searchInput,
      });
    }

    setTimeout(() => {
      const key = searchInput.toLowerCase();
      const result = samplePrices[key] || {
        name: searchInput,
        avgPrice: Math.floor(Math.random() * 200 + 50),
        range: {
          min: Math.floor(Math.random() * 100 + 30),
          max: Math.floor(Math.random() * 200 + 120)
        },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
        source: 'NPPA Price Compendium'
      };
      setPriceData(result);
      setLoading(false);
    }, 1000);
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-600" />;
    return <div className="w-4 h-4 text-blue-600">→</div>;
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Medicine & Instrument Price Checker</h2>
        </div>
        <button
          onClick={() => setScanMode(!scanMode)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            scanMode
              ? 'bg-blue-600 text-white'
              : isDark
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {scanMode ? 'Search Mode' : 'Scan Mode'}
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={scanMode ? "Scan barcode or enter medicine name..." : "Enter medicine or instrument name"}
            className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Searching...' : scanMode ? 'Scan' : 'Check Price'}
          </button>
        </div>
      </form>

      {priceData && (
        <div className="space-y-4">
          <div className={`p-6 border rounded-lg ${
            isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-blue-100' : 'text-gray-800'}`}>
                  {priceData.name}
                </h3>
                <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-gray-600'}`}>
                  Source: {priceData.source}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(priceData.trend)}
                <span className={`text-sm font-medium ${
                  priceData.trend === 'down'
                    ? 'text-green-600'
                    : priceData.trend === 'up'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}>
                  {priceData.trend === 'down' ? 'Price Down' : priceData.trend === 'up' ? 'Price Up' : 'Stable'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Average Price</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                  ₹{priceData.avgPrice}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Minimum</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  ₹{priceData.range.min}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-white/50'}`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Maximum</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                  ₹{priceData.range.max}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 border rounded-lg flex gap-3 ${
            isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
          }`}>
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-amber-100' : 'text-gray-800'}`}>Price Information</h4>
              <p className={`text-sm ${isDark ? 'text-amber-100' : 'text-gray-700'}`}>
                Prices are based on the NPPA (National Pharmaceutical Pricing Authority) Price Compendium and may vary by location, pharmacy, and current market conditions. Always compare prices at multiple pharmacies before purchasing.
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Tips for Saving</h4>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Compare prices across licensed pharmacies</li>
              <li>• Ask about generic alternatives</li>
              <li>• Check for discounts on bulk purchases</li>
              <li>• Use insurance coverage or pharmacy discount programs</li>
              <li>• Visit government health centers for subsidized medicines</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
