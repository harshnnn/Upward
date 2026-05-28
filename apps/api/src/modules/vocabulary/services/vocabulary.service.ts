import { Injectable, NotFoundException } from '@nestjs/common';
import { VocabularyRepository } from '../repositories/vocabulary.repository';
import { JobsService } from '../../jobs/jobs.service';

@Injectable()
export class VocabularyService {
  constructor(private readonly repo: VocabularyRepository, private readonly jobs: JobsService) {}

  async createWord(userId: string, payload: any) {
    const normalized = payload.word.trim().toLowerCase();
    const data = { userId, word: payload.word.trim(), normalized, language: payload.language ?? 'en', difficulty: payload.difficulty ?? null, pronunciation: payload.pronunciation ?? null, isFavorite: payload.isFavorite ?? false, notes: payload.notes ?? null, categoryId: payload.categoryId ?? null, metadata: payload.metadata ?? {} };
    const w = await this.repo.createWord(data as any);

    try { this.jobs.queue('vocab.wordCreated', { userId, wordId: w.id }); } catch (e) {}

    return w;
  }

  async listWords(userId: string, q?: string, lang?: string, category?: string) {
    return this.repo.findWords(userId, q, lang, category);
  }

  async getWord(userId: string, id: string) {
    const w = await this.repo.findWordById(id);
    if (!w || w.userId !== userId) throw new NotFoundException('Word not found');
    return w;
  }

  async updateWord(userId: string, id: string, payload: any) {
    const existing = await this.repo.findWordById(id);
    if (!existing) throw new NotFoundException('Word not found');
    if (existing.userId !== userId) throw new NotFoundException('Not authorized');
    const data = { ...payload };
    if (payload.word) data.normalized = payload.word.trim().toLowerCase();
    return this.repo.updateWord(id, data as any);
  }

  async deleteWord(userId: string, id: string) {
    const existing = await this.repo.findWordById(id);
    if (!existing || existing.userId !== userId) throw new NotFoundException('Word not found');
    return this.repo.deleteWord(id);
  }

  async addMeaning(userId: string, wordId: string, payload: any) {
    const w = await this.repo.findWordById(wordId);
    if (!w || w.userId !== userId) throw new NotFoundException('Word not found');
    const m = await this.repo.addMeaning({ wordId, userId, definition: payload.definition, partOfSpeech: payload.partOfSpeech ?? null, examples: payload.examples ?? null, source: payload.source ?? null } as any);
    try { this.jobs.queue('vocab.meaningAdded', { userId, wordId }); } catch (e) {}
    return m;
  }

  async addSentence(userId: string, wordId: string, payload: any) {
    const w = await this.repo.findWordById(wordId);
    if (!w || w.userId !== userId) throw new NotFoundException('Word not found');
    const s = await this.repo.addSentence({ wordId, userId, text: payload.text, isExample: payload.isExample ?? true } as any);
    try { this.jobs.queue('vocab.sentenceAdded', { userId, wordId }); } catch (e) {}
    return s;
  }

  async scheduleRevision(userId: string, payload: any) {
    const r = await this.repo.scheduleRevision({ userId, wordId: payload.wordId, scheduledAt: new Date(payload.scheduledAt), metadata: payload.metadata ?? {} } as any);
    try { this.jobs.queue('vocab.revisionScheduled', { userId, revisionId: r.id }); } catch (e) {}
    return r;
  }

  async listRevisions(userId: string, from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.repo.findRevisions(userId, fromDate, toDate);
  }

  async recordReviewEvent(userId: string, payload: any) {
    const ev = await this.repo.recordReviewEvent({ userId, wordId: payload.wordId, eventType: payload.eventType, metadata: payload.metadata ?? {} } as any);
    // queue analytics rollup
    try { this.jobs.queue('vocab.reviewRecorded', { userId, wordId: payload.wordId, eventId: ev.id }); } catch (e) {}
    return ev;
  }

  async getSummaries(userId: string, from?: string, to?: string) {
    // basic: return daily summaries from repo via Prisma directly for now
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    // TODO: use repository method for summaries; for now query Prisma through repo
    return this.repo.findRevisions(userId, fromDate, toDate);
  }
}

export default VocabularyService;
