import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, Dumbbell, CreditCard, Clock, Phone, User, Settings, MapPin, Briefcase, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { GYM_DETAILS } from '../constants';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: Info },
  { path: '/equipment', label: 'Gear', icon: Dumbbell },
  { path: '/membership', label: 'Plans', icon: CreditCard },
  { path: '/contact', label: 'Visit', icon: MapPin },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { loginCode, isAdmin, isStaff, setIsAdmin, setIsStaff, setLoginCode } = useAuth();

  const handleLogout = () => {
    setLoginCode(null);
    setIsAdmin(false);
    setIsStaff(false);
    navigate('/login');
  };

  const isManagement = isAdmin || isStaff;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-bg/80 backdrop-blur-xl border-b border-border flex items-center px-6 z-50">
        <Link to="/" className="flex items-center">
          <span className="font-display text-3xl tracking-tighter uppercase italic text-accent leading-none">{GYM_DETAILS.name}</span>
        </Link>
      </div>

      {/* Desktop Top Nav */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-20 items-center justify-between px-12 z-50 bg-bg/50 backdrop-blur-xl border-b border-border">
        <Link to="/" className="flex items-center">
          <span className="font-display text-4xl tracking-tighter uppercase italic text-accent leading-none">{GYM_DETAILS.name}</span>
        </Link>

        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium uppercase tracking-widest transition-colors ${
                location.pathname === item.path ? 'text-accent' : 'text-text-dim hover:text-text'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Dynamic Management Links */}
          {isManagement && (
            <Link
              to="/admin"
              className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                location.pathname === '/admin' ? 'text-accent' : 'text-text-dim hover:text-accent'
              }`}
            >
              <Briefcase size={14} /> Management
            </Link>
          )}

          {loginCode && !isManagement && (
            <Link
              to="/dashboard"
              className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2 ${
                location.pathname === '/dashboard' ? 'text-accent' : 'text-text-dim hover:text-accent'
              }`}
            >
              <User size={14} /> Dashboard
            </Link>
          )}
          
          <div className="flex bg-surface rounded-full p-1 border border-border ml-4">
            <button
              onClick={() => setTheme('dark')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-[#ff0000] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              D
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'light' ? 'bg-[#0088ff] text-white shadow-lg' : 'text-zinc-500 hover:text-black'}`}
            >
              L
            </button>
            <button
              onClick={() => setTheme('neon')}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${theme === 'neon' ? 'bg-[#00ff00] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              N
            </button>
          </div>

          {!loginCode ? (
            <Link
              to="/login"
              className="px-6 py-2 bg-accent text-bg font-display uppercase italic tracking-tighter hover:scale-105 transition-transform"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-text border border-border text-bg font-display uppercase italic tracking-tighter hover:bg-accent transition-colors flex items-center gap-2"
            >
              <LogOut size={16} /> Exit
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around z-50 bg-bg/80 backdrop-blur-2xl border-t border-border px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center gap-1 group"
            >
              <item.icon
                size={20}
                className={`transition-colors ${
                  isActive ? 'text-accent' : 'text-text-dim group-hover:text-text'
                }`}
              />
              <span className={`text-[10px] uppercase font-bold tracking-tight ${
                isActive ? 'text-accent' : 'text-text-dim'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-[1.25px] w-8 h-[2px] bg-accent rounded-full"
                />
              )}
            </Link>
          );
        })}
        <Link 
          to={isManagement ? "/admin" : (loginCode ? "/dashboard" : "/login")} 
          className="flex flex-col items-center justify-center gap-1"
        >
          {isManagement ? (
            <Briefcase size={20} className={location.pathname === '/admin' ? 'text-accent' : 'text-text-dim'} />
          ) : (
            <User size={20} className={(location.pathname === '/login' || location.pathname === '/dashboard') ? 'text-accent' : 'text-text-dim'} />
          )}
          <span className={`text-[10px] uppercase font-bold tracking-tight ${
            (location.pathname === '/login' || location.pathname === '/dashboard' || location.pathname === '/admin') ? 'text-accent' : 'text-text-dim'
          }`}>
            {isManagement ? 'Admin' : (loginCode ? 'Stats' : 'Login')}
          </span>
        </Link>
      </nav>
    </>
  );
}
