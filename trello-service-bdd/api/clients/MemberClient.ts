import { APIRequestContext, APIResponse } from '@playwright/test';

export class MemberClient {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getMyMember(): Promise<APIResponse> {
    const response: APIResponse = await this.request.get('/1/members/me');
    return response;
  }

  async getMember(memberId: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.get(`/1/members/${memberId}`);
    return response;
  }

  async getMemberField(memberId: string, field: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.get(`/1/members/${memberId}/${field}`);
    return response;
  }

  async createBoardStar(memberId: string, boardId: string, pos: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.post(`/1/members/${memberId}/boardStars`, {
      params: { idBoard: boardId, pos: pos },
    });
    return response;
  }

  async getBoardStar(memberId: string, boardStarId: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.get(
      `/1/members/${memberId}/boardStars/${boardStarId}`,
    );
    return response;
  }

  async updateBoardStar(
    memberId: string,
    boardStarId: string,
    newPosition: string,
  ): Promise<APIResponse> {
    const response: APIResponse = await this.request.put(
      `/1/members/${memberId}/boardStars/${boardStarId}`,
      {
        params: { pos: newPosition },
      },
    );
    return response;
  }

  async deleteBoardStar(memberId: string, boardStarId: string): Promise<APIResponse> {
    const response: APIResponse = await this.request.delete(
      `/1/members/${memberId}/boardStars/${boardStarId}`,
    );
    return response;
  }
}
