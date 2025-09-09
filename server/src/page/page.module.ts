import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from './entities/page.entity';

@Module({
  controllers: [PageController],
  providers: [PageService],
  imports: [TypeOrmModule.forFeature([Page])],
})
export class PageModule {}
