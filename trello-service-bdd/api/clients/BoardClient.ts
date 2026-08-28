import { APIResponse } from '@playwright/test';
import { TrelloBoardSchema } from '../schemas/trelloSchemas';
import { BaseClient } from './BaseClient';

export class BoardClient extends BaseClient {
  async createBoard(name: string, idOrganization?: string): Promise<APIResponse> {
    const response = await this.post(
      `/1/boards`,
      idOrganization ? { name, idOrganization } : { name },
    );
    return response;
  }

  async getBoard(boardId: string): Promise<APIResponse> {
    const response = await this.get(`/1/boards/${boardId}`);
    return response;
  }

  async updateBoard(boardId: string, updates: Partial<TrelloBoardSchema>): Promise<APIResponse> {
    const response = await this.put(`/1/boards/${boardId}`, updates);
    return response;
  }

  async deleteBoard(boardId: string): Promise<APIResponse> {
    const response = await this.delete(`/1/boards/${boardId}`);
    return response;
  }
}
