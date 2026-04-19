import { motion } from 'motion/react';
import { GYM_DETAILS } from '../constants';
import { Phone, Mail, MapPin, ExternalLink, Clock, Instagram, MessageCircle, ArrowRight } from 'lucide-react';

export default function ContactView() {
  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6">
      <header className="mb-20 text-center md:text-left">
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl uppercase italic tracking-tighter leading-[0.85] mb-6 text-text">
          Find Us <br /> <span className="text-accent">Today</span>
        </h1>
        <p className="max-w-xl text-text-dim font-medium">
          Ready to start your fitness journey? Visit The Spartan Gym or connect with us on WhatsApp. We're here to help you build strength and discipline.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Deck */}
        <div className="flex flex-col gap-6">
          <div className="gym-card flex items-start gap-6 p-10">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <MapPin className="text-accent" size={28} />
            </div>
            <div>
              <h3 className="text-text-dim font-bold uppercase tracking-widest text-[10px] mb-2">Location</h3>
              <p className="text-xl font-medium leading-relaxed max-w-xs text-text">{GYM_DETAILS.location}</p>
              <a 
                href={GYM_DETAILS.googleMapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest mt-4 hover:underline"
              >
                Open in Maps <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="gym-card flex flex-col items-center text-center gap-6 p-8">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Phone className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-text-dim font-bold uppercase tracking-widest text-[10px] mb-2">Phone</h3>
                <p className="text-lg font-bold text-text">{GYM_DETAILS.phone}</p>
              </div>
            </div>

            <a 
              href={GYM_DETAILS.whatsappChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="gym-card flex flex-col items-center text-center gap-6 p-8 hover:border-accent transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent transition-colors">
                <MessageCircle className="text-accent group-hover:text-bg transition-colors" size={24} />
              </div>
              <div>
                <h3 className="text-text-dim font-bold uppercase tracking-widest text-[10px] mb-2">WhatsApp Channel</h3>
                <p className="text-sm font-bold text-text mb-1">Follow The Spartan Gym</p>
                <p className="text-[9px] text-text-dim font-medium uppercase tracking-tight">Stay updated & join the channel</p>
              </div>
            </a>
          </div>

          <div className="gym-card p-10">
            <h3 className="text-text-dim font-bold uppercase tracking-widest text-[10px] mb-6">Our Timings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="font-bold text-text">Monday - Saturday</span>
                <span className="text-accent font-mono">{GYM_DETAILS.timings.open} - {GYM_DETAILS.timings.close}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="font-bold text-text">Lunch Break</span>
                <span className="text-text-dim font-mono">{GYM_DETAILS.timings.break}</span>
              </div>
              <div className="flex justify-between items-center text-text-dim text-sm italic">
                <span>Sunday</span>
                <span>{GYM_DETAILS.timings.sunday}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <a 
          href={GYM_DETAILS.googleMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative h-full min-h-[400px] rounded-[2.5rem] overflow-hidden group border border-border block"
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          <img 
            src="https://picsum.photos/seed/map-location/1000/1200" 
            alt="Gym Area" 
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-10 left-10 z-20">
            <h2 className="font-display text-4xl uppercase italic tracking-tighter text-text group-hover:text-accent transition-colors">Visit Us Today</h2>
            <p className="text-text-dim mt-2 font-medium">Join the Spartan Brotherhood.</p>
            <div className="mt-4 flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
              Go to Location <ArrowRight size={14} />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
