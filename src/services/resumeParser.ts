import { ATSAnalysisResult, KeywordEvidence, ParsedResumeData } from '../types';
import { calculateATSScore, ENGINE_VERSION } from './scoringEngine';

// Common cybersecurity target keywords categorized
const CYBER_KEYWORDS_DB: Record<string, { category: string; aliases: string[] }> = {
  Splunk: { category: 'SIEM & Monitoring', aliases: ['splunk', 'splunk enterprise', 'splunk forwarder'] },
  'Elastic / ELK': { category: 'SIEM & Monitoring', aliases: ['elk', 'elasticsearch', 'logstash', 'kibana', 'elastic security'] },
  Wireshark: { category: 'Networking & Packets', aliases: ['wireshark', 'pcap', 'packet capture', 'tcpdump'] },
  'TCP/IP': { category: 'Networking & Packets', aliases: ['tcp/ip', 'tcp', 'udp', '3-way handshake', 'subnetting'] },
  Linux: { category: 'OS & Systems', aliases: ['linux', 'ubuntu', 'debian', 'centos', 'rhel', 'bash', 'grep'] },
  'Windows Event Logs': { category: 'Incident Response', aliases: ['event id 4625', 'event id 4624', 'event id 4688', 'windows event logs', 'sysmon'] },
  Nmap: { category: 'Security Tools', aliases: ['nmap', 'port scanning', 'syn scan'] },
  'Burp Suite': { category: 'AppSec', aliases: ['burp suite', 'burp', 'owasp zap'] },
  'OWASP Top 10': { category: 'Web Security', aliases: ['owasp', 'owasp top 10', 'sql injection', 'xss', 'csrf', 'idor'] },
  'CompTIA Security+': { category: 'Certifications', aliases: ['security+', 'sec+', 'sy0-701', 'sy0-601'] },
  'Incident Response': { category: 'SOC & Triage', aliases: ['incident response', 'incident triage', 'nist 800-61', 'containment'] },
  'MITRE ATT&CK': { category: 'Threat Intelligence', aliases: ['mitre att&ck', 'mitre', 'tactics techniques and procedures', 'ttp'] },
  Python: { category: 'Scripting', aliases: ['python', 'python3', 'automation script'] },
  AWS: { category: 'Cloud Security', aliases: ['aws', 'amazon web services', 's3 bucket', 'iam role', 'cloudtrail'] },
  ActiveDirectory: { category: 'Identity & Access', aliases: ['active directory', 'ad', 'domain controller', 'kerberos'] },
};

/**
 * Deterministically parses raw plain-text resume into structured sections.
 */
