/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { GYM_DETAILS } from './constants';
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import EquipmentView from './views/EquipmentView';
import MembershipView from './views/MembershipView';
import ContactView from './views/ContactView';
import CalculatorsView from './views/CalculatorsView';
import LoginView from './views/LoginView';
import MemberDashboardView from './views/MemberDashboardView';
import AdminPanelView from './views/AdminPanelView';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen selection:bg-accent selection:text-bg pb-20 pt-16 lg:pt-20 lg:pb-0">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route path="/about" element={<AboutView />} />
                <Route path="/equipment" element={<EquipmentView />} />
                <Route path="/membership" element={<MembershipView />} />
                <Route path="/contact" element={<ContactView />} />
                <Route path="/tools" element={<CalculatorsView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/dashboard" element={<MemberDashboardView />} />
                <Route path="/admin" element={<AdminPanelView />} />
              </Routes>
            </main>

          <footer className="hidden lg:block py-20 bg-surface border-t border-border">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-2">
                <div className="flex items-center mb-6">
                  <div className="font-display text-4xl uppercase italic tracking-tighter text-accent leading-none">The Spartan Gym</div>
                </div>
                <p className="text-text-dim max-w-sm mb-8 font-medium">Build Strength. Build Discipline. The ultimate fitness sanctuary in Madipur Village.</p>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center border border-border text-text-dim hover:text-accent transition-colors cursor-pointer text-xs font-bold font-mono">IG</div>
                  <div className="w-10 h-10 rounded-full bg-bg flex items-center justify-center border border-border text-text-dim hover:text-accent transition-colors cursor-pointer text-xs font-bold font-mono">WA</div>
                </div>
              </div>
              <div>
                <h4 className="font-display uppercase italic tracking-widest text-sm mb-6 text-text">Quick Links</h4>
                <ul className="space-y-3 text-text-dim text-sm font-bold uppercase tracking-tight">
                  <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
                  <li><Link to="/equipment" className="hover:text-accent transition-colors">Equipment</Link></li>
                  <li><Link to="/membership" className="hover:text-accent transition-colors">Plans</Link></li>
                  <li><Link to="/tools" className="hover:text-accent transition-colors">Fitness Tools</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-display uppercase italic tracking-widest text-sm mb-6 text-text">Location</h4>
                <p className="text-text-dim text-sm font-medium leading-relaxed">
                  WZ-278, MADIPUR VILLAGE,<br />
                  NEAR JHEEL PARK,<br />
                  NEW DELHI - 63
                </p>
                <div className="mt-4 text-accent font-mono text-sm underline cursor-pointer">Get Directions</div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-border text-center text-[10px] uppercase font-bold text-text-dim tracking-[0.3em]">
              © 2026 THE SPARTAN GYM. ALL RIGHTS RESERVED.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);
}
