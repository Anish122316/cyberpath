import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Award,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface AssessmentViewProps {
  onCompleteAssessment: (results: { domain: string; correct: boolean }[]) => void;
  onNavigate: (tab: NavigationTab) => void;
}

interface DiagnosticQuestion {
  id: string;
  domain: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // Networking
  {
    id: 'diag-net-1',
    domain: 'Networking',
    difficulty: 'Basic',
    question: 'During a standard TCP 3-way handshake, what packet flags are transmitted by the server in response to the client\'s initial SYN request?',
    options: ['ACK only', 'SYN-ACK', 'RST-ACK', 'PSH-ACK'],
    correctIndex: 1,
    rationale: 'The TCP handshake sequence is SYN (Client) -> SYN-ACK (Server) -> ACK (Client).',
  },
  {
    id: 'diag-net-2',
    domain: 'Networking',
    difficulty: 'Intermediate',
    question: 'Which CIDR prefix corresponds to a private enterprise subnet offering exactly 254 usable host addresses?',
    options: ['/24', '/28', '/16', '/30'],
    correctIndex: 0,
    rationale: 'A /24 subnet has 2^(32-24) = 256 total IP addresses, minus 2 (network and broadcast) = 254 usable host addresses.',
  },
  {
    id: 'diag-net-3',
    domain: 'Networking',
    difficulty: 'Advanced',
    question: 'What technique allows an attacker to intercept local Ethernet traffic by spoofing ARP responses, and what defensive switch mechanism neutralizes it?',
    options: [
      'SYN Flood; mitigated by SYN cookies',
      'ARP Cache Poisoning; mitigated by Dynamic ARP Inspection (DAI) with DHCP Snooping',
      'BGP Hijacking; mitigated by RPKI',
      'DNS Amplification; mitigated by Response Rate Limiting'
    ],
    correctIndex: 1,
    rationale: 'ARP Cache Poisoning sends gratuitous ARP replies mapping the attacker MAC to the default router IP. Dynamic ARP Inspection (DAI) cross-references packets against DHCP snooping tables to drop rogue ARP packets.',
  },

  // Linux & Systems
  {
    id: 'diag-lin-1',
    domain: 'Linux',
    difficulty: 'Basic',
    question: 'Which log file in Debian/Ubuntu Linux centralizes SSH authentication attempts, sudo privilege grants, and failed user logons?',
    options: ['/var/log/syslog', '/var/log/auth.log', '/var/log/dmesg', '/var/log/nginx/access.log'],
    correctIndex: 1,
    rationale: '/var/log/auth.log records system authorization events, user logins, and sudo executions.',
  },
  {
    id: 'diag-lin-2',
    domain: 'Linux',
    difficulty: 'Intermediate',
    question: 'In standard Unix octal file permissions, what does mode 4755 represent on a binary owned by root?',
    options: [
      'Standard executable file owned by root',
      'SUID binary that executes with effective root UID for any authorized user',
      'Sticky bit set on a world-writable directory',
      'Read-only encrypted file'
    ],
    correctIndex: 1,
    rationale: 'The leading digit 4 indicates the SUID bit is set, which causes the binary to execute with the effective UID of the file owner (root).',
  },
  {
    id: 'diag-lin-3',
    domain: 'Linux',
    difficulty: 'Advanced',
    question: 'How does a local unprivileged user exploit a root cronjob running `tar -czf /backup.tar.gz *` in a writable folder via wildcard injection?',
    options: [
      'By sending a SIGKILL signal to systemd',
      'By creating files named `--checkpoint=1` and `--checkpoint-action=exec=sh exploit.sh` to inject parameters into GNU tar',
      'By modifying /etc/passwd directly without write permissions',
      'By issuing an SSH brute force loop on port 22'
    ],
    correctIndex: 1,
    rationale: 'GNU tar interprets filenames beginning with `--` as command-line options when `*` expands, allowing attackers to execute arbitrary shell scripts through checkpoint parameters.',
  },

  // Web Security
  {
    id: 'diag-web-1',
    domain: 'Web Security',
    difficulty: 'Basic',
    question: 'What is the most effective architectural defense against SQL Injection vulnerabilities in modern web applications?',
    options: [
      'Client-side JavaScript input validation',
      'Parameterized queries / Prepared statements with type-bound parameters',
      'Blacklisting the single quote (\') character',
      'Relying solely on web application firewall (WAF) regex patterns'
    ],
    correctIndex: 1,
    rationale: 'Parameterized queries separate SQL code logic from untrusted user data, preventing the SQL interpreter from treating user input as executable instructions.',
  },
  {
    id: 'diag-web-2',
    domain: 'Web Security',
    difficulty: 'Intermediate',
    question: 'Which HTTP cookie attribute prevents malicious client-side JavaScript from accessing sensitive session authentication cookies during a Cross-Site Scripting (XSS) attack?',
    options: ['Secure', 'HttpOnly', 'SameSite=Strict', 'Path=/'],
    correctIndex: 1,
    rationale: 'The HttpOnly flag forbids JavaScript from reading the cookie through `document.cookie`, mitigating session token hijacking via XSS.',
  },
  {
    id: 'diag-web-3',
    domain: 'Web Security',
    difficulty: 'Advanced',
    question: 'An attacker crafts an image URL targeting `http://169.254.169.254/latest/meta-data/` on a web application that fetches remote assets. What vulnerability class is this, and what architectural defense is required?',
    options: [
      'Cross-Site Request Forgery (CSRF); add CSRF tokens',
      'Server-Side Request Forgery (SSRF); validate destination IPs against private/link-local ranges, use an egress proxy, and enforce IMDSv2',
      'SQL Injection; use parameterized queries',
      'Local File Inclusion; use basename()'
    ],
    correctIndex: 1,
    rationale: 'SSRF forces a backend server to query internal or link-local resources. Defense requires validating resolved IP addresses and requiring session tokens via IMDSv2.',
  },

