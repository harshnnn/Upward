import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class VocabularyRepository {
  constructor(private readonly prisma: PrismaService) {}

  createWord(data: any) {
    return this.prisma.vocabularyWord.create({ data });
  }

  findWords(userId: string, q?: string, lang?: string, category?: string) {
    const where: any = { userId };
    if (lang) where.language = lang;
    if (category) where.categoryId = category;
    if (q) where.OR = [{ word: { contains: q, mode: 'insensitive' } }, { normalized: { contains: q, mode: 'insensitive' } }];
    return this.prisma.vocabularyWord.findMany({ where, orderBy: { createdAt: 'desc' }, take: 500 });
  }

  findWordById(id: string) {
    return this.prisma.vocabularyWord.findUnique({ where: { id }, include: { meanings: true, sentences: true, tags: { include: { tag: true } } } });
  }

  updateWord(id: string, data: any) {
    return this.prisma.vocabularyWord.update({ where: { id }, data });
  }

  deleteWord(id: string) {
    return this.prisma.vocabularyWord.delete({ where: { id } });
  }

  addMeaning(data: any) {
    return this.prisma.meaning.create({ data });
  }

  addSentence(data: any) {
    return this.prisma.sentence.create({ data });
  }

  scheduleRevision(data: any) {
    return this.prisma.revision.create({ data });
  }

  findRevisions(userId: string, from?: Date, to?: Date) {
    const where: any = { userId };
    if (from || to) {
      where.scheduledAt = {};
      if (from) where.scheduledAt.gte = from;
      if (to) where.scheduledAt.lte = to;
    }
    return this.prisma.revision.findMany({ where, orderBy: { scheduledAt: 'asc' }, take: 1000 });
  }

  recordReviewEvent(data: any) {
    return this.prisma.reviewEvent.create({ data });
  }

  upsertVocabularySummary(userId: string, date: Date, metrics: any) {
    return this.prisma.vocabularySummary.upsert({ where: { userId_date: { userId, date } } as any, create: { userId, date, metrics }, update: { metrics } });
  }
}

export default VocabularyRepository;
