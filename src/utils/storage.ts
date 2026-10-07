import { ActivityItem, SupervisorProfile } from '../types';
import { INITIAL_ACTIVITIES, INITIAL_SUPERVISOR_PROFILE } from './sampleData';

const STORAGE_KEYS = {
  ACTIVITIES: 'berakhlak_activities_v2',
  PROFILE: 'berakhlak_supervisor_profile_v2',
};

export function loadActivities(): ActivityItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      saveActivities(INITIAL_ACTIVITIES);
      return INITIAL_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((act) => ({
        ...act,
        periodMonth: act.periodMonth || 'SEPTEMBER 2026',
      }));
    }
    return INITIAL_ACTIVITIES;
  } catch (e) {
    console.error('Gagal memuat kegiatan dari penyimpanan lokal:', e);
    return INITIAL_ACTIVITIES;
  }
}

export function saveActivities(activities: ActivityItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.error('Gagal menyimpan kegiatan ke penyimpanan lokal:', e);
  }
}

export function loadProfile(): SupervisorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      saveProfile(INITIAL_SUPERVISOR_PROFILE);
      return INITIAL_SUPERVISOR_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return { ...INITIAL_SUPERVISOR_PROFILE, ...parsed };
  } catch (e) {
    console.error('Gagal memuat profil pengawas:', e);
    return INITIAL_SUPERVISOR_PROFILE;
  }
}

export function saveProfile(profile: SupervisorProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Gagal menyimpan profil pengawas:', e);
  }
}

export function resetToDefaultData(): { activities: ActivityItem[]; profile: SupervisorProfile } {
  saveActivities(INITIAL_ACTIVITIES);
  saveProfile(INITIAL_SUPERVISOR_PROFILE);
  return {
    activities: INITIAL_ACTIVITIES,
    profile: INITIAL_SUPERVISOR_PROFILE,
  };
}

export function exportBackupJson(
  activities: ActivityItem[],
  profile: SupervisorProfile,
  periodMonth = 'SEPTEMBER 2026'
): void {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    profile,
    activities,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_laporan_berakhlak_${periodMonth.replace(/\s+/g, '_').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
