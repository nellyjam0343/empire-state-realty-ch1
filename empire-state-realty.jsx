import { useState, useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════
   THE STORY: YOUR FIRST WEEK IN REAL ESTATE
   Chapter 1 — License Law
   Setting: The Bronx, NYC
   ════════════════════════════════════════════════════ */

const SCENES = [
  {
    day: 1, title: "The Offer", location: "Grand Concourse, The Bronx",
    narrative: [
      {speaker:"narrator", text:"Monday morning. You step off the D train at 161st Street, coffee in hand, heart pounding. Today you start at Concourse Realty — your first job in real estate."},
      {speaker:"marcus", text:"\"Welcome to the team.\" Marcus Rivera — your new broker — shakes your hand at the door of a narrow office above a bodega. \"Before we do anything, we gotta get something straight.\""},
      {speaker:"marcus", text:"\"You're not my employee. You're an Independent Contractor. That's a big deal — it changes everything about how this works.\""},
    ],
    learn: {
      title: "Independent Contractor vs. Employee", emoji: "📋",
      cards: [
        {title:"You're a 1099, Not a W-2", text:"As an Independent Contractor, you get a <b>1099 Misc</b> at tax time — not a W-2. The IRS calls you a <b>\"statutory non-employee independent contractor.\"</b> That's your official classification."},
        {title:"No Benefits. Period.", text:"No health insurance. No 401K. No vacation days. No sick pay. No dental. Nothing. You earn only what you close. That's the deal."},
        {title:"Supervised, Not Dictated", text:"Your broker can <b>supervise and guide</b> you — but they <b>cannot dictate</b> your schedule, methods, or hours. If they start telling you exactly when and how to work? That crosses the line into employment."},
        {title:"The IC Agreement", text:"You'll sign an Independent Contractor Relationship Agreement with your broker. It must be <b>reviewed every 12 to 15 months</b> to stay current."},
      ]
    },
    challenge: {
      setup: "Marcus slides a stack of paperwork across the desk. \"Sign here, here, and here. Oh — and make sure you file correctly at tax time.\"",
      q: "At the end of the year, which tax form will you receive as a real estate agent?",
      a: ["W-2 — I'm on Marcus's payroll", "1099 Misc — I'm an independent contractor", "W-4 — standard withholding form", "1040 — personal income tax"],
      correct: 1,
      why: "You get a 1099 Misc because you're an Independent Contractor — NOT an employee. Marcus doesn't withhold taxes for you. That's your responsibility now.",
      right: "\"Good. You already know more than my last hire. Let's keep going.\"",
      wrong: "\"Nah — you're not on my payroll. You're a 1099. Independent Contractor. Remember that — the IRS sure will.\"",
    }
  },
  {
    day: 1, title: "The Credentials", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Marcus pulls your license application from a folder and holds it up."},
      {speaker:"marcus", text:"\"This little piece of paper took you 77 hours of class time, a $15 exam fee, and a state exam to earn. And it cost you $65 to apply for. Don't take it lightly.\""},
      {speaker:"marcus", text:"\"The Department of State — DOS — they issued this. They run everything. Licensing, complaints, disciplinary actions. DOS is your boss, not me.\""},
    ],
    learn: {
      title: "Getting Your License", emoji: "🎓",
      cards: [
        {title: "The 77-Hour Course", text: "You must complete a <b>77-hour approved course</b> before taking the state exam. To become a Broker later? That's 77 + 75 = <b>152 hours total.</b>"},
        {title: "The Costs", text: "<b>$15</b> to reserve your exam seat. <b>$65</b> for the Salesperson license (valid 2 years). Broker license? <b>$185</b> for 2 years."},
        {title: "Age Requirements", text: "Salesperson: minimum <b>18 years old.</b> Broker or Associate Broker: minimum <b>20 years old.</b>"},
        {title: "DOS Runs Everything", text: "The <b>NYS Department of State (DOS)</b>, Division of Licensing Services issues all real estate licenses in New York. Not the Attorney General, not a board — DOS."},
      ]
    },
    challenge: {
      setup: "A young woman walks in asking about getting her license. She's 19 and eager. Marcus nudges you — \"This one's yours. Tell her what she needs to know.\"",
      q: "She asks: \"How many classroom hours do I need to become a Salesperson in New York?\"",
      a: ["45 hours", "77 hours", "120 hours", "152 hours"],
      correct: 1,
      why: "The NYS Salesperson course is 77 hours. The 152-hour figure is the total for someone going all the way to Broker (77 + 75).",
      right: "\"Perfect. You've got the details down. She looked impressed.\"",
      wrong: "\"Not quite — it's 77 hours for the Salesperson course. You gotta know your own credentials cold.\"",
    }
  },
  {
    day: 2, title: "Meet the Team", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Tuesday. Marcus introduces you to the office."},
      {speaker:"marcus", text:"\"This is Denise. She's our Associate Broker — passed the Broker exam, could run her own shop, but she likes it here. She manages the office.\""},
      {speaker:"denise", text:"\"Welcome. Quick tip — I see new agents confuse the license types all the time. Let me break it down for you before you embarrass yourself out there.\""},
    ],
    learn: {
      title: "Types of Licenses", emoji: "🏅",
      cards: [
        {title: "Associate Broker", text: "Passed the Broker exam and <b>IS a Broker</b> — but chooses to work under another broker. Has <b>no broker powers</b> within the office. Think of it as: qualified to lead, choosing to play."},
        {title: "6 Types of Broker Licenses", text: "<b>Individual, Associate, Trade Name, Partnership, Corporate, and LLC/LLP.</b> Six flavors, one exam."},
        {title: "Dual License", text: "A Salesperson CAN work for <b>two competing brokers</b> — it's called a Dual License. Both brokers must sign <b>'no objection' letters</b> to DOS."},
        {title: "Salesperson ≠ Office Manager", text: "A Salesperson <b>cannot</b> be an office manager. Period. You need at minimum an <b>Associate Broker</b> license for that."},
      ]
    },
    challenge: {
      setup: "A rival agent from down the block pops in. \"Yo Marcus, I heard your new agent is gonna manage the office while you're on vacation.\" Marcus laughs. You need to set the record straight.",
      q: "Can a Salesperson serve as the office manager?",
      a: ["Yes, if the broker approves", "Yes, after 2 years of experience", "No — you need at least an Associate Broker license", "Yes, but only temporarily"],
      correct: 2,
      why: "A Salesperson can NEVER be an office manager. You must hold at minimum an Associate Broker license. That's Denise's job, not yours — not yet.",
      right: "\"Exactly. That's why Denise is here. You'll get there.\"",
      wrong: "\"Nope — you'd need to be at least an Associate Broker for that. Know your lane.\"",
    }
  },
  {
    day: 3, title: "The Rules", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Wednesday. Quiet morning. Marcus drops a thick binder on your desk."},
      {speaker:"marcus", text:"\"License Law. You need to know this cold — not just for the exam, for your career. DOS can and will come after you if you slip.\""},
      {speaker:"marcus", text:"\"Your license is good for 2 years. To renew, you need 22.5 hours of continuing education. And you keep records of every transaction for 3 years. Every. Single. One.\""},
    ],
    learn: {
      title: "License Law — The Rules", emoji: "⚖️",
      cards: [
        {title: "2-Year License", text: "Every NYS real estate license is valid for <b>2 years</b>, then must be renewed."},
        {title: "22.5 CE Hours to Renew", text: "Continuing Education: <b>Fair Housing</b> (3 hrs), <b>Agency</b> (1-2 hrs), <b>Ethics</b> (3.75 hrs), <b>Cultural Competency</b> (2 hrs), <b>Implicit Bias</b> (2 hrs). Total: <b>22.5 hours</b>."},
        {title: "3-Year Record Keeping", text: "You must keep records of each transaction for <b>3 years</b> after the deal closes. Not 1, not 5 — three."},
        {title: "5 Business Days", text: "If your name, status, or office address changes, notify DOS within <b>5 business days.</b> Don't sleep on it."},
        {title: "Felony = Denied", text: "A felony conviction means your license application is <b>denied</b> — unless you've been <b>pardoned by the Court.</b>"},
      ]
    },
    challenge: {
      setup: "Marcus quizzes you before lunch. \"Quick — you close a deal today. How long do you have to keep the paperwork?\"",
      q: "How long must a licensee maintain records of each transaction?",
      a: ["1 year", "2 years", "3 years", "5 years"],
      correct: 2,
      why: "3 years. That's the law. Marcus keeps his files in fireproof cabinets in the back — and you should too.",
      right: "\"Three years. Good. Some agents think it's just til closing. Those agents get fined.\"",
      wrong: "\"Three years. Write it on your hand if you have to. DOS doesn't play.\"",
    }
  },
  {
    day: 3, title: "The First Listing", location: "Tremont Ave, The Bronx",
    narrative: [
      {speaker:"narrator", text:"After lunch, Marcus takes you to your first listing appointment. A two-bedroom walk-up on Tremont."},
      {speaker:"marcus", text:"\"Before we put this on the market, the seller needs to fill out the Property Conditions Disclosure Form. Leaky pipes, old roof, mold — it all goes on here.\""},
      {speaker:"marcus", text:"\"And when we find a buyer? We hand them this form when they're ready to make an offer. Not at the open house, not at closing — when they're ready to offer.\""},
    ],
    learn: {
      title: "Disclosures & Advertising", emoji: "📝",
      cards: [
        {title: "Property Condition Disclosure", text: "The seller fills this out at <b>listing time.</b> It's given to the buyer <b>when they're ready to make an offer.</b> Not before, not after."},
        {title: "Blind Ads Are Illegal", text: "An ad that's vague — like 'Beautiful house NEAR Great Neck' without the broker's name — is called a <b>Blind Ad.</b> It violates License Law."},
        {title: "Ads Must Include Broker Info", text: "Every real estate ad must clearly include the <b>broker's name</b> and be honest in its description. No tricks, no games."},
      ]
    },
    challenge: {
      setup: "A potential buyer calls about the Tremont listing. She's interested and wants to move fast. \"When do I get the disclosure form?\" she asks.",
      q: "When is the Property Condition Disclosure Form given to the buyer?",
      a: ["At the first open house", "When they're ready to make an offer", "At the closing table", "Within 48 hours of listing"],
      correct: 1,
      why: "The disclosure form goes to the buyer when they're ready to make an offer. Too early is premature, too late is a violation.",
      right: "\"Nailed it. She's putting in an offer tomorrow.\"",
      wrong: "\"It's when they're ready to offer. Too early and it's wasted paper, too late and it's a violation.\"",
    }
  },
  {
    day: 4, title: "The Attorney Question", location: "Bronx County Courthouse",
    narrative: [
      {speaker:"narrator", text:"Thursday. Marcus sends you to the courthouse to file some paperwork. You run into an attorney who's been handling real estate deals for 20 years."},
      {speaker:"narrator", text:"\"I don't have a real estate license,\" the attorney says with a grin. \"Don't need one.\""},
      {speaker:"narrator", text:"You must look confused, because he laughs and explains."},
    ],
    learn: {
      title: "License Exemptions", emoji: "🔓",
      cards: [
        {title: "Who Doesn't Need a License?", text: "These people are <b>exempt:</b> <b>Attorneys</b>, building superintendents, court-appointed personnel, property owners (selling their own), public officers, and tenant associations."},
        {title: "Who DOES Need One?", text: "Property managers, real estate assistants who show properties, part-time agents, and anyone facilitating transactions for others <b>must</b> be licensed. No shortcuts."},
      ]
    },
    challenge: {
      setup: "Back at the office, a friend calls. \"Hey, my uncle's a lawyer and he's been selling houses on the side. Is that even legal?\"",
      q: "Which of these people does NOT need a real estate license?",
      a: ["Property managers", "Assistants who show properties", "Attorneys", "Part-time agents"],
      correct: 2,
      why: "Attorneys are exempt from real estate licensing in NYS. They can handle real estate transactions as part of their legal practice.",
      right: "\"Attorneys play by different rules. Good — you're learning who's who.\"",
      wrong: "\"Attorneys are exempt. Know your exemptions.\"",
    }
  },
  {
    day: 4, title: "The Annual Review", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Back at the office, Denise flags you down."},
      {speaker:"denise", text:"\"Hey — your IC Agreement is due for its annual review in about 13 months. I'm putting it on the calendar now so we don't forget.\""},
      {speaker:"denise", text:"\"A lot of agents don't realize the agreement has to be reviewed regularly. It's not a sign-and-forget thing.\""},
    ],
    learn: {
      title: "The IC Agreement Deep Dive", emoji: "📑",
      cards: [
        {title: "Review Every 12–15 Months", text: "The Independent Contractor Relationship Agreement must be <b>reviewed every 12 to 15 months.</b> Not re-signed — reviewed."},
        {title: "What Makes You an IC?", text: "You control your own schedule. You pay your own taxes. You get no benefits. Your broker <b>supervises</b> but does not <b>dictate.</b>"},
        {title: "Cross the Line = Employee", text: "If your broker starts dictating your schedule, mandating office hours, or telling you exactly how to do your job — you may legally become an <b>Employee</b>, not an IC."},
      ]
    },
    challenge: {
      setup: "Denise looks at you. \"Quick — how often does the IC Agreement need to be reviewed?\"",
      q: "How frequently must the Independent Contractor Relationship Agreement be reviewed?",
      a: ["Every 6 months", "Every 12 to 15 months", "Every 2 years at license renewal", "Only at initial signing"],
      correct: 1,
      why: "Every 12 to 15 months. Denise keeps a calendar for the whole office — and now you know why.",
      right: "\"Denise runs a tight ship. Glad you're keeping up.\"",
      wrong: "\"12 to 15 months. It's easy to forget — that's why we put it on the calendar.\"",
    }
  },
  {
    day: 5, title: "The Emergency", location: "Concourse Realty Office",
    narrative: [
      {speaker:"narrator", text:"Friday morning. You walk in and the mood is heavy. Denise meets you at the door."},
      {speaker:"denise", text:"\"Marcus had a medical emergency last night. He's stable, but he can't work. We need to talk about what happens if a broker can't run the office.\""},
      {speaker:"denise", text:"\"This is real — it happens. And there's a specific legal process for it.\""},
    ],
    learn: {
      title: "When a Broker Can't Continue", emoji: "🚨",
      cards: [
        {title: "Broker Death or Incapacity", text: "If a broker dies or can't continue, <b>DOS will appoint a Full Broker or Attorney</b> to manage the office temporarily."},
        {title: "Pending Deals Still Close", text: "The appointed person's job: <b>close out all pending transactions</b> so clients aren't left hanging and agents get their commissions."},
        {title: "Then What?", text: "After pending deals close, the <b>license is terminated</b> and all agents must find a new broker. The office winds down."},
      ]
    },
    challenge: {
      setup: "Another agent panics. \"Wait — if Marcus can't come back, do we all just stop working? What happens to my pending deals?\"",
      q: "If a broker dies or is permanently incapacitated, what happens to the office?",
      a: ["All agents must immediately stop working", "DOS appoints a broker or attorney to close pending deals", "The top-selling agent takes over", "The office automatically closes"],
      correct: 1,
      why: "DOS steps in and appoints a Full Broker or Attorney. Their job: close all pending transactions and pay out commissions. Then the license terminates.",
      right: "\"That's exactly right. The system protects the agents and the clients.\"",
      wrong: "\"DOS appoints someone to close everything out properly. Nobody just loses their deals.\"",
    }
  },
  {
    day: 5, title: "The Dream", location: "Grand Concourse — Rooftop",
    narrative: [
      {speaker:"narrator", text:"Friday evening. Marcus is doing better — he called from the hospital. \"I'll be back Monday.\" The office exhales."},
      {speaker:"narrator", text:"You sit on the rooftop above the office. The sun sets over the Grand Concourse. Yankee Stadium glows in the distance."},
      {speaker:"narrator", text:"You think about the week. Five days ago you were nervous. Now you know the rules, the law, the people. This is just the beginning."},
      {speaker:"narrator", text:"Someday, this could be YOUR office. But first — the broker exam."},
    ],
    learn: {
      title: "The Path to Broker", emoji: "🌟",
      cards: [
        {title: "Broker Qualifying — Option 1", text: "<b>2 years full-time</b> (35 hrs/week) as a licensed Salesperson + <b>3,500 points</b> earned from completed transactions."},
        {title: "Broker Qualifying — Option 2", text: "<b>3 years full-time</b> + <b>5,250 points</b> — this path includes property management experience."},
        {title: "The Costs & Requirements", text: "Broker license: <b>$185 for 2 years.</b> Minimum age: <b>20.</b> Total education: <b>152 hours</b> (77 Salesperson + 75 Broker)."},
        {title: "Continuing Ed", text: "Every 2 years, complete <b>22.5 hours of CE</b> including Fair Housing, Agency, Ethics, Cultural Competency, and Implicit Bias."},
      ]
    },
    challenge: {
      setup: "Marcus calls from the hospital. \"Kid — you had a hell of a first week. Let me ask you one more thing before I let you enjoy your weekend.\"",
      q: "To qualify for a Broker license through sales experience, you need:",
      a: ["1 year full-time & 2,000 points", "2 years full-time & 3,500 points", "3 years full-time & 5,000 points", "5 years & 7,500 points"],
      correct: 1,
      why: "2 years full-time (35 hrs/week) and 3,500 points from transactions. Marcus did it, Denise did it, and you will too.",
      right: "\"You're gonna be running your own shop before you know it. Get some rest — Monday's coming.\"",
      wrong: "\"Two years, 3,500 points. That's the benchmark. Write it down and start counting.\"",
    }
  },
];

