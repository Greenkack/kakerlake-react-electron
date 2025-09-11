// apps/main/src/services/PythonPdfService.ts
// Bridge to Python PDF generation pipeline - mirrors pdf_generator.py:generate_offer_pdf

import { spawn, spawnSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { ProjectData, AnalysisResults, PDFGenerationOptions } from '../../../../packages/core/src/types/db';

export class PythonPdfService {
  private pythonExecutable: string;

  constructor() {
    // Detect Python executable (mirrors main.ts detection logic)
    this.pythonExecutable = this.detectPython();
  }

  private detectPython(): string {
    const candidates = [
      'python',
      'python3', 
      'py',
      'python.exe',
      'python3.exe'
    ];

    for (const candidate of candidates) {
      try {
        const result = spawnSync(candidate, ['--version'], { encoding: 'utf-8', timeout: 5000 });
        if (result.status === 0 && result.stdout.includes('Python')) {
          console.log(`PDF Service: Using Python executable: ${candidate}`);
          return candidate;
        }
      } catch (error) {
        continue;
      }
    }

    console.warn('PDF Service: No Python executable found, using "python" as fallback');
    return 'python';
  }

  // Mirrors pdf_generator.py:generate_offer_pdf
  async generateOfferPdf(
    projectData: ProjectData,
    analysisResults: AnalysisResults,
    options: PDFGenerationOptions = {}
  ): Promise<{ success: boolean; filePath?: string; error?: string }> {
    try {
      // Prepare payload for new PDF generation bridge
      const pdfType = options.extended_pages ? 'pv' : (options.wp_additional_pages ? 'heatpump' : 'pv');
      
      const payload = {
        project_data: projectData,
        calculation_results: analysisResults,
        company_info: options.company_info || {},
        output_file: `${pdfType}_angebot_${Date.now()}.pdf`,
        pdf_type: pdfType,
        page_count: options.wp_additional_pages ? 16 : 7,
        companies: options.companies || []
      };

      // Write payload to temp file
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const payloadFile = path.join(tempDir, `pdf_request_${Date.now()}.json`);
      fs.writeFileSync(payloadFile, JSON.stringify(payload, null, 2), 'utf-8');

      // Determine command and call Python CLI
      let command = 'generate_pv_pdf';
      if (pdfType === 'heatpump') {
        command = 'generate_heatpump_pdf';
      } else if (pdfType === 'multi') {
        command = 'generate_multi_pdfs';
      }
      
      const pythonScript = path.join(__dirname, 'pdf_generation_bridge.py');
      
      return new Promise((resolve) => {
        const pythonProcess = spawn(this.pythonExecutable, [pythonScript, command, payloadFile], {
          cwd: process.cwd(),
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
          // Cleanup temp file
          try {
            fs.unlinkSync(payloadFile);
          } catch (e) {
            console.warn('Could not clean up temp file:', payloadFile);
          }

          if (code === 0) {
            try {
              const result = JSON.parse(stdout);
              resolve({
                success: true,
                filePath: result.output_path,
                error: undefined
              });
            } catch (parseError) {
              const parseMessage = parseError instanceof Error ? parseError.message : String(parseError);
              resolve({
                success: false,
                error: `Failed to parse Python response: ${parseMessage}\nStdout: ${stdout}\nStderr: ${stderr}`
              });
            }
          } else {
            resolve({
              success: false,
              error: `Python process exited with code ${code}\nStderr: ${stderr}\nStdout: ${stdout}`
            });
          }
        });

        pythonProcess.on('error', (error) => {
          resolve({
            success: false,
            error: `Failed to start Python process: ${error.message}`
          });
        });

        // Set timeout
        setTimeout(() => {
          pythonProcess.kill();
          resolve({
            success: false,
            error: 'PDF generation timed out after 60 seconds'
          });
        }, 60000);
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `PDF generation error: ${message}`
      };
    }
  }
}
