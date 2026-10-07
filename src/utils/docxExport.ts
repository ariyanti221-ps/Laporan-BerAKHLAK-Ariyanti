import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  ImageRun,
  PageBreak,
  HeightRule,
  VerticalAlign,
  ShadingType,
} from 'docx';
import QRCode from 'qrcode';
import { ActivityItem, BerakhlakCategory, BERAKHLAK_CATEGORIES, SupervisorProfile } from '../types';
import { dataUrlToUint8Array } from './imageUtils';
import { getLogoJatimPngDataUrl } from '../components/LogoJatim';

// Dimensi F4 Landscape (Folio 215 mm x 330 mm)
// 1 inci = 1440 dxa. 330 mm ≈ 18708 dxa. 215 mm ≈ 12189 dxa.
const F4_LANDSCAPE_WIDTH = 18708;
const F4_LANDSCAPE_HEIGHT = 12189;
const MARGIN_1CM = 567; // 10 mm ≈ 567 dxa

// Lebar kolom tabel (Total printable area = 18708 - 2 * 567 = 17574 dxa)
const COL_WIDTHS = [
  650,  // NO
  2300, // HARI/TANGGAL KEGIATAN
  3200, // NAMA/BENTUK KEGIATAN
  2500, // TEMPAT/PLATFORM KEGIATAN
  2500, // SASARAN/ PIHAK TERLIBAT
  3400, // HASIL
  3024, // K E T (Dokumentasi)
];

const TABLE_BORDER_STYLE = {
  style: BorderStyle.SINGLE,
  size: 4,
  color: '000000',
};

const CELL_BORDERS = {
  top: TABLE_BORDER_STYLE,
  bottom: TABLE_BORDER_STYLE,
  left: TABLE_BORDER_STYLE,
  right: TABLE_BORDER_STYLE,
};

/**
 * Membuat satu file DOCX untuk satu unsur BerAKHLAK
 * @param periodMonth Bulan di Cover (misal "SEPTEMBER 2026")
 * @param reportCreationDate Tanggal Pembuatan Laporan sebelum TTD (misal "30 September 2026")
 */
