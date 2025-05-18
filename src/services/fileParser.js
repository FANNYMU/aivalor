import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { read, utils } from 'xlsx';

// Konfigurasi worker untuk PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/**
 * Mengekstrak teks dari file PDF
 * @param {File} file - File PDF
 * @returns {Promise<string>} - Teks yang diekstrak
 */
export async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(' ');
      text += pageText + '\n';
    }

    return text;
  } catch (error) {
    console.error('Error saat mengekstrak teks dari PDF:', error);
    throw new Error('Gagal mengekstrak teks dari file PDF.');
  }
}

/**
 * Mengekstrak teks dari file DOCX
 * @param {File} file - File DOCX
 * @returns {Promise<string>} - Teks yang diekstrak
 */
export async function extractTextFromDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error saat mengekstrak teks dari DOCX:', error);
    throw new Error('Gagal mengekstrak teks dari file DOCX.');
  }
}

/**
 * Mengekstrak teks dari file TXT
 * @param {File} file - File TXT
 * @returns {Promise<string>} - Teks yang diekstrak
 */
export async function extractTextFromTxt(file) {
  try {
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Error saat mengekstrak teks dari TXT:', error);
    throw new Error('Gagal mengekstrak teks dari file TXT.');
  }
}

/**
 * Mengekstrak teks dari file Excel (XLS/XLSX)
 * @param {File} file - File Excel
 * @returns {Promise<string>} - Teks yang diekstrak
 */
export async function extractTextFromExcel(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer);
    
    let text = '';
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      text += `Sheet: ${sheetName}\n`;
      text += utils.sheet_to_csv(worksheet) + '\n\n';
    });
    
    return text;
  } catch (error) {
    console.error('Error saat mengekstrak teks dari Excel:', error);
    throw new Error('Gagal mengekstrak teks dari file Excel.');
  }
}

/**
 * Mengekstrak teks dari file berdasarkan ekstensi
 * @param {File} file - File yang akan diekstrak
 * @returns {Promise<string>} - Teks yang diekstrak
 */
export async function extractTextFromFile(file) {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.pdf')) {
    return await extractTextFromPdf(file);
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return await extractTextFromDocx(file);
  } else if (fileName.endsWith('.txt')) {
    return await extractTextFromTxt(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return await extractTextFromExcel(file);
  } else {
    throw new Error('Format file tidak didukung.');
  }
} 