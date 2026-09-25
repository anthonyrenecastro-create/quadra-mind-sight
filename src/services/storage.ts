import { JournalEntry, SightAllocation, UserProgress, UserProfile, AccountTier } from '../types';

const JOURNAL_KEY = 'quadra_minds_journal_v1';
const PROGRESS_KEY = 'quadra_minds_progress_v1';
const SIGHT_KEY = 'quadra_minds_sight_v1';
const PROFILE_KEY = 'quadra_minds_profile_v1';
const CLOUD_SYNC_KEY = 'quadra_minds_cloud_sync_v1';

// Seeded default profile strictly adhering to required schema:
// { "uid": "user_123", "displayName": "Observer", "curriculumWave": 1, "accountTier": "premium" }
const INITIAL_PROFILE: UserProfile = {
  id: 'user_123',
  uid: 'user_123',
  email: 'observer@quadra.sight',
  displayName: 'Observer',
  curriculumWave: 1,
  accountTier: 'premium',
  avatarSymbol: 'orb',
  primaryIntention: 'Cultivate metacognitive neutrality across cognitive shifts.',
  preferredBand: 'drift', // Theta 6.8Hz
  dailyGoalMinutes: 20,
  joinedDate: 'Sep 2026',
  isLoggedIn: true,
  cloudSynced: true,
  lastSyncedAt: new Date().toISOString(),
};

const INITIAL_SIGHT: SightAllocation = {
  memory: 72,
  meaning: 48,
  present: 61,
  future: 84,
};

const SEED_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry_seed_1',
    timestamp: Date.now() - 86400000 * 2,
    dateStr: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    exerciseId: 'quadra_sync',
    exerciseTitle: 'Quadra Sync',
    durationSeconds: 600,
    stateBefore: 'Scattered attention, lingering worry about an upcoming strategic presentation.',
    stateAfter: 'Distinct clarity; somatic tension dissolved from throat into open chest breathing.',
    memory: 'Fragment of cold morning fog on the coast road near Big Sur, crunch of gravel underfoot.',
    meaning: 'Identified an unexamined assumption that hesitation equals incompetence.',
    presentSensation: 'Vibration in palms, warm grounding in pelvic floor, breath slowed to 5.5s cadence.',
    possibleFuture: 'Simulated presenting the project with relaxed neutrality rather than hyper-defensive pacing.',
    unexpectedObservation: 'The boundary between the auditory tone in the left ear and the memory of the wind dissolved.',
    integration: 'Separated the physical event from the urgency narrative. Observation remains calm even when predictions fluctuate.',
    rating: 5,
    quadrantFocus: 'meta',
    sightSnapshot: { memory: 65, meaning: 45, present: 75, future: 60 }
  },
  {
    id: 'entry_seed_2',
    timestamp: Date.now() - 86400000,
    dateStr: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    exerciseId: 'memory_reconstruction',
    exerciseTitle: 'Memory Reconstruction',
    durationSeconds: 480,
    stateBefore: 'Mentally fatigued after multi-hour screen immersion.',
    stateAfter: 'Refreshed, spacious, grounded in sensory presence.',
    memory: 'Sound of an old wooden grandfather clock ticking in a quiet hallway during childhood rain.',
    meaning: 'Recognized an early association connecting silence with impending parental conflict.',
    presentSensation: 'Relaxation of facial muscles, release of jaw clenching, subtle warmth behind the eyes.',
    possibleFuture: 'Simulated being comfortable in prolonged conversational silences without rushing to speak.',
    unexpectedObservation: 'The clock tick in memory began oscillating at exactly the 6.8Hz theta beat.',
    integration: 'A memory is a reconstructed model. By noticing its sensory fragments, the emotional spell relaxes.',
    rating: 4,
    quadrantFocus: 'memory',
    sightSnapshot: { memory: 85, meaning: 55, present: 50, future: 40 }
  }
];

const INITIAL_PROGRESS: UserProgress = {
  totalPracticeTimeSeconds: 1680,
  sessionsCompleted: 3,
  quadrantMinutes: {
    memory: 45,
    meaning: 32,
    present: 58,
    future: 38,
    meta: 50
  },
  exerciseHistory: {
    quadra_sync: 2,
    memory_reconstruction: 1,
    four_point_awareness: 1
  },
  averageFocusRating: 4.4,
  averageRelaxationRating: 4.6,
  currentWave: 3
};

