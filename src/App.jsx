import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, increment, collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Target, Trophy, Activity, Clock, 
  Users, DollarSign, Settings, Zap, ChevronRight 
} from "lucide-react";

// Components
import Login from './assets/components/Login';
import Register from './assets/components/Register';

// --- 🥋 RANK BADGE SYSTEM ---
const RankBadge = ({ rank }) => {
  const tiers = {
    "White Prajiat": { color: "border-zinc-500 text-zinc-500", label: "NOVICE" },
    "Blue Prajiat": { color: "border-blue-500 text-blue-500", label: "WARRIOR" },
    "Red Prajiat": { color: "border-red-600 text-red-600", label: "ELITE" },
    "Black Prajiat": { color: "border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]", label: "MASTER" }
  };
  const current = tiers[rank] || tiers["White Prajiat"];
  return (
    <div className={`flex items-center gap-2 px-3 py-1 border-2 font-black italic uppercase text-[10px] tracking-tighter ${current.color}`}>
      <Target size={12} /> {rank}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ sessions: 0, rank: 'White Prajiat', status: 'Active', role: 'student' });
  const [fighters, setFighters] = useState([]); 
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔑 THE ADMIN CHECK
  // We check both the hardcoded email AND the database role for double security
  const isAdmin = user?.email === "alwahaibishahin171@gmail.com" || userData.role === "admin";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          
          // If the logged in user is Admin, fetch the full roster
          if (data.role === "admin" || currentUser.email === "alwahaibishahin171@gmail.com") {
            const fSnap = await getDocs(collection(db, "users"));
            setFighters(fSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const logTraining = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const nextSessions = (userData.sessions || 0) + 1;
    
    let nextRank = userData.rank;
    if (nextSessions >= 10 && nextSessions < 30) nextRank = "Blue Prajiat";
    if (nextSessions >= 30 && nextSessions < 50) nextRank = "Red Prajiat";
    if (nextSessions >= 50) nextRank = "Black Prajiat";

    await updateDoc(userRef, { 
      sessions: increment(1),
      rank: nextRank 
    });
    setUserData(prev => ({ ...prev, sessions: nextSessions, rank: nextRank }));
  };

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center text-red-600 font-black tracking-[0.5em] italic animate-pulse">
      INITIALIZING IRON SHIN...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-600">
      <AnimatePresence mode="wait">
        {!user ? (
          /* --- AUTHENTICATION GATEWAY --- */
          <motion.div 
            key="auth" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center p-6 bg-[url('https://wallpaperaccess.com/full/512564.jpg')] bg-cover bg-center bg-no-repeat"
            style={{ boxShadow: "inset 0 0 0 2000px rgba(0,0,0,0.85)" }}
          >
            <div className="w-full max-w-md text-center">
              <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-10">IRON <span className="text-red-600">SHIN</span></h1>
              
              {/* FIXED TOGGLE LOGIC */}
              <div className="mb-6">
                {showLogin ? <Login /> : <Register />}
              </div>

              <button 
                onClick={() => setShowLogin(!showLogin)} 
                className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] hover:text-red-600 transition-all font-bold italic underline underline-offset-8"
              >
                {showLogin ? "Establish New Profile" : "Return to Login"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- THE HYBRID DASHBOARD --- */
          <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen">
            
            <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-xl p-4 flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">IRON <span className="text-red-600">SHIN</span></h2>
                <div className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'}`}>
                  {isAdmin ? "MASTER / KRU" : "Fighter"}
                </div>
              </div>
              <button onClick={() => signOut(auth)} className="bg-zinc-900 p-2 hover:bg-red-600 transition-all border border-zinc-800">
                <LogOut size={18} />
              </button>
            </nav>

            <main className="flex-1 overflow-y-auto p-6 lg:p-10">
              <div className="max-w-7xl mx-auto space-y-10">
                
                {/* ADMIN COMMANDS */}
                {isAdmin && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-red-600 p-6 shadow-2xl">
                      <DollarSign className="mb-2" />
                      <p className="text-[10px] uppercase font-black opacity-70 tracking-widest">Revenue Forecast</p>
                      <p className="text-4xl font-black italic">$14,500</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-6">
                      <Users className="text-red-600 mb-2" />
                      <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Registered Fighters</p>
                      <p className="text-4xl font-black italic">{fighters.length}</p>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-center border-dashed opacity-50">
                      <Settings size={20} />
                      <p className="text-[10px] uppercase font-black mt-2">Dojo Configuration Locked</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* LEFT: USER PROFILE */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 backdrop-blur-md relative overflow-hidden">
                      <RankBadge rank={userData.rank} />
                      <h3 className="text-5xl font-black uppercase italic tracking-tighter mt-4 leading-none">{user.email.split('@')[0]}</h3>
                      
                      <div className="mt-8 space-y-6">
                        <div className="bg-black p-5 border-l-4 border-red-600">
                          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Combat Experience</p>
                          <p className="text-4xl font-black italic">{userData.sessions} Sessions</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[9px] uppercase font-black text-zinc-500 tracking-widest">
                            <span>Rank Progress</span>
                            <span>{userData.sessions} / 50</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(userData.sessions / 50) * 100}%` }} className="h-full bg-red-600" />
                          </div>
                        </div>
                        <button onClick={logTraining} className="w-full bg-white text-black py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                          <Zap size={18} /> Log Training
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: DATA TABLE OR SCHEDULE */}
                  <div className="lg:col-span-8">
                    {isAdmin ? (
                      <div className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                        <div className="p-4 border-b border-zinc-800 bg-black/40">
                          <h4 className="text-xs font-black uppercase tracking-widest italic">Fighter Database</h4>
                        </div>
                        <table className="w-full text-left text-xs">
                          <tbody className="divide-y divide-zinc-800">
                            {fighters.map(f => (
                              <tr key={f.id} className="hover:bg-red-600/5 transition-colors">
                                <td className="p-4 font-bold italic">{f.email}</td>
                                <td className="p-4 uppercase text-zinc-500 font-black">{f.rank}</td>
                                <td className="p-4 text-right text-red-600 font-black cursor-pointer uppercase hover:text-white">Manage</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-zinc-900/50 border border-zinc-800 p-8 backdrop-blur-md">
                        <h4 className="text-xl font-black italic uppercase mb-8 flex items-center gap-2">
                          <Clock className="text-red-600" size={20} /> Daily Intel
                        </h4>
                        <div className="space-y-4">
                          {['Muay Thai Basics', 'Advanced Striking', 'Sparring'].map((c, i) => (
                            <div key={i} className="flex justify-between items-center p-5 bg-black/50 border border-zinc-800 hover:border-red-600 transition-all">
                              <span className="font-black uppercase tracking-widest text-sm">{c}</span>
                              <span className="font-mono text-red-600 font-bold">18:{30 + (i*15)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;