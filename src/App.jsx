import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, increment, collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Target, Trophy, Activity, Clock, 
  Users, DollarSign, Settings, Zap, ChevronRight, Hash
} from "lucide-react";

// Components
import Login from './assets/components/Login';
import Register from './assets/components/Register';

const RankBadge = ({ rank }) => {
  const tiers = {
    "White Prajiat": { color: "border-zinc-500 text-zinc-500", glow: "shadow-none" },
    "Blue Prajiat": { color: "border-blue-500 text-blue-500", glow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]" },
    "Red Prajiat": { color: "border-red-600 text-red-600", glow: "shadow-[0_0_10px_rgba(220,38,38,0.3)]" },
    "Black Prajiat": { color: "border-yellow-500 text-yellow-500", glow: "shadow-[0_0_15px_rgba(234,179,8,0.4)]" }
  };
  const current = tiers[rank] || tiers["White Prajiat"];
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-0.5 border-l-4 bg-zinc-950/50 font-black italic uppercase text-[10px] tracking-[0.2em] ${current.color} ${current.glow}`}>
      {rank}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ sessions: 0, rank: 'White Prajiat', role: 'student' });
  const [fighters, setFighters] = useState([]); 
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);

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
    await updateDoc(userRef, { sessions: increment(1), rank: nextRank });
    setUserData(prev => ({ ...prev, sessions: nextSessions, rank: nextRank }));
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-red-600 font-black tracking-[1em] italic animate-pulse">SYSTEM_BOOT</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-600">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
             <div className="w-full max-w-md text-center z-10">
                <h1 className="text-8xl font-black italic tracking-tighter uppercase mb-2 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">IRON <span className="text-red-600">SHIN</span></h1>
                <p className="text-[10px] uppercase tracking-[1em] text-zinc-600 mb-10 ml-[1em]">Fight Intelligence System</p>
                {showLogin ? <Login /> : <Register />}
                <button onClick={() => setShowLogin(!showLogin)} className="mt-8 text-[10px] text-zinc-500 uppercase tracking-widest hover:text-red-500 transition-all font-bold italic">
                  {showLogin ? "// ESTABLISH NEW PROFILE" : "// RETURN TO UPLINK"}
                </button>
             </div>
          </motion.div>
        ) : (
          <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-screen">
            {/* TACTICAL NAV */}
            <nav className="border-b border-white/5 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-6">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">IRON <span className="text-red-600">SHIN</span></h2>
                <div className={`h-4 w-[1px] bg-zinc-800`}></div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-red-600 animate-ping' : 'bg-green-500'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{isAdmin ? "KRU MODE" : "OPERATIVE"}</span>
                </div>
              </div>
              <button onClick={() => signOut(auth)} className="group bg-zinc-900/50 p-2 hover:bg-red-600/20 border border-white/5 transition-all">
                <LogOut size={18} className="text-zinc-500 group-hover:text-red-600" />
              </button>
            </nav>

            <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
              <div className="max-w-7xl mx-auto space-y-12">
                
                {/* ADMIN COMMAND CENTER */}
                {isAdmin && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-red-600 to-red-900 p-8 relative group overflow-hidden border border-red-500/50">
                      <DollarSign className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform" />
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/60 mb-1">Financial Forecast</p>
                      <p className="text-5xl font-black italic tracking-tighter">$14,500</p>
                    </div>
                    <div className="bg-zinc-900/30 border border-white/5 p-8 backdrop-blur-sm">
                      <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">Roster Strength</p>
                      <p className="text-5xl font-black italic tracking-tighter">{fighters.length} <span className="text-sm text-zinc-700 not-italic">ACTV</span></p>
                    </div>
                    <div className="bg-zinc-900/30 border border-white/5 p-8 flex items-center justify-between opacity-40 grayscale group cursor-not-allowed">
                       <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">System Status</p>
                        <p className="text-xl font-black italic uppercase tracking-tighter text-zinc-400">Dojo Config Locked</p>
                       </div>
                       <Settings className="text-zinc-700" size={32} />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* OPERATIVE STATS CARD */}
                  <div className="lg:col-span-4">
                    <div className="bg-zinc-950 border border-white/10 p-1 relative group overflow-hidden">
                      <div className="bg-black p-8 border border-white/5 relative z-10">
                        <RankBadge rank={userData.rank} />
                        <h3 className="text-5xl font-black uppercase italic tracking-tighter mt-4 leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                          {user.email.split('@')[0]}
                        </h3>
                        
                        <div className="mt-10 space-y-8">
                          <div className="relative">
                            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                              <Hash size={12}/> Combat Data
                            </p>
                            <p className="text-6xl font-black italic tracking-tighter">{userData.sessions}<span className="text-sm text-zinc-600 not-italic ml-2 uppercase">Sess</span></p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-[10px] uppercase font-black text-zinc-600">
                              <span className="tracking-[0.2em]">Next Rank Protocol</span>
                              <span className="text-white">{userData.sessions} / 50</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-900">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((userData.sessions / 50) * 100, 100)}%` }} className="h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                            </div>
                          </div>

                          <button onClick={logTraining} className="w-full bg-white text-black py-5 font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 italic">
                            <Zap size={20} fill="currentColor" /> Log Training
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full"></div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: DATABASE OR INTEL */}
                  <div className="lg:col-span-8">
                    {isAdmin ? (
                      <div className="bg-zinc-950 border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] italic text-red-600">Fighter Intelligence Database</h4>
                          <Users size={16} className="text-zinc-700" />
                        </div>
                        <div className="divide-y divide-white/5">
                          {fighters.map(f => (
                            <div key={f.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all group">
                              <div>
                                <p className="text-sm font-black uppercase italic tracking-tight text-zinc-300 group-hover:text-white transition-colors">{f.email}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-1">{f.rank || 'White Prajiat'}</p>
                              </div>
                              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors">
                                View Profile <ChevronRight size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-950 border border-white/10 p-8 relative overflow-hidden">
                        <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-10 flex items-center gap-3">
                          <span className="w-8 h-[2px] bg-red-600"></span> Daily Intel
                        </h4>
                        <div className="grid gap-4">
                          {['Muay Thai Basics', 'Advanced Striking', 'Sparring'].map((c, i) => (
                            <div key={i} className="group p-6 bg-black border border-white/5 hover:border-red-600/50 transition-all flex justify-between items-center relative overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 to-red-600/0 group-hover:to-red-600/5 transition-all"></div>
                               <span className="font-black uppercase tracking-widest text-sm relative z-10">{c}</span>
                               <span className="font-mono text-red-600 font-bold bg-red-600/5 px-3 py-1 border border-red-600/20 relative z-10">18:{30 + (i*15)}</span>
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