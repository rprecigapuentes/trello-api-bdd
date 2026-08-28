import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, readTestAsset } from '@core';

export class CustomBackgroundClient {
  constructor(
    private request: APIRequestContext,
    private workspace: string,
  ) {}

  async uploadCustomBackground(fileName: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

    const response = await this.request.post('/1/members/me/customBoardBackgrounds', {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
      },
    });
    logger.debug(`POST /1/members/me/customBoardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getCustomBackgrounds(): Promise<APIResponse> {
    const response = await this.request.get('/1/members/me/customBoardBackgrounds');
    logger.debug(`GET /1/members/me/customBoardBackgrounds - Status ${response.status()}`);
    return response;
  }

  async getCustomBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.request.get(`/1/members/me/customBoardBackgrounds/${backgroundId}`);
    logger.debug(
      `GET /1/members/me/customBoardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async updateCustomBackground(
    backgroundId: string,
    updates: Record<string, string>,
  ): Promise<APIResponse> {
    const response = await this.request.put(
      `/1/members/me/customBoardBackgrounds/${backgroundId}`,
      { params: updates },
    );
    logger.debug(
      `PUT /1/members/me/customBoardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }

  async deleteCustomBackground(backgroundId: string): Promise<APIResponse> {
    const response = await this.request.delete(
      `/1/members/me/customBoardBackgrounds/${backgroundId}`,
    );
    logger.debug(
      `DELETE /1/members/me/customBoardBackgrounds/${backgroundId} - Status ${response.status()}`,
    );
    return response;
  }
}
