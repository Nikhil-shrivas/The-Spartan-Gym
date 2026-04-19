import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Activity, Droplets, Heart, Scale, Percent, Moon, Dumbbell, X } from 'lucide-react';

export default function CalculatorsView() {
  const [activeCalc, setActiveCalc] = useState<string>('bmi');

  const calcs = [
    { id: 'bmi', name: 'BMI', icon: Calculator, desc: 'Body Mass Index' },
    { id: 'calorie', name: 'Calories', icon: Activity, desc: 'Daily Needs' },
    { id: 'water', name: 'Water', icon: Droplets, desc: 'Hydration Goal' },
    { id: 'heart', name: 'Heart', icon: Heart, desc: 'Target Rate' },
    { id: 'weight', name: 'Weight', icon: Scale, desc: 'Ideal Range' },
    { id: 'fat', name: 'Fat', icon: Percent, desc: 'Body Fat %' },
    { id: 'sleep', name: 'Sleep', icon: Moon, desc: 'Ideal Cycles' }
  ];

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6">
      <header className="mb-16 text-center">
        <h1 className="font-display text-4xl sm:text-6xl md:text-8xl uppercase italic tracking-tighter leading-[0.85] mb-6 text-text">
          Fitness <span className="text-accent">Lab</span>
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base text-text-dim font-medium">
          Free tools to track your metrics. Knowledge is power—measure your progress accurately and hit your goals faster.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-20">
        {calcs.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalc(calc.id)}
            className={`flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl border transition-all ${
              activeCalc === calc.id 
                ? 'bg-accent border-accent text-bg shadow-2xl scale-105 sm:scale-110 z-10' 
                : 'bg-surface border-border text-text-dim hover:border-accent/40 active:scale-95'
            }`}
          >
            <calc.icon size={20} />
            <div className="text-center">
              <div className="font-display uppercase italic text-[11px] sm:text-xs tracking-widest line-clamp-1 mb-1">{calc.name}</div>
              <div className="text-[9px] sm:text-[10px] uppercase font-bold opacity-70 hidden sm:block tracking-widest leading-none">{calc.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto bg-surface border border-border rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 min-h-[500px] shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeCalc === 'bmi' && <BMICalc key="bmi" />}
          {activeCalc === 'calorie' && <CalorieCalc key="calorie" />}
          {activeCalc === 'water' && <WaterCalc key="water" />}
          {activeCalc === 'heart' && <HeartRateCalc key="heart" />}
          {activeCalc === 'weight' && <IdealWeightCalc key="weight" />}
          {activeCalc === 'fat' && <BodyFatCalc key="fat" />}
          {activeCalc === 'sleep' && <SleepCalc key="sleep" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BMICalc() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  let status = "Normal";
  let color = "text-green-500";

  if (Number(bmi) < 18.5) { status = "Underweight"; color = "text-blue-500"; }
  else if (Number(bmi) >= 25 && Number(bmi) < 30) { status = "Overweight"; color = "text-yellow-500"; }
  else if (Number(bmi) >= 30) { status = "Obese"; color = "text-accent"; }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <label className="space-y-6">
          <div className="flex justify-between font-display uppercase italic text-sm tracking-[0.2em] text-text">
            <span>Weight (kg)</span>
            <span className="text-accent underline decoration-accent/30 underline-offset-8">{weight}</span>
          </div>
          <input type="range" min="30" max="200" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full cursor-pointer accent-accent h-1" />
        </label>
        <label className="space-y-6">
          <div className="flex justify-between font-display uppercase italic text-sm tracking-[0.2em] text-text">
            <span>Height (cm)</span>
            <span className="text-accent underline decoration-accent/30 underline-offset-8">{height}</span>
          </div>
          <input type="range" min="100" max="250" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full cursor-pointer accent-accent h-1" />
        </label>
      </div>
      <div className="text-center py-12 border-t border-border/50">
        <div className="text-[10px] uppercase font-bold text-text-dim/60 tracking-[0.4em] mb-8 italic">Body Mass Index Result</div>
        <div className="text-6xl sm:text-[100px] md:text-[140px] font-display leading-[0.75] italic tracking-tighter text-accent drop-shadow-2xl">{bmi}</div>
        <div className={`text-xl sm:text-3xl font-display uppercase italic mt-10 tracking-widest ${color}`}>{status}</div>
      </div>
    </motion.div>
  );
}

