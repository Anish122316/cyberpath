import { TargetRole } from '../types';

export interface CareerPathDefinition {
  role: TargetRole;
  title: string;
  shortDescription: string;
  salaryBand: string;
  coreSkills: string[];
  recommendedCerts: string[];
  keyTools: string[];
  interviewFocus: string[];
  niceskillFrameworkCode: string;
}

export const CAREER_PATHS: Record<TargetRole, CareerPathDefinition> = {
  SOC_ANALYST: {
    role: 'SOC_ANALYST',
    title: 'SOC Analyst (Tier 1 & Tier 2)',
    shortDescription: 'Monitors enterprise telemetry, investigates SIEM alerts, performs baseline packet analysis, and neutralizes security incidents.',
    salaryBand: '$70,000 - $115,000',
    coreSkills: ['SIEM & Log Analysis', 'TCP/IP Packet Inspection', 'Windows Event Logs', 'Incident Triage', 'MITRE ATT&CK Mapping'],
    recommendedCerts: ['CompTIA Security+', 'CompTIA CySA+', 'BTL1 (Blue Team Level 1)', 'SC-200'],
    keyTools: ['Splunk', 'Elastic Security / ELK', 'Wireshark', 'Suricata / Zeek', 'TheHive / Cortex'],
    interviewFocus: ['Distinguishing false positives from true positives', 'Investigation steps for 4625 brute force alerts', 'Phishing email header triage'],
    niceskillFrameworkCode: 'PR-CDA-001 (Cyber Defense Analyst)'
  },
  PENETRATION_TESTER: {
    role: 'PENETRATION_TESTER',
    title: 'Penetration Tester / Ethical Hacker',
    shortDescription: 'Simulates real-world adversary tactics to uncover, validate, and report security vulnerabilities before malicious threat actors exploit them.',
    salaryBand: '$95,000 - $160,000',
    coreSkills: ['Network Enumeration', 'Web Application Penetration Testing', 'Privilege Escalation', 'Active Directory Exploitation', 'Technical Report Writing'],
    recommendedCerts: ['eJPT', 'OSCP (Offensive Security Certified Professional)', 'PNPT', 'CompTIA PenTest+'],
    keyTools: ['Burp Suite Professional', 'Nmap', 'Metasploit', 'Hashcat / John the Ripper', 'BloodHound / Impacket'],
    interviewFocus: ['Methodology for web reconnaissance', 'Explaining blind SQL injection techniques', 'Remediation guidance for Cross-Site Scripting (XSS)'],
    niceskillFrameworkCode: 'AN-TWA-001 (Threat Warning Analyst / Red Operator)'
  },
  CLOUD_SECURITY: {
    role: 'CLOUD_SECURITY',
    title: 'Cloud Security Engineer',
    shortDescription: 'Designs, secures, and audits multi-cloud architectures across AWS, Azure, and GCP, enforcing least-privilege IAM and Infrastructure as Code.',
    salaryBand: '$110,000 - $180,000',
    coreSkills: ['Cloud IAM Least Privilege', 'Container & Kubernetes Hardening', 'Terraform / IaC Auditing', 'CloudTrail / GuardDuty Monitoring', 'Secrets Management'],
    recommendedCerts: ['AWS Certified Security - Specialty', 'AZ-500 (Azure Security Engineer)', 'GCP Professional Cloud Security Engineer', 'CCSP'],
    keyTools: ['AWS IAM & CloudTrail', 'Trivy / ScoutSuite', 'HashiCorp Vault', 'Kubernetes / Falco', 'Wiz / Prisma Cloud'],
    interviewFocus: ['Defending against SSRF targeting 169.254.169.254 (IMDSv2)', 'Securing public S3 bucket architectures', 'Managing cross-account IAM role assumption'],
    niceskillFrameworkCode: 'SP-ARC-002 (Security Architect - Cloud)'
  },
  APPLICATION_SECURITY: {
    role: 'APPLICATION_SECURITY',
    title: 'Application Security Engineer (AppSec)',
    shortDescription: 'Bridges software engineering and security operations, implementing secure SDLC, SAST/DAST pipelines, and threat modeling.',
    salaryBand: '$115,000 - $185,000',
    coreSkills: ['OWASP Top 10 & ASVS', 'Secure Code Review', 'CI/CD DevSecOps Automation', 'Threat Modeling (STRIDE)', 'API Security & OAuth2'],
    recommendedCerts: ['CASE (Certified Application Security Engineer)', 'OSWE (OffSec Web Expert)', 'GWAPT'],
    keyTools: ['Burp Suite', 'Semgrep / SonarQube', 'Snyk / Dependabot', 'Postman', 'OWASP ZAP'],
    interviewFocus: ['Remediating IDOR and broken access control', 'Implementing Content Security Policy (CSP) headers', 'Conducting STRIDE threat modeling on a microservices design'],
    niceskillFrameworkCode: 'SP-DEV-001 (Software Security Engineer)'
  },
  SECURITY_ENGINEER: {
    role: 'SECURITY_ENGINEER',
    title: 'Security Operations & Infrastructure Engineer',
    shortDescription: 'Deploys and hardens security infrastructure including firewalls, EDR agents, VPNs, zero-trust gateways, and automated response pipelines.',
    salaryBand: '$105,000 - $170,000',
    coreSkills: ['Firewall & Network Segmentation', 'Endpoint Detection & Response (EDR)', 'Zero Trust Architecture', 'Python & Bash Security Automation', 'Patch & Configuration Management'],
    recommendedCerts: ['CISSP (Associate / Full)', 'CompTIA Security+', 'CCNA Security', 'Palo Alto PCNSE'],
    keyTools: ['Palo Alto Networks / Fortinet', 'CrowdStrike Falcon / SentinelOne', 'Ansible / Terraform', 'WireGuard / OpenVPN', 'Sysmon'],
    interviewFocus: ['Configuring micro-segmentation in hybrid networks', 'Automating incident containment via Python scripts', 'Hardening Linux and Windows golden images'],
    niceskillFrameworkCode: 'SP-SYS-001 (Information Systems Security Developer)'
  }
};

