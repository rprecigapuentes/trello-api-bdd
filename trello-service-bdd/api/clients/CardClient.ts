import { APIRequestContext, APIResponse } from '@playwright/test';
import { TrelloCardSchema } from '../schemas/trelloSchemas';

export class CardClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createCard(listId: string, name: string, desc: string = ''): Promise<APIResponse> {
    const response = await this.request.post(`/1/cards`, {
      params: { idList: listId, name, desc },
    });
    return response;
  }

  async getCard(cardId: string): Promise<APIResponse> {
    const response = await this.request.get(`/1/cards/${cardId}`);
    return response;
  }

  async updateCard(cardId: string, updates: Partial<TrelloCardSchema>): Promise<APIResponse> {
    const response = await this.request.put(`/1/cards/${cardId}`, {
      params: updates,
    });
    return response;
  }

  async deleteCard(cardId: string): Promise<APIResponse> {
    const response = await this.request.delete(`/1/cards/${cardId}`);
    return response;
  }

  async addMemberToCard(cardId: string, memberId: string): Promise<APIResponse> {
    const response = await this.request.post(`/1/cards/${cardId}/idMembers`, {
      params: { value: memberId },
    });
    return response;
  }

  async removeMemberFromCard(cardId: string, memberId: string): Promise<APIResponse> {
    const response = await this.request.delete(`/1/cards/${cardId}/idMembers/${memberId}`);
    return response;
  }

  async getCardMembers(cardId: string): Promise<APIResponse> {
    const response = await this.request.get(`/1/cards/${cardId}/members`);
    return response;
  }
}
