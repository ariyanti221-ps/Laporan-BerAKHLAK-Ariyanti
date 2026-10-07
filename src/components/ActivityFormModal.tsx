import { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Calendar,
  MapPin,
  Users,
  CheckSquare,
  FileCheck2,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import { ActivityItem, BerakhlakCategory, BERAKHLAK_CATEGORIES } from '../types';
import { formatIndonesianDate, getTodayDateString } from '../utils/dateFormatter';
import { compressImage } from '../utils/imageUtils';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityItem) => void;
  initialData?: ActivityItem | null;
}

export function ActivityFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ActivityFormModalProps) {
  const [date, setDate] = useState<string>(getTodayDateString());
  const [dateFormatted, setDateFormatted] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [participants, setParticipants] = useState<string>('• Pengawas Sekolah\n• Staf Cabdin');
  const [results, setResults] = useState<string>('');
  const [categories, setCategories] = useState<BerakhlakCategory[]>(['kolaboratif']);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setDateFormatted(initialData.dateFormatted || formatIndonesianDate(initialData.date));
      setName(initialData.name);
      setLocation(initialData.location);
      setParticipants(initialData.participants);
      setResults(initialData.results);
      setCategories(initialData.categories.length > 0 ? initialData.categories : ['kolaboratif']);
      setPhotoUrl(initialData.photoUrl || '');
    } else {
      const today = getTodayDateString();
      setDate(today);
      setDateFormatted(formatIndonesianDate(today));
      setName('');
      setLocation('Cabang Dinas Pendidikan Wil Jember-Kab Lumajang');
      setParticipants('• Pengawas Sekolah\n• Staf Cabdin');
      setResults('');
      setCategories(['kolaboratif']);
      setPhotoUrl('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setDateFormatted(formatIndonesianDate(newDate));
  };

  const toggleCategory = (catId: BerakhlakCategory) => {
    if (categories.includes(catId)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== catId));
      }
    } else {
      setCategories([...categories, catId]);
    }
  };

  const selectAllCategories = () => {
    setCategories(BERAKHLAK_CATEGORIES.map((c) => c.id));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      const compressed = await compressImage(file, 800, 0.82);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error('Gagal mengompresi foto:', err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categories.length === 0) {
      return;
    }

    const activityItem: ActivityItem = {
      id: initialData?.id || `act-${Date.now()}`,
      date,
      dateFormatted: dateFormatted || formatIndonesianDate(date),
      name: name.trim(),
      location: location.trim(),
      participants: participants.trim(),
      results: results.trim(),
      categories,
      photoUrl,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(activityItem);
    onClose();
  };

  const addParticipantSuggestion = (text: string) => {
    const trimmed = text.trim();
    if (!participants.includes(trimmed)) {
      setParticipants((prev) => (prev ? `${prev}\n• ${trimmed}` : `• ${trimmed}`));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? 'Ubah Data Kegiatan' : 'Input Kegiatan Baru'}
            </h2>
            <p className="text-xs text-slate-500">
              Data akan didistribusikan otomatis ke seluruh laporan BerAKHLAK yang dicentang
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* DISTRIBUSI MULTI-KATEGORI BERAKHLAK */}
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-blue-800" />
                <span>Pilih Kategori Perilaku Kerja BerAKHLAK (Bisa Centang Beberapa)</span>
              </label>
              <button
                type="button"
                onClick={selectAllCategories}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline"
              >
                Pilih Semua (7 Laporan)
              </button>
            </div>

            <p className="text-[11px] text-blue-900/80 mb-2.5">
              Kegiatan ini akan otomatis masuk ke laporan nilai-nilai yang dicentang:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BERAKHLAK_CATEGORIES.map((cat) => {
                const isChecked = categories.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-white border-blue-800 shadow-xs ring-1 ring-blue-800/20'
                        : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCategory(cat.id)}
                      className="mt-0.5 rounded text-blue-900 focus:ring-blue-800 h-3.5 w-3.5"
                    />
                    <div className="leading-tight">
                      <span className="font-semibold block text-slate-900">
                        {cat.order}. {cat.shortName}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
            {categories.length === 0 && (
              <p className="text-[11px] text-red-600 font-semibold mt-1.5">
                * Pilih minimal satu kategori BerAKHLAK
              </p>
            )}
          </div>

          {/* HARI & TANGGAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Pilih Tanggal Kegiatan</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Format Teks Hari/Tanggal (Kolom Tabel)
              </label>
              <input
                type="text"
                required
                value={dateFormatted}
                onChange={(e) => setDateFormatted(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900 font-medium text-slate-800"
                placeholder="Rabu, 2 September 2026"
              />
            </div>
          </div>

          {/* NAMA / BENTUK KEGIATAN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama / Bentuk Kegiatan
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900 font-medium text-slate-900"
              placeholder="Contoh: Mengikuti sosialisasi RSDM bersama Cabdindik Wilayah Jember"
            />
          </div>

          {/* TEMPAT / PLATFORM KEGIATAN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Tempat / Platform Kegiatan</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
              placeholder="Contoh: SMAN 2 Lumajang / Zoom Meeting / Kantor Cabdin"
            />
          </div>

          {/* SASARAN / PIHAK TERLIBAT */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Sasaran / Pihak Terlibat</span>
              </label>
              <div className="flex gap-1">
                {['Pengawas', 'Kepala Sekolah', 'Staf Cabdin', 'Kasi SMA/SMK'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => addParticipantSuggestion(sug)}
                    className="text-[10px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded transition-colors"
                  >
                    +{sug}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={3}
              required
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900 font-mono"
              placeholder="• Kasubag Cabdin&#10;• Kasi SMA/SMK&#10;• Pengawas&#10;• Kepala Sekolah"
            />
          </div>

          {/* HASIL KEGIATAN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Hasil Kegiatan</span>
            </label>
            <textarea
              rows={3}
              required
              value={results}
              onChange={(e) => setResults(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900 text-slate-800"
              placeholder="Contoh: Aplikasi RSDM tersampaikan dengan baik, sebagai dasar distribusi ASN..."
            />
          </div>

          {/* DOKUMENTASI (FOTO) */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>Foto Dokumentasi Kegiatan (Kolom KET)</span>
            </label>

            {photoUrl ? (
              <div className="relative rounded-lg border border-slate-300 overflow-hidden bg-slate-900 aspect-16/10 max-h-44 flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Pratinjau Foto"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1 bg-red-600/90 hover:bg-red-700 text-white rounded-md text-xs transition-colors shadow-xs"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-800 rounded-lg p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30 flex flex-col items-center justify-center gap-1 h-28"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-700">
                  {isProcessingPhoto ? 'Mengompresi...' : 'Unggah Foto Dokumentasi'}
                </span>
                <span className="text-[10px] text-slate-400">JPG, PNG (Otomatis Dioptimalkan)</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={categories.length === 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Simpan Kegiatan & Distribusikan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
