import { APIRequestContext, APIResponse } from '@playwright/test';
import { LabelPayload } from '../schemas/labelSchemas';
import { logger } from '@core';

export class LabelClient {
  constructor(private readonly request: APIRequestContext) {}

  async create(payload: LabelPayload): Promise<APIResponse> {
    const res = await this.request.post('/1/labels', { params: payload });
    logger.debug(`POST /1/labels - ${res.status()}`);
    return res;
  }

  async get(id: string): Promise<APIResponse> {
    const res = await this.request.get(`/1/labels/${id}`);
    logger.debug(`GET /1/labels/${id} - ${res.status()}`);
    return res;
  }

  async update(id: string, updates: LabelPayload): Promise<APIResponse> {
    const res = await this.request.put(`/1/labels/${id}`, { params: updates });
    logger.debug(`PUT /1/labels/${id} - ${res.status()}`);
    return res;
  }

  async delete(id: string): Promise<APIResponse> {
    const res = await this.request.delete(`/1/labels/${id}`);
    logger.debug(`DELETE /1/labels/${id} - ${res.status()}`);
    return res;
  }
}
