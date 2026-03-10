import { useState, useEffect, useCallback } from "react";

// ─── YOUTUBE EXERCISE DATABASE ───
const YT = {
  "Seated Shoulder Press": "qEwKCR5JCog",
  "Lateral Raises": "3VcKaXpzqRo",
  "Flat Dumbbell Press": "VmB1G1K7v94",
  "Incline Dumbbell Press": "8iPEnn-ltC8",
  "Overhead Tricep Extension": "YbX7Yzn-LkY",
  "Push-ups": "IODxDxX7oi4",
  "Knee Push-ups": "jWxvty2KROs",
  "Bent Over Rows": "FWJR5Ve8bnQ",
  "Single Arm DB Rows": "pYcpY20QaE8",
  "Face Pulls": "rep-qVOkqgk",
  "Dead Hang": "dL0LNpXwy0w",
  "Pull-up Negatives": "S3gxEhKNMm8",
  "Barbell Curls": "kwG2ipFRgFo",
  "Hip Thrusts": "SEdqd1s0UcI",
  "Glute Bridges": "OUgsJ8-Vi0E",
  "Romanian Deadlift": "7j-2w4-P14I",
  "Goblet Squats": "MeIiIdhvXT4",
  "Calf Raises": "gwLzBJYoWlI",
  "Bird Dogs": "wiFNA3sqjCA",
  "Arnold Press": "6Z15_WdXmVw",
  "Incline DB Flyes": "JRDhYXoATOg",
  "Front Raises": "gzDsAmJG8Tc",
  "Tricep Dips": "6kALZikXxLc",
  "Inverted Rows": "KOaCM1HMwU0",
  "DB Pullovers": "FK4rHfWKEac",
  "Reverse Flyes": "oLrFECHAYn8",
  "Hammer Curls": "zC3nLlEvin4",
  "Planks": "ASdvN_XEl_c",
  "Dead Bugs": "4XLEnwUr1d8",
  "Step-ups": "WCFCdxzFBa4",
  "Sumo Squats": "9ZuXKqRbT9k",
  "Standing Calf Raises": "gwLzBJYoWlI",
  "McGill Curl-ups": "MRHo8dnDYCY",
  "Side Planks": "K2VljzCC16g",
  "Concentration Curls": "0AUGkch3tzc",
  "Chin-ups": "brhRXlOhWI8",
  "Dips": "2z8JmcrW-As",
  "L-Sit": "IUZJoSP66HI",
  "Shadow Boxing": "LVbZ0b-882M",
  "Sprawls": "LcTDm3n5JYg",
  "Burpees": "TU8QYVW0gDU",
  "Jump Rope": "u3zgKRFc1HU",
  "Foam Rolling": "t7IS0gx-LVE",
  "Neck Strengthening": "wjiYaJf6oWA",
  "Farmer Carries": "y7SILZiJaHE",
};

// ─── PHASE DATA ───
const PHASES = [
  { n:1, name:"Foundation", wk:[1,4], wt:"110→106", bf:"36→33%", cal:2000, rate:"1 kg/wk", color:"#3B82F6" },
  { n:2, name:"Build Base", wk:[5,8], wt:"106→102", bf:"33→29%", cal:2000, rate:"1 kg/wk", color:"#0D9488" },
  { n:3, name:"Intensity", wk:[9,12], wt:"102→98", bf:"29→25%", cal:1950, rate:"1 kg/wk", color:"#16A34A" },
  { n:4, name:"Conditioning", wk:[13,16], wt:"98→94", bf:"25→22%", cal:1950, rate:"1 kg/wk", color:"#EA580C" },
  { n:5, name:"MMA Entry", wk:[17,24], wt:"94→86", bf:"22→17%", cal:2200, rate:"1 kg/wk", color:"#DC2626" },
  { n:6, name:"Full Combat", wk:[25,40], wt:"86→80", bf:"17→12%", cal:2350, rate:"0.5 kg/wk", color:"#7C3AED" },
  { n:7, name:"Greek God", wk:[41,52], wt:"80→78", bf:"12→10%", cal:2400, rate:"0.5 kg/wk", color:"#D97706" },
];

const getPhase = (week) => PHASES.find(p => week >= p.wk[0] && week <= p.wk[1]) || PHASES[6];
const getWeek = (startDate) => {
  if (!startDate) return 1;
  const diff = Date.now() - new Date(startDate).getTime();
  return Math.max(1, Math.min(52, Math.ceil(diff / (7 * 86400000))));
};
const getDayOfWeek = () => new Date().getDay(); // 0=Sun

