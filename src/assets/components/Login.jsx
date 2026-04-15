import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
      })
      .catch((error) => {
        console.error(error);
        alert("Invalid credentials. Keep your guard up and try again.");
      });
  };

  return (
    /* THE FIX: 
       1. Removed 'min-h-screen' so it doesn't fight with App.jsx.
       2. Used 'bg-black/40' and 'backdrop-blur-xl' for that transparent glass look.
       3. Added 'w-full' to ensure it fills the max-width container in App.jsx.
    */
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 shadow-2xl rounded-sm w-full transition-all">
      <h3 className="text-white text-3xl font-black italic uppercase mb-2 tracking-tighter">
        Sign <span className="text-red-600">In</span>
      </h3>
      <p className="text-gray-500 text-[9px] uppercase tracking-[0.4em] mb-8">Verification Required</p>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2 block">
            Fighter Email
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
            Security Key
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
          Enter Arena
        </button>
      </form>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
        <span className="text-gray-600 text-[9px] uppercase tracking-widest hover:text-red-500 cursor-pointer transition-colors">
          Forgot Credentials?
        </span>
      </div>
    </div>
  );
};

export default Login;