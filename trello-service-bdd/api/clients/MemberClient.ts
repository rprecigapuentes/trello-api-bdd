import { APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';

export class MemberClient extends BaseClient {
  async getMyMember(): Promise<APIResponse> {
    const response: APIResponse = await this.get('/1/members/me');
    return response;
  }

  async getMember(memberId: string): Promise<APIResponse> {
    const response: APIResponse = await this.get(`/1/members/${memberId}`);
    return response;
  }

  async getMemberField(memberId: string, field: string): Promise<APIResponse> {
    const response: APIResponse = await this.get(`/1/members/${memberId}/${field}`);
    return response;
  }

  async createBoardStar(memberId: string, boardId: string, position: string): Promise<APIResponse> {
    const response: APIResponse = await this.post(`/1/members/${memberId}/boardStars`, {
      idBoard: boardId,
      pos: position,
    });
    return response;
  }

  async getBoardStar(memberId: string, boardStarId: string): Promise<APIResponse> {
    const response: APIResponse = await this.get(
      `/1/members/${memberId}/boardStars/${boardStarId}`,
    );
    return response;
  }

  async updateBoardStar(
    memberId: string,
    boardStarId: string,
    newPosition: string,
  ): Promise<APIResponse> {
    const response: APIResponse = await this.put(
      `/1/members/${memberId}/boardStars/${boardStarId}`,
      { pos: newPosition },
    );
    return response;
  }

  async deleteBoardStar(memberId: string, boardStarId: string): Promise<APIResponse> {
    const response: APIResponse = await this.delete(
      `/1/members/${memberId}/boardStars/${boardStarId}`,
    );
    return response;
  }
}
