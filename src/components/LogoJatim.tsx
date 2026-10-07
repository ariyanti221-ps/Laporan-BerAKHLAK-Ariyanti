import { LOGO_JATIM_BASE64 } from '../assets/logoJatimBase64';

export function LogoJatim({ className = 'w-24 h-32' }: { className?: string }) {
  return (
    <img
      src={LOGO_JATIM_BASE64}
      alt="Lambang Resmi Pemerintah Provinsi Jawa Timur - Jer Basuki Mawa Beya"
      className={`${className} object-contain`}
      referrerPolicy="no-referrer"
    />
  );
}

/**
 * Mengembalikan data URL gambar logo Jawa Timur untuk disematkan pada dokumen Word .docx
 */
export async function getLogoJatimPngDataUrl(): Promise<string> {
  return LOGO_JATIM_BASE64;
}
