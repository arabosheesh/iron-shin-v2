import React from 'react';
import { Shield } from 'lucide-react';

const TrainerCard = ({ name, specialty, bio, image }) => {
  return (
    <div className="bg-neutral-900 border border-white/5 overflow-hidden group hover:border-gym-red transition-all">
      <div className="h-64 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-gym-gold mb-2">
          <Shield size={16} />
          <span className="text-[10px] uppercase font-black tracking-widest">Certified Kru</span>
        </div>
        <h4 className="text-2xl font-oswald uppercase leading-none mb-1">{name}</h4>
        <p className="text-gym-red text-xs font-bold uppercase mb-4">{specialty}</p>
        <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>
        <button className="mt-6 w-full border border-white/20 py-2 text-xs font-bold uppercase hover:bg-white hover:text-black transition">
          View Fight Record
        </button>
      </div>
    </div>
  );
};

export default TrainerCard;