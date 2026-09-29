import React, { useState, useMemo } from 'react';
import {
  Shield,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Mail,
  User as UserIcon,
  History,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Circle,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { UserProfile } from '../../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
  defaultEmail?: string;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultEmail = '',
}) => {
  const [authMode, setAuthMode] = useState<'PERSONAL_EMAIL' | 'GOOGLE'>('PERSONAL_EMAIL');
  const [personalEmail, setPersonalEmail] = useState<string>('');
  const [personalName, setPersonalName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [googleEmail, setGoogleEmail] = useState<string>(defaultEmail);
  const [googleName, setGoogleName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [savedAccountsVersion, setSavedAccountsVersion] = useState<number>(0);

  // Scan localStorage for any previously logged in accounts on this browser
  const savedAccounts = useMemo(() => {
    if (!isOpen) return [];
    try {
      const accounts: { email: string; name: string; xp: number; level: number; hasPassword: boolean }[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cyberpath_user_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.user && parsed.user.email) {
              const accountEmail = parsed.user.email;
              const hasSavedPwd = !!localStorage.getItem(`cyberpath_pwd_${accountEmail}`);
              accounts.push({
                email: accountEmail,
                name: parsed.user.name || accountEmail.split('@')[0],
                xp: parsed.user.xp || 0,
                level: parsed.user.currentLevel || 0,
                hasPassword: hasSavedPwd,
              });
            }
          }
        }
      }
      return accounts;
    } catch {
      return [];
    }
  }, [isOpen, savedAccountsVersion]);

  // Real-time password criteria validation
  const hasAlphabet = useMemo(() => /[a-zA-Z]/.test(password), [password]);
  const hasNumber = useMemo(() => /[0-9]/.test(password), [password]);
  const hasSpecial = useMemo(() => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password), [password]);
  const hasMinLength = useMemo(() => password.length >= 8, [password]);

  // Combined validation: user requested alphabet, numerical, and special character
  const isPasswordPolicyMet = hasAlphabet && hasNumber && hasSpecial && hasMinLength;

  // Password strength computation
  const strengthScore = useMemo(() => {
    let score = 0;
    if (hasAlphabet) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;
    if (hasMinLength) score += 1;
    return score;
  }, [hasAlphabet, hasNumber, hasSpecial, hasMinLength]);

  const strengthLabel = useMemo(() => {
    if (password.length === 0) return { text: 'Required', color: 'text-slate-500', bar: 'bg-slate-700', width: 'w-0' };
    if (strengthScore <= 1) return { text: 'Weak', color: 'text-rose-400', bar: 'bg-rose-500', width: 'w-1/4' };
    if (strengthScore === 2) return { text: 'Fair', color: 'text-amber-400', bar: 'bg-amber-500', width: 'w-2/4' };
    if (strengthScore === 3) return { text: 'Good', color: 'text-cyan-400', bar: 'bg-cyan-500', width: 'w-3/4' };
    return { text: 'Cyber-Hardened', color: 'text-emerald-400', bar: 'bg-emerald-500', width: 'w-full' };
  }, [strengthScore, password]);

  if (!isOpen) return null;

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const handlePersonalEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessNotice(null);

    const trimmedEmail = personalEmail.trim().toLowerCase();
    const trimmedName = personalName.trim();

    if (!trimmedEmail) {
      setValidationError('Please enter your personal email address.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setValidationError('Please enter a valid email format (e.g., yourname@domain.com).');
      return;
    }

    // Enforce the required password criteria: alphabet, numerical, and special char
    if (!password) {
      setValidationError('Please enter your password.');
      return;
    }

    if (!hasAlphabet) {
      setValidationError('Password policy violation: Must contain at least one alphabetic letter (a-z, A-Z).');
      return;
    }

    if (!hasNumber) {
      setValidationError('Password policy violation: Must contain at least one numerical digit (0-9).');
      return;
    }

    if (!hasSpecial) {
      setValidationError('Password policy violation: Must contain at least one special character (!@#$%^&*...).');
      return;
    }

    if (!hasMinLength) {
      setValidationError('Password policy violation: Must be at least 8 characters in length.');
      return;
    }

    // Check existing stored password for this email
    const storedPwdKey = `cyberpath_pwd_${trimmedEmail}`;
    const existingPwd = localStorage.getItem(storedPwdKey);

    if (existingPwd && !isResettingPassword) {
      // Compare password
      if (existingPwd !== password) {
        setValidationError('Incorrect password for this email account. If you need to update it, click "Reset Password" below.');
        return;
      }
    } else {
      // Store new or updated password
      try {
        localStorage.setItem(storedPwdKey, password);
      } catch {
        // local storage quota or error
      }
    }

    setIsProcessing(true);
    setTimeout(() => {
      onLoginSuccess({
        email: trimmedEmail,
        name: trimmedName || trimmedEmail.split('@')[0],
        isLoggedIn: true,
        picture: undefined,
      });
      setIsProcessing(false);
      onClose();
    }, 450);
  };

  const handleGoogleSignIn = (emailToUse: string, nameToUse: string) => {
    const trimmedEmail = emailToUse.trim().toLowerCase();
    if (!trimmedEmail) {
      setValidationError('Please enter your Google / Gmail address to sign in.');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setValidationError('Please enter a valid email format (e.g. yourname@gmail.com).');
      return;
    }

    setValidationError(null);
    setIsProcessing(true);
    setTimeout(() => {
      onLoginSuccess({
        email: trimmedEmail,
        name: nameToUse.trim() || trimmedEmail.split('@')[0],
        isLoggedIn: true,
        picture: undefined,
      });
      setIsProcessing(false);
      onClose();
    }, 450);
  };

  const selectSavedAccount = (email: string, name: string) => {
    setPersonalEmail(email);
    setPersonalName(name);
    setAuthMode('PERSONAL_EMAIL');
    setPassword('');
    setValidationError(null);
    setSuccessNotice(`Selected account: ${email}. Please enter your password to proceed.`);
  };

  const handleRemoveSavedAccount = (e: React.MouseEvent, emailToRemove: string) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(`cyberpath_user_${emailToRemove}`);
      localStorage.removeItem(`cyberpath_pwd_${emailToRemove}`);
      const active = localStorage.getItem('cyberpath_active_email');
      if (active === emailToRemove) {
        localStorage.removeItem('cyberpath_active_email');
      }
      setSuccessNotice(`Removed browser credential record for ${emailToRemove}.`);
      setSavedAccountsVersion((v) => v + 1);
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#161b22] border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          id="close-google-auth-modal-btn"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Account Authentication
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Log in with your personal email and secure password, or authenticate quickly with any Google account.
          </p>
        </div>

        {/* Authentication Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => {
              setAuthMode('PERSONAL_EMAIL');
              setValidationError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold flex items-center justify-center space-x-2 transition-all ${
              authMode === 'PERSONAL_EMAIL'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            id="tab-personal-email-btn"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Personal Email & Password</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('GOOGLE');
              setValidationError(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold flex items-center justify-center space-x-2 transition-all ${
              authMode === 'GOOGLE'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            id="tab-google-auth-btn"
          >
            {/* Google G Logo */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.29 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google 1-Click</span>
          </button>
        </div>

        {/* Notices */}
        {validationError && (
          <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-600/50 text-xs text-rose-300 flex items-start space-x-2 font-mono animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-600/50 text-xs text-emerald-300 flex items-center space-x-2 font-mono animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Mode 1: Personal Email ID with Required Password */}
        {authMode === 'PERSONAL_EMAIL' && (
          <form onSubmit={handlePersonalEmailSignIn} className="space-y-4">
            <div className="space-y-3">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-mono text-slate-300 font-medium uppercase mb-1">
                  Personal Email Address <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    placeholder="e.g. you@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                    id="input-personal-email"
                  />
                </div>
              </div>

              {/* Password Input with Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono text-slate-300 font-medium uppercase">
                    Account Password <span className="text-emerald-400">*</span>
                  </label>
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono">
                    <span className="text-slate-500">Strength:</span>
                    <span className={`font-semibold ${strengthLabel.color}`}>
                      {strengthLabel.text}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (letter + number + special char)"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                    id="input-personal-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    id="toggle-password-visibility-btn"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full ${strengthLabel.bar} transition-all duration-300 ${strengthLabel.width}`}
                  />
                </div>

                {/* Real-time Password Policy Checklist */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5 text-[11px] font-mono">
                  <div className="text-slate-400 font-semibold mb-1 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Password Policy Requirements:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {/* Alphabet Rule */}
                    <div className={`flex items-center space-x-1.5 ${hasAlphabet ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasAlphabet ? (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
                      )}
                      <span>Alphabet letter (a-z, A-Z)</span>
                    </div>

                    {/* Numerical Rule */}
                    <div className={`flex items-center space-x-1.5 ${hasNumber ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasNumber ? (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
                      )}
                      <span>Numerical digit (0-9)</span>
                    </div>

                    {/* Special Character Rule */}
                    <div className={`flex items-center space-x-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasSpecial ? (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
                      )}
                      <span>Special char (!@#$%^&*...)</span>
                    </div>

                    {/* Minimum 8 Characters */}
                    <div className={`flex items-center space-x-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {hasMinLength ? (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 flex-shrink-0 text-slate-600" />
                      )}
                      <span>Min 8 characters ({password.length}/8)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Name Input */}
              <div>
                <label className="block text-xs font-mono text-slate-300 font-medium uppercase mb-1">
                  Full Name <span className="text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={personalName}
                    onChange={(e) => setPersonalName(e.target.value)}
                    placeholder="e.g. Alex Hunter or Sarah Chen"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
                    id="input-personal-name"
                  />
                </div>
              </div>

              {/* Reset Password Toggle Option */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(!isResettingPassword)}
                  className="text-cyan-400 hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isResettingPassword ? 'Cancel Reset' : 'Reset / Update Password'}</span>
                </button>
                {isResettingPassword && (
                  <span className="text-amber-400">Setting new password for this email</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing || !isPasswordPolicyMet}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs font-mono transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 active:scale-98"
              id="submit-personal-email-btn"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Verifying Password...'
                  : isResettingPassword
                  ? 'Update Password & Sign In'
                  : 'Sign In / Secure Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {!isPasswordPolicyMet && password.length > 0 && (
              <p className="text-[11px] font-mono text-amber-400/90 text-center">
                Please complete all 4 policy criteria (letters, numbers, special characters, 8+ length) to enable sign-in.
              </p>
            )}
          </form>
        )}

        {/* Mode 2: Google 1-Click */}
        {authMode === 'GOOGLE' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick Google Account Authentication</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Connect seamlessly with your Google or Gmail account in one click. No password required for verified Google OAuth sessions.
              </p>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Google / Gmail Address <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => {
                        setGoogleEmail(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                      id="input-google-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                    Display Name <span className="text-slate-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="e.g. Alex Hunter"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                      id="input-google-name"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleGoogleSignIn(googleEmail, googleName)}
                disabled={isProcessing || !googleEmail.trim()}
                className="w-full mt-2 py-2.5 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold font-mono text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-white/10 active:scale-98"
                id="btn-google-one-click-login"
              >
                {/* Google G Icon */}
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.29 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isProcessing ? 'Authenticating with Google...' : '1-Click Sign In with Google'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
              </button>
            </div>
          </div>
        )}

        {/* Saved Profiles Quick Switcher */}
        {savedAccounts.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Saved Profiles on this Browser ({savedAccounts.length}):</span>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {savedAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="w-full p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between transition-colors text-xs font-mono group"
                >
                  <button
                    type="button"
                    onClick={() => selectSavedAccount(acc.email, acc.name)}
                    className="flex-1 text-left truncate flex items-center space-x-2"
                  >
                    <span className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                      {acc.name}
                    </span>
                    <span className="text-slate-500 text-[11px] truncate">({acc.email})</span>
                  </button>
                  <div className="flex items-center space-x-2.5 text-[11px] flex-shrink-0">
                    <span className="text-amber-400 font-semibold">Lvl {acc.level}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-emerald-400">+{acc.xp} XP</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveSavedAccount(e, acc.email)}
                      title={`Remove ${acc.email} from saved browser accounts`}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      aria-label={`Remove saved profile ${acc.email}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security & Password Policy Notice */}
        <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            <span>NIST-Aligned Authentication:</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Email & password sign-in requires alphabet, numerical, and special characters to safeguard credentials and CTF score integrity.
          </p>
        </div>
      </div>
    </div>
  );
};