export const SAMPLE_RESUMES = {
  SOC_ANALYST: `ALEX CHEN
San Jose, CA | alex.chen.cyber@example.com | (555) 234-5678 | linkedin.com/in/alexchen-cyber | github.com/alexchen-sec

PROFESSIONAL SUMMARY
Analytical and detail-oriented Cybersecurity Specialist with hands-on experience in security information and event management (SIEM), network packet analysis, and alert triage. Proficient in monitoring telemetry across Linux and Windows environments, investigating anomalous authentication clusters, and documenting incident remediation workflows. CompTIA Security+ certified.

TECHNICAL SKILLS
- Security Monitoring & SIEM: Splunk, Elastic Security, Log Analysis, Alert Triage, Incident Response
- Networking & Protocols: TCP/IP, Wireshark, DNS, HTTP/HTTPS, Firewall Rules, Subnetting
- Operating Systems & Command Line: Linux (Ubuntu/Debian, RedHat), Bash Scripting, Windows Server, PowerShell Basics
- Security Tools: Nmap, Suricata, Sysmon, Burp Suite (Community), Nessus Essentials
- Frameworks & Compliance: MITRE ATT&CK, NIST Cybersecurity Framework (CSF), OWASP Top 10

WORK EXPERIENCE
Cybersecurity Lab Analyst / Apprentice
CyberPath Training Center — San Jose, CA | June 2025 - Present
- Monitored simulated enterprise SIEM alerts in Splunk, triaging over 45 simulated high-priority security incidents including brute-force attacks (Event ID 4625) and unauthorized privilege escalations.
- Analyzed PCAP network captures in Wireshark to reconstruct TCP 3-way handshake anomalies and identify beaconing malware traffic.
- Documented standardized incident response playbooks for phishing investigation, reducing average triage time by 20% in virtual team drills.

IT Support & Systems Technician
Silicon Valley Tech Solutions — Santa Clara, CA | January 2024 - May 2025
- Managed user account provisioning, access permissions, and multi-factor authentication (MFA) enforcement for 200+ employees using Active Directory.
- Hardened 50+ Linux and Windows workstations following CIS Benchmarks, restricting unnecessary service daemons and auditing local administrator accounts.
- Resolved tier 1 and tier 2 hardware, network connectivity, and operating system tickets with a 98% positive resolution rating.

PROJECTS
Home Lab SIEM & Threat Hunting Range
- Built a multi-node virtual home lab running Ubuntu Server and Windows 10 targets, configuring Splunk Universal Forwarders to centralize authentication and sysmon telemetry.
- Simulated credential stuffing attacks using Hydra in an isolated network segment, authoring custom Splunk SPL correlation rules to flag >10 failed attempts within 60 seconds.

Network Packet Decryption & Traffic Inspector
- Captured and analyzed encrypted TLS and plain HTTP traffic within an isolated sandbox, documenting cipher suite negotiations and verifying certificate authority validity using OpenSSL.

EDUCATION & CERTIFICATIONS
- Bachelor of Science in Information Technology, California State University | 2023
- CompTIA Security+ (SY0-701) | Certified 2024`,

  SYSADMIN_TRANSITIONING: `JORDAN TAYLOR
Austin, TX | jordan.taylor.infra@example.com | (555) 876-5432 | github.com/jordantaylor-ops

SUMMARY
Experienced Systems and Network Administrator with 4+ years managing high-availability Linux servers, network infrastructure, and virtualization platforms. Strong expertise in Bash automation, firewall policy enforcement, and infrastructure hardening, transitioning into full-time Cybersecurity Operations.

TECHNICAL SKILLS
- Operating Systems: Linux (CentOS, RHEL, Ubuntu Server), Windows Server 2019/2022
- Networking: Cisco Switches/Routers, VLANs, BGP, OSPF, VPN (IPsec/WireGuard), DNS, DHCP
- Scripting & Automation: Bash, Python, Ansible, Git, Cron
- Security Concepts: Firewall configuration (iptables, nftables, UFW), SSH key management, CIS Hardening

EXPERIENCE
Systems Administrator
Pinnacle Financial Operations — Austin, TX | 2022 - Present
- Administered 80+ Linux physical and virtual servers, maintaining 99.95% uptime for internal financial transactional pipelines.
- Implemented automated configuration management with Ansible, auditing SSH configurations across all servers to enforce key-based authentication only.
- Configured network segmentation using VLANs and pfSense firewall rules, separating PCI-DSS audit scope from general office subnets.

Network Technician
Austin Data Connect — Austin, TX | 2020 - 2022
- Terminated, labeled, and tested Cat6 and fiber optic connections across two enterprise data centers.
- Configured Cisco Catalyst switches with 802.1Q trunking and port security to prevent MAC flooding attacks.

EDUCATION
- Associate Degree in Network Administration, Austin Community College | 2020
- Cisco Certified Network Associate (CCNA) | 2021`,

  SAMPLE_JOB_DESCRIPTION: `Title: Junior / Mid-Level SOC Analyst (Tier 1/2)
Company: Aegis Defense Systems
Location: Remote / Hybrid

About the Role:
Aegis Defense Systems is seeking a dedicated SOC Analyst to join our 24/7 Security Operations Center. You will monitor security event logs, triage alerts, and coordinate incident response for critical enterprise infrastructure.

Key Responsibilities:
- Monitor and analyze events generated by SIEM platforms (Splunk, Elastic, or Microsoft Sentinel).
- Investigate suspicious network traffic, review PCAP files in Wireshark, and identify potential command-and-control beaconing.
- Triage endpoint security alerts from EDR solutions and Windows Event logs (Logon events, process creation 4688).
- Coordinate containment actions for confirmed incidents in accordance with NIST SP 800-61.
- Document clear, reproducible incident tickets and post-incident analysis reports.

Required Qualifications:
- Solid foundational understanding of the TCP/IP protocol suite, routing, and common port services.
- Demonstrable hands-on experience using Splunk, ELK, or comparable SIEM tools to query and filter log data.
- Working knowledge of Linux command line utilities (grep, awk, journalctl) and Windows security architecture.
- CompTIA Security+, CySA+, or equivalent cybersecurity certification.
- Strong analytical reasoning and objective written communication skills.

Preferred Qualifications:
- Experience scripting with Python or Bash to automate log parsing tasks.
- Familiarity with the MITRE ATT&CK framework and threat intelligence feeds.
- Prior exposure to cloud environments (AWS, Azure) and cloud audit logs.`
};
