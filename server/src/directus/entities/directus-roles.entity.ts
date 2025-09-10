import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Сущность ролей Directus (только для чтения)
 * Не участвует в миграциях TypeORM
 */
@Entity('directus_roles')
export class DirectusRoles {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  parent: string;
}