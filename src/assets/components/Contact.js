import React, { useState } from 'react';
import { db } from '../../firebaseConfig'; // Import the database
import { collection, addDoc } from "firebase/firestore"; 

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      // This line pushes the data to a "leads" folder in your database
      await addDoc(collection(db, "leads"), {
        ...formData,
        timestamp: new Date()
      });
      setStatus('Message Sent! We will call you soon.');
      setFormData({ name: '', email: '', message: '' }); // Clear the form
    } catch (error) {
      setStatus('Error sending message. Try again.');
    }
  };

  return (
    <section className="bg-black py-20 px-8 border-t border-white/5">
      {/* ... (previous UI code) ... */}
      <form onSubmit={handleSubmit} className="bg-neutral-900 p-8 border-t-4 border-gym-red">
        <input 
          type="text" 
          placeholder="NAME" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-black border border-white/10 p-4 mb-4 text-sm focus:border-gym-red outline-none" 
          required
        />
        <input 
          type="email" 
          placeholder="EMAIL" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full bg-black border border-white/10 p-4 mb-4 text-sm focus:border-gym-red outline-none" 
          required
        />
        <textarea 
          placeholder="YOUR MESSAGE" 
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full bg-black border border-white/10 p-4 mb-6 text-sm focus:border-gym-red outline-none"
        ></textarea>
        
        <button type="submit" className="w-full bg-gym-red py-4 font-black uppercase hover:bg-white hover:text-black transition">
          {status || "Send Message"}
        </button>
      </form>
    </section>
  );
};