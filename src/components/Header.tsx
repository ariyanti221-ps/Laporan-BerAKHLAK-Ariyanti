import { FileText, PlusCircle, UserCheck, Eye, Download, RotateCcw } from 'lucide-react';
import { SupervisorProfile } from '../types';

interface HeaderProps {
  activeTab: 'activities' | 'preview';
  setActiveTab: (tab: 'activities' | 'preview') => void;
  profile: SupervisorProfile;
  totalActivities: number;
  onOpenNewActivity: () => void;
  onOpenProfile: () => void;
  onResetData: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  profile,
  totalActivities,
  onOpenNewActivity,
  onOpenProfile,
  onResetData,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                Laporan BerAKHLAK Pengawas SMA
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Format Resmi F4 Landscape · Margin 1 cm
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'activities'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Bank Kegiatan</span>
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {totalActivities}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau & Ekspor F4</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfile}
              title="Atur Data Pengawas & Cabang Dinas"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-800" />
              <span className="hidden sm:inline font-semibold">{profile.name}</span>
            </button>

            <button
              onClick={onOpenNewActivity}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Kegiatan</span>
            </button>

            <button
              onClick={onResetData}
              title="Kembalikan ke Contoh Data Referensi September 2026"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
