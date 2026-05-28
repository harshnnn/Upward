import { Controller, Get, Query, Req } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly svc: SearchService) {}

  @Get()
  async search(@Req() req: any, @Query('q') q?: string) {
    const userId = req.user?.id;
    return this.svc.search(userId, q ?? '');
  }
}

export default SearchController;
