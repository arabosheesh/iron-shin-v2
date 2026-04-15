import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🥊 THE HYBRID LOGIC: Tag the new user as a 'student'
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "student",         // Differentiates them from you
        status: "Active",        // Default membership status
        rank: "White Prajiat",   // Starting rank
        sessions: 0,             // Zero sessions logged
        createdAt: new Date().toISOString()
      });

      console.log("New Fighter Recruited:", user.email);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    /* Glassmorphism Card matching the Login style */
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 shadow-2xl rounded-sm w-full transition-all relative overflow-hidden">
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>

      <div className="mb-8">
        <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter">
          Recruitment <span className="text-red-600">Form</span>
        </h3>
        <p className="text-gray-500 text-[9px] uppercase tracking-[0.4em] mt-1">Initialize Fighter Profile</p>
      </div>
      
      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 block">
            Email Address
          </label>
          <input 
            type="email" 
            placeholder="NAME@IRONSHIN.COM" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/60 border border-white/5 p-4 text-white focus:border-red-600 outline-none transition-all font-bold placeholder:text-white/10"
            required
          />
        </div>
        
        <div>
          <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 block">
            Access Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/60 border border-white/5 p-4 text-white focus:border-red-600 outline-none transition-all placeholder:text-white/10"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-red-600 py-4 text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all transform active:scale-95 mt-4 shadow-lg shadow-red-900/20"
        >
          JOIN THE DOJO
        </button>
      </form>
    </div>
  );
};

export default Register;