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
        alert("Invalid credentials. Try again, Champ.");
      });
  };

  return (
    /* THE FIX: Changed from bg-black to bg-black/40 + backdrop-blur to show your background */
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 shadow-2xl rounded-sm w-full">
      <h2 className="text-4xl font-black text-white uppercase mb-2 italic tracking-tighter">
        Fighter <span className="text-red-600">Login</span>
      </h2>
      <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] mb-8">Enter the arena</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Email Address</label>
          <input 
            type="email" 
            placeholder="FIGHTER@GYM.COM" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/60 border border-white/10 p-4 text-white focus:border-red-600 outline-none transition-all font-bold"
            required
          />
        </div>
        
        <div>
          <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/60 border border-white/10 p-4 text-white focus:border-red-600 outline-none transition-all"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-red-600 py-4 text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all transform active:scale-95 mt-4"
        >
          Sign In
        </button>
      </form>
      
      <p className="text-center text-gray-600 text-[10px] uppercase mt-8 tracking-widest">
        Forgotten your wraps? <span className="text-red-600 cursor-pointer hover:text-white transition-colors">Reset Password</span>
      </p>
    </div>
  );
};

export default Login;