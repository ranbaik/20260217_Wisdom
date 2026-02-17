/**
 * PDF 생성 유틸리티
 */

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * HTML 요소를 PDF로 변환하여 다운로드
 */
export async function exportToPdf(
  elementId: string,
  filename: string = 'saju-analysis.pdf'
): Promise<void> {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    // HTML을 캔버스로 변환
    const canvas = await html2canvas(element, {
      scale: 2, // 고해상도
      useCORS: true,
      logging: false,
      backgroundColor: '#0a0a0a',
    });

    // 캔버스를 이미지로 변환
    const imgData = canvas.toDataURL('image/png');

    // PDF 생성
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // 첫 페이지 추가
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    // 내용이 한 페이지를 넘으면 페이지 추가
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // PDF 다운로드
    pdf.save(filename);
  } catch (error) {
    throw new Error('PDF 생성 중 오류가 발생했습니다.');
  }
}

/**
 * 파일명 생성 (날짜 포함)
 */
export function generatePdfFilename(name: string = '사주분석'): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  return `${name}_${date}.pdf`;
}
