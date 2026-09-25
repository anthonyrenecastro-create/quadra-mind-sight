import React from 'react';
import { ShieldAlert, Volume2, Sparkles, User, Disc, Eye, Compass, ChevronDown, Menu } from 'lucide-react';
import { CurriculumWave, UserProfile } from '../types';
import { CURRICULUM_WAVES } from '../data/curriculumData';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentWave: CurriculumWave;
  onSelectWave?: (waveNumber: number) => void;
  sessionTimeDisplay: string;
  isSessionActive: boolean;
  onOpenGroundModal: () => void;
  audioIsPlaying: boolean;
  onNavigateHome: () => void;
  onNavigateProfile?: () => void;
  profile?: UserProfile;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWave,
  onSelectWave,
  sessionTimeDisplay,
  isSessionActive,
  onOpenGroundModal,
  audioIsPlaying,
  onNavigateHome,
  onNavigateProfile,
  profile,
  onOpenMobileMenu,
}) => {
  return (
    <header
      id="app-header"
      className="h-14 sm:h-16 border-b border-white/10 px-3 sm:px-8 flex items-center justify-between bg-gradient-to-r from-[#050508] via-[#070712] to-[#0A0A15] select-none z-30 shrink-0 pt-safe"
    >
      {/* Brand & Emblem */}
      <div
        id="brand-logo-container"
        onClick={onNavigateHome}
        className="flex items-center gap-2 sm:gap-3.5 cursor-pointer group"
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_10px_rgba(212,175,55,0.25)] flex items-center justify-center bg-[#050508] group-hover:border-white transition-all shrink-0">
          <img
            src="/pwa-192x192.png"
            alt="quadraminds.ai launcher icon"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-xs sm:text-lg font-light tracking-[0.15em] sm:tracking-[0.2em] text-white uppercase leading-none truncate max-w-[155px] sm:max-w-none">
            Quadra-M.I.N.D. Sight
          </h1>
          <span className="text-[7.5px] sm:text-[8.5px] tracking-[0.18em] text-[#D4AF37]/80 uppercase block mt-1 font-mono hidden xs:block">
            Meta Interpersonal Neural Dialectic Sight
          </span>
        </div>
      </div>

      {/* Right side stats, PWA install & profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* PWA / Android Install Trigger */}
        <div className="hidden sm:block">
          <PWAInstallButton compact />
        </div>

        {/* Curriculum Wave Dropdown */}
        <div className="hidden md:flex flex-col items-end">
          <label
            htmlFor="header-wave-dropdown"
            className="text-[9px] uppercase tracking-wider text-white/40 font-mono flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
            <span>Curriculum Wave</span>
          </label>
          <div className="relative mt-0.5">
            <select
              id="header-wave-dropdown"
              value={currentWave.wave}
              onChange={(e) => onSelectWave?.(Number(e.target.value))}
              className="bg-[#050508] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] text-xs font-mono font-semibold py-1 pl-2 pr-7 rounded-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37] appearance-none cursor-pointer tracking-wider transition-colors"
              title="Select Curriculum Wave Number"
            >
              {CURRICULUM_WAVES.map((w) => (
                <option key={w.wave} value={w.wave} className="bg-[#0A0D18] text-white">
                  Wave {w.wave}: {w.romanNumeral} — {w.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="hidden md:block h-8 w-[1px] bg-white/10" />

        {/* Live Session Time */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9.5px] uppercase tracking-wider text-white/40 font-mono">
            {isSessionActive ? 'Active Session' : 'Clock / Tempo'}
          </span>
          <span className="text-xs sm:text-sm font-mono text-white tracking-widest flex items-center gap-2">
            {audioIsPlaying && (
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" title="Audio Entrainment Active" />
            )}
            {sessionTimeDisplay}
          </span>
        </div>

        {/* Profile Avatar Button */}
        {onNavigateProfile && (
          <button
            onClick={onNavigateProfile}
            className="flex items-center gap-1.5 px-2 py-1.5 border border-white/15 bg-white/5 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 transition-colors text-white"
            title="User Profile & Settings"
          >
            <div className="w-5 h-5 rounded-full border border-[#D4AF37]/60 bg-[#050508] flex items-center justify-center">
              <User className="w-3 h-3 text-[#D4AF37]" />
            </div>
            <span className="text-xs font-mono text-white/80 hidden md:inline truncate max-w-[80px]">
              {profile?.displayName || 'Observer'}
            </span>
          </button>
        )}

        {/* Quick Ground Button */}
        <button
          id="header-ground-btn"
          onClick={onOpenGroundModal}
          className="p-2 border border-red-900/60 bg-red-950/20 text-red-400 hover:text-white hover:bg-red-900/40 transition-colors active:scale-95"
          title="Emergency Ground / Exit"
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        {/* Mobile Navigation Menu Drawer Toggle */}
        {onOpenMobileMenu && (
          <button
            id="header-mobile-menu-btn"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 border border-white/15 bg-white/5 hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] transition-all active:scale-95"
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
