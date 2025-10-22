import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';
import { DirectusModule } from 'src/directus/directus.module';

@Module({
  controllers: [PageController],
  providers: [PageService],
  imports: [
    TypeOrmModule.forFeature([Page]),
    DirectusModule,
  ],
})
export class PageModule {}
