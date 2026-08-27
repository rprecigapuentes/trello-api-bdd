import { APIRequestContext, APIResponse } from '@playwright/test';
import { OrganizationPayload } from '../schemas/organizationSchemas';
import { logger } from '@core';

export class OrganizationClient {
  constructor(private readonly request: APIRequestContext) {}

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
}
