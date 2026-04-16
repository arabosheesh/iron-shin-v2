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
    <form onSubmit={handleRegister} className="space-y-4 w-full">
      <div className="space-y-1">
        <input
          type="email"
          placeholder="NEW FIGHTER EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black/60 border border-zinc-800 p-4 text-xs font-bold tracking-widest uppercase focus:border-yellow-500 focus:outline-none transition-all"
          required
        />
      </div>
      <div className="space-y-1">
        <input
          type="password"
          placeholder="CREATE ACCESS CODE"
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
        ESTABLISH PROFILE
      </button>
    </form>
  );
};

export default Register;