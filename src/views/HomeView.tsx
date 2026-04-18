import { motion } from 'motion/react';
import { GYM_DETAILS, MEMBERSHIP_PLANS } from '../constants';
import { Link } from 'react-router-dom';
import { Dumbbell, Shield, TrendingUp, ArrowRight, Target } from 'lucide-react';

export default function HomeView() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center lg:pt-0 pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://picsum.photos/seed/gym-hero/1920/1080?blur=4"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left gap-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs uppercase tracking-widest animate-pulse">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Now Open: madipur village
            </div>
            
            <h1 className="font-display text-5xl md:text-8xl lg:text-[10rem] leading-[0.85] uppercase italic tracking-tighter text-text">
              The <br />
              <span className="text-accent">Spartan</span> <br />
              Gym
            </h1>

            <p className="max-w-xl text-lg md:text-xl text-text-dim font-medium leading-relaxed">
              {GYM_DETAILS.tagline} Push your limits. Achieve greatness. 
              Modern equipment, expert guidance, and a community that breeds discipline.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
              <Link
                to="/contact"
                className="px-8 py-4 bg-accent text-bg flex items-center gap-3 group font-display uppercase italic tracking-tighter text-xl hover:scale-105 active:scale-95 transition-all"
              >
                Join Now <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stat Bubbles */}
        <div className="hidden lg:block absolute right-24 top-1/2 -translate-y-1/2 z-20 space-y-12">
          <motion.div
            animate={{ rotate: [-2, 2, -2], y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="p-6 bg-surface/80 backdrop-blur-xl border border-border rounded-3xl -rotate-6 shadow-2xl"
          >
            <Dumbbell className="text-accent mb-4" size={32} />
            <div className="font-display text-4xl leading-none text-text">50+</div>
            <div className="text-[10px] uppercase font-bold text-text-dim tracking-widest mt-1">Premium Machines</div>
          </motion.div>

          <motion.div
            animate={{ rotate: [3, -3, 3], y: [0, 15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="p-6 bg-surface/80 backdrop-blur-xl border border-border rounded-3xl rotate-12 shadow-2xl translate-x-12"
          >
            <Shield className="text-accent mb-4" size={32} />
            <div className="font-display text-4xl leading-none text-text">24/7</div>
            <div className="text-[10px] uppercase font-bold text-text-dim tracking-widest mt-1">Safe Environment</div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Physical Health", desc: "Build muscles and improve cardiovascular health.", icon: TrendingUp },
            { title: "Mental Health", desc: "Reduce stress and boost cognitive function.", icon: Shield },
            { title: "Lifestyle", desc: "Develop discipline that carries into every aspect of life.", icon: Target }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="gym-card group cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                <item.icon className="text-accent group-hover:text-bg transition-colors" />
              </div>
              <h3 className="text-2xl font-display uppercase italic tracking-tight mb-3 text-text">
                {item.title}
              </h3>
              <p className="text-text-dim text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
