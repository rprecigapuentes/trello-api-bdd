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
}