const SAVE_KEY = 'esr_v2_ch1';

function App() {
  const [screen, setScreen] = useState('title');
  const [cash, setCash] = useState(500);
  const [rep, setRep] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completed, setCompleted] = useState({});
  const [sceneIdx, setSceneIdx] = useState(0);
  const [phase, setPhase] = useState('narrative');
  const [narIdx, setNarIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [toast, setToast] = useState(null);
  const [shakeIdx, setShakeIdx] = useState(-1);
  const tt = useRef(null);

  // Load
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (s) { setCash(s.cash||500); setRep(s.rep||0); setBestStreak(s.bestStreak||0); setCompleted(s.completed||{}); }
    } catch(e) {}
  }, []);

  // Save
  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({cash,rep,bestStreak,completed})); } catch(e) {}
  }, [cash, rep, bestStreak, completed]);

  const flash = (msg, type='gold') => {
    clearTimeout(tt.current);
    setToast({msg, type});
    tt.current = setTimeout(() => setToast(null), 2500);
  };

  const correctCount = Object.values(completed).filter(v => v.correct).length;
  const totalPlayed = Object.keys(completed).length;

  const startStory = () => {
    const first = SCENES.findIndex((_, i) => !completed[i]);
    const start = first >= 0 ? first : 0;
    setSceneIdx(start); setPhase('narrative'); setNarIdx(0); setCardIdx(0); setPick(null); setShakeIdx(-1); setStreak(0); setScreen('play');
  };

  const replayAll = () => {
    setSceneIdx(0); setPhase('narrative'); setNarIdx(0); setCardIdx(0); setPick(null); setShakeIdx(-1); setStreak(0); setScreen('play');
  };

  const scene = SCENES[sceneIdx];

  const advanceNarrative = () => {
    if (narIdx < scene.narrative.length - 1) setNarIdx(narIdx + 1);
    else { setPhase('learn'); setCardIdx(0); }
  };

  const advanceCard = () => {
    if (cardIdx < scene.learn.cards.length - 1) setCardIdx(cardIdx + 1);
    else { setPhase('challenge'); setPick(null); setShakeIdx(-1); }
  };

  const prevCard = () => { if (cardIdx > 0) setCardIdx(cardIdx - 1); };

  const answer = (idx) => {
    if (pick !== null) return;
    setPick(idx);
    const ok = idx === scene.challenge.correct;
    if (!ok) setShakeIdx(idx);
    const sv = ok ? streak + 1 : 0;
    const bonus = ok ? Math.min(streak, 5) * 100 : 0;
    const base = ok ? 500 : 0;
    const reward = base + bonus;
    setStreak(sv);
    if (ok && sv > bestStreak) setBestStreak(sv);
    setCash(c => c + reward);
    setRep(r => r + (ok ? 50 : 10));
    setCompleted(c => ({...c, [sceneIdx]: {correct: ok}}));
    if (ok) flash(`+$${reward.toLocaleString()}${bonus > 0 ? '  🔥 ×' + sv : ''}`);
  };

  const nextScene = () => {
    if (sceneIdx + 1 >= SCENES.length) { setScreen('finale'); }
    else { setSceneIdx(sceneIdx + 1); setPhase('narrative'); setNarIdx(0); setCardIdx(0); setPick(null); setShakeIdx(-1); }
  };

  const reset = () => {
    if (confirm('Reset all progress?')) {
      localStorage.removeItem(SAVE_KEY);
      setCash(500); setRep(0); setBestStreak(0); setCompleted({}); setStreak(0); setScreen('title');
    }
  };

  const styles = {
    page: { minHeight:'100vh', background:'#0A0A0F', fontFamily:"'DM Sans',sans-serif", color:'#DAD8D0', WebkitFontSmoothing:'antialiased' },
    gold: '#D4A853', green: '#3DD68C', red: '#F0544F', orange: '#F5A623', purple: '#A78BFA', blue: '#60A5FA',
    bg2: '#12121A', bg3: '#1A1A28', bg4: '#252538', dim: '#5E5E72', bright: '#F5F4F0',
  };

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes popIn{0%{transform:scale(0.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(212,168,83,0.15)}50%{box-shadow:0 0 28px rgba(212,168,83,0.4)}}
        @keyframes pulseB{0%,100%{border-color:rgba(212,168,83,.15)}50%{border-color:rgba(212,168,83,.4)}}
        button{font-family:'DM Sans',sans-serif;cursor:pointer;border:none;outline:none;-webkit-tap-highlight-color:transparent}
        button:active{transform:scale(0.97)!important}
        ::selection{background:rgba(212,168,83,.3)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#252538;border-radius:4px}
      `}</style>

      {/* Toast */}
      {toast && <div style={{position:'fixed',top:20,left:'50%',transform:'translateX(-50%)',zIndex:999,padding:'10px 24px',borderRadius:10,fontWeight:700,fontSize:15,pointerEvents:'none',
        color:toast.type==='green'?'#fff':'#0B0B11',
        background:toast.type==='green'?'linear-gradient(135deg,#3DD68C,#22A06B)':'linear-gradient(135deg,#E8C97A,#D4A853)',
        boxShadow:'0 6px 28px rgba(0,0,0,.5)',animation:'popIn .35s ease-out'}}>{toast.msg}</div>}

      {screen === 'title' && (
        <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          padding:'40px 20px',textAlign:'center',
          background:'radial-gradient(ellipse at 50% 15%,rgba(212,168,83,.06) 0%,transparent 60%)',animation:'fadeUp .5s ease-out'}}>
          <div style={{fontSize:11,letterSpacing:5,color:styles.gold,fontWeight:600,marginBottom:8}}>CHAPTER 1 — LICENSE LAW</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(36px,7vw,58px)',fontWeight:900,lineHeight:1.05,
            background:'linear-gradient(160deg,#E8C97A 20%,#D4A853 50%,#B8922F 80%)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:4}}>Empire State<br/>Realty</h1>
          <p style={{color:styles.dim,fontSize:15,maxWidth:440,lineHeight:1.6,marginTop:10,marginBottom:32}}>
            Your first week at <strong style={{color:'#DAD8D0'}}>Concourse Realty</strong> in <strong style={{color:'#DAD8D0'}}>The Bronx</strong>.
            Learn the law. Pass the test. Build the empire.</p>

          {totalPlayed > 0 && (
          <div style={{background:styles.bg2,borderRadius:16,padding:'20px 24px',marginBottom:28,
            border:'1px solid rgba(212,168,83,.12)',maxWidth:420,width:'100%'}}>
            <div style={{display:'flex',gap:4,marginBottom:14,justifyContent:'center'}}>
              {SCENES.map((_, i) => {
                const d = completed[i];
                return <div key={i} style={{width:28,height:6,borderRadius:3,
                  background:d?.correct?styles.green:d?styles.red:styles.bg4,transition:'all .3s'}} />
              })}
            </div>
            <div style={{display:'flex',justifyContent:'space-around'}}>
              <Stat l="Cash" v={`$${cash.toLocaleString()}`} c={styles.gold} />
              <Stat l="Correct" v={`${correctCount}/${SCENES.length}`} c={styles.green} />
              <Stat l="Rep" v={rep.toLocaleString()} c={styles.purple} />
            </div>
          </div>)}

          <button onClick={startStory} style={{padding:'15px 44px',borderRadius:12,fontSize:16,fontWeight:700,letterSpacing:.5,
            background:'linear-gradient(135deg,#D4A853,#B8922F)',color:'#0B0B11',
            boxShadow:'0 4px 20px rgba(212,168,83,.25)'}}>
            {totalPlayed >= SCENES.length ? 'REPLAY FROM START' : totalPlayed > 0 ? 'CONTINUE YOUR WEEK' : 'START YOUR FIRST WEEK'}
          </button>

          {totalPlayed > 0 && <button onClick={reset} style={{marginTop:12,fontSize:12,color:styles.dim,background:'none',padding:8}}>Reset Progress</button>}
          <div style={{marginTop:28,fontSize:12,color:styles.dim}}>Built for Emerson 🏙️</div>
        </div>
      )}

      {screen === 'play' && scene && (
        <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
          {/* Top bar */}
          <div style={{background:styles.bg2,borderBottom:'1px solid rgba(255,255,255,.04)',padding:'10px 16px',position:'sticky',top:0,zIndex:10}}>
            <div style={{maxWidth:640,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13}}>
              <span style={{color:styles.gold,fontWeight:600}}>Day {scene.day} — {scene.title}</span>
              <div style={{display:'flex',gap:14}}>
                <span style={{color:styles.gold}}>💰 ${cash.toLocaleString()}</span>
                {streak > 0 && <span style={{color:styles.orange}}>🔥 {streak}</span>}
              </div>
            </div>
            <div style={{maxWidth:640,margin:'4px auto 0',height:3,background:styles.bg4,borderRadius:2,overflow:'hidden'}}>
              <div style={{height:'100%',borderRadius:2,transition:'width .6s',
                width:`${((sceneIdx + (phase==='challenge'&&pick!==null?1:0.5)) / SCENES.length) * 100}%`,
                background:'linear-gradient(90deg,#D4A853,#E8C97A)'}} />
            </div>
          </div>

          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 16px'}}>
            <div key={`${sceneIdx}-${phase}`} style={{maxWidth:600,width:'100%',animation:'fadeUp .45s ease-out'}}>

              {/* ═══ NARRATIVE ═══ */}
              {phase === 'narrative' && (() => {
                const line = scene.narrative[narIdx];
                const isLast = narIdx === scene.narrative.length - 1;
                const speakerColor = line.speaker==='marcus' ? styles.gold : line.speaker==='denise' ? styles.purple : null;
                return (
                  <div key={narIdx} style={{animation:'fadeUp .4s ease-out'}}>
                    <div style={{fontSize:11,color:styles.gold,letterSpacing:2,fontWeight:600,marginBottom:16,textTransform:'uppercase'}}>
                      📍 {scene.location}
                    </div>
                    <div style={{
                      background:line.speaker==='narrator'?styles.bg2: line.speaker==='marcus'?'rgba(212,168,83,.05)':'rgba(167,139,250,.05)',
                      borderRadius:18,padding:'24px 28px',
                      border:`1px solid ${line.speaker==='narrator'?'rgba(255,255,255,.04)': line.speaker==='marcus'?'rgba(212,168,83,.12)':'rgba(167,139,250,.12)'}`,
                      marginBottom:20}}>
                      {line.speaker !== 'narrator' && (
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                          <div style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,
                            background:line.speaker==='marcus'?'rgba(212,168,83,.12)':'rgba(167,139,250,.12)'}}>
                            {line.speaker==='marcus'?'👔':'👩‍💼'}</div>
                          <span style={{fontSize:13,fontWeight:700,color:speakerColor,textTransform:'uppercase',letterSpacing:1}}>
                            {line.speaker==='marcus'?'Marcus Rivera':'Denise'}</span>
                        </div>
                      )}
                      <p style={{fontSize:17,lineHeight:1.7,color:styles.bright,
                        fontStyle:line.speaker==='narrator'?'italic':'normal'}}>{line.text}</p>
                    </div>
                    <button onClick={advanceNarrative} style={{width:'100%',padding:'14px',borderRadius:12,fontSize:14,fontWeight:600,
                      background:isLast?'linear-gradient(135deg,#D4A853,#B8922F)':styles.bg3,
                      color:isLast?'#0B0B11':styles.dim,border:isLast?'none':`1px solid ${styles.bg4}`}}>
                      {isLast ? '📚 Time to Learn →' : 'Continue →'}</button>
                    <div style={{textAlign:'center',marginTop:8,fontSize:11,color:styles.dim}}>{narIdx+1} / {scene.narrative.length}</div>
                  </div>
                );
              })()}

              {/* ═══ LEARN ═══ */}
              {phase === 'learn' && (() => {
                const card = scene.learn.cards[cardIdx];
                const isLast = cardIdx === scene.learn.cards.length - 1;
                return (
                  <div key={cardIdx} style={{animation:'fadeUp .4s ease-out'}}>
                    <div style={{textAlign:'center',marginBottom:20}}>
                      <div style={{fontSize:32,marginBottom:4}}>{scene.learn.emoji}</div>
                      <div style={{fontSize:11,color:styles.gold,letterSpacing:3,fontWeight:700,textTransform:'uppercase'}}>{scene.learn.title}</div>
                    </div>
                    <div style={{background:styles.bg2,borderRadius:20,padding:'28px 24px',
                      border:'1px solid rgba(212,168,83,.12)',marginBottom:16,
                      boxShadow:'0 8px 32px rgba(0,0,0,.3)',minHeight:140}}>
                      <div style={{fontSize:16,fontWeight:700,color:styles.gold,marginBottom:10,lineHeight:1.3}}>{card.title}</div>
                      <div style={{fontSize:15,lineHeight:1.7,color:'#DAD8D0'}} dangerouslySetInnerHTML={{__html:card.text}} />
                    </div>
                    <div style={{display:'flex',justifyContent:'center',gap:6,marginBottom:16}}>
                      {scene.learn.cards.map((_, i) => (
                        <div key={i} style={{width:i===cardIdx?20:8,height:8,borderRadius:4,
                          background:i===cardIdx?styles.gold:i<cardIdx?'rgba(212,168,83,.3)':styles.bg4,transition:'all .3s'}} />
                      ))}
                    </div>
                    <div style={{display:'flex',gap:10}}>
                      {cardIdx > 0 && <button onClick={prevCard} style={{padding:'14px 20px',borderRadius:12,fontSize:14,fontWeight:600,
                        background:styles.bg3,color:styles.dim,border:`1px solid ${styles.bg4}`}}>← Back</button>}
                      <button onClick={advanceCard} style={{flex:1,padding:'14px',borderRadius:12,fontSize:14,fontWeight:700,
                        background:isLast?'linear-gradient(135deg,#D4A853,#B8922F)':styles.bg3,
                        color:isLast?'#0B0B11':'#DAD8D0',border:isLast?'none':`1px solid ${styles.bg4}`}}>
                        {isLast ? '🎯 Ready for the Challenge →' : `Next (${cardIdx+1}/${scene.learn.cards.length})`}</button>
                    </div>
                  </div>
                );
              })()}

              {/* ═══ CHALLENGE ═══ */}
              {phase === 'challenge' && (() => {
                const ch = scene.challenge;
                const answered = pick !== null;
                const correct = pick === ch.correct;
                return (
                  <div>
                    <div style={{background:styles.bg2,borderRadius:16,padding:'20px 22px',marginBottom:16,
                      border:'1px solid rgba(255,255,255,.04)'}}>
                      <p style={{fontSize:14,lineHeight:1.65,color:styles.dim,fontStyle:'italic'}}>{ch.setup}</p>
                    </div>
                    <div style={{background:styles.bg2,borderRadius:18,padding:'24px 22px',marginBottom:14,
                      border:'1px solid rgba(212,168,83,.1)',animation:!answered?'pulseB 3s infinite':'none'}}>
                      <p style={{fontSize:17,fontWeight:600,lineHeight:1.6,color:styles.bright}}>{ch.q}</p>
                    </div>
                    <div style={{display:'grid',gap:8}}>
                      {ch.a.map((ans, i) => {
                        const isThis = pick===i, isRight = i===ch.correct;
                        let bg=styles.bg2, bdr='rgba(255,255,255,.06)', clr='#DAD8D0';
                        if(answered){
                          if(isRight){bg='rgba(61,214,140,.08)';bdr=styles.green;clr=styles.green}
                          else if(isThis){bg='rgba(240,84,79,.08)';bdr=styles.red;clr=styles.red}
                          else{clr=styles.dim}
                        }
                        return (
                          <button key={i} onClick={()=>answer(i)}
                            style={{padding:'14px 16px',borderRadius:13,border:`2px solid ${bdr}`,background:bg,color:clr,
                              fontSize:15,fontWeight:500,textAlign:'left',cursor:answered?'default':'pointer',transition:'all .15s',
                              display:'flex',alignItems:'center',gap:12,
                              animation:answered&&isThis&&!isRight?'shake .4s ease-out':'none'}}>
                            <span style={{width:28,height:28,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',
                              fontSize:12,fontWeight:700,flexShrink:0,
                              background:answered&&isRight?styles.green:answered&&isThis?styles.red:styles.bg4,
                              color:answered&&(isRight||isThis)?'#fff':styles.dim}}>
                              {answered&&isRight?'✓':answered&&isThis?'✗':String.fromCharCode(65+i)}</span>
                            <span>{ans}</span>
                          </button>
                        );
                      })}
                    </div>
                    {answered && (
                    <div style={{marginTop:14,animation:'fadeUp .4s ease-out'}}>
                      <div style={{borderRadius:14,padding:'16px 20px',marginBottom:8,
                        background:correct?'rgba(61,214,140,.06)':'rgba(240,84,79,.06)',
                        border:`1px solid ${correct?'rgba(61,214,140,.15)':'rgba(240,84,79,.15)'}`}}>
                        <div style={{fontSize:14,fontWeight:700,color:correct?styles.green:styles.red,marginBottom:4}}>
                          {correct?'✅ Correct!':'❌ Not quite.'}</div>
                        <div style={{fontSize:14,color:'#DAD8D0',lineHeight:1.55,opacity:.85}}>{ch.why}</div>
                      </div>
                      <div style={{background:'rgba(212,168,83,.04)',borderRadius:14,padding:'14px 18px',
                        border:'1px solid rgba(212,168,83,.1)',display:'flex',gap:10,alignItems:'flex-start'}}>
                        <span style={{fontSize:20}}>👔</span>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:styles.gold,letterSpacing:1,marginBottom:3}}>MARCUS</div>
                          <div style={{fontSize:14,color:'#DAD8D0',lineHeight:1.55,fontStyle:'italic'}}>
                            {correct ? ch.right : ch.wrong}</div>
                        </div>
                      </div>
                      <button onClick={nextScene} style={{width:'100%',padding:'14px',borderRadius:12,marginTop:12,
                        background:'linear-gradient(135deg,#D4A853,#B8922F)',color:'#0B0B11',fontSize:15,fontWeight:700}}>
                        {sceneIdx+1>=SCENES.length?'Complete Your Week →':'Next Scene →'}</button>
                    </div>)}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {screen === 'finale' && (
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20,
          background:'radial-gradient(ellipse at 50% 25%,rgba(212,168,83,.06) 0%,transparent 60%)',animation:'fadeUp .5s ease-out'}}>
          <div style={{maxWidth:480,width:'100%',textAlign:'center'}}>
            <div style={{fontSize:11,color:styles.gold,letterSpacing:4,fontWeight:600,marginBottom:8}}>WEEK COMPLETE</div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:styles.bright,marginBottom:6}}>
              Your First Week at<br/>Concourse Realty</h2>
            <p style={{fontSize:13,color:styles.dim,marginBottom:20}}>The Bronx • License Law</p>
            {(() => {
              const pct = Math.round((correctCount/SCENES.length)*100);
              const g = pct>=90?'S':pct>=78?'A':pct>=67?'B':pct>=55?'C':'D';
              const gc = {S:styles.gold,A:styles.green,B:styles.blue,C:styles.orange,D:styles.red}[g];
              const msg = pct>=90?"Marcus is already talking about making you Associate Broker.":
                          pct>=78?"Solid first week. The Bronx is starting to know your name.":
                          pct>=67?"You survived. But there's more to learn.":
                          "Rough week. But you showed up. Let's try again.";
              return (
                <>
                  <div style={{width:100,height:100,borderRadius:'50%',margin:'0 auto 16px',
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,fontWeight:900,
                    fontFamily:"'Playfair Display',serif",color:gc,border:`3px solid ${gc}`,background:`${gc}10`,
                    animation:'glow 2.5s infinite,popIn .4s ease-out'}}>{g}</div>
                  <p style={{color:'#DAD8D0',fontSize:15,marginBottom:24,lineHeight:1.5,maxWidth:360,margin:'0 auto 24px'}}>{msg}</p>
                </>
              );
            })()}
            <div style={{display:'flex',gap:4,justifyContent:'center',marginBottom:20}}>
              {SCENES.map((_, i) => {
                const d = completed[i];
                return <div key={i} style={{width:32,height:8,borderRadius:4,
                  background:d?.correct?styles.green:d?styles.red:styles.bg4}} />;
              })}
            </div>
            <div style={{background:styles.bg2,borderRadius:16,padding:20,border:'1px solid rgba(255,255,255,.04)',marginBottom:20}}>
              <div style={{display:'flex',justifyContent:'space-around'}}>
                <Stat l="Correct" v={`${correctCount}/${SCENES.length}`} c={styles.green} />
                <Stat l="Cash" v={`$${cash.toLocaleString()}`} c={styles.gold} />
                <Stat l="Best Streak" v={`🔥 ${bestStreak}`} c={styles.orange} />
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={replayAll} style={{flex:1,padding:'14px',borderRadius:12,
                background:'linear-gradient(135deg,#D4A853,#B8922F)',color:'#0B0B11',fontSize:15,fontWeight:700}}>Replay Week</button>
              <button onClick={()=>setScreen('title')} style={{padding:'14px 20px',borderRadius:12,fontSize:15,fontWeight:600,
                background:styles.bg3,color:styles.dim,border:`1px solid ${styles.bg4}`}}>Home</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ l, v, c }) {
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:18,fontWeight:700,color:c,fontFamily:"'Playfair Display',serif"}}>{v}</div>
      <div style={{fontSize:10,color:'#5E5E72',letterSpacing:1,textTransform:'uppercase',marginTop:2}}>{l}</div>
    </div>
  );
}

export default App;
