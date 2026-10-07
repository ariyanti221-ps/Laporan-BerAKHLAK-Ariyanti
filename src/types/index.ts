export type BerakhlakCategory =
  | 'berorientasi_pelayanan'
  | 'akuntabel'
  | 'kompeten'
  | 'harmonis'
  | 'loyal'
  | 'adaptif'
  | 'kolaboratif';

export interface CategoryMeta {
  id: BerakhlakCategory;
  name: string;
  shortName: string;
  order: number;
  reportTitle: string; // e.g. "LAPORAN HASIL KEGIATAN\nUNSUR VALUE BERORIENTASI LAYANAN"
  color: string;
  lightBg: string;
  tagColor: string;
  defaultSelfAssessment: string;
}

export const BERAKHLAK_CATEGORIES: CategoryMeta[] = [
  {
    id: 'berorientasi_pelayanan',
    name: 'Berorientasi Layanan',
    shortName: 'Berorientasi Layanan',
    order: 1,
    reportTitle: 'LAPORAN HASIL KEGIATAN\nUNSUR VALUE BERORIENTASI LAYANAN',
    color: '#0284C7',
    lightBg: '#E0F2FE',
    tagColor: 'text-sky-700 bg-sky-50 border-sky-200',
    defaultSelfAssessment:
      'Saya berkomitmen memberikan pelayanan prima demi kepuasan pemangku kepentingan pendidikan, mendampingi kepala sekolah dan guru binaan dengan ramah, cekatan, solutif, serta terus melakukan perbaikan tiada henti.',
  },
  {
    id: 'akuntabel',
    name: 'Akuntabel',
    shortName: 'Akuntabel',
    order: 2,
    reportTitle: 'LAPORAN HASIL KEGIATAN\nUNSUR VALUE AKUNTABEL',
    color: '#059669',
    lightBg: '#D1FAE5',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    defaultSelfAssessment:
      'Saya melaksanakan tugas pengawasan dengan penuh integritas, jujur, bertanggung jawab, cermat, disiplin, berintegritas tinggi, serta menggunakan sarana dan waktu kedinasan secara efektif dan efisien.',
  },
  {
    id: 'kompeten',
    name: 'Kompeten',
    shortName: 'Kompeten',
    order: 3,
    reportTitle: 'LAPORAN HASIL KEGIATAN\nUNSUR VALUE KOMPETEN',
    color: '#4F46E5',
    lightBg: '#EEF2FF',
    tagColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    defaultSelfAssessment:
      'Saya terus belajar dan mengembangkan kapabilitas diri, memfasilitasi peningkatan kompetensi guru dan kepala sekolah binaan, serta melaksanakan tugas kepengawasan dengan standar kualitas terbaik.',
  },
  {
    id: 'harmonis',
    name: 'Harmonis',
    shortName: 'Harmonis',
    order: 4,
    reportTitle: 'LAPORAN HASIL KEGIATAN\nUNSUR VALUE HARMONIS',
    color: '#D97706',
    lightBg: '#FEF3C7',
    tagColor: 'text-amber-700 bg-amber-50 border-amber-200',
    defaultSelfAssessment:
      'Saya senantiasa membangun lingkungan kerja dan pembinaan yang kondusif, menghargai setiap insan pendidikan apapun latar belakangnya, serta suka menolong rekan sejawat dan warga sekolah binaan.',
  },
  {
    id: 'loyal',
    name: 'Loyal',
    shortName: 'Loyal',
    order: 5,
    reportTitle: 'LAPORAN HASIL KEGIATAN\nUNSUR VALUE LOYAL',
    color: '#DC2626',
    lightBg: '#FEE2E2',
    tagColor: 'text-rose-700 bg-rose-50 border-rose-200',
    defaultSelfAssessment:
      'Saya memegang teguh ideologi Pancasila, UUD 1945, setia kepada NKRI dan Pemerintah yang sah, menjaga nama baik Korps ASN pengawas sekolah, serta menjaga kerahasiaan jabatan dan kedinasan.',
  },
  {
    id: 'adaptif',
    name: 'Adaptif',
    shortName: 'Adaptif',
    order: 6,
    reportTitle: 'LAPORAN HASIL KEGIATAN\nUNSUR VALUE ADAPTIF',
    color: '#7C3AED',
    lightBg: '#EDE9FE',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
    defaultSelfAssessment:
      'Saya cepat menyesuaikan diri menghadapi perubahan, terus berinovasi dan antusias dalam menggerakkan ataupun memanfaatkan transformasi digital pembelajaran dan regulasi pendidikan terbaru.',
  },
  {
    id: 'kolaboratif',
    name: 'Kolaboratif',
    shortName: 'Kolaboratif',
    order: 7,
    reportTitle: 'LAPORAN HASIL KEGIATAN\nUNSUR VALUE KOLABORATIF',
    color: '#0D9488',
    lightBg: '#CCFBF1',
    tagColor: 'text-teal-700 bg-teal-50 border-teal-200',
    defaultSelfAssessment:
      'Saya responsif terhadap informasi dari pimpinan dan Korwas/MKPS, responsif dengan sekolah binaan/dampingan, selalu menjaga sinergitas dan kerjasama dengan rekan sejawat, Korwas, MKPS dan Sekolah Binaan/Dampingan.',
  },
];

export interface ActivityItem {
  id: string;
  date: string; // YYYY-MM-DD
  dateFormatted: string; // e.g. "Rabu, 2 September 2026"
  name: string; // NAMA/BENTUK KEGIATAN
  location: string; // TEMPAT/PLATFORM KEGIATAN
  participants: string; // SASARAN/ PIHAK TERLIBAT
  results: string; // HASIL
  photoUrl?: string; // Base64 or local image URL
  photoCaption?: string;
  driveUrl?: string; // Link unggahan berkas bukti pendukung
  categories: BerakhlakCategory[]; // Multi-selected categories
  createdAt: string;
}

export interface SupervisorProfile {
  name: string;
  nip: string;
  role: string;
  signingTitle: string;
  city: string;
  signingDate: string; // e.g. "30 September 2026" (Tanggal pembuatan laporan sebelum TTD)
  periodMonth: string; // e.g. "SEPTEMBER 2026" (Bulan di Cover, diletakkan di profil)
  institutionGov: string;
  institutionDept: string;
  institutionBranch: string;
  institutionAddress: string;
  institutionPostal: string;
  institutionEmail: string;
  institutionPhone: string;
  driveFolders: Record<BerakhlakCategory, string>;
  selfAssessments: Record<BerakhlakCategory, string>;
  signatureDataUrl?: string;
  customLogoUrl?: string;
}
