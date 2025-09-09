import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from "typeorm";

/**
 * Сущность страницы
 */
@Entity('pages')
export class Page {

  /**
   * Уникальный идентификатор страницы
   */
  @ApiProperty({
    description: `Уникальный идентификатор страницы`,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Заголовок страницы
   */
  @ApiProperty({
    description: `Заголовок страницы`,
    type: String,
  })
  @Column({ type: 'varchar' })
  title: string;

  /**
   * Содержимое страницы
   */
  @ApiProperty({
    description: `Содержимое страницы`,
    type: String,
  })
  @Column({ type: 'text' })
  content: string;

  /**
   * Дата создания страницы
   */
  @ApiProperty({
    description: `Дата создания страницы`,
    type: Date,
  })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Дата последнего обновления страницы
   */
  @ApiProperty({
    description: `Дата последнего обновления страницы`,
    type: Date,
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
