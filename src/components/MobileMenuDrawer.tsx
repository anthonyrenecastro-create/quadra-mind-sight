import React from 'react';
import { ActiveView } from './Sidebar';
import { CurriculumWave, UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import {
  X,
  Radio,
  Eye,
  Cpu,
  Users,
  MessageSquareCode,
  BookOpen,
  Sliders,
  Sparkles,
  BarChart3,
  Settings as SettingsIcon,
  PlayCircle,
  User,
  ShieldAlert,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  currentWave: CurriculumWave;
  isSessionActive: boolean;
  onOpenGroundModal: () => void;
  profile?: UserProfile;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  onSelectView,
  currentWave,
  isSessionActive,
  onOpenGroundModal,
  profile,
}) => {
  if (!isOpen) return null;

  const handleItemClick = (view: ActiveView) => {
    onSelectView(view);
    onClose();
  };

  const coreModules: { id: ActiveView; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', desc: 'Overview & daily contemplation', icon: LayoutDashboard },
    { id: 'quadra_sync', label: 'Quadra Sync', desc: 'Instant 4-quadrant alignment', icon: Radio },
    { id: 'sight', label: 'The Sight', desc: 'Attention distribution & sliders', icon: Eye },
    { id: 'facilitator', label: 'M.I.N.D.S. Facilitator', desc: 'Socratic AI dialectic inquiry', icon: MessageSquareCode },
    { id: 'quadra_solve', label: 'Quadra Solve', desc: '4-perspective dilemma resolution', icon: Cpu },
    { id: 'interpersonal', label: 'Interpersonal', desc: 'Relational perception & fact/story separation', icon: Users },
    { id: 'exercises', label: 'Exercise Library', desc: 'All 12 contemplative practices', icon: PlayCircle },
  ];

  const labModules: { id: ActiveView; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'audio_lab', label: 'Audio Lab', desc: 'Binaural beats, spatial 3D & drones', icon: Sliders },
    { id: 'model_lab', label: 'Model Lab', desc: 'Cognitive state mapping & theory', icon: Sparkles },
    { id: 'journal', label: 'Consciousness Journal', desc: 'Session records & integration reflections', icon: BookOpen },
    { id: 'progress', label: 'Progress & Waves', desc: 'Curriculum mastery & metrics', icon: BarChart3 },
    { id: 'profile', label: 'User Profile', desc: 'Practice preferences & archetype', icon: User },
    { id: 'settings', label: 'System Settings', desc: 'Data backup & calibration', icon: SettingsIcon },
  ];

  return (
    <div
      id="mobile-menu-drawer-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end transition-opacity touch-manipulation md:hidden"
      onClick={onClose}
    >
      <div
        id="mobile-menu-drawer-panel"
        className="w-[85vw] max-w-sm h-full bg-[#070712] border-l border-white/10 flex flex-col justify-between shadow-2xl overflow-hidden pt-safe pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#050508]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md border border-[#D4AF37]/50 overflow-hidden bg-black flex items-center justify-center">
              <img src="/pwa-192x192.png" alt="Launcher" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-white font-bold leading-tight">
                Quadra-M.I.N.D.
              </h2>
              <span className="text-[9px] font-mono text-[#D4AF37] tracking-wider block">
                Wave {currentWave.wave}: {currentWave.romanNumeral}
              </span>
            </div>
          </div>

          <button
            id="mobile-drawer-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/70 hover:text-white active:scale-95"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 touch-scroll">
          {/* Active session return banner if applicable */}
          {isSessionActive && (
            <div
              onClick={() => handleItemClick('session_runner')}
              className="p-3 border border-[#D4AF37]/60 bg-[#D4AF37]/15 rounded-xs flex items-center justify-between cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                  Active Session
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
            </div>
          )}

          {/* Core Modules Group */}
          <div>
            <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block px-2 mb-1.5">
              Core Modules
            </span>
            <div className="space-y-1">
              {coreModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left p-2.5 rounded-xs flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]'
                        : 'text-white/80 hover:bg-white/5 border border-transparent active:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-xs border ${isActive ? 'border-[#D4AF37]/50 bg-[#D4AF37]/20 text-[#D4AF37]' : 'border-white/10 bg-white/5 text-white/60'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-medium tracking-wide uppercase">{item.label}</div>
                        <div className="text-[9px] text-white/40 font-mono line-clamp-1">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-white/20'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Labs & Utilities Group */}
          <div>
            <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-white/40 font-semibold block px-2 mb-1.5">
              Labs & Exploration
            </span>
            <div className="space-y-1">
              {labModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full text-left p-2.5 rounded-xs flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]'
                        : 'text-white/80 hover:bg-white/5 border border-transparent active:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-xs border ${isActive ? 'border-[#D4AF37]/50 bg-[#D4AF37]/20 text-[#D4AF37]' : 'border-white/10 bg-white/5 text-white/60'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-medium tracking-wide uppercase">{item.label}</div>
                        <div className="text-[9px] text-white/40 font-mono line-clamp-1">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-white/20'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer: PWA Install & Emergency Grounding */}
        <div className="p-3 border-t border-white/10 bg-[#050508] space-y-2">
          <div className="w-full flex justify-center">
            <PWAInstallButton compact />
          </div>

          <button
            id="mobile-drawer-ground-btn"
            onClick={() => {
              onClose();
              onOpenGroundModal();
            }}
            className="w-full py-2.5 px-3 border border-red-900/60 bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 rounded-xs active:scale-98 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Emergency Ground / Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
