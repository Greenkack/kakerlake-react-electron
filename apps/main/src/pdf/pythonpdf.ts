import { spawn } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';

export interface PdfOptions {
  extendedPages?: boolean;
  categories?: string[];
}

export async function generateOfferPdf(payload: any, opts: PdfOptions): Promise<string> {
  const venv = process.env.KAKERLAKE_PYTHON ?? 'python';
  const script = path.join(process.cwd(), 'python', 'offer_cli.py');
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'kaker-pdf-'));
  const inJson = path.join(tmp, 'payload.json');
  const outPdf = path.join(tmp, 'offer.pdf');

  await fs.writeFile(inJson, JSON.stringify({ payload, opts }, null, 2), 'utf8');

  await new Promise<void>((resolve, reject) => {
    const p = spawn(venv, [script, '--in', inJson, '--out', outPdf], { stdio: 'inherit' });
    p.on('error', reject);
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error('pdf exit '+code)));
  });

  return outPdf;
}
