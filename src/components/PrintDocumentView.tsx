import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ActivityItem, BerakhlakCategory, BERAKHLAK_CATEGORIES, SupervisorProfile } from '../types';
import { LogoJatim } from './LogoJatim';

interface PrintDocumentViewProps {
  category: BerakhlakCategory;
  activities: ActivityItem[];
  profile: SupervisorProfile;
  periodMonth?: string;
  reportCreationDate?: string;
}

export function PrintDocumentView({
  category,
  activities,
  profile,
  periodMonth = 'SEPTEMBER 2026',
  reportCreationDate,
}: PrintDocumentViewProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const meta = BERAKHLAK_CATEGORIES.find((c) => c.id === category)!;
  const filtered = activities.filter((a) => a.categories.includes(category));

  const effectiveSigningDate = reportCreationDate || profile.signingDate || '30 September 2026';

  useEffect(() => {
    const text = `DOKUMEN RESMI PENGAWAS SMA\nNama: ${profile.name}\nNIP: ${profile.nip}\nUnsur: ${meta.name}\nPeriode: ${periodMonth}\nCabdin: ${profile.institutionBranch}\nTanggal: ${profile.city}, ${effectiveSigningDate}`;
    QRCode.toDataURL(text, { width: 140, margin: 1 }).then(setQrUrl);
  }, [profile, meta, periodMonth, effectiveSigningDate]);

  return (
    <div className="hidden print:block text-black bg-white font-serif">
      {/* ================= HALAMAN 1: COVER ================= */}
      <div
        className="w-full flex flex-col justify-between items-center text-center p-8 page-break-after"
        style={{ minHeight: '195mm' }}
      >
        <div className="space-y-1 pt-4">
          <h1 className="text-xl font-bold tracking-wide">LAPORAN HASIL KEGIATAN</h1>
          <h2 className="text-xl font-bold tracking-wide">
            UNSUR VALUE {meta.name.toUpperCase()}
          </h2>
        </div>

        <div className="my-6">
          <LogoJatim className="w-28 h-36 mx-auto" />
        </div>

        <div className="space-y-1">
          <div className="text-lg font-bold underline underline-offset-4">{profile.name}</div>
          <div className="text-base font-bold">{profile.role}</div>
        </div>

        {/* Bulan di Cover */}
        <div className="my-4">
          <div className="text-2xl font-extrabold tracking-wider">{periodMonth}</div>
        </div>

        <div className="space-y-0.5 pb-2 text-xs">
          <div className="font-bold">{profile.institutionGov}</div>
          <div className="font-bold">{profile.institutionDept}</div>
          <div className="font-bold">{profile.institutionBranch}</div>
          <div>{profile.institutionAddress}</div>
          <div>{profile.institutionPostal}</div>
        </div>
      </div>

      {/* ================= HALAMAN 2+: TABEL KEGIATAN ================= */}
      <div className="w-full p-2" style={{ minHeight: '195mm' }}>
        <div className="text-center mb-2">
          <h2 className="text-base font-bold">LAPORAN HASIL KEGIATAN</h2>
          <h3 className="text-base font-bold underline underline-offset-2">
            UNSUR VALUE {meta.name.toUpperCase()}
          </h3>
        </div>

        <div className="text-xs mb-3 text-justify">
          <span className="font-bold">DESKRIPSI SELF ASESMEN : </span>
          <span className="italic">
            {profile.selfAssessments[category] || meta.defaultSelfAssessment}
          </span>
        </div>

        <table className="w-full border-collapse border border-black text-[11px] mb-4">
          <thead>
            <tr className="bg-[#F8D7DA] text-black font-bold text-center border-b border-black">
              <th className="border border-black p-1.5 w-8">NO</th>
              <th className="border border-black p-1.5 w-28">
                HARI/TANGGAL<br />KEGIATAN
              </th>
              <th className="border border-black p-1.5 w-44">
                NAMA/BENTUK<br />KEGIATAN
              </th>
              <th className="border border-black p-1.5 w-36">
                TEMPAT/PLATFORM<br />KEGIATAN
              </th>
              <th className="border border-black p-1.5 w-36">
                SASARAN/ PIHAK<br />TERLIBAT
              </th>
              <th className="border border-black p-1.5">HASIL</th>
              <th className="border border-black p-1.5 w-36">K E T</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((act, idx) => (
              <tr key={act.id} className="border-b border-black align-top">
                <td className="border border-black p-1.5 text-center font-medium">{idx + 1}</td>
                <td className="border border-black p-1.5">{act.dateFormatted || act.date}</td>
                <td className="border border-black p-1.5">{act.name}</td>
                <td className="border border-black p-1.5">{act.location}</td>
                <td className="border border-black p-1.5 whitespace-pre-line">{act.participants}</td>
                <td className="border border-black p-1.5 text-justify">{act.results}</td>
                <td className="border border-black p-1.5 text-center">
                  {act.photoUrl ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={act.photoUrl}
                        alt="Dokumentasi"
                        className="w-28 h-20 object-cover border border-slate-400"
                      />
                    </div>
                  ) : (
                    <span className="italic text-[10px] text-slate-500">Terlampir</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tanda Tangan: Tanggal Pembuatan Laporan sebelum TTD */}
        <div className="pt-2">
          <div className="flex justify-end">
            <div className="text-right space-y-0.5 w-60">
              <div className="text-xs font-semibold">
                {profile.city}, {effectiveSigningDate}
              </div>
              <div className="text-xs">{profile.signingTitle}</div>
              <div className="flex justify-end py-1">
                {qrUrl && <img src={qrUrl} alt="QR" className="w-14 h-14" />}
              </div>
              <div className="text-xs font-bold underline">{profile.name}</div>
              <div className="text-xs">NIP. {profile.nip}</div>
            </div>
          </div>

          <div className="text-left text-xs pt-3 mt-2 border-t border-slate-300">
            <div className="font-bold">
              Bukti Dukung Pelaksanaan Kegiatan Tersedia di Folder Dokumentasi Unsur {meta.name}:
            </div>
            <div className="text-blue-700 underline text-[11px]">
              {profile.driveFolders[category] || 'https://drive.google.com/'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
