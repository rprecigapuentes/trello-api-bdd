import { APIRequestContext, APIResponse } from '@playwright/test';

export class NotificationClient {
  constructor(private request: APIRequestContext) {}

  async updateNotificationReadStatus(id: string, unread: boolean): Promise<APIResponse> {
    return await this.request.put(`1/notifications/${id}`, {
      params: { unread },
    });
  }

  async markAllNotificationsAsRead(): Promise<APIResponse> {
    return await this.request.post('1/notifications/all/read');
  }

  async getMyNotifications(): Promise<APIResponse> {
    return await this.request.get('1/members/me/notifications');
  }
}
