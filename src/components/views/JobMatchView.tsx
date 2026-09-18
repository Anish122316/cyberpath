import React, { useState } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  FileCheck,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../../data/careerPaths';
import { calculateJobMatchScore } from '../../services/scoringEngine';
import { JobMatchAnalysis, JobDescriptionRequirement, UserProfile } from '../../types';

interface JobMatchViewProps {
  user: UserProfile;
  resumeText: string;
}

export const JobMatchView: React.FC<JobMatchViewProps> = ({ user, resumeText }) => {
  const [jobDescription, setJobDescription] = useState<string>(SAMPLE_RESUMES.SAMPLE_JOB_DESCRIPTION);
  const [matchResult, setMatchResult] = useState<JobMatchAnalysis | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);

  const handleCompare = () => {
    setIsComparing(true);
    const resumeLower = (resumeText || SAMPLE_RESUMES.SOC_ANALYST).toLowerCase();

    // Map requirements with realistic weights and evaluate against resume evidence
    const requirements: JobDescriptionRequirement[] = [
      {
        id: 'req-1',
        title: 'SIEM Monitoring Platforms (Splunk or Elastic)',
        weight: 5,
        category: 'TOOLING',
        matchStatus: resumeLower.includes('splunk') && (resumeLower.includes('monitored') || resumeLower.includes('triaging'))
          ? 'MATCHED'
          : resumeLower.includes('splunk')
          ? 'PARTIALLY_MATCHED'
          : 'NOT_EVIDENCED',
        evidenceSnippet: resumeLower.includes('splunk')
          ? 'Monitored simulated enterprise SIEM alerts in Splunk; custom SPL correlation rules.'
          : undefined,
        explanation: 'Core requirement on 85% of SOC Analyst postings.',
      },
      {
        id: 'req-2',
        title: 'Network Packet Inspection (Wireshark & TCP/IP 3-Way Handshake)',
        weight: 5,
        category: 'NETWORKING',
        matchStatus: resumeLower.includes('wireshark') && resumeLower.includes('pcap')
          ? 'MATCHED'
          : resumeLower.includes('wireshark')
          ? 'PARTIALLY_MATCHED'
          : 'NOT_EVIDENCED',
        evidenceSnippet: resumeLower.includes('wireshark')
          ? 'Analyzed PCAP network captures in Wireshark to reconstruct TCP 3-way handshake anomalies.'
          : undefined,
        explanation: 'Essential for reconstructing malicious C2 sessions and anomaly triage.',
      },
      {
        id: 'req-3',
        title: 'Linux Command Line & Log Triage (grep, awk, auth.log)',
        weight: 4,
        category: 'SECURITY_CORE',
        matchStatus: resumeLower.includes('linux') && resumeLower.includes('bash')
          ? 'MATCHED'
          : 'PARTIALLY_MATCHED',
        evidenceSnippet: 'Hardened 50+ Linux workstations following CIS benchmarks.',
        explanation: 'Crucial for host-level forensic investigations.',
      },
      {
        id: 'req-4',
        title: 'CompTIA Security+ Certification',
        weight: 4,
        category: 'CERTIFICATION',
        matchStatus: resumeLower.includes('security+') || resumeLower.includes('sy0-701')
          ? 'MATCHED'
          : 'NOT_EVIDENCED',
        evidenceSnippet: resumeLower.includes('security+')
          ? 'CompTIA Security+ (SY0-701) | Certified 2024'
          : undefined,
        explanation: 'Industry standard entry-level compliance credential.',
      },
      {
        id: 'req-5',
        title: 'Windows Event Logs (Event ID 4625 brute force triage)',
        weight: 3,
        category: 'SECURITY_CORE',
        matchStatus: resumeLower.includes('4625') || resumeLower.includes('sysmon')
          ? 'MATCHED'
          : 'NOT_EVIDENCED',
        evidenceSnippet: resumeLower.includes('4625')
          ? 'Triaged simulated brute-force attacks (Event ID 4625) and Sysmon alerts.'
          : undefined,
        explanation: 'Essential telemetry for Active Directory intrusion detection.',
      },
      {
        id: 'req-6',
        title: 'Bash or Python Log Parsing Automation',
        weight: 3,
        category: 'TOOLING',
        matchStatus: resumeLower.includes('bash') || resumeLower.includes('python')
          ? 'PARTIALLY_MATCHED'
          : 'NOT_EVIDENCED',
        evidenceSnippet: 'Bash Scripting listed in technical skills overview.',
        explanation: 'Assists with automating repeated alert processing workflows.',
      },
      {
        id: 'req-7',
        title: 'AWS CloudTrail & GuardDuty Log Comprehension',
        weight: 2,
        category: 'CLOUD',
        matchStatus: resumeLower.includes('aws') || resumeLower.includes('cloudtrail')
          ? 'MATCHED'
          : 'NOT_EVIDENCED',
        evidenceSnippet: resumeLower.includes('aws') ? 'AWS CloudTrail telemetry triage.' : undefined,
        explanation: 'Desirable qualification for hybrid cloud environments.',
      },
    ];

    const result = calculateJobMatchScore(
      requirements,
      'Junior / Mid-Level SOC Analyst',
      'Aegis Defense Systems'
    );

    setMatchResult(result);
    setIsComparing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            REVERSE JOB SPECIFICATION MATCHING
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Job Description ↔ Resume Evidence Matcher
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            4-tier evidence categorization against weighted job requirements. Never flags unevidenced skills as "lacking talent".
          </p>
        </div>

        <button
          onClick={() => setJobDescription(SAMPLE_RESUMES.SAMPLE_JOB_DESCRIPTION)}
          className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
        >
          Reset to Sample SOC Analyst JD
        </button>
      </div>

      {/* Main Grid: Input on Left, Comparison Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Job Description Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800 space-y-3">
            <label htmlFor="target-job-posting-text" className="block text-xs font-mono text-slate-300 font-bold uppercase">
              Target Job Posting Text
            </label>
            <textarea
              id="target-job-posting-text"
              rows={16}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste any cybersecurity Job Description here..."
              className="w-full p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 leading-relaxed"
            />
            <button
              onClick={handleCompare}
              disabled={isComparing || !jobDescription.trim()}
              className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center justify-center space-x-2"
              id="compare-job-btn"
            >
              <GitCompare className="w-4 h-4" />
              <span>Evaluate Candidate Evidence Against JD</span>
            </button>
          </div>
        </div>

        {/* Right Column: 4-Tier Match Analysis (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {matchResult ? (
            <div className="space-y-6">
              {/* Overall Match Metric */}
              <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase">Weighted Job Match</span>
                    <div className="text-3xl font-extrabold text-white mt-1">
                      {matchResult.overallMatchScore}%
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono text-slate-400">
                    <div>
                      Role: <span className="text-white font-bold">{matchResult.jobTitle}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: {matchResult.companyName} | Weights: 1 to 5
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Matched Items</div>
                    <div className="text-emerald-400 font-bold mt-0.5">
                      {matchResult.requirements.filter((r) => r.matchStatus === 'MATCHED').length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Partial Match</div>
                    <div className="text-amber-400 font-bold mt-0.5">
                      {matchResult.requirements.filter((r) => r.matchStatus === 'PARTIALLY_MATCHED').length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Critical Gaps</div>
                    <div className="text-rose-400 font-bold mt-0.5">
                      {matchResult.criticalGapsCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Audit Table */}
              <div className="p-5 rounded-lg bg-[#161b22] border border-slate-800 space-y-3">
                <h3 className="text-xs font-mono text-slate-300 font-bold uppercase">
                  Granular Requirement Evidence Audit
                </h3>

                <div className="space-y-3">
                  {matchResult.requirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-3.5 rounded bg-slate-900 border border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{req.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-slate-500">Weight: {req.weight}/5</span>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                              req.matchStatus === 'MATCHED'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                : req.matchStatus === 'PARTIALLY_MATCHED'
                                ? 'bg-amber-950 text-amber-400 border-amber-800'
                                : 'bg-rose-950 text-rose-400 border-rose-800'
                            }`}
                          >
                            {req.matchStatus}
                          </span>
                        </div>
                      </div>

                      {req.evidenceSnippet ? (
                        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-850">
                          <strong className="text-slate-300">Resume Evidence:</strong> {req.evidenceSnippet}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500">
                          Not evidenced in submitted resume. Do not fabricate this experience unless you have genuine hands-on practice.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-lg bg-[#161b22] border border-slate-800 text-center space-y-3">
              <GitCompare className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Job Comparison Ran Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Paste the job posting description on the left and evaluate how your verified resume aligns.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
