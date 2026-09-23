import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

export function MedicineChecker() {
  const { isDark } = useTheme();
  const [medicineName, setMedicineName] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('medicine_searches').insert({
        patient_id: user.id,
        medicine_name: medicineName,
      });
    }

    setTimeout(() => {
      setSearchResult({
        medicine: medicineName,
        info: `Searching for CDSCO certification information for "${medicineName}"`,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-blue-600" />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Medicine Certification Checker</h2>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="Enter medicine name"
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
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {searchResult && (
        <div className="space-y-4">
          <div className={`p-4 border rounded-lg ${
            isDark ? 'bg-blue-900/20 border-blue-800 text-blue-100' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-100' : 'text-gray-800'}`}>Search Initiated</h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-blue-100' : 'text-gray-700'}`}>{searchResult.info}</p>
              </div>
            </div>
          </div>

          <div className={`p-4 border rounded-lg ${
            isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-amber-100' : 'text-gray-800'}`}>Verify Medicine Certification</h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-amber-100' : 'text-gray-700'}`}>
                  To verify if a medicine is certified by CDSCO (Central Drugs Standard Control Organization):
                </p>
                <ul className={`text-sm space-y-2 mb-4 ${isDark ? 'text-amber-100' : 'text-gray-700'}`}>
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-fit">1.</span>
                    <span>Check the medicine packaging for CDSCO approval number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-fit">2.</span>
                    <span>Look for manufacturing license number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-fit">3.</span>
                    <span>Verify batch number and expiry date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium min-w-fit">4.</span>
                    <span>Visit CDSCO official website for detailed verification</span>
                  </li>
                </ul>
                <a
                  href="https://cdsco.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 font-medium text-sm ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Visit CDSCO Official Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className={`p-4 border rounded-lg ${
            isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Safety Tips</h4>
            <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>• Always buy medicines from licensed pharmacies</li>
              <li>• Consult a doctor before taking any medication</li>
              <li>• Check for proper packaging and seals</li>
              <li>• Report suspicious medicines to CDSCO helpline</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
