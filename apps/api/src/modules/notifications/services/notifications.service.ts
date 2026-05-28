import { Injectable, NotFoundException } from '@nestjs/common';

import { JobsService } from '../../jobs/jobs.service';
import { NotificationsRepository } from '../repositories/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly repo: NotificationsRepository, private readonly jobs: JobsService) {}

  async createReminder(userId: string, payload: any) {
    const reminder = await this.repo.createReminder({
      userId,
      title: payload.title,
      body: payload.body ?? null,
      scheduledAt: new Date(payload.scheduledAt),
      timezone: payload.timezone ?? null,
      channel: payload.channel ?? 'local',
      metadata: payload.metadata ?? {},
      isCompleted: false
    });

    try {
      this.jobs.queue('notifications.reminderCreated', {
        userId,
        reminderId: reminder.id,
        scheduledAt: reminder.scheduledAt.toISOString()
      });
    } catch {
      // best effort
    }

    return reminder;
  }

  listReminders(userId: string, includeCompleted = false) {
    return this.repo.findReminders(userId, includeCompleted);
  }

  async getReminder(userId: string, id: string) {
    const reminder = await this.repo.findReminderById(id);
    if (!reminder || reminder.userId !== userId) {
      throw new NotFoundException('Reminder not found');
    }
    return reminder;
  }

  async updateReminder(userId: string, id: string, payload: any) {
    const reminder = await this.getReminder(userId, id);
    return this.repo.updateReminder(reminder.id, {
      title: payload.title ?? reminder.title,
      body: payload.body ?? reminder.body,
      scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : reminder.scheduledAt,
      timezone: payload.timezone ?? reminder.timezone,
      channel: payload.channel ?? reminder.channel,
      metadata: payload.metadata ?? reminder.metadata
    });
  }

  async completeReminder(userId: string, id: string) {
    const reminder = await this.getReminder(userId, id);
    return this.repo.completeReminder(reminder.id);
  }

  async deleteReminder(userId: string, id: string) {
    const reminder = await this.getReminder(userId, id);
    return this.repo.deleteReminder(reminder.id);
  }

  findDueReminders(userId?: string, now?: Date) {
    return this.repo.findDueReminders(userId, now);
  }
}

export default NotificationsService;
