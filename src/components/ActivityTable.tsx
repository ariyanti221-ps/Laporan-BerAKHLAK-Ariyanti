import { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  Edit2,
  Trash2,
  PlusCircle,
  ExternalLink,
  ImageIcon,
  FileSpreadsheet,
} from 'lucide-react';
import { ActivityItem, BerakhlakCategory, BERAKHLAK_CATEGORIES } from '../types';

interface ActivityTableProps {
  activities: ActivityItem[];
  selectedMonthFilter: string;
  onSelectMonthFilter: (month: string) => void;
  onEdit: (activity: ActivityItem) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function ActivityTable({
  activities,
  selectedMonthFilter,
  onSelectMonthFilter,
  onEdit,
  onDelete,
  onAddNew,
}: ActivityTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | BerakhlakCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ekstrak daftar bulan kegiatan dari tanggal (YYYY-MM)
  const availableMonths = useMemo(() => {
    const monthNames: Record<string, string> = {
      '01': 'Januari',
      '02': 'Februari',
      '03': 'Maret',
      '04': 'April',
      '05': 'Mei',
      '06': 'Juni',
      '07': 'Juli',
      '08': 'Agustus',
      '09': 'September',
      '10': 'Oktober',
      '11': 'November',
      '12': 'Desember',
    };

    const map = new Map<string, string>(); // '2026-09' -> 'September 2026'
    activities.forEach((a) => {
      if (a.date && a.date.length >= 7) {
        const ym = a.date.slice(0, 7);
        const [year, month] = ym.split('-');
        const label = `${monthNames[month] || month} ${year}`;
        map.set(ym, label);
      }
    });

    if (map.size === 0) {
      map.set('2026-09', 'September 2026');
    }

    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [activities]);

  // Filter kegiatan berdasarkan bulan dan kategori
  const filtered = useMemo(() => {
    return activities.filter((act) => {
      // 1. Filter bulan kegiatan
      if (selectedMonthFilter !== 'all') {
        if (!act.date.startsWith(selectedMonthFilter)) {
          return false;
        }
      }

      // 2. Filter kategori BerAKHLAK
      if (selectedCategory !== 'all' && !act.categories.includes(selectedCategory)) {
        return false;
      }

      // 3. Pencarian teks
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        act.name.toLowerCase().includes(q) ||
        act.location.toLowerCase().includes(q) ||
        act.results.toLowerCase().includes(q) ||
        act.participants.toLowerCase().includes(q) ||
        act.dateFormatted.toLowerCase().includes(q)
      );
    });
  }, [activities, selectedMonthFilter, selectedCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Controls: Pilihan Bulan Apa & Filter Kategori */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* PILIHAN BULAN APA (BANK KEGIATAN) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-900" />
              <span>Pilihan Bulan Kegiatan:</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onSelectMonthFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  selectedMonthFilter === 'all'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Semua Bulan
              </button>

              {availableMonths.map(([ym, label]) => {
                const count = activities.filter((a) => a.date.startsWith(ym)).length;
                const isSelected = selectedMonthFilter === ym;
                return (
                  <button
                    key={ym}
                    onClick={() => onSelectMonthFilter(ym)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan, tanggal, lokasi..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
            />
          </div>
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Semua Unsur</span>
            </button>

            {BERAKHLAK_CATEGORIES.map((cat) => {
              const countInMonth = activities.filter((a) => {
                const matchM = selectedMonthFilter === 'all' || a.date.startsWith(selectedMonthFilter);
                return matchM && a.categories.includes(cat.id);
              }).length;

              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.order}. {cat.shortName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {countInMonth}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total: <strong className="text-slate-900 tabular-nums">{filtered.length}</strong> kegiatan
          </div>
        </div>
      </div>

      {/* Main Table: HANYA KOLOM RESMI (TIDAK ADA KOLOM BULAN COVER DI TABEL) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3 w-36">Hari / Tanggal</th>
                  <th className="py-3 px-4 min-w-[220px]">Nama Kegiatan</th>
                  <th className="py-3 px-3 min-w-[150px]">Tempat / Platform</th>
                  <th className="py-3 px-3 min-w-[150px]">Pihak Terlibat</th>
                  <th className="py-3 px-4 min-w-[200px]">Hasil</th>
                  <th className="py-3 px-3 min-w-[140px]">Distribusi Nilai</th>
                  <th className="py-3 px-3 w-24 text-center">Dokumentasi</th>
                  <th className="py-3 px-3 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filtered.map((act, idx) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* No */}
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-500 tabular-nums">
                      {idx + 1}
                    </td>

                    {/* Hari / Tanggal */}
                    <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                      {act.dateFormatted || act.date}
                    </td>

                    {/* Nama Kegiatan */}
                    <td className="py-3 px-4 font-semibold text-slate-900 leading-snug">
                      {act.name}
                    </td>

                    {/* Tempat / Platform */}
                    <td className="py-3 px-3 text-slate-600 leading-snug">
                      {act.location}
                    </td>

                    {/* Pihak Terlibat */}
                    <td className="py-3 px-3 text-slate-600 whitespace-pre-line leading-relaxed">
                      {act.participants}
                    </td>

                    {/* Hasil */}
                    <td className="py-3 px-4 text-slate-700 leading-relaxed">
                      {act.results}
                    </td>

                    {/* Kategori Distribusi */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {act.categories.map((cId) => {
                          const catMeta = BERAKHLAK_CATEGORIES.find((c) => c.id === cId);
                          if (!catMeta) return null;
                          return (
                            <span
                              key={cId}
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${catMeta.tagColor}`}
                            >
                              {catMeta.shortName}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Foto / Link Dokumentasi */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {act.photoUrl ? (
                          <div className="w-12 h-9 rounded border border-slate-300 overflow-hidden bg-slate-900 shrink-0">
                            <img
                              src={act.photoUrl}
                              alt="Dokumentasi"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-9 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        {act.driveUrl && (
                          <a
                            href={act.driveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5"
                            title={act.driveUrl}
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            <span>Drive</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEdit(act)}
                          className="p-1 text-slate-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="Ubah Kegiatan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(act.id)}
                          className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Hapus Kegiatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Tidak Ada Kegiatan pada Pilihan Ini
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {searchQuery
                ? `Tidak ditemukan kegiatan dengan kata kunci "${searchQuery}".`
                : 'Belum ada kegiatan untuk kriteria ini. Klik tombol di bawah untuk menambah data baru.'}
            </p>
            <button
              onClick={onAddNew}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Input Kegiatan Baru</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
