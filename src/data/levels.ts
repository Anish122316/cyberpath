import { LevelCurriculum } from '../types';

export const CURRICULUM_LEVELS: LevelCurriculum[] = [
  {
    levelNumber: 0,
    title: 'Cybersecurity Beginner',
    codename: 'INIT_ZERO',
    description: 'Security mindsets, threat landscapes, ethical boundaries, and the foundational rules of authorized security research.',
    requiredStarsToUnlock: 0,
    badgeName: 'Ethical Foundations',
    skillsTaught: ['Security Ethics', 'Threat Landscape', 'Authorization Rules'],
    lessons: [
      {
        id: 'lvl0-lesson1',
        levelId: 0,
        title: 'The Hacker Mindset & Ethical Boundaries',
        estimatedMinutes: 12,
        difficulty: 'Beginner',
        objectives: [
          'Distinguish White Hat, Black Hat, and Grey Hat activities under international cyber laws (CFAA, Computer Misuse Act).',
          'Understand Rules of Engagement (RoE) and explicit written authorization.',
          'Define the core duty of responsible disclosure.'
        ],
        theoryMarkdown: `### The Ethical Imperative in Information Security

In cybersecurity, the technical capability to locate a vulnerability must always be paired with **explicit, lawful authorization**. Practicing security outside authorized boundaries transforms research into an unauthorized access crime under statutes such as the United States Computer Fraud and Abuse Act (CFAA) or the UK Computer Misuse Act.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                 AUTHORIZED DEFENSE BOUNDARY                 │
│                                                             │
│  [Explicit Written Scope] ──► [Safe Sandbox] ──► [Fix Flaw] │
│                                                             │
│   ATTACKS AGAINST NON-OWNED ASSETS WITHOUT PERMISSION ARE   │
│                   STRICTLY PROHIBITED                       │
└─────────────────────────────────────────────────────────────┘
\`\`\`

#### Rules of Engagement (RoE)
Every penetration test or red team exercise requires a signed Rules of Engagement document defining:
1. **Target Scope:** Explicit IP subnets, domains, or container hostnames.
2. **Out of Scope Assets:** Production databases, third-party cloud infrastructure, employee personal devices.
3. **Execution Windows:** Permitted times to avoid disrupting business continuity.
4. **Emergency Contact & Abort Procedures:** Protocols to immediately cease testing if unexpected instability occurs.`,
        keyTakeaways: [
          'Authorization is legal and binary: you either have explicit signed permission or you do not.',
          'Safe sandbox training enables risk-free offensive comprehension to build indestructible defenses.',
          'Responsible disclosure gives defenders time to patch before public notice.'
        ],
        interviewAngle: 'Interviewers will ask: "If you find a high-severity flaw in a production system outside your test scope, what do you do?" Correct answer: Halt, document the finding factually without exploiting further, and notify the designated security point of contact immediately.',
        quiz: [
          {
            id: 'q0-1',
            difficulty: 'Basic',
            question: 'What differentiates authorized penetration testing from malicious hacking?',
            options: [
              'The specific tools used (e.g. Nmap vs Wireshark)',
              'Explicit, documented authorization and defined scope from the system owner',
              'Whether the tester is on a VPN or public Wi-Fi',
              'The operating system being used by the analyst'
            ],
            correctIndex: 1,
            explanation: 'Authorization is the sole legal and ethical demarcation. Both defenders and attackers often use identical scanning and enumeration tools.',
            skillId: 'fundamentals'
          },
          {
            id: 'q0-2',
            difficulty: 'Intermediate',
            question: 'During a penetration test, you discover an unpatched critical remote code execution vulnerability on an IP not listed in your signed Statement of Work. What is the correct action?',
            options: [
              'Immediately exploit the vulnerability to verify if it affects your client',
              'Pause testing on that target, document the IP factually, and notify the primary point of contact immediately',
              'Scan the entire /16 subnet to see how widespread the vulnerability is',
              'Publicly tweet the finding as a zero-day advisory'
            ],
            correctIndex: 1,
            explanation: 'Any action against out-of-scope targets is unauthorized access. The professional standard is to stop, document, and report to the designated engagement authority.',
            skillId: 'fundamentals'
          },
          {
            id: 'q0-3',
            difficulty: 'Advanced',
            question: 'Under Coordinated Vulnerability Disclosure (CVD), what is the primary objective of enforcing a standard notification window (e.g., 90 days) prior to public release?',
            options: [
              'Allowing the security researcher time to patent the exploit method',
              'Providing the vendor adequate time to develop, test, and distribute a secure remediation patch before adversaries can weaponize the bug',
              'Ensuring regulatory fines are collected by international authorities',
              'Forcing the vendor to pay a mandatory bounty fee'
            ],
            correctIndex: 1,
            explanation: 'Coordinated disclosure balances public transparency with end-user safety by giving developers a bounded window to engineer and deploy security patches.',
            skillId: 'fundamentals'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 1,
    title: 'Computer & Internet Fundamentals',
    codename: 'HOST_FABRIC',
    description: 'Operating system architectures, process lifecycles, memory layout, and the mechanics of packet transport across the internet.',
    requiredStarsToUnlock: 1,
    badgeName: 'System Fabric',
    skillsTaught: ['OS Architecture', 'Process Lifecycle', 'Data Transport'],
    lessons: [
      {
        id: 'lvl1-lesson1',
        levelId: 1,
        title: 'CPU, Memory Management & Privilege Rings',
        estimatedMinutes: 15,
        difficulty: 'Beginner',
        objectives: [
          'Understand User Space (Ring 3) vs Kernel Space (Ring 0).',
          'Trace how system calls (syscalls) transition execution privileges.',
          'Analyze stack vs heap memory segmentation.'
        ],
        theoryMarkdown: `### Hardware Privilege Rings & Isolation

Modern processors enforce security boundaries via hardware privilege levels known as **Rings**:

\`\`\`
       Ring 3: User Applications (Browsers, Text Editors, Shells)
         │
         ▼  [System Call: e.g. read(), write(), fork()]
       Ring 0: Operating System Kernel (Hardware Drivers, Memory Control)
\`\`\`

When a user process crashes, the hardware boundary prevents it from corrupting kernel space or accessing memory belonging to neighboring processes. Malicious privilege escalation vulnerabilities occur when an attacker forces the kernel to execute arbitrary code within Ring 0.`,
        keyTakeaways: [
          'Kernel space has unrestricted access to hardware memory and instructions.',
          'User space applications must ask the kernel for I/O via system calls.',
          'Privilege escalation is the attacker goal of breaking Ring 3 isolation into Ring 0.'
        ],
        interviewAngle: 'Why is Ring 0 vs Ring 3 isolation critical to multi-tenant cloud and container security?',
        quiz: [
          {
            id: 'q1-1',
            difficulty: 'Basic',
            question: 'Which privilege ring executes the operating system kernel with full hardware access on x86 architectures?',
            options: ['Ring 3', 'Ring 2', 'Ring 1', 'Ring 0'],
            correctIndex: 3,
            explanation: 'Ring 0 is the most privileged execution level where the kernel manages raw memory and I/O.',
            skillId: 'fundamentals'
          },
          {
            id: 'q1-2',
            difficulty: 'Intermediate',
            question: 'In which memory segment is dynamic runtime memory allocated when a program calls malloc() in C, and what flaw occurs if freed memory is dereferenced later?',
            options: [
              'Stack segment; Stack Buffer Overflow',
              'Heap segment; Use-After-Free (UAF)',
              'BSS segment; Integer Underflow',
              'Text / Code segment; Race Condition'
            ],
            correctIndex: 1,
            explanation: 'malloc() dynamically allocates blocks on the Heap. Dereferencing a pointer to memory that has already been deallocated creates a Use-After-Free vulnerability.',
            skillId: 'fundamentals'
          },
          {
            id: 'q1-3',
            difficulty: 'Advanced',
            question: 'How does Address Space Layout Randomization (ASLR) defend against Return-Oriented Programming (ROP), and what is required to defeat it?',
            options: [
              'It encrypts all network packets; it is defeated by capturing pre-master secrets',
              'It randomizes memory base offsets of the stack, heap, and libraries; an attacker typically requires an information disclosure memory leak to compute gadget offsets',
              'It makes the stack non-executable; an attacker defeats it by disabling CPU interrupts',
              'It sandboxes all child threads into isolated containers'
            ],
            correctIndex: 1,
            explanation: 'ASLR randomizes virtual address locations of executable code and libraries. Bypassing it generally requires an info-leak vulnerability to calculate the base address of loaded modules.',
            skillId: 'fundamentals'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 2,
    title: 'Networking Fundamentals',
    codename: 'PACKET_TRACE',
    description: 'TCP/IP layers, the 3-way handshake, subnetting, DNS hierarchy, ARP poisoning, and deep packet inspection.',
    requiredStarsToUnlock: 2,
    badgeName: 'Packet Architect',
    skillsTaught: ['TCP/IP Stack', 'DNS Protocol', 'Subnetting', 'Wireshark Analysis'],
    lessons: [
      {
        id: 'lvl2-lesson1',
        levelId: 2,
        title: 'TCP 3-Way Handshake & Connection Teardown',
        estimatedMinutes: 18,
        difficulty: 'Beginner',
        objectives: [
          'Inspect SYN, SYN-ACK, and ACK packet state transitions.',
          'Identify SYN flood Denial of Service mechanisms and SYN cookie defenses.',
          'Analyze RST and FIN teardown sequences.'
        ],
        theoryMarkdown: `### The Transmission Control Protocol (TCP) State Machine

TCP is a connection-oriented, reliable transport protocol. Before application payloads (like HTTP or TLS) transmit, both endpoints negotiate sequence numbers via the **3-Way Handshake**:

\`\`\`
Client (Initiator)                           Server (Listener: Port 443)
       │                                                │
       │─── 1. SYN [Seq = 1000] ───────────────────────►│  Server enters SYN_RECEIVED
       │                                                │  Allocates TCB buffer
       │◄── 2. SYN-ACK [Seq = 5000, Ack = 1001] ────────│
       │                                                │
       │─── 3. ACK [Seq = 1001, Ack = 5001] ───────────►│  ESTABLISHED state
\`\`\`

#### Security Implications: SYN Flooding
In a SYN Flood, an attacker sends thousands of spoofed SYN packets without sending the final ACK. The victim server holds half-open connections in its backlog queue until RAM is exhausted.
**Defense:** *SYN Cookies* encode connection parameters inside the initial sequence number without allocating kernel memory until the legitimate ACK arrives.`,
        keyTakeaways: [
          'TCP guarantees ordered delivery using 32-bit sequence numbers.',
          'Half-open states consume connection buffers, mitigated by SYN cookies.',
          'Packet inspection with tcpdump or Wireshark reveals TCP flag anomalies.'
        ],
        interviewAngle: 'Explain how you would diagnose whether a server drop in responsiveness is due to an active SYN flood using netstat/ss.',
        quiz: [
          {
            id: 'q2-1',
            difficulty: 'Basic',
            question: 'What flags are set on the second packet of a standard TCP connection establishment?',
            options: ['ACK only', 'SYN only', 'SYN and ACK', 'FIN and PSH'],
            correctIndex: 2,
            explanation: 'The server responds to the initial SYN with both SYN (to announce its own sequence number) and ACK (acknowledging the client sequence number).',
            skillId: 'networking'
          },
          {
            id: 'q2-2',
            difficulty: 'Intermediate',
            question: 'An enterprise network engineer allocates a subnet mask of 255.255.255.224 (/27). How many usable host IP addresses are available within this subnet?',
            options: ['32', '30', '28', '62'],
            correctIndex: 1,
            explanation: 'In a /27 subnet, there are 32 - 27 = 5 host bits. Total addresses = 2^5 = 32. Subtracting 2 (network ID and broadcast address) yields exactly 30 usable host IPs.',
            skillId: 'networking'
          },
          {
            id: 'q2-3',
            difficulty: 'Advanced',
            question: 'How does an adversary conduct an ARP Spoofing (Cache Poisoning) attack on an Ethernet switch, and which layer 2 security feature prevents it?',
            options: [
              'Flooding SYN packets to exhaust DHCP; prevented by BGP filtering',
              'Broadcasting unsolicited gratuitous ARP replies associating their MAC address with the gateway IP; prevented by Dynamic ARP Inspection (DAI) with DHCP Snooping',
              'Spoofing DNS MX records; prevented by DNSSEC',
              'Injecting BGP routes; prevented by RPKI validation'
            ],
            correctIndex: 1,
            explanation: 'ARP cache poisoning sends forged ARP responses mapping the attacker MAC to the default router IP. Enterprise switches mitigate this with Dynamic ARP Inspection (DAI) coupled with DHCP snooping bindings.',
            skillId: 'networking'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 3,
    title: 'Linux & Command Line Security',
    codename: 'SHELL_WARDEN',
    description: 'Unix filesystem structure, DAC permissions, SUID/SGID vulnerabilities, process monitoring, and audit log inspection.',
    requiredStarsToUnlock: 3,
    badgeName: 'Linux Sentinel',
    skillsTaught: ['Linux Permissions', 'SUID Audit', 'Log Analysis', 'Bash Automation'],
    lessons: [
      {
        id: 'lvl3-lesson1',
        levelId: 3,
        title: 'Linux Permissions, SUID Bits & GTFOBins',
        estimatedMinutes: 20,
        difficulty: 'Intermediate',
        objectives: [
          'Master octal and symbolic permission masks (e.g. 755, 644, 4755).',
          'Audit dangerous SUID/SGID binaries on root filesystems.',
          'Understand how misconfigured permissions lead to local privilege escalation.'
        ],
        theoryMarkdown: `### Discretionary Access Control (DAC) & Special Bits

Every file and directory in Linux has an owner, an assigned group, and three sets of permissions: **Read (4)**, **Write (2)**, and **Execute (1)**.

\`\`\`
-rwsr-xr-x 1 root root 88464 Mar 12 2026 /usr/bin/passwd
  ▲
  └── SUID Bit Enabled (Octal 4000)
\`\`\`

#### The Danger of SUID on Interpreters
When an executable has the **Set User ID (SUID)** bit set, it runs with the privileges of the *file owner* (often root) rather than the launching user.

If administrative utilities like \`find\`, \`vim\`, or \`python\` have SUID set incorrectly:
\`\`\`bash
# Finding all SUID binaries on a host:
find / -perm -4000 -type f 2>/dev/null

# If 'find' has SUID root, unprivileged users can execute arbitrary commands:
find . -exec /bin/sh -p \\; -quit
\`\`\``,
        keyTakeaways: [
          'SUID (4000) causes an executable to inherit the file owner privileges.',
          'Never place SUID bits on scripting engines or utilities with shell escape features.',
          'Use `chmod u-s /path/to/binary` to strip hazardous SUID permissions.'
        ],
        interviewAngle: 'How do you audit a Linux bastion host for unauthorized privilege escalation binaries?',
        quiz: [
          {
            id: 'q3-1',
            difficulty: 'Basic',
            question: 'What does an octal permission mode of 4755 indicate on a Linux binary owned by root?',
            options: [
              'The file is readable only by group members',
              'The file runs with root privileges (SUID) and is rwx for user, rx for group and others',
              'The file has the sticky bit set preventing deletion',
              'The file is encrypted with AES-256'
            ],
            correctIndex: 1,
            explanation: 'The leading digit 4 indicates the SUID bit is set, granting the executor the privileges of the owner (root in this case).',
            skillId: 'linux'
          },
          {
            id: 'q3-2',
            difficulty: 'Intermediate',
            question: 'Which Bash command reliably identifies all files across the filesystem with world-writable permissions while discarding permission errors?',
            options: [
              'find / -type f -perm -0002 2>/dev/null',
              'ls -la /world/writable',
              'chmod -R 777 / 2>&1',
              'grep -r "write" /etc/shadow'
            ],
            correctIndex: 0,
            explanation: '`find / -type f -perm -0002 2>/dev/null` tests for the other-write bit (-0002) and redirects stderr to /dev/null to silence access denials.',
            skillId: 'linux'
          },
          {
            id: 'q3-3',
            difficulty: 'Advanced',
            question: 'A system administrator schedules a root cron job executing `tar -czf /backup/archive.tar.gz *` inside a directory writable by normal users. How can an attacker achieve root privilege escalation?',
            options: [
              'Triggering an SSH brute-force attack against port 22',
              'Using Wildcard Injection by creating files named `--checkpoint=1` and `--checkpoint-action=exec=sh exploit.sh` to inject parameters into tar',
              'Deleting the /etc/passwd file directly',
              'Sending an ICMP ping to localhost'
            ],
            correctIndex: 1,
            explanation: 'When tar expands `*`, filenames starting with dashes are parsed as command-line arguments. Using checkpoint actions allows arbitrary shell execution under root.',
            skillId: 'linux'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 4,
    title: 'Applied Cryptography',
    codename: 'CORE_PRINCIPIA',
    description: 'The CIA Triad, cryptographic primitives, hashing algorithms, digital signatures, and AAA authentication principles.',
    requiredStarsToUnlock: 4,
    badgeName: 'Principia Shield',
    skillsTaught: ['CIA Triad', 'Cryptography', 'Hashing', 'Authentication'],
    lessons: [
      {
        id: 'lvl4-lesson1',
        levelId: 4,
        title: 'Cryptographic Hashing vs Symmetric vs Asymmetric Encryption',
        estimatedMinutes: 18,
        difficulty: 'Intermediate',
        objectives: [
          'Define the one-way mathematical property of cryptographic hash functions.',
          'Compare AES-GCM (symmetric) with RSA/ECC (asymmetric).',
          'Understand collision resistance and preimage resistance.'
        ],
        theoryMarkdown: `### Three Pillars of Modern Cryptography

\`\`\`
1. HASHING (One-Way)          2. SYMMETRIC (Shared Key)       3. ASYMMETRIC (Keypair)
   Plaintext ──► [SHA-256]       Plaintext ──► [AES-256] ──► Cipher   Plaintext ──► [Public Key]
         │                              ▲                                  │
         ▼                              │ Same Secret Key                  ▼ Ciphertext
   Fixed Digest (Hash)           Decrypted ◄── [AES-256]              Decrypted ◄── [Private Key]
\`\`\`

#### Salted Hashing for Credential Storage
Plain hashes (e.g. raw MD5 or SHA-1) are vulnerable to precomputed Rainbow Table attacks. Production systems must use slow, memory-hard key derivation functions like **Argon2id** or **bcrypt** with a cryptographically secure random salt per user.`,
        keyTakeaways: [
          'Hashing is irreversible; encryption is reversible with the correct key.',
          'Symmetric encryption (AES) is fast and ideal for bulk data at rest.',
          'Asymmetric encryption (RSA, Ed25519) solves key exchange and enables non-repudiation.'
        ],
        interviewAngle: 'Explain why MD5 or SHA-1 must never be used for password storage or digital certificates.',
        quiz: [
          {
            id: 'q4-1',
            difficulty: 'Basic',
            question: 'Which cryptographic mechanism provides non-repudiation and identity verification?',
            options: [
              'Base64 encoding',
              'Symmetric AES-CBC encryption',
              'Asymmetric Digital Signatures with Private Key signing and Public Key verification',
              'CRC32 checksums'
            ],
            correctIndex: 2,
            explanation: 'Because only the owner holds the private key, a valid digital signature proves the origin and integrity of the message (non-repudiation).',
            skillId: 'fundamentals'
          },
          {
            id: 'q4-2',
            difficulty: 'Intermediate',
            question: 'Why is the Electronic Codebook (ECB) cipher mode considered insecure for encrypting structured data or images?',
            options: [
              'It uses keys that are shorter than 64 bits',
              'Identical plaintext blocks produce identical ciphertext blocks, preserving visual and structural patterns',
              'It requires an internet connection to exchange initialization vectors',
              'It cannot be decrypted by standard CPU architectures'
            ],
            correctIndex: 1,
            explanation: 'In ECB mode, every 16-byte block of identical plaintext encrypts to identical ciphertext, completely leaking structural outlines (famously illustrated by the Linux Tux ECB penguin).',
            skillId: 'fundamentals'
          },
          {
            id: 'q4-3',
            difficulty: 'Advanced',
            question: 'In modern TLS 1.3 handshakes, how does Ephemeral Diffie-Hellman (ECDHE) achieve Perfect Forward Secrecy (PFS)?',
            options: [
              'By reusing a static server RSA private key for all client sessions',
              'By generating a distinct, temporary key pair for each session that is discarded after session termination, preventing historical decryption if long-term server keys are leaked later',
              'By utilizing pre-shared master keys hardcoded into root certificate authorities',
              'By requiring two-factor authentication tokens on every TLS socket'
            ],
            correctIndex: 1,
            explanation: 'PFS guarantees that even if a server private key is compromised in the future, past encrypted sessions cannot be decrypted because unique ephemeral keys were discarded.',
            skillId: 'fundamentals'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 5,
    title: 'Web Security & OWASP Top 10',
    codename: 'WEB_CITADEL',
    description: 'SQL Injection, Cross-Site Scripting (XSS), Insecure Direct Object References (IDOR), CSRF, and security header configurations.',
    requiredStarsToUnlock: 5,
    badgeName: 'AppSec Defender',
    skillsTaught: ['OWASP Top 10', 'SQLi Defense', 'XSS Prevention', 'IDOR Auditing'],
    lessons: [
      {
        id: 'lvl5-lesson1',
        levelId: 5,
        title: 'SQL Injection (SQLi) Deep Dive & Parameterized Queries',
        estimatedMinutes: 22,
        difficulty: 'Intermediate',
        objectives: [
          'Analyze classic in-band, blind, and time-based SQL injection.',
          'Differentiate parameterized queries from naive sanitization.',
          'Inspect database query plans under tainted input conditions.'
        ],
        theoryMarkdown: `### Anatomical Breakdown of SQL Injection

SQL Injection occurs when untrusted user input is concatenated directly into a database query string, allowing the input to break out of data context into code execution context.

\`\`\`sql
-- VULNERABLE CODE: Direct string concatenation
SELECT * FROM users WHERE username = 'admin' AND password = '' OR '1'='1';
-- The trailing ' OR '1'='1' evaluates to true for all rows, bypassing authentication!
\`\`\`

#### The Robust Remedy: Prepared Statements
Prepared statements separate SQL syntax from query parameters at the database protocol level.

\`\`\`typescript
// SECURE REMEDY: Parameterized Query
const query = 'SELECT id, email FROM users WHERE username = $1 AND password_hash = $2';
await db.query(query, [sanitizedUsername, hashedUserPassword]);
\`\`\`
In this secure implementation, even if the user passes \`' OR '1'='1\`, the database treats the entire input as an inert literal string value.`,
        keyTakeaways: [
          'Parameterized queries and ORM binding are the definitive defense against SQLi.',
          'Never rely on blacklist sanitization (e.g. stripping quotes); attackers bypass filters with alternative encodings.',
          'Always enforce least-privilege on database user roles.'
        ],
        interviewAngle: 'How does an Object-Relational Mapper (ORM) protect against SQLi, and when can raw query methods inside an ORM still leave you vulnerable?',
        quiz: [
          {
            id: 'q5-1',
            difficulty: 'Basic',
            question: 'What is the most effective defense against SQL injection in modern web applications?',
            options: [
              'Converting all user input to uppercase',
              'Parameterized queries (prepared statements)',
              'Storing passwords in plain text',
              'Filtering out the word "SELECT" with regular expressions'
            ],
            correctIndex: 1,
            explanation: 'Parameterized queries ensure user input is parsed strictly as data, never as executable SQL instructions.',
            skillId: 'web-security'
          },
          {
            id: 'q5-2',
            difficulty: 'Intermediate',
            question: 'Which HTTP cookie attribute prevents client-side JavaScript from reading sensitive session authentication tokens during an XSS exploit?',
            options: ['Secure', 'SameSite=Lax', 'HttpOnly', 'Domain'],
            correctIndex: 2,
            explanation: 'The `HttpOnly` flag instructs the browser that the cookie must not be accessible through DOM APIs like `document.cookie`, mitigating credential theft via XSS.',
            skillId: 'web-security'
          },
          {
            id: 'q5-3',
            difficulty: 'Advanced',
            question: 'A web app accepts an image URL parameter and fetches it on the server: `GET /view?img=http://target.com/a.png`. An attacker submits `http://169.254.169.254/latest/meta-data/`. What vulnerability is this, and what is the primary defense?',
            options: [
              'Cross-Site Scripting (XSS); sanitize HTML entities',
              'Server-Side Request Forgery (SSRF); enforce IP whitelisting, validate DNS resolution against private RFC 1918/link-local ranges, and enforce IMDSv2',
              'Local File Inclusion (LFI); use basename()',
              'Clickjacking; add X-Frame-Options headers'
            ],
            correctIndex: 1,
            explanation: 'This is Server-Side Request Forgery (SSRF). The server is coerced into making backend requests to internal addresses. Mitigate by validating resolved IPs and migrating to IMDSv2.',
            skillId: 'web-security'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 6,
    title: 'SOC & Blue Team Operations',
    codename: 'BLUE_FORTRESS',
    description: 'SIEM architectures, Syslog parsing, Windows Event ID analysis, alert triage, threat intelligence, and MITRE ATT&CK mapping.',
    requiredStarsToUnlock: 6,
    badgeName: 'SOC Guardian',
    skillsTaught: ['SIEM / Log Analysis', 'Alert Triage', 'Windows Event Logs', 'MITRE ATT&CK'],
    lessons: [
      {
        id: 'lvl6-lesson1',
        levelId: 6,
        title: 'Triage Fundamentals & Critical Windows Event IDs',
        estimatedMinutes: 20,
        difficulty: 'Intermediate',
        objectives: [
          'Memorize essential Windows Event IDs (4624, 4625, 4688, 4720, 7045).',
          'Distinguish Logon Type 2 (Interactive) from Logon Type 3 (Network) and Logon Type 10 (RDP).',
          'Perform baseline triage for credential stuffing vs lateral movement.'
        ],
        theoryMarkdown: `### Critical Windows Event Log IDs for Blue Team Triage

\`\`\`
Event ID 4625: An account failed to log on (High frequency indicates brute-force or spraying)
Event ID 4624: An account was successfully logged on (Check LogonType & Source IP)
Event ID 4688: A new process has been created (Crucial for command-line auditing)
Event ID 4720: A user account was created (Persistence indicator)
Event ID 7045: A new service was installed in the system (Common persistence vector)
\`\`\`

#### Logon Types Matrix
* **Logon Type 2 (Interactive):** Physical keyboard or direct console logon.
* **Logon Type 3 (Network):** SMB share access, RPC, or remote authentication without GUI.
* **Logon Type 10 (RemoteInteractive):** Remote Desktop Protocol (RDP) session. Detect unexpected inbound RDP from external IPs immediately.`,
        keyTakeaways: [
          'Event ID 4625 clusters point to authentication attacks.',
          'Event ID 4688 with command line logging enabled catches encoded PowerShell and execution scripts.',
          'Correlating logon types eliminates false positives during shift triage.'
        ],
        interviewAngle: 'Walk me through how you investigate 50 failed logons (4625) followed by a successful logon (4624) on a domain controller.',
        quiz: [
          {
            id: 'q6-1',
            difficulty: 'Basic',
            question: 'Which Windows Event ID records a new process creation, essential for tracking malicious command execution?',
            options: ['Event ID 4624', 'Event ID 4688', 'Event ID 1102', 'Event ID 4738'],
            correctIndex: 1,
            explanation: 'Event ID 4688 tracks process creation and, when audit policies are configured, logs the full process command line.',
            skillId: 'blue-team'
          },
          {
            id: 'q6-2',
            difficulty: 'Intermediate',
            question: 'When analyzing proxy logs in a SIEM, you observe an internal host generating small HTTP POST requests to an unknown offshore IP every 60 seconds with 5% jitter. What behavior does this reflect?',
            options: [
              'Scheduled Windows Update synchronization',
              'Command and Control (C2) agent heartbeat / beaconing',
              'Normal NTP clock drift correction',
              'Peer-to-peer torrent file distribution'
            ],
            correctIndex: 1,
            explanation: 'Malware implants use recurring check-in intervals (beaconing) with minor jitter variations to query their command server for pending task queues.',
            skillId: 'blue-team'
          },
          {
            id: 'q6-3',
            difficulty: 'Advanced',
            question: 'In Sysmon telemetry, what does Event ID 8 (CreateRemoteThread) signal to a threat hunting analyst?',
            options: [
              'A standard user opened a tab in Microsoft Edge',
              'Process Injection, where one process spawns a thread inside the virtual address space of another running process (e.g. injecting shellcode into svchost.exe or explorer.exe)',
              'A network socket was closed by the firewall',
              'A new USB thumb drive was mounted'
            ],
            correctIndex: 1,
            explanation: 'Sysmon Event ID 8 identifies CreateRemoteThread calls, which adversaries use to inject malicious code into legitimate processes to evade detection and inherit access privileges.',
            skillId: 'blue-team'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 7,
    title: 'Ethical Hacking & Red Team',
    codename: 'RED_VANGUARD',
    description: 'Passive & active reconnaissance, Nmap scanning strategies, service enumeration, vulnerability verification, and report authoring.',
    requiredStarsToUnlock: 7,
    badgeName: 'Red Operator',
    skillsTaught: ['Reconnaissance', 'Nmap Scanning', 'Vulnerability Assessment', 'Report Writing'],
    lessons: [
      {
        id: 'lvl7-lesson1',
        levelId: 7,
        title: 'Nmap Scanning Techniques & TCP Packet Timing',
        estimatedMinutes: 20,
        difficulty: 'Advanced',
        objectives: [
          'Differentiate TCP SYN Scan (-sS) from TCP Connect Scan (-sT).',
          'Understand timing templates (-T0 Paranoid to -T4 Aggressive).',
          'Interpret filtered vs closed vs open port responses.'
        ],
        theoryMarkdown: `### Nmap Scanning Mechanics

\`\`\`bash
# Stealth SYN Scan with Version Detection and Safe Default Scripts:
nmap -sS -sV -sC -p- -T4 --open 10.10.10.45
\`\`\`

#### Port States Explained
* **Open:** Target replied with \`SYN-ACK\`. Service is listening.
* **Closed:** Target replied with \`RST-ACK\`. Host is alive, but no process is bound to the port.
* **Filtered:** No response received within timeout or received an ICMP unreachable error (Type 3 Code 1, 2, 3, 9, 10, 13). An inline firewall is dropping probes.`,
        keyTakeaways: [
          'SYN stealth scans (-sS) do not complete the 3-way handshake, reducing application-layer logs.',
          'Service version scanning (-sV) probes banners to identify vulnerable software revisions.',
          'Always conduct scans exclusively against in-scope addresses specified in your engagement contract.'
        ],
        interviewAngle: 'What is the difference between a port showing as "closed" versus "filtered" in an Nmap audit?',
        quiz: [
          {
            id: 'q7-1',
            difficulty: 'Basic',
            question: 'Why is an Nmap TCP SYN scan (-sS) considered stealthier than a TCP Connect scan (-sT)?',
            options: [
              'It bypasses all hardware firewalls automatically',
              'It does not complete the full TCP 3-way handshake and sends a RST before establishing a session',
              'It encrypts packets using SSH tunnels',
              'It scans through the Tor network'
            ],
            correctIndex: 1,
            explanation: 'The scanner sends a RST immediately upon receiving SYN-ACK, tearing down the half-open state before application-layer logging triggers on many servers.',
            skillId: 'red-team'
          },
          {
            id: 'q7-2',
            difficulty: 'Intermediate',
            question: 'Why do offensive operators and penetration testers generally prefer Reverse Shells over Bind Shells in enterprise environments?',
            options: [
              'Reverse shells execute with root privileges automatically',
              'Reverse shells initiate outbound connections from the target to the listener, bypassing typical inbound perimeter firewall and NAT restrictions',
              'Bind shells require no listening port on the attacker system',
              'Reverse shells encrypt all payloads using quantum algorithms'
            ],
            correctIndex: 1,
            explanation: 'Corporate firewalls almost universally block unsolicited inbound connection attempts to internal IPs (defeating bind shells), while permitting outbound traffic on common ports like 443 or 53.',
            skillId: 'red-team'
          },
          {
            id: 'q7-3',
            difficulty: 'Advanced',
            question: 'In an internal Windows domain penetration test, how does an attacker execute an SMB Relay attack without needing to crack the intercepted NTLMv2 hash?',
            options: [
              'By decrypting the Kerberos master secret with mimikatz',
              'By capturing authentication requests coerced via LLMNR/NetBIOS poisoning and replaying them to target machines where SMB Signing is disabled',
              'By sending malicious ICMP packets to the domain controller',
              'By rewriting DNS A records on root name servers'
            ],
            correctIndex: 1,
            explanation: 'If SMB Signing is not enforced on workstations, intercepted authentication attempts can be relayed directly to another machine to execute commands under the relayed user privileges.',
            skillId: 'red-team'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 8,
    title: 'Digital Forensics & Incident Response (DFIR)',
    codename: 'FORENSIC_CORE',
    description: 'Evidence preservation, chain of custody, Volatility memory analysis, disk imaging, and timeline reconstruction.',
    requiredStarsToUnlock: 8,
    badgeName: 'Forensic Investigator',
    skillsTaught: ['Chain of Custody', 'Memory Forensics', 'Disk Forensics', 'Timeline Analysis'],
    lessons: [
      {
        id: 'lvl8-lesson1',
        levelId: 8,
        title: 'Order of Volatility & Chain of Custody Integrity',
        estimatedMinutes: 22,
        difficulty: 'Advanced',
        objectives: [
          'Apply RFC 3227 Order of Volatility in live system triage.',
          'Calculate SHA-256 cryptographic hashes before and after disk acquisition.',
          'Document admissible chain of custody records.'
        ],
        theoryMarkdown: `### RFC 3227 Order of Volatility

When responding to an active intrusion, volatile evidence disappears if power is cut. Forensicators collect evidence in order of least to most persistent:

\`\`\`
1. CPU Registers & Cache (Disappears in nanoseconds)
2. Routing tables, ARP cache, process table, kernel memory
3. RAM (Random Access Memory)
4. Temporary file systems & swap space
5. Hard drives and non-volatile storage
6. Remote logging data & archival backups
\`\`\`

#### Cryptographic Hash Verification
Before examining a forensic disk image (\`.E01\` or raw \`.dd\`), calculate the hash:
\`\`\`bash
sha256sum forensic_evidence_image.dd > hash_baseline.txt
\`\`\`
Any variation in the hash indicates evidence contamination, rendering it inadmissible in legal proceedings.`,
        keyTakeaways: [
          'RAM collection must precede pulling the power cable.',
          'Never inspect original media directly; always work from bit-for-bit forensic copies.',
          'Chain of custody tracks every individual who handles evidence.'
        ],
        interviewAngle: 'An employee laptop is suspected of hosting active malware. Outline your first three steps upon physical arrival.',
        quiz: [
          {
            id: 'q8-1',
            difficulty: 'Basic',
            question: 'According to RFC 3227, which type of data should be captured earliest during an incident response collection?',
            options: [
              'Archival tape backups',
              'System RAM and active process memory',
              'Old web browser bookmarks',
              'Printed system documentation'
            ],
            correctIndex: 1,
            explanation: 'RAM is volatile and lost immediately upon shutdown or reboot, making its timely capture critical.',
            skillId: 'blue-team'
          },
          {
            id: 'q8-2',
            difficulty: 'Intermediate',
            question: 'What is the primary forensic purpose of generating SHA-256 cryptographic hashes immediately after disk acquisition and verifying them prior to examination?',
            options: [
              'To speed up the disk cloning speed across USB-C cables',
              'To establish and prove data integrity and non-tampering for legal admissibility in court',
              'To automatically remove malware and rootkits from the image',
              'To compress the disk image file size by 50%'
            ],
            correctIndex: 1,
            explanation: 'Cryptographic hashing provides mathematical proof that evidence has remained untouched and unmodified throughout the forensic lifecycle.',
            skillId: 'blue-team'
          },
          {
            id: 'q8-3',
            difficulty: 'Advanced',
            question: 'During memory analysis of a suspicious Windows endpoint using Volatility 3, which plugin inspects Virtual Address Descriptors (VAD) to locate injected, unmapped executable memory regions marked PAGE_EXECUTE_READWRITE?',
            options: ['windows.pslist', 'windows.malfind', 'windows.netstat', 'windows.registry.hivelist'],
            correctIndex: 1,
            explanation: 'The `windows.malfind` plugin scans for memory allocations with RWX permissions that do not map to legitimate binary files on disk, pinpointing injected shellcode and reflective DLLs.',
            skillId: 'blue-team'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 9,
    title: 'Cloud Security Architecture',
    codename: 'CLOUD_BASTION',
    description: 'Shared responsibility models, IAM least privilege, S3 bucket misconfigurations, metadata SSRF (IMDSv2), and cloud auditing.',
    requiredStarsToUnlock: 9,
    badgeName: 'Cloud Guardian',
    skillsTaught: ['Cloud IAM', 'S3 Security', 'IMDSv2 Defense', 'CloudTrail Auditing'],
    lessons: [
      {
        id: 'lvl9-lesson1',
        levelId: 9,
        title: 'AWS/GCP IAM Least Privilege & Instance Metadata Security',
        estimatedMinutes: 20,
        difficulty: 'Advanced',
        objectives: [
          'Analyze role assumption and temporary token leakage.',
          'Understand SSRF attacks targeting the 169.254.169.254 metadata service.',
          'Configure session token enforcement via IMDSv2.'
        ],
        theoryMarkdown: `### The 169.254.169.254 Instance Metadata Vector

In cloud environments, compute instances query a link-local address (\`169.254.169.254\`) to retrieve temporary IAM role credentials.

\`\`\`
Attacker ──► [SSRF Bug in Web App] ──► Queries http://169.254.169.254/latest/meta-data/iam/security-credentials/
                                               │
                                               ▼
Attacker receives SecretAccessKey & SessionToken, gaining cloud permissions!
\`\`\`

#### IMDSv2 Remedy
IMDSv2 requires an HTTP \`PUT\` request with a custom header to retrieve a session token before accessing metadata. Web applications vulnerable to simple GET-based SSRF cannot forge this multi-step token handshake.`,
        keyTakeaways: [
          'Enforce IMDSv2 and disable IMDSv1 across all cloud VM workloads.',
          'Follow least-privilege: never attach AdministratorAccess to compute roles.',
          'Monitor CloudTrail / Audit Logs for anomalous STS AssumeRole events.'
        ],
        interviewAngle: 'Explain how Server-Side Request Forgery (SSRF) was leveraged in the Capital One cloud breach.',
        quiz: [
          {
            id: 'q9-1',
            difficulty: 'Basic',
            question: 'What link-local IP address provides the Instance Metadata Service in AWS, GCP, and Azure VMs?',
            options: ['192.168.1.1', '127.0.0.1', '169.254.169.254', '10.0.0.1'],
            correctIndex: 2,
            explanation: '169.254.169.254 is the standardized link-local IPv4 address for hypervisor instance metadata services.',
            skillId: 'cloud'
          },
          {
            id: 'q9-2',
            difficulty: 'Intermediate',
            question: 'Under the Cloud Shared Responsibility Model for an IaaS virtual machine (e.g. AWS EC2), what is the sole responsibility of the cloud customer?',
            options: [
              'Physical datacenter security and HVAC cooling',
              'Hypervisor hardware firmware patching',
              'Guest operating system security updates, local firewall rules, and IAM access policies',
              'Destruction of decommissioned server hard drives'
            ],
            correctIndex: 2,
            explanation: 'In IaaS, the cloud provider manages infrastructure and physical hardware; the customer is responsible for guest OS configuration, firewalling, software updates, and IAM policies.',
            skillId: 'cloud'
          },
          {
            id: 'q9-3',
            difficulty: 'Advanced',
            question: 'Why does enforcing AWS IMDSv2 (Instance Metadata Service v2) protect against standard SSRF exploits that easily bypass IMDSv1?',
            options: [
              'IMDSv2 requires biometric user confirmation',
              'IMDSv2 requires a session-oriented HTTP PUT request with a custom header to obtain a temporary token before querying data, defeating simple GET-based SSRF',
              'IMDSv2 runs only on IPv6 addresses',
              'IMDSv2 disables IAM role attachments completely'
            ],
            correctIndex: 1,
            explanation: 'IMDSv2 replaces simple HTTP GET queries with a token-based flow requiring `X-aws-ec2-metadata-token-ttl-seconds` in a PUT request, which simple SSRF vulnerabilities cannot forge.',
            skillId: 'cloud'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 10,
    title: 'Advanced Threat Tactics & Active Directory',
    codename: 'APEX_RESOLVE',
    description: 'Active Directory Kerberoasting, Golden Tickets, Zero Trust network architectures, and defensive hardening.',
    requiredStarsToUnlock: 10,
    badgeName: 'Apex Warden',
    skillsTaught: ['Active Directory Security', 'Kerberoasting', 'Zero Trust Architecture'],
    lessons: [
      {
        id: 'lvl10-lesson1',
        levelId: 10,
        title: 'Kerberoasting Mechanics & Managed Service Accounts',
        estimatedMinutes: 24,
        difficulty: 'Advanced',
        objectives: [
          'Understand Kerberos TGS ticket requesting by Service Principal Names (SPN).',
          'Analyze offline hash cracking of RC4 and AES service account tickets.',
          'Deploy Group Managed Service Accounts (gMSA) as the permanent mitigation.'
        ],
        theoryMarkdown: `### Kerberoasting Attack Sequence

Any valid domain user can request a Kerberos Ticket Granting Service (TGS) ticket for any service registered with a **Service Principal Name (SPN)**.

\`\`\`
1. Authenticated User ──► Requests TGS for SPN 'MSSQLSvc/db01.corp' ──► Domain Controller (KDC)
2. DC replies with TGS encrypted with the Service Account's NTLM/AES password hash.
3. Attacker extracts the ticket from memory and cracks it offline using Hashcat (Mode 13100).
\`\`\`

#### Hardening Countermeasure
* Move critical services to **Group Managed Service Accounts (gMSA)** where passwords are 128 characters, randomly generated by Active Directory, and rotated automatically every 30 days.`,
        keyTakeaways: [
          'Kerberoasting does not require elevated privileges to initiate.',
          'Weak, human-selected service account passwords undermine Active Directory security.',
          'gMSAs eliminate static passwords on service accounts.'
        ],
        interviewAngle: 'How do you detect Kerberoasting activity within Windows Event Logs? (Hint: Event ID 4769 with encryption type 0x17).',
        quiz: [
          {
            id: 'q10-1',
            difficulty: 'Basic',
            question: 'What is the most secure architectural mitigation against Kerberoasting attacks for domain services?',
            options: [
              'Disabling Kerberos entirely',
              'Using Group Managed Service Accounts (gMSA) with long, complex, auto-rotated passwords',
              'Adding all service accounts to Domain Admins',
              'Restarting the Domain Controller daily'
            ],
            correctIndex: 1,
            explanation: 'gMSAs prevent offline password cracking because passwords are 128-character complex strings rotated by Active Directory without human knowledge.',
            skillId: 'fundamentals'
          },
          {
            id: 'q10-2',
            difficulty: 'Intermediate',
            question: 'Which Active Directory entity issues Kerberos Ticket Granting Tickets (TGT) to users upon successful authentication?',
            options: [
              'Key Distribution Center (KDC) hosted on the Domain Controller',
              'Certificate Authority Web Enrollment service',
              'Local Security Authority Subsystem Service (LSASS) on the client machine alone',
              'Remote Desktop Gateway'
            ],
            correctIndex: 0,
            explanation: 'The KDC (Key Distribution Center) on the Domain Controller authenticates users (AS-REQ / AS-REP) and issues signed Ticket Granting Tickets (TGT).',
            skillId: 'fundamentals'
          },
          {
            id: 'q10-3',
            difficulty: 'Advanced',
            question: 'What cryptographic asset must an adversary extract from a compromised Domain Controller to forge a Kerberos Golden Ticket with arbitrary persistence?',
            options: [
              'The local Administrator NTLM hash of an unprivileged workstation',
              'The KRBTGT account password hash / AES encryption key',
              'The public SSL certificate of the web proxy',
              'The NetBIOS broadcast table'
            ],
            correctIndex: 1,
            explanation: 'The KRBTGT account key encrypts and signs all TGTs in the domain. Compromising this key allows forging tickets for any user with any domain group membership.',
            skillId: 'fundamentals'
          }
        ]
      }
    ]
  },
  {
    levelNumber: 11,
    title: 'Professional Cybersecurity Engineer & Career Ready',
    codename: 'OP_JOB_READY',
    description: 'Technical interview simulations, resume evidence alignment, ATS optimization, and professional portfolio defense.',
    requiredStarsToUnlock: 11,
    badgeName: 'Verified Cybersecurity Professional',
    skillsTaught: ['Technical Interviews', 'Portfolio Defense', 'ATS Optimization'],
    lessons: [
      {
        id: 'lvl11-lesson1',
        levelId: 11,
        title: 'Demonstrating Verified Skill Evidence to Hiring Managers',
        estimatedMinutes: 20,
        difficulty: 'Advanced',
        objectives: [
          'Translate hands-on lab and CTF achievements into verifiable resume bullet points.',
          'Defend problem-solving methodologies during whiteboard scenario interviews.',
          'Align personal capabilities with the NICE Cybersecurity Workforce Framework.'
        ],
        theoryMarkdown: `### The Data-First Career Rule

Senior engineering managers and technical interviewers prioritize **verifiable problem-solving evidence** over unevidenced buzzword lists.

\`\`\`
WEAK BULLET:
- "Experienced in Linux security and SIEM tools."

STRONG, EVIDENCE-BASED BULLET:
- "Configured Splunk forwarders and monitored Windows Event logs (4624/4625), triaging 20+ simulated brute-force alerts and documenting incident response timelines in an isolated virtual lab environment."
\`\`\`

#### The Action-Context-Outcome Framework
* **Action:** What specific tool or technique did you employ?
* **Context:** What network, architecture, or protocol constraints were present?
* **Outcome:** What was the verified result, latency reduction, or risk mitigation?`,
        keyTakeaways: [
          'Never claim a certification or tool mastery without hands-on evidence.',
          'Use the Action + Context + Outcome structure for every project and experience entry.',
          'Prepare to whiteboard security architectures under active interrogation.'
        ],
        interviewAngle: 'Walk me through an incident you investigated end-to-end: from initial alert detection through containment and post-incident lessons learned.',
        quiz: [
          {
            id: 'q11-1',
            difficulty: 'Basic',
            question: 'What constitutes the strongest evidence of cybersecurity competence on a technical resume?',
            options: [
              'Listing 50 acronyms in an uncontextualized skills block',
              'Grounded bullet points describing specific tools, architecture context, and verifiable problem-solving outcomes',
              'Using colorful graphics and custom progress bar graphs',
              'Claiming expert proficiency in every cybersecurity domain'
            ],
            correctIndex: 1,
            explanation: 'Hiring managers look for verifiable technical outcomes using the Action-Context-Outcome formula, backed by hands-on labs or project repositories.',
            skillId: 'fundamentals'
          },
          {
            id: 'q11-2',
            difficulty: 'Intermediate',
            question: 'In the CVSS v3.1 scoring standard, how do Temporal and Environmental metrics differ from the Base metric group?',
            options: [
              'Base metrics change daily; Environmental metrics are immutable',
              'Base metrics describe intrinsic vulnerability properties; Temporal reflects real-world exploit availability; Environmental factors in organization-specific mitigating controls and asset criticality',
              'Base metrics are only used for hardware devices',
              'Temporal metrics are calculated exclusively by internet service providers'
            ],
            correctIndex: 1,
            explanation: 'Base metrics reflect constant vulnerability attributes. Temporal metrics track exploit code maturity and patch availability over time. Environmental metrics customize the score to an organization\'s specific architecture and impact.',
            skillId: 'fundamentals'
          },
          {
            id: 'q11-3',
            difficulty: 'Advanced',
            question: 'When threat modeling an internal microservices payment cluster using the STRIDE methodology, which threat category directly addresses unauthorized payload modifications in transit between pods lacking mutual TLS (mTLS)?',
            options: ['Spoofing', 'Tampering', 'Repudiation', 'Information Disclosure'],
            correctIndex: 1,
            explanation: 'Tampering involves malicious modification of data in transit or storage. Mutual TLS (mTLS) enforces cryptographic integrity checking to prevent tampering between microservices.',
            skillId: 'fundamentals'
          }
        ]
      }
    ]
  }
];
