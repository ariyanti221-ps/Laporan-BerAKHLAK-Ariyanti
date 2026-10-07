import { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Printer,
  FileArchive,
  Clock,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Loader2,
  Calendar,
  Link2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { ActivityItem, BerakhlakCategory, BERAKHLAK_CATEGORIES, SupervisorProfile } from '../types';
import { LogoJatim } from './LogoJatim';
import { generateBerakhlakDocx } from '../utils/docxExport';
import { generateAllReportsZip } from '../utils/zipExport';

interface DocumentPreviewProps {
  activities: ActivityItem[];
  profile: SupervisorProfile;
  selectedMonthFilter: string;
  onSelectMonthFilter: (month: string) => void;
  onUpdateProfileDrive?: (category: BerakhlakCategory, url: string) => void;
}

export function DocumentPreview({
  activities,
  profile,
  selectedMonthFilter,
  onSelectMonthFilter,
  onUpdateProfileDrive,
}: DocumentPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<BerakhlakCategory>('kolaboratif');
  const [activeView, setActiveView] = useState<'both' | 'cover' | 'table'>('both');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Input tanggal pembuatan laporan sebelum TTD
  const [reportCreationDate, setReportCreationDate] = useState<string>(
    profile.signingDate || '30 September 2026'
  );

  // Input link Google Drive bulanan setelah TTD (ditambahkan sekali setiap bulan)
  const [monthlyDriveLink, setMonthlyDriveLink] = useState<string>(
    profile.driveFolders['kolaboratif'] ||
      'https://drive.google.com/drive/folders/1TL5pRoQ7QLeRwD5kYJQeWdK5Yo7c4VQe?usp=sharing'
  );

  const currentMeta = BERAKHLAK_CATEGORIES.find((c) => c.id === selectedCategory)!;

  useEffect(() => {
    setMonthlyDriveLink(
      profile.driveFolders[selectedCategory] ||
        profile.driveFolders.kolaboratif ||
        'https://drive.google.com/drive/folders/1TL5pRoQ7QLeRwD5kYJQeWdK5Yo7c4VQe?usp=sharing'
    );
  }, [selectedCategory, profile.driveFolders]);

  const handleDriveLinkChange = (url: string) => {
    setMonthlyDriveLink(url);
    if (onUpdateProfileDrive) {
      onUpdateProfileDrive(selectedCategory, url);
    }
  };

  // Filter activities berdasarkan kategori dan filter bulan (jika difilter)
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchCat = act.categories.includes(selectedCategory);
      const matchMonth =
        selectedMonthFilter === 'all' || act.date.startsWith(selectedMonthFilter);
      return matchCat && matchMonth;
    });
  }, [activities, selectedCategory, selectedMonthFilter]);

  // Generate QR Code untuk verifikasi dokumen
  useEffect(() => {
    const text = `DOKUMEN RESMI PENGAWAS SMA\nNama: ${profile.name}\nNIP: ${profile.nip}\nUnsur: ${currentMeta.name}\nPeriode: ${profile.periodMonth}\nCabdin: ${profile.institutionBranch}\nTanggal: ${profile.city}, ${reportCreationDate}`;
    QRCode.toDataURL(text, { width: 140, margin: 1 })
      .then(setQrCodeUrl)
      .catch((err) => console.error('Gagal membuat QR:', err));
  }, [profile, currentMeta, reportCreationDate]);

  // Export single Word (.docx)
  const handleExportDocx = async () => {
    try {
      setIsExportingWord(true);
      const updatedProfile = {
        ...profile,
        driveFolders: {
          ...profile.driveFolders,
          [selectedCategory]: monthlyDriveLink,
        },
      };
      const blob = await generateBerakhlakDocx(
        selectedCategory,
        filteredActivities,
        updatedProfile,
        profile.periodMonth,
        reportCreationDate
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan_${currentMeta.name.replace(/\s+/g, '_')}_${profile.periodMonth.replace(/\s+/g, '_')}_F4.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal mengekspor dokumen Word:', err);
      alert('Terjadi kendala saat merakit dokumen Word. Silakan coba kembali.');
    } finally {
      setIsExportingWord(false);
    }
  };

  // Export batch ZIP (7 Laporan BerAKHLAK)
  const handleExportZip = async () => {
    try {
      setIsExportingZip(true);
      const targetActivities =
        selectedMonthFilter === 'all'
          ? activities
          : activities.filter((a) => a.date.startsWith(selectedMonthFilter));

      const updatedProfile = {
        ...profile,
        driveFolders: {
          ...profile.driveFolders,
          [selectedCategory]: monthlyDriveLink,
        },
      };

      const blob = await generateAllReportsZip(
        targetActivities,
        updatedProfile,
        profile.periodMonth,
        reportCreationDate,
        (cur, tot, name) => {
          setZipProgress(`Merakit ${cur}/${tot}: ${name}...`);
        }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Bundel_Laporan_BerAKHLAK_7_Unsur_${profile.periodMonth.replace(/\s+/g, '_')}_F4.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal mengekspor bundel ZIP:', err);
      alert('Terjadi kendala saat merakit bundel ZIP. Silakan coba kembali.');
    } finally {
      setIsExportingZip(false);
      setZipProgress('');
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Row 1: Informasi Bulan di Cover, Input Tanggal Pembuatan Laporan Sebelum TTD, & Tautan Drive Bulanan Setelah TTD */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-3 border-b border-slate-100">
          {/* Bulan Cover */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-4 h-4 text-blue-900" />
              <span>Bulan di Cover (Profil):</span>
            </span>
            <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-950 font-bold rounded text-xs">
              {profile.periodMonth}
            </span>
          </div>

          {/* INPUT TANGGAL PEMBUATAN LAPORAN SEBELUM TTD */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Tgl Sebelum TTD:</span>
            </label>
            <input
              type="text"
              value={reportCreationDate}
              onChange={(e) => setReportCreationDate(e.target.value)}
              placeholder="30 September 2026"
              className="flex-1 px-2.5 py-1 text-xs border border-emerald-300 rounded-lg focus:outline-emerald-800 font-semibold text-slate-900 bg-emerald-50/40"
              title="Tanggal ini langsung tertulis sebelum tanda tangan pengawas"
            />
          </div>

          {/* INPUT TAUTAN GOOGLE DRIVE BULANAN SETELAH TTD (DITAMBAHKAN SEKALI SETIAP BULAN) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 whitespace-nowrap">
              <Link2 className="w-4 h-4 text-blue-700" />
              <span>Link Drive (Setelah TTD):</span>
            </label>
            <input
              type="url"
              value={monthlyDriveLink}
              onChange={(e) => handleDriveLinkChange(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="flex-1 px-2.5 py-1 text-xs border border-blue-300 rounded-lg focus:outline-blue-900 font-mono text-blue-950 bg-blue-50/40"
              title="Tautan folder Google Drive ini dicetak sekali di bawah tanda tangan pengawas"
            />
          </div>
        </div>

        {/* Row 2: Category Selector Buttons & Export Buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {BERAKHLAK_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = activities.filter((a) => {
                const matchM =
                  selectedMonthFilter === 'all' || a.date.startsWith(selectedMonthFilter);
                return matchM && a.categories.includes(cat.id);
              }).length;

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
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View mode toggle */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-xs font-medium">
              <button
                onClick={() => setActiveView('both')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeView === 'both' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Semua Halaman
              </button>
              <button
                onClick={() => setActiveView('cover')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeView === 'cover' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Cover
              </button>
              <button
                onClick={() => setActiveView('table')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeView === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
                }`}
              >
                Tabel Kegiatan
              </button>
            </div>

            {/* Unduh Word (DOCX) */}
            <button
              onClick={handleExportDocx}
              disabled={isExportingWord || isExportingZip}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              title="Unduh format Microsoft Word F4 Landscape Margin 1 cm"
            >
              {isExportingWord ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Unduh Word (.docx)</span>
            </button>

            {/* Cetak / Simpan PDF */}
            <button
              onClick={handlePrintPdf}
              className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
              title="Cetak atau Simpan langsung ke PDF ukuran F4 Landscape"
            >
              <Printer className="w-3.5 h-3.5 text-amber-800" />
              <span>Cetak / PDF</span>
            </button>

            {/* Unduh Bundel ZIP (7 Dokumen) */}
            <button
              onClick={handleExportZip}
              disabled={isExportingZip || isExportingWord}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              title="Unduh seluruh 7 dokumen BerAKHLAK sekaligus dalam 1 file ZIP"
            >
              {isExportingZip ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileArchive className="w-3.5 h-3.5" />
              )}
              <span>Bundel 7 Laporan (.zip)</span>
            </button>
          </div>
        </div>
      </div>

      {zipProgress && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2 rounded-lg flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-emerald-700" />
          <span>{zipProgress}</span>
        </div>
      )}

      {/* Info Banner Spesifikasi F4 */}
      <div className="bg-blue-50/60 border border-blue-200/60 px-4 py-2 rounded-xl flex items-center justify-between text-xs text-blue-950">
        <div className="flex items-center gap-2">
          <span className="font-bold">Spesifikasi Dokumen:</span>
          <span>Kertas F4 Landscape (215 × 330 mm)</span>
          <span>·</span>
          <span>Margin 1.0 cm</span>
          <span>·</span>
          <span>Bulan di Cover: <strong className="text-blue-900">{profile.periodMonth}</strong></span>
          <span>·</span>
          <span>Tanggal Sebelum TTD: <strong className="text-emerald-800">{reportCreationDate}</strong></span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <button
            onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
            className="p-1 hover:bg-blue-100 rounded text-slate-700"
            title="Perkecil Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] tabular-nums px-1">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
            className="p-1 hover:bg-blue-100 rounded text-slate-700"
            title="Perbesar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (WYSIWYG F4 CANVAS) */}
      <div className="bg-slate-700/10 p-4 sm:p-6 rounded-2xl border border-slate-200/80 overflow-x-auto flex flex-col items-center gap-8">
        {/* ================= PAGE 1: COVER PAGE ================= */}
        {(activeView === 'both' || activeView === 'cover') && (
          <div
            style={{
              width: `${(1150 * zoomLevel) / 100}px`,
              minHeight: `${(750 * zoomLevel) / 100}px`,
            }}
            className="bg-white shadow-xl rounded-sm border border-slate-300 text-black font-serif relative flex flex-col justify-between p-10 sm:p-12 transition-transform duration-200"
          >
            {/* Visual Margin 1cm indicator */}
            <div className="absolute inset-3 border border-dashed border-slate-200 pointer-events-none rounded-none" />

            {/* Judul Atas */}
            <div className="text-center space-y-1 pt-6">
              <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
                LAPORAN HASIL KEGIATAN
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
                UNSUR VALUE {currentMeta.name.toUpperCase()}
              </h2>
            </div>

            {/* Logo Resmi Provinsi Jawa Timur (Gambar yang diunggah pengguna) */}
            <div className="flex flex-col items-center justify-center my-6">
              <LogoJatim className="w-28 h-36" />
            </div>

            {/* Identitas Pengawas */}
            <div className="text-center space-y-1">
              <div className="text-lg sm:text-xl font-bold underline underline-offset-4 tracking-wide">
                {profile.name}
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {profile.role}
              </div>
            </div>

            {/* Periode Bulan di Cover (Dari Profil Pengawas) */}
            <div className="text-center my-4">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-950">
                {profile.periodMonth}
              </div>
            </div>

            {/* Kop Instansi Bawah */}
            <div className="text-center space-y-0.5 pb-4 text-xs sm:text-sm">
              <div className="font-bold">{profile.institutionGov}</div>
              <div className="font-bold">{profile.institutionDept}</div>
              <div className="font-bold">{profile.institutionBranch}</div>
              <div className="text-slate-700">{profile.institutionAddress}</div>
              <div className="text-slate-700">{profile.institutionPostal}</div>
            </div>

            <div className="absolute bottom-2 right-4 text-[10px] font-sans text-slate-400">
              Halaman Sampul (Cover Resmi)
            </div>
          </div>
        )}

        {/* ================= PAGE 2: TABEL LAPORAN KEGIATAN ================= */}
        {(activeView === 'both' || activeView === 'table') && (
          <div
            style={{
              width: `${(1150 * zoomLevel) / 100}px`,
              minHeight: `${(750 * zoomLevel) / 100}px`,
            }}
            className="bg-white shadow-xl rounded-sm border border-slate-300 text-black font-serif relative p-8 sm:p-10 flex flex-col justify-between transition-transform duration-200"
          >
            {/* Visual Margin 1cm indicator */}
            <div className="absolute inset-3 border border-dashed border-slate-200 pointer-events-none rounded-none" />

            <div>
              {/* Header Tabel */}
              <div className="text-center mb-3">
                <h2 className="text-base sm:text-lg font-bold">
                  LAPORAN HASIL KEGIATAN
                </h2>
                <h3 className="text-base sm:text-lg font-bold underline underline-offset-2">
                  UNSUR VALUE {currentMeta.name.toUpperCase()}
                </h3>
              </div>

              {/* Self Assessment */}
              <div className="text-xs sm:text-sm mb-3 leading-relaxed text-justify">
                <span className="font-bold">DESKRIPSI SELF ASESMEN : </span>
                <span className="italic">
                  {profile.selfAssessments[selectedCategory] || currentMeta.defaultSelfAssessment}
                </span>
              </div>

              {/* TABEL 7 KOLOM FORMAT RESMI TANPA KOLOM TAMBAHAN */}
              <div className="w-full overflow-hidden border border-black mb-6">
                <table className="w-full border-collapse text-left text-[11px] sm:text-xs">
                  <thead>
                    <tr className="bg-[#F8D7DA] text-black font-bold text-center border-b border-black">
                      <th className="border-r border-black p-2 w-8">NO</th>
                      <th className="border-r border-black p-2 w-32">
                        HARI/TANGGAL<br />KEGIATAN
                      </th>
                      <th className="border-r border-black p-2 w-48">
                        NAMA/BENTUK<br />KEGIATAN
                      </th>
                      <th className="border-r border-black p-2 w-40">
                        TEMPAT/PLATFORM<br />KEGIATAN
                      </th>
                      <th className="border-r border-black p-2 w-40">
                        SASARAN/ PIHAK<br />TERLIBAT
                      </th>
                      <th className="border-r border-black p-2 w-52">HASIL</th>
                      <th className="p-2 w-44">K E T</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black text-black">
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((act, index) => (
                        <tr key={act.id} className="border-b border-black align-top">
                          {/* 1. NO */}
                          <td className="border-r border-black p-2 text-center font-medium">
                            {index + 1}
                          </td>

                          {/* 2. HARI/TANGGAL */}
                          <td className="border-r border-black p-2 font-medium">
                            {act.dateFormatted || act.date}
                          </td>

                          {/* 3. NAMA/BENTUK KEGIATAN */}
                          <td className="border-r border-black p-2 leading-relaxed">
                            {act.name}
                          </td>

                          {/* 4. TEMPAT/PLATFORM */}
                          <td className="border-r border-black p-2 leading-relaxed">
                            {act.location}
                          </td>

                          {/* 5. SASARAN/PIHAK TERLIBAT */}
                          <td className="border-r border-black p-2 leading-relaxed whitespace-pre-line">
                            {act.participants}
                          </td>

                          {/* 6. HASIL */}
                          <td className="border-r border-black p-2 leading-relaxed text-justify">
                            {act.results}
                          </td>

                          {/* 7. K E T (Dokumentasi Foto Saja) */}
                          <td className="p-2 text-center align-middle">
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              {act.photoUrl ? (
                                <div className="w-32 h-24 border border-black/80 overflow-hidden bg-slate-900 rounded-xs shadow-xs">
                                  <img
                                    src={act.photoUrl}
                                    alt="Dokumentasi"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ) : (
                                <div className="text-[11px] italic text-slate-500 py-3">
                                  Dokumentasi Terlampir
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center italic text-slate-500">
                          Belum ada kegiatan yang didistribusikan ke unsur {currentMeta.name}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bagian Bawah: Tanda Tangan & Bukti Dukung Folder Drive (HANYA DITAMBAHKAN SEKALI SETIAP BULAN DI SINI) */}
            <div className="pt-4 space-y-4">
              {/* Blok Pengesahan Kanan Bawah: DENGAN INPUT TANGGAL PEMBUATAN LAPORAN SEBELUM TTD */}
              <div className="flex justify-end">
                <div className="text-right space-y-1 w-72 pr-2">
                  <div className="text-xs sm:text-sm font-semibold">
                    {profile.city}, {reportCreationDate}
                  </div>
                  <div className="text-xs sm:text-sm">{profile.signingTitle}</div>

                  {/* QR Code Verifikasi */}
                  <div className="flex justify-end py-1">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code Verifikasi Dokumen"
                        className="w-16 h-16 border border-slate-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 border border-slate-300" />
                    )}
                  </div>

                  <div className="text-xs sm:text-sm font-bold underline underline-offset-2">
                    {profile.name}
                  </div>
                  <div className="text-xs sm:text-sm">NIP. {profile.nip}</div>
                </div>
              </div>

              {/* Tautan Folder Google Drive Kiri Bawah (Hanya Ditambahkan Sekali Setiap Bulan di Bawah TTD) */}
              <div className="text-left text-xs sm:text-sm pt-2 border-t border-slate-200">
                <div className="font-bold">
                  Bukti Dukung Pelaksanaan Kegiatan Tersedia di Folder Dokumentasi Unsur {currentMeta.name}:
                </div>
                <a
                  href={monthlyDriveLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline break-all font-sans text-xs"
                >
                  {monthlyDriveLink || 'https://drive.google.com/drive/folders/...'}
                </a>
              </div>
            </div>

            <div className="absolute bottom-2 right-4 text-[10px] font-sans text-slate-400">
              Format Kertas F4 Landscape · Margin 1 cm
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
