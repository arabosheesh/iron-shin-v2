import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Components
import Register from './assets/components/Register';
import Login from './assets/components/Login';
import Contact from './assets/components/Contact';
import TrainerCard from './assets/components/Trainercard';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch the user's custom background from Firestore
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

  const saveBackground = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        customBg: backgroundUrl
      });
      alert("Gym Aesthetic Updated!");
    } catch (err) {
      console.error("Error saving background:", err);
      alert("Failed to save background.");
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">LOADING ARENA...</div>;

  return (
  <div 
  className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000"
  style={{ 
    backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('${backgroundUrl || 'https://wallpaperaccess.com/full/512564.jpg'}')`,
    backgroundColor: '#000'
  }}
>
      {user ? (
        <main className="relative z-10">
          <nav className="p-4 bg-black/40 backdrop-blur-md flex justify-between items-center border-b border-red-600/30">
            <span className="uppercase tracking-widest font-bold text-sm">
              Warrior: <span className="text-red-500">{user.email}</span>
            </span>
            <button onClick={handleLogout} className="bg-red-600 px-4 py-1 hover:bg-white hover:text-black transition-all font-bold uppercase text-xs">
              LOGOUT
            </button>
          </nav>
          
          <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-6xl font-black italic uppercase mb-8 tracking-tighter text-white">
              Fighter <span className="text-red-600">Dashboard</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TrainerCard name="Buakaw Banchamek" specialty="Muay Boran" bio="Expert in the art of eight limbs." />
              <Contact />
            </div>
          </div>

          {/* CUSTOMIZER TOOLBAR */}
          <div className="fixed bottom-6 right-6 bg-neutral-900/90 p-4 border-l-4 border-red-600 shadow-2xl backdrop-blur-lg">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-gray-400">Environment URL</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Paste Image URL..."
                className="bg-black border border-white/10 p-2 text-xs text-white outline-none focus:border-red-600 w-64"
                value={backgroundUrl}
                onChange={(e) => setBackgroundUrl(e.target.value)}
              />
              <button 
                onClick={saveBackground}
                className="bg-red-600 px-4 py-2 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
              >
                APPLY
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative z-10">
          <div className="w-full max-w-md">
            {showLogin ? <Login /> : <Register />}
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className="mt-6 w-full text-center text-gray-400 uppercase text-[10px] tracking-[0.3em] hover:text-red-500 transition-all"
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