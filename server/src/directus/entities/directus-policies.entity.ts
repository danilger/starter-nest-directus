import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Сущность политик Directus (только для чтения)
 * Не участвует в миграциях TypeORM
 */
@Entity('directus_policies')
export class DirectusPolicies {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 64, default: 'badge' })
  icon: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  ip_access: string;
}