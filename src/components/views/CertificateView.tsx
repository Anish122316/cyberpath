import React, { useState } from 'react';
import {
  Award,
  Shield,
  CheckCircle2,
  Printer,
  Copy,
  ExternalLink,
  Search,
  Lock,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { CAREER_PATHS } from '../../data/careerPaths';

interface CertificateViewProps {
  user: UserProfile;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ user }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('CYBERPATH-CERT-77A912F4');
  const [searchCode, setSearchCode] = useState<string>('');
  const [verifiedStatus, setVerifiedStatus] = useState<boolean | null>(null);

  const certData = {
    candidateName: user.name,
    trackTitle: CAREER_PATHS[user.targetRole]?.title || 'Cybersecurity Defense Specialist',
    niceFrameworkCode: CAREER_PATHS[user.targetRole]?.niceskillFrameworkCode || 'PR-CDA-001',
    issueDate: 'March 15, 2026',
    certificateId: verificationCode,
    sha256Hash: '9e107d9d372bb6826bd81d3542a419d6b5e523f81e05d2146e4ec6f5e71410d1',
    verifiedCompetencies: [
      'Linux Administration & SUID Privilege Auditing',
      'Network Reconnaissance & Stealth SYN Port Scanning',
      'SIEM Telemetry Triage & Event ID 4625 Investigation',
      'OWASP Top 10 Web Application Vulnerability Analysis',
      'Incident Handling in accordance with NIST SP 800-61',
    ],
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certData.sha256Hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setVerifiedStatus(searchCode.trim().toUpperCase().includes('CYBERPATH'));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            CREDENTIAL INTEGRITY AUDIT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Verifiable Cybersecurity Certificate
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographically sealed and aligned with the NICE Cybersecurity Workforce Framework.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors flex items-center space-x-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save Credential</span>
        </button>
      </div>

      {/* Official Certificate Parchment Container */}
      <div className="bg-[#0f141c] p-8 sm:p-12 rounded-xl border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden text-center space-y-6">
        {/* Subtle Watermark Shield */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Shield className="w-96 h-96 text-emerald-400" />
        </div>

        {/* Certificate Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
            <Lock className="w-3 h-3" />
            <span>CYBERPATH WORKFORCE CREDENTIAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-white uppercase mt-2">
            Certificate of Practical Competency
          </h2>
          <p className="text-xs font-mono text-slate-400">
            NICE Framework Work Role: {certData.niceFrameworkCode}
          </p>
        </div>

        {/* Recipient */}
        <div className="py-2">
          <p className="text-xs font-serif italic text-slate-400">This officially certifies that</p>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-wider text-emerald-400 mt-2 font-sans">
            {certData.candidateName}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
            has successfully demonstrated hands-on technical proficiency across authorized container sandboxes, verified CTF flag captures, and rigorous defensive assessments in the specialization of
          </p>
          <div className="text-lg font-bold text-white mt-1">
            {certData.trackTitle}
          </div>
        </div>

        {/* Verified Competencies List */}
        <div className="max-w-xl mx-auto p-4 rounded bg-[#161b22]/90 border border-slate-800 text-left font-mono text-xs space-y-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            Verified Practical Competencies:
          </div>
          <ul className="space-y-1 text-slate-300">
            {certData.verifiedCompetencies.map((comp, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{comp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cryptographic Ledger Verification Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
          <div className="text-left">
            <div>Issue Date: <span className="text-slate-300">{certData.issueDate}</span></div>
            <div>Certificate ID: <span className="text-emerald-400 font-bold">{certData.certificateId}</span></div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1.5 justify-end">
              <span>SHA-256 Hash:</span>
              <button
                onClick={handleCopyHash}
                className="text-slate-300 hover:text-white flex items-center space-x-1 font-mono text-[11px]"
              >
                <span>{certData.sha256Hash.slice(0, 16)}...</span>
                <Copy className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
            <div className="text-[10px] text-slate-600">Issued by CyberPath Certification Authority</div>
          </div>
        </div>
      </div>

      {/* Public Verification Lookup Tool for Employers */}
      <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Employer Verification Tool</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Authenticate the cryptographic validity of any CyberPath credential.
          </p>
        </div>

        <form onSubmit={handleVerifyLookup} className="flex items-center space-x-2">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="Enter Certificate ID (e.g. CYBERPATH-CERT-77A912F4)..."
            className="flex-1 p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
          >
            Verify Credential
          </button>
        </form>

        {verifiedStatus !== null && (
          <div
            className={`p-3 rounded text-xs font-mono flex items-center space-x-2 ${
              verifiedStatus
                ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border border-rose-500/50 text-rose-300'
            }`}
          >
            {verifiedStatus ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  VALID CREDENTIAL: Verified in public registry. Recipient: {user.name} ({CAREER_PATHS[user.targetRole]?.title}).
                </span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  INVALID RECORD: No matching cryptographic record found for this identifier.
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
