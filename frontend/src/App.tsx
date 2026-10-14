import { useEffect, useState } from 'react';
import {
  Scale,
  ShieldCheck,
  Search,
  BookOpen,
  FileCheck2,
  Users2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Cpu,
  ExternalLink,
  Lock,
  PlusCircle,
  User,
  LogOut,
  Sparkles,
  Building2,
  Gavel,
  Copy,
  Check
} from 'lucide-react';

interface SystemHealth {
  status: string;
  service: string;
  version: string;
  components: {
    database: string;
    mlService: string;
  };
  environment: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: string;
}

interface Evidence {
  source_type: string;
  source_title: string;
  excerpt: string;
  authority_level: number;
  official_url: string;
  publication_date?: string;
  relevance_score: number;
}

interface QuestionResponse {
  query: string;
  ml_prediction: {
    category: string;
    category_name: string;
    confidence: number;
    model_type: string;
    model_version?: string;
    description: string;
    needs_clarification: boolean;
    clarification_prompt?: string | null;
  };
  grounded_answer: {
    summary: string;
    action_steps: string[];
    uncertainty_notes?: string | null;
    disclaimer: string;
  };
  retrieved_evidence: Evidence[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'ask' | 'sources' | 'library' | 'verify' | 'caserooms'>('ask');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState<'citizen' | 'advocate'>('citizen');
  const [authError, setAuthError] = useState<string | null>(null);

  // Q&A State
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [answerData, setAnswerData] = useState<QuestionResponse | null>(null);

  // Sources & Library State
  const [sources, setSources] = useState<any[]>([]);
  const [judgments, setJudgments] = useState<any[]>([]);
  const [legalSources, setLegalSources] = useState<any[]>([]);

  // Verification State
  const [verifyFilename, setVerifyFilename] = useState('PMFBY_Survey_Report_2024.pdf');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  // Case Rooms State
  const [caseRooms, setCaseRooms] = useState<any[]>([]);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [generatedInvite, setGeneratedInvite] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  // Initial Load
  useEffect(() => {
    // 1. Fetch Health
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth(null));

    // 2. Fetch Sources & Library
    fetch('/api/v1/sources')
      .then((res) => res.json())
      .then((d) => setSources(d.sources || []));

    fetch('/api/v1/sources/judgments')
      .then((res) => res.json())
      .then((d) => setJudgments(d.judgments || []));

    fetch('/api/v1/sources/legal')
      .then((res) => res.json())
      .then((d) => setLegalSources(d.legalSources || []));

    // 3. Check Current User
    fetch('/api/v1/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Fetch Case Rooms when switching to tab or logging in
  useEffect(() => {
    if (user) {
      fetch('/api/v1/case-rooms')
        .then((res) => (res.ok ? res.json() : { rooms: [] }))
        .then((d) => {
          setCaseRooms(d.rooms || []);
          if (d.rooms?.length > 0 && !selectedRoomId) {
            setSelectedRoomId(d.rooms[0].id);
          }
        });
    }
  }, [user, activeTab]);

  // Handle Question Answering
  const handleAskQuestion = async (queryToSubmit?: string) => {
    const text = queryToSubmit || query;
    if (!text || text.trim().length < 5) return;
    setIsAsking(true);
    setAnswerData(null);

    try {
      const res = await fetch('/api/v1/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();
      setAnswerData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  // Handle Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const url = authMode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';
    const body =
      authMode === 'login'
        ? { email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword, full_name: authName, role: authRole };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }
      setUser(data.user);
      setShowAuthModal(false);
      setAuthPassword('');
    } catch {
      setAuthError('Network communication error with authentication service.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    setUser(null);
    setCaseRooms([]);
  };

  const handleDemoLogin = (email: string) => {
    setAuthEmail(email);
    setAuthPassword('NyayaSetu@2026');
    setAuthMode('login');
  };

  // Handle Document Verification
  const handleVerifyDocument = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/v1/documents/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: verifyFilename }),
      });
      const data = await res.json();
      setVerificationResult(data.document);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Create Case Room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomTitle) return;
    const res = await fetch('/api/v1/case-rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newRoomTitle, description: newRoomDesc }),
    });
    if (res.ok) {
      const d = await res.json();
      setCaseRooms([d.room, ...caseRooms]);
      setSelectedRoomId(d.room.id);
      setNewRoomTitle('');
      setNewRoomDesc('');
    }
  };

  // Handle Add Task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !newTaskTitle) return;
    const res = await fetch(`/api/v1/case-rooms/${selectedRoomId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle, due_date: '2026-11-20' }),
    });
    if (res.ok) {
      const d = await res.json();
      setCaseRooms(
        caseRooms.map((r) =>
          r.id === selectedRoomId ? { ...r, tasks: [...(r.tasks || []), d.task] } : r
        )
      );
      setNewTaskTitle('');
    }
  };

  // Handle Invite Advocate
  const handleGenerateInvite = async (roomId: string) => {
    const res = await fetch(`/api/v1/case-rooms/${roomId}/invitations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intended_email: 'advocate.sharma@delhibar.org', role_in_room: 'advocate' }),
    });
    if (res.ok) {
      const d = await res.json();
      setGeneratedInvite(d.invitation_token);
      setCopiedToken(false);
    }
  };

  const selectedRoom = caseRooms.find((r) => r.id === selectedRoomId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Advisory Banner */}
      <div className="bg-nyaya-950 text-slate-200 text-xs py-2 px-4 border-b border-nyaya-900 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-amber-500/30">
              Statutory Transparency
            </span>
            <span className="text-[12px] text-slate-300">
              NYAYASETU is an AI-assisted legal intelligence tool. Evidence is strictly grounded in official gazettes, schemes, and court rulings.
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1" /> Non-Hallucinatory Retrieval</span>
            <span>•</span>
            <span className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-1.5 ${health ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              <span>{health ? 'API Connected' : 'Local Standby'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('ask')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nyaya-800 to-nyaya-950 text-amber-400 flex items-center justify-center shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-nyaya-950 flex items-center">
                NYAYA<span className="text-nyaya-600">SETU</span>
                <span className="ml-2 text-[10px] bg-nyaya-100 text-nyaya-800 font-semibold px-1.5 py-0.5 rounded">न्यायसेतु</span>
              </div>
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Evidence-Grounded Citizen Legal Bridge
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('ask')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'ask' ? 'bg-white text-nyaya-950 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-nyaya-600" />
              <span>Ask NYAYASETU</span>
            </button>
            <button
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'sources' ? 'bg-white text-nyaya-950 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-nyaya-600" />
              <span>Government Sources</span>
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'library' ? 'bg-white text-nyaya-950 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Gavel className="w-3.5 h-3.5 text-nyaya-600" />
              <span>Statutes & Judgments</span>
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'verify' ? 'bg-white text-nyaya-950 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-nyaya-600" />
              <span>Document Verification</span>
            </button>
            <button
              onClick={() => setActiveTab('caserooms')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                activeTab === 'caserooms' ? 'bg-white text-nyaya-950 shadow-sm' : 'hover:text-slate-900'
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-nyaya-600" />
              <span>Advocate Case Rooms</span>
            </button>
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800">{user.full_name}</div>
                  <div className="text-[10px] text-nyaya-600 font-semibold uppercase">{user.role}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-nyaya-800 text-white flex items-center justify-center font-bold text-xs">
                  {user.full_name[0]}
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-nyaya-800 hover:bg-nyaya-900 rounded-lg shadow-sm transition flex items-center space-x-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===================== TAB 1: ASK NYAYASETU ===================== */}
        {activeTab === 'ask' && (
          <div className="space-y-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-nyaya-950 via-nyaya-900 to-nyaya-800 rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none"></div>
              <div className="max-w-3xl relative z-10">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Real Machine Learning Issue Classification + Parameterized SQL Retrieval</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Describe Your Problem in Everyday Words.
                </h1>
                <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                  NYAYASETU analyzes your inquiry using a trained classification model, retrieves authentic legal provisions and government gazette records, and explains your statutory remedies without making unverified claims.
                </p>

                {/* Search Bar */}
                <div className="mt-8">
                  <div className="bg-white rounded-xl p-2 shadow-2xl flex items-center border border-slate-300 focus-within:ring-2 focus-within:ring-nyaya-500">
                    <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                      placeholder="e.g. My crop insurance claim under PMFBY has been pending for 3 months after flood..."
                      className="w-full py-2.5 text-slate-800 text-sm focus:outline-none placeholder-slate-400"
                    />
                    <button
                      onClick={() => handleAskQuestion()}
                      disabled={isAsking || query.trim().length < 5}
                      className="px-6 py-2.5 bg-nyaya-800 hover:bg-nyaya-900 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-1.5 flex-shrink-0"
                    >
                      {isAsking ? (
                        <span>Analyzing...</span>
                      ) : (
                        <>
                          <span>Search Sources</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Sample Query Pills */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400 font-semibold">Try sample questions:</span>
                    <button
                      onClick={() => {
                        const q = 'My crop was damaged in heavy rain and PMFBY insurance claim is still pending after 3 months.';
                        setQuery(q);
                        handleAskQuestion(q);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition"
                    >
                      🌾 PMFBY Crop Loss Delay
                    </button>
                    <button
                      onClick={() => {
                        const q = 'Public Information Officer did not respond to my RTI application within 30 days.';
                        setQuery(q);
                        handleAskQuestion(q);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition"
                    >
                      📄 RTI 30-Day Delay Appeal
                    </button>
                    <button
                      onClick={() => {
                        const q = 'E-commerce seller delivered defective phone and refuses warranty replacement or refund.';
                        setQuery(q);
                        handleAskQuestion(q);
                      }}
                      className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition"
                    >
                      ⚖️ Consumer Service Deficiency
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Display */}
            {answerData && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
                {/* Classification Header Badge */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-nyaya-50 border border-nyaya-200 text-nyaya-700 flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        ML Issue Classification Result
                      </div>
                      <div className="text-lg font-extrabold text-nyaya-950 flex items-center">
                        {answerData.ml_prediction.category_name}
                        <span className="ml-3 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                          {Math.round(answerData.ml_prediction.confidence * 100)}% Confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400 font-mono">
                    Model: {answerData.ml_prediction.model_type} ({answerData.ml_prediction.model_version})
                  </div>
                </div>

                {/* Grounded Explanation */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center">
                    <BookOpen className="w-4 h-4 text-nyaya-700 mr-2" />
                    Evidence-Grounded Legal Explanation
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {answerData.grounded_answer.summary}
                  </p>

                  {/* Actionable Statutory Steps */}
                  {answerData.grounded_answer.action_steps.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        Statutory Recommended Next Steps:
                      </div>
                      <div className="space-y-2">
                        {answerData.grounded_answer.action_steps.map((step, idx) => (
                          <div key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 space-x-2">
                            <span className="w-5 h-5 rounded-full bg-nyaya-800 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer & Uncertainty */}
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Official Disclaimer: </span>
                      {answerData.grounded_answer.disclaimer}
                      {answerData.grounded_answer.uncertainty_notes && (
                        <div className="mt-1 font-semibold">{answerData.grounded_answer.uncertainty_notes}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Retrieved Evidence Sources */}
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" />
                    Retrieved Official Sources ({answerData.retrieved_evidence.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {answerData.retrieved_evidence.map((ev, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-nyaya-300 transition flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="font-semibold text-nyaya-700 uppercase">{ev.source_type}</span>
                            <span className="bg-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                              Rank #{idx + 1}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-slate-900">{ev.source_title}</div>
                          <p className="mt-2 text-xs text-slate-600 leading-normal line-clamp-3 italic">
                            "{ev.excerpt}"
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400">Authority: Level {ev.authority_level}/5</span>
                          <a
                            href={ev.official_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-nyaya-700 hover:text-nyaya-900 font-bold flex items-center space-x-1"
                          >
                            <span>Official Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
                <Building2 className="w-8 h-8 text-nyaya-700 mb-3" />
                <h3 className="text-base font-bold text-slate-900">Official Government Registries</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Search indexed records from PMFBY, PM-KISAN, National Consumer Helpline, and DoPT RTI portals.
                </p>
                <button
                  onClick={() => setActiveTab('sources')}
                  className="mt-4 text-xs font-bold text-nyaya-700 hover:text-nyaya-900 flex items-center"
                >
                  <span>Explore Registries</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
                <FileCheck2 className="w-8 h-8 text-nyaya-700 mb-3" />
                <h3 className="text-base font-bold text-slate-900">Granular Document Verification</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Independent SHA-256 hash calculation, PDF structure validation, OCR text extraction, and digital signature checks.
                </p>
                <button
                  onClick={() => setActiveTab('verify')}
                  className="mt-4 text-xs font-bold text-nyaya-700 hover:text-nyaya-900 flex items-center"
                >
                  <span>Verify Documents</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition">
                <Users2 className="w-8 h-8 text-nyaya-700 mb-3" />
                <h3 className="text-base font-bold text-slate-900">Invitation Case Rooms</h3>
                <p className="mt-1 text-xs text-slate-600">
                  Private advocate-citizen rooms with cryptographic single-use invitations, task lists, and quarantine-guarded storage.
                </p>
                <button
                  onClick={() => setActiveTab('caserooms')}
                  className="mt-4 text-xs font-bold text-nyaya-700 hover:text-nyaya-900 flex items-center"
                >
                  <span>Open Collaboration Room</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: GOVERNMENT SOURCES ===================== */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-extrabold text-nyaya-950">Authoritative Government Source Registry</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Indexed open data records and scheme circulars currently connected to the retrieval engine.
                </p>
              </div>
              <span className="text-xs font-bold bg-nyaya-100 text-nyaya-800 px-3 py-1 rounded-full">
                {sources.length} Active Sources
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map((src) => (
                <div key={src.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase text-nyaya-700 bg-nyaya-50 px-2 py-0.5 rounded">
                        {src.source_type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified Source
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{src.source_name}</h3>
                    <p className="text-xs text-slate-600 mt-1">{src.publisher}</p>
                    <div className="mt-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Jurisdiction: </span> {src.jurisdiction}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">License: </span> {src.license_or_reuse_notes}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">Authority Level {src.authority_level}/5</span>
                    <a
                      href={src.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-nyaya-700 hover:text-nyaya-900 flex items-center space-x-1"
                    >
                      <span>Visit Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: STATUTES & JUDGMENTS ===================== */}
        {activeTab === 'library' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-nyaya-950">Statutory Provisions & Landmark Judgments</h2>
              <p className="text-xs text-slate-500 mt-1">
                Authoritative legislative sections from India Code and precedents from the Supreme Court and NCDRC.
              </p>
            </div>

            {/* Statutes */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <BookOpen className="w-5 h-5 text-nyaya-700 mr-2" />
                Codified Central Statutes
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {legalSources.map((leg) => (
                  <div key={leg.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h4 className="text-base font-bold text-nyaya-950">{leg.source_title}</h4>
                        <div className="text-xs text-slate-500">{leg.issuing_authority} • Published: {leg.publication_date}</div>
                      </div>
                      <a
                        href={leg.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-nyaya-700 font-bold flex items-center"
                      >
                        <span>India Code</span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>

                    <div className="mt-4 space-y-3">
                      {leg.provisions.map((prov: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="text-xs font-bold text-nyaya-900">{prov.section_number}: {prov.section_title}</div>
                          <p className="text-xs text-slate-700 mt-1 italic leading-relaxed">{prov.content_text}</p>
                          <div className="text-[11px] text-nyaya-700 font-semibold mt-1">
                            Application: {prov.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Judgments */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <Gavel className="w-5 h-5 text-amber-600 mr-2" />
                Reviewed Landmark Court Precedents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {judgments.map((j) => (
                  <div key={j.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span className="font-semibold text-nyaya-700 uppercase">{j.court}</span>
                        <span>{j.judgment_date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{j.case_title}</h4>
                      <div className="text-xs font-mono text-amber-700 font-semibold mt-0.5">{j.citation}</div>
                      <p className="mt-3 text-xs text-slate-600 leading-relaxed font-semibold">
                        Summary: {j.case_summary}
                      </p>
                      <div className="mt-2 p-3 rounded-lg bg-nyaya-50/70 border border-nyaya-200 text-xs text-slate-800">
                        <span className="font-bold text-nyaya-900">Holding: </span>
                        {j.holding}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">Verified Citation</span>
                      <a
                        href={j.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-nyaya-700 hover:text-nyaya-900 flex items-center space-x-1"
                      >
                        <span>Official Judgment</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: DOCUMENT VERIFICATION ===================== */}
        {activeTab === 'verify' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="text-2xl font-extrabold text-nyaya-950">Multi-Check Document Verification Pipeline</h2>
              <p className="text-xs text-slate-600 mt-1">
                Authenticity is verified through distinct independent technical checks rather than an unverified generic green badge.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Document to Validate:</label>
                  <select
                    value={verifyFilename}
                    onChange={(e) => setVerifyFilename(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyaya-500"
                  >
                    <option value="PMFBY_Survey_Report_2024.pdf">PMFBY_Survey_Report_2024.pdf (Crop Loss Intimation)</option>
                    <option value="Kisan_Credit_Card_Statement.pdf">Kisan_Credit_Card_Statement.pdf (Bank Passbook Debit)</option>
                    <option value="Sale_Deed_Ancestral_Property.pdf">Sale_Deed_Ancestral_Property.pdf (Revenue Mutation Copy)</option>
                    <option value="Municipal_RTI_First_Appeal.pdf">Municipal_RTI_First_Appeal.pdf (Statutory Form)</option>
                  </select>
                </div>
                <button
                  onClick={handleVerifyDocument}
                  disabled={isVerifying}
                  className="w-full sm:w-auto px-6 py-2.5 mt-5 bg-nyaya-800 hover:bg-nyaya-900 text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center space-x-1.5 flex-shrink-0"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isVerifying ? 'Running Checks...' : 'Execute Verification'}</span>
                </button>
              </div>

              {/* Verification Results Pipeline */}
              {verificationResult && (
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-700">Document ID: </span>
                      <span className="font-mono text-nyaya-800">{verificationResult.id}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Status: </span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                        {verificationResult.verification_status}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Storage: </span>
                      <span className="text-amber-800 font-semibold">{verificationResult.quarantine_status}</span>
                    </div>
                  </div>

                  {/* SHA-256 Digest Box */}
                  <div className="p-3 bg-nyaya-950 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
                    <div className="text-[10px] text-amber-400 font-bold uppercase mb-1">SHA-256 Integrity Digest:</div>
                    <div>{verificationResult.sha256_hash}</div>
                  </div>

                  {/* Individual Checks List */}
                  <div className="space-y-3 mt-4">
                    <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Independent Security Checks:</h4>
                    {verificationResult.checks.map((chk: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-900 flex items-center">
                            {chk.status === 'passed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                            )}
                            <span className="capitalize">{chk.check_type.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="text-xs text-slate-600">
                            {chk.details.explanation || chk.details.preview || 'Structure and byte header valid.'}
                          </div>
                          {chk.details.note && (
                            <div className="text-[11px] text-amber-800 font-semibold">{chk.details.note}</div>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            chk.status === 'passed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {chk.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: CASE ROOMS ===================== */}
        {activeTab === 'caserooms' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-extrabold text-nyaya-950">Private Advocate-Client Case Rooms</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Invitation-only confidential workspace guarded by single-use cryptographic tokens and server-side authorization.
                </p>
              </div>

              {!user && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-nyaya-800 text-white rounded-lg text-xs font-bold shadow"
                >
                  Sign In to Access Case Rooms
                </button>
              )}
            </div>

            {user ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Rooms Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Your Active Case Rooms</h3>
                    <div className="space-y-2">
                      {caseRooms.map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoomId(room.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition ${
                            selectedRoomId === room.id
                              ? 'bg-nyaya-50 border-nyaya-300 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-sm font-bold text-slate-900">{room.title}</div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{room.description}</div>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Tasks: {room.tasks?.length || 0}</span>
                            <span className="text-emerald-700 font-bold uppercase">{room.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Create Room Form */}
                    <form onSubmit={handleCreateRoom} className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-700">Create New Case Room</div>
                      <input
                        type="text"
                        placeholder="Case Title (e.g. RTI Appeal 2024)"
                        value={newRoomTitle}
                        onChange={(e) => setNewRoomTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Short summary..."
                        value={newRoomDesc}
                        onChange={(e) => setNewRoomDesc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newRoomTitle}
                        className="w-full py-1.5 bg-nyaya-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Create Room</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Selected Room Details */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedRoom ? (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <h3 className="text-lg font-bold text-nyaya-950">{selectedRoom.title}</h3>
                          <p className="text-xs text-slate-600 mt-1">{selectedRoom.description}</p>
                        </div>
                        <button
                          onClick={() => handleGenerateInvite(selectedRoom.id)}
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1 flex-shrink-0"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Invite Verified Advocate</span>
                        </button>
                      </div>

                      {/* Generated Single-use Invite Box */}
                      {generatedInvite && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
                          <div className="font-bold text-amber-900 flex items-center justify-between">
                            <span>Single-Use Cryptographic Invitation Generated</span>
                            <span className="text-[10px] bg-amber-200 px-2 py-0.5 rounded font-mono">Expires in 7 days</span>
                          </div>
                          <p className="text-amber-800">
                            Share this private token with your designated advocate. It can only be redeemed once.
                          </p>
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              readOnly
                              value={generatedInvite}
                              className="w-full px-2 py-1 bg-white font-mono text-xs border border-amber-300 rounded"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(generatedInvite);
                                setCopiedToken(true);
                              }}
                              className="px-3 py-1 bg-nyaya-800 text-white text-xs font-bold rounded flex items-center space-x-1"
                            >
                              {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tasks Section */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Case Action Items & Tasks:</h4>
                        <div className="space-y-2">
                          {selectedRoom.tasks && selectedRoom.tasks.length > 0 ? (
                            selectedRoom.tasks.map((task: any) => (
                              <div key={task.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-2">
                                  <span className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                  <span className="font-semibold text-slate-800">{task.title}</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                  {task.due_date ? `Due: ${task.due_date}` : task.status}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-slate-400 italic">No tasks created yet for this room.</div>
                          )}
                        </div>

                        {/* Add Task Input */}
                        <form onSubmit={handleAddTask} className="flex items-center space-x-2 pt-2">
                          <input
                            type="text"
                            placeholder="Add action item (e.g. Request inspection of revenue records)..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                          />
                          <button
                            type="submit"
                            disabled={!newTaskTitle}
                            className="px-4 py-2 bg-nyaya-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-sm transition"
                          >
                            Add
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
                      Select or create a case room from the sidebar to view case files and tasks.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center max-w-md mx-auto space-y-4 shadow-sm">
                <Lock className="w-10 h-10 text-nyaya-700 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Sign in to Access Private Rooms</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Case rooms are protected by strict server-side authentication. You can sign in as a citizen or advocate to review files.
                </p>
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      handleDemoLogin('citizen@example.com');
                      setShowAuthModal(true);
                    }}
                    className="w-full py-2 bg-nyaya-800 text-white rounded-lg text-xs font-bold shadow hover:bg-nyaya-900 transition"
                  >
                    1-Click Demo Login as Rajesh Kumar (Citizen)
                  </button>
                  <button
                    onClick={() => {
                      handleDemoLogin('admin@nyayasetu.gov.in');
                      setShowAuthModal(true);
                    }}
                    className="w-full py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition"
                  >
                    1-Click Demo Login as Administrator
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ===================== AUTH MODAL ===================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-nyaya-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-nyaya-800 text-amber-400 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-nyaya-950">
                {authMode === 'login' ? 'Sign In to NYAYASETU' : 'Create Citizen / Advocate Account'}
              </h3>
            </div>

            {authError && (
              <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyaya-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                    <select
                      value={authRole}
                      onChange={(e) => setAuthRole(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                    >
                      <option value="citizen">Citizen (Seeking legal info / case room)</option>
                      <option value="advocate">Advocate (Subject to Bar verification)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyaya-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nyaya-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-nyaya-800 hover:bg-nyaya-900 text-white text-xs font-bold rounded-lg shadow transition"
              >
                {authMode === 'login' ? 'Sign In' : 'Register Account'}
              </button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Quick 1-Click Demo Accounts:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('citizen@example.com')}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                >
                  Citizen Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin@nyayasetu.gov.in')}
                  className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                >
                  Admin Demo
                </button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthError(null);
                    }}
                    className="text-nyaya-700 font-bold hover:underline"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError(null);
                    }}
                    className="text-nyaya-700 font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-nyaya-950 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white">NYAYASETU (न्यायसेतु)</span>
            <span>— Developed in Antigravity for Indian Citizens</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Node.js + PostgreSQL + Python FastAPI ML • Zero Paid Cloud Lock-In
          </div>
        </div>
      </footer>
    </div>
  );
}
