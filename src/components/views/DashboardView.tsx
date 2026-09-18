import React from 'react';
import {
  Shield,
  Zap,
  Star,
  Award,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  FileCheck,
  Target,
  Sparkles,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { NavigationTab, UserProfile, SkillNode, CareerReadinessReport, ATSAnalysisResult } from '../../types';
import { CAREER_PATHS } from '../../data/careerPaths';

interface DashboardViewProps {
  user: UserProfile;
  skills: SkillNode[];
  careerReadiness: CareerReadinessReport;
  atsResult: ATSAnalysisResult | null;
  onNavigate: (tab: NavigationTab) => void;
  onOpenGoogleAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  skills,
  careerReadiness,
  atsResult,
  onNavigate,
  onOpenGoogleAuth,
}) => {
  // Format radar data from real skills
  const radarData = skills.map((s) => ({
    subject: s.name,
    score: s.score,
    confidence: s.confidence,
    fullMark: 100,
  }));

  const totalEvidenceCount = skills.reduce((sum, s) => sum + s.evidenceCount, 0);

  // Identify weak skills based on real data
  const weakSkills = skills.filter((s) => s.evidenceCount > 0 && s.score < 65);
  const unevidencedSkills = skills.filter((s) => s.evidenceCount === 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Google Account Authentication Banner */}
      {!user.isLoggedIn ? (
        <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Sign in with Google to initialize your real-time learning ledger
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero predefined scores. Your learning metrics, skill percentages, and earned stars will start at 0 and track your actual progress.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenGoogleAuth}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-semibold text-xs transition-colors flex items-center space-x-2 whitespace-nowrap shadow-sm"
            id="dashboard-google-login-cta-btn"
          >
            <span>Sign in with Google</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-lg bg-[#161b22] border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Google Sync Active:</span>
            <strong className="text-emerald-400">{user.email}</strong>
            <span className="text-slate-500">({user.name})</span>
          </div>
          <div className="text-slate-500 hidden sm:block">
            Evidence-Based Tracking • Level {user.currentLevel} • {user.xp} XP
          </div>
        </div>
      )}

      {/* Header with Greeting & Track */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OPERATIONAL STATUS: ACTIVE SESSION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {user.isLoggedIn ? `Welcome, ${user.name}` : 'CyberPath Learning Center'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Target Track: <span className="text-slate-200 font-semibold">{CAREER_PATHS[user.targetRole]?.title}</span> ({CAREER_PATHS[user.targetRole]?.salaryBand})
          </p>
        </div>

        {/* Diagnostic Assessment CTA if incomplete */}
        {!user.assessmentCompleted ? (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <div className="font-semibold">Diagnostic Assessment Incomplete</div>
              <div className="text-[11px] text-amber-300/80">Calibrate your true baseline skill scores.</div>
            </div>
            <button
              onClick={() => onNavigate('assessment')}
              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono transition-colors whitespace-nowrap"
              id="dashboard-take-assessment-btn"
            >
              Start (8 min)
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Diagnostic Profile Calibrated</span>
          </div>
        )}
      </div>

      {/* Metric Strip (Deterministic Real-time Data Only) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800">
          <div className="text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>CURRICULUM LEVEL</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            Level {user.currentLevel}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {user.currentLevel === 0 ? 'Foundations Stage' : `Level ${user.currentLevel} Verified`}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800">
          <div className="text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>TOTAL EARNED XP</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">
            {user.xp} <span className="text-xs text-slate-500 font-normal">XP</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            ★ {user.stars} Stars Earned
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800">
          <div className="text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>CAREER READINESS</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            {careerReadiness.isSufficientData && careerReadiness.overallReadinessScore !== null ? (
              <div className="text-2xl font-bold text-cyan-400">
                {careerReadiness.overallReadinessScore}%
              </div>
            ) : (
              <div className="text-xs font-mono text-amber-400 bg-amber-950/30 px-2 py-1 rounded inline-block">
                Insufficient Data
              </div>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {careerReadiness.isSufficientData ? 'Calculated from verified dimensions' : 'Requires assessment & activities'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800">
          <div className="text-xs font-mono text-slate-500 flex items-center justify-between">
            <span>RESUME ATS COMPATIBILITY</span>
            <FileCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            {atsResult ? (
              <div className="text-2xl font-bold text-purple-400">
                {atsResult.overallAtsScore}<span className="text-xs text-slate-500">/100</span>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('resume-analyzer')}
                className="text-xs text-emerald-400 hover:underline font-mono"
              >
                Upload Resume &rarr;
              </button>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            {atsResult ? 'ATS Compatibility Verified' : 'Not yet analyzed'}
          </div>
        </div>
      </div>

      {/* Main Grid: Skill Radar & Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart & Evidence Confidence */}
        <div className="p-5 rounded-lg bg-[#161b22] border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Cybersecurity Skill Profile
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated strictly from lessons, quizzes, practical labs, and CTFs.
              </p>
            </div>
            <button
              onClick={() => onNavigate('skills')}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <span>Inspect Skill Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar
                    name="Skill Mastery"
                    dataKey="score"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>

              {totalEvidenceCount === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 text-center max-w-[200px]">
                    Zero baseline. Complete lessons to calibrate radar.
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Granular Competency & Evidence Confidence:
              </div>
              {skills.slice(0, 4).map((s) => (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300">{s.name}</span>
                    <span className="text-slate-400">
                      {s.score}/100 <span className="text-[10px] text-slate-500">({s.confidence}% conf)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.score >= 75 ? 'bg-emerald-500' : s.score >= 50 ? 'bg-cyan-500' : s.score > 0 ? 'bg-amber-500' : 'bg-slate-800'
                      }`}
                      style={{ width: `${Math.max(s.score > 0 ? 5 : 0, s.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Recommended Activity Card */}
        <div className="p-5 rounded-lg bg-[#161b22] border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RECOMMENDED NEXT ACTION</span>
            </div>

            <h3 className="text-base font-bold text-white mt-3">
              {user.currentLevel === 0 ? 'Level 0: Ethical Hacker Mindset' : `Level ${user.currentLevel} Lab Exercise`}
            </h3>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {user.currentLevel === 0
                ? 'Master the legal and ethical boundary lines of the Computer Fraud and Abuse Act (CFAA) and Rules of Engagement (RoE).'
                : 'Complete the hands-on verification lab in an isolated terminal sandbox to earn your next level badge.'}
            </p>

            <div className="mt-4 p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 space-y-1">
              <div>• Target Outcome: Master core fundamentals</div>
              <div>• Estimated Time: 15 minutes</div>
              <div>• XP Value: +100 XP (Non-farmable)</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('learning')}
            className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2"
            id="dashboard-continue-learning-btn"
          >
            <span>Continue Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-Column Utility: Weak Skills Alert & Safe Labs Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak / Unevidenced Skills */}
        <div className="p-5 rounded-lg bg-[#161b22] border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Identified Skill Gaps
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Evidence Audit</span>
          </div>

          <div className="mt-4 space-y-3">
            {weakSkills.length > 0 ? (
              weakSkills.map((ws) => (
                <div key={ws.id} className="p-3 rounded bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex justify-between font-mono font-semibold">
                    <span className="text-white">{ws.name}</span>
                    <span className="text-amber-400">{ws.score}/100</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{ws.description}</p>
                </div>
              ))
            ) : unevidencedSkills.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  The following target skills have zero verified evidence items logged:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {unevidencedSkills.slice(0, 5).map((us) => (
                    <span
                      key={us.id}
                      className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {us.name} (Not Evidenced)
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Complete the respective level module or challenge to prove hands-on mastery.
                </p>
              </div>
            ) : (
              <div className="text-xs text-emerald-400 p-3 rounded bg-emerald-950/20 border border-emerald-900">
                All tracked competencies currently satisfy target thresholds.
              </div>
            )}
          </div>
        </div>

        {/* Practical Lab Environment Launcher */}
        <div className="p-5 rounded-lg bg-[#161b22] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Ephemeral Cyber Range Lab
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                AUTHORIZED SANDBOX
              </span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Practice defensive forensics and reconnaissance inside a zero-egress, ephemeral container environment. No external network access is permitted.
            </p>

            <div className="mt-4 p-3 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div className="text-slate-500"># Sample available commands:</div>
              <div>$ nmap -sS 10.10.12.55</div>
              <div>$ grep "Failed password" /var/log/auth.log</div>
              <div>$ find / -perm -4000 2&gt;/dev/null</div>
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-3">
            <button
              onClick={() => onNavigate('labs')}
              className="flex-1 py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center space-x-2"
              id="dashboard-open-lab-btn"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch Lab Terminal</span>
            </button>
            <button
              onClick={() => onNavigate('challenges')}
              className="py-2.5 px-4 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition-colors"
            >
              CTF Flag Range
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
