"use client";

import { useState, useRef, useEffect } from "react";
import { Plane, Compass, Heart, Lamp, Mic, Volume2, Search, Sliders, Award, FileText, Ship, Eye, BookOpen, RefreshCw, Wrench, Shield, Settings } from "lucide-react";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const B = {
  blue:"#2CB5E8", navy:"#1C2B4A", white:"#FFFFFF",
  offWhite:"#F5F7FA", gray50:"#F0F4F8", gray100:"#E2E8F0",
  gray300:"#94A3B8", gray500:"#64748B", gray700:"#334155",
  orange:"#FF6B35", green:"#10B981", red:"#EF4444", yellow:"#F59E0B",
};
const GA = { social:B.orange, analytical:B.blue, stabilizing:B.green, persistent:"#7C3AED" };
const GL = { social:"Social", analytical:"Analytical", stabilizing:"Stabilizing", persistent:"Persistent" };

// ─── ICON MAP ─────────────────────────────────────────────────────────────────
const IMAP = {
  maverick:{I:Plane,s:"hex"}, captain:{I:Compass,s:"hex"}, collaborator:{I:Heart,s:"hex"},
  altruist:{I:Lamp,s:"hex"}, persuader:{I:Mic,s:"hex"}, promoter:{I:Volume2,s:"hex"},
  analyzer:{I:Search,s:"circ"}, controller:{I:Sliders,s:"circ"}, specialist:{I:Award,s:"circ"},
  strategist:{I:FileText,s:"circ"}, venturer:{I:Ship,s:"circ"},
  individualist:{I:Eye,s:"circ"}, scholar:{I:BookOpen,s:"circ"},
  adapter:{I:RefreshCw,s:"tri"}, artisan:{I:Wrench,s:"tri"},
  guardian:{I:Shield,s:"tri"}, operator:{I:Settings,s:"tri"},
};

const PIIcon = ({ id, size=56, bgColor=B.blue }: any) => {
  const cfg = IMAP[id as keyof typeof IMAP]; if (!cfg) return null;
  const { I, s } = cfg;
  return (
    <div style={{
      width:size, height:size, flexShrink:0,
      clipPath: s==="hex"?"polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)":s==="tri"?"polygon(50% 5%,95% 95%,5% 95%)":undefined,
      borderRadius: s==="circ"?"50%":undefined,
      background: bgColor,
      display:"flex", alignItems:"center", justifyContent:"center",
      paddingTop: s==="tri"?size*.1:0,
    }}>
      <I size={Math.round(size*.42)} color="#1a1040" strokeWidth={2.5}/>
    </div>
  );
};

// ─── PROFILES ─────────────────────────────────────────────────────────────────
const PROFILES = [
  {id:"maverick",    name:"Maverick",     group:"social",     tagline:"Innovative rule-breaker, undaunted by failure",             D:85,E:75,P:20,F:15},
  {id:"captain",     name:"Captain",      group:"social",     tagline:"Problem solver who controls the big picture",               D:80,E:65,P:30,F:35},
  {id:"collaborator",name:"Collaborator", group:"social",     tagline:"Friendly, understanding, willing and patient",              D:35,E:70,P:70,F:40},
  {id:"altruist",    name:"Altruist",     group:"social",     tagline:"Congenial and cooperative, precise work ethic",             D:30,E:75,P:75,F:50},
  {id:"persuader",   name:"Persuader",    group:"social",     tagline:"Socially poised risk-taker, motivating team builder",       D:70,E:85,P:35,F:20},
  {id:"promoter",    name:"Promoter",     group:"social",     tagline:"Persuasive extravert with a tendency for informality",      D:55,E:90,P:30,F:15},
  {id:"analyzer",    name:"Analyzer",     group:"analytical", tagline:"Intense with high standards, disciplined and reserved",     D:50,E:20,P:40,F:90},
  {id:"controller",  name:"Controller",   group:"analytical", tagline:"Self-disciplined, fast-paced, operates within guidelines",  D:90,E:30,P:25,F:70},
  {id:"specialist",  name:"Specialist",   group:"analytical", tagline:"Highly precise worker, skeptical while respecting authority",D:45,E:25,P:50,F:85},
  {id:"strategist",  name:"Strategist",   group:"analytical", tagline:"Big picture thinker who considers long-term impact",        D:75,E:45,P:35,F:55},
  {id:"venturer",    name:"Venturer",     group:"analytical", tagline:"Self-starting, self-motivated risk-taker",                  D:85,E:60,P:25,F:30},
  {id:"individualist",name:"Individualist",group:"persistent","tagline":"Highly independent and persistent, results-oriented",     D:65,E:30,P:40,F:60},
  {id:"scholar",     name:"Scholar",      group:"persistent", tagline:"Accurate, reserved and imaginative",                        D:40,E:15,P:50,F:80},
  {id:"adapter",     name:"Adapter",      group:"stabilizing",tagline:"Bridge-builder, adapts to situations easily",               D:40,E:55,P:65,F:50},
  {id:"artisan",     name:"Artisan",      group:"stabilizing",tagline:"Accommodating and analytical, highly precise",              D:35,E:35,P:75,F:80},
  {id:"guardian",    name:"Guardian",     group:"stabilizing",tagline:"Unselfish, approachable, prefers detailed work",            D:30,E:35,P:80,F:85},
  {id:"operator",    name:"Operator",     group:"stabilizing",tagline:"Patient, conscientious and relaxed, cooperative",           D:35,E:40,P:80,F:70},
];

const PROFILE_MAP: Record<string, string> = {maverick:"maverick",captain:"captain",collaborator:"collaborator",altruist:"altruist",persuader:"persuader",promoter:"promoter",analyzer:"analyzer",analyser:"analyzer",controller:"controller",specialist:"specialist",strategist:"strategist",venturer:"venturer",individualist:"individualist",scholar:"scholar",adapter:"adapter",adaptor:"adapter",artisan:"artisan",guardian:"guardian",operator:"operator"};
const normP = (n: string) => n ? PROFILE_MAP[n.toLowerCase().trim().replace(/[^a-z]/g,"")] || null : null;

