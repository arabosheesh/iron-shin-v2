import React, { useEffect, useState } from 'react';
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const AdminInbox = () => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const querySnapshot = await getDocs(collection(db, "leads"));
      const data = querySnapshot.docs.map(doc => doc.data());
      setLeads(data);
    };
    fetchLeads();
  }, []);

  return (
    <div className="p-8 bg-neutral-900 min-h-screen text-white">
      <h2 className="text-3xl font-oswald mb-6">New Member Inquiries</h2>
      <div className="space-y-4">
        {leads.map((lead, i) => (
          <div key={i} className="border-l-4 border-gym-gold bg-black p-4">
            <p className="font-bold">{lead.name} <span className="text-gray-500 text-xs">— {lead.email}</span></p>
            <p className="text-gray-400 mt-2 italic">"{lead.message}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};