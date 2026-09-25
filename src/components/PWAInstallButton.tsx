import React, { useState } from 'react';
import { usePWAInstall } from '../usePWAInstall';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Android / Chromium installation flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 border border-[#D4AF37]/40 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] font-mono transition-colors active:scale-95 touch-manipulation ${
          compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
        }`}
        title="Install Android / Web Application"
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold uppercase tracking-wider">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 font-mono transition-colors active:scale-95 touch-manipulation ${
            compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
          }`}
          title="Install on iOS Home Screen"
        >
          <Download className="w-3.5 h-3.5 shrink-0" />
          <span className="uppercase tracking-wider">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm border border-white/20 bg-[#0A0D18] p-6 shadow-2xl relative text-[#E0E0E0]">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-medium text-white tracking-wide flex items-center gap-2">
                <Download className="w-4 h-4 text-[#D4AF37]" />
                Install on iPhone / iPad
              </h3>
              <div className="mt-4 space-y-3 text-xs text-white/70 font-sans leading-relaxed">
                <p className="flex items-start gap-2">
                  <Share className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>1. Tap the <strong>Share</strong> button in Safari's bottom toolbar.</span>
                </p>
                <p className="flex items-start gap-2">
                  <PlusSquare className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 py-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:bg-[#D4AF37]/25"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
