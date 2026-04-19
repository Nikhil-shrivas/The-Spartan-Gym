import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, MemberData, StaffData, handleFirestoreError } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Shield, Sparkles, Clock, Calendar, LogOut, ChevronRight, MessageCircle, Activity } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { GYM_DETAILS } from '../constants';

export default function MemberDashboardView() {
  const { loginCode, setLoginCode, isStaff, setIsStaff } = useAuth();
  const [member, setMember] = useState<MemberData | null>(null);
  const [staffMember, setStaffMember] = useState<StaffData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginCode) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (isStaff) {
          const q = query(collection(db, 'staff'), where('staffCode', '==', loginCode));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setStaffMember({ id: snap.docs[0].id, ...snap.docs[0].data() } as StaffData);
          } else {
            setLoginCode(null);
            navigate('/login');
          }
        } else {
          const q = query(collection(db, 'members'), where('membershipCode', '==', loginCode));
          const snap = await getDocs(q);
          if (!snap.empty) {
            setMember({ id: snap.docs[0].id, ...snap.docs[0].data() } as MemberData);
          } else {
            setLoginCode(null);
            navigate('/login');
          }
        }
      } catch (err) {
        handleFirestoreError(err, 'get', isStaff ? 'staff' : 'members');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loginCode, isStaff]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-bg">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <div className="font-display text-2xl uppercase italic text-text animate-pulse">Syncing Spartan Data...</div>
    </div>
  );

  if (!member && !staffMember) return null;

  const displayName = isStaff ? staffMember?.name : member?.name;
  const displayCode = isStaff ? staffMember?.staffCode : member?.membershipCode;
  const displayRole = isStaff ? staffMember?.role : 'Active Warrior';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'extended': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'paused': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'expired': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-accent bg-accent/10 border-accent/20';
    }
  };

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase italic tracking-tighter leading-none mb-2 text-text">
            Welcome, <br /> <span className="text-accent">{displayName}</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] ${isStaff ? 'text-accent bg-accent/10 border-accent/20' : getStatusColor(member?.status || '')}`}>
              {displayRole}
            </span>
            <span className="text-text-dim text-xs font-mono uppercase tracking-widest italic">ID: {displayCode}</span>
          </div>
        </div>

        <button
          onClick={() => { setLoginCode(null); setIsStaff(false); navigate('/login'); }}
          className="w-full md:w-auto p-4 bg-surface border border-border rounded-2xl text-text-dim hover:text-text hover:bg-surface-dim transition-all flex items-center justify-center gap-3 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="font-display uppercase italic tracking-widest text-sm">Logout</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Info Card */}
        <div className="lg:col-span-2 gym-card p-6 sm:p-10 flex flex-col md:flex-row items-center gap-12 bg-bg border border-border">
          <div className="relative shrink-0">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-border flex flex-col items-center justify-center text-center">
              <span className="text-text-dim font-bold uppercase text-[10px] tracking-widest mb-1">{isStaff ? 'Staff Since' : 'Expires on'}</span>
              <span className="font-display text-3xl sm:text-4xl italic text-accent">
                {isStaff ? '2026' : new Date(member?.status === 'extended' ? member.extendedDate! : member?.expiryDate || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin-slow opacity-20" />
          </div>
          <div className="flex-1 space-y-6 text-center md:text-left">
             <h3 className="text-xl sm:text-2xl font-display uppercase italic tracking-tight text-text">
               {isStaff ? `Role: ${staffMember?.role}` : `Active Plan: ${member?.plan}`}
             </h3>
             <p className="text-text-dim text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
               {isStaff 
                ? "As a valued staff member of The Spartan Gym, you have access to the dashboard. Maintain discipline and guide our warriors to greatness."
                : `Your membership is currently ${member?.status}. Keep grinding. To extend or renew, please visit the gym counter and pay offline.`
               }
             </p>
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
               <div className="flex items-center gap-2 p-3 bg-surface rounded-xl border border-border">
                 <Calendar className="text-accent" size={16} />
                 <span className="text-xs font-bold font-mono text-text">ID: {displayCode}</span>
               </div>
               <div className="flex items-center gap-2 p-3 bg-surface rounded-xl border border-border text-green-500">
                 <Shield className="" size={16} />
                 <span className="text-xs font-bold font-mono italic">Verified</span>
               </div>
             </div>
          </div>
        </div>

        {/* Action Quick Links */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-6">
          <Link
            to="/tools"
            className="flex-1 gym-card p-8 bg-surface border border-border hover:border-accent transition-all flex flex-col justify-between group"
          >
            <Activity size={32} className="text-accent mb-6" />
            <div>
              <h4 className="text-xl font-display uppercase italic tracking-tight mb-2 text-text">Fitness Tools</h4>
              <p className="text-text-dim text-xs font-medium group-hover:text-text transition-colors">8 FREE calculators</p>
            </div>
            <div className="flex justify-end mt-4">
              <ChevronRight className="text-accent group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <a
            href={GYM_DETAILS.whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 gym-card p-8 bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-all flex flex-col justify-between group"
          >
            <MessageCircle size={32} className="text-accent mb-6" />
            <div>
              <h4 className="text-xl font-display uppercase italic tracking-tight mb-2 text-text">Updates</h4>
              <p className="text-text-dim text-xs font-medium group-hover:text-text transition-colors">WhatsApp Channel</p>
            </div>
            <div className="flex justify-end mt-4">
              <ChevronRight className="text-accent group-hover:translate-x-2 transition-transform" />
            </div>
          </a>
        </div>
      </div>

      {/* Workout Tips */}
      <section>
        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <Sparkles className="text-accent" size={24} />
          <h2 className="text-3xl md:text-4xl font-display uppercase italic tracking-tighter text-text">Your Daily Tips</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Focus on compound movements for maximum growth.",
            "Stay hydrated—aim for at least 4L of water daily.",
            "Rest is just as important as the workout itself.",
            "Perfect your form before increasing the weight."
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-4 p-6 bg-surface rounded-2xl border border-border">
              <div className="w-8 h-8 rounded-lg bg-surface-dim flex items-center justify-center font-display text-accent text-sm italic">0{i+1}</div>
              <p className="text-sm font-medium text-text-dim leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
