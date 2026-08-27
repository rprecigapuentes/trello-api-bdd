import { APIResponse } from '@playwright/test';
import { OrganizationPayload } from '../schemas/organizationSchemas';
import { logger } from '@core';
import { BaseClient } from './BaseClient';

export class OrganizationClient extends BaseClient {
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
}
