import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";

// Components - Matching your sidebar casing exactly
import Register from './assets/components/Register.jsx';
import Login from './assets/components/Login.jsx';
import Contact from './assets/components/Contact.jsx';
import TrainerCard from './assets/components/Trainercard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false); // Toggle between Login and Register

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  return (
    <div className="min-h-screen bg-black text-white">
      {user ? (
        <main>
          {/* LOGGED IN VIEW */}
          <nav className="p-4 bg-neutral-900 flex justify-between items-center border-b border-gym-red">
            <span className="font-oswald uppercase tracking-widest">Warrior: <span className="text-gym-red">{user.email}</span></span>
            <button onClick={handleLogout} className="text-white bg-gym-red px-4 py-1 hover:bg-white hover:text-black transition-all font-bold uppercase text-xs">LOGOUT</button>
          </nav>
          
          <div className="p-8">
            <h1 className="text-4xl font-black italic uppercase mb-8">Fighter Dashboard</h1>
            <TrainerCard />
            <div className="mt-12">
              <Contact />
            </div>
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* NOT LOGGED IN VIEW */}
          {showLogin ? <Login /> : <Register />}
          
          <button 
            onClick={() => setShowLogin(!showLogin)}
            className="mt-6 text-gray-500 uppercase text-[10px] tracking-[0.3em] hover:text-gym-red transition-all"
          >
            {showLogin ? "Need an account? Register" : "Already a member? Login"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;