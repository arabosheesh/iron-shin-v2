import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
// ... imports

const Login = () => {
  // ... your login logic (handleLogin function)
  
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 shadow-2xl rounded-sm">
      <h3 className="text-white text-2xl font-black italic uppercase mb-6 tracking-tight">Sign In</h3>
      {/* Your Form Inputs here */}
    </div>
  );
};