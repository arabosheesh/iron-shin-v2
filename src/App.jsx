import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";

// Components - Matching your sidebar casing exactly
import Register from './assets/components/Register';
import Login from './assets/components/Login';
import Contact from './assets/components/Contact';
import TrainerCard from './assets/components/Trainercard';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {user ? (
        <main>
          <nav className="p-4 bg-neutral-900 flex justify-between items-center border-b border-red-600">
            <span className="uppercase tracking-widest font-bold">Warrior: <span className="text-red-500">{user.email}</span></span>
            <button onClick={handleLogout} className="bg-red-600 px-4 py-1 hover:bg-white hover:text-black transition-all font-bold uppercase text-xs">LOGOUT</button>
          </nav>
          
          <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-5xl font-black italic uppercase mb-8">Fighter Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TrainerCard name="Kru Master" specialty="Muay Boran" bio="20+ years of teaching the art of 8 limbs." />
              <Contact />
            </div>
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-md">
            {showLogin ? <Login /> : <Register />}
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className="mt-6 w-full text-center text-gray-500 uppercase text-[10px] tracking-[0.3em] hover:text-red-500 transition-all"
            >
              {showLogin ? "Need an account? Register" : "Already a member? Login"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;