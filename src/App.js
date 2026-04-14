import React, { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from "firebase/auth";

// ... other imports
import Register from './assets/components/Register';
// If you want to show other parts of your gym too:
import Login from './assets/components/Login';
import Contact from './assets/components/Contact';
import TrainerCard from './assets/components/Trainercard';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // This "listener" checks if a user is logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  return (
    <div>
      {user ? (
        <>
          {/* Show this if logged in */}
          <nav className="p-4 bg-neutral-900 flex justify-between">
            <span>Welcome, {user.email}</span>
            <button onClick={handleLogout} className="text-gym-red font-bold">LOGOUT</button>
          </nav>
          {/* Insert your Dashboard component here */}
        </>
      ) : (
        <>
          {/* Show landing page / Register if NOT logged in */}
          <Register /> 
        </>
      )}
    </div>
  );
}