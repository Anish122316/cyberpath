import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Shield,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  Info,
} from 'lucide-react';
import { ATSAnalysisResult, UserProfile } from '../../types';
import { analyzeResumeATS } from '../../services/resumeParser';
import { SAMPLE_RESUMES } from '../../data/careerPaths';

interface ResumeAnalyzerViewProps {
  user: UserProfile;
  atsResult: ATSAnalysisResult | null;
  onUpdateResult: (result: ATSAnalysisResult, rawText: string) => void;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  user,
  atsResult,
  onUpdateResult,
}) => {
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES.SOC_ANALYST);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'keywords' | 'factuality'>('overview');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Deterministic parsing
    const result = analyzeResumeATS(resumeText, user.targetRole);
    onUpdateResult(result, resumeText);

    // Call server-side endpoint for AI bullet-point polish & deep factual analysis
    try {
      const resp = await fetch('/api/gemini/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole: user.targetRole }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.analysis?.suggestions) {
          setAiSuggestions(data.analysis.suggestions);
        }
      }
    } catch (e) {
      console.error('AI assistant polish offline; using deterministic audit', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (sampleKey: keyof typeof SAMPLE_RESUMES) => {
    const text = SAMPLE_RESUMES[sampleKey] || '';
    setResumeText(text);
    const result = analyzeResumeATS(text, user.targetRole);
    onUpdateResult(result, text);
    setAiSuggestions([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        setResumeText(content);
        const res = analyzeResumeATS(content, user.targetRole);
        onUpdateResult(res, content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            EVIDENCE-GROUNDED CAREER ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Dynamic ATS Resume Compatibility Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Evaluates format compliance, section health, active action verbs, and multi-tier keyword evidence.
          </p>
        </div>

        {/* Sample Profile Loaders */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-500 hidden md:inline">Load Sample:</span>
          <button
            onClick={() => loadSample('SOC_ANALYST')}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            Alex (SOC Analyst)
          </button>
          <button
            onClick={() => loadSample('SYSADMIN_TRANSITIONING')}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            Jordan (Sysadmin)
          </button>
          <button
            onClick={() => {
              setResumeText('');
              setAiSuggestions([]);
            }}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Strict Ethical Guardrail Warning Banner */}
      <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-white font-bold">FACTUALITY POLICY ENFORCED:</span>
            <span className="text-slate-400 ml-2">
              Never claim unevidenced skills. If a technology is missing, it is labeled as "Not evidenced in submitted resume" — not as an assumption that you cannot learn it.
            </span>
          </div>
        </div>
        <div className="text-slate-500 whitespace-nowrap">
          Engine: <span className="text-slate-300">v1.0.0-AUDITABLE</span>
        </div>
      </div>

      {/* Main Grid: Input / Upload on Left, Analysis Dashboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editor & File Drop (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="resume-plain-text" className="text-xs font-mono text-slate-300 font-bold uppercase">
                Resume Plain-Text Input
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resume-file-upload"
                  accept=".txt,.md,.doc,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-file-upload"
                  className="cursor-pointer text-[11px] font-mono text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File (.txt, .md)</span>
                </label>
              </div>
            </div>

            <textarea
              id="resume-plain-text"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the full plain text of your resume here..."
              rows={18}
              className="w-full p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 leading-relaxed resize-y"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] font-mono text-slate-500">
                {resumeText.split('\n').filter(Boolean).length} lines | {resumeText.length} chars
              </span>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resumeText.trim()}
                className="px-5 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center space-x-2"
                id="run-ats-audit-btn"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Auditing...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Run ATS & Evidence Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Results & Deep Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {atsResult ? (
            <div className="space-y-6">
              {/* Overall ATS Score Metric Card */}
              <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                      Calculated Compatibility
                    </span>
                    <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline space-x-2">
                      <span className="text-emerald-400">{atsResult.overallAtsScore}</span>
                      <span className="text-base text-slate-500 font-normal font-mono">/ 100</span>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ml-2 ${
                          atsResult.overallAtsScore >= 80
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : atsResult.overallAtsScore >= 60
                            ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {atsResult.overallAtsScore >= 80 ? 'STRONG MATCH' : atsResult.overallAtsScore >= 60 ? 'COMPETITIVE' : 'NEEDS EVIDENCE'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-slate-400 space-y-1 sm:text-right">
                    <div>Format: <strong className="text-white">{atsResult.formattingScore}%</strong> (25% wt)</div>
                    <div>Sections: <strong className="text-white">{atsResult.sectionStructureScore}%</strong> (20% wt)</div>
                    <div>Keywords: <strong className="text-white">{atsResult.keywordRelevanceScore}%</strong> (20% wt)</div>
                  </div>
                </div>

                {/* Score Formula Clarification */}
                <div className="mt-3 text-[11px] font-mono text-slate-500">
                  ATS Score = Format(25%) + Structure(20%) + Keywords(20%) + Readability(15%) + Evidence(10%) + Consistency(10%)
                </div>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex border-b border-slate-800 space-x-4 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'overview' ? 'border-b-2 border-emerald-400 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Audit Findings ({atsResult.findings.length})
                </button>
                <button
                  onClick={() => setActiveTab('sections')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'sections' ? 'border-b-2 border-emerald-400 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Standard Sections ({atsResult.detectedSections.filter((s) => s.found).length}/6)
                </button>
                <button
                  onClick={() => setActiveTab('keywords')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'keywords' ? 'border-b-2 border-emerald-400 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tiered Keywords ({atsResult.evidencedKeywords.length})
                </button>
                <button
                  onClick={() => setActiveTab('factuality')}
                  className={`pb-2 transition-colors ${
                    activeTab === 'factuality' ? 'border-b-2 border-emerald-400 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Un-evidenced Skills ({atsResult.unEvidencedSkills.length})
                </button>
              </div>

              {/* Tab 1: Findings & Suggestions */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {atsResult.findings.map((f, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg bg-[#161b22] border text-xs space-y-2 ${
                        f.type === 'SUCCESS'
                          ? 'border-emerald-500/40'
                          : f.type === 'WARNING'
                          ? 'border-amber-500/40'
                          : 'border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {f.type === 'SUCCESS' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="font-bold text-white">{f.title}</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                          {f.type}
                        </span>
                      </div>

                      <p className="text-slate-300 leading-relaxed">{f.recommendation}</p>

                      <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                        <span>Impact: {f.impact}</span>
                        <span className="text-emerald-400/90">{f.factualityNote}</span>
                      </div>
                    </div>
                  ))}

                  {/* AI Assistant Suggestions if available */}
                  {aiSuggestions.length > 0 && (
                    <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/40 space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-indigo-300 font-bold font-mono">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span>AI ACTION VERB POLISH RECOMMENDATIONS:</span>
                      </div>
                      <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                        {aiSuggestions.map((sug, sIdx) => (
                          <li key={sIdx}>{sug}</li>
                        ))}
                      </ul>
                      <div className="text-[10px] font-mono text-slate-400 pt-1">
                        Notice: Never accept suggestions that invent tools or companies you have not used.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Detected Sections */}
              {activeTab === 'sections' && (
                <div className="space-y-3">
                  {atsResult.detectedSections.map((sec, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg bg-[#161b22] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        {sec.found ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-white">{sec.name}</div>
                          <div className="text-[11px] text-slate-400">{sec.details}</div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          sec.found
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border-rose-800'
                        }`}
                      >
                        {sec.found ? 'RECOGNIZED' : 'MISSING / UNPARSED'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Tiered Keyword Evidence */}
              {activeTab === 'keywords' && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 mb-2">
                    Evidence tiers distinguish between simple keywords mentioned in a list versus skills supported by concrete employment achievements.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {atsResult.evidencedKeywords.map((kw, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[#161b22] border border-slate-800 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{kw.keyword}</span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                              kw.tier === 'EXPERIENCE_EVIDENCE'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : kw.tier === 'PROJECT_EVIDENCE'
                                ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {kw.tier}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 italic truncate font-mono">
                          "...{kw.sourceContext}..."
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          Domain: {kw.category} | Confidence: {kw.confidenceScore}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Un-evidenced Skills */}
              {activeTab === 'factuality' && (
                <div className="p-5 rounded-lg bg-[#161b22] border border-slate-800 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Identified Missing Target Qualifications
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      The following high-demand keywords are not evidenced in the submitted text.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {atsResult.unEvidencedSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="text-xs font-mono px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>{sk}</span>
                      </span>
                    ))}
                  </div>

                  <div className="p-3.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-2 leading-relaxed">
                    <strong className="text-slate-200">How to handle unevidenced skills honestly:</strong>
                    <p>
                      1. If you possess this experience from previous coursework or personal projects, add an explicit bullet point in your Projects or Experience section using the Action + Context + Outcome structure.
                    </p>
                    <p>
                      2. If you do not have experience with this tool, do not add it to your resume. Instead, practice using it in the CyberPath Lab Range.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-lg bg-[#161b22] border border-slate-800 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Resume Audit Active</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Paste your resume text on the left or load a sample profile, then click "Run ATS & Evidence Audit".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
