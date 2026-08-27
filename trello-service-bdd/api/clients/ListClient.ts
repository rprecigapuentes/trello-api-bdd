import { APIRequestContext, APIResponse } from '@playwright/test';

export class ListClient {
  constructor(private request: APIRequestContext) {}

  async createList(boardId: string, name: string): Promise<APIResponse> {
    return await this.request.post('1/lists', {
      params: {
        name,
        idBoard: boardId,
      },
    });
  }

  async updateList(
    listId: string,
    data: Record<string, string | number | boolean>,
  ): Promise<APIResponse> {
    return await this.request.put(`1/lists/${listId}`, {
      params: data,
    });
  }

  async updateField(listId: string, field: string, value: string): Promise<APIResponse> {
    return await this.request.put(`1/lists/${listId}/${field}`, {
      params: { value },
    });
  }

  async archiveList(listId: string): Promise<APIResponse> {
    return await this.request.put(`1/lists/${listId}/closed`, {
      params: { value: 'true' },
    });
  }

  async unarchiveList(listId: string): Promise<APIResponse> {
    return await this.updateList(listId, { closed: false });
  }

  async archiveAllCards(listId: string): Promise<APIResponse> {
    return await this.request.post(`1/lists/${listId}/archiveAllCards`);
  }

  async moveAllCards(listId: string, boardId: string, destListId: string): Promise<APIResponse> {
    return await this.request.post(`1/lists/${listId}/moveAllCards`, {
      params: {
        idBoard: boardId,
        idList: destListId,
      },
    });
  }

  async moveListToBoard(listId: string, boardId: string): Promise<APIResponse> {
    return await this.request.put(`1/lists/${listId}/idBoard`, {
      params: { value: boardId },
    });
  }

  async getCards(listId: string): Promise<APIResponse> {
    return await this.request.get(`1/lists/${listId}/cards`);
  }
}
