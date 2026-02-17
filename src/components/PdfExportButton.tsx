/**
 * PDF 저장 버튼
 */

import { useState } from 'react';
import { Download } from 'lucide-react';
import { exportToPdf, generatePdfFilename } from '../utils/pdf-export';

interface Props {
  elementId: string;
  filename?: string;
}

export default function PdfExportButton({ elementId, filename }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      await exportToPdf(elementId, filename ?? generatePdfFilename());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF 생성 실패');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                   border border-white/10 text-gray-400 hover:text-white hover:border-white/20
                   disabled:cursor-not-allowed disabled:opacity-50
                   transition-all duration-200"
      >
        <Download size={14} />
        {isExporting ? 'PDF 생성 중...' : 'PDF 저장'}
      </button>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
