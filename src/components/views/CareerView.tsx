import React from 'react';
import {
  Briefcase,
  TrendingUp,
  Shield,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CAREER_PATHS } from '../../data/careerPaths';
import { CareerReadinessReport, NavigationTab, TargetRole, UserProfile } from '../../types';

interface CareerViewProps {
  user: UserProfile;
  careerReadiness: CareerReadinessReport;
  onChangeRole: (role: TargetRole) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const CareerView: React.FC<CareerViewProps> = ({
  user,
  careerReadiness,
  onChangeRole,
  onNavigate,
}) => {
  const currentPath = CAREER_PATHS[user.targetRole];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            WORKFORCE PREPARATION & ALIGNMENT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Cybersecurity Career Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track-specific competencies aligned with the NICE Cybersecurity Workforce Framework.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-500">Selected Role:</span>
          <span className="text-emerald-400 font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
            {currentPath.title}
          </span>
        </div>
      </div>

      {/* Educational Career Readiness Report Card */}
      <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">Educational Career Readiness</div>
            <div className="mt-1 flex items-baseline space-x-3">
              {careerReadiness.isSufficientData && careerReadiness.overallReadinessScore !== null ? (
                <>
                  <span className="text-4xl font-extrabold text-cyan-400">
                    {careerReadiness.overallReadinessScore}%
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Confidence: <strong className="text-emerald-400">{careerReadiness.confidenceFactor}%</strong>
                  </span>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold font-mono text-amber-400 bg-amber-950/30 px-3 py-1 rounded border border-amber-800/60">
                    Insufficient Data
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 max-w-md">
            <strong className="text-slate-200">Formula Audit:</strong> Skills(30%) + Labs(20%) + Assessment(15%) + CTFs(15%) + Interview(10%) + Resume(10%)
          </div>
        </div>

        {/* Readiness Missing Criteria Notice if insufficient */}
        {!careerReadiness.isSufficientData && (
          <div className="p-4 rounded bg-amber-950/20 border border-amber-500/40 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-amber-300 font-bold font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>READINESS SCORE GATED BY INCOMPLETE EVIDENCE:</span>
            </div>
            <p className="text-slate-300">
              CyberPath refuses to fabricate an arbitrary readiness percentage without verifiable user actions. Complete the diagnostic assessment and at least one lab to establish your baseline score.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={() => onNavigate('assessment')}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-colors"
              >
                Take Diagnostic Assessment
              </button>
              <button
                onClick={() => onNavigate('labs')}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors"
              >
                Complete First Lab
              </button>
            </div>
          </div>
        )}

        {/* 6 Dimension Breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          {[
            { label: 'Technical Skills', data: careerReadiness.dimensions.technicalSkills },
            { label: 'Practical Labs', data: careerReadiness.dimensions.practicalLabs },
            { label: 'Assessment', data: careerReadiness.dimensions.assessment },
            { label: 'CTF Challenges', data: careerReadiness.dimensions.challenges },
            { label: 'Interview Prep', data: careerReadiness.dimensions.interviewPrep },
            { label: 'Resume ATS', data: careerReadiness.dimensions.resumeQuality },
          ].map((dim, i) => (
            <div key={i} className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 truncate uppercase">{dim.label}</div>
              <div className="text-base font-bold text-white">
                {dim.data.available ? `${dim.data.score}%` : 'Pending'}
              </div>
              <div className="text-[10px] text-slate-400">Wt: {dim.data.weight * 100}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Switcher & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Role Selector List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase">Available Specializations:</div>
          {Object.values(CAREER_PATHS).map((cp) => (
            <button
              key={cp.role}
              onClick={() => onChangeRole(cp.role)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                user.targetRole === cp.role
                  ? 'bg-slate-800 border-emerald-500 text-white'
                  : 'bg-[#161b22] border-slate-800 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-500 uppercase">{cp.niceskillFrameworkCode}</div>
              <div className="text-sm font-bold mt-1">{cp.title}</div>
              <div className="text-xs text-emerald-400 font-mono mt-1">{cp.salaryBand}</div>
            </button>
          ))}
        </div>

        {/* Right Column: In-Depth Role Deep Dive */}
        <div className="lg:col-span-2 p-6 rounded-lg bg-[#161b22] border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <span className="text-[11px] font-mono text-emerald-400 uppercase">
              {currentPath.niceskillFrameworkCode}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">{currentPath.title}</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{currentPath.shortDescription}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-500 uppercase text-[10px]">Core Required Skills:</span>
              <ul className="space-y-1 text-slate-300">
                {currentPath.coreSkills.map((sk, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{sk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-slate-500 uppercase text-[10px]">Recommended Certifications:</span>
              <ul className="space-y-1 text-slate-300">
                {currentPath.recommendedCerts.map((cert, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Primary Technical Interview Focus Areas:</span>
            <div className="mt-2 space-y-2">
              {currentPath.interviewFocus.map((focus, i) => (
                <div key={i} className="p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2">
                  <span className="text-emerald-400 font-mono font-bold">{i + 1}.</span>
                  <span>{focus}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs font-mono text-slate-500">Ready to test interview capability?</span>
            <button
              onClick={() => onNavigate('interview')}
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center space-x-1.5"
            >
              <span>Practice Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
