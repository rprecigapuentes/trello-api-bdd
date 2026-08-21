import {
  configure,
  getConsoleSink,
  getLogger,
  getAnsiColorFormatter,
  getTextFormatter,
} from '@logtape/logtape';
import { getFileSink } from '@logtape/file';
import fs from 'node:fs';
import path from 'node:path';

let isConfigured = false;

export async function setupLogger() {
  if (isConfigured) return;

  const logDir = path.resolve(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  await configure({
    sinks: {
      console: getConsoleSink({
        formatter: getAnsiColorFormatter(),
      }),
      file: getFileSink(path.join(logDir, 'execution.log'), {
        formatter: getTextFormatter(),
      }),
    },
    loggers: [
      {
        category: ['app'],
        lowestLevel: 'debug',
        sinks: ['console', 'file'],
      },
      {
        category: ['logtape'],
        lowestLevel: 'fatal',
        sinks: ['console'],
      },
    ],
  });

  isConfigured = true;
}

export const logger = getLogger(['app']);
