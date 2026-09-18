import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Shield,
  Download,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface ResumeBuilderViewProps {
  user: UserProfile;
}

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({ user }) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Resume form state
  const [formData, setFormData] = useState({
    name: 'Alex Chen',
    contactLine: 'San Jose, CA | alex.chen.cyber@example.com | (555) 234-5678 | linkedin.com/in/alexchen-cyber',
    summary:
      'Analytical and detail-oriented Cybersecurity Specialist with hands-on experience in security information and event management (SIEM), network packet analysis, and alert triage. Proficient in monitoring telemetry across Linux and Windows environments, investigating anomalous authentication clusters, and documenting incident remediation workflows. CompTIA Security+ certified.',
    skills:
      'Security Monitoring & SIEM: Splunk, Elastic Security, Log Analysis, Alert Triage, Incident Response\nNetworking & Protocols: TCP/IP, Wireshark, DNS, HTTP/HTTPS, Firewall Rules, Subnetting\nOperating Systems & CLI: Linux (Ubuntu/Debian, RedHat), Bash Scripting, Windows Server, PowerShell Basics\nSecurity Tools: Nmap, Suricata, Sysmon, Burp Suite (Community), Nessus Essentials\nFrameworks: MITRE ATT&CK, NIST CSF, OWASP Top 10',
    experience: [
      {
        title: 'Cybersecurity Lab Analyst / Apprentice',
        company: 'CyberPath Training Center — San Jose, CA',
        dates: 'June 2025 - Present',
        bullets: [
          'Monitored simulated enterprise SIEM alerts in Splunk, triaging over 45 simulated high-priority security incidents including brute-force attacks (Event ID 4625) and unauthorized privilege escalations.',
          'Analyzed PCAP network captures in Wireshark to reconstruct TCP 3-way handshake anomalies and identify beaconing malware traffic.',
          'Documented standardized incident response playbooks for phishing investigation, reducing average triage time by 20% in virtual team drills.',
        ],
      },
      {
        title: 'IT Support & Systems Technician',
        company: 'Silicon Valley Tech Solutions — Santa Clara, CA',
        dates: 'January 2024 - May 2025',
        bullets: [
          'Managed user account provisioning, access permissions, and multi-factor authentication (MFA) enforcement for 200+ employees using Active Directory.',
          'Hardened 50+ Linux and Windows workstations following CIS Benchmarks, restricting unnecessary service daemons and auditing local administrator accounts.',
          'Resolved tier 1 and tier 2 hardware, network connectivity, and operating system tickets with a 98% positive resolution rating.',
        ],
      },
    ],
    projects: [
      {
        title: 'Home Lab SIEM & Threat Hunting Range',
        bullets: [
          'Built a multi-node virtual home lab running Ubuntu Server and Windows 10 targets, configuring Splunk Universal Forwarders to centralize authentication and sysmon telemetry.',
          'Simulated credential stuffing attacks using Hydra in an isolated network segment, authoring custom Splunk SPL correlation rules to flag >10 failed attempts within 60 seconds.',
        ],
      },
    ],
    education: 'Bachelor of Science in Information Technology, California State University | 2023',
    certifications: 'CompTIA Security+ (SY0-701) | Certified 2024',
  });

  const handleCopyText = () => {
    const textOutput = `${formData.name.toUpperCase()}
${formData.contactLine}

PROFESSIONAL SUMMARY
${formData.summary}

TECHNICAL SKILLS
${formData.skills}

WORK EXPERIENCE
${formData.experience
  .map(
    (exp) => `${exp.title}
${exp.company} | ${exp.dates}
${exp.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

PROJECTS
${formData.projects
  .map(
    (p) => `${p.title}
${p.bullets.map((b) => `- ${b}`).join('\n')}`
  )
  .join('\n\n')}

EDUCATION & CERTIFICATIONS
- ${formData.education}
- ${formData.certifications}`;

    navigator.clipboard.writeText(textOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            WORKDAY & GREENHOUSE OPTIMIZED
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            ATS-Standard Resume Builder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enforces standard section headings, single-column parsing geometry, and the Action + Context + Outcome bullet formula.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors flex items-center space-x-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Plain Text'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Split Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="space-y-6 bg-[#161b22] p-5 rounded-lg border border-slate-800 text-xs">
          <h3 className="font-bold text-white text-sm font-mono border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Structured Section Editor</span>
            <span className="text-slate-500 font-normal">Single-Column Strict</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 font-mono mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Contact Line</label>
              <input
                type="text"
                value={formData.contactLine}
                onChange={(e) => setFormData({ ...formData, contactLine: e.target.value })}
                className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Professional Summary</label>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Technical Skills (Categorized)</label>
              <textarea
                rows={5}
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Education</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono mb-1">Certifications</label>
              <input
                type="text"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live ATS-Compliant Document Sheet */}
        <div className="bg-white text-slate-900 p-8 rounded-lg shadow-2xl font-serif text-xs leading-relaxed space-y-4 max-w-2xl mx-auto border border-slate-200 print:m-0 print:p-0 print:border-none">
          {/* Header */}
          <div className="text-center border-b border-slate-300 pb-3">
            <h1 className="text-xl font-bold tracking-wider uppercase font-sans text-slate-900">
              {formData.name}
            </h1>
            <p className="text-[11px] text-slate-700 mt-1 font-sans">
              {formData.contactLine}
            </p>
          </div>

          {/* Professional Summary */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans border-b border-slate-800 pb-0.5 mb-1 text-slate-900">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-slate-800 leading-normal">{formData.summary}</p>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans border-b border-slate-800 pb-0.5 mb-1 text-slate-900">
              TECHNICAL SKILLS
            </h2>
            <div className="text-slate-800 whitespace-pre-line leading-normal">
              {formData.skills}
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans border-b border-slate-800 pb-0.5 mb-1 text-slate-900">
              WORK EXPERIENCE
            </h2>
            <div className="space-y-3">
              {formData.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between font-bold text-slate-900 font-sans">
                    <span>{exp.title}</span>
                    <span>{exp.dates}</span>
                  </div>
                  <div className="text-slate-700 italic">{exp.company}</div>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-800">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans border-b border-slate-800 pb-0.5 mb-1 text-slate-900">
              SECURITY PROJECTS & LABS
            </h2>
            <div className="space-y-2">
              {formData.projects.map((proj, pi) => (
                <div key={pi}>
                  <div className="font-bold text-slate-900 font-sans">{proj.title}</div>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-slate-800">
                    {proj.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certs */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans border-b border-slate-800 pb-0.5 mb-1 text-slate-900">
              EDUCATION & CERTIFICATIONS
            </h2>
            <ul className="list-disc list-inside text-slate-800 space-y-0.5">
              <li>{formData.education}</li>
              <li>{formData.certifications}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
