import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, readTestAsset } from '@core';
import { BaseClient } from './BaseClient';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

export class CustomEmojiClient extends BaseClient {
  constructor(
    request: APIRequestContext,
    authStrategy: IAuthStrategy,
    private readonly workspace: string,
  ) {
    super(request, authStrategy);
  }

  async uploadCustomEmoji(fileName: string, name: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await this.post('/1/members/me/customEmoji', {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
        name,
      },
    });
    logger.debug(`POST /1/members/me/customEmoji - Status ${response.status()}`);
    return response;
  }

  async getCustomEmojis(): Promise<APIResponse> {
    const response = await this.get('/1/members/me/customEmoji');
    logger.debug(`GET /1/members/me/customEmoji - Status ${response.status()}`);
    return response;
  }
}
