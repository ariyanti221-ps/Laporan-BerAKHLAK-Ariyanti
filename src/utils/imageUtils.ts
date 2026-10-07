/**
 * Mengompresi berkas gambar agar ukuran penyimpanan efisien dan dokumen Word tidak membengkak
 */
export async function compressImage(file: File, maxWidth = 900, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Konversi DataURL (base64) ke Uint8Array untuk disematkan pada dokumen docx
 */
export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const parts = dataUrl.split(',');
  const base64 = parts[1] || parts[0];
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Membuat data URL untuk placeholder dokumentasi kegiatan dengan teks label
 */
export function createActivityPlaceholderSvg(title: string, date: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
    <rect width="320" height="200" fill="#1e293b"/>
    <rect x="4" y="4" width="312" height="192" fill="#0f172a" rx="4"/>
    <circle cx="160" cy="75" r="30" fill="#334155"/>
    <path d="M145 75a15 15 0 0 1 30 0v5h-30z" fill="#94a3b8"/>
    <circle cx="160" cy="65" r="8" fill="#94a3b8"/>
    <text x="160" y="130" font-family="sans-serif" font-size="12" fill="#e2e8f0" font-weight="bold" text-anchor="middle">${escapeXml(title.slice(0, 32))}</text>
    <text x="160" y="150" font-family="sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle">${escapeXml(date)}</text>
    <text x="160" y="175" font-family="sans-serif" font-size="9" fill="#38bdf8" text-anchor="middle">Dokumentasi Kedinasan Terverifikasi</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}
