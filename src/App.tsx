import { useState, useEffect, useMemo } from 'react';
import {
  Settings,
  Download,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { ActivityItem, BERAKHLAK_CATEGORIES, SupervisorProfile } from './types';
import {
  loadActivities,
  saveActivities,
  loadProfile,
  saveProfile,
  resetToDefaultData,
  exportBackupJson,
} from './utils/storage';
import { Header } from './components/Header';
import { ActivityTable } from './components/ActivityTable';
import { ActivityFormModal } from './components/ActivityFormModal';
import { ProfileModal } from './components/ProfileModal';
import { DocumentPreview } from './components/DocumentPreview';
import { PrintDocumentView } from './components/PrintDocumentView';

export default function App() {
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadActivities());
  const [profile, setProfile] = useState<SupervisorProfile>(() => loadProfile());
  const [activeTab, setActiveTab] = useState<'activities' | 'preview'>('activities');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSaveActivity = (activity: ActivityItem) => {
    if (editingActivity) {
      setActivities((prev) =>
        prev.map((act) => (act.id === activity.id ? activity : act))
      );
      showToast('Kegiatan berhasil diperbarui dan didistribusikan ke laporan terpilih.');
    } else {
      setActivities((prev) => [activity, ...prev]);
      showToast(`Kegiatan baru berhasil disimpan ke ${activity.categories.length} laporan BerAKHLAK!`);
    }
    setEditingActivity(null);
  };

  const handleEditActivity = (activity: ActivityItem) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleDeleteActivity = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      setActivities((prev) => prev.filter((act) => act.id !== id));
      showToast('Kegiatan telah dihapus.');
    }
  };

  const handleSaveProfile = (updatedProfile: SupervisorProfile) => {
    setProfile(updatedProfile);
    showToast('Profil pengawas, logo, dan bulan cover berhasil diperbarui.');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Kembalikan data ke contoh asli Dokumen September 2026 (Bu Ariyanti, Cabdin Jember-Lumajang)? Data yang belum dicadangkan akan diganti.'
      )
    ) {
      const reset = resetToDefaultData();
      setActivities(reset.activities);
      setProfile(reset.profile);
      setSelectedMonthFilter('all');
      showToast('Data berhasil dikembalikan ke contoh referensi.');
    }
  };

  // Filter kegiatan berdasarkan pilihan bulan kegiatan
  const filteredActivitiesForView = useMemo(() => {
    if (selectedMonthFilter === 'all') return activities;
    return activities.filter((a) => a.date.startsWith(selectedMonthFilter));
  }, [activities, selectedMonthFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Printable View (Visible only during printing) */}
      <PrintDocumentView
        category="kolaboratif"
        activities={filteredActivitiesForView}
        profile={profile}
        periodMonth={profile.periodMonth}
      />

      {/* Screen App Interface (Hidden during printing) */}
      <div className="no-print flex-1 flex flex-col">
        {/* Top Header Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          totalActivities={activities.length}
          onOpenNewActivity={() => {
            setEditingActivity(null);
            setIsFormOpen(true);
          }}
          onOpenProfile={() => setIsProfileOpen(true)}
          onResetData={handleResetData}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Identity & Core Value Distribution Dashboard Banner */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                  <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-blue-950 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-800" />
                    Bulan Cover: {profile.periodMonth}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">{profile.institutionBranch}</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {profile.name} — {profile.role}
                </h1>
                <p className="text-xs text-slate-500">
                  {profile.institutionGov} · NIP. {profile.nip}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Ubah Profil, Bulan & Instansi</span>
                </button>

                <button
                  onClick={() => exportBackupJson(activities, profile, profile.periodMonth)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Unduh cadangan data dalam format JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Backup JSON</span>
                </button>
              </div>
            </div>

            {/* Core Values Distribution Counters */}
            <div>
              <div className="text-xs font-semibold text-slate-600 mb-2 flex items-center justify-between">
                <span>
                  Distribusi Kegiatan ke 7 Unsur BerAKHLAK:
                </span>
                <span className="text-[11px] text-slate-400">
                  *Satu kegiatan dapat terdistribusi ke beberapa unsur sekaligus
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {BERAKHLAK_CATEGORIES.map((cat) => {
                  const count = filteredActivitiesForView.filter((a) =>
                    a.categories.includes(cat.id)
                  ).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setActiveTab('preview')}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-900 hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="text-[11px] font-bold text-slate-700 group-hover:text-blue-900 leading-tight">
                        {cat.order}. {cat.shortName}
                      </div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-lg font-bold text-slate-900 tabular-nums">
                          {count}
                        </span>
                        <span className="text-[10px] text-slate-500">kegiatan</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab View Switcher */}
          {activeTab === 'activities' ? (
            <ActivityTable
              activities={activities}
              selectedMonthFilter={selectedMonthFilter}
              onSelectMonthFilter={setSelectedMonthFilter}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
              onAddNew={() => {
                setEditingActivity(null);
                setIsFormOpen(true);
              }}
            />
          ) : (
            <DocumentPreview
              activities={activities}
              profile={profile}
              selectedMonthFilter={selectedMonthFilter}
              onSelectMonthFilter={setSelectedMonthFilter}
              onUpdateProfileDrive={(category, url) => {
                setProfile((prev) => ({
                  ...prev,
                  driveFolders: {
                    ...prev.driveFolders,
                    [category]: url,
                  },
                }));
              }}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>
              Laporan Hasil Kegiatan Bulanan Pengawas SMA · Standar Core Values ASN BerAKHLAK
            </span>
            <span>
              Format Dokumen: Folio / F4 Landscape (215 mm × 330 mm) · Margin 1.0 cm
            </span>
          </div>
        </footer>
      </div>

      {/* Activity Input/Edit Modal */}
      <ActivityFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveActivity}
        initialData={editingActivity}
      />

      {/* Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
