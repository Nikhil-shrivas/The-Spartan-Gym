import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, MemberData, StaffData, handleFirestoreError } from '../lib/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Users, UserPlus, Trash2, Search, Filter, Edit3, X, Check, Pause, Play, Shield, Briefcase, RefreshCw, LogOut, AlertCircle, Calendar, Sparkles, XCircle, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanelView() {
  const { user, isAdmin, isStaff, loading: authLoading, setIsAdmin, setIsStaff } = useAuth();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [activeTab, setActiveTab] = useState<'members' | 'staff'>('members');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberData | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: string, type: 'member' | 'staff', name: string } | null>(null);

  const navigate = useNavigate();

  // New Member State
  const [newMember, setNewMember] = useState({
    name: '',
    phone: '',
    plan: '1 Month',
    personalCode: '',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // New Staff State
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    role: 'Trainer',
    personalCode: ''
  });

  useEffect(() => {
    if (!authLoading && !isAdmin && !isStaff) {
      navigate('/login');
      return;
    }
    // Staff can only see members
    if (isStaff) setActiveTab('members');
    
    fetchData();
  }, [authLoading, isAdmin, isStaff]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const promises = [fetchMembers()];
      if (isAdmin) promises.push(fetchStaff());
      await Promise.all(promises);
    } catch (err) {
      console.error("Critical Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const snap = await getDocs(collection(db, 'staff'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffData));
      setStaff(data);
    } catch (err) {
      handleFirestoreError(err, 'list', 'staff');
    }
  };

  const fetchMembers = async () => {
    try {
      const snap = await getDocs(collection(db, 'members'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MemberData));
      setMembers(data);
    } catch (err) {
      handleFirestoreError(err, 'list', 'members');
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.personalCode || newMember.personalCode.length > 25) {
      alert("Personal code must be between 1 and 25 characters.");
      return;
    }
    
    try {
      await addDoc(collection(db, 'members'), {
        name: newMember.name,
        phone: newMember.phone,
        plan: newMember.plan,
        membershipCode: newMember.personalCode.trim().toUpperCase(),
        expiryDate: newMember.expiryDate,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAddMemberModalOpen(false);
      setError(null);
      fetchMembers();
      setNewMember({ name: '', phone: '', plan: '1 Month', personalCode: '', expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
    } catch (err: any) {
      setError(err.message || 'Failed to register member.');
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.id) return;
    try {
      await updateDoc(doc(db, 'members', editingMember.id), {
        name: editingMember.name,
        phone: editingMember.phone,
        plan: editingMember.plan,
        membershipCode: editingMember.membershipCode.trim().toUpperCase(),
        expiryDate: editingMember.expiryDate,
        updatedAt: serverTimestamp()
      });
      setEditingMember(null);
      setError(null);
      fetchMembers();
    } catch (err: any) {
      setError(err.message || 'Failed to update member.');
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.personalCode || newStaff.personalCode.length > 25) {
      alert("Personal code must be between 1 and 25 characters.");
      return;
    }
    
    try {
      await addDoc(collection(db, 'staff'), {
        name: newStaff.name,
        phone: newStaff.phone,
        role: newStaff.role,
        staffCode: newStaff.personalCode.trim().toUpperCase(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setIsAddStaffModalOpen(false);
      setError(null);
      fetchStaff();
      setNewStaff({ name: '', phone: '', role: 'Trainer', personalCode: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to recruit staff.');
    }
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff?.id) return;
    try {
      await updateDoc(doc(db, 'staff', editingStaff.id), {
        name: editingStaff.name,
        phone: editingStaff.phone || '',
        role: editingStaff.role,
        staffCode: editingStaff.staffCode.trim().toUpperCase(),
        updatedAt: serverTimestamp()
      });
      setEditingStaff(null);
      setError(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to update staff.');
    }
  };

  const updateMemberStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'members', id), { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      fetchMembers();
    } catch (err) {
      handleFirestoreError(err, 'update', 'members');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'members', id));
      fetchMembers();
      setDeleteConfirmation(null);
    } catch (err: any) {
      console.error("Delete Member Error:", err);
      setError(err.message || "Failed to delete member");
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'staff', id));
      fetchStaff();
      setDeleteConfirmation(null);
    } catch (err: any) {
      console.error("Delete Staff Error:", err);
      setError(err.message || "Failed to remove staff");
    }
  };

  const generateNewStaffCode = async (id: string) => {
    const newCode = 'STAFF-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    try {
      await updateDoc(doc(db, 'staff', id), {
        staffCode: newCode,
        updatedAt: serverTimestamp()
      });
      fetchStaff();
    } catch (err) {
      handleFirestoreError(err, 'update', 'staff');
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.membershipCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.staffCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active' || m.status === 'extended').length,
    staff: staff.length
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-bg">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <div className="font-display text-2xl uppercase italic text-text animate-pulse">Establishing Secure Uplink...</div>
    </div>
  );

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="font-display text-5xl md:text-8xl uppercase italic tracking-tighter leading-none mb-4 text-text">
            {isAdmin ? 'Admin' : 'Staff'} <span className="text-accent">Control</span>
          </h1>
          <p className="text-text-dim font-medium tracking-tight uppercase text-xs tracking-[0.2em]">{isAdmin ? 'Spartan Operations Management Center' : 'Member Management Access'}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/tools')}
            className="px-6 py-4 bg-surface border border-border text-text-dim rounded-2xl font-display uppercase italic tracking-widest text-sm flex items-center gap-2 hover:text-accent hover:border-accent/40 transition-all"
          >
            <Calculator size={18} /> Tools
          </button>
          <button
            onClick={() => { setIsAdmin(false); setIsStaff(false); navigate('/login'); }}
            className="px-6 py-4 bg-surface border border-border text-text-dim rounded-2xl font-display uppercase italic tracking-widest text-sm flex items-center gap-2 hover:text-text hover:border-text transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
          <button
            onClick={() => activeTab === 'members' ? setIsAddMemberModalOpen(true) : setIsAddStaffModalOpen(true)}
            className="px-8 py-4 bg-accent text-bg rounded-2xl font-display uppercase italic tracking-widest text-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20"
          >
            <UserPlus size={24} /> {activeTab === 'members' ? 'Add Member' : 'Add Staff'}
          </button>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {[
          { label: 'Total Members', val: stats.total, color: 'text-text', icon: Users },
          isAdmin ? { label: 'Staff Command', val: stats.staff, color: 'text-accent', icon: Briefcase } : null
        ].filter(Boolean).map((stat: any, i) => (
          <div key={i} className="gym-card flex items-center gap-6 py-8 bg-surface border border-border group hover:border-accent/40 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <stat.icon size={32} />
            </div>
            <div>
              <div className={`text-4xl md:text-5xl font-display leading-none ${stat.color}`}>{stat.val}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      {isAdmin && (
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 py-4 font-display uppercase italic tracking-[0.2em] text-sm rounded-xl border transition-all ${
              activeTab === 'members' ? 'bg-accent text-bg border-accent shadow-lg shadow-accent/20' : 'bg-surface text-text-dim border-border hover:border-text-dim'
            }`}
          >
            Membership Records
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-4 font-display uppercase italic tracking-[0.2em] text-sm rounded-xl border transition-all ${
              activeTab === 'staff' ? 'bg-accent text-bg border-accent shadow-lg shadow-accent/20' : 'bg-surface text-text-dim border-border hover:border-text-dim'
            }`}
          >
            Staff & Trainers
          </button>
        </div>
      )}

      {/* Data Table */}
      <div className="gym-card bg-surface border border-border overflow-hidden p-0 shadow-2xl">
        <div className="p-6 border-b border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-accent transition-colors" size={18} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 bg-bg border border-border rounded-xl pl-12 pr-12 focus:outline-none focus:border-accent text-text transition-all font-medium text-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dim hover:text-accent transition-colors"
                title="Clear Search"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-bg border border-border text-text-dim rounded-xl px-10 py-2 text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:border-accent transition-all cursor-pointer hover:border-accent/40"
              >
                <option value="all">All Records</option>
                <option value="active">Active Only</option>
                <option value="extended">Extended Only</option>
                <option value="paused">Paused Only</option>
                <option value="expired">Expired Only</option>
              </select>
              <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
            </div>
            <button 
              onClick={fetchData}
              className="p-3 bg-bg border border-border text-text-dim rounded-xl hover:text-accent hover:border-accent/40 transition-all group"
              title="Refresh Database"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} /> 
            </button>
          </div>
        </div>

        <div className="overflow-x-auto text-sm">
          {activeTab === 'members' ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-dim/50 border-b border-border">
                <tr>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Member Name</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Contact Number</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Passcode</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Plan</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim text-accent">Expiry Date</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Status</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim text-right font-mono">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-accent/5 transition-colors group text-text">
                    <td className="px-6 py-5">
                      <div className="font-bold text-base">{member.name}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-text font-mono">{member.phone}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-bg rounded-lg text-xs font-mono font-bold tracking-widest border border-border text-accent">{member.membershipCode}</span>
                    </td>
                    <td className="px-6 py-5 font-display uppercase italic tracking-tighter text-text-dim">{member.plan}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-accent">
                        <Calendar size={14} />
                        {member.expiryDate}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                        member.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                        member.status === 'extended' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                        member.status === 'paused' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        member.status === 'expired' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        'bg-accent/10 text-accent border border-accent/20'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button onClick={() => updateMemberStatus(member.id!, 'active')} className="p-2.5 bg-bg border border-border rounded-xl hover:text-green-500 hover:border-green-500/40 transition-all" title="Activate"><Play size={16} /></button>
                         <button onClick={() => updateMemberStatus(member.id!, 'paused')} className="p-2.5 bg-bg border border-border rounded-xl hover:text-yellow-500 hover:border-yellow-500/40 transition-all" title="Pause"><Pause size={16} /></button>
                         <button onClick={() => updateMemberStatus(member.id!, 'extended')} className="p-2.5 bg-bg border border-border rounded-xl hover:text-blue-400 hover:border-blue-400/40 transition-all" title="Extend Plan"><Sparkles size={16} /></button>
                         <button onClick={() => updateMemberStatus(member.id!, 'expired')} className="p-2.5 bg-bg border border-border rounded-xl hover:text-red-500 hover:border-red-500/40 transition-all" title="Mark Expired"><XCircle size={16} /></button>
                         <button onClick={() => setEditingMember(member)} className="p-2.5 bg-bg border border-border rounded-xl hover:text-blue-500 hover:border-blue-500/40 transition-all" title="Edit"><Edit3 size={16} /></button>
                         <button onClick={() => setDeleteConfirmation({ id: member.id!, type: 'member', name: member.name })} className="p-2.5 bg-bg border border-border rounded-xl hover:text-accent hover:border-accent/40 transition-all" title="Remove"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-dim/50 border-b border-border">
                <tr>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Staff Name</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Role</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim">Authentication Code</th>
                  <th className="px-6 py-5 text-[10px] uppercase font-bold tracking-widest text-text-dim text-right font-mono">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-accent/5 transition-colors group text-text">
                    <td className="px-6 py-5">
                      <div className="font-bold text-base">{s.name}</div>
                    </td>
                    <td className="px-6 py-5 font-display uppercase italic tracking-tighter text-text-dim">{s.role}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-bg rounded-lg text-xs font-mono font-bold tracking-widest border border-border text-accent">{s.staffCode}</span>
                        <button onClick={() => generateNewStaffCode(s.id!)} className="p-1.5 text-text-dim hover:text-accent transition-colors" title="Generate New Code">
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button onClick={() => setEditingStaff(s)} className="p-2.5 bg-bg border border-border rounded-xl hover:text-blue-500 hover:border-blue-500/40 transition-all" title="Edit Staff"><Edit3 size={16} /></button>
                         <button onClick={() => setDeleteConfirmation({ id: s.id!, type: 'staff', name: s.name })} className="p-2.5 bg-bg border border-border rounded-xl hover:text-accent hover:border-accent/40 transition-all" title="Remove Staff"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-bg/90 backdrop-blur-md" onClick={() => { setIsAddMemberModalOpen(false); setError(null); }} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-[3rem] p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-display text-4xl uppercase italic tracking-tighter text-text">Register Member</h2>
              <button onClick={() => { setIsAddMemberModalOpen(false); setError(null); }} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-dim hover:text-text transition-all"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-xs font-bold uppercase tracking-tight flex items-center gap-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Full Name</label>
                <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Phone Number</label>
                <input required value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Personal Login Code (0-25 chars)</label>
                <input required maxLength={25} value={newMember.personalCode} onChange={e => setNewMember({...newMember, personalCode: e.target.value})} placeholder="Choose a unique code" className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium font-mono uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Plan</label>
                  <select value={newMember.plan} onChange={e => setNewMember({...newMember, plan: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium">
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>12 Months</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Expiry Date</label>
                  <input type="date" value={newMember.expiryDate} onChange={e => setNewMember({...newMember, expiryDate: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-accent text-bg font-display uppercase italic tracking-widest text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
                Finalize Registration <Check size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-bg/90 backdrop-blur-md" onClick={() => { setEditingMember(null); setError(null); }} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-[3rem] p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-display text-4xl uppercase italic tracking-tighter text-text">Edit Member</h2>
              <button onClick={() => { setEditingMember(null); setError(null); }} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-dim hover:text-text transition-all"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-xs font-bold uppercase tracking-tight flex items-center gap-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleUpdateMember} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Full Name</label>
                <input required value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Membership Code</label>
                <input required maxLength={25} value={editingMember.membershipCode} onChange={e => setEditingMember({...editingMember, membershipCode: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium font-mono uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Phone</label>
                  <input required value={editingMember.phone} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Plan</label>
                  <select value={editingMember.plan} onChange={e => setEditingMember({...editingMember, plan: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium">
                    <option>1 Month</option>
                    <option>3 Months</option>
                    <option>6 Months</option>
                    <option>12 Months</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Expiry Date</label>
                <input type="date" value={editingMember.expiryDate} onChange={e => setEditingMember({...editingMember, expiryDate: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <button type="submit" className="w-full py-5 bg-accent text-bg font-display uppercase italic tracking-widest text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
                Update Record <Check size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-bg/90 backdrop-blur-md" onClick={() => { setIsAddStaffModalOpen(false); setError(null); }} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-[3rem] p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-display text-4xl uppercase italic tracking-tighter text-text">Recruit Staff</h2>
              <button onClick={() => { setIsAddStaffModalOpen(false); setError(null); }} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-dim hover:text-text transition-all"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-xs font-bold uppercase tracking-tight flex items-center gap-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Staff Name</label>
                <input required value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Phone Number</label>
                <input required value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Personal Login Code (0-25 chars)</label>
                <input required maxLength={25} value={newStaff.personalCode} onChange={e => setNewStaff({...newStaff, personalCode: e.target.value})} placeholder="Choose a unique code" className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium font-mono uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Assigned Role</label>
                <input required value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} placeholder="e.g. Lead Trainer" className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <button type="submit" className="w-full py-5 bg-accent text-bg font-display uppercase italic tracking-widest text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
                Activate Staff Access <Shield size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-bg/90 backdrop-blur-md" onClick={() => { setEditingStaff(null); setError(null); }} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-lg bg-surface border border-border rounded-[3rem] p-10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="font-display text-4xl uppercase italic tracking-tighter text-text">Edit Staff</h2>
              <button onClick={() => { setEditingStaff(null); setError(null); }} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-dim hover:text-text transition-all"><X size={20} /></button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-xs font-bold uppercase tracking-tight flex items-center gap-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleUpdateStaff} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Staff Name</label>
                <input required value={editingStaff.name} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Phone Number</label>
                <input value={editingStaff.phone || ''} onChange={e => setEditingStaff({...editingStaff, phone: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Authentication Code</label>
                <input required maxLength={25} value={editingStaff.staffCode} onChange={e => setEditingStaff({...editingStaff, staffCode: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium font-mono uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-dim ml-2">Assigned Role</label>
                <input required value={editingStaff.role} onChange={e => setEditingStaff({...editingStaff, role: e.target.value})} className="w-full h-14 bg-bg border border-border text-text rounded-2xl px-6 focus:outline-none focus:border-accent transition-all font-medium" />
              </div>
              <button type="submit" className="w-full py-5 bg-accent text-bg font-display uppercase italic tracking-widest text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3">
                Update Staff Record <Check size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-bg/95 backdrop-blur-xl" onClick={() => setDeleteConfirmation(null)} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-surface border border-border rounded-[2.5rem] p-10 shadow-2xl text-center"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
              <Trash2 size={40} />
            </div>
            <h3 className="font-display text-3xl uppercase italic tracking-tighter text-text mb-4">Confirm Deletion</h3>
            <p className="text-text-dim text-sm mb-8">
              Are you sure you want to permanently remove <span className="text-text font-bold uppercase tracking-tight">{deleteConfirmation.name}</span> from the {deleteConfirmation.type === 'member' ? 'gym roster' : 'staff database'}?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="py-4 bg-bg border border-border text-text-dim rounded-2xl font-display uppercase italic tracking-widest text-sm hover:text-text hover:border-text transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmation.type === 'member' ? deleteMember(deleteConfirmation.id) : deleteStaff(deleteConfirmation.id)}
                className="py-4 bg-accent text-bg rounded-2xl font-display uppercase italic tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Delete
              </button>
            </div>
            {error && (
              <div className="mt-6 text-accent text-[10px] font-bold uppercase tracking-widest animate-pulse">
                {error}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
