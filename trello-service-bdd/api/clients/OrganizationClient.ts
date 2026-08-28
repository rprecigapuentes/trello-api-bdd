import { OrganizationPayload } from '../schemas/organizationSchemas';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger, readTestAsset } from '@core';
import { BaseClient } from './BaseClient';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

export class OrganizationClient extends BaseClient {
  constructor(
    request: APIRequestContext,
    authStrategy: IAuthStrategy,
    private readonly workspace: string,
  ) {
    super(request, authStrategy);
  }

  async create(payload: OrganizationPayload): Promise<APIResponse> {
    const res = await this.post('/1/organizations', payload);
    logger.debug(`POST /1/organizations - ${res.status()}`);
    return res;
  }

  async getOrganization(id: string): Promise<APIResponse> {
    const res = await this.get(`/1/organizations/${id}`);
    logger.debug(`GET /1/organizations/${id} - ${res.status()}`);
    return res;
  }

  async update(id: string, updates: OrganizationPayload): Promise<APIResponse> {
    const res = await this.put(`/1/organizations/${id}`, updates);
    logger.debug(`PUT /1/organizations/${id} - ${res.status()}`);
    return res;
  }

  async deleteOrganization(id: string): Promise<APIResponse> {
    const res = await this.delete(`/1/organizations/${id}`);
    logger.debug(`DELETE /1/organizations/${id} - ${res.status()}`);
    return res;
  }

  async setLogo(id: string, fileName: string): Promise<APIResponse> {
    const fileBuffer = readTestAsset(this.workspace, fileName);
    const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
    const res = await this.post(`/1/organizations/${id}/logo`, {
      multipart: {
        file: { name: fileName, mimeType, buffer: fileBuffer },
      },
    });
    logger.debug(`POST /1/organizations/${id}/logo - ${res.status()}`);
    return res;
  }

  async setLogoWithoutFile(id: string): Promise<APIResponse> {
    const res = await this.post(`/1/organizations/${id}/logo`);
    logger.debug(`POST /1/organizations/${id}/logo (no body) - ${res.status()}`);
    return res;
  }

  async deleteLogo(id: string): Promise<APIResponse> {
    const res = await this.delete(`/1/organizations/${id}/logo`);
    logger.debug(`DELETE /1/organizations/${id}/logo - ${res.status()}`);
    return res;
  }
}
