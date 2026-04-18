import { motion } from 'motion/react';
import { EQUIPMENT_LIST } from '../constants';
import { 
  Dumbbell, 
  Orbit, 
  Activity, 
  ChevronRight, 
  Zap, 
  Target, 
  ArrowDownCircle, 
  RefreshCcw,
  Bike,
  Wind,
  Maximize,
  LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  "Elliptical Trainer": Activity,
  "Stationary Bike": Bike,
  "Treadmill": Activity,
  "Barbell Bench": Dumbbell,
  "Incline Barbell Bench": Dumbbell,
  "Decline Barbell Bench": Dumbbell,
  "Dipping Bar": Maximize,
  "Barbell": Dumbbell,
  "Barbell (With Handle)": Dumbbell,
  "EZ-Bar": Dumbbell,
  "Dumbbell": Dumbbell,
  "Kettlebell": Dumbbell,
  "T-Bar": RefreshCcw,
  "Stationary Rowing Machine": Wind,
  "Recumbent Stationary Bike": Bike,
  "Cable Row Machine": RefreshCcw,
  "Leg Press Machine": ArrowDownCircle,
  "Parallel Bar": Maximize,
  "Cable Crossover Machine": Orbit,
  "Smith Machine": Orbit,
  "Pec Deck Machine": Target,
  "Pull-up Bar": Maximize,
  "Skipping Rope": Zap,
  "Lat Pulldown Machine": ArrowDownCircle,
  "Sit-Up Bench": Target,
  "Flat Bench": Dumbbell,
  "Adductor Machine": ArrowDownCircle,
  "Hammer Strength Machine": Orbit,
  "Machine Bench": Orbit,
  "Ab Crunch Machine": Target,
  "Leg Curl Machine": ArrowDownCircle
};

export default function EquipmentView() {
  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6">
      <header className="mb-20 text-center md:text-left">
        <h1 className="font-display text-4xl md:text-8xl lg:text-9xl uppercase italic tracking-tighter leading-[0.85] mb-8 text-text">
          The <br /> <span className="text-accent">Arsenal</span>
        </h1>
        <p className="max-w-xl text-text-dim font-medium">
          Professional-grade equipment designed for performance. Explore our collection of cardio, strength, and specialized training tools.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EQUIPMENT_LIST.map((item, i) => {
          const Icon = ICON_MAP[item.name] || Dumbbell;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="gym-card group hover:border-accent/50 flex flex-col items-center justify-center text-center p-12 gap-8 h-[350px] relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-text-dim bg-surface-dim px-2 py-1 rounded">
                {item.purpose}
              </div>
              
              <div className="w-24 h-24 rounded-3xl bg-bg border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all duration-500">
                <Icon size={48} className="text-accent group-hover:text-text transition-colors" />
              </div>

              <div>
                <h3 className="font-display text-3xl uppercase italic tracking-tight mb-3 text-text">
                  {item.name}
                </h3>
                <p className="text-text-dim text-sm font-medium leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>

              <div className="absolute bottom-6 flex items-center gap-2 text-accent font-mono text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Professional Grade <ChevronRight size={12} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
