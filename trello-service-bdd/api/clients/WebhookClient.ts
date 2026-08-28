import { APIRequestContext, APIResponse } from '@playwright/test';
import { logger } from '@core';
import { BaseClient } from './BaseClient';
import { IAuthStrategy } from '../auth/auth-strategy.interface';

export class WebhookClient extends BaseClient {
  constructor(request: APIRequestContext, authStrategy: IAuthStrategy) {
    super(request, authStrategy);
  }

  async createWebhook(callbackURL: string, idModel: string): Promise<APIResponse> {
    const response = await this.post('/1/webhooks', { callbackURL, idModel });
    logger.debug(`POST /1/webhooks - Status ${response.status()}`);
    return response;
  }

  async getWebhook(webhookId: string): Promise<APIResponse> {
    const response = await this.get(`/1/webhooks/${webhookId}`);
    logger.debug(`GET /1/webhooks/${webhookId} - Status ${response.status()}`);
    return response;
  }

  async updateWebhook(webhookId: string, updates: Record<string, string>): Promise<APIResponse> {
    const response = await this.put(`/1/webhooks/${webhookId}`, updates);
    logger.debug(`PUT /1/webhooks/${webhookId} - Status ${response.status()}`);
    return response;
  }

  async deleteWebhook(webhookId: string): Promise<APIResponse> {
    const response = await this.delete(`/1/webhooks/${webhookId}`);
    logger.debug(`DELETE /1/webhooks/${webhookId} - Status ${response.status()}`);
    return response;
  }
}
