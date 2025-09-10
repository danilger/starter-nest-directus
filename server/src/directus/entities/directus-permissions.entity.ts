import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Сущность разрешений Directus (только для чтения)
 * Не участвует в миграциях TypeORM
 */
@Entity('directus_permissions')
export class DirectusPermissions {
  @PrimaryColumn('int')
  id: number;

  @Column({ type: 'varchar', length: 64 })
  collection: string;

  @Column({ type: 'varchar', length: 10 })
  action: string;

  @Column({ type: 'json', nullable: true })
  permissions: any;

  @Column({ type: 'json', nullable: true })
  validation: any;

  @Column({ type: 'json', nullable: true })
  presets: any;

  @Column({ type: 'text', nullable: true })
  fields: string;

  @Column({ type: 'uuid', nullable: true })
  policy: string;
}