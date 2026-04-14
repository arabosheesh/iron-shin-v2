import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Pencil, LogOut, User } from "lucide-react";

// Components
import Register from './assets/components/Register';
import Login from './assets/components/Login';
import Contact from './assets/components/Contact';
import TrainerCard from './assets/components/Trainercard';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // Default to login screen
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().customBg) {
          setBackgroundUrl(userSnap.data().customBg);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const changePhoto = async () => {
    const newUrl = prompt("Paste New Dojo Image URL:", backgroundUrl);
    if (newUrl !== null) {
      setBackgroundUrl(newUrl);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { customBg: newUrl });
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic tracking-widest">
      PREPARING THE ARENA...
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 flex flex-col"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('${backgroundUrl || 'https://wallpaperaccess.com/full/512564.jpg'}')`,
        backgroundColor: '#000'
      }}
    >
      {user ? (
        /* DASHBOARD VIEW (Logged In) */
        <main className="relative z-10 flex-1 flex flex-col">
          <nav className="p-4 bg-black/60 backdrop-blur-md flex justify-between items-center border-b border-red-600/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <User size={14} className="text-red-500" />
                <span className="uppercase tracking-tighter font-bold text-[10px] text-white">
                  {user.email}
                </span>
              </div>
              <button onClick={changePhoto} className="p-2 hover:bg-red-600 rounded-full transition-all group bg-white/5" title="Change Background">
                <Pencil size={14} className="text-white" />
              </button>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-600 px-4 py-2 hover:bg-white hover:text-black transition-all font-black uppercase text-[10px] text-white"
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </nav>
          
          <div className="p-8 max-w-6xl mx-auto w-full">
            <h1 className="text-7xl font-black italic uppercase mb-8 tracking-tighter text-white">
              IRON <span className="text-red-600">SHIN</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TrainerCard name="Buakaw Banchamek" specialty="Muay Boran" bio="The legendary fighter." />
              <Contact />
            </div>
          </div>
        </main>
      ) : (
        /* AUTH VIEW (Logged Out) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 bg-transparent">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
             <div className="text-center mb-8">
                <h2 className="text-5xl font-black italic text-white tracking-tighter uppercase">
                  IRON <span className="text-red-600">SHIN</span>
                </h2>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] mt-2">Dojo Management System</p>
             </div>

            {showLogin ? <Login /> : <Register />}
            
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className="mt-8 w-full text-center text-white/40 uppercase text-[10px] tracking-[0.4em] hover:text-red-500 transition-all font-bold"
            >
              {showLogin ? "Don't have an account? Sign Up" : "Already a member? Sign In"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;