export const storageService = {
  getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(JOURNAL_KEY);
      if (!data) {
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(SEED_JOURNAL_ENTRIES));
        return SEED_JOURNAL_ENTRIES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_JOURNAL_ENTRIES;
    }
  },

  saveJournalEntry(entry: JournalEntry): JournalEntry[] {
    const entries = this.getJournalEntries();
    const updated = [entry, ...entries];
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
    this.recordSessionProgress(entry.durationSeconds, entry.quadrantFocus);
    this.pushToCloudBackground();
    return updated;
  },

  deleteJournalEntry(id: string): JournalEntry[] {
    const entries = this.getJournalEntries().filter((e) => e.id !== id);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
    this.pushToCloudBackground();
    return entries;
  },

  getSightAllocation(): SightAllocation {
    try {
      const data = localStorage.getItem(SIGHT_KEY);
      if (!data) return INITIAL_SIGHT;
      return JSON.parse(data);
    } catch {
      return INITIAL_SIGHT;
    }
  },

  saveSightAllocation(sight: SightAllocation) {
    localStorage.setItem(SIGHT_KEY, JSON.stringify(sight));
    this.pushToCloudBackground();
  },

  getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (!data) {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(INITIAL_PROGRESS));
        return INITIAL_PROGRESS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROGRESS;
    }
  },

  recordSessionProgress(durationSeconds: number, quadrant: keyof UserProgress['quadrantMinutes']) {
    const progress = this.getProgress();
    const minutes = Math.max(1, Math.round(durationSeconds / 60));

    progress.totalPracticeTimeSeconds += durationSeconds;
    progress.sessionsCompleted += 1;
    progress.quadrantMinutes[quadrant] = (progress.quadrantMinutes[quadrant] || 0) + minutes;

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  updateCurrentWave(wave: number): UserProgress {
    const progress = this.getProgress();
    progress.currentWave = wave;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    const profile = this.getProfile();
    if (profile.curriculumWave !== wave) {
      profile.curriculumWave = wave;
      this.saveProfile(profile);
    } else {
      this.pushToCloudBackground();
    }
    return progress;
  },

  exportAllData(): string {
    const backup = {
      journal: this.getJournalEntries(),
      progress: this.getProgress(),
      sight: this.getSightAllocation(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.journal) localStorage.setItem(JOURNAL_KEY, JSON.stringify(parsed.journal));
      if (parsed.progress) localStorage.setItem(PROGRESS_KEY, JSON.stringify(parsed.progress));
      if (parsed.sight) localStorage.setItem(SIGHT_KEY, JSON.stringify(parsed.sight));
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  resetData() {
    localStorage.removeItem(JOURNAL_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SIGHT_KEY);
    localStorage.removeItem(PROFILE_KEY);
  },

  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (!data) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
        return INITIAL_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): UserProfile {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    // Trigger background sync push if online and logged in
    if (profile.isLoggedIn) {
      this.pushToCloudBackground();
    }
    return profile;
  },

  async loginProfile(email: string, displayName?: string, accountTier: AccountTier = 'premium'): Promise<UserProfile> {
    const current = this.getProfile();
    const uid = email === 'observer@quadra.sight' || !email ? 'user_123' : `user_${email.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`;
    
    // Attempt real cloud server authentication
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid,
          email,
          displayName: displayName || (uid === 'user_123' ? 'Observer' : email.split('@')[0]),
          accountTier,
          curriculumWave: current.curriculumWave || 1,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.profile) {
          const cloudProfile: UserProfile = {
            ...current,
            id: json.profile.uid,
            uid: json.profile.uid,
            email: json.profile.email,
            displayName: json.profile.displayName,
            curriculumWave: json.profile.curriculumWave ?? current.curriculumWave ?? 1,
            accountTier: json.profile.accountTier || 'premium',
            isLoggedIn: true,
            cloudSynced: true,
            lastSyncedAt: new Date().toISOString(),
          };

          // If cloud has existing remote journal or progress, pull and merge
          if (json.cloudData) {
            this.mergeCloudSyncData(json.cloudData);
          }

          return this.saveProfile(cloudProfile);
        }
      }
    } catch (err) {
      console.warn('Network offline during cloud login, falling back to local credentials:', err);
    }

    // Local fallback if server unreachable
    const updated: UserProfile = {
      ...current,
      id: uid,
      uid,
      email: email || 'observer@quadra.sight',
      displayName: displayName || (uid === 'user_123' ? 'Observer' : email.split('@')[0]),
      curriculumWave: current.curriculumWave || 1,
      accountTier,
      isLoggedIn: true,
      cloudSynced: false,
      lastSyncedAt: new Date().toISOString(),
    };
    return this.saveProfile(updated);
  },

  logoutProfile(): UserProfile {
    const current = this.getProfile();
    const updated: UserProfile = {
      ...current,
      isLoggedIn: false,
      cloudSynced: false,
    };
    return this.saveProfile(updated);
  },

  // Merge remote cloud data into local storage safely
  mergeCloudSyncData(cloudData: any) {
    if (!cloudData) return;
    try {
      if (Array.isArray(cloudData.journal) && cloudData.journal.length > 0) {
        const localEntries = this.getJournalEntries();
        const entryMap = new Map<string, JournalEntry>();
        for (const e of localEntries) entryMap.set(e.id, e);
        for (const e of cloudData.journal) entryMap.set(e.id, e);
        const merged = Array.from(entryMap.values()).sort((a, b) => b.timestamp - a.timestamp);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(merged));
      }

      if (cloudData.progress) {
        const localProg = this.getProgress();
        const mergedProg = {
          ...localProg,
          ...cloudData.progress,
          totalPracticeTimeSeconds: Math.max(localProg.totalPracticeTimeSeconds, cloudData.progress.totalPracticeTimeSeconds || 0),
          sessionsCompleted: Math.max(localProg.sessionsCompleted, cloudData.progress.sessionsCompleted || 0),
        };
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(mergedProg));
      }

      if (cloudData.sight) {
        localStorage.setItem(SIGHT_KEY, JSON.stringify(cloudData.sight));
      }
    } catch (err) {
      console.warn('Error merging cloud data into local storage:', err);
    }
  },

  // Perform a full bi-directional Cloud Sync
  async syncWithCloud(): Promise<{ success: boolean; profile: UserProfile; error?: string }> {
    const profile = this.getProfile();
    try {
      // 1. Push local changes to cloud
      const payload = {
        uid: profile.uid || 'user_123',
        profile: {
          uid: profile.uid || 'user_123',
          displayName: profile.displayName,
          email: profile.email,
          curriculumWave: profile.curriculumWave || 1,
          accountTier: profile.accountTier || 'premium',
          avatarSymbol: profile.avatarSymbol,
          primaryIntention: profile.primaryIntention,
          preferredBand: profile.preferredBand,
          dailyGoalMinutes: profile.dailyGoalMinutes,
        },
        journal: this.getJournalEntries(),
        progress: this.getProgress(),
        sight: this.getSightAllocation(),
      };

      const pushRes = await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (pushRes.ok) {
        const pushJson = await pushRes.json();
        const updatedProfile: UserProfile = {
          ...profile,
          cloudSynced: true,
          lastSyncedAt: pushJson.lastSyncedAt || new Date().toISOString(),
        };
        this.saveProfile(updatedProfile);
        return { success: true, profile: updatedProfile };
      }
      throw new Error(`Server returned status ${pushRes.status}`);
    } catch (err: any) {
      console.warn('Cloud sync offline or error:', err);
      const fallbackProfile: UserProfile = {
        ...profile,
        cloudSynced: false,
      };
      this.saveProfile(fallbackProfile);
      return { success: false, profile: fallbackProfile, error: err.message };
    }
  },

  // Silent non-blocking background sync
  pushToCloudBackground() {
    if (typeof window === 'undefined' || !navigator.onLine) return;
    setTimeout(() => {
      this.syncWithCloud().catch(() => {});
    }, 100);
  }
};