function CalorieCalc() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.375);

  const bmr = gender === 'male' 
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * activity);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
      <div className="grid grid-cols-2 gap-6">
        <button onClick={() => setGender('male')} className={`py-4 rounded-xl border font-bold uppercase text-[10px] tracking-[0.3em] transition-all ${gender === 'male' ? 'bg-accent text-bg border-accent' : 'bg-bg text-text-dim border-border'}`}>WARRIOR</button>
        <button onClick={() => setGender('female')} className={`py-4 rounded-xl border font-bold uppercase text-[10px] tracking-[0.3em] transition-all ${gender === 'female' ? 'bg-accent text-bg border-accent' : 'bg-bg text-text-dim border-border'}`}>VALKYRIE</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <label className="space-y-3">
          <div className="text-[10px] uppercase font-black text-text-dim/60 tracking-widest">Weight (kg)</div>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full p-4 bg-bg/50 border border-border rounded-xl text-text font-mono text-lg focus:border-accent outline-none transition-colors" />
        </label>
        <label className="space-y-3">
          <div className="text-[10px] uppercase font-black text-text-dim/60 tracking-widest">Height (cm)</div>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-4 bg-bg/50 border border-border rounded-xl text-text font-mono text-lg focus:border-accent outline-none transition-colors" />
        </label>
        <label className="space-y-3">
          <div className="text-[10px] uppercase font-black text-text-dim/60 tracking-widest">Age</div>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full p-4 bg-bg/50 border border-border rounded-xl text-text font-mono text-lg focus:border-accent outline-none transition-colors" />
        </label>
      </div>
      <div className="space-y-3">
        <div className="text-[10px] uppercase font-black text-text-dim/60 tracking-widest">Exercise Activity Level</div>
        <div className="relative">
          <select 
            onChange={(e) => setActivity(Number(e.target.value))} 
            className="w-full p-5 bg-bg/50 border border-border rounded-xl text-text font-medium appearance-none focus:border-accent outline-none cursor-pointer pr-12"
          >
            <option value="1.2">Sedentary (Minimum Activity / Desk Job)</option>
            <option value="1.375">Lightly Active (1-2 Days / Week)</option>
            <option value="1.55">Moderately Active (3-5 Days / Week)</option>
            <option value="1.725">Extremely Active (Daily Heavy Training)</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
            <Calculator size={16} />
          </div>
        </div>
      </div>
      <div className="text-center py-10 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
          <div className="text-6xl md:text-8xl font-display italic tracking-tighter text-accent transition-all duration-300 leading-none">
            {tdee}
          </div>
          <div className="text-xl md:text-3xl text-text-dim/60 font-bold uppercase tracking-widest leading-none">
            KCAL / DAY
          </div>
        </div>
        <div className="text-[10px] uppercase font-bold text-accent tracking-[0.4em] py-1.5 px-6 bg-accent/5 inline-block rounded-full border border-accent/10 italic">
          Total Daily Maintenance Requirement
        </div>
      </div>
    </motion.div>
  );
}

function WaterCalc() {
  const [weight, setWeight] = useState(70);
  const [intenseWork, setIntenseWork] = useState(0);

  const water = ((weight * 0.033) + (intenseWork * 0.525)).toFixed(1);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
      <label className="space-y-4 block">
        <div className="flex justify-between font-display uppercase italic text-sm tracking-widest text-text">Body Weight: <span className="text-accent">{weight}kg</span></div>
        <input type="range" min="30" max="150" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
      </label>
      <label className="space-y-4 block">
        <div className="flex justify-between font-display uppercase italic text-sm tracking-widest text-text">Exercise Duration: <span className="text-accent">{intenseWork} hours</span></div>
        <input type="range" min="0" max="5" step="0.5" value={intenseWork} onChange={(e) => setIntenseWork(Number(e.target.value))} className="w-full" />
      </label>
      <div className="text-center py-12 border-t border-border flex flex-col items-center">
        <div className="w-24 h-24 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent mb-8 animate-pulse">
            <Droplets size={40} />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 leading-none">
          <div className="text-6xl md:text-8xl font-display italic tracking-tighter text-accent leading-none">
            {water}
          </div>
          <div className="text-2xl md:text-4xl text-text-dim font-display italic uppercase tracking-widest leading-none">
            Litres
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-text-dim mt-8">Stay hydrated, Spartan.</p>
      </div>
    </motion.div>
  );
}

function HeartRateCalc() {
  const [age, setAge] = useState(25);
  const mhr = 220 - age;
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <label className="space-y-2 block">
        <div className="text-xs uppercase font-bold text-text-dim">Your Age</div>
        <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text font-mono text-xl" />
      </label>
      <div className="grid grid-cols-1 gap-4">
        <div className="p-6 bg-bg border border-border rounded-2xl flex justify-between items-center group hover:border-accent transition-colors">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim">Fat Burn (60-70%)</div>
            <div className="text-2xl font-display italic text-text">{Math.round(mhr * 0.6)} - {Math.round(mhr * 0.7)} BPM</div>
          </div>
          <Activity className="text-text-dim group-hover:text-accent transition-colors" />
        </div>
        <div className="p-6 bg-bg border border-border rounded-2xl flex justify-between items-center group hover:border-accent transition-colors">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim">Cardio Zone (70-85%)</div>
            <div className="text-2xl font-display italic text-text">{Math.round(mhr * 0.7)} - {Math.round(mhr * 0.85)} BPM</div>
          </div>
          <Activity className="text-text-dim group-hover:text-accent transition-colors" />
        </div>
        <div className="p-6 bg-bg border border-border rounded-2xl flex justify-between items-center group hover:border-accent transition-colors">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim">Max Heart Rate</div>
            <div className="text-2xl font-display italic text-accent">{mhr} BPM</div>
          </div>
          <Heart className="text-accent" fill="currentColor" />
        </div>
      </div>
    </motion.div>
  );
}

