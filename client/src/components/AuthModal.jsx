import React, { useState } from 'react';
import { ShieldAlert, UserCheck, Lock, Mail, User, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import { loginUser, signupUser } from '../services/api';

export default function AuthModal({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await loginUser(email, password);
      } else {
        res = await signupUser(name, email, password);
      }

      if (res.token) {
        localStorage.setItem('scamgraph_token', res.token);
        localStorage.setItem('scamgraph_user', JSON.stringify(res.user));
        onAuthSuccess(res.user, res.token);
      }
    } catch (err) {
      console.error('Auth error:', err);
      const msg = err.response?.data?.error || err.message || 'Authentication failed. Please check credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setIsLogin(true);
    setEmail('analyst@scamgraph.test');
    setPassword('analyst123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Top Glow Accent */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-2xl shadow-lg mb-1">
            <ShieldAlert className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">ScamGraph Intel Access</h2>
          <p className="text-xs text-slate-400">Authenticate to access the Cyber Scam Intelligence Platform</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition ${isLogin ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 rounded-lg transition ${!isLogin ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name / Analyst Alias</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Inspector Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/80 placeholder-slate-500 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@scamgraph.test"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/80 placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/80 placeholder-slate-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>{isLogin ? 'Sign In to Investigation Dashboard' : 'Complete Registration & Access Platform'}</span>
            )}
          </button>
        </form>

        {/* Demo Account Auto-Fill */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">Testing as Evaluator?</span>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-900/60 rounded-lg text-[11px] font-mono flex items-center gap-1 transition"
          >
            <Sparkles className="w-3 h-3" /> Auto-fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