export function parseResumeSections(rawText: string): ParsedResumeData {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

  const parsed: ParsedResumeData = {
    contact: {
      name: lines[0] || 'Candidate',
      email: '',
      phone: '',
      location: '',
      links: [],
    },
    summary: '',
    technicalSkills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
  };

  // Detect email and phone
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) parsed.contact.email = emailMatch[0];

  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) parsed.contact.phone = phoneMatch[0];

  // Section splitting via regex headers
  const textLower = rawText.toLowerCase();

  const getSectionText = (startHeaders: string[], endHeaders: string[]): string => {
    let startIdx = -1;
    for (const h of startHeaders) {
      const idx = textLower.indexOf(h.toLowerCase());
      if (idx !== -1 && (startIdx === -1 || idx < startIdx)) {
        startIdx = idx + h.length;
      }
    }
    if (startIdx === -1) return '';

    let endIdx = textLower.length;
    for (const eh of endHeaders) {
      const idx = textLower.indexOf(eh.toLowerCase(), startIdx + 10);
      if (idx !== -1 && idx < endIdx) {
        endIdx = idx;
      }
    }

    return rawText.slice(startIdx, endIdx).trim();
  };

  const summaryContent = getSectionText(
    ['professional summary', 'summary', 'about me', 'career objective'],
    ['technical skills', 'skills', 'experience', 'work experience', 'projects', 'education']
  );
  parsed.summary = summaryContent;

  const skillsContent = getSectionText(
    ['technical skills', 'skills', 'core competencies'],
    ['work experience', 'experience', 'projects', 'education', 'certifications']
  );
  if (skillsContent) {
    parsed.technicalSkills.push({
      category: 'Extracted Skills',
      skills: skillsContent
        .split(/[,\n•-]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1 && s.length < 50),
    });
  }

  // Extract Experience markers
  const expContent = getSectionText(
    ['work experience', 'experience', 'employment history'],
    ['projects', 'education', 'certifications', 'skills']
  );
  if (expContent) {
    const expBullets = expContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-') || l.startsWith('•') || l.length > 20);
    parsed.experience.push({
      company: 'Documented Employment',
      role: 'Cybersecurity / Technical Professional',
      duration: 'See Resume',
      bullets: expBullets,
    });
  }

  // Extract Projects markers
  const projContent = getSectionText(
    ['projects', 'technical projects', 'key projects'],
    ['education', 'certifications', 'experience']
  );
  if (projContent) {
    const projBullets = projContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-') || l.startsWith('•') || l.length > 20);
    parsed.projects.push({
      title: 'Verified Technical Projects',
      techStack: [],
      description: 'Extracted from resume portfolio section',
      bullets: projBullets,
    });
  }

  // Certifications
  const certContent = getSectionText(
    ['certifications', 'certificates', 'licenses & certifications'],
    ['education', 'experience', 'references', 'skills']
  );
  if (certContent) {
    parsed.certifications = certContent
      .split(/[,\n•-]/)
      .map((c) => c.trim())
      .filter((c) => c.length > 3 && c.length < 60);
  }

  return parsed;
}

/**
 * Analyzes resume against ATS standards and extracts multi-tiered keyword evidence.
 */
