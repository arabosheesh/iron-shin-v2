import React, { useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        email: email,
        sessions: 0,
        rank: 'White Prajiat',
        role: 'student'
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6 w-full">
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Designate Email</label>
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
        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Create Key</label>
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
        CREATE ACCOUNT
      </button>
    </form>
  );
};

export default Register;