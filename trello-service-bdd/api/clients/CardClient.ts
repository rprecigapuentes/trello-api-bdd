import { APIResponse } from '@playwright/test';
import { TrelloCardSchema } from '../schemas/trelloSchemas';
import { BaseClient } from './BaseClient';

export class CardClient extends BaseClient {
  async createCard(listId: string, name: string, desc: string = ''): Promise<APIResponse> {
    const response: APIResponse = await this.post(`/1/cards`, { idList: listId, name, desc });
    return response;
  }

  async getCard(cardId: string): Promise<APIResponse> {
    const response: APIResponse = await this.get(`/1/cards/${cardId}`);
    return response;
  }

  async updateCard(cardId: string, updates: Partial<TrelloCardSchema>): Promise<APIResponse> {
    const response: APIResponse = await this.put(`/1/cards/${cardId}`, updates);
    return response;
  }

  async deleteCard(cardId: string): Promise<APIResponse> {
    const response: APIResponse = await this.delete(`/1/cards/${cardId}`);
    return response;
  }

  async addMemberToCard(cardId: string, memberId: string): Promise<APIResponse> {
    const response: APIResponse = await this.post(`/1/cards/${cardId}/idMembers`, {
      value: memberId,
    });
    return response;
  }

  async removeMemberFromCard(cardId: string, memberId: string): Promise<APIResponse> {
    const response: APIResponse = await this.delete(`/1/cards/${cardId}/idMembers/${memberId}`);
    return response;
  }

  async getCardMembers(cardId: string): Promise<APIResponse> {
    const response: APIResponse = await this.get(`/1/cards/${cardId}/members`);
    return response;
  }
}
