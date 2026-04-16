import React, { useState } from 'react';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full">
      <div className="space-y-1">
        <input
          type="email"
          placeholder="FIGHTER EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black/60 border border-zinc-800 p-4 text-xs font-bold tracking-widest uppercase focus:border-yellow-500 focus:outline-none transition-all"
          required
        />
      </div>
      <div className="space-y-1">
        <input
          type="password"
          placeholder="ACCESS CODE"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/60 border border-zinc-800 p-4 text-xs font-bold tracking-widest uppercase focus:border-yellow-500 focus:outline-none transition-all"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-500 text-black py-4 font-black uppercase tracking-[0.3em] italic hover:bg-white transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)]"
      >
        ENTER ARENA
      </button>
    </form>
  );
};

export default Login;