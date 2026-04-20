import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, handleSupabaseError, ADMIN_TERMINAL_CODE } from '../lib/supabase';
import { ShieldCheck, ChevronRight, AlertCircle, Quote, LogIn, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOTIVATIONAL_QUOTES = [
  "Build Strength. Build Discipline.",
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Fitness is not about being better than someone else. It's about being better than you were yesterday.",
  "Don't stop when you're tired. Stop when you're done."
];

export default function LoginView() {
  const { setLoginCode, setIsAdmin, setIsStaff } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    const trimmedCode = code.trim();
    setLoading(true);
    setError('');

    try {
      // 1. Check Special Admin Code - Full Access
      if (trimmedCode === ADMIN_TERMINAL_CODE) {
        setIsAdmin(true);
        setIsStaff(false);
        setLoginCode(trimmedCode);
        navigate('/admin');
        return;
      }

      // 2. Check Staff Collection - Role Restricted Management
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('staffCode', trimmedCode)
        .single();

      if (staffData && !staffError) {
         setLoginCode(trimmedCode);
         setIsStaff(true);
         setIsAdmin(false);
         navigate('/admin'); 
         return;
      }

      // 3. Check Members Collection - Stats Dashboard
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('membershipCode', trimmedCode)
        .single();

      if (!memberData || memberError) {
        setError('Unauthorized code. Please contact the administrator.');
      } else {
        if (memberData.status === 'expired' || memberData.status === 'paused') {
          setError(`Your membership is ${memberData.status}. Please contact the owner.`);
        } else {
          setLoginCode(trimmedCode);
          setIsStaff(false);
          setIsAdmin(false);
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError('Connection error. Verify your database configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-6 flex flex-col items-center justify-center bg-bg relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-md space-y-12 relative z-10">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <h2 className="font-display text-5xl italic tracking-tighter text-text leading-none uppercase">
              The <span className="text-accent underline decoration-border/40 underline-offset-8">Spartan</span> Gym
            </h2>
          </div>
          <p className="text-text-dim font-display uppercase italic tracking-[0.3em] text-[10px]">Security Clearance Required</p>
        </header>

        <div className="gym-card bg-surface/50 backdrop-blur-xl border border-border p-10 shadow-2xl space-y-8 rounded-[2.5rem]">
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl uppercase italic tracking-tight text-text">Access Portal</h1>
            <p className="text-text-dim text-xs font-medium">Enter your unique passcode to enter the sanctuary.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="X X X X X X X"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-20 bg-bg border border-border rounded-[1.5rem] pl-16 pr-6 font-display text-2xl uppercase italic tracking-[0.4em] focus:outline-none focus:border-accent text-accent transition-all placeholder:tracking-normal placeholder:text-text-dim/20"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-5 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-xs font-bold uppercase tracking-tight"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-20 bg-accent text-bg rounded-[1.5rem] font-display uppercase italic text-xl tracking-[0.2em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-accent/40 disabled:opacity-50"
            >
              {loading ? 'Validating...' : 'Authorize Access'}
              <ChevronRight size={24} />
            </button>
          </form>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
           <Quote className="text-accent/20" size={32} />
           <p className="text-center text-text-dim font-medium italic text-xs max-w-[280px] leading-relaxed">
             "{MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]}"
           </p>
        </div>
      </div>
    </div>
  );
}
