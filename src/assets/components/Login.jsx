import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleLogin = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Logged in:", userCredential.user);
        alert("Welcome back, Champ!");
      })
      .catch((error) => alert("Invalid credentials. Try again."));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="bg-neutral-900 p-10 border-t-4 border-gym-red w-full max-w-md shadow-2xl">
        <h2 className="text-4xl font-oswald text-white uppercase mb-2 italic font-black">Fighter Login</h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Enter the arena</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Email Address</label>
            <input 
              type="email" 
              placeholder="FIGHTER@GYM.COM" 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 text-white focus:border-gym-red outline-none transition-all font-bold"
              required
            />
          </div>
          
          <div>
            <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 text-white focus:border-gym-red outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gym-red py-4 text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all transform active:scale-95 mt-4"
          >
            Sign In
          </button>
        </form>
        
        <p className="text-center text-gray-600 text-[10px] uppercase mt-8 tracking-widest">
          Forgotten your wraps? <span className="text-gym-red cursor-pointer">Reset Password</span>
        </p>
      </div>
    </div>
  );
};

export default Login;