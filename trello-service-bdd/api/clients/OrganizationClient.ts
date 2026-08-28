import { APIRequestContext, APIResponse } from '@playwright/test';
import { OrganizationPayload } from '../schemas/organizationSchemas';
import { logger, readTestAsset } from '@core';

export class OrganizationClient {
  constructor(
    private readonly request: APIRequestContext,
    private workspace: string,
  ) {}

  async create(payload: OrganizationPayload): Promise<APIResponse> {
    const res = await this.request.post('/1/organizations', { params: payload });
    logger.debug(`POST /1/organizations - ${res.status()}`);
    return res;
  }

  async get(id: string): Promise<APIResponse> {
    const res = await this.request.get(`/1/organizations/${id}`);
    logger.debug(`GET /1/organizations/${id} - ${res.status()}`);
    return res;
  }

  async update(id: string, updates: OrganizationPayload): Promise<APIResponse> {
    const res = await this.request.put(`/1/organizations/${id}`, { params: updates });
    logger.debug(`PUT /1/organizations/${id} - ${res.status()}`);
    return res;
  }

  async delete(id: string): Promise<APIResponse> {
    const res = await this.request.delete(`/1/organizations/${id}`);
    logger.debug(`DELETE /1/organizations/${id} - ${res.status()}`);
    return res;
  }

  async setLogo(id: string, fileName: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const res = await this.request.post(`/1/organizations/${id}/logo`, {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
      },
    });
    logger.debug(`POST /1/organizations/${id}/logo - ${res.status()}`);
    return res;
  }

  async setLogoWithoutFile(id: string): Promise<APIResponse> {
    const res = await this.request.post(`/1/organizations/${id}/logo`);
    logger.debug(`POST /1/organizations/${id}/logo (no body) - ${res.status()}`);
    return res;
  }

  async deleteLogo(id: string): Promise<APIResponse> {
    const res = await this.request.delete(`/1/organizations/${id}/logo`);
    logger.debug(`DELETE /1/organizations/${id}/logo - ${res.status()}`);
    return res;
  }
}
