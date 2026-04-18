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
    { id: 'sleep', name: 'Sleep', icon: Moon, desc: 'Ideal Cycles' },
    { id: 'workout', name: 'Workout', icon: Dumbbell, desc: 'Fitness Plan' }
  ];

  return (
    <div className="pt-32 pb-32 max-w-7xl mx-auto px-6">
      <header className="mb-16 text-center">
        <h1 className="font-display text-5xl md:text-8xl uppercase italic tracking-tighter leading-[0.85] mb-6 text-text">
          Fitness <span className="text-accent">Lab</span>
        </h1>
        <p className="max-w-xl mx-auto text-text-dim font-medium">
          Free tools to track your metrics. Knowledge is power—measure your progress accurately and hit your goals faster.
        </p>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-16">
        {calcs.map((calc) => (
          <button
            key={calc.id}
            onClick={() => setActiveCalc(calc.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
              activeCalc === calc.id 
                ? 'bg-accent border-accent text-bg shadow-xl scale-105' 
                : 'bg-surface border-border text-text-dim hover:border-accent/40'
            }`}
          >
            <calc.icon size={20} />
            <div className="text-center">
              <div className="font-display uppercase italic text-xs tracking-wider line-clamp-1">{calc.name}</div>
              <div className="text-[8px] uppercase font-bold opacity-60 hidden sm:block">{calc.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto bg-surface border border-border rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 min-h-[500px] shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeCalc === 'bmi' && <BMICalc key="bmi" />}
          {activeCalc === 'calorie' && <CalorieCalc key="calorie" />}
          {activeCalc === 'water' && <WaterCalc key="water" />}
          {activeCalc === 'heart' && <HeartRateCalc key="heart" />}
          {activeCalc === 'weight' && <IdealWeightCalc key="weight" />}
          {activeCalc === 'fat' && <BodyFatCalc key="fat" />}
          {activeCalc === 'sleep' && <SleepCalc key="sleep" />}
          {activeCalc === 'workout' && <WorkoutPlannerCalc key="workout" />}
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="space-y-4">
          <div className="flex justify-between font-display uppercase italic text-sm tracking-widest text-text">Weight (kg): <span className="text-accent">{weight}</span></div>
          <input type="range" min="30" max="200" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
        </label>
        <label className="space-y-4">
          <div className="flex justify-between font-display uppercase italic text-sm tracking-widest text-text">Height (cm): <span className="text-accent">{height}</span></div>
          <input type="range" min="100" max="250" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
        </label>
      </div>
      <div className="text-center py-8 border-t border-border">
        <div className="text-[80px] md:text-[100px] font-display leading-none italic tracking-tighter text-accent">{bmi}</div>
        <div className={`text-2xl font-display uppercase italic ${color}`}>{status}</div>
      </div>
    </motion.div>
  );
}

function CalorieCalc() {
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.375);

  const bmr = gender === 'male' 
    ? 10 * weight + 6.25 * 175 - 5 * age + 5
    : 10 * weight + 6.25 * 165 - 5 * age - 161;
  const tdee = Math.round(bmr * activity);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setGender('male')} className={`py-3 rounded-xl border font-bold uppercase text-xs tracking-widest ${gender === 'male' ? 'bg-accent text-bg border-accent' : 'bg-bg text-text-dim border-border'}`}>Male</button>
        <button onClick={() => setGender('female')} className={`py-3 rounded-xl border font-bold uppercase text-xs tracking-widest ${gender === 'female' ? 'bg-accent text-bg border-accent' : 'bg-bg text-text-dim border-border'}`}>Female</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <label className="space-y-2">
          <div className="text-xs uppercase font-bold text-text-dim">Weight (kg)</div>
          <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text font-mono" />
        </label>
        <label className="space-y-2">
          <div className="text-xs uppercase font-bold text-text-dim">Age</div>
          <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text font-mono" />
        </label>
      </div>
      <div className="space-y-2">
        <div className="text-xs uppercase font-bold text-text-dim">Activity Level</div>
        <select onChange={(e) => setActivity(Number(e.target.value))} className="w-full p-4 bg-bg border border-border rounded-xl text-text font-medium appearance-none">
          <option value="1.2">Sedentary (Office job)</option>
          <option value="1.375">Light Activity (1-2 days/week)</option>
          <option value="1.55">Moderate Activity (3-5 days/week)</option>
          <option value="1.725">Very Active (6-7 days/week)</option>
        </select>
      </div>
      <div className="text-center py-6 border-t border-border">
        <div className="text-5xl md:text-7xl font-display italic tracking-tighter text-accent">{tdee} <span className="text-2xl text-text-dim">kcal/day</span></div>
        <div className="text-xs uppercase font-bold text-text-dim mt-2 underline decoration-accent/30 decoration-2">Maintenance Calories</div>
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
        <div className="w-24 h-24 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent mb-6 animate-pulse">
            <Droplets size={40} />
        </div>
        <div className="text-6xl md:text-8xl font-display leading-none italic tracking-tighter text-accent">{water} <span className="text-2xl text-text-dim">Litres</span></div>
        <p className="text-xs font-bold uppercase tracking-widest text-text-dim mt-4">Stay hydrated, Spartan.</p>
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
                <button onClick={() => setGender('male')} className={`py-4 rounded-xl border font-bold uppercase text-xs tracking-widest transition-all ${gender === 'male' ? 'bg-accent border-accent text-bg' : 'bg-bg border-border text-text-dim'}`}>Warrior</button>
                <button onClick={() => setGender('female')} className={`py-4 rounded-xl border font-bold uppercase text-xs tracking-widest transition-all ${gender === 'female' ? 'bg-accent border-accent text-bg' : 'bg-bg border-border text-text-dim'}`}>Valkyrie</button>
            </div>
            <label className="space-y-4 block">
                <div className="flex justify-between font-display uppercase italic text-sm tracking-widest text-text">Exact Height: <span className="text-accent">{height}cm</span></div>
                <input type="range" min="120" max="230" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
            </label>
            <div className="text-center py-12 border-t border-border">
                <div className="text-[80px] md:text-[100px] font-display leading-[0.8] italic tracking-tighter text-accent">{Math.round(ideal)} <span className="text-2xl text-text-dim">kg</span></div>
                <div className="text-xs font-bold uppercase tracking-widest text-text-dim mt-4">Target Healthy Weight Range</div>
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

function WorkoutPlannerCalc() {
    const [goal, setGoal] = useState('muscle');
    
    const plans: Record<string, any> = {
        muscle: [
            { day: 'Mon', focus: 'Chest & Tris', ex: 'Bench Press, Dips' },
            { day: 'Wed', focus: 'Back & Bis', ex: 'Pull Ups, Rows' },
            { day: 'Fri', focus: 'Legs & Shoulders', ex: 'Squats, OHP' }
        ],
        fat: [
            { day: 'Mon', focus: 'Full Body HIIT', ex: 'Burpees, Sprints' },
            { day: 'Wed', focus: 'Strength Circuit', ex: 'Kettlebell Swings' },
            { day: 'Fri', focus: 'Vigorous Cardio', ex: '10k Step Goal' }
        ],
        health: [
            { day: 'Mon', focus: 'Strength', ex: 'Bodyweight Squats' },
            { day: 'Wed', focus: 'Flexibility', ex: 'Yoga / Stretching' },
            { day: 'Fri', focus: 'Endurance', ex: 'Brisk Walking' }
        ]
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="flex flex-col gap-3">
                <div className="text-xs uppercase font-bold text-text-dim">Choose Your path</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['muscle', 'fat', 'health'].map(g => (
                        <button 
                            key={g} 
                            onClick={() => setGoal(g)}
                            className={`p-4 rounded-xl border text-[10px] uppercase font-bold tracking-widest transition-all ${goal === g ? 'bg-accent text-bg border-accent' : 'bg-bg text-text-dim border-border hover:border-accent/40'}`}
                        >
                            {g === 'muscle' ? 'Build Muscle' : g === 'fat' ? 'Burn Fat' : 'Stay Active'}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                {plans[goal].map((d: any, i: number) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 0.1 }} 
                        key={d.day} 
                        className="p-6 bg-bg border border-border rounded-2xl flex gap-6 items-center"
                    >
                        <div className="w-16 h-16 bg-surface border border-border rounded-xl flex items-center justify-center font-display italic text-accent text-xl">{d.day}</div>
                        <div>
                            <div className="text-xs uppercase font-bold text-text">{d.focus}</div>
                            <div className="text-sm text-text-dim">{d.ex}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
