import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { LearningView } from './components/views/LearningView';
import { LabsView } from './components/views/LabsView';
import { ChallengesView } from './components/views/ChallengesView';
import { SkillsView } from './components/views/SkillsView';
import { ResumeAnalyzerView } from './components/views/ResumeAnalyzerView';
import { ResumeBuilderView } from './components/views/ResumeBuilderView';
import { JobMatchView } from './components/views/JobMatchView';
import { CareerView } from './components/views/CareerView';
import { InterviewView } from './components/views/InterviewView';
import { AssessmentView } from './components/views/AssessmentView';
import { CertificateView } from './components/views/CertificateView';
import { GoogleAuthModal } from './components/auth/GoogleAuthModal';

import {
  ATSAnalysisResult,
  NavigationTab,
  SkillNode,
  TargetRole,
  UserProfile,
} from './types';
import { CTF_CHALLENGES } from './data/challenges';
import { calculateCareerReadiness } from './services/scoringEngine';
import { analyzeResumeATS } from './services/resumeParser';
import { SAMPLE_RESUMES } from './data/careerPaths';

// Initial zero-baseline skill nodes (strictly not predefined)
const INITIAL_SKILLS: SkillNode[] = [
  {
    id: 'fundamentals',
    name: 'Cybersecurity Fundamentals',
    category: 'Fundamentals',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'Security principles, CIA triad, defense-in-depth, and ethics.',
    lastUpdated: 'Not started',
  },
  {
    id: 'networking',
    name: 'Networking & Protocols',
    category: 'Networking',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'TCP/IP 3-way handshake, packet dissection, DNS, and ports.',
    lastUpdated: 'Not started',
  },
  {
    id: 'linux',
    name: 'Linux & Systems Security',
    category: 'Linux',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'Permissions, SUID privilege escalation, and auth logs.',
    lastUpdated: 'Not started',
  },
  {
    id: 'web-security',
    name: 'Web Application Security',
    category: 'Web Security',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'OWASP Top 10, SQLi, XSS, CSRF, and broken access control.',
    lastUpdated: 'Not started',
  },
  {
    id: 'cryptography',
    name: 'Applied Cryptography',
    category: 'Fundamentals',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'Symmetric/Asymmetric encryption, hashing, RSA, and TLS.',
    lastUpdated: 'Not started',
  },
  {
    id: 'blue-team',
    name: 'SOC & Blue Team Defense',
    category: 'Blue Team',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'SIEM monitoring (Splunk), alert triage, and incident response.',
    lastUpdated: 'Not started',
  },
  {
    id: 'cloud',
    name: 'Cloud Security & IAM',
    category: 'Cloud',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'AWS IAM least privilege, S3 bucket auditing, and CloudTrail.',
    lastUpdated: 'Not started',
  },
  {
    id: 'red-team',
    name: 'Offensive & CTF Operations',
    category: 'Red Team',
    score: 0,
    confidence: 0,
    evidenceCount: 0,
    description: 'Authorized penetration testing, Nmap sweeps, and exploitation.',
    lastUpdated: 'Not started',
  },
];

// Initial zero-baseline user profile (strictly not predefined)
const INITIAL_USER: UserProfile = {
  id: 'usr-guest',
  name: 'Cybersecurity Trainee',
  email: 'trainee@cyberpath.dev',
  targetRole: 'SOC_ANALYST',
  currentLevel: 0,
  xp: 0,
  stars: 0,
  completedLessons: [],
  completedLabs: [],
  solvedChallenges: [],
  assessmentCompleted: false,
  interviewScore: null,
  isLoggedIn: false,
};

