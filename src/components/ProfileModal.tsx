import { useState } from 'react';
import { X, Save, Building2, User, Link2, BookOpen, Calendar, Image as ImageIcon } from 'lucide-react';
import { BERAKHLAK_CATEGORIES, BerakhlakCategory, SupervisorProfile } from '../types';
import { LogoJatim } from './LogoJatim';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SupervisorProfile;
  onSave: (updated: SupervisorProfile) => void;
}

export function ProfileModal({ isOpen, onClose, profile, onSave }: ProfileModalProps) {
  const [formData, setFormData] = useState<SupervisorProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'profile' | 'assessments' | 'drives'>('profile');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const updateDrive = (cat: BerakhlakCategory, url: string) => {
    setFormData((prev) => ({
      ...prev,
      driveFolders: {
        ...prev.driveFolders,
        [cat]: url,
      },
    }));
  };

  const updateAssessment = (cat: BerakhlakCategory, text: string) => {
    setFormData((prev) => ({
      ...prev,
      selfAssessments: {
        ...prev.selfAssessments,
        [cat]: text,
      },
    }));
  };

  const applyDefaultDriveToAll = (url: string) => {
    const updated = {} as Record<BerakhlakCategory, string>;
    BERAKHLAK_CATEGORIES.forEach((c) => {
      updated[c.id] = url;
    });
    setFormData((prev) => ({ ...prev, driveFolders: updated }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Pengaturan Profil Pengawas & Format Laporan
            </h2>
            <p className="text-xs text-slate-500">
              Data ini akan tercetak otomatis pada Halaman Cover, Kepala Tabel, dan Lembar Tanda Tangan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Sub-nav */}
        <div className="flex border-b border-slate-200 bg-white px-6 gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-900 text-blue-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Identitas Pengawas & Cabdin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assessments')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'assessments'
                ? 'border-blue-900 text-blue-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Deskripsi Self Asesmen (7 Unsur)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('drives')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'drives'
                ? 'border-blue-900 text-blue-950'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Tautan Folder Drive Bukti Dukung</span>
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Logo Resmi Preview */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-20 bg-white border border-slate-200 rounded p-1 flex items-center justify-center shrink-0">
                  <LogoJatim className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-900" />
                    <span>Logo Resmi Pemerintah Provinsi Jawa Timur</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Menggunakan file gambar Logo Jatim resmi yang Anda unggah (Jer Basuki Mawa Beya) untuk dicetak di Halaman Cover Dokumen Word dan PDF.
                  </p>
                </div>
              </div>

              {/* Bulan di Cover (Diletakkan di profil seperti sebelumnya) */}
              <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-lg">
                <label className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Periode Bulan Laporan (Tertulis di Halaman Cover)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={formData.periodMonth}
                    onChange={(e) => setFormData({ ...formData, periodMonth: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-1.5 text-xs border border-amber-300 rounded-lg focus:outline-blue-900 font-bold bg-white text-amber-950"
                    placeholder="SEPTEMBER 2026"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {['AGUSTUS 2026', 'SEPTEMBER 2026', 'OKTOBER 2026', 'NOVEMBER 2026'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormData({ ...formData, periodMonth: m })}
                        className="text-[10px] px-2 py-1 rounded border border-amber-200 bg-white hover:bg-amber-100 text-amber-900 font-medium"
                      >
                        {m.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-amber-800 mt-1">
                  Bulan ini akan tercetak tebal di tengah halaman sampul (Cover).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap & Gelar Pengawas
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900 font-semibold"
                    placeholder="Contoh: ARIYANTI, M.Pd"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP Pengawas
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900 font-mono"
                    placeholder="Contoh: 19821216 200903 2 007"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan (Halaman Cover)
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
                    placeholder="Pengawas Sekolah"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan Tanda Tangan (Halaman Lembar Pengesahan)
                  </label>
                  <input
                    type="text"
                    value={formData.signingTitle}
                    onChange={(e) => setFormData({ ...formData, signingTitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
                    placeholder="Pengawas/Pendamping Sekolah,"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kota Penandatanganan (Sebelum TTD)
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
                    placeholder="Lumajang"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Pembuatan Laporan Default (Sebelum TTD)
                  </label>
                  <input
                    type="text"
                    value={formData.signingDate}
                    onChange={(e) => setFormData({ ...formData, signingDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
                    placeholder="30 September 2026"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tanggal ini juga dapat Anda ubah langsung di pratinjau dokumen sebelum unduh/ttd.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  Kop & Instansi Kedinasan
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Pemerintah Provinsi
                    </label>
                    <input
                      type="text"
                      value={formData.institutionGov}
                      onChange={(e) => setFormData({ ...formData, institutionGov: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Dinas Pendidikan
                    </label>
                    <input
                      type="text"
                      value={formData.institutionDept}
                      onChange={(e) => setFormData({ ...formData, institutionDept: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Cabang Dinas Pendidikan
                    </label>
                    <input
                      type="text"
                      value={formData.institutionBranch}
                      onChange={(e) => setFormData({ ...formData, institutionBranch: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Alamat Kantor, No Telp, Email
                    </label>
                    <input
                      type="text"
                      value={formData.institutionAddress}
                      onChange={(e) => setFormData({ ...formData, institutionAddress: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Kota & Kode Pos
                    </label>
                    <input
                      type="text"
                      value={formData.institutionPostal}
                      onChange={(e) => setFormData({ ...formData, institutionPostal: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                Deskripsi Self Asesmen ini akan muncul tepat di atas tabel kegiatan pada masing-masing dokumen BerAKHLAK. Anda dapat mengubah narasi sesuai refleksi kinerja bulanan Anda.
              </p>
              {BERAKHLAK_CATEGORIES.map((cat) => (
                <div key={cat.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {cat.order}. Unsur Value {cat.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateAssessment(cat.id, cat.defaultSelfAssessment)}
                      className="text-[11px] text-blue-700 hover:underline"
                    >
                      Reset Default
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.selfAssessments[cat.id] || ''}
                    onChange={(e) => updateAssessment(cat.id, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-blue-900"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'drives' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Atur Tautan Folder Google Drive Utama (Terapkan ke Semua Unsur)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    id="bulkDriveInput"
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('bulkDriveInput') as HTMLInputElement;
                      if (input && input.value) {
                        applyDefaultDriveToAll(input.value);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {BERAKHLAK_CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Folder Bukti Unsur {cat.name}
                    </label>
                    <input
                      type="url"
                      value={formData.driveFolders[cat.id] || ''}
                      onChange={(e) => updateDrive(cat.id, e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono text-slate-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

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
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
