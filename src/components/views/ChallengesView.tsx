import React, { useState, useMemo } from 'react';
import {
  Flag,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Award,
  Zap,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  FileCode,
  Layers,
  Filter,
  Search,
  Copy,
  Check,
  Lock,
  Unlock,
  Sparkles,
  Cpu,
  Globe,
  Shield,
  Eye,
  RefreshCw,
  Wrench,
  Hash,
  ArrowUpDown,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Flame,
  Binary
} from 'lucide-react';
import { CTF_CHALLENGES } from '../../data/challenges';
import { CTFChallenge, UserProfile } from '../../types';

interface ChallengesViewProps {
  user: UserProfile;
  onSubmitFlag: (challengeId: string, flag: string, penaltyXp: number) => { success: boolean; message: string };
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({ user, onSubmitFlag }) => {
  // Filters and state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [filterSolvedState, setFilterSolvedState] = useState<'ALL' | 'UNSOLVED' | 'SOLVED'>('ALL');
  const [viewMode, setViewMode] = useState<'GRID' | 'COMPACT'>('GRID');

  // Interaction state
  const [revealedHints, setRevealedHints] = useState<Record<string, number[]>>({});
  const [hintToConfirm, setHintToConfirm] = useState<{ challengeId: string; hintIndex: number; penalty: number } | null>(null);
  const [expandedArtifacts, setExpandedArtifacts] = useState<Record<string, boolean>>({});
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [feedbackMessages, setFeedbackMessages] = useState<Record<string, { success: boolean; message: string }>>({});
  const [copiedTargetId, setCopiedTargetId] = useState<string | null>(null);
  const [copiedArtifactId, setCopiedArtifactId] = useState<string | null>(null);
  const [activeArtifactTab, setActiveArtifactTab] = useState<Record<string, 'ARTIFACT' | 'TACTICS'>>({});

  // Cyber Analyst Quick Tools (Decoder / Converter)
  const [showToolsDrawer, setShowToolsDrawer] = useState<boolean>(false);
  const [toolActiveTab, setToolActiveTab] = useState<'BASE64' | 'HEX' | 'URL' | 'ROT13'>('BASE64');
  const [toolInput, setToolInput] = useState<string>('');
  const [toolOutput, setToolOutput] = useState<string>('');
  const [toolCopied, setToolCopied] = useState<boolean>(false);
  const [rotShift, setRotShift] = useState<number>(13);

  // Full-screen inspection modal
  const [inspectModalChallenge, setInspectModalChallenge] = useState<CTFChallenge | null>(null);

  const categories = ['All', 'Networking', 'Linux', 'Web Security', 'SOC & Logs', 'Cryptography', 'Cloud Security'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Counts for pills
  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = { All: CTF_CHALLENGES.length };
    CTF_CHALLENGES.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, []);

  const countsByDifficulty = useMemo(() => {
    const counts: Record<string, number> = { All: CTF_CHALLENGES.length };
    CTF_CHALLENGES.forEach((c) => {
      counts[c.difficulty] = (counts[c.difficulty] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered list
  const filteredChallenges = useMemo(() => {
    return CTF_CHALLENGES.filter((c) => {
      const isSolved = user.solvedChallenges.includes(c.id);

      if (filterSolvedState === 'UNSOLVED' && isSolved) return false;
      if (filterSolvedState === 'SOLVED' && !isSolved) return false;

      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'All' && c.difficulty !== selectedDifficulty) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = c.title.toLowerCase().includes(query);
        const matchesScenario = c.scenario.toLowerCase().includes(query);
        const matchesObjective = c.objective.toLowerCase().includes(query);
        const matchesCategory = c.category.toLowerCase().includes(query);
        const matchesDifficulty = c.difficulty.toLowerCase().includes(query);
        const matchesTarget = c.targetEnvironment.toLowerCase().includes(query);
        const matchesCve = c.cve?.toLowerCase().includes(query);
        const matchesTags = c.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesArtifact = c.artifactSnippet?.toLowerCase().includes(query);

        return (
          matchesTitle ||
          matchesScenario ||
          matchesObjective ||
          matchesCategory ||
          matchesDifficulty ||
          matchesTarget ||
          matchesCve ||
          matchesTags ||
          matchesArtifact
        );
      }

      return true;
    });
  }, [selectedCategory, selectedDifficulty, filterSolvedState, searchQuery, user.solvedChallenges]);

  // Statistics
  const expertSolvedCount = useMemo(() => {
    return CTF_CHALLENGES.filter((c) => c.difficulty === 'Expert' && user.solvedChallenges.includes(c.id)).length;
  }, [user.solvedChallenges]);

  const totalExpertCount = useMemo(() => {
    return CTF_CHALLENGES.filter((c) => c.difficulty === 'Expert').length;
  }, []);

  const solvedPercentage = Math.round((user.solvedChallenges.length / CTF_CHALLENGES.length) * 100) || 0;

  // Clearance Rank
  const userRank = useMemo(() => {
    const solved = user.solvedChallenges.length;
    if (solved >= 20) return { title: 'Apex Cyber Commander', color: 'text-purple-400', badge: 'bg-purple-950/80 border-purple-500' };
    if (solved >= 14) return { title: 'Senior Exploit Specialist', color: 'text-rose-400', badge: 'bg-rose-950/80 border-rose-500' };
    if (solved >= 8) return { title: 'Tactical Red/Blue Operator', color: 'text-amber-400', badge: 'bg-amber-950/80 border-amber-500' };
    if (solved >= 3) return { title: 'Security Analyst Junior', color: 'text-cyan-400', badge: 'bg-cyan-950/80 border-cyan-500' };
    return { title: 'Security Apprentice', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-500' };
  }, [user.solvedChallenges.length]);

  // Handlers
  const handleCopyTarget = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTargetId(id);
    setTimeout(() => setCopiedTargetId(null), 2000);
  };

  const handleCopyArtifact = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifactId(id);
    setTimeout(() => setCopiedArtifactId(null), 2000);
  };

  const handlePasteFlag = async (challengeId: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setFlagInputs((prev) => ({ ...prev, [challengeId]: text.trim() }));
      }
    } catch {
      // Clipboard permission denied or fallback
    }
  };

  const handleConfirmHintUnlock = () => {
    if (!hintToConfirm) return;
    const { challengeId, hintIndex } = hintToConfirm;
    setRevealedHints((prev) => {
      const current = prev[challengeId] || [];
      if (current.includes(hintIndex)) return prev;
      return { ...prev, [challengeId]: [...current, hintIndex] };
    });
    setHintToConfirm(null);
  };

  const handleToggleArtifact = (challengeId: string) => {
    setExpandedArtifacts((prev) => ({
      ...prev,
      [challengeId]: !prev[challengeId]
    }));
  };

  const handleSubmit = (challenge: CTFChallenge) => {
    const input = flagInputs[challenge.id] || '';
    if (!input.trim()) return;

    const hintsUsed = revealedHints[challenge.id] || [];
    const penalty = hintsUsed.reduce((sum, hIdx) => sum + (challenge.hints[hIdx]?.penaltyXp || 0), 0);

    const result = onSubmitFlag(challenge.id, input.trim(), penalty);
    setFeedbackMessages((prev) => ({ ...prev, [challenge.id]: result }));
  };

  // Quick Tools transformations
  const runDecoder = (type: 'BASE64' | 'HEX' | 'URL' | 'ROT13', input: string, shift: number) => {
    if (!input) {
      setToolOutput('');
      return;
    }
    try {
      if (type === 'BASE64') {
        // Try decoding first, if fails, encode
        try {
          setToolOutput(atob(input.trim()));
        } catch {
          setToolOutput(btoa(input));
        }
      } else if (type === 'HEX') {
        const clean = input.replace(/[^0-9a-fA-F]/g, '');
        let str = '';
        for (let i = 0; i < clean.length; i += 2) {
          str += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
        }
        setToolOutput(str);
      } else if (type === 'URL') {
        setToolOutput(decodeURIComponent(input));
      } else if (type === 'ROT13') {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const s = ((shift % 26) + 26) % 26;
        const res = input.replace(/[a-zA-Z]/g, (c) => {
          const isUpper = c === c.toUpperCase();
          const lower = c.toLowerCase();
          const idx = alphabet.indexOf(lower);
          if (idx === -1) return c;
          const shifted = alphabet[(idx + s) % 26];
          return isUpper ? shifted.toUpperCase() : shifted;
        });
        setToolOutput(res);
      }
    } catch (e: any) {
      setToolOutput(`[Conversion Error]: ${e.message || 'Invalid format'}`);
    }
  };

  const handleToolTabChange = (tab: 'BASE64' | 'HEX' | 'URL' | 'ROT13') => {
    setToolActiveTab(tab);
    runDecoder(tab, toolInput, rotShift);
  };

  const handleToolInputChange = (val: string) => {
    setToolInput(val);
    runDecoder(toolActiveTab, val, rotShift);
  };

  const handleRotShiftChange = (shift: number) => {
    setRotShift(shift);
    runDecoder(toolActiveTab, toolInput, shift);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* ================= HEADER & COMMAND OPS DASHBOARD ================= */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-[#0d131f] to-slate-950 border border-slate-800/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Subtle background tech glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-emerald-400 tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CTF OPERATIONS COMMAND // LIVE ARENA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>CTF Flag Capture Arena</span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/60 text-purple-300 font-mono font-semibold">
                {CTF_CHALLENGES.length} DRILLS
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify real-world offensive exploitation and defensive triage skills across authentic scenarios—from network reconnaissance and web vulnerabilities to kernel eBPF verification escapes, fastbin heap corruption, and Active Directory DCSync forensics.
            </p>
          </div>

          {/* Quick Metrics & Rank Badge */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Rank Card */}
            <div className={`px-4 py-3 rounded-xl border ${userRank.badge} text-left min-w-[140px]`}>
              <div className="text-[10px] font-mono uppercase text-slate-400">Clearance Tier</div>
              <div className={`text-sm font-bold font-mono mt-0.5 truncate ${userRank.color}`}>
                {userRank.title}
              </div>
            </div>

            {/* Solved Progress */}
            <div className="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-left min-w-[140px]">
              <div className="text-[10px] font-mono uppercase text-slate-400">Arena Completion</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-extrabold text-white font-mono">
                  {user.solvedChallenges.length} <span className="text-xs text-slate-500 font-normal">/ {CTF_CHALLENGES.length}</span>
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">({solvedPercentage}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${solvedPercentage}%` }}
                />
              </div>
            </div>

            {/* Expert Level Highlight Pill */}
            <div className="px-4 py-3 rounded-xl bg-purple-950/40 border border-purple-800/80 text-left min-w-[140px] shadow-sm shadow-purple-900/20">
              <div className="text-[10px] font-mono uppercase text-purple-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-purple-400" />
                <span>Expert Cleared</span>
              </div>
              <div className="text-base font-extrabold text-purple-300 font-mono mt-0.5">
                {expertSolvedCount} <span className="text-xs text-purple-400/60 font-normal">/ {totalExpertCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Toolbar Switcher on the Header */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>Points Harvested:</span>
            <span className="text-amber-400 font-bold">+{user.xp} XP</span>
            <span className="text-slate-600">|</span>
            <span>Mastery Stars:</span>
            <span className="text-cyan-400 font-bold">★ {user.stars}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowToolsDrawer(!showToolsDrawer)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 border ${
                showToolsDrawer
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm shadow-cyan-500/30'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{showToolsDrawer ? 'Hide Analyst Decoder' : 'Cyber Analyst Quick Decoder'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= CYBER ANALYST QUICK TOOLS DRAWER ================= */}
      {showToolsDrawer && (
        <div className="p-5 rounded-2xl bg-[#111622] border border-cyan-500/40 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Integrated Cyber Analyst Workbench
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                CLIENT-SIDE ARTIFACT DECODER
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              {(['BASE64', 'HEX', 'URL', 'ROT13'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleToolTabChange(tab)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    toolActiveTab === tab
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Input Payload:</span>
                {toolActiveTab === 'ROT13' && (
                  <div className="flex items-center space-x-2">
                    <span>Shift: {rotShift}</span>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={rotShift}
                      onChange={(e) => handleRotShiftChange(parseInt(e.target.value))}
                      className="w-20 accent-cyan-400"
                    />
                  </div>
                )}
              </div>
              <textarea
                value={toolInput}
                onChange={(e) => handleToolInputChange(e.target.value)}
                placeholder={
                  toolActiveTab === 'BASE64'
                    ? 'Paste base64 or plaintext to decode / encode...'
                    : toolActiveTab === 'HEX'
                    ? 'Paste hex bytes (e.g. 43 59 42 45 52 50 41 54 48)...'
                    : toolActiveTab === 'URL'
                    ? 'Paste URL encoded strings (e.g. %43%59%42%45%52)...'
                    : 'Paste cipher text for Caesar / ROT cipher...'
                }
                rows={3}
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 resize-none placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Decoded / Transformed Result:</span>
                {toolOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(toolOutput);
                      setToolCopied(true);
                      setTimeout(() => setToolCopied(false), 2000);
                    }}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {toolCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{toolCopied ? 'Copied!' : 'Copy Result'}</span>
                  </button>
                )}
              </div>
              <div className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 h-[76px] overflow-y-auto break-all select-all">
                {toolOutput || <span className="text-slate-600 italic">Output will render automatically here...</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TACTICAL SEARCH & DUAL-AXIS FILTERS ================= */}
      <div className="space-y-4 bg-[#111622] p-5 rounded-2xl border border-slate-800">
        {/* Search input and Quick Stats row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CTF drills by title, keyword, CVE, tool (nmap, gdb, wireshark, mimikatz), or scenario..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Solved Status Filter Toggle */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-between">
            <button
              onClick={() => setFilterSolvedState('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filterSolvedState === 'ALL'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({CTF_CHALLENGES.length})
            </button>
            <button
              onClick={() => setFilterSolvedState('UNSOLVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filterSolvedState === 'UNSOLVED'
                  ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unsolved ({CTF_CHALLENGES.length - user.solvedChallenges.length})
            </button>
            <button
              onClick={() => setFilterSolvedState('SOLVED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filterSolvedState === 'SOLVED'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Solved ({user.solvedChallenges.length})
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-cyan-400" /> Category:
          </span>
          {categories.map((cat) => {
            const count = countsByCategory[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-slate-950/40 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1">Severity:</span>
            {difficulties.map((diff) => {
              const count = countsByDifficulty[diff] || 0;
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                    isSelected
                      ? diff === 'Beginner'
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm shadow-emerald-500/20'
                        : diff === 'Intermediate'
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-sm shadow-cyan-500/20'
                        : diff === 'Advanced'
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm shadow-amber-500/20'
                        : diff === 'Expert'
                        ? 'bg-purple-600 text-white font-extrabold border-purple-400 shadow-md shadow-purple-500/40 animate-pulse'
                        : 'bg-white text-slate-950 font-bold border-white'
                      : diff === 'Expert'
                      ? 'bg-purple-950/50 text-purple-300 hover:bg-purple-900/60 border-purple-800'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  {diff === 'Expert' && <Flame className="w-3 h-3 text-purple-400" />}
                  <span>{diff}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-400">
            Displaying <span className="text-emerald-400 font-bold">{filteredChallenges.length}</span> of {CTF_CHALLENGES.length} drills
          </div>
        </div>
      </div>

      {/* ================= CHALLENGES DISPLAY (GRID) ================= */}
      {filteredChallenges.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#161b22] border border-slate-800 space-y-3">
          <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No challenges match your filter parameters</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search query, or reset the category and severity filters to browse all available drills.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setFilterSolvedState('ALL');
            }}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredChallenges.map((ch) => {
            const isSolved = user.solvedChallenges.includes(ch.id);
            const activeHints = revealedHints[ch.id] || [];
            const feedback = feedbackMessages[ch.id];
            const isArtifactOpen = expandedArtifacts[ch.id] ?? false;
            const currentTab = activeArtifactTab[ch.id] || 'ARTIFACT';

            const isExpert = ch.difficulty === 'Expert';

            return (
              <div
                key={ch.id}
                className={`relative rounded-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isSolved
                    ? 'border-2 border-emerald-500/60 bg-gradient-to-b from-[#111c19] to-[#0e171b] shadow-lg shadow-emerald-950/20'
                    : isExpert
                    ? 'border-2 border-purple-500/60 bg-gradient-to-b from-[#191124] to-[#121622] shadow-xl shadow-purple-950/30'
                    : 'border border-slate-800 bg-[#161b22] hover:border-slate-700'
                }`}
              >
                {/* Expert Neon Top Accent Bar */}
                {isExpert && (
                  <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
                )}

                <div className="p-6 space-y-5">
                  {/* Card Header: Category & Severity Badges & XP */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-700">
                        {ch.category}
                      </span>

                      <span
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-md font-bold flex items-center gap-1 border ${
                          ch.difficulty === 'Beginner'
                            ? 'bg-emerald-950/90 text-emerald-400 border-emerald-800'
                            : ch.difficulty === 'Intermediate'
                            ? 'bg-cyan-950/90 text-cyan-400 border-cyan-800'
                            : ch.difficulty === 'Advanced'
                            ? 'bg-amber-950/90 text-amber-400 border-amber-800'
                            : 'bg-purple-950 text-purple-200 border-purple-600 shadow-sm shadow-purple-500/50'
                        }`}
                      >
                        {isExpert && <Flame className="w-3 h-3 text-purple-400" />}
                        {ch.difficulty}
                      </span>

                      {ch.cve && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800">
                          {ch.cve}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs font-mono">
                      <span className="text-amber-400 font-bold">+{ch.baseXp} XP</span>
                      <span className="text-cyan-400 font-bold">★ +{ch.starsReward}</span>
                      {isSolved && (
                        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SOLVED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Scenario */}
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {ch.scenario}
                    </p>
                  </div>

                  {/* Objective */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-400 font-mono text-[11px] uppercase mr-1.5">
                      MISSION OBJECTIVE:
                    </span>
                    {ch.objective}
                  </div>

                  {/* Target Environment Box with Quick Copy */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div className="text-xs font-mono truncate">
                        <span className="text-slate-500 mr-1.5">Target:</span>
                        <span className="text-emerald-400 font-semibold">{ch.targetEnvironment}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyTarget(ch.targetEnvironment, ch.id)}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors flex-shrink-0"
                      title="Copy target address to clipboard"
                    >
                      {copiedTargetId === ch.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Attack Tags & MITRE Reference */}
                  {(ch.tags || ch.mitreTactic) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {ch.mitreTactic && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          MITRE: <span className="text-slate-300">{ch.mitreTactic}</span>
                        </span>
                      )}
                      {ch.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900/60 text-slate-400 border border-slate-800/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Collapsible Inspection Artifact / Terminal Output */}
                  {ch.artifactSnippet && (
                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                      {/* Drawer Toggle Header */}
                      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800">
                        <button
                          onClick={() => handleToggleArtifact(ch.id)}
                          className="flex items-center space-x-2 text-xs font-mono text-slate-200 hover:text-cyan-400 transition-colors text-left"
                        >
                          <FileCode className="w-4 h-4 text-cyan-400" />
                          <span className="font-semibold">
                            Inspection Artifact ({ch.artifactType || 'Terminal / Log'})
                          </span>
                        </button>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setInspectModalChallenge(ch)}
                            className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
                            title="Expand to Fullscreen Modal"
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Expand</span>
                          </button>

                          <button
                            onClick={() => handleCopyArtifact(ch.artifactSnippet || '', ch.id)}
                            className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
                            title="Copy artifact payload"
                          >
                            {copiedArtifactId === ch.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleToggleArtifact(ch.id)}
                            className="text-slate-400 hover:text-white p-1"
                          >
                            {isArtifactOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Snippet Output */}
                      {isArtifactOpen && (
                        <div className="p-3.5 font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-64 select-text bg-[#0a0e14] border-t border-slate-900">
                          {ch.artifactSnippet}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hints System with Safe Confirmation Modal */}
                  {ch.hints && ch.hints.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Tactical Guidance & Hints ({ch.hints.length}):</span>
                        </div>
                        <span className="text-[10px] text-slate-500">XP deduction applies upon unlock</span>
                      </div>

                      <div className="space-y-2">
                        {ch.hints.map((hint, hIdx) => {
                          const revealed = activeHints.includes(hIdx);

                          return (
                            <div key={hIdx} className="text-xs">
                              {revealed ? (
                                <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/40 text-slate-300 font-mono text-[11px] space-y-1">
                                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>HINT {hIdx + 1} (UNLOCKED):</span>
                                  </div>
                                  <p className="text-slate-300 leading-relaxed pl-5">
                                    {hint.text}
                                  </p>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setHintToConfirm({ challengeId: ch.id, hintIndex: hIdx, penalty: hint.penaltyXp })
                                  }
                                  className="w-full text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 hover:text-amber-400 flex items-center justify-between transition-colors"
                                >
                                  <div className="flex items-center space-x-2">
                                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Unlock Hint {hIdx + 1}</span>
                                  </div>
                                  <span className="text-rose-400 font-semibold">-{hint.penaltyXp} XP Penalty</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Flag Submission or Solved Confirmation */}
                <div className="p-6 pt-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
                  {isSolved ? (
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/60 text-xs text-emerald-300 space-y-1.5">
                      <div className="font-bold flex items-center space-x-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>FLAG CAPTURED & AUDIT VERIFIED</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono leading-relaxed pl-6">
                        <span className="text-emerald-400 font-semibold">Key Takeaway:</span> {ch.learningTakeaway}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={flagInputs[ch.id] || ''}
                            onChange={(e) =>
                              setFlagInputs((prev) => ({ ...prev, [ch.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSubmit(ch);
                            }}
                            placeholder="CYBERPATH{...}"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-600 pr-16"
                          />
                          <button
                            onClick={() => handlePasteFlag(ch.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Paste from clipboard"
                          >
                            Paste
                          </button>
                        </div>
                        <button
                          onClick={() => handleSubmit(ch)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs font-mono transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                        >
                          Submit
                        </button>
                      </div>

                      {feedback && (
                        <div
                          className={`mt-2.5 p-2 rounded-lg text-xs font-mono flex items-center space-x-2 ${
                            feedback.success
                              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                              : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                          }`}
                        >
                          {feedback.success ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          )}
                          <span>{feedback.message}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= HINT UNLOCK CONFIRMATION MODAL ================= */}
      {hintToConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-amber-500/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white font-mono">Unlock Strategic Hint?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unlocking Hint #{hintToConfirm.hintIndex + 1} will incur a{' '}
              <span className="text-rose-400 font-bold font-mono">
                -{hintToConfirm.penalty} XP
              </span>{' '}
              deduction from this challenge's base reward points.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setHintToConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmHintUnlock}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors"
              >
                Deduct XP & Reveal Hint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FULLSCREEN INSPECTION MODAL ================= */}
      {inspectModalChallenge && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f141c] border border-cyan-500/50 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-white">
                  Evidence Inspector: {inspectModalChallenge.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectModalChallenge(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto font-mono text-xs text-slate-200 whitespace-pre leading-relaxed select-text bg-[#070a0f] flex-1">
              {inspectModalChallenge.artifactSnippet}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs font-mono text-slate-400">
                Target: <span className="text-emerald-400">{inspectModalChallenge.targetEnvironment}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inspectModalChallenge.artifactSnippet || '');
                  setInspectModalChallenge(null);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Payload & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