// Helper: map lesson identifier to skill domain
const getSkillIdForLesson = (lessonId: string): string => {
  const lower = lessonId.toLowerCase();
  if (lower.startsWith('l0-') || lower.includes('fund') || lower.includes('ethic')) return 'fundamentals';
  if (lower.startsWith('l1-') || lower.includes('net')) return 'networking';
  if (lower.startsWith('l2-') || lower.includes('linux') || lower.includes('sys')) return 'linux';
  if (lower.startsWith('l3-') || lower.includes('web') || lower.includes('owasp')) return 'web-security';
  if (lower.startsWith('l4-') || lower.includes('crypto')) return 'cryptography';
  if (lower.startsWith('l5-') || lower.includes('malware') || lower.includes('edr')) return 'blue-team';
  if (lower.startsWith('l6-') || lower.includes('recon') || lower.includes('red')) return 'red-team';
  if (lower.startsWith('l7-') || lower.includes('cloud') || lower.includes('iam')) return 'cloud';
  if (lower.startsWith('l8-') || lower.startsWith('l9-') || lower.includes('siem') || lower.includes('forensic')) return 'blue-team';
  return 'fundamentals';
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);

  // User Profile State initialized cleanly
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      // Check if there is an active logged-in user in localStorage
      const activeEmail = localStorage.getItem('cyberpath_active_email');
      if (activeEmail) {
        const savedData = localStorage.getItem(`cyberpath_user_${activeEmail}`);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.user) return parsed.user;
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_USER;
  });

  // Skill Graph State initialized cleanly from localStorage or 0-baseline
  const [skills, setSkills] = useState<SkillNode[]>(() => {
    try {
      const activeEmail = localStorage.getItem('cyberpath_active_email');
      if (activeEmail) {
        const savedData = localStorage.getItem(`cyberpath_user_${activeEmail}`);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.skills) return parsed.skills;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SKILLS;
  });

  // Resume state across views
  const [activeResumeText, setActiveResumeText] = useState<string>(SAMPLE_RESUMES.SOC_ANALYST);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(() =>
    analyzeResumeATS(SAMPLE_RESUMES.SOC_ANALYST, 'SOC Analyst')
  );

  // Sync state to localStorage whenever user or skills update
  useEffect(() => {
    try {
      if (user.isLoggedIn && user.email) {
        localStorage.setItem('cyberpath_active_email', user.email);
        localStorage.setItem(
          `cyberpath_user_${user.email}`,
          JSON.stringify({ user, skills })
        );
      }
    } catch {
      // safe fallback
    }
  }, [user, skills]);

  // Flash notification helper
  const notifyLedger = (message: string) => {
    setRecentNotification(message);
    setTimeout(() => {
      setRecentNotification(null);
    }, 4500);
  };

  // Recalculate Career Readiness report using deterministic scoring engine
  const careerReadiness = useMemo(() => {
    return calculateCareerReadiness(
      user,
      skills,
      atsResult,
      user.solvedChallenges.length,
      user.interviewScore !== null,
      user.interviewScore || 0
    );
  }, [skills, user.completedLabs, user.assessmentCompleted, user.solvedChallenges, user.interviewScore, atsResult, user]);

  // Handler: Google Sign-in Success
  const handleGoogleLoginSuccess = (profile: Partial<UserProfile>) => {
    const email = profile.email || 'anishkr649world@gmail.com';
    const name = profile.name || 'Anish Kumar';

    try {
      const savedData = localStorage.getItem(`cyberpath_user_${email}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setUser(parsed.user);
        setSkills(parsed.skills);
        localStorage.setItem('cyberpath_active_email', email);
        notifyLedger(`Welcome back, ${name}! Restored your verified learning ledger.`);
        setCurrentTab('dashboard');
        return;
      }
    } catch {
      // ignore
    }

    // Fresh user initialization (0% skills, 0 XP, Level 0)
    const newUser: UserProfile = {
      ...INITIAL_USER,
      id: `usr-google-${Date.now()}`,
      name,
      email,
      isLoggedIn: true,
      currentLevel: 0,
      xp: 0,
      stars: 0,
      completedLessons: [],
      completedLabs: [],
      solvedChallenges: [],
      assessmentCompleted: false,
      interviewScore: null,
    };

    setUser(newUser);
    setSkills(INITIAL_SKILLS);
    localStorage.setItem('cyberpath_active_email', email);
    localStorage.setItem(
      `cyberpath_user_${email}`,
      JSON.stringify({ user: newUser, skills: INITIAL_SKILLS })
    );

    notifyLedger(`Google account connected: ${email}. Real-time learning tracking started.`);
    setCurrentTab('dashboard');
  };

  // Handler: Sign out
  const handleLogout = () => {
    localStorage.removeItem('cyberpath_active_email');
    setUser(INITIAL_USER);
    setSkills(INITIAL_SKILLS);
    notifyLedger('Signed out. Switched to guest mode with uncalibrated baseline.');
  };

  // Handler: Reset learning progress to 0
  const handleResetProgress = () => {
    if (user.email) {
      localStorage.removeItem(`cyberpath_user_${user.email}`);
    }
    setUser((prev) => ({
      ...prev,
      currentLevel: 0,
      xp: 0,
      stars: 0,
      completedLessons: [],
      completedLabs: [],
      solvedChallenges: [],
      assessmentCompleted: false,
      interviewScore: null,
    }));
    setSkills(INITIAL_SKILLS);
    notifyLedger('Learning ledger reset to zero. All skills and metrics re-calibrated to 0.');
  };

  // Handler: Change target role
  const handleChangeTargetRole = (role: TargetRole) => {
    setUser((prev) => ({ ...prev, targetRole: role }));
    notifyLedger(`Target career role switched to ${role.replace('_', ' ')}.`);
  };

  // Handler: Submit CTF Flag
  const handleSubmitFlag = (
    challengeId: string,
    rawFlagInput: string,
    penaltyXp: number
  ): { success: boolean; message: string } => {
    const challenge = CTF_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      return { success: false, message: 'Challenge not recognized in platform catalog.' };
    }

    // Anti-farming check
    if (user.solvedChallenges.includes(challengeId)) {
      return { success: false, message: 'Challenge already solved. Flags can only be claimed once.' };
    }

    if (rawFlagInput.trim() !== challenge.rawFlag.trim()) {
      return { success: false, message: 'Incorrect flag. Check format: CYBERPATH{...}' };
    }

    // Correct flag
    const earnedXp = Math.max(25, challenge.baseXp - penaltyXp);
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      stars: prev.stars + challenge.starsReward,
      solvedChallenges: [...prev.solvedChallenges, challengeId],
    }));

    // Update corresponding skill dynamically
    if (challenge.associatedSkillId) {
      setSkills((prev) =>
        prev.map((sk) => {
          if (sk.id === challenge.associatedSkillId) {
            const newScore = Math.min(100, (sk.score === 0 ? 30 : sk.score) + 20);
            return {
              ...sk,
              score: newScore,
              confidence: Math.min(90, (sk.confidence === 0 ? 25 : sk.confidence) + 15),
              evidenceCount: sk.evidenceCount + 1,
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return sk;
        })
      );
    }

    notifyLedger(`Flag Accepted! +${earnedXp} XP, +${challenge.starsReward} ★ registered to your ledger.`);

    return {
      success: true,
      message: `Flag Accepted! +${earnedXp} XP and +${challenge.starsReward} ★ registered.`,
    };
  };

  // Handler: Complete Quiz in Lesson
  const handleCompleteQuiz = (lessonId: string, score: number, maxScore: number) => {
    const xpBonus = score * 25;
    const skillId = getSkillIdForLesson(lessonId);

    setUser((prev) => ({
      ...prev,
      xp: prev.xp + xpBonus,
    }));

    if (score > 0) {
      const percentageScore = Math.round((score / maxScore) * 25);
      setSkills((prev) =>
        prev.map((sk) => {
          if (sk.id === skillId) {
            const base = sk.score === 0 ? 20 : sk.score;
            return {
              ...sk,
              score: Math.min(100, base + percentageScore),
              confidence: Math.min(85, (sk.confidence === 0 ? 20 : sk.confidence) + 15),
              evidenceCount: sk.evidenceCount + 1,
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return sk;
        })
      );

      notifyLedger(`Quiz Passed: +${xpBonus} XP earned. Recorded quiz evidence in Skill Graph.`);
    }
  };

  // Handler: Complete Lesson
  const handleCompleteLesson = (lessonId: string) => {
    if (!user.completedLessons.includes(lessonId)) {
      const skillId = getSkillIdForLesson(lessonId);

      setUser((prev) => {
        const nextStars = prev.stars + 2;
        const nextXp = prev.xp + 100;
        const nextCompleted = [...prev.completedLessons, lessonId];
        // Dynamic level unlock: 2 lessons unlocks Level 1, 5 unlocks Level 2, etc.
        const nextLevel = Math.min(11, Math.floor(nextCompleted.length / 2));

        return {
          ...prev,
          stars: nextStars,
          xp: nextXp,
          completedLessons: nextCompleted,
          currentLevel: Math.max(prev.currentLevel, nextLevel),
        };
      });

      // Update skill node with verified theory evidence
      setSkills((prev) =>
        prev.map((sk) => {
          if (sk.id === skillId) {
            const base = sk.score === 0 ? 25 : sk.score;
            return {
              ...sk,
              score: Math.min(100, base + 25),
              confidence: Math.min(85, (sk.confidence === 0 ? 20 : sk.confidence) + 20),
              evidenceCount: sk.evidenceCount + 1,
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return sk;
        })
      );

      notifyLedger(`Lesson complete! +100 XP, +2 ★. Skill score updated with verified evidence.`);
    }
  };

  // Handler: Lab Verification in Terminal
  const handleLabVerified = (labId: string) => {
    if (!user.completedLabs.includes(labId)) {
      setUser((prev) => ({
        ...prev,
        xp: prev.xp + 150,
        stars: prev.stars + 3,
        completedLabs: [...prev.completedLabs, labId],
      }));

      // Boost targeted practical skill
      const targetSkill = labId.includes('net') ? 'networking' : labId.includes('siem') ? 'blue-team' : 'linux';

      setSkills((prev) =>
        prev.map((s) => {
          if (s.id === targetSkill) {
            const base = s.score === 0 ? 30 : s.score;
            return {
              ...s,
              score: Math.min(100, base + 25),
              confidence: Math.min(90, (s.confidence === 0 ? 30 : s.confidence) + 25),
              evidenceCount: s.evidenceCount + 1,
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return s;
        })
      );

      notifyLedger(`Practical Lab verified! +150 XP, +3 ★. Practical evidence recorded.`);
    }
  };

  // Handler: Diagnostic Assessment Finished
  const handleCompleteAssessment = (results: { domain: string; correct: boolean }[]) => {
    setUser((prev) => ({
      ...prev,
      assessmentCompleted: true,
      xp: prev.xp + 200,
      stars: prev.stars + 3,
    }));

    // Calibrate domains from actual quiz answers
    setSkills((prev) =>
      prev.map((s) => {
        const domainMatch = results.filter((r) =>
          r.domain.toLowerCase().includes(s.name.toLowerCase().slice(0, 4))
        );
        if (domainMatch.length > 0) {
          const correctCount = domainMatch.filter((r) => r.correct).length;
          const calibratedScore = Math.round((correctCount / domainMatch.length) * 60) + 20;
          return {
            ...s,
            score: calibratedScore,
            confidence: Math.min(85, (s.confidence === 0 ? 30 : s.confidence) + 25),
            evidenceCount: s.evidenceCount + domainMatch.length,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      })
    );

    notifyLedger('Diagnostic Assessment finished! Core baseline skills calibrated from your results.');
  };

  // Handler: Mock Interview Score
  const handleScoreInterview = (score: number) => {
    setUser((prev) => ({ ...prev, interviewScore: score, xp: prev.xp + 75 }));
    notifyLedger(`Mock Interview evaluated! Score: ${score}/100. Career readiness recalculated.`);
  };

  // Handler: Update ATS Result from analyzer
  const handleUpdateAtsResult = (result: ATSAnalysisResult, rawText: string) => {
    setAtsResult(result);
    setActiveResumeText(rawText);
    notifyLedger(`ATS Resume parsed: Score ${result.overallAtsScore}/100 with ${result.evidencedKeywords.length} verified keywords.`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        user={user}
        onChangeTargetRole={handleChangeTargetRole}
        onOpenGoogleAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onResetProgress={handleResetProgress}
      />

      {/* Real-time Ledger Notification Toast */}
      {recentNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#161b22] border border-emerald-500/50 rounded-lg shadow-2xl p-3.5 flex items-center space-x-3 text-xs font-mono animate-slideIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
          <span className="text-slate-200">{recentNotification}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingView
            onNavigate={(t) => setCurrentTab(t)}
            user={user}
            onOpenGoogleAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            user={user}
            skills={skills}
            careerReadiness={careerReadiness}
            atsResult={atsResult}
            onNavigate={(t) => setCurrentTab(t)}
            onOpenGoogleAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'learning' && (
          <LearningView
            user={user}
            onCompleteQuiz={handleCompleteQuiz}
            onCompleteLesson={handleCompleteLesson}
          />
        )}

        {currentTab === 'labs' && <LabsView onLabVerified={handleLabVerified} />}

        {currentTab === 'challenges' && (
          <ChallengesView user={user} onSubmitFlag={handleSubmitFlag} />
        )}

        {currentTab === 'skills' && <SkillsView user={user} skills={skills} />}

        {currentTab === 'resume-analyzer' && (
          <ResumeAnalyzerView
            user={user}
            atsResult={atsResult}
            onUpdateResult={handleUpdateAtsResult}
          />
        )}

        {currentTab === 'resume-builder' && <ResumeBuilderView user={user} />}

        {currentTab === 'job-match' && (
          <JobMatchView user={user} resumeText={activeResumeText} />
        )}

        {currentTab === 'career' && (
          <CareerView
            user={user}
            careerReadiness={careerReadiness}
            onChangeRole={handleChangeTargetRole}
            onNavigate={(t) => setCurrentTab(t)}
          />
        )}

        {currentTab === 'interview' && (
          <InterviewView user={user} onScoreInterview={handleScoreInterview} />
        )}

        {currentTab === 'assessment' && (
          <AssessmentView
            onCompleteAssessment={handleCompleteAssessment}
            onNavigate={(t) => setCurrentTab(t)}
          />
        )}

        {currentTab === 'certificate' && <CertificateView user={user} />}
      </main>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleGoogleLoginSuccess}
      />
    </div>
  );
}