function IdealWeightCalc() {
    const [height, setHeight] = useState(170);
    const [gender, setGender] = useState('male');
    
    // Devine formula
    const ideal = gender === 'male' 
        ? 50 + 2.3 * ((height / 2.54) - 60)
        : 45.5 + 2.3 * ((height / 2.54) - 60);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setGender('male')} className={`py-4 rounded-xl border font-bold uppercase text-xs tracking-widest transition-all ${gender === 'male' ? 'bg-accent border-accent text-bg' : 'bg-bg border-border text-text-dim'}`}>Warrior (M)</button>
                <button onClick={() => setGender('female')} className={`py-4 rounded-xl border font-bold uppercase text-xs tracking-widest transition-all ${gender === 'female' ? 'bg-accent border-accent text-bg' : 'bg-bg border-border text-text-dim'}`}>Valkyrie (F)</button>
            </div>
            <label className="space-y-4 block">
                <div className="flex justify-between font-display uppercase italic text-sm tracking-widest text-text">Your Height: <span className="text-accent">{height}cm</span></div>
                <input type="range" min="120" max="230" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
            </label>
            <div className="text-center py-12 border-t border-border">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-4">
                  <div className="text-[80px] md:text-[100px] font-display leading-none italic tracking-tighter text-accent">
                    {Math.round(ideal)}
                  </div>
                  <div className="text-2xl md:text-4xl text-text-dim font-display italic uppercase tracking-widest leading-none">
                    kg
                  </div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-dim mt-8 italic">Recommended Healthy Weight Range</div>
            </div>
        </motion.div>
    );
}

function BodyFatCalc() {
    const [weight, setWeight] = useState(70);
    const [waist, setWaist] = useState(80);
    const [neck, setNeck] = useState(40);
    const [height, setHeight] = useState(170);
    const [gender, setGender] = useState('male');

    // Navy formula estimation
    const bf = gender === 'male'
        ? 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
        : 495 / (1.29579 - 0.35004 * Math.log10(waist + 88 - neck) + 0.22100 * Math.log10(height)) - 450;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <button onClick={() => setGender('male')} className={`py-4 rounded-xl border font-bold uppercase text-xs tracking-widest ${gender === 'male' ? 'bg-accent text-bg border-accent' : 'bg-bg text-text-dim border-border'}`}>Male</button>
                <button onClick={() => setGender('female')} className={`py-4 rounded-xl border font-bold uppercase text-xs tracking-widest ${gender === 'female' ? 'bg-accent text-bg border-accent' : 'bg-bg text-text-dim border-border'}`}>Female</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <label className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-text-dim">Waist (cm)</div>
                    <input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text" />
                </label>
                <label className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-text-dim">Neck (cm)</div>
                    <input type="number" value={neck} onChange={(e) => setNeck(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text" />
                </label>
                <label className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-text-dim">Height (cm)</div>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text" />
                </label>
                <label className="space-y-2">
                    <div className="text-[10px] uppercase font-bold text-text-dim">Weight (kg)</div>
                    <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text" />
                </label>
            </div>
            <div className="text-center py-6 border-t border-border">
                <div className="text-5xl md:text-7xl font-display italic tracking-tighter text-accent">{Math.max(2, Math.min(60, Math.round(bf)))}%</div>
                <div className="text-xs uppercase font-bold text-text-dim mt-2 tracking-widest">Estimated Body Fat</div>
            </div>
        </motion.div>
    );
}

function SleepCalc() {
    const [wakeTime, setWakeTime] = useState('06:00');
    
    // Suggest sleep times based on 90 min cycles (5, 6 cycles)
    const [hour, min] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hour, min, 0);

    const time1 = new Date(wakeDate.getTime() - (9 * 60 * 60 * 1000 + 14 * 60 * 1000));
    const time2 = new Date(wakeDate.getTime() - (7.5 * 60 * 60 * 1000 + 14 * 60 * 1000));

    const format = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <label className="space-y-4 block">
                <div className="text-xs uppercase font-bold text-text-dim">When do you need to wake up?</div>
                <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full p-6 bg-bg border border-border rounded-[2rem] text-3xl font-display italic text-accent text-center" />
            </label>
            <div className="space-y-4">
                <div className="text-xs uppercase font-bold text-text-dim text-center">Recommended Bedtimes</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-8 bg-bg border border-border rounded-3xl text-center group hover:border-accent transition-all">
                        <div className="text-3xl font-display italic text-text mb-2">{format(time1)}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim">6 Sleep Cycles (Best)</div>
                    </div>
                    <div className="p-8 bg-bg border border-border rounded-3xl text-center group hover:border-accent transition-all">
                        <div className="text-3xl font-display italic text-text mb-2">{format(time2)}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-text-dim">5 Sleep Cycles (Great)</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

