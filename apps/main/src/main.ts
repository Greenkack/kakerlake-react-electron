import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { spawn } from 'child_process';
import * as path from 'path';
import { runMigrations } from './db/bootstrap';
import { getDb } from './db/connection';
import { registerCrmHandlers } from './ipc/CrmHandlers';
import { registerProductHandlers } from './ipc/ProductHandlers';
import { registerPdfHandlers } from './ipc/PdfHandlers';

// Global Node.js variables declaration for TypeScript
declare const __dirname: string;
declare const process: NodeJS.Process;

function runPy(...args: string[]): Promise<string> {
	const script = path.resolve(process.cwd(), '..', '..', 'solar_calculator_bridge.py');
	const isWin = process.platform === 'win32';
	const candidates: Array<[string, string[]]> = isWin
		? [['python', []], ['py', ['-3']]]
		: [['python3', []], ['python', []]];
	const tryOne = ([cmd, head]: [string, string[]]) => new Promise<string>((resolve, reject) => {
		let out = '';
		let err = '';
		const child = spawn(cmd, [...head, script, ...args], { windowsHide: true });
		child.stdout.on('data', (d) => { out += d.toString(); });
		child.stderr.on('data', (d) => { err += d.toString(); });
		child.on('error', (e: any) => reject(e));
		child.on('close', (code) => {
			if (code !== 0 && err) return reject(new Error(err.trim()));
			resolve(out.trim());
		});
	});
	return candidates.reduce((p, cand) => p.catch((e) => {
		// Only fall back on ENOENT (command not found) or general spawn errors
		return tryOne(cand);
	}), Promise.reject(new Error('init')) as Promise<string>).catch(async () => {
		// start chain
		let lastErr: any = null;
		for (const cand of candidates) {
			try {
				return await tryOne(cand);
			} catch (e) {
				lastErr = e;
			}
		}
		throw lastErr || new Error('Python not found');
	});
}

async function detectPython(): Promise<{ found: boolean; command?: string; version?: string; error?: string }> {
	const isWin = process.platform === 'win32';
	const candidates: Array<[string, string[]]> = isWin
		? [['python', ['-V']], ['py', ['-3', '-V']]]
		: [['python3', ['-V']], ['python', ['-V']]];
	for (const [cmd, args] of candidates) {
		try {
			const out = await new Promise<string>((resolve, reject) => {
				let all = '';
				let err = '';
				const c = spawn(cmd, args, { windowsHide: true });
				c.stdout.on('data', (d) => { all += d.toString(); });
				c.stderr.on('data', (d) => { err += d.toString(); });
				c.on('error', reject);
				c.on('close', () => resolve((all || err).trim()));
			});
			return { found: true, command: cmd, version: out };
		} catch (e: any) {
			// try next
		}
	}
	return { found: false, error: 'Python nicht gefunden' };
}

async function create() {
	const w = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	// Try multiple dev ports (5173–5178) to match Vite's fallback behavior
	const ports = [5173, 5174, 5175, 5176, 5177, 5178];
	let loaded = false;
	for (const p of ports) {
		try {
			await w.loadURL(`http://localhost:${p}`);
			loaded = true;
			break;
		} catch (e) {
			// try next
		}
	}
	if (!loaded) {
		// last resort: show a minimal error page
		w.loadURL('data:text/html,<h3>Renderer Dev-Server nicht gefunden (Ports 5173-5178).</h3>');
	}
}

