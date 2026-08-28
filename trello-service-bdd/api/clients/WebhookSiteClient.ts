import { APIRequestContext } from '@playwright/test';
import { logger } from '@core';
import { WebhookSiteRequest, webhookSiteRequestSchema } from '../schemas/webhookSchemas';

interface WebhookSiteToken {
  uuid: string;
}

interface WebhookSiteRequestList {
  data: WebhookSiteRequest[];
}

export class WebhookSiteClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createToken(): Promise<WebhookSiteToken> {
    const response = await this.request.post('https://webhook.site/token', {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    });
    logger.debug(`POST https://webhook.site/token - Status ${response.status()}`);
    if (!response.ok()) {
      throw new Error(`Failed to create webhook.site token. Status: ${response.status()}`);
    }
    return (await response.json()) as WebhookSiteToken;
  }

  async getRequests(tokenId: string): Promise<WebhookSiteRequest[]> {
    const response = await this.request.get(`https://webhook.site/token/${tokenId}/requests`, {
      params: { sorting: 'newest' },
      headers: { Accept: 'application/json' },
    });
    logger.debug(
      `GET https://webhook.site/token/${tokenId}/requests - Status ${response.status()}`,
    );
    const body = (await response.json()) as WebhookSiteRequestList;
    return body.data.map((request) => webhookSiteRequestSchema.parse(request));
  }
}
