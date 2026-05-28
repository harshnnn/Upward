import { Module } from '@nestjs/common';
import { SearchService } from './services/search.service';
import { SearchRepository } from './repositories/search.repository';

@Module({
  providers: [SearchService, SearchRepository],
  exports: [SearchService]
})
export class SearchModule {}

export default SearchModule;
