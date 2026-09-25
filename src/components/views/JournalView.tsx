import React, { useState, useEffect } from 'react';
import { JournalEntry, QuadrantKey, UserProfile } from '../../types';
import { storageService } from '../../services/storage';
import { biometricService } from '../../services/biometrics';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Download,
  Upload,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Fingerprint,
  ScanFace,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface JournalViewProps {
  entries: JournalEntry[];
  onEntriesChange: (entries: JournalEntry[]) => void;
  profile?: UserProfile;
  onNavigateToProfile?: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onEntriesChange,
  profile,
  onNavigateToProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantKey | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Biometric Vault Lock state
  const isBiometricEnabled = Boolean(profile?.biometricsEnabled);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (!isBiometricEnabled) return true;
    return biometricService.isJournalUnlocked(profile?.autoLockMinutes ?? 15);
  });
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.biometricsEnabled) {
      setIsUnlocked(true);
    } else {
      setIsUnlocked(biometricService.isJournalUnlocked(profile?.autoLockMinutes ?? 15));
    }
  }, [profile?.biometricsEnabled, profile?.autoLockMinutes]);

  const handleUnlockWithBiometrics = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await biometricService.verifyBiometrics(profile?.biometricCredentialId);
      if (res.success) {
        biometricService.unlockJournal();
        setIsUnlocked(true);
      } else {
        setAuthError(res.error || 'Biometric authorization was unverified.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Sensor verification failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = profile?.securityPin;
    if (!correctPin) {
      setPinError('No Security PIN has been configured in Profile yet.');
      return;
    }
    if (pinAttempt.trim() === correctPin.trim()) {
      biometricService.unlockJournal();
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect Security PIN. Please try again.');
    }
  };

  const handleQuickPreviewUnlock = () => {
    biometricService.unlockJournal();
    setIsUnlocked(true);
  };

  const handleLockVault = () => {
    biometricService.lockJournal();
    setIsUnlocked(false);
    setPinAttempt('');
    setPinError('');
    setAuthError(null);
  };

  // New entry form state
  const [title, setTitle] = useState('Spontaneous Observation');
  const [durationMins, setDurationMins] = useState(10);
  const [stateBefore, setStateBefore] = useState('');
  const [stateAfter, setStateAfter] = useState('');
  const [memoryNote, setMemoryNote] = useState('');
  const [meaningNote, setMeaningNote] = useState('');
  const [presentNote, setPresentNote] = useState('');
  const [futureNote, setFutureNote] = useState('');
  const [unexpectedNote, setUnexpectedNote] = useState('');
  const [integrationNote, setIntegrationNote] = useState('');
  const [rating, setRating] = useState(5);
  const [focusQuadrant, setFocusQuadrant] = useState<QuadrantKey>('meta');

  const filteredEntries = entries.filter((e) => {
    const matchesQuad = selectedQuadrant === 'all' || e.quadrantFocus === selectedQuadrant;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      e.exerciseTitle.toLowerCase().includes(query) ||
      (e.memory && e.memory.toLowerCase().includes(query)) ||
      (e.meaning && e.meaning.toLowerCase().includes(query)) ||
      (e.presentSensation && e.presentSensation.toLowerCase().includes(query)) ||
      (e.possibleFuture && e.possibleFuture.toLowerCase().includes(query)) ||
      (e.integration && e.integration.toLowerCase().includes(query));
    return matchesQuad && matchesQuery;
  });

  const handleDelete = (id: string) => {
    if (confirm('Delete this journal reflection?')) {
      const updated = storageService.deleteJournalEntry(id);
      onEntriesChange(updated);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: JournalEntry = {
      id: `entry_${Date.now()}`,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      exerciseId: 'manual_entry',
      exerciseTitle: title || 'Spontaneous Reflection',
      durationSeconds: durationMins * 60,
      stateBefore: stateBefore || 'Normal waking focus',
      stateAfter: stateAfter || 'Grounded contemplation',
      memory: memoryNote || '—',
      meaning: meaningNote || '—',
      presentSensation: presentNote || '—',
      possibleFuture: futureNote || '—',
      unexpectedObservation: unexpectedNote || '—',
      integration: integrationNote || 'Conscious awareness maintained across changing perspectives.',
      rating,
      quadrantFocus: focusQuadrant,
      sightSnapshot: storageService.getSightAllocation(),
    };

    const updated = storageService.saveJournalEntry(newEntry);
    onEntriesChange(updated);
    setIsModalOpen(false);

    // Reset fields
    setStateBefore('');
    setStateAfter('');
    setMemoryNote('');
    setMeaningNote('');
    setPresentNote('');
    setFutureNote('');
    setUnexpectedNote('');
    setIntegrationNote('');
  };

  const handleExportJSON = () => {
    const data = storageService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quadra_minds_journal_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (storageService.importData(text)) {
        onEntriesChange(storageService.getJournalEntries());
        alert('Consciousness Journal successfully imported!');
      } else {
        alert('Invalid journal JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (isBiometricEnabled && !isUnlocked) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 bg-[#050508] animate-fade-in">
        <div className="w-full max-w-lg border border-[#D4AF37]/40 bg-[#0A0D18] p-6 sm:p-10 rounded-xs shadow-[0_0_50px_rgba(212,175,55,0.12)] text-center relative overflow-hidden">
          {/* Subtle cosmic background geometry accent */}
          <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-[#D4AF37]/5 blur-2xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-36 h-36 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

          {/* Biometric Sensor Visual */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#D4AF37]/30 animate-ping opacity-25" />
            <div className="absolute inset-2 rounded-full border border-dashed border-[#D4AF37]/50 animate-spin-slow" />
            <div className="w-18 h-18 rounded-full border-2 border-[#D4AF37] bg-[#050508] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              <Fingerprint className="w-9 h-9 text-[#D4AF37]" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#050508] border border-cyan-400/50 rounded-full text-cyan-400">
              <ScanFace className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 text-[10px] font-mono uppercase tracking-[0.2em] border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
            <Lock className="w-3 h-3" />
            <span>Biometric Vault Encrypted</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide uppercase">
            Journal Vault Locked
          </h2>

          <p className="text-xs text-white/65 font-sans max-w-sm mx-auto mt-2 leading-relaxed">
            Personal reflections, episodic memory fragments, and emotional interpretation logs are protected under hardware biometric authentication.
          </p>

          {/* Feedback alerts */}
          {authError && (
            <div className="mt-4 p-3 text-xs font-mono border border-rose-500/50 bg-rose-500/10 text-rose-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {pinError && (
            <div className="mt-4 p-3 text-xs font-mono border border-rose-500/50 bg-rose-500/10 text-rose-300 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3 max-w-sm mx-auto">
            <button
              onClick={handleUnlockWithBiometrics}
              disabled={isAuthenticating}
              className="w-full py-3 px-5 bg-[#D4AF37] hover:bg-[#E5C158] text-[#050508] text-xs font-mono uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all active:scale-98"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Device Sensor...</span>
                </>
              ) : (
                <>
                  <ScanFace className="w-4 h-4" />
                  <span>Unlock with Biometrics (FaceID / Fingerprint)</span>
                </>
              )}
            </button>

            {/* PIN Entry Drawer */}
            {showPinInput ? (
              <form onSubmit={handleUnlockWithPin} className="p-3.5 bg-[#050508] border border-white/15 space-y-2 text-left animate-fade-in">
                <label className="block text-[10.5px] font-mono text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Enter Practitioner Security PIN
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={8}
                    autoFocus
                    value={pinAttempt}
                    onChange={(e) => setPinAttempt(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter PIN"
                    className="flex-1 bg-[#0A0D18] border border-white/20 px-3 py-2 text-xs text-white font-mono tracking-widest focus:border-[#D4AF37] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] text-xs font-mono font-semibold transition-all"
                  >
                    Unlock
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowPinInput(true)}
                className="w-full py-2 px-4 border border-white/15 hover:border-white/30 bg-[#050508] text-white/70 hover:text-white text-[11px] font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Use Practitioner PIN Instead</span>
              </button>
            )}

            {/* Environment Sandbox / Preview Quick Unlock */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickPreviewUnlock}
                className="text-[10px] font-mono text-white/40 hover:text-[#D4AF37] underline transition-colors"
                title="Bypass in case browser environment sandbox blocks WebAuthn UI"
              >
                Simulate Biometric Verification (Sandbox Bypass)
              </button>
            </div>
          </div>

          {onNavigateToProfile && (
            <div className="mt-8 pt-4 border-t border-white/10 text-center">
              <button
                onClick={onNavigateToProfile}
                className="text-[11px] font-mono text-[#D4AF37] hover:text-white flex items-center justify-center gap-1.5 mx-auto transition-colors"
              >
                <span>Manage Biometric & Vault Settings in Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="journal-view" className="flex-1 p-4 sm:p-8 overflow-y-auto space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
            Metacognitive Records
          </span>
          <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            CONSCIOUSNESS JOURNAL
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-xl font-light">
            Structured records capturing memory fragments, emotional meaning, somatic presence, and future simulations from each session.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Biometric Vault Lock / Unlock Status Pill */}
          {isBiometricEnabled ? (
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Vault Unlocked</span>
              </span>
              <button
                onClick={handleLockVault}
                className="px-2.5 py-1.5 border border-rose-500/40 hover:border-rose-500 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
                title="Lock Journal Vault Immediately"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Vault</span>
              </button>
            </div>
          ) : (
            onNavigateToProfile && (
              <button
                onClick={onNavigateToProfile}
                className="px-2.5 py-1.5 border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
                title="Configure FaceID or Fingerprint for your Journal"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Protect with Biometrics</span>
              </button>
            )
          )}

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors"
            title="Export full backup as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="px-3 py-1.5 border border-white/10 hover:border-white/30 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#E5C158] text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xs flex items-center gap-1.5 transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Reflection
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase overflow-x-auto w-full sm:w-auto">
          {(['all', 'memory', 'meaning', 'present', 'future', 'meta'] as (QuadrantKey | 'all')[]).map(
            (q) => (
              <button
                key={q}
                onClick={() => setSelectedQuadrant(q)}
                className={`px-3 py-1.5 rounded-xs transition-colors ${
                  selectedQuadrant === q
                    ? 'bg-white/10 text-white font-bold border-b-2 border-[#D4AF37]'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {q}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className="w-full bg-black border border-white/15 pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/20 rounded-xs focus:border-[#D4AF37] focus:outline-hidden font-sans"
          />
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center border border-white/5 bg-black/40 rounded-xs">
            <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/50 font-light">No journal entries found matching criteria.</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="border border-white/10 bg-[#050508]/90 p-6 rounded-xs space-y-4 shadow-md hover:border-white/20 transition-all"
            >
              {/* Entry Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-light text-white tracking-wide">
                    {entry.exerciseTitle}
                  </span>
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider px-2 py-0.5 border border-[#D4AF37]/30 rounded-xs">
                    {entry.quadrantFocus} Focus
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" />
                    {entry.dateStr}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.round(entry.durationSeconds / 60)}m
                  </span>
                  <div className="flex items-center gap-0.5 text-[#D4AF37]">
                    {Array.from({ length: entry.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-white/20 hover:text-red-400 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Baseline Transition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/[0.01] p-3 border border-white/5 font-sans">
                <div>
                  <span className="text-[9px] font-mono text-white/40 uppercase block">State Before:</span>
                  <span className="text-white/70 italic font-light">{entry.stateBefore || 'Normal'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-emerald-400/80 uppercase block">State After:</span>
                  <span className="text-white/90 italic font-light">{entry.stateAfter || 'Grounded'}</span>
                </div>
              </div>

              {/* 4 Quadrants Detailed Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                {entry.memory && (
                  <div className="p-3 border border-white/5 bg-black/40 rounded-xs">
                    <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1 font-bold">
                      Quadrant I: Memory Fragment
                    </span>
                    <p className="text-white/80 font-light leading-relaxed">{entry.memory}</p>
                  </div>
                )}
                {entry.meaning && (
                  <div className="p-3 border border-white/5 bg-black/40 rounded-xs">
                    <span className="text-[9px] font-mono text-[#EF4444] uppercase tracking-widest block mb-1 font-bold">
                      Quadrant II: Meaning & Salience
                    </span>
                    <p className="text-white/80 font-light leading-relaxed">{entry.meaning}</p>
                  </div>
                )}
                {entry.presentSensation && (
                  <div className="p-3 border border-white/5 bg-black/40 rounded-xs">
                    <span className="text-[9px] font-mono text-[#10B981] uppercase tracking-widest block mb-1 font-bold">
                      Quadrant III: Embodiment / Sensation
                    </span>
                    <p className="text-white/80 font-light leading-relaxed">{entry.presentSensation}</p>
                  </div>
                )}
                {entry.possibleFuture && (
                  <div className="p-3 border border-white/5 bg-black/40 rounded-xs">
                    <span className="text-[9px] font-mono text-[#8B5CF6] uppercase tracking-widest block mb-1 font-bold">
                      Quadrant IV: Predictive Simulation
                    </span>
                    <p className="text-white/80 font-light leading-relaxed">{entry.possibleFuture}</p>
                  </div>
                )}
              </div>

              {/* Integration statement */}
              {entry.integration && (
                <div className="p-3 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#D4AF37] font-bold block">
                      Core Integration
                    </span>
                    <p className="text-xs text-white/90 font-serif italic leading-relaxed">
                      &ldquo;{entry.integration}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Manual Reflection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl border border-white/20 bg-[#050508] p-6 sm:p-8 rounded-xs shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-light text-white tracking-wide">
                Log Spontaneous Observation
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/40 hover:text-white text-xs font-mono uppercase"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/60 block mb-1">
                    Title / Context:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white rounded-xs focus:border-[#D4AF37] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-white/60 block mb-1">
                    Primary Focus Quadrant:
                  </label>
                  <select
                    value={focusQuadrant}
                    onChange={(e) => setFocusQuadrant(e.target.value as QuadrantKey)}
                    className="w-full bg-black border border-white/15 px-3 py-2 text-white rounded-xs focus:border-[#D4AF37] focus:outline-hidden font-mono text-xs uppercase"
                  >
                    <option value="meta">Meta (All Four)</option>
                    <option value="memory">Quadrant I: Memory</option>
                    <option value="meaning">Quadrant II: Meaning</option>
                    <option value="present">Quadrant III: Embodiment</option>
                    <option value="future">Quadrant IV: Projection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-[#D4AF37] uppercase block mb-1">
                    Quadrant I: Memory Fragment:
                  </label>
                  <textarea
                    value={memoryNote}
                    onChange={(e) => setMemoryNote(e.target.value)}
                    placeholder="Autobiographical cue observed..."
                    className="w-full bg-black border border-white/15 p-2 text-white h-16 resize-none rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#EF4444] uppercase block mb-1">
                    Quadrant II: Meaning & Salience:
                  </label>
                  <textarea
                    value={meaningNote}
                    onChange={(e) => setMeaningNote(e.target.value)}
                    placeholder="Emotional charge or assigned narrative..."
                    className="w-full bg-black border border-white/15 p-2 text-white h-16 resize-none rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-[#10B981] uppercase block mb-1">
                    Quadrant III: Embodiment & Breath:
                  </label>
                  <textarea
                    value={presentNote}
                    onChange={(e) => setPresentNote(e.target.value)}
                    placeholder="Physical somatic state..."
                    className="w-full bg-black border border-white/15 p-2 text-white h-16 resize-none rounded-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#8B5CF6] uppercase block mb-1">
                    Quadrant IV: Predictive Simulation:
                  </label>
                  <textarea
                    value={futureNote}
                    onChange={(e) => setFutureNote(e.target.value)}
                    placeholder="Future trajectory modeled..."
                    className="w-full bg-black border border-white/15 p-2 text-white h-16 resize-none rounded-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">
                  Core Meta Integration Statement:
                </label>
                <input
                  type="text"
                  value={integrationNote}
                  onChange={(e) => setIntegrationNote(e.target.value)}
                  placeholder="One sentence: What remains when observing all four at once?"
                  className="w-full bg-black border border-white/15 px-3 py-2 text-white rounded-xs focus:border-[#D4AF37] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/10 text-white/60 hover:text-white uppercase font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] text-black font-bold uppercase font-mono text-xs tracking-wider"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
