import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, readTestAsset } from '@core';
import { BaseClient } from './BaseClient';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

export class CustomBackgroundClient extends BaseClient {
  constructor(
    request: APIRequestContext,
    authStrategy: IAuthStrategy,
    private readonly workspace: string,
  ) {
    super(request, authStrategy);
  }

  async uploadCustomBackground(fileName: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await this.post('/1/members/me/customBoardBackgrounds', {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
      },
    });
    logger.debug(`POST /1/members/me/customBoardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getCustomBackgrounds(): Promise<APIResponse> {
    const response = await this.get('/1/members/me/customBoardBackgrounds');
    logger.debug(`GET /1/members/me/customBoardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getCustomBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.get(`/1/members/me/customBoardBackgrounds/${backgroundId}`);
    logger.debug(
      `GET /1/members/me/customBoardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async updateCustomBackground(
    backgroundId: string,
    updates: Record<string, string>,
  ): Promise<APIResponse> {
    const response = await this.put(
      `/1/members/me/customBoardBackgrounds/${backgroundId}`,
      updates,
    );
    logger.debug(
      `PUT /1/members/me/customBoardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async deleteCustomBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.delete(`/1/members/me/customBoardBackgrounds/${backgroundId}`);
    logger.debug(
      `DELETE /1/members/me/customBoardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }
}
