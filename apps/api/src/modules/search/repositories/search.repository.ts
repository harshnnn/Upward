import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(userId: string, q: string) {
    const like = { contains: q, mode: 'insensitive' } as any;
    const [journal, vocab, trackerEntries] = await Promise.all([
      this.prisma.journalEntry.findMany({ where: { userId, OR: [{ title: like }, { content: like }] }, take: 20 }),
      this.prisma.vocabularyWord.findMany({ where: { userId, OR: [{ word: like }, { notes: like }] }, take: 20 }),
      this.prisma.trackerEntry.findMany({ where: { userId, OR: [{ note: like }, { valueJson: { path: [], equals: q } }] }, take: 20 })
    ]);

    return { results: { journal, vocab, trackerEntries } };
  }
}

export default SearchRepository;
