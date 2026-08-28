import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, readTestAsset } from '@core';
import { BaseClient } from './BaseClient';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

export class CustomStickerClient extends BaseClient {
  constructor(
    request: APIRequestContext,
    authStrategy: IAuthStrategy,
    private readonly workspace: string,
  ) {
    super(request, authStrategy);
  }

  async uploadCustomSticker(fileName: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await this.post('/1/members/me/customStickers', {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
      },
    });
    logger.debug(`POST /1/members/me/customStickers - Status ${response.status()}`);
    return response;
  }

  async getCustomStickers(): Promise<APIResponse> {
    const response = await this.get('/1/members/me/customStickers');
    logger.debug(`GET /1/members/me/customStickers - Status ${response.status()}`);
    return response;
  }

  async getCustomSticker(stickerId: string): Promise<APIResponse> {
    const response = await this.get(`/1/members/me/customStickers/${stickerId}`);
    logger.debug(`GET /1/members/me/customStickers/${stickerId} - Status ${response.status()}`);
    return response;
  }

  async deleteCustomSticker(stickerId: string): Promise<APIResponse> {
    const response = await this.delete(`/1/members/me/customStickers/${stickerId}`);
    logger.debug(`DELETE /1/members/me/customStickers/${stickerId} - Status ${response.status()}`);
    return response;
  }
}
