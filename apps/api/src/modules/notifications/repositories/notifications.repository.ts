import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createReminder(data: any) {
    return this.prisma.reminder.create({ data });
  }

  findReminders(userId: string, includeCompleted = false) {
    return this.prisma.reminder.findMany({
      where: { userId, ...(includeCompleted ? {} : { isCompleted: false }) },
      orderBy: { scheduledAt: 'asc' },
      take: 500
    });
  }

  findReminderById(id: string) {
    return this.prisma.reminder.findUnique({ where: { id } });
  }

  updateReminder(id: string, data: any) {
    return this.prisma.reminder.update({ where: { id }, data });
  }

  completeReminder(id: string) {
    return this.prisma.reminder.update({
      where: { id },
      data: { isCompleted: true, completedAt: new Date() }
    });
  }

  deleteReminder(id: string) {
    return this.prisma.reminder.delete({ where: { id } });
  }

  findDueReminders(userId?: string, now: Date = new Date()) {
    return this.prisma.reminder.findMany({
      where: {
        isCompleted: false,
        scheduledAt: { lte: now },
        ...(userId ? { userId } : {})
      },
      orderBy: { scheduledAt: 'asc' },
      take: 200
    });
  }
}

export default NotificationsRepository;