// ─── WORKOUT DATA ───
const WORKOUTS = {
  1: { // Phase 1
    0: { name:"Active Recovery", focus:"Recovery", exercises:[
      {name:"Light Walk",sets:"1",reps:"15-20 min",rest:"-",notes:"Within pain limit"},
      {name:"Foam Rolling",sets:"1",reps:"10 min",rest:"-",notes:"Legs and back"},
    ]},
    1: { name:"Push Day", focus:"V-Taper Shoulders + Chest", exercises:[
      {name:"Seated Shoulder Press",sets:"4",reps:"12",rest:"90s",notes:"V-TAPER — shoulders first",star:true},
      {name:"Lateral Raises",sets:"4",reps:"15",rest:"60s",notes:"V-TAPER — wide delts",star:true},
      {name:"Flat Dumbbell Press",sets:"3",reps:"12",rest:"90s",notes:"Squeeze chest at top"},
      {name:"Incline Dumbbell Press",sets:"3",reps:"12",rest:"90s",notes:"30° angle"},
      {name:"Overhead Tricep Extension",sets:"3",reps:"12",rest:"60s",notes:"EZ bar or dumbbell"},
      {name:"Knee Push-ups",sets:"2",reps:"MAX",rest:"60s",notes:"Track progress weekly"},
    ]},
    2: { name:"Pull Day", focus:"V-Taper Back + Biceps", exercises:[
      {name:"Bent Over Rows",sets:"4",reps:"12",rest:"90s",notes:"V-TAPER — wide back",star:true},
      {name:"Single Arm DB Rows",sets:"3",reps:"12 each",rest:"60s",notes:"Lats — support on bench"},
      {name:"Face Pulls",sets:"3",reps:"15",rest:"60s",notes:"Rear delts + posture"},
      {name:"Dead Hang",sets:"3",reps:"MAX hold",rest:"60s",notes:"Grip + pull-up prep"},
      {name:"Pull-up Negatives",sets:"3",reps:"5",rest:"90s",notes:"Calisthenics foundation",star:true},
      {name:"Barbell Curls",sets:"3",reps:"12",rest:"60s",notes:"No swinging"},
    ]},
    3: { name:"Legs", focus:"Back/Knee Safe", exercises:[
      {name:"Hip Thrusts",sets:"4",reps:"12",rest:"90s",notes:"Glute power for MMA",star:true},
      {name:"Glute Bridges",sets:"3",reps:"15",rest:"60s",notes:"Bodyweight, squeeze top"},
      {name:"Romanian Deadlift",sets:"3",reps:"10",rest:"90s",notes:"Light — feel hamstrings"},
      {name:"Goblet Squats",sets:"3",reps:"12",rest:"90s",notes:"Partial ROM if knees hurt"},
      {name:"Calf Raises",sets:"4",reps:"20",rest:"45s",notes:"Slow and controlled"},
      {name:"Bird Dogs",sets:"3",reps:"10 each",rest:"30s",notes:"Core + back stability"},
    ]},
    4: { name:"Push Light", focus:"Extra V-Taper Shoulders", exercises:[
      {name:"Lateral Raises",sets:"4",reps:"15",rest:"60s",notes:"V-TAPER — extra volume",star:true},
      {name:"Arnold Press",sets:"3",reps:"12",rest:"60s",notes:"Rotation movement"},
      {name:"Incline DB Flyes",sets:"3",reps:"12",rest:"60s",notes:"Stretch at bottom"},
      {name:"Front Raises",sets:"3",reps:"12",rest:"60s",notes:"Alternate arms"},
      {name:"Tricep Dips",sets:"3",reps:"12",rest:"60s",notes:"Bench dips — feet on floor"},
      {name:"Push-ups",sets:"3",reps:"MAX",rest:"60s",notes:"Track your count!"},
    ]},
    5: { name:"Pull + Core", focus:"Lats + Abs", exercises:[
      {name:"Inverted Rows",sets:"4",reps:"10",rest:"90s",notes:"Bar in cage, feet on floor"},
      {name:"DB Pullovers",sets:"3",reps:"12",rest:"60s",notes:"V-TAPER — lats + serratus",star:true},
      {name:"Reverse Flyes",sets:"3",reps:"15",rest:"60s",notes:"Rear delts"},
      {name:"Hammer Curls",sets:"3",reps:"12",rest:"60s",notes:"Forearms + grip for BJJ"},
      {name:"Planks",sets:"3",reps:"30-45s",rest:"60s",notes:"Build to 60s"},
      {name:"Dead Bugs",sets:"3",reps:"10 each",rest:"30s",notes:"Core stability"},
    ]},
    6: { name:"Legs + Conditioning", focus:"Power + Endurance", exercises:[
      {name:"Step-ups",sets:"3",reps:"12 each",rest:"60s",notes:"Low bench"},
      {name:"Sumo Squats",sets:"3",reps:"12",rest:"90s",notes:"Wide stance, toes out"},
      {name:"Standing Calf Raises",sets:"4",reps:"20",rest:"45s",notes:"Hold at top"},
      {name:"McGill Curl-ups",sets:"3",reps:"10",rest:"30s",notes:"Safe ab exercise"},
      {name:"Side Planks",sets:"3",reps:"20s each",rest:"30s",notes:"Obliques"},
      {name:"Shadow Boxing",sets:"3",reps:"1 min",rest:"30s",notes:"Conditioning start"},
    ]},
  }
};

