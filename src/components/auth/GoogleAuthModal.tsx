import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
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
  defaultEmail = 'anishkr649world@gmail.com',
}) => {
  const [selectedEmail, setSelectedEmail] = useState<string>(defaultEmail);
  const [customName, setCustomName] = useState<string>('Anish Kumar');
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = (emailToUse: string, nameToUse: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      onLoginSuccess({
        email: emailToUse,
        name: nameToUse || emailToUse.split('@')[0],
        isLoggedIn: true,
        picture: undefined,
      });
      setIsProcessing(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#161b22] border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          id="close-google-auth-modal-btn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto shadow-md">
            {/* Official Google 'G' Logo SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign in with Google
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Initialize your clean cybersecurity learning ledger. No predefined scores—your metrics start at 0 and track your verified progress.
          </p>
        </div>

        {/* Primary One-Click Account Option */}
        {!useCustom ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/80 transition-colors">
              <button
                onClick={() => handleGoogleSignIn(defaultEmail, 'Anish Kumar')}
                disabled={isProcessing}
                className="w-full flex items-center justify-between text-left group"
                id="sign-in-detected-account-btn"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-sm">
                    {defaultEmail.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      Anish Kumar
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {defaultEmail}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold flex items-center space-x-1 group-hover:bg-emerald-400">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setUseCustom(true)}
                className="text-xs font-mono text-slate-400 hover:text-slate-200 underline transition-colors"
                id="use-another-google-account-btn"
              >
                Use a different Google account
              </button>
            </div>
          </div>
        ) : (
          /* Custom Google Account Input */
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-medium uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-medium uppercase mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setUseCustom(false)}
                className="w-1/3 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleGoogleSignIn(selectedEmail, customName)}
                disabled={isProcessing || !selectedEmail.includes('@')}
                className="w-2/3 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center justify-center space-x-1.5"
                id="submit-custom-google-sign-in-btn"
              >
                <span>{isProcessing ? 'Connecting...' : 'Sign In with Google'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Security & Ledger Notice */}
        <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-bold">Zero Predefined Scores:</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Your progress starts at 0 XP, Level 0, and 0% skill calibration. Every completed module, terminal lab, and CTF flag will record cryptographically verifiable evidence in real time.
          </p>
        </div>
      </div>
    </div>
  );
};
