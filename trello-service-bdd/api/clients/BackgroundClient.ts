import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, readTestAsset } from '@core';

export class BackgroundClient {
  constructor(
    private request: APIRequestContext,
    private workspace: string,
  ) {}

  async uploadBackground(fileName: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await this.request.post('/1/members/me/boardBackgrounds', {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
      },
    });
    logger.debug(`POST /1/members/me/boardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getBackgrounds(): Promise<APIResponse> {
    const response = await this.request.get('/1/members/me/boardBackgrounds');
    logger.debug(`GET /1/members/me/boardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.request.get(`/1/members/me/boardBackgrounds/${backgroundId}`);
    logger.debug(
      `GET /1/members/me/boardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async updateBackground(
    backgroundId: string,
    updates: Record<string, string>,
  ): Promise<APIResponse> {
    const response = await this.request.put(`/1/members/me/boardBackgrounds/${backgroundId}`, {
      params: updates,
    });
    logger.debug(
      `PUT /1/members/me/boardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async deleteBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.request.delete(`/1/members/me/boardBackgrounds/${backgroundId}`);
    logger.debug(
      `DELETE /1/members/me/boardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }
}
