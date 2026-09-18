import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Shield,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Cpu,
  HardDrive,
  Network,
} from 'lucide-react';

interface LabsViewProps {
  onLabVerified?: (labId: string) => void;
}

export const LabsView: React.FC<LabsViewProps> = ({ onLabVerified }) => {
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  const [timeRemaining, setTimeRemaining] = useState<number>(1800); // 30 minutes in seconds
  const [commandInput, setCommandInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<
    { type: 'input' | 'output' | 'system'; text: string }[]
  >([
    {
      type: 'system',
      text: 'AUTHORIZED TRAINING ENVIRONMENT ONLY — EPHEMERAL SANDBOX v1.4\nOutbound internet is blocked by kernel network policy. All actions recorded in immutable audit log.\nTarget Subnet: 10.10.12.0/24 (Private Bridge)\nType "help" to view available diagnostic and security tools.\n',
    },
  ]);

  // Track verified task steps
  const [completedTasks, setCompletedTasks] = useState<{
    reconCompleted: boolean;
    logAnalyzed: boolean;
    suidDiscovered: boolean;
    flagCaptured: boolean;
  }>({
    reconCompleted: false,
    logAnalyzed: false,
    suidDiscovered: false,
    flagCaptured: false,
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Timer countdown
  useEffect(() => {
    if (!sessionActive || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionActive, timeRemaining]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExecuteCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    // Echo input command
    const newHistory = [...terminalHistory, { type: 'input' as const, text: `student@cyberpath-sandbox:~$ ${cmd}` }];

    const lowerCmd = cmd.toLowerCase();

    // Command Dispatcher
    if (lowerCmd === 'clear') {
      setTerminalHistory([]);
      setCommandInput('');
      return;
    } else if (lowerCmd === 'help') {
      newHistory.push({
        type: 'output',
        text: `AVAILABLE AUDITED COMMANDS:
  nmap [flags] <target>       - Network port scanner (e.g. nmap -sS -Pn 10.10.12.55)
  cat <filepath>              - Inspect file content (e.g. cat /var/log/auth.log)
  grep [pattern] <filepath>   - Search text streams (e.g. grep "Failed" /var/log/auth.log)
  find [path] [flags]         - Search filesystem (e.g. find / -perm -4000 2>/dev/null)
  ls -la [path]               - List directory permissions and file owners
  whoami / id                 - Inspect current UID and EUID execution credentials
  uname -a                    - Inspect Linux kernel build and architecture
  netstat -tlpn               - List local listening TCP sockets
  /opt/backup/archive_tool    - Execute isolated staging utility
  clear                       - Clear terminal screen
  help                        - Show this manual`,
      });
    } else if (lowerCmd.includes('nmap')) {
      newHistory.push({
        type: 'output',
        text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-15 00:30 UTC
Nmap scan report for gateway.cyberpath.internal (10.10.12.55)
Host is up (0.00042s latency).
Not shown: 997 filtered tcp ports (no-response)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    nginx 1.18.0 (Ubuntu)
8080/tcp open  http-proxy Administrative Web Gateway
MAC Address: 02:42:0A:0A:0C:37 (Docker Virtual Interface)

Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds`,
      });
      setCompletedTasks((prev) => ({ ...prev, reconCompleted: true }));
    } else if (lowerCmd.includes('grep') && lowerCmd.includes('auth.log')) {
      newHistory.push({
        type: 'output',
        text: `Mar 15 00:12:01 sandbox sshd[4201]: Failed password for invalid user admin from 192.168.4.102 port 54102 ssh2
Mar 15 00:12:03 sandbox sshd[4204]: Failed password for invalid user root from 192.168.4.102 port 54104 ssh2
Mar 15 00:12:05 sandbox sshd[4207]: Failed password for invalid user test from 192.168.4.102 port 54106 ssh2
Mar 15 00:12:08 sandbox sshd[4211]: Failed password for student from 192.168.4.102 port 54110 ssh2
[ALERT: 18 consecutive failed authentications detected within 45 seconds from single source IP: 192.168.4.102]`,
      });
      setCompletedTasks((prev) => ({ ...prev, logAnalyzed: true }));
    } else if (lowerCmd.includes('cat') && lowerCmd.includes('auth.log')) {
      newHistory.push({
        type: 'output',
        text: `Mar 15 00:10:14 sandbox systemd[1]: Started Daily apt download activities.
Mar 15 00:11:45 sandbox sshd[3998]: Accepted publickey for student from 10.10.12.1 port 48902 ssh2
Mar 15 00:12:01 sandbox sshd[4201]: Failed password for invalid user admin from 192.168.4.102 port 54102 ssh2
Mar 15 00:12:03 sandbox sshd[4204]: Failed password for invalid user root from 192.168.4.102 port 54104 ssh2
Mar 15 00:13:00 sandbox sudo[4312]: student : TTY=pts/0 ; PWD=/home/student ; USER=root ; COMMAND=/usr/bin/uptime`,
      });
      setCompletedTasks((prev) => ({ ...prev, logAnalyzed: true }));
    } else if (lowerCmd.includes('find') && lowerCmd.includes('4000')) {
      newHistory.push({
        type: 'output',
        text: `/usr/bin/passwd
/usr/bin/chfn
/usr/bin/sudo
/opt/backup/archive_tool  [ALERT: Non-standard SUID binary detected in /opt/backup/ owned by root]`,
      });
      setCompletedTasks((prev) => ({ ...prev, suidDiscovered: true }));
    } else if (lowerCmd.includes('ls') && lowerCmd.includes('/opt/backup')) {
      newHistory.push({
        type: 'output',
        text: `total 148
drwxr-xr-x 2 root root   4096 Mar 15 00:05 .
drwxr-xr-x 3 root root   4096 Mar 15 00:04 ..
-rwsr-xr-x 1 root root 141208 Mar 15 00:05 archive_tool
-rw-r--r-- 1 root root    284 Mar 15 00:05 README.txt`,
      });
    } else if (lowerCmd.includes('archive_tool')) {
      newHistory.push({
        type: 'output',
        text: `[CYBERPATH LAB SUITE] Executing archive_tool with EUID=0 (root)...
Verifying filesystem permissions integrity...
AUDIT SUCCESS: SUID privilege escalation scenario solved!
CAPTURED FLAG: CYBERPATH{su1d_pr1v_3sc4l4t10n_m4st3r}`,
      });
      setCompletedTasks((prev) => ({ ...prev, flagCaptured: true }));
      if (onLabVerified) onLabVerified('lab-suid-01');
    } else if (lowerCmd === 'whoami') {
      newHistory.push({ type: 'output', text: 'student' });
    } else if (lowerCmd === 'id') {
      newHistory.push({
        type: 'output',
        text: 'uid=1001(student) gid=1001(student) groups=1001(student),27(sudo)',
      });
    } else if (lowerCmd.includes('uname')) {
      newHistory.push({
        type: 'output',
        text: 'Linux cyberpath-sandbox-node01 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 x86_64 GNU/Linux',
      });
    } else if (lowerCmd.includes('netstat')) {
      newHistory.push({
        type: 'output',
        text: `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      812/sshd: /usr/sbin 
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      940/mysqld          
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      1014/python3        `,
      });
    } else {
      newHistory.push({
        type: 'output',
        text: `bash: ${cmd}: command not recognized in restricted lab environment. Type "help" for allowed utilities.`,
      });
    }

    setTerminalHistory(newHistory);
    setCommandInput('');
  };

  const handleResetEnvironment = () => {
    setTimeRemaining(1800);
    setTerminalHistory([
      {
        type: 'system',
        text: 'EPHEMERAL LAB RESET COMPLETE. Clean container image restored. Target subnet: 10.10.12.0/24.',
      },
    ]);
    setCompletedTasks({
      reconCompleted: false,
      logAnalyzed: false,
      suidDiscovered: false,
      flagCaptured: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Authorized Training Notice Banner (MANDATORY REQUIREMENT) */}
      <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <div className="font-bold text-emerald-300 font-mono tracking-wide">
              AUTHORIZED TRAINING ENVIRONMENT ONLY
            </div>
            <div className="text-slate-300 text-[11px] mt-0.5">
              Strictly isolated container network. Outbound internet is disabled. Attacks against external assets are prohibited.
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>TTL: {formatTimer(timeRemaining)}</span>
          </div>

          <button
            onClick={handleResetEnvironment}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Reset Container to Fresh State"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Lab Interface Grid: Terminal on Left, Verification Checklist on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Terminal Sandbox (3 cols) */}
        <div className="lg:col-span-3 rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl flex flex-col h-[560px]">
          {/* Terminal Window Header */}
          <div className="px-4 py-2.5 bg-[#161b22] border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-slate-300 font-semibold">student@cyberpath-sandbox:~ (bash)</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-emerald-400">STATUS: CONNECTED</span>
              <span>PORT: 22 (SSH)</span>
            </div>
          </div>

          {/* Terminal Output Body */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 text-slate-300 scrollbar-thin scrollbar-thumb-slate-800">
            {terminalHistory.map((item, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap leading-relaxed ${
                  item.type === 'system'
                    ? 'text-cyan-400 bg-slate-900/60 p-2.5 rounded border border-slate-800'
                    : item.type === 'input'
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-300'
                }`}
              >
                {item.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Command Input Line */}
          <form
            onSubmit={handleExecuteCommand}
            className="p-3 bg-[#161b22] border-t border-slate-800 flex items-center space-x-2"
          >
            <span className="text-emerald-400 font-mono text-xs font-bold">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Enter command (e.g. nmap -sS 10.10.12.55, help, find / -perm -4000)..."
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600"
              autoFocus
              id="terminal-input"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
            >
              Send
            </button>
          </form>
        </div>

        {/* Right Column: Lab Checklist & Container Telemetry */}
        <div className="lg:col-span-1 space-y-4">
          {/* Verified Objectives */}
          <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
              Lab Objectives Checklist
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    completedTasks.reconCompleted ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <div>
                  <div className={`font-semibold ${completedTasks.reconCompleted ? 'text-white' : 'text-slate-400'}`}>
                    1. Network Reconnaissance
                  </div>
                  <div className="text-[11px] text-slate-500">Scan gateway IP via Nmap.</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    completedTasks.logAnalyzed ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <div>
                  <div className={`font-semibold ${completedTasks.logAnalyzed ? 'text-white' : 'text-slate-400'}`}>
                    2. Auth Log Triage
                  </div>
                  <div className="text-[11px] text-slate-500">Inspect failed logins in auth.log.</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    completedTasks.suidDiscovered ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <div>
                  <div className={`font-semibold ${completedTasks.suidDiscovered ? 'text-white' : 'text-slate-400'}`}>
                    3. Locate SUID Binaries
                  </div>
                  <div className="text-[11px] text-slate-500">Audit octal 4000 binaries.</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    completedTasks.flagCaptured ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <div>
                  <div className={`font-semibold ${completedTasks.flagCaptured ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                    4. Capture Proof Flag
                  </div>
                  <div className="text-[11px] text-slate-500">Execute verified exploit path.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sandboxed Container Resource Quotas */}
          <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">
              Container Constraints
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>CPU Quota:</span>
              </span>
              <span>0.5 vCPU</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Memory Limit:</span>
              </span>
              <span>256 MB (cgroups)</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <Network className="w-3.5 h-3.5" />
                <span>Internet Egress:</span>
              </span>
              <span className="text-rose-400 font-bold">DISABLED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