// ─── PROFILE-SPECIFIC QUESTIONS ───────────────────────────────────────────────
const QUESTIONS: Record<string, any[]> = {
  maverick:[
    {type:"open", text:"What's the last idea you had that people told you was too risky or unrealistic? What did you do with it?", placeholder:"Be direct — what was the idea and what happened?"},
    {type:"sjt",  text:"You're deep into a project and hit a wall that could kill it. Your instinct is:", options:["Blow up the plan and find a completely different route","Push through with sheer force — obstacles are temporary","Get 2-3 smart people in a room and brainstorm fast","Step back, assess what's salvageable, rebuild from there"]},
    {type:"sjt",  text:"The environment where you do your best work looks like:", options:["Complete autonomy — you set the goal and the method","A bold goal handed to you, no one telling you how","A high-energy team where ideas bounce fast","Structured sprints with clear owners and deadlines"]},
  ],
  captain:[
    {type:"open", text:"Tell me about a time you stepped up to lead when no one else was doing it. What drove you to take charge?", placeholder:"What happened — and what was at stake?"},
    {type:"sjt",  text:"Your team is split and a decision needs to be made in the next hour. You:", options:["Make the call yourself — that's what leaders are for","Run a fast structured process: 3 options, quick vote, done","Push for full consensus even if it takes longer","Find the person with the most relevant expertise and defer"]},
    {type:"sjt",  text:"You feel most useful in a role where:", options:["You own a major outcome entirely — win or lose","You're solving a complex problem no one else has solved","You're elevating the performance of the people around you","You're building systems that will outlast you"]},
  ],
  collaborator:[
    {type:"open", text:"Think of a team that was struggling — maybe falling apart. What did you do, and what changed?", placeholder:"What role did you actually play?"},
    {type:"sjt",  text:"A teammate is clearly overwhelmed and slipping. You:", options:["Immediately start taking things off their plate","Sit down with them privately and ask what they actually need","Flag it to the manager — that's their job to handle","Check in casually but don't overstep — they might not want help"]},
    {type:"sjt",  text:"You contribute the most in environments that prioritize:", options:["Deep trust and psychological safety among the team","Clear shared goals everyone is aligned on","Individual excellence that the team can learn from","Rapid execution — clarity of role, move fast"]},
  ],
  altruist:[
    {type:"open", text:"Describe something meaningful you did for a team or person that nobody asked you to do. What motivated it?", placeholder:"What was it, and why did you do it?"},
    {type:"sjt",  text:"You disagree with a decision your manager made that will affect your team negatively. You:", options:["Raise it directly and privately — they deserve honest input","Bring it up openly in the team — transparency matters","Accept it and move on — not your call to make","Talk to trusted teammates first to gauge the read"]},
    {type:"sjt",  text:"Your ideal work feels like:", options:["Purpose-driven collaboration where everyone genuinely cares","Well-structured, with clear expectations you can meet","Independent deep work where you own something fully","High-performance with real stakes and recognition"]},
  ],
  persuader:[
    {type:"open", text:"Describe a time you genuinely changed someone's mind. What did you do that went beyond just making your argument?", placeholder:"What was the situation and what worked?"},
    {type:"sjt",  text:"You need a skeptical group to back your idea. You:", options:["Build a pitch that's so compelling they can't say no","Win over 2-3 influential people privately before the meeting","Let the data speak for itself — a clear deck is enough","Have real one-on-ones with each person beforehand"]},
    {type:"sjt",  text:"In a meeting you've never attended before, you naturally:", options:["Read the room fast and start shaping the energy","Ask the question nobody else is willing to ask","Make sure the quieter people get heard","Stay anchored to the agenda — that's what you're there for"]},
  ],
  promoter:[
    {type:"open", text:"Tell me about something you got other people genuinely excited about — an idea, project, event, anything. How did you do it?", placeholder:"What was it and how did you move people?"},
    {type:"sjt",  text:"You walk into a room at a networking event where you know nobody. You:", options:["Immediately start introducing yourself — more connections the better","Find one genuinely interesting person and go very deep","Stick close to the one or two people you do know","Read the room first, then make selective targeted approaches"]},
    {type:"sjt",  text:"You run on fuel that looks like:", options:["Being in rooms with high energy and lots of people","Closing — getting someone to say yes to something","Knowing your team is solid and the work is done","Figuring out the hard thing that nobody else could"]},
  ],
  analyzer:[
    {type:"open", text:"Tell me about a problem where you went deeper into the data or details than anyone else was willing to go. What did you find?", placeholder:"What was the problem and what did the extra depth reveal?"},
    {type:"sjt",  text:"You're asked to make an important decision with only 60% of the information you'd want. You:", options:["Push back — more time to gather data is worth it","Make your best analytical judgment and commit","Ask everyone who might know something relevant","Build a framework, rank the options, make the call"]},
    {type:"sjt",  text:"The kind of work you find most alive is:", options:["Deep, uninterrupted focus on a complex problem","Work with a right answer — where correct is clearly correct","Creative problem-solving where there's no obvious path","Working independently at your own pace on your own terms"]},
  ],
  controller:[
    {type:"open", text:"Walk me through a time you took over something that was in complete disorder. What did you do first — and why?", placeholder:"What was the situation and how did you approach it?"},
    {type:"sjt",  text:"You're handed a high-stakes project that's already behind and poorly organized. Your first move:", options:["Assume control immediately and establish a clear structure","Audit everything first — understand before you change anything","Assess who can actually deliver and build around them","Identify the biggest blockers and eliminate them fast"]},
    {type:"sjt",  text:"You feel sharpest when:", options:["You have real authority and people know it","The bar is high and the metrics are clear","You can move fast with minimal layers of approval","The environment is predictable and expectations are set"]},
  ],
  specialist:[
    {type:"open", text:"What's one area where you've gone deeper than almost anyone around you? What kept pulling you in?", placeholder:"What's the domain and what drove the depth?"},
    {type:"sjt",  text:"You're asked to own something meaningfully outside your expertise. You:", options:["Build the knowledge base first — you don't start until you're ready","Narrowly scope your contribution to what you actually know","Start from first principles and reason your way through it","Find the right person, learn from them fast, then execute"]},
    {type:"sjt",  text:"You're most uncomfortable in environments that:", options:["Expect action before you have enough information","Are structurally chaotic with no clear ownership","Require you to be the visible, social face of things","Move the goalposts before you've had time to master the current ones"]},
  ],
  strategist:[
    {type:"open", text:"Tell me about a time you saw something most people around you were too short-term to see. What did you do with that perspective?", placeholder:"What was the situation and what did you see?"},
    {type:"sjt",  text:"You're handed a big vague goal with no roadmap. Your instinct is:", options:["Build the full strategy before touching any execution","Break it into testable bets and start running experiments","Get the right people aligned on the vision first","Study what's already been tried, then improve on it"]},
    {type:"sjt",  text:"When you evaluate two competing options, you instinctively weight:", options:["Long-term compounding impact over short-term results","Hard evidence over gut feel — always","The fastest path to learning whether you're right","The human dynamics — who will actually make this happen"]},
  ],
  venturer:[
    {type:"open", text:"What's the biggest risk you've taken — professionally or personally? What made you take it and what happened?", placeholder:"What was the risk and what did you learn?"},
    {type:"sjt",  text:"You have a strong conviction about a direction but limited proof. You:", options:["Move fast — conviction is worth more than data at this stage","Find the minimum evidence needed to justify the bet and go","Run a fast small test before committing fully","Hold off — you need to be more right than wrong to move"]},
    {type:"sjt",  text:"You get genuinely restless when:", options:["There's nothing new to build — just maintenance and repetition","You're not being stretched or pushed past your edges","There are no clear targets or metrics to chase","You're spending more time in meetings than making things"]},
  ],
  individualist:[
    {type:"open", text:"Tell me about something meaningful you figured out entirely on your own — where the conventional path wasn't the right one for you.", placeholder:"What was it and why did you deviate?"},
    {type:"sjt",  text:"Your team is approaching a problem in a way you think is fundamentally wrong. You:", options:["Execute your own approach in parallel and let the results speak","State your case clearly once, then accept the group's decision","Build a researched alternative and formally propose it","Go along for now and raise it again after you've earned credibility"]},
    {type:"sjt",  text:"You're sharpest when you're:", options:["Operating with full autonomy over approach and method","Working on a problem that has no established answer","Being pushed hard by people who disagree with you","Inside a framework that's proven and well-understood"]},
  ],
  scholar:[
    {type:"open", text:"What's a subject you've gone deep on — not because you had to, but because you genuinely couldn't stop? What kept pulling you?", placeholder:"What is it and how deep have you gone?"},
    {type:"sjt",  text:"In a group brainstorm, your idea gets dismissed without real engagement. You:", options:["Let it go for now — the group process matters more than your idea","Document it, research it more, and bring it back stronger","Push back in the room — if it's right, it deserves a fair hearing","Explore it on your own afterward — you don't need validation to pursue it"]},
    {type:"sjt",  text:"Your ideal working rhythm is:", options:["Long uninterrupted blocks of deep, focused solo work","Structured days with clear deliverables and defined scope","Varied challenges that require different kinds of thinking each day","Frequent collaboration and real-time exchange of ideas"]},
  ],
  adapter:[
    {type:"open", text:"Tell me about a time everything shifted mid-project — the goal, the team, the approach — and you had to adapt on the fly. What did you do?", placeholder:"What changed and how did you respond?"},
    {type:"sjt",  text:"Two talented colleagues are locked in conflict over direction and neither will budge. You:", options:["Find the synthesis — there's almost always a middle path that works","Let the tension run its course — friction produces better outcomes","Back the person whose reasoning is stronger on the merits","Bring in a neutral third perspective to break the deadlock"]},
    {type:"sjt",  text:"The way you add most value to a team is by:", options:["Being the stable, reliable center when things get turbulent","Being the bridge — translating between people who can't hear each other","Delivering consistently precise, high-quality work","Driving the group toward the outcome when momentum stalls"]},
  ],
  artisan:[
    {type:"open", text:"Tell me about something you built or produced where the quality of your execution genuinely mattered — and you got it right. What made it good?", placeholder:"What was it and what did quality look like?"},
    {type:"sjt",  text:"You're told to ship faster even though you know it will compromise the quality in ways that matter. You:", options:["Hold the line — quality at this level is non-negotiable","Ship it and document what you compromised and why","Find a smarter method that gets both — there's always a way","Negotiate the scope down so quality is maintained within the constraint"]},
    {type:"sjt",  text:"The thing that frustrates you most in a work environment:", options:["Work done carelessly — things that could have been done right, weren't","Processes that change before you've had time to master them","Work that feels disconnected from any meaningful purpose","Being held back by people who won't match your standard"]},
  ],
  guardian:[
    {type:"open", text:"Tell me about a time where following the right process or structure prevented something from going seriously wrong. What would have happened without it?", placeholder:"What was the situation and what did the process protect?"},
    {type:"sjt",  text:"You're asked to implement a new process you believe is genuinely inefficient. You:", options:["Follow it fully and document the inefficiencies with evidence to propose change","Flag it immediately through the right channels with a clear alternative","Implement the parts that make sense and quietly optimize the rest","Talk to peers first to see if the concern is shared before raising it"]},
    {type:"sjt",  text:"You feel most settled in environments that have:", options:["Clear structure, defined expectations, and stable processes","High performance standards with measurable outcomes","Genuine care for people alongside accountability","Freedom to experiment and change what isn't working"]},
  ],
  operator:[
    {type:"open", text:"What's something your team or organization consistently relies on you for — where your steadiness and follow-through actually matter?", placeholder:"What do you deliver, and why does it matter that it's you?"},
    {type:"sjt",  text:"You're handed a project with almost no instructions and no existing process. You:", options:["Ask for a proper brief before starting — ambiguity produces bad outcomes","Build your own structure from scratch and start executing methodically","Jump in and iterate — you'll figure out what's needed by doing","Find the closest prior example and use it as your working model"]},
    {type:"sjt",  text:"The people who know you best at work would say you're the person who:", options:["Always delivers — if you commit to something, it gets done","Keeps the team calm and grounded when pressure builds","Brings fresh creative energy to problems that have gone stale","Raises the bar — your presence makes others perform better"]},
  ],
};

