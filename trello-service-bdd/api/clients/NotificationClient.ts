import { APIResponse } from '@playwright/test';
import { BaseClient } from './BaseClient';

export class NotificationClient extends BaseClient {
  async updateNotificationReadStatus(id: string, unread: boolean): Promise<APIResponse> {
    return await this.put(`1/notifications/${id}`, { unread });
  }

  async markAllNotificationsAsRead(): Promise<APIResponse> {
    return await this.post('1/notifications/all/read');
  }

  async getMyNotifications(): Promise<APIResponse> {
    return await this.get('1/members/me/notifications');
  }
}
