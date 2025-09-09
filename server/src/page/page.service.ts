import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Page } from './entities/page.entity';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page) private pageRepository: Repository<Page>,
  ) {}

  async create(createPageDto: CreatePageDto): Promise<Page | null> {
    return this.pageRepository.save(createPageDto) || {};
  }

  async findAll() {
    return this.pageRepository.find();
  }
  
  async findOne(id: number): Promise<Page | null> {
    return this.pageRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePageDto: UpdatePageDto): Promise<Page | null> {
    await this.pageRepository.update(id, updatePageDto);
    return this.pageRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<DeleteResult> {
  return await this.pageRepository.delete(id);
  }
}
