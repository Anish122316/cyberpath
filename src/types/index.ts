export type NavigationTab =
  | 'landing'
  | 'dashboard'
  | 'learning'
  | 'labs'
  | 'challenges'
  | 'skills'
  | 'resume-analyzer'
  | 'resume-builder'
  | 'job-match'
  | 'career'
  | 'interview'
  | 'assessment'
  | 'certificate';

export type TargetRole =
  | 'SOC_ANALYST'
  | 'PENETRATION_TESTER'
  | 'CLOUD_SECURITY'
  | 'APPLICATION_SECURITY'
  | 'SECURITY_ENGINEER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  isLoggedIn: boolean;
  targetRole: TargetRole;
  currentLevel: number;
  xp: number;
  stars: number;
  completedLessons: string[];
  completedLabs: string[];
  solvedChallenges: string[];
  assessmentCompleted: boolean;
  interviewScore: number | null;
  onboardingCompleted?: boolean;
  streakDays?: number;
  joinedDate?: string;
}

export interface SkillEvidenceItem {
  type: 'LESSON' | 'QUIZ' | 'PRACTICAL' | 'ASSESSMENT';
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'Fundamentals' | 'Networking' | 'Linux' | 'Web Security' | 'Blue Team' | 'Red Team' | 'Cloud' | 'DFIR';
  description: string;
  score: number; // 0-100 calculated
  confidence: number; // 0-100 calculated
  evidenceCount: number;
  requiredEvidenceCount?: number;
  evidenceItems?: SkillEvidenceItem[];
  status?: 'LOCKED' | 'IN_PROGRESS' | 'MASTERED' | 'UNRATED';
  lastUpdated?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillId: string;
  difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
}

export interface Lesson {
  id: string;
  levelId: number;
  title: string;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  objectives: string[];
  theoryMarkdown: string;
  keyTakeaways: string[];
  interviewAngle: string;
  quiz: QuizQuestion[];
  completed?: boolean;
}

export interface LevelCurriculum {
  levelNumber: number;
  title: string;
  codename: string;
  description: string;
  requiredStarsToUnlock: number;
  lessons: Lesson[];
  badgeName: string;
  skillsTaught: string[];
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: 'Networking' | 'Linux' | 'Web Security' | 'Cryptography' | 'SOC & Logs' | 'Cloud Security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  baseXp: number;
  starsReward: number;
  scenario: string;
  objective: string;
  targetEnvironment: string;
  artifactSnippet?: string;
  artifactType?: 'Terminal' | 'Packet Capture' | 'Source Code' | 'Log Excerpt' | 'Hex Dump' | 'JWT Token' | 'Disassembly' | 'API Spec' | 'Memory Dump';
  flagHash: string; // SHA-256 or matched string
  rawFlag: string;
  hints: { text: string; penaltyXp: number }[];
  associatedSkillId: string;
  learningTakeaway: string;
  tags?: string[];
  cve?: string;
  attackVector?: string;
  mitreTactic?: string;
  solved?: boolean;
  attemptsCount?: number;
}

export interface ResumeSectionExperience {
  company: string;
  role: string;
  duration: string;
  bullets: string[];
}

export interface ResumeSectionProject {
  title: string;
  techStack: string[];
  description: string;
  bullets: string[];
}

export interface ParsedResumeData {
  contact: {
    name: string;
    email: string;
    phone: string;
    location: string;
    links: string[];
  };
  summary: string;
  technicalSkills: {
    category: string;
    skills: string[];
  }[];
  experience: ResumeSectionExperience[];
  projects: ResumeSectionProject[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
}

export type EvidenceTier = 'EXPLICIT_SKILL' | 'EXPERIENCE_EVIDENCE' | 'PROJECT_EVIDENCE' | 'CERTIFICATION_EVIDENCE' | 'NOT_EVIDENCED';

export interface KeywordEvidence {
  keyword: string;
  category: string;
  tier: EvidenceTier;
  sourceContext?: string;
  confidenceScore: number; // 0-100
}

export interface ATSAnalysisResult {
  calculationVersion: string;
  analyzedAt: string;
  overallAtsScore: number; // 0-100
  formattingScore: number;
  sectionStructureScore: number;
  keywordRelevanceScore: number;
  readabilityScore: number;
  evidenceRelevanceScore: number;
  consistencyScore: number;
  detectedSections: {
    name: string;
    found: boolean;
    status: 'OPTIMAL' | 'WARNING' | 'MISSING';
    details: string;
  }[];
  findings: {
    type: 'SUCCESS' | 'WARNING' | 'CRITICAL';
    title: string;
    impact: string;
    recommendation: string;
    factualityNote: string;
  }[];
  evidencedKeywords: KeywordEvidence[];
  unEvidencedSkills: string[];
}

export interface JobDescriptionRequirement {
  id: string;
  title: string;
  weight: 5 | 4 | 3 | 2 | 1; // 5 = Critical, 1 = Optional
  category: 'SECURITY_CORE' | 'TOOLING' | 'NETWORKING' | 'CLOUD' | 'CERTIFICATION' | 'SOFT_SKILLS';
  matchStatus: 'MATCHED' | 'PARTIALLY_MATCHED' | 'NOT_EVIDENCED' | 'UNCLEAR';
  evidenceSnippet?: string;
  explanation: string;
}

export interface JobMatchAnalysis {
  calculationVersion: string;
  jobTitle: string;
  companyName: string;
  overallMatchScore: number; // 0-100
  skillMatchScore: number;
  keywordMatchScore: number;
  experienceMatchScore: number;
  projectMatchScore: number;
  requirements: JobDescriptionRequirement[];
  criticalGapsCount: number;
  recommendedLearningModules: string[];
}

export interface CareerReadinessReport {
  calculationVersion: string;
  targetRole: TargetRole;
  overallReadinessScore: number | null; // null if insufficient data
  isSufficientData: boolean;
  missingDataReasons: string[];
  dimensions: {
    technicalSkills: { score: number; available: boolean; weight: number };
    practicalLabs: { score: number; available: boolean; weight: number };
    assessment: { score: number; available: boolean; weight: number };
    challenges: { score: number; available: boolean; weight: number };
    interviewPrep: { score: number; available: boolean; weight: number };
    resumeQuality: { score: number; available: boolean; weight: number };
  };
  roleAlignmentVerdict: 'HIGH_ALIGNMENT' | 'MODERATE_ALIGNMENT' | 'FOUNDATIONAL_GAPS' | 'INSUFFICIENT_DATA';
  nextImmediateAction: string;
}
