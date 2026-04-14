import React, { useState } from 'react';
// Add an extra '../' to jump out of 'components', out of 'assets', and into 'src'
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create a "Member Profile" in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: email,
        role: "member", // Default role
        joinedAt: new Date(),
        attendance: 0
      });

      alert("Welcome to the Camp, Warrior!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <form onSubmit={handleSignUp} className="bg-neutral-900 p-10 border-t-4 border-gym-red w-full max-w-md">
        <h2 className="text-4xl font-oswald text-white uppercase mb-8 italic">New Recruitment</h2>
        
        <input 
          type="text" placeholder="FULL NAME" 
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black border border-white/10 p-4 mb-4 text-white focus:border-gym-red outline-none" 
        />
        
        <input 
          type="email" placeholder="EMAIL ADDRESS" 
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black border border-white/10 p-4 mb-4 text-white focus:border-gym-red outline-none" 
        />
        
        <input 
          type="password" placeholder="PASSWORD" 
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black border border-white/10 p-4 mb-8 text-white focus:border-gym-red outline-none" 
        />

        <button type="submit" className="w-full bg-gym-red py-4 text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition">
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;