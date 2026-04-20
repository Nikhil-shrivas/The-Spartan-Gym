import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabase';
import { Database, Shield, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function SupabaseView() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkConnection = async () => {
    setStatus('loading');
    setErrorMsg(null);
    try {
      if (supabaseUrl === 'https://placeholder.supabase.co' || !supabaseUrl) {
        throw new Error('Project URL is missing. Please add VITE_SUPABASE_URL to Secrets.');
      }
      
      if (!supabaseAnonKey || supabaseAnonKey === 'placeholder-key') {
        throw new Error('Anon Key is missing. Please add VITE_SUPABASE_ANON_KEY to Secrets.');
      }
      
      // Just a simple query to check connection
      // We don't even need a table, we can just ping the API
      const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
      
      // Note: _test_connection might not exist, which is fine, as long as it's not a connection error
      if (error) {
        // If we get a PostgREST error (like table not found), it means we successfully hit the API
        if (error.code?.startsWith('PGRST') || error.message?.includes('schema cache')) {
          setStatus('connected');
        } else {
          throw error;
        }
      } else {
        setStatus('connected');
      }
    } catch (err: any) {
      console.error('Supabase Connection Error:', err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to connect to Supabase. Check your URL and Anon Key.');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="pt-32 pb-32 max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gym-card bg-surface border border-border p-12 text-center flex flex-col items-center gap-8"
      >
        <div className="w-24 h-24 rounded-3xl bg-bg flex items-center justify-center border border-border relative">
          <Database className="text-accent" size={48} />
          {status === 'connected' && (
            <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-green-500 border-4 border-surface flex items-center justify-center">
              <CheckCircle2 size={16} className="text-white" />
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-4xl md:text-6xl uppercase italic tracking-tighter text-text mb-4">
            Supabase <span className="text-accent">Connection</span>
          </h1>
          <p className="text-text-dim max-w-md mx-auto font-medium leading-relaxed">
            Verify your Spartan Gym database connection. This link enables real-time synchronization and secure member storage.
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-3 text-text-dim animate-pulse">
              <RefreshCw className="animate-spin" size={20} />
              <span className="font-bold uppercase tracking-widest text-xs">Testing Satellite Link...</span>
            </div>
          )}

          {status === 'connected' && (
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col items-center gap-4">
              <div className="text-green-500 font-bold uppercase tracking-widest text-sm">Status: Operational</div>
              <p className="text-xs text-text-dim text-center">
                The connection to Supabase is active. You can now use the database for your Spartan Gym operations.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl flex flex-col items-center gap-4">
              <div className="text-accent font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                <AlertCircle size={18} /> Error: Disconnected
              </div>
              <p className="text-xs text-text-dim text-center leading-relaxed">
                {errorMsg}
                <br /><br />
                <span className="font-bold">Pro-tip:</span> Make sure you added your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the project settings.
              </p>
            </div>
          )}

          <button
            onClick={checkConnection}
            disabled={status === 'loading'}
            className="w-full h-14 bg-bg border border-border text-text rounded-2xl flex items-center justify-center gap-3 font-display uppercase italic tracking-widest hover:border-accent hover:text-accent transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={20} className={status === 'loading' ? 'animate-spin' : ''} />
            {status === 'loading' ? 'Testing...' : 'Retest Connection'}
          </button>
        </div>

        {/* Debug Section to help the user find typos */}
        <div className="w-full mt-8 p-6 bg-black/20 rounded-2xl border border-border/50 text-left overflow-hidden">
          <h3 className="text-xs font-mono text-text-dim uppercase tracking-widest mb-4 flex items-center gap-2">
            <Shield size={14} /> System Debug Inspector
          </h3>
          <div className="space-y-2 font-mono text-[10px]">
            <div className="flex justify-between border-b border-border/20 pb-2">
              <span className="text-accent">VITE_SUPABASE_URL:</span>
              <span className="text-text truncate ml-4">
                {supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : '(Empty/Missing)'}
              </span>
            </div>
            <div className="flex justify-between border-b border-border/20 pb-2">
              <span className="text-accent">VITE_SUPABASE_ANON:</span>
              <span className="text-text truncate ml-4">
                {supabaseAnonKey ? 'Verified (Present)' : '(Empty/Missing)'}
              </span>
            </div>
          </div>
          <p className="mt-4 text-[9px] text-text-dim leading-relaxed">
            Note: If any key shows "(Empty/Missing)", please double-check the spelling in Settings &gt; Secrets and ensure you clicked "Restart Dev Server".
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-8">
          <div className="p-6 bg-bg/50 border border-border rounded-[2rem] text-left">
            <h3 className="font-display uppercase italic tracking-widest text-xs text-accent mb-3">Database Type</h3>
            <p className="text-text font-bold">PostgreSQL (Enterprise Level)</p>
          </div>
          <div className="p-6 bg-bg/50 border border-border rounded-[2rem] text-left">
            <h3 className="font-display uppercase italic tracking-widest text-xs text-accent mb-3">Mode</h3>
            <p className="text-text font-bold">Real-time Enabled</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
