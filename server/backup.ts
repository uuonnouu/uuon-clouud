import { pool } from "./db";
import fs from "fs";
import path from "path";

const BACKUP_DIR = path.resolve(process.cwd(), "backups");
const MAX_BACKUPS = 30;

const TABLES = [
  "conversations",
  "messages",
  "uuon_tokens",
  "creator_profile",
  "fingerprints",
  "access_log",
  "uploads",
  "self_assessments",
  "uinverse_imports",
  "uinverse_ideas",
];

export async function runBackup(): Promise<{
  success: boolean;
  timestamp: string;
  tables: { name: string; rowCount: number }[];
  filePath: string;
  error?: string;
}> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const backup: Record<string, any[]> = {};
    const tableSummary: { name: string; rowCount: number }[] = [];

    for (const table of TABLES) {
      try {
        const result = await pool.query(`SELECT * FROM "${table}"`);
        backup[table] = result.rows;
        tableSummary.push({ name: table, rowCount: result.rows.length });
      } catch (err: any) {
        backup[table] = [];
        tableSummary.push({ name: table, rowCount: 0 });
      }
    }

    const exportData = {
      metadata: {
        origin: "UUON-FOUNDATION-GCENTRIC-V1",
        exportedAt: new Date().toISOString(),
        tableCount: TABLES.length,
        totalRows: tableSummary.reduce((sum, t) => sum + t.rowCount, 0),
      },
      data: backup,
    };

    fs.writeFileSync(backupFile, JSON.stringify(exportData, null, 2));

    cleanOldBackups();

    return {
      success: true,
      timestamp: new Date().toISOString(),
      tables: tableSummary,
      filePath: backupFile,
    };
  } catch (error: any) {
    return {
      success: false,
      timestamp: new Date().toISOString(),
      tables: [],
      filePath: backupFile,
      error: error.message,
    };
  }
}

function cleanOldBackups() {
  try {
    if (!fs.existsSync(BACKUP_DIR)) return;

    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter((f) => f.startsWith("backup-") && f.endsWith(".json"))
      .sort()
      .reverse();

    for (let i = MAX_BACKUPS; i < files.length; i++) {
      fs.unlinkSync(path.join(BACKUP_DIR, files[i]));
    }
  } catch {}
}

export function getBackupStatus(): {
  lastBackup: string | null;
  backupCount: number;
  backupDir: string;
} {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return { lastBackup: null, backupCount: 0, backupDir: BACKUP_DIR };
    }

    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter((f) => f.startsWith("backup-") && f.endsWith(".json"))
      .sort()
      .reverse();

    return {
      lastBackup: files.length > 0 ? files[0] : null,
      backupCount: files.length,
      backupDir: BACKUP_DIR,
    };
  } catch {
    return { lastBackup: null, backupCount: 0, backupDir: BACKUP_DIR };
  }
}

let backupInterval: ReturnType<typeof setInterval> | null = null;

export function startScheduledBackups(intervalHours: number = 24) {
  runBackup().then((result) => {
    if (result.success) {
      console.log(
        `[BACKUP] Initial backup complete: ${result.tables.reduce((s, t) => s + t.rowCount, 0)} rows across ${result.tables.length} tables`
      );
    } else {
      console.error(`[BACKUP] Initial backup failed: ${result.error}`);
    }
  });

  backupInterval = setInterval(
    async () => {
      const result = await runBackup();
      if (result.success) {
        console.log(
          `[BACKUP] Scheduled backup complete: ${result.tables.reduce((s, t) => s + t.rowCount, 0)} rows`
        );
      } else {
        console.error(`[BACKUP] Scheduled backup failed: ${result.error}`);
      }
    },
    intervalHours * 60 * 60 * 1000
  );

  console.log(
    `[BACKUP] Scheduled backups every ${intervalHours} hours to ${BACKUP_DIR}`
  );
}

export function stopScheduledBackups() {
  if (backupInterval) {
    clearInterval(backupInterval);
    backupInterval = null;
  }
}
