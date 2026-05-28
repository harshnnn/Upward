import { Injectable } from '@nestjs/common';
import { SearchRepository } from '../repositories/search.repository';

@Injectable()
export class SearchService {
  constructor(private readonly repo: SearchRepository) {}

  async search(userId: string, q: string) {
    if (!q || q.trim().length === 0) return { results: [] };
    return this.repo.search(userId, q.trim());
  }
}

export default SearchService;
