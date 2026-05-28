import { Injectable, NotFoundException } from '@nestjs/common';
import { JournalRepository } from '../repositories/journal.repository';

@Injectable()
export class JournalService {
  constructor(private readonly repo: JournalRepository) {}

  async createEntry(userId: string, payload: any) {
    const data: any = {
      userId,
      timestamp: new Date(payload.timestamp),
      title: payload.title ?? null,
      content: payload.content,
      moodId: payload.moodId ?? null,
      categoryId: payload.categoryId ?? null,
      isPrivate: typeof payload.isPrivate === 'boolean' ? payload.isPrivate : true,
      metadata: payload.metadata ?? null
    };

    const entry = await this.repo.createEntry({ data } as any);

    // attach tags if provided
    if (payload.tags && Array.isArray(payload.tags) && payload.tags.length > 0) {
      for (const t of payload.tags) {
        // create tag if id looks like new (client may send names)
        if (t && typeof t === 'string') {
          const tag = await this.repo.createTag({ userId, name: t } as any).catch(() => null);
          if (tag) {
            await this.repo.createEntryTag?.({ entryId: entry.id, tagId: tag.id } as any).catch(() => null);
          }
        }
      }
    }

    // TODO: enqueue background job for sentiment analysis and summary aggregation

    return entry;
  }

  async listEntries(userId: string, cursor?: string, take = 20) {
    const cursorDate = cursor ? new Date(cursor) : undefined;
    return this.repo.findEntries(userId, cursorDate, take);
  }

  async getEntry(userId: string, id: string) {
    const entry = await this.repo.findEntryById(id);
    if (!entry || entry.userId !== userId) throw new NotFoundException('Entry not found');
    return entry;
  }

  async updateEntry(userId: string, id: string, payload: any) {
    const existing = await this.repo.findEntryById(id);
    if (!existing || existing.userId !== userId) throw new NotFoundException('Entry not found');
    return this.repo.updateEntry(id, payload as any);
  }

  async deleteEntry(userId: string, id: string) {
    const existing = await this.repo.findEntryById(id);
    if (!existing || existing.userId !== userId) throw new NotFoundException('Entry not found');
    return this.repo.softDeleteEntry(id);
  }

  async createTag(userId: string, name: string) {
    return this.repo.createTag({ userId, name } as any);
  }

  async listTags(userId: string) {
    return this.repo.listTags(userId);
  }

  async createCategory(userId: string, payload: any) {
    return this.repo.createCategory({ userId, ...payload } as any);
  }

  async listCategories(userId: string) {
    return this.repo.listCategories(userId);
  }

  async createMood(userId: string, payload: any) {
    return this.repo.createMood({ userId, ...payload } as any);
  }

  async searchEntries(userId: string, q: string) {
    return this.repo.searchEntries(userId, q);
  }

  async upsertSummary(userId: string, date: string, metrics: any) {
    return this.repo.upsertJournalSummary(userId, new Date(date), metrics);
  }
}

export default JournalService;
