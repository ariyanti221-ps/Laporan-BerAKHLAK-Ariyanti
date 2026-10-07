const HARI_INDONESIA = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

const BULAN_INDONESIA = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Format string tanggal YYYY-MM-DD menjadi "Rabu, 2 September 2026"
 */
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) {
      const namaHari = HARI_INDONESIA[d.getDay()];
      const namaBulan = BULAN_INDONESIA[month];
      return `${namaHari}, ${day} ${namaBulan} ${year}`;
    }
  }
  return dateStr;
}

/**
 * Mendapatkan nama bulan dan tahun kapital, misal "SEPTEMBER 2026"
 */
export function formatPeriodMonth(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  const namaBulan = BULAN_INDONESIA[d.getMonth()].toUpperCase();
  return `${namaBulan} ${d.getFullYear()}`;
}

/**
 * Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
