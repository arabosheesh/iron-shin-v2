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
    <form onSubmit={handleLogin} className="space-y-6 w-full">
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Fighter Identity</label>
        <input
          type="email"
          placeholder="EMAIL ADDRESS"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 p-4 text-xs font-bold tracking-widest uppercase focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-700"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Security Key</label>
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 p-4 text-xs font-bold tracking-widest uppercase focus:border-yellow-500 focus:outline-none transition-all placeholder:text-zinc-700"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-500 text-black py-4 font-black uppercase tracking-[0.3em] italic hover:bg-white transition-all mt-4"
      >
        ACCESS SYSTEM
      </button>
    </form>
  );
};

export default Login;