// Suggestion chips per profile
const CHIPS: Record<string, string[]> = {
  maverick:["What careers suit a Maverick?","Am I built for entrepreneurship?","How do I handle structure I hate?","What's my biggest blind spot?","Best industries for my style?"],
  captain:["What leadership roles suit me?","Should I start my own company?","How do I manage people who resist me?","How do I build a high-performing team?","What's my blind spot?"],
  collaborator:["What roles suit a Collaborator?","How do I assert myself more?","Am I too agreeable?","How do I advance my career?","What environments bring out my best?"],
  altruist:["What careers let me help people?","How do I avoid being taken advantage of?","Should I go into people management?","How do I negotiate salary?","What's my blind spot?"],
  persuader:["What sales or leadership roles suit me?","How do I deal with skeptical people?","Am I too focused on winning people over?","Best environments for my style?","How do I build on my strengths?"],
  promoter:["What roles play to my extroversion?","Am I suited for sales or marketing?","How do I bring more depth to my work?","What's my biggest blind spot?","How do I stay focused?"],
  analyzer:["What roles suit an analytical mind?","How do I communicate better?","Am I too slow to make decisions?","How do I work with people-first profiles?","Best industries for precision thinkers?"],
  controller:["What leadership style works for me?","How do I delegate without losing control?","Am I too rigid?","How do I build productive relationships?","Best environments for me?"],
  specialist:["What roles value deep expertise?","Should I stay specialist or go broad?","How do I show my value to generalists?","How do I advance without managing people?","What's my blind spot?"],
  strategist:["What roles suit big-picture thinking?","How do I get buy-in for long-term ideas?","Am I too focused on strategy over execution?","How do I manage short-term thinkers?","Best industries for a Strategist?"],
  venturer:["What entrepreneurial paths suit me?","How do I manage risk better?","Am I too impatient?","How do I work with cautious people?","Best industries for risk-takers?"],
  individualist:["What careers give me full autonomy?","How do I work better within a team?","Am I too resistant to authority?","Best roles for independent thinkers?","How do I advance without losing independence?"],
  scholar:["What roles value deep thinking?","How do I communicate my ideas better?","Am I too introverted for leadership?","How do I work with fast-moving teams?","Best environments for a Scholar?"],
  adapter:["What roles value adaptability?","Am I too accommodating?","How do I build a stronger identity?","How do I advance my career?","What team dynamics suit me best?"],
  artisan:["What roles value precision and craft?","Am I too focused on quality over speed?","How do I show my value to leadership?","How do I deal with changing requirements?","Best industries for craftsmanship?"],
  guardian:["What roles suit a structured thinker?","How do I advocate for myself?","Am I too rigid about process?","How do I handle ambiguity?","Best structured environments for me?"],
  operator:["What roles value steadiness?","How do I get recognized for reliability?","Am I too passive in my career?","How do I step into more responsibility?","Best team environments for an Operator?"],
};

