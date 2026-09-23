import { useAuth } from './contexts/AuthContext';
import { Homepage } from './components/Homepage';
import { Dashboard } from './components/Dashboard';
import { LarryChat } from './components/LarryChat';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? <Dashboard /> : <Homepage />}
      <LarryChat />
    </>
  );
}

export default App;
