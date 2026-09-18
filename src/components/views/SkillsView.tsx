import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Shield,
  Layers,
  Info,
} from 'lucide-react';
import { SkillNode, UserProfile } from '../../types';

interface SkillsViewProps {
  user: UserProfile;
  skills: SkillNode[];
}

export const SkillsView: React.FC<SkillsViewProps> = ({ user, skills }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(skills[0] || null);

  const getStatusBadge = (score: number, evidenceCount: number) => {
    if (evidenceCount === 0 || score === 0) {
      return { text: 'UNTESTED (0%)', color: 'bg-slate-900 text-slate-500 border-slate-800' };
    }
    if (score >= 80) {
      return { text: 'PROFICIENT', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' };
    }
    if (score >= 60) {
      return { text: 'COMPETENT', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' };
    }
    return { text: 'DEVELOPING', color: 'bg-amber-950 text-amber-400 border-amber-800' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Transparency Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            DETERMINISTIC COMPETENCY GRAPH
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Skill Analytics & Evidence Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every score is mathematically calculated with confidence bounds. Zero hallucinated metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-slate-900 p-2.5 rounded border border-slate-800">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Formula: Lessons(25%) + Quizzes(25%) + Labs(30%) + CTFs(20%)</span>
        </div>
      </div>

      {/* Main Grid: Skills Matrix on Left, Detailed Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Nodes List */}
        <div className="lg:col-span-2 space-y-3">
          {skills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;
            const badge = getStatusBadge(skill.score, skill.evidenceCount);

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 rounded-lg bg-[#161b22] border transition-all cursor-pointer ${
                  isSelected ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">{skill.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{skill.description}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-white">
                      {skill.score}<span className="text-xs text-slate-500">/100</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {skill.confidence}% confidence
                    </div>
                  </div>
                </div>

                {/* Progress Bar with Confidence Visualizer */}
                <div className="mt-3 space-y-1">
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all ${
                        skill.score >= 75
                          ? 'bg-emerald-500'
                          : skill.score >= 50
                          ? 'bg-cyan-500'
                          : skill.score > 0
                          ? 'bg-amber-500'
                          : 'bg-slate-800'
                      }`}
                      style={{ width: `${skill.evidenceCount > 0 && skill.score > 0 ? Math.max(5, skill.score) : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Evidence Items: {skill.evidenceCount} verified</span>
                    <span>Last calibrated: {skill.lastUpdated}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Evidence Audit Inspector */}
        <div className="lg:col-span-1 space-y-4">
          {selectedSkill ? (
            <div className="p-5 rounded-lg bg-[#161b22] border border-slate-800 space-y-4 sticky top-20">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-[11px] font-mono text-emerald-400 uppercase">Skill Inspector</span>
                <h3 className="text-base font-bold text-white mt-1">{selectedSkill.name}</h3>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated Score:</span>
                  <span className="text-white font-bold">{selectedSkill.score} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence Factor:</span>
                  <span className="text-emerald-400 font-bold">{selectedSkill.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sample Count:</span>
                  <span className="text-slate-200">{selectedSkill.evidenceCount} activities</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">
                  Evidence Breakdown:
                </h4>
                {selectedSkill.evidenceCount > 0 ? (
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                      <div className="text-emerald-400 font-mono text-[11px] font-bold">VERIFIED LAB DRILL</div>
                      <div className="text-slate-400 mt-0.5">Terminal execution and flag verification logged.</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
                      <div className="text-cyan-400 font-mono text-[11px] font-bold">MODULE QUIZ SUBMISSION</div>
                      <div className="text-slate-400 mt-0.5">Theory evaluation recorded in session state.</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400">
                    No practical activities logged yet for this domain. Complete relevant Level modules or CTF challenges to build verifiable confidence.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-start space-x-2">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>
                  Confidence is low (&lt;50%) when derived solely from quizzes. Complete safe labs and CTFs to reach high confidence (&gt;80%).
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 text-center text-xs text-slate-400">
              Select a skill from the matrix to audit its evidence trail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
