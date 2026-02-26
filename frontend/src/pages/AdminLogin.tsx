import { useState } from 'react';
import { login } from '../utils/auth';
import { Eye, EyeOff, Lock, Cross } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const success = login(password);
      if (success) {
        window.location.href = '/admin';
      } else {
        setError('Incorrect password. Please try again.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #080f1e 0%, #0f1f3d 50%, #1a3260 100%)' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/assets/generated/rosary-bg.dim_1200x600.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold mx-auto mb-4 shadow-gold">
            <img
              src="/assets/generated/church-logo.dim_256x256.png"
              alt="Church Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-cinzel text-gold text-xs tracking-[0.3em] uppercase mb-1">
            Admin Portal
          </p>
          <h1 className="font-heading text-2xl font-bold text-white">
            Holy Rosary Church
          </h1>
          <p className="font-body text-white/50 text-sm mt-1">
            Parishudda Japamaala Maatha Devalayamu
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 card-gold-border shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-gold" />
            <h2 className="font-cinzel text-white text-sm tracking-wider uppercase">
              Secure Admin Access
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-white/70 text-sm mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-sm text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-gold transition-colors"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-sm px-4 py-3">
                <p className="font-body text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-bold rounded-sm hover:bg-gold-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-gold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <a
              href="/"
              className="font-body text-white/40 text-xs hover:text-white/70 transition-colors"
            >
              ← Back to Church Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
