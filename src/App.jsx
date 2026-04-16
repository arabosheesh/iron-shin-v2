import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, increment, collection, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Target, Trophy, Activity, Clock, 
  Users, DollarSign, Settings, Zap, ChevronRight, Save, Edit3
} from "lucide-react";

import Login from './assets/components/Login';
import Register from './assets/components/Register';

const RankBadge = ({ rank }) => {
  const tiers = {
    "White Prajiat": { color: "border-zinc-500 text-zinc-500" },
    "Blue Prajiat": { color: "border-blue-500 text-blue-500" },
    "Red Prajiat": { color: "border-red-600 text-red-600" },
    "Black Prajiat": { color: "border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]" }
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
  const [userData, setUserData] = useState({ sessions: 0, rank: 'White Prajiat', role: 'student' });
  const [fighters, setFighters] = useState([]);
  const [gymSettings, setGymSettings] = useState({ schedule: [], announcement: "" });
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
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
        onSnapshot(doc(db, "gym", "settings"), (doc) => {
          if (doc.exists()) setGymSettings(doc.data());
        });
        if (currentUser.email === "alwahaibishahin171@gmail.com") {
          onSnapshot(collection(db, "users"), (snapshot) => {
            setFighters(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
          });
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logTraining = async () => {
    const userRef = doc(db, "users", user.uid);
    const nextSessions = (userData.sessions || 0) + 1;
    let nextRank = userData.rank;
    
    if (nextSessions >= 50) nextRank = "Black Prajiat";
    else if (nextSessions >= 30) nextRank = "Red Prajiat";
    else if (nextSessions >= 10) nextRank = "Blue Prajiat";

    await updateDoc(userRef, { sessions: increment(1), rank: nextRank });
  };

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-red-600 font-black tracking-[.5em] animate-pulse italic">INITIALIZING DOJO...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-600 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!user ? (
          /* --- ARENA SIGN IN SCREEN --- */
          <motion.div 
            key="auth" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="relative h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden"
          >
            {/* BACKGROUND LAYER: Filers only applied here */}
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url('https://wallpaperaccess.com/full/512564.jpg')`, 
                filter: "grayscale(1) brightness(0.35)",
              }}
            />
            
            {/* DARK OVERLAY FOR READABILITY */}
            <div className="absolute inset-0 z-10 bg-black/40 shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />

            {/* CONTENT LAYER: Isolated from background filters */}
            <div className="relative z-20 w-full max-w-[400px] flex flex-col items-center">
              <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-10 text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.7)]">
                IRON <span className="text-red-600">SHIN</span>
              </h1>
              
              <div className="w-full">
                {showLogin ? <Login /> : <Register />}
              </div>

              <button 
                onClick={() => setShowLogin(!showLogin)} 
                className="mt-8 text-[10px] text-zinc-400 uppercase tracking-widest font-bold italic underline hover:text-red-600 transition-colors"
              >
                {showLogin ? "// Establish Profile" : "// Return to Arena Login"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* --- DASHBOARD --- */
          <motion.div key="system" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col min-h-screen">
            <nav className="border-b border-zinc-800 bg-black/80 backdrop-blur-xl p-4 flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">IRON <span className="text-red-600">SHIN</span></h2>
                <div className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'bg-zinc-800 text-zinc-400'}`}>
                  {isAdmin ? "MASTER / KRU" : "Fighter"}
                </div>
              </div>
              <button onClick={() => signOut(auth)} className="bg-zinc-900 p-2 hover:bg-red-600 transition-all border border-zinc-800"><LogOut size={18} /></button>
            </nav>

            <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-10">
              {isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-red-600 p-6 shadow-2xl relative group overflow-hidden">
                    <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
                    <p className="text-[10px] uppercase font-black opacity-70 mb-1 tracking-widest">Revenue Forecast</p>
                    <p className="text-4xl font-black italic tracking-tighter">$14,500</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-6">
                    <Users className="text-red-600 mb-2" />
                    <p className="text-[10px] uppercase font-black text-zinc-500 mb-1 tracking-widest">Fighter Roster</p>
                    <p className="text-4xl font-black italic tracking-tighter">{fighters.length}</p>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-6 group cursor-pointer hover:border-red-600 transition-all">
                    <Settings className="text-zinc-600 group-hover:rotate-90 transition-transform duration-500" />
                    <p className="text-[10px] uppercase font-black text-zinc-500 mt-2 tracking-widest">Dojo Config</p>
                    <p className="text-lg font-black italic uppercase tracking-widest">Unlocked</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
                    <RankBadge rank={userData.rank} />
                    <h3 className="text-4xl font-black uppercase italic tracking-tighter mt-4 break-words leading-none">{user.email.split('@')[0]}</h3>
                    <div className="mt-8 space-y-6">
                      <div className="bg-black p-5 border-l-4 border-red-600 shadow-xl relative overflow-hidden group">
                        <Trophy className="absolute -right-4 -bottom-4 w-16 h-16 text-zinc-900 group-hover:text-zinc-800 transition-colors" />
                        <p className="text-[10px] text-zinc-500 uppercase font-black mb-1 tracking-widest">Experience</p>
                        <p className="text-4xl font-black italic tracking-tighter relative z-10">{userData.sessions} <span className="text-sm opacity-30 tracking-widest uppercase font-bold italic">Sessions</span></p>
                      </div>
                      <button onClick={logTraining} className="w-full bg-white text-black py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 italic">
                        <Zap size={18} fill="currentColor" /> Log Training
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="bg-zinc-900 border border-zinc-800 p-8 h-full shadow-2xl">
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                      <h4 className="text-2xl font-black italic uppercase flex items-center gap-2 tracking-tighter"><Clock size={22} className="text-red-600" /> Daily Intel</h4>
                      {isAdmin && (
                        <button onClick={() => setIsEditingSchedule(!isEditingSchedule)} className="text-xs font-black text-zinc-500 hover:text-white flex items-center gap-2 uppercase tracking-widest">
                          <Edit3 size={14}/> {isEditingSchedule ? "Cancel" : "Modify Intel"}
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {(gymSettings.schedule && gymSettings.schedule.length > 0 ? gymSettings.schedule : ['No Intel Available']).map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-5 bg-black border border-zinc-800 group hover:bg-zinc-900 transition-colors">
                          <span className="font-black uppercase tracking-widest text-sm italic">{item}</span>
                          <span className="font-mono text-red-600 font-bold bg-red-600/10 px-2 py-1 italic border border-red-600/20">LIVE DATA</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FIGHTER ROSTER TABLE FOR ADMINS */}
              {isAdmin && (
                <div className="bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl">
                  <div className="p-4 bg-black/40 border-b border-zinc-800 italic"><h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Fighter Database // Registry</h4></div>
                  <table className="w-full text-left text-xs uppercase font-bold tracking-tight">
                    <tbody className="divide-y divide-zinc-800">
                      {fighters.map(f => (
                        <tr key={f.id} className="hover:bg-red-600/5 transition-colors group">
                          <td className="p-4 italic font-black group-hover:text-red-500">{f.email}</td>
                          <td className="p-4 text-zinc-500">{f.rank || 'White Prajiat'}</td>
                          <td className="p-4 text-right text-red-600 hover:text-white cursor-pointer italic font-black">Manage_System</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;