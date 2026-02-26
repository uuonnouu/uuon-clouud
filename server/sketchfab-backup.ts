import fs from "fs";
import path from "path";

const SKETCHFAB_API = "https://api.sketchfab.com/v3";
const BACKUP_DIR = path.resolve(process.cwd(), "backups/sketchfab-models");

interface SketchfabModel {
  uid: string;
  name: string;
  description: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  isDownloadable: boolean;
  thumbnails: { images: { url: string; width: number }[] };
}

export async function listSketchfabModels(
  apiToken: string,
  username: string = "UUON-Foundation"
): Promise<SketchfabModel[]> {
  const models: SketchfabModel[] = [];
  let nextUrl: string | null =
    `${SKETCHFAB_API}/models?user=${username}&count=24`;

  while (nextUrl) {
    const res = await fetch(nextUrl, {
      headers: { Authorization: `Token ${apiToken}` },
    });

    if (!res.ok) {
      throw new Error(
        `Sketchfab API error: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    models.push(...data.results);
    nextUrl = data.next;
  }

  return models;
}

export async function downloadModel(
  apiToken: string,
  modelUid: string,
  modelName: string
): Promise<{ success: boolean; filePath?: string; error?: string }> {
  try {
    const res = await fetch(
      `${SKETCHFAB_API}/models/${modelUid}/download`,
      {
        headers: { Authorization: `Token ${apiToken}` },
      }
    );

    if (!res.ok) {
      return {
        success: false,
        error: `Download not available: ${res.status} ${res.statusText}`,
      };
    }

    const data = await res.json();
    const downloadUrl = data.gltf?.url || data.source?.url;

    if (!downloadUrl) {
      return { success: false, error: "No download URL available" };
    }

    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const safeName = modelName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const filePath = path.join(BACKUP_DIR, `${safeName}-${modelUid}.zip`);

    const fileRes = await fetch(downloadUrl);
    if (!fileRes.ok) {
      return { success: false, error: "Failed to download file" };
    }

    const buffer = Buffer.from(await fileRes.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return { success: true, filePath };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function backupAllModels(
  apiToken: string
): Promise<{
  success: boolean;
  totalModels: number;
  downloaded: number;
  failed: number;
  errors: string[];
  manifestPath: string;
}> {
  const errors: string[] = [];
  let downloaded = 0;

  const models = await listSketchfabModels(apiToken);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const manifest = {
    exportedAt: new Date().toISOString(),
    origin: "UUON-FOUNDATION-GCENTRIC-V1",
    totalModels: models.length,
    models: models.map((m) => ({
      uid: m.uid,
      name: m.name,
      description: m.description,
      createdAt: m.createdAt,
      viewCount: m.viewCount,
      likeCount: m.likeCount,
      isDownloadable: m.isDownloadable,
    })),
  };

  const manifestPath = path.join(BACKUP_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  for (const model of models) {
    if (model.isDownloadable) {
      const result = await downloadModel(apiToken, model.uid, model.name);
      if (result.success) {
        downloaded++;
      } else {
        errors.push(`${model.name}: ${result.error}`);
      }
      await new Promise((r) => setTimeout(r, 1000));
    } else {
      errors.push(`${model.name}: Not downloadable`);
    }
  }

  return {
    success: true,
    totalModels: models.length,
    downloaded,
    failed: errors.length,
    errors,
    manifestPath,
  };
}