export async function generateBerakhlakDocx(
  category: BerakhlakCategory,
  activities: ActivityItem[],
  profile: SupervisorProfile,
  periodMonth?: string,
  reportCreationDate?: string
): Promise<Blob> {
  const meta = BERAKHLAK_CATEGORIES.find((c) => c.id === category)!;
  const filteredActivities = activities.filter((act) => act.categories.includes(category));

  const effectivePeriod = periodMonth || profile.periodMonth || 'SEPTEMBER 2026';
  const effectiveSigningDate = reportCreationDate || profile.signingDate || '30 September 2026';

  // Ambil gambar logo Jatim
  const logoDataUrl = await getLogoJatimPngDataUrl();
  const logoBytes = dataUrlToUint8Array(logoDataUrl);

  // Buat QR Code untuk validasi dokumen
  const qrVerificationText = `DOKUMEN RESMI PENGAWAS SMA\nNama: ${profile.name}\nNIP: ${profile.nip}\nUnsur: ${meta.name}\nPeriode: ${effectivePeriod}\nCabdin: ${profile.institutionBranch}\nTanggal: ${profile.city}, ${effectiveSigningDate}`;
  const qrDataUrl = await QRCode.toDataURL(qrVerificationText, {
    width: 140,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  });
  const qrBytes = dataUrlToUint8Array(qrDataUrl);

  // === 1. HALAMAN SAMPUL / COVER ===
  const coverElements = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({
          text: 'LAPORAN HASIL KEGIATAN',
          bold: true,
          size: 28, // 14pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 360 },
      children: [
        new TextRun({
          text: `UNSUR VALUE ${meta.name.toUpperCase()}`,
          bold: true,
          size: 28, // 14pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 280 },
      children: [
        new ImageRun({
          data: logoBytes,
          transformation: {
            width: 120,
            height: 156,
          },
          type: 'png',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 180, after: 60 },
      children: [
        new TextRun({
          text: profile.name,
          bold: true,
          size: 32, // 16pt
          font: 'Times New Roman',
          underline: { type: 'single' },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 40, after: 360 },
      children: [
        new TextRun({
          text: profile.role,
          bold: true,
          size: 26, // 13pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 160, after: 300 },
      children: [
        new TextRun({
          text: effectivePeriod,
          bold: true,
          size: 36, // 18pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: profile.institutionGov,
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 20, after: 40 },
      children: [
        new TextRun({
          text: profile.institutionDept,
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 20, after: 60 },
      children: [
        new TextRun({
          text: profile.institutionBranch,
          bold: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 20, after: 40 },
      children: [
        new TextRun({
          text: profile.institutionAddress,
          size: 18,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 20, after: 100 },
      children: [
        new TextRun({
          text: profile.institutionPostal,
          size: 18,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];

  // === 2. HALAMAN TABEL KEGIATAN & ASESMEN ===
  const contentElements = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 40 },
      children: [
        new TextRun({
          text: 'LAPORAN HASIL KEGIATAN',
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 140 },
      children: [
        new TextRun({
          text: `UNSUR VALUE ${meta.name.toUpperCase()}`,
          bold: true,
          size: 24, // 12pt
          font: 'Times New Roman',
          underline: { type: 'single' },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 60, after: 160 },
      children: [
        new TextRun({
          text: 'DESKRIPSI SELF ASESMEN : ',
          bold: true,
          size: 20, // 10pt
          font: 'Times New Roman',
        }),
        new TextRun({
          text: profile.selfAssessments[category] || meta.defaultSelfAssessment,
          italics: true,
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    }),
  ];

  // Header Baris Tabel
  const headerRow = new TableRow({
    tableHeader: true,
    cantSplit: true,
    height: { value: 420, rule: HeightRule.ATLEAST },
    children: [
      createHeaderCell('NO', COL_WIDTHS[0]),
      createHeaderCell('HARI/TANGGAL\nKEGIATAN', COL_WIDTHS[1]),
      createHeaderCell('NAMA/BENTUK\nKEGIATAN', COL_WIDTHS[2]),
      createHeaderCell('TEMPAT/PLATFORM\nKEGIATAN', COL_WIDTHS[3]),
      createHeaderCell('SASARAN/ PIHAK\nTERLIBAT', COL_WIDTHS[4]),
      createHeaderCell('HASIL', COL_WIDTHS[5]),
      createHeaderCell('K E T', COL_WIDTHS[6]),
    ],
  });

  // Baris-baris Data Kegiatan
  const dataRows: TableRow[] = [];

  for (let idx = 0; idx < filteredActivities.length; idx++) {
    const act = filteredActivities[idx];
    const rowNum = idx + 1;

    // Persiapkan sel foto dokumentasi
    const photoChildren: (Paragraph | ImageRun)[] = [];
    if (act.photoUrl && act.photoUrl.startsWith('data:image/')) {
      try {
        const photoBytes = dataUrlToUint8Array(act.photoUrl);
        photoChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                data: photoBytes,
                transformation: {
                  width: 140,
                  height: 95,
                },
                type: 'png',
              }),
            ],
          })
        );
      } catch (e) {
        photoChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Dokumentasi Terlampir',
                size: 16,
                font: 'Times New Roman',
              }),
            ],
          })
        );
      }
    } else {
      photoChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'Dokumentasi Terlampir',
              size: 16,
              font: 'Times New Roman',
              italics: true,
            }),
          ],
        })
      );
    }

    // Foto dokumentasi pada sel KET (link drive bulanan berada di bawah tanda tangan)

    // Format pihak terlibat (bullet points)
    const participantParas = act.participants
      .split('\n')
      .filter((p) => p.trim())
      .map((p) => {
        const clean = p.startsWith('•') || p.startsWith('-') ? p : `• ${p}`;
        return new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 20, after: 20 },
          children: [
            new TextRun({
              text: clean,
              size: 18,
              font: 'Times New Roman',
            }),
          ],
        });
      });

    dataRows.push(
      new TableRow({
        cantSplit: true,
        children: [
          // Kolom 1: No
          new TableCell({
            width: { size: COL_WIDTHS[0], type: WidthType.DXA },
            borders: CELL_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: String(rowNum),
                    size: 18,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          // Kolom 2: Hari / Tanggal
          new TableCell({
            width: { size: COL_WIDTHS[1], type: WidthType.DXA },
            borders: CELL_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: act.dateFormatted || act.date,
                    size: 18,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          // Kolom 3: Nama / Bentuk Kegiatan
          new TableCell({
            width: { size: COL_WIDTHS[2], type: WidthType.DXA },
            borders: CELL_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: act.name,
                    size: 18,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          // Kolom 4: Tempat / Platform
          new TableCell({
            width: { size: COL_WIDTHS[3], type: WidthType.DXA },
            borders: CELL_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: act.location,
                    size: 18,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          // Kolom 5: Sasaran / Pihak Terlibat
          new TableCell({
            width: { size: COL_WIDTHS[4], type: WidthType.DXA },
            borders: CELL_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: participantParas.length > 0 ? participantParas : [
              new Paragraph({
                children: [new TextRun({ text: act.participants, size: 18, font: 'Times New Roman' })],
              }),
            ],
          }),
          // Kolom 6: Hasil
          new TableCell({
            width: { size: COL_WIDTHS[5], type: WidthType.DXA },
            borders: CELL_BORDERS,
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: act.results,
                    size: 18,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
          // Kolom 7: K E T (Dokumentasi)
          new TableCell({
            width: { size: COL_WIDTHS[6], type: WidthType.DXA },
            borders: CELL_BORDERS,
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            children: photoChildren as Paragraph[],
          }),
        ],
      })
    );
  }

  // Jika belum ada kegiatan pada kategori ini
  if (filteredActivities.length === 0) {
    dataRows.push(
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 7,
            borders: CELL_BORDERS,
            margins: { top: 120, bottom: 120, left: 80, right: 80 },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Belum ada data kegiatan untuk unsur ini pada periode berjalan.',
                    italics: true,
                    size: 18,
                    font: 'Times New Roman',
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });

  // === 3. TANDA TANGAN & FOOTER BUKTI DUKUNG ===
  // Input tanggal pembuatan laporan sebelum ttd: `${profile.city}, ${effectiveSigningDate}`
  const footerElements = [
    new Paragraph({ spacing: { before: 160 } }),
    // Blok Tanda Tangan Kanan: Tanggal pembuatan laporan sebelum TTD
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 80, after: 20 },
      children: [
        new TextRun({
          text: `${profile.city}, ${effectiveSigningDate}`,
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 20, after: 60 },
      children: [
        new TextRun({
          text: profile.signingTitle,
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    }),
    // QR Code Verifikasi
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 40, after: 60 },
      children: [
        new ImageRun({
          data: qrBytes,
          transformation: {
            width: 70,
            height: 70,
          },
          type: 'png',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 20, after: 20 },
      children: [
        new TextRun({
          text: profile.name,
          bold: true,
          size: 22,
          font: 'Times New Roman',
          underline: { type: 'single' },
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({
          text: `NIP. ${profile.nip}`,
          size: 20,
          font: 'Times New Roman',
        }),
      ],
    }),
    // Catatan Folder Google Drive di Kiri Bawah
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({
          text: `Bukti Dukung Pelaksanaan Kegiatan Tersedia di Folder Dokumentasi Unsur ${meta.name}:`,
          bold: true,
          size: 18,
          font: 'Times New Roman',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: profile.driveFolders[category] || 'https://drive.google.com/',
          size: 18,
          font: 'Times New Roman',
          color: '0066CC',
          underline: { type: 'single' },
        }),
      ],
    }),
  ];

  // Rakit Dokumen Penuh dengan Orientasi F4 Landscape dan Margin 1 cm
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: F4_LANDSCAPE_WIDTH,
              height: F4_LANDSCAPE_HEIGHT,
              orientation: 'landscape',
            },
            margin: {
              top: MARGIN_1CM,
              bottom: MARGIN_1CM,
              left: MARGIN_1CM,
              right: MARGIN_1CM,
            },
          },
        },
        children: [...coverElements, ...contentElements, table, ...footerElements],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function createHeaderCell(text: string, widthDxa: number): TableCell {
  const lines = text.split('\n');
  const paras = lines.map(
    (line) =>
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 20, after: 20 },
        children: [
          new TextRun({
            text: line,
            bold: true,
            size: 18, // 9pt
            font: 'Times New Roman',
            color: '000000',
          }),
        ],
      })
  );

  return new TableCell({
    width: { size: widthDxa, type: WidthType.DXA },
    borders: CELL_BORDERS,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 40, right: 40 },
    shading: {
      type: ShadingType.CLEAR,
      fill: 'F8D7DA', // Soft Pink khas Cabdin Jatim
    },
    children: paras,
  });
}
