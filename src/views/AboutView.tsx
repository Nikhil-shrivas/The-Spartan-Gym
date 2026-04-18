import { motion } from 'motion/react';
import { GYM_DETAILS, GYM_RULES } from '../constants';
import { ShieldCheck, Info, Heart, Zap, Target } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6">
      <header className="mb-20 text-center md:text-left">
        <h1 className="font-display text-4xl md:text-8xl uppercase italic tracking-tighter leading-[0.85] mb-8 text-text">
          The <br /> <span className="text-accent">Philosophy</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-text-dim font-medium leading-relaxed">
          At The Spartan Gym, we don't just train bodies; we build discipline. Our mission is to provide the environment and expertise needed to transform your lifestyle.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold text-xs uppercase tracking-widest">
            What is a Gym?
          </div>
          <h2 className="text-3xl md:text-5xl font-display uppercase italic tracking-tighter leading-tight text-text">
            More than just a place to sweat.
          </h2>
          <p className="text-text-dim leading-relaxed text-lg">
            A gym is a dedicated space for physical exercises, equipped with machines, weights, and guidance to help individuals improve their health and fitness. But at The Spartan Gym, it's a sanctuary for discipline—a place where you leave your comfort zone to find your strength.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-surface rounded-2xl border border-border">
              <Heart className="text-accent mb-4" size={24} />
              <h4 className="font-display uppercase italic text-xl mb-2 text-text">Physical Health</h4>
              <p className="text-text-dim text-sm">Improve heart health, build muscle, and increase lifespan.</p>
            </div>
            <div className="p-6 bg-surface rounded-2xl border border-border">
              <Zap className="text-accent mb-4" size={24} />
              <h4 className="font-display uppercase italic text-xl mb-2 text-text">Mental Clarity</h4>
              <p className="text-text-dim text-sm">Release endorphins, reduce stress, and improve focus.</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl brand-glow border border-border">
          <img 
            src="https://picsum.photos/seed/discipline/800/800" 
            alt="Discipline" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-bg via-bg/40 to-transparent">
            <div className="font-display text-2xl md:text-4xl uppercase italic tracking-tighter text-text">"Discipline &gt; Motivation"</div>
          </div>
        </div>
      </div>

      <section>
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-accent font-display uppercase italic tracking-[0.2em] text-sm">The Code</span>
          <h2 className="text-4xl md:text-7xl font-display uppercase italic tracking-tighter leading-none text-text">
            Gym Rules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GYM_RULES.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 p-5 bg-surface border border-border rounded-2xl group hover:border-accent transition-colors"
            >
              <div className="mt-1 w-6 h-6 rounded-full bg-bg border border-border flex items-center justify-center shrink-0 group-hover:bg-accent transition-all">
                <ShieldCheck size={14} className="text-accent group-hover:text-bg" />
              </div>
              <p className="text-sm font-medium text-text-dim leading-relaxed group-hover:text-text transition-colors">
                {rule}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
