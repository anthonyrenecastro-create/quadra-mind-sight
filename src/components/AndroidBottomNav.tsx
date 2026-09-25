import React from 'react';
import { ActiveView } from './Sidebar';
import {
  LayoutDashboard,
  PlayCircle,
  Eye,
  MessageSquareCode,
  Menu,
  Radio
} from 'lucide-react';

interface AndroidBottomNavProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  isSessionActive: boolean;
  onOpenMenu?: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeView,
  onSelectView,
  isSessionActive,
  onOpenMenu,
}) => {
  const tabs: {
    id: ActiveView | 'menu';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    isActive: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      action: () => onSelectView('dashboard'),
      isActive: activeView === 'dashboard',
    },
    {
      id: 'exercises',
      label: isSessionActive ? 'Active' : 'Practice',
      icon: isSessionActive ? Radio : PlayCircle,
      action: () => onSelectView(isSessionActive ? 'session_runner' : 'exercises'),
      isActive: activeView === 'exercises' || activeView === 'session_runner' || activeView === 'quadra_sync',
    },
    {
      id: 'sight',
      label: 'Sight',
      icon: Eye,
      action: () => onSelectView('sight'),
      isActive: activeView === 'sight',
    },
    {
      id: 'facilitator',
      label: 'Facilitator',
      icon: MessageSquareCode,
      action: () => onSelectView('facilitator'),
      isActive: activeView === 'facilitator',
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: Menu,
      action: () => (onOpenMenu ? onOpenMenu() : onSelectView('settings')),
      isActive: false,
    },
  ];

  return (
    <nav
      id="android-bottom-nav"
      className="md:hidden border-t border-white/10 bg-[#050508]/95 backdrop-blur-md flex items-center justify-around px-2 py-1 z-30 shrink-0 select-none pb-safe"
      style={{ minHeight: '52px' }}
      aria-label="Mobile Bottom Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.isActive;
        const isSessionTab = isSessionActive && tab.id === 'exercises';

        return (
          <button
            key={tab.id}
            type="button"
            onClick={tab.action}
            className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 touch-manipulation relative ${
              isActive ? 'text-[#D4AF37]' : 'text-white/50 hover:text-white/80'
            }`}
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label={tab.label}
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-[2px] bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            )}
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {isSessionTab && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
              )}
            </div>
            <span className="text-[9.5px] font-mono tracking-wider uppercase mt-1 leading-none font-medium truncate max-w-[60px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