app.whenReady().then(() => {
	// Entferne alle existierenden IPC-Handler um Duplikate zu vermeiden
	ipcMain.removeAllListeners();
	
	runMigrations();
	const db = getDb();
	
	// Registriere alle IPC-Handler neu mit Fehlerbehandlung
	try {
		registerCrmHandlers(db);
		console.log('CRM handlers registered successfully');
	} catch (error) {
		console.error('Failed to register CRM handlers:', error);
	}
	
	try {
		registerProductHandlers(db);
		console.log('Product handlers registered successfully');
	} catch (error) {
		console.error('Failed to register Product handlers:', error);
	}
	
	try {
		registerPdfHandlers();
		console.log('PDF handlers registered successfully');
	} catch (error) {
		console.error('Failed to register PDF handlers:', error);
	}
	
	// Registriere die direkten IPC-Handler wieder
	try {
		// Solar API handlers
		ipcMain.handle('solar:get_pv_manufacturers', async () => JSON.parse(await runPy('get_pv_manufacturers')));
		ipcMain.handle('solar:get_pv_models', async (_e, m: string) => JSON.parse(await runPy('get_pv_models', m)));
		ipcMain.handle('solar:get_inverter_manufacturers', async () => JSON.parse(await runPy('get_inverter_manufacturers')));
		ipcMain.handle('solar:get_inverter_models', async (_e, m: string) => JSON.parse(await runPy('get_inverter_models', m)));
		ipcMain.handle('solar:get_storage_manufacturers', async () => JSON.parse(await runPy('get_storage_manufacturers')));
		ipcMain.handle('solar:get_storage_models', async (_e, m: string) => JSON.parse(await runPy('get_storage_models', m)));
		ipcMain.handle('solar:get_wallbox_manufacturers', async () => JSON.parse(await runPy('get_wallbox_manufacturers')));
		ipcMain.handle('solar:get_wallbox_models', async (_e, m: string) => JSON.parse(await runPy('get_wallbox_models', m)));
		ipcMain.handle('solar:get_ems_manufacturers', async () => JSON.parse(await runPy('get_ems_manufacturers')));
		ipcMain.handle('solar:get_ems_models', async (_e, m: string) => JSON.parse(await runPy('get_ems_models', m)));
		ipcMain.handle('solar:get_optimizer_manufacturers', async () => JSON.parse(await runPy('get_optimizer_manufacturers')));
		ipcMain.handle('solar:get_optimizer_models', async (_e, m: string) => JSON.parse(await runPy('get_optimizer_models', m)));
		ipcMain.handle('solar:get_carport_manufacturers', async () => JSON.parse(await runPy('get_carport_manufacturers')));
		ipcMain.handle('solar:get_carport_models', async (_e, m: string) => JSON.parse(await runPy('get_carport_models', m)));
		ipcMain.handle('solar:get_emergency_power_manufacturers', async () => JSON.parse(await runPy('get_emergency_power_manufacturers')));
		ipcMain.handle('solar:get_emergency_power_models', async (_e, m: string) => JSON.parse(await runPy('get_emergency_power_models', m)));
		ipcMain.handle('solar:get_animal_protection_manufacturers', async () => JSON.parse(await runPy('get_animal_protection_manufacturers')));
		ipcMain.handle('solar:get_animal_protection_models', async (_e, m: string) => JSON.parse(await runPy('get_animal_protection_models', m)));
		ipcMain.handle('solar:save_config', async (_e, cfg: Record<string, unknown>) => {
			const json = JSON.stringify(cfg);
			return JSON.parse(await runPy('save_config', json));
		});

		// Import handlers (Bridge zu Python)
		ipcMain.handle('import:products_from_file', async (_e, payload: Record<string, unknown>) => {
			const json = JSON.stringify(payload);
			return JSON.parse(await runPy('import_products_from_file', json));
		});
		
		ipcMain.handle('products:add_single', async (_e, payload: Record<string, unknown>) => {
			const json = JSON.stringify(payload);
			return JSON.parse(await runPy('add_product_single', json));
		});
		ipcMain.handle('products:update_single', async (_e, id: number, payload: Record<string, unknown>) => {
			const json = JSON.stringify(payload);
			return JSON.parse(await runPy('update_product_single', String(id), json));
		});
		// Produkte: Liste/Löschen
		ipcMain.handle('products:list', async (_e, payload?: Record<string, unknown>) => {
			const json = JSON.stringify(payload ?? {});
			return JSON.parse(await runPy('products_list', json));
		});
		ipcMain.handle('products:delete_single', async (_e, id: number) => {
			return JSON.parse(await runPy('delete_product_single', String(id)));
		});

		// System handlers
		ipcMain.handle('system:show_open_dialog', async (_e, options: any) => {
			const win = BrowserWindow.getFocusedWindow();
			const res = await dialog.showOpenDialog(win!, options ?? { properties: ['openFile'] });
			return res;
		});

		ipcMain.handle('system:python_info', async () => {
			return await detectPython();
		});
		
		console.log('Direct IPC handlers registered successfully');
	} catch (error) {
		console.error('Failed to register direct IPC handlers:', error);
	}
	
	create();
});
