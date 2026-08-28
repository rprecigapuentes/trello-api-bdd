import { APIResponse } from '@playwright/test';
import { LabelPayload } from '../schemas/labelSchemas';
import { logger } from '@core';
import { BaseClient } from './BaseClient';

export class LabelClient extends BaseClient {
  async createLabel(payload: LabelPayload): Promise<APIResponse> {
    const res = await this.post('/1/labels', payload);
    logger.debug(`POST /1/labels - ${res.status()}`);
    return res;
  }

  async getLabel(id: string): Promise<APIResponse> {
    const res = await this.get(`/1/labels/${id}`);
    logger.debug(`GET /1/labels/${id} - ${res.status()}`);
    return res;
  }

  async updateLabel(id: string, updates: LabelPayload): Promise<APIResponse> {
    const res = await this.put(`/1/labels/${id}`, updates);
    logger.debug(`PUT /1/labels/${id} - ${res.status()}`);
    return res;
  }

  async deleteLabel(id: string): Promise<APIResponse> {
    const res = await this.delete(`/1/labels/${id}`);
    logger.debug(`DELETE /1/labels/${id} - ${res.status()}`);
    return res;
  }
}