// ─── MEALS DATA ───
const getMeals = (phase) => {
  const p = phase?.n || 1;
  const oats = p <= 4 ? "50g" : p <= 5 ? "50g" : p <= 6 ? "60g" : "70g";
  const milk = p <= 6 ? "200ml" : "250ml";
  const seeds = p <= 5 ? "20g" : p <= 6 ? "25g" : "30g";
  const kaju = p <= 5 ? "10g" : "15g";
  const rice = p <= 5 ? "200g" : p <= 6 ? "250g" : "300g";
  const dal = p <= 5 ? "50g" : p <= 6 ? "60g" : "75g";
  const tikki = p <= 5 ? "30g dry" : p <= 6 ? "40g dry" : "50g dry";
  const chap = p <= 6 ? "2" : "3";
  const chana = p <= 5 ? "25g" : "30g";
  return [
    { time:"7:30 AM", name:"Breakfast", icon:"🥣", items:[
      {food:"Pintola HP Oats",qty:oats,cal:p<=4?196:(p<=5?196:(p<=6?235:275)),pro:p<=4?12.5:(p<=5?12.5:(p<=6?15:17.5)),fat:p<=4?4:(p<=5?4:(p<=6?4.8:5.6))},
      {food:"Amul Gold Milk",qty:milk,cal:p<=6?130:163,pro:p<=6?7:8.8,fat:p<=6?6.6:8.3},
      {food:"MyProtein Impact Whey",qty:"25g (1 scoop)",cal:103,pro:21,fat:1.9},
      {food:"Banana",qty:p<=6?"1 medium":"1 large",cal:p<=6?89:105,pro:1.1,fat:0.3},
      {food:"Mixed Seeds",qty:seeds,cal:p<=5?115:p<=6?144:172,pro:p<=5?4:p<=6?5:6,fat:p<=5?9:p<=6?11.3:13.5},
      {food:"Kaju (Cashews)",qty:kaju,cal:p<=5?55:83,pro:p<=5?1.8:2.7,fat:p<=5?4.4:6.6},
    ]},
    { time:"10:30 AM", name:"Mid-Morning", icon:"🥜", items:[
      {food:"Almonds (Happilo)",qty:p<=5?"10g":"15g",cal:p<=5?58:87,pro:p<=5?2.1:3.2,fat:p<=5?5:7.5},
      {food:"Walnuts (Happilo)",qty:p<=6?"10g":"15g",cal:p<=6?65:98,pro:p<=6?1.5:2.3,fat:p<=6?6.5:9.8},
    ]},
    { time:"1:00 PM", name:"Lunch — Telugu Thali", icon:"🍚", items:[
      {food:"Cooked White Rice",qty:rice,cal:p<=5?260:p<=6?325:390,pro:p<=5?5:p<=6?6.3:7.5,fat:0.5},
      {food:"Toor Dal (Tata Sampann)",qty:dal,cal:p<=5?60:p<=6?72:90,pro:p<=5?3.5:p<=6?4.2:5.3,fat:0.3},
      {food:"Curry (Aloo/Beans)",qty:"1 serving",cal:75,pro:1.5,fat:4},
      {food:"Rasam (MTR)",qty:p<=6?"100ml":"150ml",cal:p<=6?25:38,pro:1,fat:1},
    ]},
    { time:"5:00 PM", name:"Dinner (Pre-Workout)", icon:"🫓", items:[
      {food:"Soya Chapati",qty:`${chap} chapatis`,cal:p<=6?350:525,pro:p<=6?26:39,fat:p<=6?5.5:8.3},
      {food:"Soya Tikki (Nutrela)",qty:tikki,cal:p<=5?104:p<=6?139:173,pro:p<=5?15.6:p<=6?20.8:26,fat:0.5},
      {food:"Base Curry",qty:"1 serving",cal:100,pro:2,fat:5},
    ]},
    { time:"7:45 PM", name:"Post-Workout", icon:"🥤", items:[
      {food:"MyProtein Impact Whey",qty:"25g (water)",cal:103,pro:21,fat:1.9},
    ]},
    { time:"9:30 PM", name:"Before Bed", icon:"🌙", items:[
      {food:"Roasted Chana",qty:chana,cal:p<=5?90:108,pro:p<=5?5:6,fat:p<=5?1.5:1.8},
    ]},
  ];
};

