import { APIRequestContext, APIResponse } from '@playwright/test';
import { TrelloCardSchema } from '../schemas/trelloSchemas';
import { logger } from '../../../core';

export class CardClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createCard(listId: string, name: string, desc: string = ''): Promise<TrelloCardSchema> {
    const response = await this.request.post(`/1/cards`, {
      params: { idList: listId, name, desc },
    });
    if (!response.ok()) {
      logger.error(
        `POST /1/cards failed with status ${response.status()} - ${response.statusText()}`,
      );
      throw new Error(`Failed to create card: ${response.statusText()}`);
    }
    const data: TrelloCardSchema = await response.json();
    logger.debug(`POST /1/cards - Card ID created: '${data.id}'`);
    return data;
  }

  async getCard(cardId: string): Promise<TrelloCardSchema> {
    const response = await this.request.get(`/1/cards/${cardId}`);
    if (!response.ok()) {
      logger.error(
        `GET /1/cards/${cardId} failed with status ${response.status()} - ${response.statusText()}`,
      );
      throw new Error(`Failed to fetch card: ${response.statusText()}`);
    }
    logger.debug(`GET /1/cards/'${cardId}' - Status ${response.status()} OK`);
    return response.json();
  }

  async updateCard(cardId: string, updates: Partial<TrelloCardSchema>): Promise<TrelloCardSchema> {
    const response = await this.request.put(`/1/cards/${cardId}`, {
      params: updates,
    });
    if (!response.ok()) {
      logger.error(
        `PUT /1/cards/${cardId} failed with status ${response.status()} - ${response.statusText()}`,
      );
      throw new Error(`Failed to update card: ${response.statusText()}`);
    }
    logger.debug(`PUT /1/cards/'${cardId}' - Success`);
    return response.json();
  }

  async deleteCard(cardId: string): Promise<APIResponse> {
    const response = await this.request.delete(`/1/cards/${cardId}`);
    if (!response.ok()) {
      logger.error(
        `DELETE /1/cards/${cardId} failed with status ${response.status()} - ${response.statusText()}`,
      );
      throw new Error(`Failed to delete card: ${response.statusText()}`);
    }
    logger.debug(`DELETE /1/cards/'${cardId}' - Success`);
    return response;
  }
}
