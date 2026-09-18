import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Terminal,
  Flag,
  Award,
  FileText,
  FileEdit,
  GitCompare,
  Briefcase,
  MessageSquare,
  ClipboardCheck,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
  LogOut,
  User,
  RotateCcw,
  Mail,
} from 'lucide-react';
import { NavigationTab, TargetRole, UserProfile } from '../../types';
import { CAREER_PATHS } from '../../data/careerPaths';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  user: UserProfile;
  onChangeTargetRole: (role: TargetRole) => void;
  onOpenGoogleAuth: () => void;
  onLogout: () => void;
  onResetProgress: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  onChangeTargetRole,
  onOpenGoogleAuth,
  onLogout,
  onResetProgress,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { tab: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { tab: 'dashboard', label: 'Dashboard', icon: <Briefcase className="w-4 h-4" /> },
    { tab: 'learning', label: 'Curriculum', icon: <BookOpen className="w-4 h-4" />, badge: 'L0-L11' },
    { tab: 'labs', label: 'Safe Labs', icon: <Terminal className="w-4 h-4" /> },
    { tab: 'challenges', label: 'CTF Range', icon: <Flag className="w-4 h-4" /> },
    { tab: 'skills', label: 'Skill Graph', icon: <Award className="w-4 h-4" /> },
    { tab: 'resume-analyzer', label: 'ATS Analyzer', icon: <FileText className="w-4 h-4" /> },
    { tab: 'resume-builder', label: 'Resume Builder', icon: <FileEdit className="w-4 h-4" /> },
    { tab: 'job-match', label: 'JD Matcher', icon: <GitCompare className="w-4 h-4" /> },
    { tab: 'career', label: 'Career Center', icon: <Sparkles className="w-4 h-4" /> },
    { tab: 'interview', label: 'Interview Prep', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d1117] border-b border-slate-800 text-slate-200">
      {/* Top Utility & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onSelectTab('landing')}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">CYBERPATH</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                PRO-EDITION
              </span>
            </div>
          </button>

          {/* Target Role Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 transition-colors"
              id="role-dropdown-btn"
            >
              <span className="text-slate-500">Track:</span>
              <span className="text-emerald-400 font-semibold">
                {CAREER_PATHS[user.targetRole]?.title.split(' ')[0]} {CAREER_PATHS[user.targetRole]?.title.split(' ')[1]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute left-0 mt-1 w-64 rounded-md bg-[#161b22] border border-slate-700 shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider">
                  Target Cybersecurity Career
                </div>
                {Object.values(CAREER_PATHS).map((cp) => (
                  <button
                    key={cp.role}
                    onClick={() => {
                      onChangeTargetRole(cp.role);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                      user.targetRole === cp.role ? 'text-emerald-400 font-medium bg-emerald-950/20' : 'text-slate-300'
                    }`}
                  >
                    <span>{cp.title}</span>
                    {user.targetRole === cp.role && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Stats Ledger & Google Account Action */}
        <div className="flex items-center space-x-3">
          {/* Real-time Level Badge */}
          <div className="flex items-center space-x-1.5 text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <span className="text-slate-500">LVL</span>
            <span className="text-white font-bold">{user.currentLevel}</span>
          </div>

          {/* XP & Stars Ledger */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
            <div className="flex items-center space-x-1 text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              <span>
                {user.xp} <span className="text-[10px] text-slate-500">XP</span>
              </span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center space-x-1 text-cyan-400">
              <span>★ {user.stars}</span>
            </div>
          </div>

          {/* Google Sign-in / Connected Profile Button */}
          {user.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-900 border border-emerald-500/50 hover:border-emerald-400 text-xs font-mono transition-colors"
                id="user-profile-menu-btn"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium max-w-[100px] truncate hidden md:inline">
                  {user.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Tracking Active" />
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-lg bg-[#161b22] border border-slate-700 shadow-2xl py-2 z-50">
                  <div className="px-3 pb-2 mb-2 border-b border-slate-800 text-xs font-mono">
                    <div className="text-white font-bold">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Google Sync Active</span>
                    </div>
                  </div>

                  <div className="px-2 space-y-1">
                    <button
                      onClick={() => {
                        onSelectTab('skills');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded text-xs text-slate-300 hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Live Skill Graph</span>
                    </button>

                    <button
                      onClick={() => {
                        onResetProgress();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded text-xs text-amber-400 hover:bg-amber-950/30 flex items-center space-x-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Learning Data to 0</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded text-xs text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2 border-t border-slate-800/80 mt-1 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              id="header-sign-in-btn"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Sign In / Personal Email</span>
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            id="mobile-nav-toggle-btn"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Module Navigation Bar */}
      <div className="hidden md:block bg-[#161b22] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
                id={`nav-tab-${item.tab}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161b22] border-b border-slate-800 px-4 py-3 space-y-2">
          <div className="pb-2 border-b border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase">Target Role:</span>
              <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                {CAREER_PATHS[user.targetRole]?.title}
              </div>
            </div>
            {!user.isLoggedIn && (
              <button
                onClick={() => {
                  onOpenGoogleAuth();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => {
                onSelectTab(item.tab);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded ${
                currentTab === item.tab ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
            <span>XP: {user.xp}</span>
            <span>Stars: ★ {user.stars}</span>
            <button
              onClick={() => {
                onSelectTab('certificate');
                setMobileMenuOpen(false);
              }}
              className="text-emerald-400"
            >
              Credentials
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