// ─── TOP BAR (outside component to prevent remounting) ────────────────────────
const TopBar = ({ prof, step, accent }: any) => (
  <div style={{background:"#FFFFFF",borderBottom:"1px solid #E2E8F0",padding:"0 24px",height:56,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10,fontFamily:"'Inter',sans-serif"}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:28,height:28,background:"#2CB5E8",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:"#fff",fontWeight:700,fontSize:13}}>P</span>
      </div>
      <span style={{fontWeight:700,fontSize:16,color:"#1C2B4A",letterSpacing:-0.5}}>P<span style={{display:"inline-flex",flexDirection:"column",alignItems:"center",verticalAlign:"middle",margin:"0 0.5px",gap:"2px"}}><span style={{display:"block",width:"7px",height:"1.5px",background:"#1C2B4A",borderRadius:1}}/><span style={{display:"block",width:"2px",height:"7px",background:"#1C2B4A",borderRadius:1}}/><span style={{display:"block",width:"7px",height:"1.5px",background:"#1C2B4A",borderRadius:1}}/></span>lot</span>
      <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#94A3B8",letterSpacing:1}}>by Predictive Success</span>
    </div>
    {prof && step > 0 && (
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8,background:"#F0F4F8",borderRadius:20,padding:"4px 12px"}}>
        <PIIcon id={prof.id} size={20}/>
        <span style={{fontSize:12,fontWeight:600,color:"#1C2B4A"}}>{prof.name}</span>
        <span style={{fontSize:11,color:accent,background:`${accent}15`,padding:"1px 7px",borderRadius:10,fontWeight:500}}>{GL[prof.group as keyof typeof GL]}</span>
      </div>
    )}
  </div>
);