// ─── APP COMPONENT ───
export default function App() {
  const [page, setPage] = useState("home");
  const [startDate, setStartDate] = useState(null);
  const [entries, setEntries] = useState([]);
  const [showVideo, setShowVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setupMode, setSetupMode] = useState(false);
  const [tempDate, setTempDate] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [bfInput, setBfInput] = useState("");

  // Load data
  useEffect(() => {
    (async () => {
      try {
        const sd = await window.storage.get("startDate");
        if (sd) setStartDate(sd.value);
        const ent = await window.storage.get("entries");
        if (ent) setEntries(JSON.parse(ent.value));
      } catch(e) {}
      setLoading(false);
    })();
  }, []);

  const saveEntry = async () => {
    if (!weightInput && !bfInput) return;
    const entry = { date: new Date().toISOString().split("T")[0], weight: weightInput, bf: bfInput, week: getWeek(startDate) };
    const updated = [...entries, entry];
    setEntries(updated);
    await window.storage.set("entries", JSON.stringify(updated));
    setWeightInput(""); setBfInput("");
  };

  const handleStart = async () => {
    if (!tempDate) return;
    setStartDate(tempDate);
    await window.storage.set("startDate", tempDate);
    setSetupMode(false);
  };

  const week = getWeek(startDate);
  const phase = getPhase(week);
  const dayIdx = getDayOfWeek();
  const workout = WORKOUTS[1]?.[dayIdx];
  const meals = getMeals(phase);
  const totalCal = meals.reduce((s,m) => s + m.items.reduce((a,i) => a + (i.cal||0), 0), 0);
  const totalPro = meals.reduce((s,m) => s + m.items.reduce((a,i) => a + (i.pro||0), 0), 0);

  if (loading) return <div style={styles.loader}><div style={styles.pulse}>B</div></div>;

  // ─── SETUP SCREEN ───
  if (!startDate || setupMode) return (
    <div style={styles.app}>
      <div style={{...styles.setupWrap}}>
        <div style={styles.setupIcon}>🔥</div>
        <h1 style={styles.setupTitle}>Bhavani's Blueprint</h1>
        <p style={styles.setupSub}>Set your Day 1 to begin your transformation</p>
        <input type="date" value={tempDate} onChange={e => setTempDate(e.target.value)}
          style={styles.dateInput} />
        <button onClick={handleStart} style={styles.startBtn}>
          Begin Journey
        </button>
      </div>
    </div>
  );

  // ─── VIDEO MODAL ───
  const VideoModal = () => showVideo ? (
    <div style={styles.modalOverlay} onClick={() => setShowVideo(null)}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.modalClose} onClick={() => setShowVideo(null)}>✕</button>
        <div style={styles.videoWrap}>
          <iframe src={`https://www.youtube.com/embed/${YT[showVideo] || "dQw4w9WdQcA"}?autoplay=1`}
            style={styles.iframe} allow="autoplay; encrypted-media" allowFullScreen title={showVideo} />
        </div>
        <h3 style={styles.videoTitle}>{showVideo}</h3>
      </div>
    </div>
  ) : null;

  // ─── HOME PAGE ───
  const HomePage = () => (
    <div style={styles.pageContent}>
      {/* Hero */}
      <div style={{...styles.hero, background: `linear-gradient(135deg, ${phase.color}22, ${phase.color}08)`}}>
        <div style={styles.heroPhase}>
          <span style={{...styles.phaseBadge, background: phase.color}}>Phase {phase.n}</span>
          <span style={styles.phaseName}>{phase.name}</span>
        </div>
        <div style={styles.heroWeek}>Week {week} of 52</div>
        <div style={styles.progressBarOuter}>
          <div style={{...styles.progressBarInner, width: `${(week/52)*100}%`, background: phase.color}} />
        </div>
        <div style={styles.heroStats}>
          <div style={styles.heroStat}><span style={styles.heroStatNum}>{phase.wt.split("→")[0]}</span><span style={styles.heroStatLabel}>Start kg</span></div>
          <div style={{...styles.heroStatArrow, color: phase.color}}>→</div>
          <div style={styles.heroStat}><span style={styles.heroStatNum}>{phase.wt.split("→")[1]}</span><span style={styles.heroStatLabel}>Target kg</span></div>
          <div style={styles.heroDivider} />
          <div style={styles.heroStat}><span style={styles.heroStatNum}>{phase.cal}</span><span style={styles.heroStatLabel}>Calories</span></div>
          <div style={styles.heroStat}><span style={styles.heroStatNum}>{phase.rate}</span><span style={styles.heroStatLabel}>Loss Rate</span></div>
        </div>
      </div>

      {/* Today's Quick View */}
      <h2 style={styles.sectionTitle}>Today — {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIdx]}</h2>
      <div style={styles.cardRow}>
        <div style={{...styles.quickCard, borderLeft: `3px solid ${phase.color}`}} onClick={() => setPage("workout")}>
          <div style={styles.quickIcon}>🏋️</div>
          <div style={styles.quickInfo}>
            <div style={styles.quickLabel}>{workout?.name || "Rest"}</div>
            <div style={styles.quickSub}>{workout?.focus || "Recovery day"}</div>
          </div>
          <div style={styles.quickArrow}>›</div>
        </div>
        <div style={{...styles.quickCard, borderLeft: "3px solid #0D9488"}} onClick={() => setPage("diet")}>
          <div style={styles.quickIcon}>🍽️</div>
          <div style={styles.quickInfo}>
            <div style={styles.quickLabel}>{Math.round(totalCal)} cal</div>
            <div style={styles.quickSub}>{Math.round(totalPro)}g protein today</div>
          </div>
          <div style={styles.quickArrow}>›</div>
        </div>
      </div>

      {/* Log Weight */}
      <h2 style={styles.sectionTitle}>Log Today's Stats</h2>
      <div style={styles.logCard}>
        <div style={styles.logRow}>
          <div style={styles.logField}>
            <label style={styles.logLabel}>Weight (kg)</label>
            <input type="number" step="0.1" value={weightInput} onChange={e => setWeightInput(e.target.value)}
              style={styles.logInput} placeholder="e.g. 108.5" />
          </div>
          <div style={styles.logField}>
            <label style={styles.logLabel}>Body Fat %</label>
            <input type="number" step="0.1" value={bfInput} onChange={e => setBfInput(e.target.value)}
              style={styles.logInput} placeholder="e.g. 35" />
          </div>
        </div>
        <button onClick={saveEntry} style={{...styles.logBtn, background: phase.color}}>Save Entry</button>
      </div>

      {/* Journey Milestones */}
      <h2 style={styles.sectionTitle}>Journey Milestones</h2>
      <div style={styles.milestones}>
        {PHASES.map(p => (
          <div key={p.n} style={{...styles.milestone, opacity: week >= p.wk[0] ? 1 : 0.4, borderColor: week >= p.wk[0] && week <= p.wk[1] ? p.color : "#333"}}>
            <div style={{...styles.msNum, background: p.color}}>{p.n}</div>
            <div style={styles.msInfo}>
              <div style={styles.msName}>{p.name}</div>
              <div style={styles.msSub}>{p.wt} kg · {p.bf}</div>
            </div>
            {week >= p.wk[0] && week <= p.wk[1] && <div style={{...styles.msCurrent, color: p.color}}>NOW</div>}
            {week > p.wk[1] && <div style={styles.msDone}>✓</div>}
          </div>
        ))}
      </div>
    </div>
  );

  // ─── WORKOUT PAGE ───
  const WorkoutPage = () => (
    <div style={styles.pageContent}>
      <div style={{...styles.workoutHero, background: `linear-gradient(135deg, ${phase.color}, ${phase.color}CC)`}}>
        <div style={styles.whDay}>{["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIdx]}</div>
        <div style={styles.whName}>{workout?.name || "Active Recovery"}</div>
        <div style={styles.whFocus}>{workout?.focus || "Rest & Recover"}</div>
      </div>
      {workout?.exercises.map((ex, i) => (
        <div key={i} style={{...styles.exerciseCard, borderLeft: ex.star ? `3px solid ${phase.color}` : "3px solid transparent"}}
          onClick={() => YT[ex.name] && setShowVideo(ex.name)}>
          <div style={styles.exTop}>
            <div style={styles.exNum}>{i + 1}</div>
            <div style={styles.exInfo}>
              <div style={styles.exName}>{ex.name} {ex.star && <span style={{color: phase.color}}>★</span>}</div>
              <div style={styles.exDetail}>{ex.sets} × {ex.reps} · Rest {ex.rest}</div>
            </div>
            {YT[ex.name] && <div style={styles.playBtn}>▶</div>}
          </div>
          {ex.notes && <div style={{...styles.exNotes, color: ex.star ? phase.color : "#888"}}>{ex.notes}</div>}
        </div>
      ))}
      {!workout && <div style={styles.restDay}>
        <div style={styles.restIcon}>🧘</div>
        <h3 style={styles.restTitle}>Active Recovery Day</h3>
        <p style={styles.restText}>Light walk (15-20 min), full body stretching, foam rolling. Focus on hips and hamstrings. Stop before any pain.</p>
      </div>}
    </div>
  );

  // ─── DIET PAGE ───
  const DietPage = () => (
    <div style={styles.pageContent}>
      <div style={{...styles.dietHero}}>
        <div style={styles.dhTitle}>Today's Nutrition</div>
        <div style={styles.dhMacros}>
          <div style={styles.dhMacro}><span style={styles.dhNum}>{Math.round(totalCal)}</span><span style={styles.dhLabel}>cal</span></div>
          <div style={styles.dhDivider} />
          <div style={styles.dhMacro}><span style={styles.dhNum}>{Math.round(totalPro)}g</span><span style={styles.dhLabel}>protein</span></div>
          <div style={styles.dhDivider} />
          <div style={styles.dhMacro}><span style={{...styles.dhNum, color: phase.color}}>Phase {phase.n}</span><span style={styles.dhLabel}>{phase.name}</span></div>
        </div>
      </div>
      {meals.map((meal, mi) => (
        <div key={mi} style={styles.mealCard}>
          <div style={styles.mealHeader}>
            <span style={styles.mealIcon}>{meal.icon}</span>
            <div>
              <div style={styles.mealName}>{meal.name}</div>
              <div style={styles.mealTime}>{meal.time}</div>
            </div>
            <div style={styles.mealTotal}>{Math.round(meal.items.reduce((a,i) => a+i.cal,0))} cal</div>
          </div>
          {meal.items.map((item, ii) => (
            <div key={ii} style={{...styles.foodItem, background: ii%2===1 ? "#1a1a1a" : "transparent"}}>
              <div style={styles.foodName}>{item.food}<span style={styles.foodQty}>{item.qty}</span></div>
              <div style={styles.foodMacros}>
                <span>{item.cal} cal</span>
                <span style={styles.foodPro}>{item.pro}g P</span>
                <span>{item.fat}g F</span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // ─── PROGRESS PAGE ───
  const ProgressPage = () => {
    const sorted = [...entries].sort((a,b) => a.date.localeCompare(b.date));
    const maxW = Math.max(110, ...sorted.map(e => +e.weight || 0));
    const minW = Math.min(78, ...sorted.filter(e => +e.weight).map(e => +e.weight));
    return (
      <div style={styles.pageContent}>
        <h2 style={{...styles.sectionTitle, marginTop: 16}}>Weight Progress</h2>
        {sorted.length > 0 ? (
          <div style={styles.chartCard}>
            <div style={styles.chart}>
              {sorted.filter(e => +e.weight).map((e, i) => {
                const pct = ((+e.weight - minW) / (maxW - minW)) * 100;
                return (
                  <div key={i} style={styles.chartCol}>
                    <div style={styles.chartVal}>{e.weight}</div>
                    <div style={{...styles.chartBar, height: `${Math.max(8, pct)}%`, background: phase.color}} />
                    <div style={styles.chartDate}>{e.date.slice(5)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <p style={styles.emptyText}>No entries yet. Log your weight from the home page!</p>
          </div>
        )}
        <h2 style={styles.sectionTitle}>All Entries</h2>
        {sorted.length > 0 ? sorted.reverse().map((e, i) => (
          <div key={i} style={{...styles.entryRow, background: i%2===0 ? "#111" : "transparent"}}>
            <span style={styles.entryDate}>{e.date}</span>
            <span style={styles.entryWk}>Wk {e.week}</span>
            {e.weight && <span style={styles.entryWeight}>{e.weight} kg</span>}
            {e.bf && <span style={styles.entryBf}>{e.bf}% BF</span>}
          </div>
        )) : null}

        {/* Target milestones */}
        <h2 style={styles.sectionTitle}>Target Milestones</h2>
        {[
          {w:4,wt:"106",bf:"33%",push:"10",pull:"Negatives",run:"15 min walk"},
          {w:8,wt:"102",bf:"29%",push:"20",pull:"3-5 band",run:"20 min walk/jog"},
          {w:16,wt:"94",bf:"22%",push:"4×20",pull:"5 real",run:"30 min jog"},
          {w:24,wt:"86",bf:"17%",push:"30+",pull:"10",run:"25 min run"},
          {w:40,wt:"80",bf:"12%",push:"45+",pull:"18",run:"30 min fast"},
          {w:52,wt:"78",bf:"10%",push:"50",pull:"20",run:"30 min race pace"},
        ].map((m,i) => (
          <div key={i} style={{...styles.targetRow, opacity: week >= m.w ? 1 : 0.5, borderLeft: `3px solid ${week >= m.w ? "#16A34A" : "#333"}`}}>
            <div style={styles.targetWk}>Wk {m.w}</div>
            <div style={styles.targetInfo}>
              <span style={styles.targetWeight}>{m.wt} kg</span>
              <span style={styles.targetBf}>{m.bf}</span>
              <span>{m.push} push-ups</span>
              <span>{m.pull} pull-ups</span>
              <span>{m.run}</span>
            </div>
            {week >= m.w && <span style={styles.targetCheck}>✓</span>}
          </div>
        ))}
      </div>
    );
  };

  // ─── CARDIO PAGE ───
  const CardioPage = () => {
    const cardioPhases = [
      {wk:"1-2",act:"Slow walk / Stationary cycling",dur:"15 min",int:"Very easy",steps:"1,500-2,000"},
      {wk:"3-4",act:"Walk intervals + Light jump rope",dur:"20 min",int:"Easy",steps:"2,500-3,000"},
      {wk:"5-6",act:"Continuous walk + Jump rope",dur:"25 min",int:"Moderate",steps:"3,500-4,000"},
      {wk:"7-8",act:"Walk/jog intervals + HIIT rope",dur:"30 min",int:"Mod-Hard",steps:"4,500-5,500"},
      {wk:"9-10",act:"Jog intervals + Burpees",dur:"25 min",int:"Hard",steps:"6,000-7,000"},
      {wk:"11-12",act:"Continuous jog + Shadow boxing",dur:"30 min",int:"Hard",steps:"7,500-8,500"},
      {wk:"13-16",act:"MMA conditioning circuit",dur:"30-40 min",int:"Fight pace",steps:"9,000-10,000+"},
      {wk:"17-24",act:"MMA gym + Running 2x/week",dur:"20-25 min",int:"Building",steps:"10,000+"},
      {wk:"25-40",act:"MMA 4-5x + Running 2x/week",dur:"25-30 min",int:"High",steps:"12,000+"},
      {wk:"41-52",act:"Full MMA + 30 min high-speed",dur:"30 min",int:"Race pace",steps:"15,000"},
    ];
    const isCurrent = (wk) => {
      const [s,e] = wk.split("-").map(Number);
      return week >= s && week <= (e || s);
    };
    return (
      <div style={styles.pageContent}>
        <h2 style={{...styles.sectionTitle, marginTop: 16}}>Morning Cardio (6:15-7:00 AM)</h2>
        {cardioPhases.map((cp, i) => (
          <div key={i} style={{...styles.cardioRow, background: isCurrent(cp.wk) ? `${phase.color}18` : i%2===0 ? "#111" : "transparent",
            borderLeft: isCurrent(cp.wk) ? `3px solid ${phase.color}` : "3px solid transparent"}}>
            <div style={styles.cardioWk}>Wk {cp.wk}</div>
            <div style={styles.cardioInfo}>
              <div style={{...styles.cardioAct, color: isCurrent(cp.wk) ? phase.color : "#eee"}}>{cp.act}</div>
              <div style={styles.cardioMeta}>{cp.dur} · {cp.int} · {cp.steps} steps</div>
            </div>
            {isCurrent(cp.wk) && <div style={{...styles.cardioBadge, background: phase.color}}>NOW</div>}
          </div>
        ))}
        <div style={styles.safetyCard}>
          <div style={styles.safetyTitle}>⚠️ Back Pain Rules</div>
          <div style={styles.safetyRule}>Stop BEFORE pain starts, not AT pain</div>
          <div style={styles.safetyRule}>Ice if any soreness after</div>
          <div style={styles.safetyRule}>Stretch hip flexors daily</div>
          <div style={styles.safetyRule}>Core work helps long-term</div>
        </div>
      </div>
    );
  };

  // ─── RENDER ───
  return (
    <div style={styles.app}>
      <VideoModal />
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerTitle}>Blueprint</span>
          <span style={{...styles.headerPhase, color: phase.color}}>Phase {phase.n}</span>
        </div>
        <button style={styles.gearBtn} onClick={() => setSetupMode(true)}>⚙️</button>
      </div>
      {/* Content */}
      <div style={styles.content}>
        {page === "home" && <HomePage />}
        {page === "workout" && <WorkoutPage />}
        {page === "diet" && <DietPage />}
        {page === "progress" && <ProgressPage />}
        {page === "cardio" && <CardioPage />}
      </div>
      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {[
          {id:"home",icon:"🏠",label:"Home"},
          {id:"workout",icon:"🏋️",label:"Workout"},
          {id:"diet",icon:"🍽️",label:"Diet"},
          {id:"progress",icon:"📊",label:"Progress"},
          {id:"cardio",icon:"🏃",label:"Cardio"},
        ].map(tab => (
          <button key={tab.id} onClick={() => setPage(tab.id)}
            style={{...styles.tab, color: page === tab.id ? phase.color : "#666"}}>
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={{...styles.tabLabel, color: page === tab.id ? phase.color : "#666"}}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── STYLES ───
const styles = {
  app: { background:"#000", color:"#fff", minHeight:"100vh", fontFamily:"'SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif", display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative" },
  loader: { display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#000" },
  pulse: { width:60, height:60, borderRadius:30, background:"#3B82F6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700, color:"#fff", animation:"pulse 1.5s infinite" },

  // Setup
  setupWrap: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", padding:32 },
  setupIcon: { fontSize:64, marginBottom:24 },
  setupTitle: { fontSize:32, fontWeight:800, letterSpacing:"-0.03em", marginBottom:8 },
  setupSub: { color:"#888", fontSize:15, marginBottom:40 },
  dateInput: { width:"100%", maxWidth:300, padding:"14px 18px", borderRadius:14, border:"1px solid #333", background:"#111", color:"#fff", fontSize:17, marginBottom:20, outline:"none" },
  startBtn: { width:"100%", maxWidth:300, padding:"16px", borderRadius:14, background:"#3B82F6", color:"#fff", fontSize:17, fontWeight:700, border:"none", cursor:"pointer", letterSpacing:"-0.01em" },

  // Header
  header: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid #1a1a1a", position:"sticky", top:0, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(20px)", zIndex:50 },
  headerLeft: { display:"flex", alignItems:"center", gap:10 },
  headerTitle: { fontSize:22, fontWeight:800, letterSpacing:"-0.03em" },
  headerPhase: { fontSize:13, fontWeight:600, opacity:0.8 },
  gearBtn: { background:"none", border:"none", fontSize:20, cursor:"pointer", padding:4 },

  // Content
  content: { flex:1, paddingBottom:90, overflowY:"auto" },
  pageContent: { padding:"0 16px 20px" },

  // Hero
  hero: { borderRadius:20, padding:"24px 20px", margin:"16px 0" },
  heroPhase: { display:"flex", alignItems:"center", gap:10, marginBottom:12 },
  phaseBadge: { padding:"4px 12px", borderRadius:20, fontSize:12, fontWeight:700, color:"#fff" },
  phaseName: { fontSize:20, fontWeight:700, letterSpacing:"-0.02em" },
  heroWeek: { fontSize:14, color:"#aaa", marginBottom:12 },
  progressBarOuter: { height:4, background:"#222", borderRadius:2, marginBottom:20 },
  progressBarInner: { height:4, borderRadius:2, transition:"width 0.5s ease" },
  heroStats: { display:"flex", alignItems:"center", gap:16 },
  heroStat: { display:"flex", flexDirection:"column" },
  heroStatNum: { fontSize:20, fontWeight:700 },
  heroStatLabel: { fontSize:11, color:"#888", marginTop:2 },
  heroStatArrow: { fontSize:20, fontWeight:700 },
  heroDivider: { width:1, height:32, background:"#333" },

  // Section
  sectionTitle: { fontSize:18, fontWeight:700, letterSpacing:"-0.02em", margin:"24px 0 12px", color:"#eee" },

  // Quick Cards
  cardRow: { display:"flex", flexDirection:"column", gap:10 },
  quickCard: { display:"flex", alignItems:"center", padding:"16px", background:"#111", borderRadius:14, cursor:"pointer", gap:14 },
  quickIcon: { fontSize:28 },
  quickInfo: { flex:1 },
  quickLabel: { fontSize:16, fontWeight:700 },
  quickSub: { fontSize:13, color:"#888", marginTop:2 },
  quickArrow: { fontSize:24, color:"#555" },

  // Log
  logCard: { background:"#111", borderRadius:16, padding:20 },
  logRow: { display:"flex", gap:12, marginBottom:14 },
  logField: { flex:1 },
  logLabel: { fontSize:12, color:"#888", marginBottom:6, display:"block" },
  logInput: { width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid #2a2a2a", background:"#0a0a0a", color:"#fff", fontSize:16, outline:"none", boxSizing:"border-box" },
  logBtn: { width:"100%", padding:"14px", borderRadius:12, border:"none", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer" },

  // Milestones
  milestones: { display:"flex", flexDirection:"column", gap:8 },
  milestone: { display:"flex", alignItems:"center", padding:"14px 16px", background:"#111", borderRadius:12, gap:14, border:"1px solid #222", transition:"all 0.3s" },
  msNum: { width:32, height:32, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff", flexShrink:0 },
  msInfo: { flex:1 },
  msName: { fontSize:15, fontWeight:600 },
  msSub: { fontSize:12, color:"#888", marginTop:2 },
  msCurrent: { fontSize:11, fontWeight:800, letterSpacing:"0.05em" },
  msDone: { color:"#16A34A", fontSize:18, fontWeight:700 },

  // Workout
  workoutHero: { borderRadius:20, padding:"28px 24px", margin:"16px 0 20px", color:"#fff" },
  whDay: { fontSize:14, opacity:0.7, fontWeight:500 },
  whName: { fontSize:28, fontWeight:800, letterSpacing:"-0.03em", marginTop:4 },
  whFocus: { fontSize:15, opacity:0.8, marginTop:4 },
  exerciseCard: { background:"#111", borderRadius:14, padding:"16px", marginBottom:10, cursor:"pointer", transition:"transform 0.15s" },
  exTop: { display:"flex", alignItems:"center", gap:14 },
  exNum: { width:28, height:28, borderRadius:14, background:"#222", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#aaa", flexShrink:0 },
  exInfo: { flex:1 },
  exName: { fontSize:15, fontWeight:700 },
  exDetail: { fontSize:13, color:"#888", marginTop:2 },
  exNotes: { fontSize:12, marginTop:8, paddingLeft:42 },
  playBtn: { width:36, height:36, borderRadius:18, background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#fff" },
  restDay: { textAlign:"center", padding:"60px 20px" },
  restIcon: { fontSize:64, marginBottom:16 },
  restTitle: { fontSize:22, fontWeight:700, marginBottom:8 },
  restText: { color:"#888", fontSize:14, lineHeight:"1.6" },

  // Diet
  dietHero: { background:"linear-gradient(135deg, #0D9488, #0D948888)", borderRadius:20, padding:"24px", margin:"16px 0 20px" },
  dhTitle: { fontSize:14, opacity:0.8, fontWeight:500, marginBottom:16 },
  dhMacros: { display:"flex", alignItems:"center", gap:20 },
  dhMacro: { display:"flex", flexDirection:"column" },
  dhNum: { fontSize:24, fontWeight:800 },
  dhLabel: { fontSize:11, opacity:0.7, marginTop:2 },
  dhDivider: { width:1, height:32, background:"rgba(255,255,255,0.2)" },
  mealCard: { background:"#111", borderRadius:16, marginBottom:12, overflow:"hidden" },
  mealHeader: { display:"flex", alignItems:"center", padding:"14px 16px", gap:12 },
  mealIcon: { fontSize:24 },
  mealName: { fontSize:15, fontWeight:700 },
  mealTime: { fontSize:12, color:"#888" },
  mealTotal: { marginLeft:"auto", fontSize:14, fontWeight:700, color:"#0D9488" },
  foodItem: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 16px" },
  foodName: { fontSize:14, fontWeight:500, flex:1 },
  foodQty: { marginLeft:8, fontSize:12, color:"#666" },
  foodMacros: { display:"flex", gap:10, fontSize:12, color:"#888" },
  foodPro: { color:"#0D9488", fontWeight:600 },

  // Progress
  chartCard: { background:"#111", borderRadius:16, padding:"20px 16px", marginBottom:16 },
  chart: { display:"flex", alignItems:"flex-end", height:180, gap:8 },
  chartCol: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", minWidth:30 },
  chartVal: { fontSize:10, color:"#aaa", marginBottom:4 },
  chartBar: { width:"100%", borderRadius:4, minHeight:8, transition:"height 0.3s" },
  chartDate: { fontSize:9, color:"#666", marginTop:4 },
  emptyState: { textAlign:"center", padding:"40px 20px" },
  emptyIcon: { fontSize:48, marginBottom:12 },
  emptyText: { color:"#666", fontSize:14 },
  entryRow: { display:"flex", padding:"12px 16px", gap:16, alignItems:"center", borderRadius:8 },
  entryDate: { fontSize:13, color:"#aaa", width:90 },
  entryWk: { fontSize:12, color:"#555", width:40 },
  entryWeight: { fontSize:14, fontWeight:700 },
  entryBf: { fontSize:13, color:"#D97706" },
  targetRow: { display:"flex", alignItems:"center", padding:"14px 16px", background:"#111", borderRadius:12, marginBottom:8, gap:14 },
  targetWk: { fontSize:13, fontWeight:700, color:"#aaa", width:50 },
  targetInfo: { display:"flex", gap:12, flex:1, fontSize:12, color:"#ccc", flexWrap:"wrap" },
  targetWeight: { fontWeight:700, color:"#fff" },
  targetBf: { color:"#D97706" },
  targetCheck: { color:"#16A34A", fontSize:18, fontWeight:700 },

  // Cardio
  cardioRow: { display:"flex", alignItems:"center", padding:"14px 16px", borderRadius:12, marginBottom:6, gap:14 },
  cardioWk: { fontSize:12, fontWeight:700, color:"#888", width:55, flexShrink:0 },
  cardioInfo: { flex:1 },
  cardioAct: { fontSize:14, fontWeight:600 },
  cardioMeta: { fontSize:12, color:"#666", marginTop:2 },
  cardioBadge: { padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:700, color:"#fff" },
  safetyCard: { background:"#1a0a0a", border:"1px solid #331111", borderRadius:16, padding:20, marginTop:20 },
  safetyTitle: { fontSize:16, fontWeight:700, marginBottom:12, color:"#DC2626" },
  safetyRule: { fontSize:13, color:"#ccc", padding:"6px 0", borderBottom:"1px solid #1a1a1a" },

  // Modal
  modalOverlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 },
  modal: { background:"#111", borderRadius:20, width:"100%", maxWidth:460, overflow:"hidden" },
  modalClose: { position:"absolute", right:16, top:16, background:"rgba(255,255,255,0.1)", border:"none", color:"#fff", width:32, height:32, borderRadius:16, fontSize:16, cursor:"pointer", zIndex:101 },
  videoWrap: { position:"relative", paddingBottom:"56.25%", height:0 },
  iframe: { position:"absolute", top:0, left:0, width:"100%", height:"100%", border:"none" },
  videoTitle: { padding:"16px 20px", fontSize:17, fontWeight:700 },

  // Tab Bar
  tabBar: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, display:"flex", background:"rgba(10,10,10,0.95)", backdropFilter:"blur(20px)", borderTop:"1px solid #1a1a1a", padding:"8px 0 28px", zIndex:50 },
  tab: { flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"8px 0" },
  tabIcon: { fontSize:22 },
  tabLabel: { fontSize:10, fontWeight:600 },
};
