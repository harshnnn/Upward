import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class JournalRepository {
  constructor(private readonly prisma: PrismaService) {}

  createEntry(data: any) {
    return this.prisma.journalEntry.create({ data });
  }

  findEntries(userId: string, cursor?: Date, take = 20) {
    const where: any = { userId, isDeleted: false };
    const orderBy = { timestamp: 'desc' as const };

    if (cursor) {
      return this.prisma.journalEntry.findMany({ where, take, skip: 1, cursor: { timestamp: cursor }, orderBy });
    }

    return this.prisma.journalEntry.findMany({ where, take, orderBy });
  }

  findEntryById(id: string) {
    return this.prisma.journalEntry.findUnique({ where: { id }, include: { tags: { include: { tag: true } }, reflection: true, mood: true, category: true } });
  }

  updateEntry(id: string, data: any) {
    return this.prisma.journalEntry.update({ where: { id }, data });
  }

  softDeleteEntry(id: string) {
    return this.prisma.journalEntry.update({ where: { id }, data: { isDeleted: true } });
  }

  createTag(data: any) {
    return this.prisma.tag.create({ data });
  }

  createEntryTag(data: any) {
    return this.prisma.entryTag.create({ data });
  }

  listTags(userId: string) {
    return this.prisma.tag.findMany({ where: { userId }, orderBy: { name: 'asc' } });
  }

  createCategory(data: any) {
    return this.prisma.journalCategory.create({ data });
  }

  listCategories(userId: string) {
    return this.prisma.journalCategory.findMany({ where: { userId }, orderBy: { name: 'asc' } });
  }

  createMood(data: any) {
    return this.prisma.mood.create({ data });
  }

  searchEntries(userId: string, q: string, take = 50) {
    // Simple search for now: content contains (case-insensitive)
    return this.prisma.journalEntry.findMany({ where: { userId, content: { contains: q, mode: 'insensitive' } }, take, orderBy: { timestamp: 'desc' } });
  }

  upsertJournalSummary(userId: string, date: Date, metrics: any) {
    return this.prisma.journalSummary.upsert({ where: { userId_date: { userId, date } } as any, create: { userId, date, metrics }, update: { metrics } });
  }
}

export default JournalRepository;
