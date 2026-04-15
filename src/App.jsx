import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion"; // THE MOTION ENGINE
import { Pencil, LogOut, User, Target, Calendar, Trophy, Zap, Activity } from "lucide-react";

// Components
import Register from './assets/components/Register';
import Login from './assets/components/Login';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ sessions: 0, rank: 'Novice', streak: 0 });
  const [showLogin, setShowLogin] = useState(true);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          if (data.customBg) setBackgroundUrl(data.customBg);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // PRO FEATURE: ATTENDANCE & RANK LOGIC
  const logTraining = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    
    // Logic: If sessions > 10, rank up to "Warrior"
    const newSessions = (userData.sessions || 0) + 1;
    let newRank = userData.rank || 'Novice';
    if (newSessions >= 10) newRank = 'Warrior';
    if (newSessions >= 50) newRank = 'Elite';

    try {
      await updateDoc(userRef, {
        sessions: increment(1),
        rank: newRank,
        lastSession: new Date().toISOString()
      });
      setUserData(prev => ({ ...prev, sessions: newSessions, rank: newRank }));
      alert("SESSION LOGGED. OUSS!");
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-black italic">
      SYNCHRONIZING COMBAT DATA...
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 flex flex-col relative overflow-hidden"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.95)), url('${backgroundUrl || 'https://wallpaperaccess.com/full/512564.jpg'}')`,
        backgroundColor: '#000'
      }}
    >
      <AnimatePresence>
      {user ? (
        <motion.main 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="relative z-10 flex-1 flex flex-col"
        >
          {/* NAV BAR */}
          <nav className="p-4 bg-black/60 backdrop-blur-xl flex justify-between items-center border-b border-red-600/30">
            <motion.h1 whileHover={{ scale: 1.05 }} className="text-xl font-black italic text-white">
              IRON <span className="text-red-600">SHIN</span>
            </motion.h1>
            <button onClick={handleLogout} className="bg-red-600 p-2 hover:bg-white hover:text-black transition-all">
              <LogOut size={16} />
            </button>
          </nav>

          {/* BENTO GRID SYSTEM */}
          <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* 1. FIGHTER STATS (Framer Motion Entrance) */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 bg-white/5 border border-white/10 p-6 backdrop-blur-md"
            >
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1">Current Class: {userData.rank}</p>
              <h2 className="text-2xl font-black text-white italic uppercase mb-6">Operative</h2>
              
              <div className="space-y-4">
                <div className="bg-black/40 p-3 border-l-2 border-red-600">
                  <p className="text-[9px] text-gray-500 uppercase">Total Sessions</p>
                  <p className="text-2xl font-black text-white">{userData.sessions || 0}</p>
                </div>
                <button 
                  onClick={logTraining}
                  className="w-full bg-red-600 py-4 text-white font-black uppercase tracking-tighter hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  <Activity size={18} /> LOG SESSION
                </button>
              </div>
            </motion.div>

            {/* 2. LIVE INTEL (Schedule) */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 bg-black/40 border border-white/10 p-6 backdrop-blur-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white italic uppercase">Training Schedule</h2>
                <Calendar size={18} className="text-red-600" />
              </div>
              <div className="grid gap-3">
                {['Muay Thai', 'BJJ Fundamentals', 'No-Gi Sparring'].map((type, i) => (
                  <div key={i} className="flex justify-between p-4 bg-white/5 border border-white/5 hover:border-red-600/50 transition-colors">
                    <span className="text-sm font-bold text-white uppercase">{type}</span>
                    <span className="text-xs text-red-500 font-mono">18:00</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 3. TROPHY ROOM (Leaderboard) */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="md:col-span-1 bg-white/5 border border-white/10 p-6 backdrop-blur-md"
            >
              <h2 className="text-xl font-black text-white italic uppercase mb-6 flex items-center gap-2">
                <Trophy size={18} className="text-yellow-500" /> Top Ranks
              </h2>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center justify-between">
                     <span className="text-xs font-bold text-white/40">#0{i}</span>
                     <span className="text-xs font-black text-white uppercase">User_{i}42</span>
                     <span className="text-[10px] text-red-500">{(4-i)*10} SESS</span>
                   </div>
                 ))}
              </div>
            </motion.div>

          </div>
        </motion.main>
      ) : (
        /* --- AUTH VIEW (Centered & Animated) --- */
        <motion.div 
          key="auth"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          className="flex-1 flex flex-col items-center justify-center p-6 relative z-10"
        >
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h2 className="text-6xl font-black italic text-white tracking-tighter uppercase leading-none mb-2">
                IRON <span className="text-red-600">SHIN</span>
              </h2>
              <div className="h-1 w-20 bg-red-600 mx-auto"></div>
            </div>
            {showLogin ? <Login /> : <Register />}
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className="mt-10 w-full text-center text-white/20 uppercase text-[10px] tracking-[0.5em] hover:text-red-600 transition-colors font-bold"
            >
              {showLogin ? "Establish New Profile" : "Existing Operative Sign-in"}
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default App;