import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Сущность доступа Directus (только для чтения)
 * Не участвует в миграциях TypeORM
 */
@Entity('directus_access')
export class DirectusAccess {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  role: string;

  @Column({ type: 'uuid', nullable: true })
  user: string;

  @Column({ type: 'uuid', nullable: true })
  policy: string;

  @Column({ type: 'int', nullable: true })
  sort: number;
}