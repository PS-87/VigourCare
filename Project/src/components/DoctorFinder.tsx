import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from '../contexts/LocationContext';
import { supabase } from '../lib/supabase';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  timings: string;
}

export function DoctorFinder() {
  const { isDark } = useTheme();
  const { userLocation } = useLocation();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name');

    if (!error && data) {
      setDoctors(data);
    }
    setLoading(false);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openGoogleMaps = (doctor: Doctor) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}${
      userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : ''
    }`;
    window.open(url, '_blank');
  };

  const filteredDoctors = doctors
    .filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((doctor) => ({
      ...doctor,
      distance: userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            Number(doctor.latitude),
            Number(doctor.longitude)
          )
        : null,
    }))
    .sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Find Doctors Near You</h2>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, specialization, or location..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      {loading ? (
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading doctors...</div>
      ) : (
        <div className="space-y-4">
          {filteredDoctors.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No doctors found</div>
          ) : (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`border rounded-lg p-5 hover:shadow-lg transition-shadow ${
                  isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                  </div>
                  {doctor.distance !== null && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {doctor.distance.toFixed(1)} km away
                    </span>
                  )}
                </div>

                <div className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <div className="flex items-start gap-2">
                    <MapPin className={`w-4 h-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className="text-sm">{doctor.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <a href={`tel:${doctor.phone}`} className={`text-sm ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>
                      {doctor.phone}
                    </a>
                  </div>

                  {doctor.email && (
                    <div className="flex items-center gap-2">
                      <Mail className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <a href={`mailto:${doctor.email}`} className={`text-sm ${isDark ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>
                        {doctor.email}
                      </a>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Clock className={`w-4 h-4 mt-1 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className="text-sm">{doctor.timings}</span>
                  </div>
                </div>

                <button
                  onClick={() => openGoogleMaps(doctor)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
