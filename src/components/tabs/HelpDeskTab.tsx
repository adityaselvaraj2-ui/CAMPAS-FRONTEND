import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Clock, Users, Bus, HeartPulse, FileText, RotateCcw, HelpCircle, Loader2, Navigation, ExternalLink } from 'lucide-react';
import { sendChatMessage } from '../../lib/api';

type CampusProp = 'SJCE' | 'SJIT' | 'CIT' | 'KPR' | null;

interface HelpDeskTabProps {
  campus: CampusProp;
}

interface Message { 
  from: 'user' | 'bot'; 
  text: string; 
  action?: 'chat' | 'navigate' | 'info';
  destination?: {
    name: string;
    mapsQuery: string;
    coordinates?: string;
    key: string;
  };
}

const FAQ_COMMON: Record<string, string> = {
  "exam schedule": "Exam schedules are on the 📅 EVENTS tab. Filter by 'Exam' category.",
  "attendance": "Minimum 75% attendance required. Check your attendance on the college portal.",
  "id card lost": "Report lost ID cards at the Admin Block. Replacement fee: ₹200.",
  "grievance": "Submit grievances through the 📝 Grievance Form flip card.",
  "medical emergency": "Contact the campus Medical Centre immediately or call 108.",
};

const FAQ_SJCE: Record<string, string> = {
  "library location": "SJCE Library is in Block A, ground floor. Use 🗺️ NAVIGATE → 'Central Library'.",
  "library timings": "SJCE Library: Mon–Fri 8AM–8PM, Sat 9AM–5PM, Sun Closed.",
  "canteen timings": "SJCE Main Canteen: Mon–Sat 7:30AM–9PM, Sun 9AM–6PM.",
  "mess timings": "SJCE Mess: Breakfast 7–9AM, Lunch 11:30AM–2:30PM, Snacks 4–5:30PM, Dinner 7–9:30PM.",
  "hostel curfew": "SJCE Boys Hostel: 9:30PM. Girls Hostel: 8:30PM. Gates open 5:30AM.",
  "bus timings": "SJCE buses depart Main Gate: 7:15AM, 8:00AM, 8:30AM. Return: 4:30PM, 5:15PM.",
  "wifi password": "SJCE WiFi: 'SJCE_STUDENT'. Contact IT Help Desk ext. 2201 for credentials.",
  "hod contact": "See the 📋 HOD Directory flip card for SJCE department-wise contacts.",
  "placement": "SJCE Placement Cell: Mon–Fri 9AM–5PM. Check EVENTS for upcoming drives.",
  "seminar hall": "SJCE Seminar Hall capacity: 800. Booking via Admin Block.",
  "sports ground": "SJCE Sports Ground open daily 6AM–7PM. Equipment from PE office.",
  "parking": "SJCE: Two-wheeler near Main Gate, car parking behind Admin Block.",
  "transport info": "SJCE buses cover OMR, ECR, Velachery, Tambaram, T.Nagar.",
  "fee payment": "SJCE fees: Admin Block counter or college online portal.",
};

const FAQ_SJIT: Record<string, string> = {
  "library location": "SJIT Library is in the Main Block, 1st floor. Use 🗺️ NAVIGATE → 'SJIT Library'.",
  "library timings": "SJIT Library: Mon–Fri 8:30AM–7:30PM, Sat 9AM–4PM, Sun Closed.",
  "canteen timings": "SJIT Canteen: Mon–Sat 8AM–8:30PM, Sun 9AM–5PM.",
  "mess timings": "SJIT Mess: Breakfast 7:30–9AM, Lunch 12–2PM, Snacks 4:30–5:30PM, Dinner 7:30–9PM.",
  "hostel curfew": "SJIT Boys Hostel: 9:00PM. Girls Hostel: 8:00PM. Gates open 5:45AM.",
  "bus timings": "SJIT buses depart from SJIT Gate: 7:20AM, 8:10AM, 8:45AM. Return: 4:45PM, 5:30PM.",
  "wifi password": "SJIT WiFi: 'SJIT_STUDENT'. Contact SJIT IT Desk ext. 3201 for credentials.",
  "hod contact": "See the 📋 HOD Directory flip card for SJIT department-wise contacts.",
  "placement": "SJIT Placement Cell: Mon–Fri 9AM–5PM. Check EVENTS tab for upcoming drives.",
  "seminar hall": "SJIT Seminar Hall capacity: 600. Booking via SJIT Admin Block.",
  "sports ground": "SJIT Sports Ground open daily 6AM–7PM. Equipment from SJIT PE dept.",
  "parking": "SJIT: Two-wheeler near SJIT Gate, four-wheeler in designated area Block C.",
  "transport info": "SJIT buses cover Sholinganallur, Perungudi, Guindy, Porur, Ambattur.",
  "fee payment": "SJIT fees: SJIT Admin counter or SJIT online portal.",
};

