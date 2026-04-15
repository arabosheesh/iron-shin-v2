import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, updateDoc, increment, collection, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Users, DollarSign, Settings, Zap, 
  Clock, Shield, ChevronRight, Activity, Terminal
} from "lucide-react";

// YOUR EXISTING COMPONENTS
import Login from './assets/components/Login';
import Register from './assets/components/Register';

const HUDCorner = () => (
  <div className="absolute inset-0 pointer-events-none border border-white/5">
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-600/50" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-600/50" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-600/50" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-600/50" />
  </div>
);

const RankBadge = ({ rank }) => {
  const tiers = {
    "White Prajiat": "text-zinc-500 border-zinc-800",
    "Blue Prajiat": "text-blue-500 border-blue-900 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    "Red Prajiat": "text-red-600 border-red-900 shadow-[0_0_10px_rgba(220,38,38,0.2)]",
    "Black Prajiat": "text-yellow-500 border-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
  };
  return (
    <div className={`px-3 py-1 border bg-black/40 backdrop-blur-md uppercase text-[10px] font-black tracking-[.2em] italic ${tiers[rank] || tiers["White Prajiat"]}`}>
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
        onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          if (doc.exists()) setUserData(doc.data());
        });
        if (currentUser.email === "alwahaibishahin171@gmail.com" || userData.role === 'admin') {
          onSnapshot(collection(db, "users"), (snapshot) => {
            setFighters(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, userData.role]);

  const logTraining = async () => {
    const userRef = doc(db, "users", user.uid);
    const nextSessions = (userData.sessions || 0) + 1;
    let nextRank = userData.rank;
    if (nextSessions >= 10 && nextSessions < 30) nextRank = "Blue Prajiat";
    else if (nextSessions >= 30 && nextSessions < 50) nextRank = "Red Prajiat";
    else if (nextSessions >= 50) nextRank = "Black Prajiat";
    await updateDoc(userRef, { sessions: increment(1), rank: nextRank });
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center"><Activity className="text-red-600 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-red-600 selection:text-white">
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale opacity-30 scale-105 transition-all duration-700"
              style={{ backgroundImage: `url('/assets/ring-bg.jpg')` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            
            <div className="w-full max-w-md bg-zinc-950/90 border border-white/5 p-10 relative z-10 backdrop-blur-sm shadow-2xl">
              <HUDCorner />
              <div className="text-center relative z-10">
                <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-2">IRON <span className="text-red-600">SHIN</span></h1>
                <div className="h-[2px] w-12 bg-red-600 mx-auto mb-10" />
                
                {showLogin ? <Login /> : <Register />}
                
                <button onClick={() => setShowLogin(!showLogin)} className="mt-8 text-[10px] text-zinc-500 uppercase tracking-widest font-black hover:text-red-500 transition-colors block w-full">
                  {showLogin ? "// ESTABLISH NEW PROFILE" : "// RETURN TO UPLINK"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen">
             <nav className="h-16 border-b border-white/5 bg-black/60 backdrop-blur-xl px-6 flex justify-between items-center sticky top-0 z-[110]">
              <div className="flex items-center gap-6">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">IRON <span className="text-red-600">SHIN</span></h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-white/5 rounded-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-red-600 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{isAdmin ? "KRU_MASTER" : "OPERATIVE_ACTIVE"}</span>
                </div>
              </div>
              <button onClick={() => signOut(auth)} className="p-2 hover:bg-red-600 transition-colors rounded-sm group">
                <LogOut size={18} className="text-zinc-500 group-hover:text-white" />
              </button>
            </nav>

            <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full space-y-8">
              {isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 bg-red-600 border border-red-500 p-6 relative group overflow-hidden">
                    <DollarSign className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20" />
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/70 mb-1 flex items-center gap-2">Revenue Forecast</p>
                    <p className="text-5xl font-black italic tracking-tighter">$14,500</p>
                  </div>
                  <div className="bg-zinc-900/40 border border-white/5 p-6 backdrop-blur-md">
                    <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1">Registered Fighters</p>
                    <p className="text-5xl font-black italic tracking-tighter">{fighters.length}</p>
                  </div>
                  <div className="bg-zinc-900/20 border border-white/5 p-6 flex items-center justify-between opacity-40">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-zinc-700">Dojo Config</p>
                      <p className="text-xl font-black italic uppercase tracking-tighter text-zinc-600">LOCKED</p>
                    </div>
                    <Settings className="text-zinc-800" size={32} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="bg-zinc-900/40 border border-white/5 p-8 backdrop-blur-md relative overflow-hidden group shadow-2xl">
                    <HUDCorner />
                    <RankBadge rank={userData.rank} />
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter mt-6 leading-none">
                      {user.email.split('@')[0]}
                    </h3>
                    <div className="mt-10 space-y-8">
                      <div className="bg-black/50 p-6 border-l-4 border-red-600 shadow-xl">
                        <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1">Combat Experience</p>
                        <p className="text-5xl font-black italic tracking-tighter">{userData.sessions} <span className="text-xs not-italic text-zinc-700 uppercase">Sessions</span></p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[9px] uppercase font-black text-zinc-600">
                          <span className="tracking-[0.2em]">Rank Progress</span>
                          <span className="text-white">{userData.sessions} / 50</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((userData.sessions / 50) * 100, 100)}%` }} className="h-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                        </div>
                      </div>
                      <button onClick={logTraining} className="w-full bg-white text-black py-5 font-black uppercase tracking-[.3em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 italic">
                        <Zap size={18} fill="currentColor" /> Log Training
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="bg-zinc-950/50 border border-white/5 h-full relative overflow-hidden p-6 shadow-2xl">
                    <h4 className="text-xs font-black uppercase tracking-[.3em] italic text-zinc-400 mb-6 flex items-center gap-2">
                       <Terminal size={14} className="text-red-600" />
                       {isAdmin ? "Global Fighter Registry" : "Daily Training Intel"}
                    </h4>
                    <div className="space-y-2">
                      {isAdmin ? (
                        fighters.map(f => (
                          <div key={f.id} className="p-4 bg-zinc-900/20 border border-white/5 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors">
                            <div>
                              <p className="text-sm font-black uppercase tracking-tight text-zinc-400 group-hover:text-white">{f.email}</p>
                              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{f.rank || 'White Prajiat'}</p>
                            </div>
                            <button className="text-red-600 text-[10px] font-black uppercase tracking-widest hover:underline">Manage</button>
                          </div>
                        ))
                      ) : (
                        ['MUAY THAI BASICS', 'ADVANCED STRIKING', 'SPARRING'].map((c, i) => (
                          <div key={i} className="p-6 bg-black border border-white/5 flex justify-between items-center relative overflow-hidden group">
                             <div className="absolute inset-y-0 left-0 w-1 bg-red-600/0 group-hover:bg-red-600 transition-all" />
                             <span className="font-black uppercase tracking-widest text-sm relative z-10">{c}</span>
                             <span className="font-mono text-red-600 font-black bg-red-600/10 px-3 py-1 border border-red-600/20">18:{30 + (i*15)}</span>
                          </div>
                        ))
                      )}
                    </div>
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