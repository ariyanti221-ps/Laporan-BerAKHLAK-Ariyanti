import JSZip from 'jszip';
import { ActivityItem, BERAKHLAK_CATEGORIES, SupervisorProfile } from '../types';
import { generateBerakhlakDocx } from './docxExport';

export async function generateAllReportsZip(
  activities: ActivityItem[],
  profile: SupervisorProfile,
  periodMonth: string,
  reportCreationDate: string,
  onProgress?: (current: number, total: number, name: string) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folderName = `Laporan_BerAKHLAK_${periodMonth.replace(/\s+/g, '_')}_${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const folder = zip.folder(folderName) || zip;

  for (let i = 0; i < BERAKHLAK_CATEGORIES.length; i++) {
    const cat = BERAKHLAK_CATEGORIES[i];
    if (onProgress) {
      onProgress(i + 1, BERAKHLAK_CATEGORIES.length, cat.name);
    }
    const docBlob = await generateBerakhlakDocx(
      cat.id,
      activities,
      profile,
      periodMonth,
      reportCreationDate
    );
    const fileName = `0${cat.order}_Laporan_${cat.name.replace(/\s+/g, '_')}_${periodMonth.replace(/\s+/g, '_')}.docx`;
    folder.file(fileName, docBlob);
  }

  return await zip.generateAsync({ type: 'blob' });
}