const FAQ_CIT: Record<string, string> = {
  "library location": "CIT Library is in the Academic Block, ground floor. Use 🗺️ NAVIGATE → 'CIT Library'.",
  "library timings": "CIT Library: Mon–Fri 8AM–7PM, Sat 9AM–3PM, Sun Closed.",
  "canteen timings": "CIT Canteen: Mon–Sat 7:45AM–8PM, Sun Closed.",
  "mess timings": "CIT Mess: Breakfast 7–9AM, Lunch 12–2:30PM, Snacks 4–5PM, Dinner 7–9PM.",
  "hostel curfew": "CIT Boys Hostel: 9:30PM. Girls Hostel: 8:30PM. Gates open 5:30AM.",
  "bus timings": "CIT buses depart from CIT Main Entrance: 7:10AM, 8:00AM, 8:40AM. Return: 4:30PM, 5:00PM.",
  "wifi password": "CIT WiFi: 'CIT_STUDENT'. Contact CIT IT Help Desk ext. 4201 for credentials.",
  "hod contact": "See the 📋 HOD Directory flip card for CIT department-wise contacts.",
  "placement": "CIT Placement Cell: Mon–Fri 9AM–5PM. Check EVENTS tab for drives.",
  "seminar hall": "CIT Seminar Hall capacity: 500. Booking via CIT Admin Office.",
  "sports ground": "CIT Sports Ground open daily 6AM–7PM. Equipment from CIT PE dept.",
  "parking": "CIT: Two-wheeler near CIT Gate, car parking in Annex Block.",
  "transport info": "CIT buses cover Anna Nagar, Koyambedu, Vadapalani, Ashok Nagar, Mogappair.",
  "fee payment": "CIT fees: CIT Admin Block or the CIT student portal.",
};

const FAQ_KPR: Record<string, string> = {
  "library location": "KPR Central Library is near the KPRCAS blocks. Use 🗺️ NAVIGATE → 'Central Library'.",
  "library timings": "KPR Library: Mon–Fri 8AM–8PM, Sat 9AM–5PM, Sun Closed.",
  "canteen timings": "KPR Food Court: Mon–Sat 7:30AM–9PM, Sun 9AM–6PM. Garden Cafe also available.",
  "mess timings": "KPR Mess: Breakfast 7–9AM, Lunch 12–2:30PM, Snacks 4–5:30PM, Dinner 7–9:30PM.",
  "hostel curfew": "KPR Boys Hostel: 9:30PM. Girls Hostel: 8:30PM. Gates open 5:30AM.",
  "bus timings": "KPR buses depart Security Gate: 7:15AM, 8:00AM, 8:45AM. Return: 4:30PM, 5:15PM.",
  "wifi password": "KPR WiFi: 'KPRIET_STUDENT'. Contact IT Help Desk ext. 5201 for credentials.",
  "hod contact": "See the 📋 HOD Directory flip card for KPR department-wise contacts.",
  "placement": "KPR T&P Block: Mon–Fri 9AM–5PM. Check EVENTS for upcoming drives.",
  "seminar hall": "KPR Imperial Hall capacity: 1200. Booking via Admin Office.",
  "sports ground": "KPR has cricket, football, basketball, tennis, and indoor badminton facilities.",
  "parking": "KPR: Bike parking near Security Gate, car parking inside campus.",
  "transport info": "KPR buses cover Coimbatore city — Gandhipuram, RS Puram, Saravanampatti, Peelamedu.",
  "fee payment": "KPR fees: Admin Office counter or KPR online student portal.",
};

