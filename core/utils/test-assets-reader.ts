import fs from 'node:fs';
import path from 'node:path';

const MONOREPO_ROOT = path.resolve(__dirname, '../..');

export function readTestAsset(workspace: string, fileName: string): Buffer {
  const filePath = path.join(MONOREPO_ROOT, workspace, 'assets', 'img', fileName);
  return fs.readFileSync(filePath);
}
