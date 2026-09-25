import React from 'react';
import {
  ShieldAlert,
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
  User
} from 'lucide-react';

export type ActiveView =
  | 'dashboard'
  | 'session_runner'
  | 'quadra_sync'
  | 'sight'
  | 'quadra_solve'
  | 'interpersonal'
  | 'facilitator'
  | 'exercises'
  | 'model_lab'
  | 'audio_lab'
  | 'journal'
  | 'progress'
  | 'profile'
  | 'settings';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onOpenGroundModal: () => void;
  isSessionActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  onOpenGroundModal,
  isSessionActive,
}) => {
  const coreModules = [
    { id: 'quadra_sync' as ActiveView, label: 'QUADRA SYNC', icon: Radio },
    { id: 'sight' as ActiveView, label: 'THE SIGHT', icon: Eye },
    { id: 'quadra_solve' as ActiveView, label: 'QUADRA SOLVE', icon: Cpu },
    { id: 'interpersonal' as ActiveView, label: 'INTERPERSONAL', icon: Users },
    { id: 'facilitator' as ActiveView, label: 'M.I.N.D.S. FACILITATOR', icon: MessageSquareCode },
    { id: 'exercises' as ActiveView, label: 'EXERCISE LIBRARY', icon: PlayCircle },
  ];

  const labModules = [
    { id: 'model_lab' as ActiveView, label: 'MODEL LAB', icon: Sparkles },
    { id: 'audio_lab' as ActiveView, label: 'AUDIO LAB', icon: Sliders },
    { id: 'journal' as ActiveView, label: 'SESSION JOURNAL', icon: BookOpen },
    { id: 'progress' as ActiveView, label: 'PROGRESS & MAP', icon: BarChart3 },
    { id: 'profile' as ActiveView, label: 'USER PROFILE', icon: User },
    { id: 'settings' as ActiveView, label: 'SYSTEM SETTINGS', icon: SettingsIcon },
  ];

  return (
    <aside
      id="app-sidebar"
      className="hidden md:flex w-64 border-r border-white/5 bg-[#050508]/80 p-6 flex flex-col justify-between shrink-0 overflow-y-auto z-20 backdrop-blur-sm"
    >
      <nav className="space-y-6">
        {/* Active Session Alert if running */}
        {isSessionActive && (
          <div
            onClick={() => onSelectView('session_runner')}
            className="p-3 border border-[#D4AF37]/40 bg-[#D4AF37]/10 rounded-xs cursor-pointer hover:bg-[#D4AF37]/15 transition-colors mb-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                Session Active
              </span>
            </div>
            <p className="text-[11px] text-white/80 mt-1">Click to return to active meditation.</p>
          </div>
        )}

        {/* Dashboard Link */}
        <div>
          <button
            onClick={() => onSelectView('dashboard')}
            className={`w-full text-left text-xs font-bold tracking-[0.18em] uppercase py-2 px-3 rounded-xs transition-all flex items-center gap-2.5 ${
              activeView === 'dashboard'
                ? 'text-[#D4AF37] bg-white/[0.04] border-l-2 border-[#D4AF37]'
                : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
            DASHBOARD
          </button>
        </div>

        {/* Core Modules */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 font-bold px-3">
            Core Modules
          </p>
          <ul className="space-y-1">
            {coreModules.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    id={`nav-btn-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full text-left text-xs tracking-wider py-2 px-3 flex items-center justify-between rounded-xs transition-all ${
                      isActive
                        ? 'text-white font-semibold bg-white/5 border-r-2 border-[#D4AF37]'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-1.5 transition-colors ${
                          isActive ? 'bg-[#D4AF37]' : 'bg-transparent border border-white/20'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    <Icon className="w-3.5 h-3.5 text-white/30" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cognitive Lab */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 font-bold px-3">
            Cognitive Lab
          </p>
          <ul className="space-y-1">
            {labModules.map((item) => {
              const isActive = activeView === item.id;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    id={`nav-btn-${item.id}`}
                    onClick={() => onSelectView(item.id)}
                    className={`w-full text-left text-xs tracking-wider py-2 px-3 flex items-center justify-between rounded-xs transition-all ${
                      isActive
                        ? 'text-white font-semibold bg-white/5 border-r-2 border-[#D4AF37]'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-1.5 transition-colors ${
                          isActive ? 'bg-[#D4AF37]' : 'bg-transparent'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    <Icon className="w-3.5 h-3.5 text-white/25" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Permanent Ground / Exit Session Button */}
      <div className="pt-6 border-t border-white/5">
        <button
          id="sidebar-ground-exit-btn"
          onClick={onOpenGroundModal}
          className="w-full py-3.5 px-3 border border-red-900/60 bg-red-950/15 text-red-400 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-red-900/30 hover:text-red-300 transition-all flex items-center justify-center gap-2 group shadow-inner"
        >
          <ShieldAlert className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          <span>Ground / Exit</span>
        </button>
        <span className="text-[8px] text-white/30 text-center block mt-2 tracking-wider">
          Instant acoustic de-escalation & sensory re-anchoring
        </span>
      </div>
    </aside>
  );
};