const QUICK_CHIPS: Record<NonNullable<CampusProp>, string[]> = {
  SJCE: ["Where is the library?", "Canteen timings?", "Hostel curfew?", "Bus timings?", "Mess timings?", "SJCE WiFi?"],
  SJIT: ["Where is the library?", "Canteen timings?", "Hostel curfew?", "Bus timings?", "Mess timings?", "SJIT WiFi?"],
  CIT:  ["Where is the library?", "Canteen timings?", "Hostel curfew?", "Bus timings?", "Mess timings?", "CIT WiFi?"],
  KPR:  ["Where is the library?", "Canteen timings?", "Hostel curfew?", "Bus timings?", "Mess timings?", "KPR WiFi?"],
};

interface Message { from: 'user' | 'bot'; text: string; }

function getActiveFAQ(campus: CampusProp): Record<string, string> {
  return {
    ...FAQ_COMMON,
    ...(campus === 'SJCE' ? FAQ_SJCE : campus === 'SJIT' ? FAQ_SJIT : campus === 'CIT' ? FAQ_CIT : campus === 'KPR' ? FAQ_KPR : {}),
  };
}

function matchQuery(input: string, campus: CampusProp): string {
  const faq = getActiveFAQ(campus);
  const lower = input.toLowerCase();
  let bestScore = 0;
  let bestAnswer = "I'm not sure about that. Try asking about library timings, canteen hours, hostel curfew, bus routes, or medical help.";
  for (const [key, answer] of Object.entries(faq)) {
    const words = key.split(' ');
    let score = 0;
    for (const w of words) { if (lower.includes(w)) score += 1; }
    score = score / Math.max(words.length, lower.split(' ').length);
    if (score > bestScore) { bestScore = score; bestAnswer = answer; }
  }
  return bestAnswer;
}

const BADGE_COLORS: Record<NonNullable<CampusProp>, { bg: string; border: string; text: string }> = {
  SJCE: { bg: 'hsl(var(--aurora-1) / 0.1)', border: 'hsl(var(--aurora-1) / 0.3)', text: 'hsl(var(--aurora-1))' },
  SJIT: { bg: 'hsl(var(--aurora-2) / 0.1)', border: 'hsl(var(--aurora-2) / 0.3)', text: 'hsl(var(--aurora-2))' },
  CIT:  { bg: 'hsl(var(--aurora-3) / 0.1)', border: 'hsl(var(--aurora-3) / 0.3)', text: 'hsl(var(--aurora-3))' },
  KPR:  { bg: 'hsl(var(--aurora-3) / 0.1)', border: 'hsl(var(--aurora-3) / 0.3)', text: 'hsl(var(--aurora-3))' },
};

