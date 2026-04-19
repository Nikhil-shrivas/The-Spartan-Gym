import { motion } from 'motion/react';
import { GYM_DETAILS, MEMBERSHIP_PLANS } from '../constants';
import { Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, Info } from 'lucide-react';

export default function MembershipView() {
  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6">
      <header className="flex flex-col items-center text-center gap-6 mb-20">
        <div className="flex items-center gap-3 px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs uppercase tracking-[0.2em]">
          <CreditCard size={14} />
          Pricing Structure
        </div>
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl uppercase italic tracking-tighter leading-[0.85] text-text">
          Membership <br /> <span className="text-accent">Plans</span>
        </h1>
        <p className="max-w-xl text-text-dim font-medium">
          Choose a plan that fits your goals. Start your transformation journey today with flexible options for everyone.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {MEMBERSHIP_PLANS.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden p-8 rounded-[2rem] border transition-all ${
              i === 1 ? 'bg-surface border-accent shadow-[0_0_30px_var(--gym-accent-dim)]' : 'bg-bg border-border'
            }`}
          >
            {i === 1 && (
              <div className="absolute top-4 right-4 bg-accent text-bg text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="text-text-dim font-display text-sm uppercase tracking-widest mb-2">{plan.duration}</div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-display text-text">₹{plan.price}</span>
              <span className="text-text-dim text-sm font-bold uppercase tracking-tighter">/ total</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Full Equipment Access",
                "Advanced Training Tips",
                "Free Water",
                "Trainer Guidance"
              ].map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-text-dim font-medium">
                  <CheckCircle2 size={16} className="text-accent" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className={`w-full py-4 text-center rounded-2xl font-display uppercase italic tracking-widest text-sm transition-all ${
                i === 1 ? 'bg-accent text-bg hover:scale-105 active:scale-95' : 'bg-surface-dim text-text hover:bg-surface border border-border'
              }`}
            >
              Visit Gym to Join
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-surface border border-border rounded-3xl flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Info className="text-accent" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-display uppercase italic tracking-tight mb-1 text-text">Important Notice</h3>
            <p className="text-sm text-text-dim leading-relaxed max-w-lg">
              Payment is done offline at the gym premises. We do not accept online payments through this website for security and verification reasons.
            </p>
          </div>
        </div>
        <Link
          to="/contact"
          className="px-8 py-3 bg-surface-dim hover:bg-surface border border-border text-text transition-colors rounded-xl font-display text-sm uppercase italic tracking-widest whitespace-nowrap"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