  // Blue Team / SOC
  {
    id: 'diag-soc-1',
    domain: 'Blue Team / SOC',
    difficulty: 'Basic',
    question: 'In Windows Security Event Logs, what does Event ID 4625 explicitly signify?',
    options: [
      'An account was successfully logged on',
      'An account failed to log on (authentication failure)',
      'A new process was created',
      'User group membership was altered'
    ],
    correctIndex: 1,
    rationale: 'Event ID 4625 indicates a failed logon attempt, essential for detecting password sprays and brute-force clusters.',
  },
  {
    id: 'diag-soc-2',
    domain: 'Blue Team / SOC',
    difficulty: 'Intermediate',
    question: 'When investigating malware command-and-control (C2) communication in web proxy logs, what behavioral pattern is most characteristic of beaconing?',
    options: [
      'A single 2GB file upload at midnight',
      'Regular, periodic HTTP POST requests occurring at predictable intervals with uniform payload byte sizes',
      'Random UDP packet bursts on port 53',
      'Simultaneous ICMP echo replies'
    ],
    correctIndex: 1,
    rationale: 'Beaconing implants check in with C2 servers on regular heartbeat intervals, often with slight jitter to evade static threshold rules.',
  },
  {
    id: 'diag-soc-3',
    domain: 'Blue Team / SOC',
    difficulty: 'Advanced',
    question: 'In Sysmon logging, what does Event ID 8 (CreateRemoteThread) signal to a security analyst investigating an alert?',
    options: [
      'A standard browser worker thread was spawned',
      'Process injection: code injected into another running process (e.g., shellcode injected into svchost.exe or explorer.exe)',
      'A printer spooler service error',
      'A network interface disconnect'
    ],
    correctIndex: 1,
    rationale: 'Sysmon Event ID 8 logs CreateRemoteThread operations, a standard indicator of process injection used by advanced malware to conceal execution inside legitimate system processes.',
  },

  // Cryptography & Cloud
  {
    id: 'diag-crypto-1',
    domain: 'Applied Cryptography',
    difficulty: 'Intermediate',
    question: 'Why is AES in Electronic Codebook (ECB) mode strictly prohibited for encrypting structured messages or bitmap files?',
    options: [
      'It only supports 64-bit keys',
      'Identical plaintext blocks encrypt into identical ciphertext blocks, preserving visual and structural patterns',
      'It cannot be decrypted on modern 64-bit processors',
      'It requires an active internet connection to generate IVs'
    ],
    correctIndex: 1,
    rationale: 'ECB mode lacks diffusion and does not use an initialization vector; identical 16-byte blocks of plaintext always yield the same ciphertext.',
  },
  {
    id: 'diag-cloud-1',
    domain: 'Cloud Security',
    difficulty: 'Advanced',
    question: 'How does AWS IMDSv2 (Instance Metadata Service Version 2) successfully mitigate SSRF vulnerabilities that compromise IMDSv1?',
    options: [
      'By disabling the metadata IP 169.254.169.254 entirely',
      'By requiring a session-oriented HTTP PUT request with custom TTL headers to retrieve a temporary token before querying metadata endpoints',
      'By routing metadata exclusively over public HTTPS certificates',
      'By requiring hardware multi-factor authentication'
    ],
    correctIndex: 1,
    rationale: 'IMDSv2 introduces token-backed sessions: applications must make a PUT request with `X-aws-ec2-metadata-token-ttl-seconds` to acquire an authorization token, defeating standard GET-based SSRF.',
  }
];

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  onCompleteAssessment,
  onNavigate,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIdx];

  const handleSelect = (optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate results
      const results: { domain: string; correct: boolean }[] = [];
      let totalCorrect = 0;

      DIAGNOSTIC_QUESTIONS.forEach((q) => {
        const correct = userAnswers[q.id] === q.correctIndex;
        if (correct) totalCorrect++;
        results.push({ domain: q.domain, correct });
      });

      setFinalScore(totalCorrect);
      setIsFinished(true);
      onCompleteAssessment(results);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
          <Shield className="w-3.5 h-3.5" />
          <span>OBJECTIVE MULTI-TIER SKILL CALIBRATION</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Diagnostic Cybersecurity Assessment
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Calibrates baseline skill scores from Basic to Advanced across Networking, Linux, Web Security, Cryptography, Blue Team SOC, and Cloud Security.
        </p>
      </div>

      {!isFinished ? (
        <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 space-y-6">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Question {currentIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">{currentQ.domain}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                    currentQ.difficulty === 'Basic'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : currentQ.difficulty === 'Intermediate'
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                      : 'bg-amber-950/80 text-amber-300 border-amber-800'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
              </div>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white leading-snug">
              {currentQ.question}
            </h3>

            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(optIdx)}
                    className={`w-full text-left p-3 rounded-md border text-xs font-medium transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-xs font-mono transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={userAnswers[currentQ.id] === undefined}
              className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center space-x-1.5"
            >
              <span>{currentIdx === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-8 rounded-lg bg-[#161b22] border border-slate-800 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <Award className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase">Assessment Completed</span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Your Diagnostic Profile is Calibrated
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              You correctly solved {finalScore} of {DIAGNOSTIC_QUESTIONS.length} diagnostic questions across core and advanced cybersecurity disciplines.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('LEARNING')}
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-colors"
            >
              Proceed to Curriculum Lessons
            </button>
            <button
              onClick={() => onNavigate('CHALLENGES')}
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#161b22] hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono transition-colors"
            >
              Enter CTF Flag Capture Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
