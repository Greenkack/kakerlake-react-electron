// apps/main/src/ipc/PdfHandlers.ts
// IPC handlers for PDF generation - mirrors pdf_generator.py:generate_offer_pdf

import { ipcMain } from 'electron';
import { PythonPdfService } from '../services/PythonPdfService';

export function registerPdfHandlers() {
  const pdfService = new PythonPdfService();

  // PDF Generation - mirrors pdf_generator.py:generate_offer_pdf with pdf_ui.py options
  ipcMain.handle('pdf:generate_offer', async (event, projectData, analysisResults, options) => {
    return await pdfService.generateOfferPdf(projectData, analysisResults, options);
  });
}
