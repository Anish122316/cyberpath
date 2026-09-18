import React from 'react';
import {
  Shield,
  BookOpen,
  Terminal,
  Flag,
  Award,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Target,
  Sparkles,
  Lock,
  Cpu,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../../types';
import { CURRICULUM_LEVELS } from '../../data/levels';
import { CAREER_PATHS } from '../../data/careerPaths';

interface LandingViewProps {
  onNavigate: (tab: NavigationTab) => void;
  user: UserProfile;
  onOpenGoogleAuth: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, user, onOpenGoogleAuth }) => {
  return (
    <div className="bg-[#0b0f17] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DATA-FIRST CYBERSECURITY EDUCATION & CAREER PLATFORM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-4xl">
            Build Real Cybersecurity Skills.{' '}
            <span className="text-emerald-400">Prove Them.</span> Get Job Ready.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed">
            Learn cybersecurity through structured theory, safe hands-on labs, CTF-style challenges, measurable skill analytics, and evidence-grounded ATS resume preparation.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {!user.isLoggedIn && (
              <button
                onClick={onOpenGoogleAuth}
                className="px-6 py-3.5 rounded bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm tracking-wide transition-all shadow-lg flex items-center space-x-2.5"
                id="hero-google-sign-in-btn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.29 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('learning')}
              className="px-6 py-3.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
              id="hero-start-learning-btn"
            >
              <span>Start Learning (Level 0)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('assessment')}
              className="px-6 py-3.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm tracking-wide transition-colors flex items-center space-x-2"
              id="hero-take-assessment-btn"
            >
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Take Diagnostic Skill Assessment</span>
            </button>

            <button
              onClick={() => onNavigate('resume-analyzer')}
              className="px-6 py-3.5 rounded bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 text-sm transition-colors flex items-center space-x-2"
            >
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Analyze Real Resume for ATS</span>
            </button>
          </div>

          {/* Platform Integrity Banner */}
          <div className="mt-12 p-4 rounded-lg bg-[#161b22] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong className="text-slate-200">CORE GUARANTEE:</strong> Zero hallucinated scores. Zero fake testimonials. Every metric traces to verified user evidence.
              </span>
            </div>
            <div className="text-slate-500">
              Scoring Engine: <span className="text-slate-300">v1.0.0-AUDITABLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* How CyberPath Works */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Methodology</h2>
            <p className="mt-2 text-3xl font-bold text-white tracking-tight">
              The Closed-Loop Skill & Career Engine
            </p>
            <p className="mt-3 text-slate-400 text-sm">
              We eliminate the gap between theoretical knowledge and verifiable hiring evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'LEARN', desc: 'Rigorous theory across 12 structured curriculum levels.', icon: <BookOpen className="w-5 h-5 text-emerald-400" /> },
              { step: '02', title: 'PRACTICE', desc: 'Isolated sandbox containers and simulated CTF targets.', icon: <Terminal className="w-5 h-5 text-cyan-400" /> },
              { step: '03', title: 'MEASURE', desc: 'Deterministic skill scoring with transparent confidence ratings.', icon: <TrendingUp className="w-5 h-5 text-indigo-400" /> },
              { step: '04', title: 'IMPROVE', desc: 'Pinpoint weak domains before technical interviewers do.', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
              { step: '05', title: 'PROVE', desc: 'Earn cryptographic certificates and solve verifiable flags.', icon: <Award className="w-5 h-5 text-purple-400" /> },
              { step: '06', title: 'GET READY', desc: 'Align your actual resume against target Job Descriptions.', icon: <FileCheck className="w-5 h-5 text-emerald-400" /> },
            ].map((item) => (
              <div
                key={item.step}
                className="p-5 rounded-lg bg-[#161b22] border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="text-[11px] font-mono text-slate-500 mb-3 flex items-center justify-between">
                  <span>STEP {item.step}</span>
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Roadmap (Levels 0 - 11) */}
      <section className="py-20 border-b border-slate-800/80 bg-[#0d1117]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Progressive Mastery</h2>
              <p className="mt-1 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                12-Level Engineering Curriculum
              </p>
            </div>
            <button
              onClick={() => onNavigate('learning')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5"
            >
              <span>View Full Level Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURRICULUM_LEVELS.map((lvl) => (
              <div
                key={lvl.levelNumber}
                onClick={() => onNavigate('learning')}
                className="p-4 rounded-lg bg-[#161b22] border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-emerald-400 font-bold">LEVEL {lvl.levelNumber}</span>
                  <span className="text-slate-500 text-[10px]">{lvl.codename}</span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                  {lvl.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {lvl.description}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{lvl.lessons.length} Modules</span>
                  <span>{lvl.badgeName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic ATS Resume & Job Matcher Preview */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Career Infrastructure
              </span>
              <h2 className="mt-2 text-3xl font-bold text-white tracking-tight">
                No Fake Scores. Real Resume ↔ Job Description Alignment.
              </h2>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed">
                Generic ATS checkers fabricate arbitrary compatibility numbers or tell you to keyword-stuff. CyberPath uses a deterministic 6-factor ATS parser and a 4-tier requirement matcher:
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    title: 'Matched Evidence',
                    desc: 'Requirement is backed by verified work history or demonstrable project outcomes.',
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'Partially Matched',
                    desc: 'Related technologies or conceptual mentions present without concrete scope.',
                    color: 'text-amber-400',
                  },
                  {
                    title: 'Not Evidenced (Never "You Don\'t Know")',
                    desc: 'The skill is absent from the resume document without making unverified assumptions about your capability.',
                    color: 'text-rose-400',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded bg-[#161b22] border border-slate-800">
                    <CheckCircle2 className={`w-4 h-4 ${item.color} mt-0.5 flex-shrink-0`} />
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('resume-analyzer')}
                  className="px-5 py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs tracking-wide transition-colors"
                >
                  Launch ATS Resume Analyzer
                </button>
                <button
                  onClick={() => onNavigate('job-match')}
                  className="px-5 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                >
                  Compare Resume Against Job Posting
                </button>
              </div>
            </div>

            {/* Visual Sample Card */}
            <div className="p-6 rounded-xl bg-[#161b22] border border-slate-800 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                <span>AUDIT RECORD: CYBERPATH-ATS-SAMPLE</span>
                <span className="text-emerald-400">STATUS: AUDITABLE</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Estimated ATS Compatibility</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">82<span className="text-xs text-slate-500">/100</span></div>
                  <div className="text-[10px] text-slate-400 mt-1">Formula: Format(25%) + Sections(20%) + Keywords(20%) + Readability(15%)</div>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Evidence Classification</div>
                  <div className="text-xs text-white mt-1 space-y-0.5">
                    <div>• Explicit Skills: 12 detected</div>
                    <div>• Project Backed: 6 verified</div>
                    <div>• Un-evidenced: 3 flagged</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] text-amber-400 font-semibold mb-1">FACTUALITY CONSTRAINT ENFORCED:</div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  "Splunk is not evidenced in the submitted resume. Do not fabricate experience if you have not used the tool. Suggestion: document your lab Splunk exercises if applicable."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Career Paths */}
      <section className="py-20 border-b border-slate-800/80 bg-[#0d1117]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Industry Alignment</h2>
            <p className="mt-2 text-3xl font-bold text-white tracking-tight">
              Targeted Cybersecurity Specializations
            </p>
            <p className="mt-3 text-slate-400 text-sm">
              Different security roles require distinct weighting. CyberPath dynamically recalibrates skill requirements based on your track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(CAREER_PATHS).slice(0, 3).map((cp) => (
              <div
                key={cp.role}
                className="p-5 rounded-lg bg-[#161b22] border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase">{cp.niceskillFrameworkCode}</div>
                  <h3 className="text-base font-bold text-white mt-1">{cp.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cp.shortDescription}</p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Core Stack:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {cp.keyTools.map((tool) => (
                        <span key={tool} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">{cp.salaryBand}</span>
                  <button
                    onClick={() => onNavigate('career')}
                    className="text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Transparency & Ethics</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4 text-sm">
            {[
              {
                q: 'Why does CyberPath refuse to use synthetic ATS scores or fake statistics?',
                a: 'Fabricating a 95% ATS score or claiming you possess skills without evidence creates false confidence and causes candidates to fail technical screening. CyberPath calculates scores strictly from your verified document tokens and platform activities.'
              },
              {
                q: 'How does CyberPath ensure safe and lawful offensive security labs?',
                a: 'All offensive exercises occur exclusively inside isolated, ephemeral container sandboxes. Egress to the public internet is disabled by network policy, and testing is limited to authorized internal RFC 1918 targets.'
              },
              {
                q: 'Can the AI Resume Optimizer invent metrics for me?',
                a: 'No. Under our strict factuality guardrail, the AI can polish grammar, sentence cadence, and active action verbs, but is strictly prohibited from inventing tools, certifications, or statistics. Missing outcomes receive explicit bracketed guidance.'
              },
              {
                q: 'How is career readiness calculated?',
                a: 'Career readiness is an educational indicator combining technical skill evidence (30%), practical labs (20%), diagnostic assessments (15%), CTF performance (15%), mock interview scores (10%), and resume health (10%). If minimum evidence is missing, it explicitly reports "Insufficient data".'
              }
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#161b22] border border-slate-800">
                <h4 className="font-semibold text-white flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="mt-2 text-slate-400 text-xs leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#090d13] text-slate-500 text-xs font-mono">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-300 font-bold">CYBERPATH PLATFORM</span>
            <span>— NICE & OWASP Aligned Architecture</span>
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('certificate')} className="hover:text-slate-300">
              Certificate Verification
            </button>
            <button onClick={() => onNavigate('learning')} className="hover:text-slate-300">
              Curriculum (Levels 0-11)
            </button>
            <button onClick={() => onNavigate('labs')} className="hover:text-slate-300">
              Safe Labs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