const HelpDeskTab = ({ campus }: HelpDeskTabProps) => {
  const welcomeMsg = campus === 'SJCE'
    ? "Welcome to the SJCE Help Desk! Ask me anything about St. Joseph's College of Engineering — timings, locations, or contacts."
    : campus === 'SJIT'
    ? "Welcome to the SJIT Help Desk! Ask me anything about St. Joseph's Institute of Technology — timings, locations, or contacts."
    : campus === 'CIT'
    ? "Welcome to the CIT Help Desk! Ask me anything about Chennai Institute of Technology — timings, locations, or contacts."
    : campus === 'KPR'
    ? "Welcome to the KPR Help Desk! Ask me anything about KPR Institute of Technology — timings, locations, or contacts."
    : "Please select your campus on the Home tab to get campus-specific help.";

  const [messages, setMessages] = useState<Message[]>([{ from: 'bot', text: welcomeMsg }]);
  const [input, setInput] = useState('');
  const [flipped, setFlipped] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ from: 'bot', text: welcomeMsg }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campus]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!campus) {
    return (
      <div className="tab-enter max-w-7xl mx-auto px-4 py-24 text-center">
        <HelpCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
        <p className="font-ui tracking-widest text-muted-foreground/40 text-sm">SELECT YOUR CAMPUS ON THE HOME TAB TO GET CAMPUS-SPECIFIC HELP</p>
      </div>
    );
  }

  const badge = BADGE_COLORS[campus];
  const quickQuestions = QUICK_CHIPS[campus];

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || !campus) return;
    
    const userMsg: Message = { from: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(msg, campus);
      const botMsg: Message = { 
        from: 'bot', 
        text: response.reply,
        action: response.action,
        destination: response.destination
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat API error:', error);
      const fallbackMsg: Message = { 
        from: 'bot', 
        text: "Sorry, I'm having trouble connecting right now. Please try again or contact the help desk directly." 
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open Google Maps navigation
  const openNavigation = (mapsQuery: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;
    window.open(url, '_blank');
  };

  const flipCards = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Emergency Contacts',
      color: 'hsl(var(--nova))',
      content: (
        <div className="space-y-2 text-xs">
          <p><strong>Security:</strong> {campus === 'SJCE' ? '044-2450-0901' : campus === 'SJIT' ? '044-2250-1901' : campus === 'CIT' ? '044-2680-5901' : '0422-265-6901'}</p>
          <p><strong>Medical:</strong> {campus === 'SJCE' ? '044-2450-0900' : campus === 'SJIT' ? '044-2250-1900' : campus === 'CIT' ? '044-2680-5900' : '0422-265-6900'}</p>
          <p><strong>Fire:</strong> 101</p>
          <p><strong>Ambulance:</strong> 108</p>
          <p><strong>Women Helpline:</strong> 181</p>
          <p><strong>Police:</strong> 100</p>
        </div>
      ),
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Office Hours',
      color: 'hsl(var(--solar))',
      content: (
        <div className="space-y-2 text-xs">
          <p><strong>Admin:</strong> Mon–Fri 9AM–5PM</p>
          <p><strong>Library:</strong> {campus === 'SJCE' ? 'Mon–Fri 8AM–8PM' : campus === 'SJIT' ? 'Mon–Fri 8:30AM–7:30PM' : campus === 'CIT' ? 'Mon–Fri 8AM–7PM' : 'Mon–Fri 8AM–8PM'}</p>
          <p><strong>Placement:</strong> Mon–Fri 9AM–5PM</p>
          <p><strong>Medical:</strong> {campus === 'SJCE' ? 'Mon–Fri 8:30AM–5:30PM' : campus === 'SJIT' ? 'Mon–Fri 9AM–5PM' : campus === 'CIT' ? 'Mon–Fri 9AM–4:30PM' : 'Mon–Fri 9AM–5PM'}</p>
          <p><strong>Accounts:</strong> Mon–Fri 10AM–4PM</p>
        </div>
      ),
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'HOD Directory',
      color: 'hsl(var(--aurora-1))',
      content: campus === 'SJCE' ? (
        <div className="space-y-2 text-xs">
          <p><strong>CSE:</strong> Dr. S. Kumar — ext. 2101</p>
          <p><strong>ECE:</strong> Dr. R. Priya — ext. 2102</p>
          <p><strong>MECH:</strong> Dr. V. Rajan — ext. 2103</p>
          <p><strong>CIVIL:</strong> Dr. M. Devi — ext. 2104</p>
          <p><strong>IT:</strong> Dr. K. Selvam — ext. 2105</p>
        </div>
      ) : campus === 'SJIT' ? (
        <div className="space-y-2 text-xs">
          <p><strong>CSE:</strong> Dr. A. Mehta — ext. 3101</p>
          <p><strong>ECE:</strong> Dr. B. Rao — ext. 3102</p>
          <p><strong>MECH:</strong> Dr. C. Nair — ext. 3103</p>
          <p><strong>CIVIL:</strong> Dr. D. Iyer — ext. 3104</p>
          <p><strong>IT:</strong> Dr. E. Patel — ext. 3105</p>
        </div>
      ) : campus === 'KPR' ? (
        <div className="space-y-2 text-xs">
          <p><strong>CSE:</strong> Dr. N. Senthil — ext. 5101</p>
          <p><strong>ECE:</strong> Dr. L. Pradeep — ext. 5102</p>
          <p><strong>MECH:</strong> Dr. G. Ramesh — ext. 5103</p>
          <p><strong>CIVIL:</strong> Dr. H. Durga — ext. 5104</p>
          <p><strong>AI&DS:</strong> Dr. J. Karthik — ext. 5105</p>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <p><strong>CSE:</strong> Dr. P. Krishnan — ext. 4101</p>
          <p><strong>ECE:</strong> Dr. Q. Sudha — ext. 4102</p>
          <p><strong>MECH:</strong> Dr. R. Arjun — ext. 4103</p>
          <p><strong>CIVIL:</strong> Dr. S. Kavitha — ext. 4104</p>
          <p><strong>IT:</strong> Dr. T. Mohan — ext. 4105</p>
        </div>
      ),
    },
    {
      icon: <Bus className="w-6 h-6" />,
      label: 'Transport Info',
      color: 'hsl(var(--aurora-3))',
      content: campus === 'SJCE' ? (
        <div className="space-y-2 text-xs">
          <p><strong>Route 1:</strong> Tambaram → OMR</p>
          <p><strong>Route 2:</strong> Velachery → OMR</p>
          <p><strong>Route 3:</strong> T.Nagar → OMR</p>
          <p><strong>Departure:</strong> 7:15, 8:00, 8:30 AM</p>
          <p><strong>Return:</strong> 4:30, 5:15 PM</p>
        </div>
      ) : campus === 'SJIT' ? (
        <div className="space-y-2 text-xs">
          <p><strong>Route 1:</strong> Sholinganallur → SJIT</p>
          <p><strong>Route 2:</strong> Guindy → SJIT</p>
          <p><strong>Route 3:</strong> Porur → SJIT</p>
          <p><strong>Departure:</strong> 7:20, 8:10, 8:45 AM</p>
          <p><strong>Return:</strong> 4:45, 5:30 PM</p>
        </div>
      ) : campus === 'KPR' ? (
        <div className="space-y-2 text-xs">
          <p><strong>Route 1:</strong> Gandhipuram → KPR</p>
          <p><strong>Route 2:</strong> RS Puram → KPR</p>
          <p><strong>Route 3:</strong> Saravanampatti → KPR</p>
          <p><strong>Departure:</strong> 7:15, 8:00, 8:45 AM</p>
          <p><strong>Return:</strong> 4:30, 5:15 PM</p>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <p><strong>Route 1:</strong> Anna Nagar → CIT</p>
          <p><strong>Route 2:</strong> Koyambedu → CIT</p>
          <p><strong>Route 3:</strong> Mogappair → CIT</p>
          <p><strong>Departure:</strong> 7:10, 8:00, 8:40 AM</p>
          <p><strong>Return:</strong> 4:30, 5:00 PM</p>
        </div>
      ),
    },
    {
      icon: <HeartPulse className="w-6 h-6" />,
      label: 'Medical Help',
      color: 'hsl(var(--nova))',
      content: campus === 'SJCE' ? (
        <div className="space-y-2 text-xs">
          <p><strong>Clinic:</strong> Ground Floor, Admin Block</p>
          <p><strong>Doctor:</strong> Dr. S. Lakshmi</p>
          <p><strong>Hours:</strong> 8:30AM–5:30PM (Mon–Fri)</p>
          <p><strong>Emergency:</strong> 044-2450-0900</p>
          <p><strong>Nearest:</strong> SRM Hospital, OMR</p>
        </div>
      ) : campus === 'SJIT' ? (
        <div className="space-y-2 text-xs">
          <p><strong>Clinic:</strong> 1st Floor, Main Block</p>
          <p><strong>Doctor:</strong> Dr. R. Anitha</p>
          <p><strong>Hours:</strong> 9AM–5PM (Mon–Fri)</p>
          <p><strong>Emergency:</strong> 044-2250-1900</p>
          <p><strong>Nearest:</strong> Kauvery Hospital</p>
        </div>
      ) : campus === 'KPR' ? (
        <div className="space-y-2 text-xs">
          <p><strong>Clinic:</strong> Near Admin Office</p>
          <p><strong>Doctor:</strong> Dr. V. Subha</p>
          <p><strong>Hours:</strong> 9AM–5PM (Mon–Fri)</p>
          <p><strong>Emergency:</strong> 0422-265-6900</p>
          <p><strong>Nearest:</strong> KMCH, Coimbatore</p>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <p><strong>Clinic:</strong> Ground Floor, Academic Block</p>
          <p><strong>Doctor:</strong> Dr. M. Sheela</p>
          <p><strong>Hours:</strong> 9AM–4:30PM (Mon–Fri)</p>
          <p><strong>Emergency:</strong> 044-2680-5900</p>
          <p><strong>Nearest:</strong> Apollo Hospital Mogappair</p>
        </div>
      ),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: 'Grievance Form',
      color: 'hsl(var(--aurora-2))',
      content: (
        <div className="space-y-2 text-xs">
          <p>Submit grievances anonymously.</p>
          <p><strong>Academic:</strong> Contact your class advisor first</p>
          <p><strong>Hostel:</strong> Warden's office</p>
          <p><strong>Ragging:</strong> {campus === 'SJCE' ? '044-2450-0905' : campus === 'SJIT' ? '044-2250-1905' : campus === 'CIT' ? '044-2680-5905' : '0422-265-6905'}</p>
          <p><strong>Online:</strong> {campus} portal → grievance section</p>
        </div>
      ),
    },
  ];

  return (
    <div className="tab-enter max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="px-3 py-1 rounded-full font-ui text-[9px] tracking-widest border"
          style={{ background: badge.bg, borderColor: badge.border, color: badge.text }}
        >
          {campus} HELP DESK
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Chat Panel */}
        <div className="flex-1 lg:w-[55%] glass-card p-4 flex flex-col" style={{ minHeight: '500px', maxHeight: '70vh' }}>
          <div className="font-ui text-[10px] tracking-widest text-muted-foreground/50 mb-3">CAMPUS ASSISTANT</div>
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                   style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`max-w-[80%] ${msg.from === 'bot' && msg.destination ? 'space-y-2' : ''}`}>
                  <div className={`px-4 py-3 rounded-xl text-sm ${
                    msg.from === 'user'
                      ? 'bg-primary/20 border border-primary/30 text-foreground'
                      : 'glass border border-border text-foreground'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.from === 'bot' && msg.destination && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openNavigation(msg.destination!.mapsQuery)}
                        className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs flex items-center gap-1 hover:bg-primary/30 transition-colors"
                      >
                        <Navigation className="w-3 h-3" />
                        Navigate
                      </button>
                      <button
                        onClick={() => openNavigation(msg.destination!.mapsQuery)}
                        className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-muted-foreground text-xs flex items-center gap-1 hover:bg-muted/70 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Maps
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-full text-[10px] font-ui tracking-wider border border-primary/30 text-muted-foreground hover:bg-primary/10 hover:text-foreground hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask about ${campus} timings, locations, contacts...`}
              className="flex-1 h-12 px-4 rounded-xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground/40 font-body text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading}
              aria-label="Send message"
              className="h-12 w-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Flip Cards Grid */}
        <div className="lg:w-[45%] grid grid-cols-2 gap-4">
          {flipCards.map((card, i) => (
            <div
              key={i}
              className="cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => setFlipped(flipped === i ? null : i)}
            >
              <div
                className="relative w-full transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flipped === i ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
                  minHeight: '160px',
                }}
              >
                <div
                  className="absolute inset-0 glass-card flex flex-col items-center justify-center gap-3 p-4"
                  style={{ backfaceVisibility: 'hidden', borderTop: `3px solid ${card.color}` }}
                >
                  <div style={{ color: card.color }}>{card.icon}</div>
                  <span className="font-ui text-[10px] tracking-widest text-muted-foreground/50">{card.label.toUpperCase()}</span>
                </div>
                <div
                  className="absolute inset-0 glass-card p-4 overflow-y-auto"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderTop: `3px solid ${card.color}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-ui text-[10px] tracking-widest" style={{ color: card.color }}>{card.label.toUpperCase()}</span>
                    <RotateCcw className="w-3 h-3 text-muted-foreground/30" />
                  </div>
                  <div className="text-muted-foreground">{card.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpDeskTab;