// ─── ANIMATED LANDING ICONS ───────────────────────────────────────────────────
const FloatingIcons = () => {
  const items = [
    {id:"maverick",x:5,dur:8,delay:0,size:72,opacity:0.22},
    {id:"promoter",x:14,dur:10,delay:1,size:60,opacity:0.18},
    {id:"captain",x:24,dur:7,delay:2,size:80,opacity:0.24},
    {id:"scholar",x:34,dur:9,delay:0.5,size:56,opacity:0.17},
    {id:"venturer",x:44,dur:11,delay:3,size:76,opacity:0.21},
    {id:"guardian",x:54,dur:8,delay:1.5,size:64,opacity:0.19},
    {id:"artisan",x:63,dur:10,delay:4,size:60,opacity:0.18},
    {id:"collaborator",x:73,dur:7,delay:2.5,size:72,opacity:0.22},
    {id:"analyzer",x:83,dur:9,delay:0.8,size:56,opacity:0.17},
    {id:"operator",x:91,dur:11,delay:5,size:68,opacity:0.20},
    {id:"adapter",x:9,dur:8,delay:4,size:64,opacity:0.19},
    {id:"persuader",x:19,dur:9,delay:5.5,size:52,opacity:0.16},
    {id:"controller",x:29,dur:10,delay:3.5,size:72,opacity:0.20},
    {id:"altruist",x:39,dur:7,delay:6,size:60,opacity:0.18},
    {id:"specialist",x:49,dur:11,delay:2,size:56,opacity:0.17},
    {id:"individualist",x:59,dur:8,delay:7,size:68,opacity:0.21},
    {id:"strategist",x:78,dur:9,delay:4.5,size:52,opacity:0.16},
    {id:"maverick",x:68,dur:10,delay:1.2,size:58,opacity:0.16},
    {id:"captain",x:88,dur:7,delay:3.2,size:66,opacity:0.19},
    {id:"venturer",x:2,dur:9,delay:6.5,size:70,opacity:0.20},
  ];
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {items.map((item,i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${item.x}%`,
          bottom:"-90px",
          opacity:item.opacity,
          animation:`floatUp ${item.dur}s ${item.delay}s linear infinite`,
        }}>
          <PIIcon id={item.id} size={item.size} bgColor="rgba(255,255,255,0.88)"/>
        </div>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PIlot() {
  const [step, setStep] = useState(0);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [aiProfile, setAiProfile] = useState<any>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [aboutYou, setAboutYou] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const [usedChips, setUsedChips] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const prof = PROFILES.find(p => p.id === profileId);
  const qs = profileId ? QUESTIONS[profileId] || [] : [];
  const accent = prof ? GA[prof.group as keyof typeof GA] : B.blue;
  const chips = profileId ? (CHIPS[profileId] || []).filter(c => !usedChips.includes(c)).slice(0, 4) : [];

  // ── STYLES ──
  useEffect(() => {
    document.documentElement.setAttribute("dir", "ltr");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);
    const s = document.createElement("style");
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#F0F4F8}::-webkit-scrollbar-thumb{background:#CBD5E0;border-radius:4px}
      @keyframes stepIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes floatUp{0%{transform:translateY(0);opacity:var(--op,0.15)}100%{transform:translateY(-110vh);opacity:0}}
      .float{animation:float 3s ease-in-out infinite}
      textarea{direction:ltr!important;text-align:left!important;unicode-bidi:normal!important}
      textarea:focus{outline:none}
    `;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(link); document.head.removeChild(s); } catch(e) {} };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);
  useEffect(() => { if (step === 4 || step === 5) setTimeout(() => setBarsVisible(true), 300); }, [step]);
  useEffect(() => { setSelectedOption(null); setCurrentAnswer(""); }, [currentQ]);
  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.setAttribute("dir", "ltr");
    taRef.current.style.direction = "ltr";
    taRef.current.style.textAlign = "left";
    taRef.current.style.unicodeBidi = "normal";
  }, [currentQ, step]);

  const inter = { fontFamily: "'Inter', sans-serif" };
  const mono = { fontFamily: "'Space Mono', monospace" };

  // ── FILE HANDLER ──
  const handleFile = (file: File) => {
    if (!file || file.type !== "application/pdf") return;
    setPdfFileName(file.name);
    const r = new FileReader();
    r.onload = e => {
        const result = e.target?.result;
        if (typeof result === "string") {
            setPdfBase64(result.split(",")[1]);
        }
    };
    r.readAsDataURL(file);
  };

  // ── PDF ANALYSIS (Gemini version) ──
  const analyzeReport = async () => {
    if (!pdfBase64) return;
    setIsAnalyzing(true);
    setAnalyzeError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isAnalysis: true,
          pdfBase64: pdfBase64,
          prompt: `You are analyzing a Predictive Index (PI) Behavioral Assessment report PDF.\n\nYour primary task is to identify the EXACT reference profile name stated in this report. Look for text like "Maverick", "Captain", "Collaborator", "Altruist", "Persuader", "Promoter", "Analyzer", "Controller", "Specialist", "Strategist", "Venturer", "Individualist", "Scholar", "Adapter", "Artisan", "Guardian", or "Operator".\n\nAlso extract:\n1. The numerical scores from the Synthesis behavioral graph (estimate 0-100 from bar heights)\n2. The strengths listed in the report\n3. The watch-outs / caution areas listed\n4. The most insightful sentence from the written summary about this person\n5. A direct quote from the report's narrative text\n\nReturn ONLY valid JSON (no markdown, no explanation):\n{\n  "profileName": "EXACT profile name as it appears in the report",\n  "confidence": "high|medium|low",\n  "dominance": NUMBER,\n  "extraversion": NUMBER,\n  "patience": NUMBER,\n  "formality": NUMBER,\n  "strengths": ["strength from report", "second strength", "third strength"],\n  "watchOuts": ["watch-out from report", "second watch-out"],\n  "coreInsight": "One sharp sentence summarizing this person's behavioral core based on actual report text",\n  "keyQuote": "The single most revealing sentence directly from the report's written narrative"\n}`
        })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      const parsed = JSON.parse(data.text.replace(/```json|```/g, "").trim());
      const detectedId = normP(parsed.profileName);
      if (!detectedId) {
        setAnalyzeError("Couldn't confidently detect your profile from this PDF.");
        setIsAnalyzing(false);
        return;
      }
      setAiProfile(parsed);
      setProfileId(detectedId);
      setIsAnalyzing(false);
      setStep(2);
    } catch (e) {
      console.error(e);
      setAnalyzeError("Something went wrong analyzing your report. Please try again.");
      setIsAnalyzing(false);
    }
  };

  // ── SUBMIT QUESTION ANSWER ──
  const submitAnswer = () => {
    const ans = qs[currentQ]?.type === "sjt" ? selectedOption : currentAnswer;
    if (!ans?.trim()) return;
    const label = qs[currentQ]?.type === "sjt"
      ? `[Scenario: "${qs[currentQ].text.slice(0, 60)}..."] → "${ans}"`
      : ans;
    const next = [...answers, label];
    setAnswers(next);
    if (currentQ < qs.length - 1) setCurrentQ(q => q + 1);
    else setStep(4);
  };

  // ── BUILD AI CONTEXT ──
  const buildCtx = () => {
    const ap = aiProfile || {};
    return `You are PIlot — an incisive AI career navigator built on Predictive Index behavioral science by Predictive Success Corporation.

PROFILE DETECTED FROM REPORT: ${prof?.name} (${prof?.tagline})
Group: ${GL[prof?.group as keyof typeof GL]}
Behavioral Dimensions (extracted from PDF Synthesis graph):
  Dominance: ${ap.dominance} | Extraversion: ${ap.extraversion} | Patience: ${ap.patience} | Formality: ${ap.formality}
PDF Detection Confidence: ${ap.confidence}
Core Insight from Report: ${ap.coreInsight}
Key Quote from Report: "${ap.keyQuote}"
Strengths listed in report: ${ap.strengths?.join(", ")}
Watch-outs listed in report: ${ap.watchOuts?.join(", ")}

PERSONAL CONTEXT (user's own words):
${aboutYou ? `About themselves: "${aboutYou}"` : "No personal context provided."}

BEHAVIORAL QUESTION RESPONSES:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Be direct, specific, and genuinely personalized. Reference their exact words from answers and personal context. Never be generic or repeat obvious PI profile facts — go deeper.`;
  };

  // ── OPEN CHAT (Gemini version) ──
  const openChat = async () => {
    setStep(5);
    setIsLoading(true);
    try {
      const initialMsg = [{ role: "user", content: "Give me a sharp, direct opening read on me. Reference my specific answers and the data from my actual report. What's the one thing I should understand about myself right now that I'm probably not fully seeing? Under 160 words. No fluff." }];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isChat: true,
          systemInstruction: buildCtx(),
          messages: initialMsg
        })
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.text }]);
    } catch (e) {
      setMessages([{ role: "assistant", content: `Your ${prof?.name} profile is loaded. Ask me anything.` }]);
    }
    setIsLoading(false);
  };

  // ── SEND CHAT MESSAGE (Gemini version) ──
  const sendMsg = async (msg?: string) => {
    const userMsg = msg || chatInput;
    if (!userMsg?.trim() || isLoading) return;
    if (msg && chips.includes(msg)) setUsedChips(u => [...u, msg]);
    const newMsgs = [...messages, { role: "user", content: userMsg }];
    setMessages(newMsgs); setChatInput(""); setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isChat: true,
          systemInstruction: buildCtx(),
          messages: newMsgs
        })
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.text }]);
    } catch (e) { setMessages([...newMsgs, { role: "assistant", content: "Something went wrong. Try again." }]); }
    setIsLoading(false);
  };

  // ══════════════════════════════════════════════════════════════════
  // STEP 0: LANDING
  // ══════════════════════════════════════════════════════════════════
  if (step === 0) return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, #1C2B4A 0%, #2CB5E8 60%, #1a9fd4 100%)`, ...inter, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <FloatingIcons />
      <div style={{ position: "absolute", top: 20, left: 24, display: "flex", alignItems: "center", gap: 8, zIndex: 2 }}>
        <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.2)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>P</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>P<span style={{display:"inline-flex",flexDirection:"column",alignItems:"center",verticalAlign:"middle",margin:"0 0.5px",gap:"2px"}}><span style={{display:"block",width:"8px",height:"1.5px",background:"#fff",borderRadius:1}}/><span style={{display:"block",width:"2px",height:"8px",background:"#fff",borderRadius:1}}/><span style={{display:"block",width:"8px",height:"1.5px",background:"#fff",borderRadius:1}}/></span>lot</span>
      </div>
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 560 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "6px 16px", marginBottom: 28, backdropFilter: "blur(8px)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", letterSpacing: 0.5 }}>Powered by Predictive Index® Science</span>
        </div>
        <h1 style={{ fontSize: "clamp(38px,7vw,68px)", fontWeight: 700, color: "#fff", lineHeight: 1.08, marginBottom: 20 }}>
          Know yourself.<br />Navigate your career.
        </h1>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: 44, maxWidth: 420, margin: "0 auto 44px" }}>
          Upload your PI Behavioral Report and get AI-powered career guidance personalized to who you actually are.
        </p>
        <button onClick={() => setStep(1)}
          style={{ background: "#fff", border: "none", borderRadius: 10, padding: "15px 44px", color: B.navy, fontSize: 16, fontWeight: 700, cursor: "pointer", ...inter, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", transition: "transform .2s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}>
          Begin Your Journey →
        </button>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
          {["17 PI Profiles", "AI-powered", "Report analysis", "Personalized advice"].map((f, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{f}</div>
          ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════
  // STEP 1: UPLOAD + ANALYSIS
  // ══════════════════════════════════════════════════════════════════
  if (step === 1) return (
    <div style={{ minHeight: "100vh", background: B.offWhite, ...inter, direction: "ltr" }}>
      <TopBar prof={null} step={step} accent={accent} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 20px" }}>
        <div key="step-1" style={{ animation: "stepIn .35s ease both" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 36, justifyContent: "center" }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width: i===0?24:8, height: 8, borderRadius: 4, background: i===0?B.blue:B.gray100, transition: "all .3s" }}/>)}
          </div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: B.navy, marginBottom: 8 }}>Upload Your PI Report</h2>
            <p style={{ color: B.gray500, fontSize: 15, lineHeight: 1.6 }}>PIlot will read your report, identify your profile, and extract your behavioral data automatically.</p>
          </div>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            style={{ border: `2px dashed ${dragOver ? B.blue : pdfFileName ? B.green : B.gray100}`, borderRadius: 16, padding: "52px 32px", cursor: isAnalyzing ? "default" : "pointer", background: isAnalyzing ? B.gray50 : pdfFileName ? `${B.green}05` : dragOver ? `${B.blue}05` : B.white, transition: "all .2s", textAlign: "center", marginBottom: 16 }}>
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={e => handleFile(e.target.files?.[0] as File)} style={{ display: "none" }} />
            {isAnalyzing ? (
              <>
                <div style={{ width: 48, height: 48, border: `3px solid ${B.gray100}`, borderTop: `3px solid ${B.blue}`, borderRadius: "50%", margin: "0 auto 16px", animation: "pulse 1s infinite" }}/>
                <div style={{ fontWeight: 600, fontSize: 15, color: B.navy, marginBottom: 6 }}>Analyzing your report...</div>
                <div style={{ fontSize: 13, color: B.gray300 }}>Reading your behavioral graph and identifying your profile</div>
              </>
            ) : pdfFileName ? (
              <>
                <div style={{ fontSize: 36, color: B.green, marginBottom: 10 }}>✓</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: B.green, marginBottom: 4 }}>{pdfFileName}</div>
                <div style={{ fontSize: 12, color: B.gray300 }}>Click to change file</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 40, color: B.gray100, marginBottom: 14 }}>↑</div>
                <div style={{ fontWeight: 600, fontSize: 16, color: B.navy, marginBottom: 6 }}>Drop your PI report PDF here</div>
                <div style={{ fontSize: 13, color: B.gray300 }}>or click to browse · PDF files only</div>
              </>
            )}
          </div>
          {analyzeError && (
            <div style={{ background: `${B.red}10`, border: `1px solid ${B.red}30`, borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: B.red, lineHeight: 1.5 }}>⚠️ {analyzeError}</p>
            </div>
          )}
          <button
            onClick={analyzeReport}
            disabled={!pdfFileName || isAnalyzing}
            style={{ width: "100%", background: pdfFileName && !isAnalyzing ? B.blue : B.gray100, border: "none", borderRadius: 10, padding: "14px", color: pdfFileName && !isAnalyzing ? "#fff" : B.gray300, fontSize: 15, fontWeight: 600, cursor: pdfFileName && !isAnalyzing ? "pointer" : "not-allowed", ...inter, transition: "all .2s" }}>
            {isAnalyzing ? "Analyzing..." : "Analyze My Report →"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: B.gray300, marginTop: 12 }}>Your report is processed securely and never stored</p>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════
  // STEP 2: ABOUT YOU (optional freeform)
  // ══════════════════════════════════════════════════════════════════
  if (step === 2) return (
    <div style={{ minHeight: "100vh", background: B.offWhite, ...inter, direction: "ltr" }}>
      <TopBar prof={prof} step={step} accent={accent} />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 20px" }}>
        <div key="step-2" style={{ animation: "stepIn .35s ease both" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 36, justifyContent: "center" }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width: i<=1?24:8, height: 8, borderRadius: 4, background: i<=1?B.blue:B.gray100, transition: "all .3s" }}/>)}
          </div>
          <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 14, padding: 20, marginBottom: 28, display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <PIIcon id={prof?.id} size={56} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.gray300, textTransform: "uppercase", letterSpacing: .5, marginBottom: 3 }}>Profile detected from your report</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: B.navy }}>{prof?.name}</div>
              <div style={{ fontSize: 12, color: B.gray500, marginTop: 2 }}>{prof?.tagline}</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ background: `${accent}15`, color: accent, borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{GL[prof?.group as keyof typeof GL]}</span>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: B.navy, marginBottom: 8 }}>Tell PIlot a bit about yourself</h2>
            <p style={{ color: B.gray500, fontSize: 14, lineHeight: 1.6 }}>This is optional but makes your advice significantly more specific. Share anything relevant — your background, what you're working toward, what's on your mind.</p>
          </div>
          <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 12, padding: 4, marginBottom: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            <textarea
              ref={taRef}
              dir="ltr"
              value={aboutYou}
              onChange={e => setAboutYou(e.target.value)}
              placeholder={`e.g. "I'm 19 and in my first year of Computer Science. Outside of school I perform music — saxophone and guitar mostly — and I've spent a lot of time leading things: student council, training teams for competitions, running large events. I'm drawn to building new things and I'm trying to figure out where that energy belongs — whether that's a startup, a company I want to work for, or something I haven't thought of yet."`}
              rows={5}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", padding: "14px", color: B.navy, fontSize: 14, ...inter, resize: "none", lineHeight: 1.7, direction: "ltr", textAlign: "left" }}
            />
          </div>
          <p style={{ fontSize: 12, color: B.gray300, marginBottom: 28 }}>The more specific you are, the sharper your results.</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: B.gray300, fontSize: 13, cursor: "pointer", fontWeight: 500, ...inter }}>← Back</button>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(3)} style={{ background: "none", border: `1px solid ${B.gray100}`, borderRadius: 8, padding: "10px 20px", color: B.gray500, fontSize: 13, fontWeight: 500, cursor: "pointer", ...inter }}>Skip</button>
              <button onClick={() => setStep(3)} style={{ background: B.blue, border: "none", borderRadius: 8, padding: "10px 24px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", ...inter }}>
                {aboutYou.trim() ? "Continue →" : "Continue →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════
  // STEP 3: PROFILE-SPECIFIC QUESTIONS
  // ══════════════════════════════════════════════════════════════════
  if (step === 3) {
    const cq = qs[currentQ];
    const isOpen = cq?.type === "open";
    const canSubmit = isOpen ? currentAnswer.trim().length > 2 : selectedOption !== null;
    return (
      <div style={{ minHeight: "100vh", background: B.offWhite, ...inter, direction: "ltr" }}>
        <TopBar prof={prof} step={step} accent={accent} />
        <div style={{ maxWidth: 580, margin: "0 auto", padding: "32px 20px 60px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, justifyContent: "center" }}>
            {[0,1,2,3].map(i => <div key={i} style={{ width: i<=2?24:8, height: 8, borderRadius: 4, background: i<=2?B.blue:B.gray100, transition: "all .3s" }}/>)}
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: B.gray300, fontWeight: 500 }}>Question {currentQ + 1} of {qs.length}</span>
              <span style={{ fontSize: 12, color: accent as string, fontWeight: 600, background: `${accent}12`, padding: "2px 10px", borderRadius: 10 }}>{isOpen ? "Open response" : "Choose one"}</span>
            </div>
            <div style={{ height: 3, background: B.gray100, borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${(currentQ / qs.length) * 100}%`, background: accent as string, borderRadius: 2, transition: "width .4s ease" }} />
            </div>
          </div>
          <div key={`q${currentQ}`} style={{ animation: "stepIn .3s ease both" }}>
            <div style={{ background: B.white, borderRadius: 14, padding: 26, marginBottom: 16, border: `1px solid ${B.gray100}`, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.65, color: B.navy, marginBottom: isOpen ? 18 : 22 }}>{cq?.text}</h3>
              {isOpen ? (
                <>
                  <textarea
                    ref={taRef}
                    dir="ltr"
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitAnswer(); }}
                    placeholder={cq?.placeholder || "Be direct and specific."}
                    autoFocus rows={4}
                    style={{ width: "100%", background: B.gray50, border: `1px solid ${currentAnswer ? B.blue : B.gray100}`, borderRadius: 8, padding: "13px", color: B.navy, fontSize: 14, ...inter, resize: "none", lineHeight: 1.7, transition: "border-color .2s", minHeight: 110, direction: "ltr", textAlign: "left" }}
                  />
                  <p style={{ fontSize: 11, color: B.gray300, marginTop: 6, textAlign: "right" }}>⌘/Ctrl+Enter to continue</p>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {cq?.options?.map((opt: string, i: number) => (
                    <button key={i} onClick={() => setSelectedOption(opt)}
                      style={{ background: selectedOption===opt ? `${B.blue}10` : B.white, border: `2px solid ${selectedOption===opt ? B.blue : B.gray100}`, borderRadius: 9, padding: "13px 15px", textAlign: "left", fontSize: 13, lineHeight: 1.5, ...inter, color: selectedOption===opt ? B.blue : B.gray700, cursor: "pointer", transition: "border-color .12s, background .12s", display: "flex", alignItems: "center", gap: 10 }}
                      onMouseEnter={e => { if (selectedOption !== opt) e.currentTarget.style.borderColor = B.gray300; }}
                      onMouseLeave={e => { if (selectedOption !== opt) e.currentTarget.style.borderColor = B.gray100; }}>
                      <span style={{ ...mono, fontSize: 11, color: selectedOption===opt ? B.blue : B.gray300, flexShrink: 0, minWidth: 18 }}>{String.fromCharCode(65+i)}.</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {selectedOption === opt && <span style={{ color: B.blue }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => { if (currentQ > 0) { setCurrentQ(q => q-1); setAnswers(a => a.slice(0,-1)); } else setStep(2); }}
                style={{ background: "none", border: "none", color: B.gray300, fontSize: 13, cursor: "pointer", fontWeight: 500, ...inter }}>← Back</button>
              <button onClick={submitAnswer} disabled={!canSubmit}
                style={{ background: canSubmit ? B.blue : B.gray100, border: "none", borderRadius: 8, padding: "11px 26px", color: canSubmit ? "#fff" : B.gray300, fontSize: 13, fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed", ...inter }}>
                {currentQ < qs.length - 1 ? "Next →" : "See My Results →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // STEP 4: ANALYSIS REVEAL
  // ══════════════════════════════════════════════════════════════════
  if (step === 4) {
    const ap = aiProfile || {};
    const dims = [
      { label:"Dominance",    desc:"Collaborative → Independent", val:ap.dominance??prof?.D??50,   color:B.red    },
      { label:"Extraversion", desc:"Reserved → Sociable",         val:ap.extraversion??prof?.E??50, color:B.yellow },
      { label:"Patience",     desc:"Driving → Steady",            val:ap.patience??prof?.P??50,    color:B.green  },
      { label:"Formality",    desc:"Flexible → Precise",          val:ap.formality??prof?.F??50,   color:B.blue   },
    ];
    return (
      <div style={{ minHeight: "100vh", background: B.offWhite, ...inter, direction: "ltr" }}>
        <TopBar prof={prof} step={step} accent={accent} />
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 60px" }}>
          <div key="step-4" style={{ animation: "stepIn .35s ease both" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, justifyContent: "center" }}>
              {[0,1,2,3].map(i => <div key={i} style={{ width: 24, height: 8, borderRadius: 4, background: B.blue }}/>)}
            </div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${B.green}15`, borderRadius: 20, padding: "6px 14px", marginBottom: 14 }}>
                <span style={{ color: B.green, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: B.green }}>Analysis Complete</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: B.navy, marginBottom: 6 }}>Here's What We Found</h2>
              <p style={{ color: B.gray500, fontSize: 14 }}>Extracted directly from your report, cross-referenced with your responses</p>
            </div>

            <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 14, padding: 24, marginBottom: 14, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <div className="float"><PIIcon id={prof?.id} size={64}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: B.gray300, textTransform: "uppercase", letterSpacing: .5, marginBottom: 4 }}>Your Profile</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: B.navy, marginBottom: 4 }}>{prof?.name}</div>
                <div style={{ fontSize: 13, color: B.gray500 }}>{prof?.tagline}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ background: `${accent}15`, color: accent as string, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>{GL[prof?.group as keyof typeof GL]}</span>
                {aboutYou && <div style={{ fontSize: 11, color: B.gray300, marginTop: 8 }}>+ personal context included</div>}
              </div>
            </div>

            <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 14, padding: 22, marginBottom: 14, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontWeight: 600, fontSize: 12, color: B.gray300, marginBottom: 18, textTransform: "uppercase", letterSpacing: .5 }}>Behavioral Dimensions — Extracted From Your Synthesis Graph</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {dims.map((d, i) => (
                  <div key={d.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>{d.label}</div>
                        <div style={{ fontSize: 11, color: B.gray300 }}>{d.desc}</div>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: d.color }}>{d.val}</span>
                    </div>
                    <div style={{ height: 5, background: B.gray100, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: barsVisible ? `${d.val}%` : "0%", background: d.color, borderRadius: 3, transition: `width 1s ${.1+i*.1}s cubic-bezier(.4,0,.2,1)` }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: ap.keyQuote ? "1fr 1fr" : "1fr", gap: 14, marginBottom: 14 }}>
              <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 12, padding: 18 }}>
                <p style={{ fontWeight: 600, fontSize: 12, color: B.gray300, marginBottom: 10, textTransform: "uppercase", letterSpacing: .5 }}>Core Insight</p>
                <p style={{ fontSize: 14, color: B.gray700, lineHeight: 1.65, fontStyle: "italic" }}>"{ap.coreInsight || "Generating..."}"</p>
              </div>
              {ap.keyQuote && (
                <div style={{ background: `${B.blue}08`, border: `1px solid ${B.blue}20`, borderRadius: 12, padding: 18 }}>
                  <p style={{ fontWeight: 600, fontSize: 12, color: B.blue, marginBottom: 10, textTransform: "uppercase", letterSpacing: .5 }}>Directly From Your Report</p>
                  <p style={{ fontSize: 13, color: B.gray700, lineHeight: 1.65, fontStyle: "italic" }}>"{ap.keyQuote}"</p>
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
              {[{ label:"Strengths", color:B.green, items:ap.strengths }, { label:"Watch-Outs", color:B.red, items:ap.watchOuts }].map(sec => (
                <div key={sec.label} style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 12, padding: 18 }}>
                  <p style={{ fontWeight: 600, fontSize: 12, color: sec.color, marginBottom: 12, textTransform: "uppercase", letterSpacing: .5 }}>{sec.label}</p>
                  {(sec.items || []).map((item: string, i: number) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: sec.color, marginTop: 7, flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, color: B.gray700, lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={openChat}
                style={{ background: B.blue, border: "none", borderRadius: 10, padding: "14px 44px", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", ...inter, boxShadow: `0 4px 20px ${B.blue}40`, transition: "transform .2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = ""}>
                Talk to PIlot →
              </button>
              <p style={{ fontSize: 12, color: B.gray300, marginTop: 10 }}>Ask about career paths, your strengths, team dynamics, and more</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // STEP 5: CHAT
  // ══════════════════════════════════════════════════════════════════
  if (step === 5) {
    const ap = aiProfile || {};
    const dims = [
      { label:"Dominance",    val:ap.dominance??prof?.D??50,   color:B.red    },
      { label:"Extraversion", val:ap.extraversion??prof?.E??50, color:B.yellow },
      { label:"Patience",     val:ap.patience??prof?.P??50,    color:B.green  },
      { label:"Formality",    val:ap.formality??prof?.F??50,   color:B.blue   },
    ];
    return (
      <div style={{ height: "100vh", background: B.white, ...inter, display: "grid", gridTemplateColumns: "258px 1fr", overflow: "hidden", direction: "ltr" }}>
        <div style={{ borderRight: `1px solid ${B.gray100}`, display: "flex", flexDirection: "column", background: B.offWhite, overflowY: "auto" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${B.gray100}`, background: B.white, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, background: B.blue, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>P</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: B.navy, letterSpacing: -0.5 }}>P<span style={{display:"inline-flex",flexDirection:"column",alignItems:"center",verticalAlign:"middle",margin:"0 0.5px",gap:"1.5px"}}><span style={{display:"block",width:"6px",height:"1.5px",background:B.navy,borderRadius:1}}/><span style={{display:"block",width:"2px",height:"6px",background:B.navy,borderRadius:1}}/><span style={{display:"block",width:"6px",height:"1.5px",background:B.navy,borderRadius:1}}/></span>lot</span>
          </div>
          <div style={{ padding: 14 }}>
            <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 12, padding: 14, marginBottom: 12, textAlign: "center" }}>
              <div className="float" style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><PIIcon id={prof?.id} size={52}/></div>
              <div style={{ fontWeight: 700, fontSize: 15, color: B.navy, marginBottom: 3 }}>{prof?.name}</div>
              <div style={{ fontSize: 11, color: B.gray500, lineHeight: 1.4, marginBottom: 8 }}>{prof?.tagline}</div>
              <span style={{ background: `${accent}15`, color: accent as string, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{GL[prof?.group as keyof typeof GL]}</span>
            </div>
            <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: B.gray300, textTransform: "uppercase", letterSpacing: .5, marginBottom: 12 }}>Behavioral Profile</p>
              {dims.map((d, i) => (
                <div key={d.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: B.navy, fontWeight: 500 }}>{d.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.val}</span>
                  </div>
                  <div style={{ height: 4, background: B.gray100, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: barsVisible ? `${d.val}%` : "0%", background: d.color, borderRadius: 2, transition: `width .9s ${.1+i*.1}s cubic-bezier(.4,0,.2,1)` }}/>
                  </div>
                </div>
              ))}
            </div>
            {ap.coreInsight && (
              <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: B.gray300, textTransform: "uppercase", letterSpacing: .5, marginBottom: 6 }}>Core Insight</p>
                <p style={{ fontSize: 11, color: B.gray700, lineHeight: 1.55, fontStyle: "italic" }}>"{ap.coreInsight}"</p>
              </div>
            )}
            <button onClick={() => setStep(4)} style={{ width: "100%", background: "none", border: `1px solid ${B.gray100}`, borderRadius: 8, padding: 8, color: B.gray500, fontSize: 12, cursor: "pointer", fontWeight: 500, ...inter }}>← View Analysis</button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <div style={{ padding: "12px 20px", borderBottom: `1px solid ${B.gray100}`, display: "flex", alignItems: "center", gap: 10, background: B.white }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${B.blue}20`, border: `1px solid ${B.blue}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: B.navy }}>PIlot AI</div>
              <div style={{ fontSize: 11, color: B.green, fontWeight: 500 }}>● Active — {prof?.name} profile loaded</div>
            </div>
            <div style={{ flex: 1 }}/>
            <span style={{ fontSize: 12, color: B.gray300 }}>Career · Strengths · Teams · Paths</span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: B.offWhite }}>
            {messages.length === 0 && isLoading && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${B.blue}20`, border: `1px solid ${B.blue}30`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✦</div>
                <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: "4px 12px 12px 12px", padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 5 }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: B.blue, animation: `pulse 1.2s ${i*.2}s infinite` }}/>)}</div>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: msg.role==="user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${B.blue}20`, border: `1px solid ${B.blue}30`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginTop: 2 }}>✦</div>}
                <div style={{ maxWidth: "76%", background: msg.role==="user" ? B.blue : B.white, border: msg.role==="user" ? "none" : `1px solid ${B.gray100}`, borderRadius: msg.role==="user" ? "12px 4px 12px 12px" : "4px 12px 12px 12px", padding: "11px 14px", fontSize: 14, lineHeight: 1.75, color: msg.role==="user" ? "#fff" : B.gray700, whiteSpace: "pre-wrap", direction: "ltr" }}>
                  {msg.content}
                </div>
                {msg.role === "user" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${accent}15`, border: `1px solid ${accent}30`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, ...mono, color: accent as string, marginTop: 2 }}>{prof?.name?.slice(0,2).toUpperCase()}</div>}
              </div>
            ))}
            {isLoading && messages.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${B.blue}20`, border: `1px solid ${B.blue}30`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✦</div>
                <div style={{ background: B.white, border: `1px solid ${B.gray100}`, borderRadius: "4px 12px 12px 12px", padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 5 }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: B.blue, animation: `pulse 1.2s ${i*.2}s infinite` }}/>)}</div>
                </div>
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>

          {chips.length > 0 && !isLoading && (
            <div style={{ padding: "8px 16px", background: B.white, borderTop: `1px solid ${B.gray100}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {chips.map((chip, i) => (
                <button key={i} onClick={() => sendMsg(chip)}
                  style={{ background: B.offWhite, border: `1px solid ${B.gray100}`, borderRadius: 20, padding: "6px 14px", fontSize: 12, color: B.navy, cursor: "pointer", fontWeight: 500, transition: "all .15s", ...inter, whiteSpace: "nowrap" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${B.blue}10`; e.currentTarget.style.borderColor = B.blue; e.currentTarget.style.color = B.blue; }}
                  onMouseLeave={e => { e.currentTarget.style.background = B.offWhite; e.currentTarget.style.borderColor = B.gray100; e.currentTarget.style.color = B.navy; }}>
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: "12px 20px", background: B.white, borderTop: `1px solid ${B.gray100}` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end", background: B.offWhite, border: `1px solid ${B.gray100}`, borderRadius: 10, padding: "10px 14px", transition: "border-color .2s" }}
              onFocusCapture={e => e.currentTarget.style.borderColor = B.blue}
              onBlurCapture={e => e.currentTarget.style.borderColor = B.gray100}>
              <textarea
                dir="ltr"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                placeholder={`Ask PIlot about your ${prof?.name} career path...`}
                rows={1}
                style={{ flex: 1, background: "none", border: "none", outline: "none", color: B.navy, fontSize: 13, ...inter, resize: "none", lineHeight: 1.5, maxHeight: 110, direction: "ltr", textAlign: "left" }}
              />
              <button onClick={() => sendMsg()} disabled={!chatInput.trim() || isLoading}
                style={{ width: 32, height: 32, borderRadius: 8, background: chatInput.trim() && !isLoading ? B.blue : B.gray100, border: "none", cursor: chatInput.trim() && !isLoading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, transition: "background .2s", color: chatInput.trim() && !isLoading ? "#fff" : B.gray300 }}>→</button>
            </div>
            <p style={{ ...mono, fontSize: 10, color: B.gray100, textAlign: "center", marginTop: 6 }}>Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    );
  }

  // return null;
}