export function analyzeResumeATS(rawText: string, targetRole: string = 'SOC Analyst'): ATSAnalysisResult {
  if (!rawText || rawText.trim().length === 0) {
    return {
      calculationVersion: ENGINE_VERSION,
      analyzedAt: new Date().toISOString(),
      overallAtsScore: 0,
      formattingScore: 0,
      sectionStructureScore: 0,
      keywordRelevanceScore: 0,
      readabilityScore: 0,
      evidenceRelevanceScore: 0,
      consistencyScore: 0,
      detectedSections: [],
      findings: [
        {
          type: 'CRITICAL',
          title: 'Empty Document',
          impact: 'No parseable text provided.',
          recommendation: 'Upload a readable PDF/DOCX file or paste the plain text of your resume.',
          factualityNote: 'Requires user document input to calculate valid audit scores.',
        },
      ],
      evidencedKeywords: [],
      unEvidencedSkills: Object.keys(CYBER_KEYWORDS_DB),
    };
  }

  const lower = rawText.toLowerCase();

  // 1. Check Standard Sections
  const detectedSections = [
    {
      name: 'Contact Information',
      found: Boolean(lower.includes('@') && lower.match(/\d{3}/)),
      status: (Boolean(lower.includes('@') && lower.match(/\d{3}/)) ? 'OPTIMAL' : 'WARNING') as 'OPTIMAL' | 'WARNING' | 'MISSING',
      details: 'Evaluates standard email, phone number, and location identifiers.',
    },
    {
      name: 'Professional Summary',
      found: lower.includes('summary') || lower.includes('profile') || lower.includes('objective'),
      status: (lower.includes('summary') || lower.includes('profile') ? 'OPTIMAL' : 'WARNING') as 'OPTIMAL' | 'WARNING' | 'MISSING',
      details: 'Standard heading recognized by Workday, Greenhouse, and Lever.',
    },
    {
      name: 'Technical Skills',
      found: lower.includes('skills') || lower.includes('technologies') || lower.includes('competencies'),
      status: (lower.includes('skills') ? 'OPTIMAL' : 'WARNING') as 'OPTIMAL' | 'WARNING' | 'MISSING',
      details: 'Dedicated categorization simplifies automated token parsing.',
    },
    {
      name: 'Work Experience',
      found: lower.includes('experience') || lower.includes('employment') || lower.includes('work history'),
      status: (lower.includes('experience') ? 'OPTIMAL' : 'MISSING') as 'OPTIMAL' | 'WARNING' | 'MISSING',
      details: 'Chronological employment record demonstrates practical application.',
    },
    {
      name: 'Projects / Labs',
      found: lower.includes('project') || lower.includes('lab') || lower.includes('portfolio'),
      status: (lower.includes('project') || lower.includes('lab') ? 'OPTIMAL' : 'WARNING') as 'OPTIMAL' | 'WARNING' | 'MISSING',
      details: 'Provides concrete problem-solving evidence for technical evaluators.',
    },
    {
      name: 'Education & Certifications',
      found: lower.includes('education') || lower.includes('degree') || lower.includes('certif'),
      status: (lower.includes('education') || lower.includes('certif') ? 'OPTIMAL' : 'MISSING') as 'OPTIMAL' | 'WARNING' | 'MISSING',
      details: 'Academic credentials and industry qualifications.',
    },
  ];

  const foundSectionsCount = detectedSections.filter((s) => s.found).length;
  const sectionStructureScore = Math.min(100, Math.round((foundSectionsCount / detectedSections.length) * 100));

  // 2. Keyword Evidence Classification
  const evidencedKeywords: KeywordEvidence[] = [];
  const unEvidencedSkills: string[] = [];

  Object.entries(CYBER_KEYWORDS_DB).forEach(([key, meta]) => {
    let matched = false;
    let foundSnippet = '';
    let tier: KeywordEvidence['tier'] = 'NOT_EVIDENCED';

    for (const alias of meta.aliases) {
      const idx = lower.indexOf(alias);
      if (idx !== -1) {
        matched = true;
        // Grab context snippet
        const start = Math.max(0, idx - 40);
        const end = Math.min(rawText.length, idx + alias.length + 60);
        foundSnippet = rawText.slice(start, end).replace(/\n/g, ' ').trim();

        // Check if mentioned inside experience or project sections
        const snippetLower = foundSnippet.toLowerCase();
        if (snippetLower.includes('project') || snippetLower.includes('built') || snippetLower.includes('lab')) {
          tier = 'PROJECT_EVIDENCE';
        } else if (snippetLower.includes('monitored') || snippetLower.includes('managed') || snippetLower.includes('triaged') || snippetLower.includes('analyzed')) {
          tier = 'EXPERIENCE_EVIDENCE';
        } else if (meta.category === 'Certifications') {
          tier = 'CERTIFICATION_EVIDENCE';
        } else {
          tier = 'EXPLICIT_SKILL';
        }
        break;
      }
    }

    if (matched) {
      evidencedKeywords.push({
        keyword: key,
        category: meta.category,
        tier,
        sourceContext: foundSnippet,
        confidenceScore: tier === 'EXPERIENCE_EVIDENCE' || tier === 'PROJECT_EVIDENCE' ? 95 : 75,
      });
    } else {
      unEvidencedSkills.push(key);
    }
  });

  // Calculate Keyword Relevance
  const keywordRelevanceScore = Math.min(100, Math.round((evidencedKeywords.length / Object.keys(CYBER_KEYWORDS_DB).length) * 160));

  // 3. Formatting Compatibility
  // Penalize suspicious tabulations, extremely long unbroken paragraphs, or missing line breaks
  let formattingScore = 85;
  const lines = rawText.split('\n');
  if (lines.length < 15) formattingScore -= 20; // overly condensed
  if (rawText.includes('\t\t\t')) formattingScore -= 10; // complex tab structures
  if (rawText.length > 10000) formattingScore -= 15; // overly long, exceeds 2 pages
  formattingScore = Math.max(30, Math.min(100, formattingScore));

  // 4. Readability Score
  // Checks for active action verbs (Monitored, Configured, Analyzed, Investigated, Hardened, Triaged)
  const actionVerbs = ['monitored', 'configured', 'analyzed', 'investigated', 'hardened', 'triaged', 'deployed', 'implemented', 'audited', 'conducted'];
  const matchedVerbsCount = actionVerbs.filter((v) => lower.includes(v)).length;
  const readabilityScore = Math.min(100, Math.max(40, matchedVerbsCount * 14 + 30));

  // 5. Evidence Relevance & Consistency
  const hasExperienceEvidence = evidencedKeywords.some((k) => k.tier === 'EXPERIENCE_EVIDENCE' || k.tier === 'PROJECT_EVIDENCE');
  const evidenceRelevanceScore = hasExperienceEvidence ? 88 : 45;
  const consistencyScore = foundSectionsCount >= 5 ? 90 : 65;

  const { overallScore } = calculateATSScore({
    formattingScore,
    sectionStructureScore,
    keywordRelevanceScore,
    readabilityScore,
    evidenceRelevanceScore,
    consistencyScore,
  });

  // 6. Findings and Actionable Suggestions
  const findings: ATSAnalysisResult['findings'] = [];

  if (sectionStructureScore >= 80) {
    findings.push({
      type: 'SUCCESS',
      title: 'Strong Standard Section Structure',
      impact: 'ATS parsers can cleanly categorize your contact information, work history, and education without confusion.',
      recommendation: 'Maintain standard headings (e.g. "Work Experience", "Education") and avoid creative non-standard substitutes.',
      factualityNote: 'Directly verified from heading tokens in the submitted document.',
    });
  } else {
    findings.push({
      type: 'WARNING',
      title: 'Non-Standard or Missing Headings Detected',
      impact: 'Older ATS engines may fail to parse entries correctly into database fields.',
      recommendation: 'Ensure your resume explicitly includes "Professional Summary", "Work Experience", "Technical Skills", and "Education" as standalone lines.',
      factualityNote: 'One or more recommended standard sections was not evidenced.',
    });
  }

  if (unEvidencedSkills.includes('Splunk') && targetRole.includes('SOC')) {
    findings.push({
      type: 'CRITICAL',
      title: 'Core SIEM Tooling Not Evidenced',
      impact: 'Splunk or comparable SIEM tools are required qualifications on >85% of SOC Analyst job postings.',
      recommendation: 'If you have hands-on experience using Splunk in a home lab or course, explicitly document the specific tasks (e.g. authoring SPL queries, triaging authentication alerts). Only add this if you genuinely have this experience.',
      factualityNote: 'Splunk is not evidenced in the submitted resume. Do not invent experience if absent.',
    });
  }

  if (evidencedKeywords.some((k) => k.tier === 'EXPLICIT_SKILL')) {
    const uncontextualized = evidencedKeywords.filter((k) => k.tier === 'EXPLICIT_SKILL').map((k) => k.keyword).slice(0, 3).join(', ');
    findings.push({
      type: 'WARNING',
      title: 'Skills Listed Without Practical Context',
      impact: `Keywords like ${uncontextualized} appear in your skills list but are not evidenced in your bullet points.`,
      recommendation: 'Ground your skills in actual projects or job experiences using the Action + Context + Outcome formula.',
      factualityNote: 'Evidence tier classified as EXPLICIT_SKILL based on document syntax analysis.',
    });
  }

  return {
    calculationVersion: ENGINE_VERSION,
    analyzedAt: new Date().toISOString(),
    overallAtsScore: overallScore,
    formattingScore,
    sectionStructureScore,
    keywordRelevanceScore,
    readabilityScore,
    evidenceRelevanceScore,
    consistencyScore,
    detectedSections,
    findings,
    evidencedKeywords,
    unEvidencedSkills: unEvidencedSkills.slice(0, 8),
  };
}
