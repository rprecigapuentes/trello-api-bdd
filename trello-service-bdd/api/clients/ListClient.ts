import { APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';

export class ListClient extends BaseClient {
  async createList(boardId: string, name: string): Promise<APIResponse> {
    const response = await this.post(`/1/lists`, { name, idBoard: boardId });
    return response;
  }

  async getList(listId: string): Promise<APIResponse> {
    const response = await this.get(`/1/lists/${listId}`);
    return response;
  }

  async updateList(
    listId: string,
    data: Record<string, string | number | boolean>,
  ): Promise<APIResponse> {
    return await this.put(`/1/lists/${listId}`, data);
  }

  async updateField(listId: string, field: string, value: string): Promise<APIResponse> {
    return await this.put(`/1/lists/${listId}/${field}`, { value });
  }

  async archiveList(listId: string): Promise<APIResponse> {
    return await this.put(`/1/lists/${listId}/closed`, { value: 'true' });
  }

  async unarchiveList(listId: string): Promise<APIResponse> {
    return await this.updateList(listId, { closed: false });
  }

  async archiveAllCards(listId: string): Promise<APIResponse> {
    return await this.post(`/1/lists/${listId}/archiveAllCards`);
  }

  async moveAllCards(listId: string, boardId: string, destListId: string): Promise<APIResponse> {
    return await this.post(`/1/lists/${listId}/moveAllCards`, {
      idBoard: boardId,
      idList: destListId,
    });
  }

  async moveListToBoard(listId: string, boardId: string): Promise<APIResponse> {
    return await this.put(`/1/lists/${listId}/idBoard`, { value: boardId });
  }

  async getCards(listId: string): Promise<APIResponse> {
    return await this.get(`/1/lists/${listId}/cards`);
  }
}
