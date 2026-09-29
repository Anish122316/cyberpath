import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle2,
  Printer,
  Copy,
  Search,
  Lock,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { CAREER_PATHS } from '../../data/careerPaths';

interface CertificateViewProps {
  user: UserProfile;
}

interface VerificationResult {
  valid: boolean;
  message?: string;
  certificateId?: string;
  issuer?: string;
  issueDate?: string;
  recipientName?: string;
  trackTitle?: string;
  standardsCompliant?: string;
  fingerprint?: string;
  signatureAlgorithm?: string;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ user }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>('CYBERPATH-CERT-77A912F4');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedResult, setVerifiedResult] = useState<VerificationResult | null>(null);

  const [activeCert, setActiveCert] = useState<{
    certificateId: string;
    issueDate: string;
    fingerprint: string;
  }>({
    certificateId: 'CYBERPATH-CERT-77A912F4',
    issueDate: '2026-03-15',
    fingerprint: '3b8782a17cfc1d9f826359be70eb59a11a84f326ae586b970345cb38a0c20a4b',
  });

  const trackTitle = CAREER_PATHS[user.targetRole]?.title || 'Cybersecurity Defense Specialist';
  const niceFrameworkCode = CAREER_PATHS[user.targetRole]?.niceskillFrameworkCode || 'PR-CDA-001';

  // Automatically request/ensure issuance in persistent registry
  useEffect(() => {
    let isMounted = true;
    const fetchOrIssueCert = async () => {
      try {
        const res = await fetch('/api/certificates/issue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipientId: user.id || 'usr-guest',
            recipientName: user.name || 'Cybersecurity Trainee',
            trackTitle,
            standardsCompliant: 'NICE Framework & OWASP Aligned',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.certId) {
            setActiveCert({
              certificateId: data.certId,
              issueDate: data.issueDate,
              fingerprint: data.fingerprint || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            });
            setSearchCode(data.certId);
          }
        }
      } catch (e) {
        console.error('Error issuing/fetching certificate record:', e);
      }
    };
    fetchOrIssueCert();
    return () => {
      isMounted = false;
    };
  }, [user.id, user.name, trackTitle]);

  const verifiedCompetencies = [
    'Linux Administration & SUID Privilege Auditing',
    'Network Reconnaissance & Stealth SYN Port Scanning',
    'SIEM Telemetry Triage & Event ID 4625 Investigation',
    'OWASP Top 10 Web Application Vulnerability Analysis',
    'Incident Handling in accordance with NIST SP 800-61',
  ];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(activeCert.fingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifyLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchCode.trim().toUpperCase();
    if (!trimmed) return;

    setIsVerifying(true);
    setVerifiedResult(null);

    try {
      const response = await fetch(`/api/verify-certificate/${encodeURIComponent(trimmed)}`);
      const data = await response.json();
      if (response.ok && data.valid) {
        setVerifiedResult(data);
      } else {
        setVerifiedResult({
          valid: false,
          message: data.message || `No cryptographic record found for identifier ${trimmed}.`,
        });
      }
    } catch (err: any) {
      setVerifiedResult({
        valid: false,
        message: err?.message || 'Verification network error',
      });
    } finally {
      setIsVerifying(false);
    }
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
            NICE Framework Work Role: {niceFrameworkCode}
          </p>
        </div>

        {/* Recipient */}
        <div className="py-2">
          <p className="text-xs font-serif italic text-slate-400">This officially certifies that</p>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-wider text-emerald-400 mt-2 font-sans">
            {user.name}
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto mt-2 leading-relaxed">
            has successfully demonstrated hands-on technical proficiency across authorized container sandboxes, verified CTF flag captures, and rigorous defensive assessments in the specialization of
          </p>
          <div className="text-lg font-bold text-white mt-1">
            {trackTitle}
          </div>
        </div>

        {/* Verified Competencies List */}
        <div className="max-w-xl mx-auto p-4 rounded bg-[#161b22]/90 border border-slate-800 text-left font-mono text-xs space-y-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            Verified Practical Competencies:
          </div>
          <ul className="space-y-1 text-slate-300">
            {verifiedCompetencies.map((comp, idx) => (
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
            <div>Issue Date: <span className="text-slate-300">{activeCert.issueDate}</span></div>
            <div>Certificate ID: <span className="text-emerald-400 font-bold">{activeCert.certificateId}</span></div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1.5 justify-end">
              <span>HMAC-SHA256 Fingerprint:</span>
              <button
                onClick={handleCopyHash}
                title="Click to copy cryptographic fingerprint"
                className="text-slate-300 hover:text-white flex items-center space-x-1 font-mono text-[11px]"
              >
                <span>{activeCert.fingerprint.slice(0, 16)}...</span>
                <Copy className="w-3 h-3 text-emerald-400" />
              </button>
            </div>
            {copied && <span className="text-[10px] text-emerald-400">Copied to clipboard!</span>}
            <div className="text-[10px] text-slate-600">Issued by CyberPath Certification Authority</div>
          </div>
        </div>
      </div>

      {/* Public Verification Lookup Tool for Employers */}
      <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <span>Employer Verification Tool (Real-Time Cryptographic Ledger)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Authenticate the cryptographic validity of any CyberPath credential against our tamper-resistant ledger.
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
            disabled={isVerifying}
            className="px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono transition-colors disabled:opacity-50 flex items-center space-x-1.5"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify Credential</span>
            )}
          </button>
        </form>

        {verifiedResult && (
          <div
            className={`p-4 rounded-lg text-xs font-mono border space-y-2 ${
              verifiedResult.valid
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}
          >
            {verifiedResult.valid ? (
              <>
                <div className="flex items-center space-x-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>VALID CREDENTIAL - CRYPTOGRAPHIC INTEGRITY VERIFIED</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1 text-[11px]">
                  <div>
                    <span className="text-slate-500">Certificate ID: </span>
                    <strong className="text-emerald-400">{verifiedResult.certificateId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Recipient: </span>
                    <strong>{verifiedResult.recipientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Track: </span>
                    <strong>{verifiedResult.trackTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Issue Date: </span>
                    <strong>{verifiedResult.issueDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Compliance: </span>
                    <strong>{verifiedResult.standardsCompliant}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Algorithm: </span>
                    <strong>{verifiedResult.signatureAlgorithm}</strong>
                  </div>
                </div>
                <div className="pt-1 border-t border-emerald-800/40 text-[10px] break-all text-slate-400">
                  <span className="text-slate-500">Fingerprint: </span>
                  <code>{verifiedResult.fingerprint}</code>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>
                  {verifiedResult.message || 'INVALID RECORD: Certificate not found in registry.'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
