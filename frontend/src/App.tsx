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
  Database,
  Cpu,
  Server
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

export default function App() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data: SystemHealth) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => {
        setHealth(null);
        setLoading(false);
      });
  }, []);

  const categories = [
    { title: 'Agricultural Insurance', desc: 'PMFBY claims, crop loss assessments, portal disputes', icon: '🌾' },
    { title: 'Government Benefits', desc: 'PM-KISAN, pensions, ration cards, DBT grievances', icon: '🏛️' },
    { title: 'Consumer Disputes', desc: 'E-commerce refunds, defective goods, service deficiencies', icon: '⚖️' },
    { title: 'Right to Information (RTI)', desc: 'PIO queries, first appeals, statutory timelines', icon: '📄' },
    { title: 'Property & Land', desc: 'Title records, mutation entries, encroachment remedies', icon: '🏡' },
    { title: 'Employment & Wages', desc: 'Unpaid dues, EPF/gratuity, wrongful termination', icon: '💼' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Advisory Disclaimer */}
      <div className="bg-nyaya-900 text-slate-200 text-xs py-2 px-4 border-b border-nyaya-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">
              Official Disclaimer
            </span>
            <span>NYAYASETU is an AI-assisted legal information platform and does not provide legally binding counsel.</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-xs text-slate-400">
            <span>Authoritative Sources Grounding</span>
            <span>•</span>
            <span>Zero Unrestricted AI Execution</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-nyaya-800 text-amber-400 flex items-center justify-center shadow-sm">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-nyaya-950">NYAYA<span className="text-nyaya-600">SETU</span></span>
              <span className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Citizen Legal Intelligence Bridge</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <a href="#ask" className="hover:text-nyaya-700 transition">Ask Platform</a>
            <a href="#sources" className="hover:text-nyaya-700 transition">Government Sources</a>
            <a href="#verification" className="hover:text-nyaya-700 transition">Document Verification</a>
            <a href="#caserooms" className="hover:text-nyaya-700 transition">Advocate Case Rooms</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
              Sign In
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-nyaya-700 hover:bg-nyaya-800 rounded-lg shadow-sm transition">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative py-16 lg:py-24 bg-gradient-to-b from-nyaya-50/50 to-transparent border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-nyaya-100/70 border border-nyaya-200 text-nyaya-800 text-xs font-semibold mb-6">
              <ShieldCheck className="w-4 h-4 text-nyaya-600" />
              <span>Evidence-Grounding • Machine Learning Issue Classification • Non-Hallucinatory</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-nyaya-950 tracking-tight leading-tight">
              Demystifying Indian Law & Government Schemes for <span className="text-nyaya-700">Every Citizen</span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Describe your problem in plain English. NYAYASETU classifies the legal issue, searches verified government gazettes, scheme guidelines, and court records, and produces answers backed by real citations.
            </p>

            {/* Interactive Query Box */}
            <div className="mt-10 max-w-3xl mx-auto">
              <div className="relative shadow-lg rounded-2xl bg-white border border-slate-300 p-2 focus-within:ring-2 focus-within:ring-nyaya-500 focus-within:border-nyaya-500 transition">
                <div className="flex items-center pl-3">
                  <Search className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. My crop insurance claim under PMFBY has been pending for 4 months..."
                    className="w-full py-3 pr-4 text-slate-800 text-base placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                  <button className="flex-shrink-0 px-6 py-3 bg-nyaya-800 hover:bg-nyaya-900 text-white font-medium rounded-xl flex items-center space-x-2 transition shadow-sm">
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Supports agricultural schemes, consumer protection, RTI applications, tenancy, and civil remedies.
              </p>
            </div>
          </div>
        </section>

        {/* Real-time System Connectivity Status */}
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                  Local Environment Architecture Status
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">NYAYASETU v1.0.0</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Server className="w-5 h-5 text-nyaya-600 mr-3" />
                <div>
                  <div className="text-xs text-slate-500">Node.js Express Backend</div>
                  <div className="text-sm font-semibold text-slate-800 flex items-center">
                    {loading ? (
                      <span className="text-slate-400">Checking...</span>
                    ) : health ? (
                      <span className="text-emerald-700 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Operational (:5000)</span>
                    ) : (
                      <span className="text-amber-700 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Standby</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Database className="w-5 h-5 text-indigo-600 mr-3" />
                <div>
                  <div className="text-xs text-slate-500">PostgreSQL Relational DB</div>
                  <div className="text-sm font-semibold text-slate-800 flex items-center">
                    {health?.components.database === 'connected' ? (
                      <span className="text-emerald-700 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Connected (:5432)</span>
                    ) : (
                      <span className="text-amber-600 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Initializing / Ready</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                <Cpu className="w-5 h-5 text-teal-600 mr-3" />
                <div>
                  <div className="text-xs text-slate-500">Python FastAPI ML Service</div>
                  <div className="text-sm font-semibold text-slate-800 flex items-center">
                    {health?.components.mlService === 'connected' ? (
                      <span className="text-emerald-700 flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Active (:8000)</span>
                    ) : (
                      <span className="text-amber-600 flex items-center"><AlertCircle className="w-3.5 h-3.5 mr-1" /> Standby / Training</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Issue Categories */}
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl font-bold text-nyaya-950">Supported Citizen Information Domains</h2>
              <p className="mt-2 text-sm text-slate-600">
                Trained machine learning classification directs citizen inquiries to specific official registries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-slate-200 hover:border-nyaya-300 hover:shadow-md transition bg-slate-50/50">
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="text-lg font-bold text-nyaya-900">{cat.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-16 bg-slate-100 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <BookOpen className="w-8 h-8 text-nyaya-700 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Authoritative Source Registry</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Every answer cites exact government portals, acts, scheme guidelines, and court holdings with permanent links and publication dates.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <FileCheck2 className="w-8 h-8 text-nyaya-700 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Multi-Check Document Verification</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Separate cryptographic hash validation, PDF structure checks, OCR extraction, and signature review without misleading generic badges.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <Users2 className="w-8 h-8 text-nyaya-700 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Private Case Rooms</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Citizens can invite verified advocates to collaborate securely with single-use cryptographically hashed tokens, tasks, and private files.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-nyaya-950 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-semibold text-white">NYAYASETU Platform</span>
            <span>— AI-Assisted Citizen Legal Intelligence</span>
          </div>
          <div>
            <span>Local Development Environment • Zero Paid Cloud Lock-In • Ready for Vercel/Node/PostgreSQL Deployment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
