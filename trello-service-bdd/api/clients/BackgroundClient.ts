import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, readTestAsset } from '@core';
import { BaseClient } from './BaseClient';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

export class BackgroundApiClient extends BaseClient {
  constructor(
    request: APIRequestContext,
    authStrategy: IAuthStrategy,
    private workspace: string,
  ) {
    super(request, authStrategy);
  }

  async uploadBackground(fileName: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await this.post('/1/members/me/boardBackgrounds', {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
      },
    });
    logger.debug(`POST /1/members/me/boardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getBackgrounds(): Promise<APIResponse> {
    const response = await this.get('/1/members/me/boardBackgrounds');
    logger.debug(`GET /1/members/me/boardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.get(`/1/members/me/boardBackgrounds/${backgroundId}`);
    logger.debug(
      `GET /1/members/me/boardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async updateBackground(
    backgroundId: string,
    updates: Record<string, string>,
  ): Promise<APIResponse> {
    const response = await this.put(`/1/members/me/boardBackgrounds/${backgroundId}`, updates);
    logger.debug(
      `PUT /1/members/me/boardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async deleteBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.delete(`/1/members/me/boardBackgrounds/${backgroundId}`);
    logger.debug(
      `DELETE /1/members/me/boardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }
}
