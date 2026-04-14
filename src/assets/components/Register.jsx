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

  // Inside Register.jsx
return (
  <div className="bg-black/20 backdrop-blur-xl border border-white/10 p-10 shadow-2xl">
    <h2 className="text-white text-3xl font-black italic uppercase mb-6">New Recruitment</h2>
    {/* ... rest of your form ... */}
  </div>
);
};

export default Register;