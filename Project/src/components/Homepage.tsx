import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { supabase } from '../lib/supabase';

export function Homepage() {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const fetchPatientName = async () => {
      if (user) {
        const { data } = await supabase
          .from('patients')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setPatientName(data.full_name);
        }
      }
    };

    fetchPatientName();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/vc.png" alt="VigourCare Logo" className="w-12 h-12" />
          <h1 className="text-4xl font-bold text-gray-800">VigourCare</h1>
        </div>
        <p className="text-gray-600 text-lg">Your Health, Our Priority</p>
        {patientName && (
          <p className="text-blue-600 font-medium mt-3">Welcome, {patientName}</p>
        )}
      </div>

      {showLogin ? (
        <LoginForm onToggle={() => setShowLogin(false)} />
      ) : (
        <SignupForm onToggle={() => setShowLogin(true)} />
      )}

      <div className="mt-12 max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">Price Checking</h3>
          <p className="text-gray-600 text-sm">Fast medicine and instrument price comparison using NPPA data</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">Find Doctors</h3>
          <p className="text-gray-600 text-sm">Locate nearest specialists with timing and contact details</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-800 mb-2">Easy Access</h3>
          <p className="text-gray-600 text-sm">Simple interface designed for patients</p>
        </div>
      </div>
    </div>
  );
}
