import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PageService } from './page.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import { DeleteResult } from 'typeorm';
import { ApiResponse } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/guards/user_auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';

@UseGuards(UserAuthGuard, PermissionsGuard)
@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  /**
   * Создает новую страницу
   * @param createPageDto - Данные для создания страницы
   * @returns Созданная страница или null
   */
  @ApiResponse({
    status: 200,
    description: 'Созданная страница',
    type: Page,
  })
  @Permissions(['create pages'], 'and')
  @Post()
  create(@Body() createPageDto: CreatePageDto): Promise<Page | null> {
    return this.pageService.create(createPageDto);
  }

  /**
   * Получает все страницы
   * @returns {Promise<Page[]|null>} Массив всех страниц или null
   */
  @ApiResponse({
    status: 200,
    description: 'Массив всех страниц',
    type: [Page],
  })
  @Permissions(['read pages'], 'and')
  @Get()
  findAll(): Promise<Page[] | null> {
    return this.pageService.findAll();
  }

  /**
   * Получает страницу по ID
   * @param id - Идентификатор страницы
   * @returns Страница с указанным ID или null
   */
  @ApiResponse({
    status: 200,
    description: 'Страница с указанным ID',
    type: Page,
  })
  @Get(':id')
  @Permissions(['read pages'], 'and')
  findOne(@Param('id') id: string): Promise<Page | null> {
    return this.pageService.findOne(+id);
  }

  /**
   * Обновляет страницу по ID
   * @param id - Идентификатор страницы
   * @param updatePageDto - Данные для обновления страницы
   */
  @ApiResponse({
    status: 200,
    description: 'Обновленная страница',
    type: Page,
  })
  @Patch(':id')
  @Permissions(['update pages'], 'and')
  update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
  ): Promise<Page | null> {
    return this.pageService.update(+id, updatePageDto);
  }

  /**
   * Удаляет страницу по ID
   * @param id - Идентификатор страницы
   * @returns Результат операции удаления
   */
  @ApiResponse({
    status: 200,
    description: 'Результат операции удаления',
    schema: {
      type: 'object',
      properties: {
        affected: { 
          type: 'number',
          description: 'Количество удаленных записей',
          nullable: true
        },
        raw: { 
          type: 'object',
          description: 'Сырой результат SQL запроса'
        },
      },
    },
  })
  @Permissions(['delete pages'], 'and')
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.pageService.remove(+id);
  }
}
