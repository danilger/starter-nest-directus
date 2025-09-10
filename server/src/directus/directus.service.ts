import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DirectusAccess } from './entities/directus-access.entity';
import { DirectusPermissions } from './entities/directus-permissions.entity';
import { DirectusPolicies } from './entities/directus-policies.entity';
import { DirectusRoles } from './entities/directus-roles.entity';

@Injectable()
export class DirectusService {
  constructor(
    @InjectRepository(DirectusPolicies)
    private policiesRepository: Repository<DirectusPolicies>,
    @InjectRepository(DirectusRoles)
    private rolesRepository: Repository<DirectusRoles>,
    @InjectRepository(DirectusPermissions)
    private permissionsRepository: Repository<DirectusPermissions>,
    @InjectRepository(DirectusAccess)
    private accessRepository: Repository<DirectusAccess>,
  ) {}

  /**
   * Получить все роли Directus
   */
  async getRoles(): Promise<DirectusRoles[]> {
    return this.rolesRepository.find();
  }

  /**
   * Получить роль по ID
   */
  async getRole(id: string): Promise<DirectusRoles | null> {
    return this.rolesRepository.findOne({ where: { id } });
  }

  /**
   * Найти разрешения по условию
   */
  async findPermissions(
    where:
      | FindOptionsWhere<DirectusPermissions>
      | FindOptionsWhere<DirectusPermissions>[],
    options?: { cache?: { id: string; milliseconds: number } }
  ): Promise<DirectusPermissions[]> {
    return this.permissionsRepository.find({ where, ...options });
  }

  /**
   * Получить все разрешения Directus
   */
  async getPermissions(): Promise<DirectusPermissions[]> {
    return this.permissionsRepository.find();
  }

  /**
   * Получить разрешения по коллекции
   */
  async getPermissionsByCollection(
    collection: string,
  ): Promise<DirectusPermissions[]> {
    return this.permissionsRepository.find({ where: { collection } });
  }

  /**
   * Получить все записи доступа Directus
   */
  async getAccess(): Promise<DirectusAccess[]> {
    return this.accessRepository.find();
  }

  /**
   * Получить доступ по роли
   */
  async getAccessByRole(roleId: string): Promise<DirectusAccess[]> {
    return this.accessRepository.find({ where: { role: roleId } });
  }

  /**
   * Получить доступ по пользователю
   */
  async getAccessByUser(userId: string): Promise<DirectusAccess[]> {
    return this.accessRepository.find({ where: { user: userId } });
  }
  /**
   * Получить все политики Directus
   */
  async getPolicies(): Promise<DirectusPolicies[]> {
    return this.policiesRepository.find();
  }

  /**
   * Найти доступ по условию
   */
  async findAccess(
    where:
      | FindOptionsWhere<DirectusAccess>
      | FindOptionsWhere<DirectusAccess>[],
    options?: { cache?: { id: string; milliseconds: number } }
  ): Promise<DirectusAccess[]> {
    return this.accessRepository.find({ where, ...options });
  }

  /**
   * Получить политику по ID
   */
  async getPolicy(id: string): Promise<DirectusPolicies | null> {
    return this.policiesRepository.findOne({ where: { id } });
  }

  /**
   * Получить политики по имени
   */
  async getPoliciesByName(name: string): Promise<DirectusPolicies[]> {
    return this.policiesRepository.find({ where: { name } });
  }

  /**
   * Получить политики по иконке
   */
  async getPoliciesByIcon(icon: string): Promise<DirectusPolicies[]> {
    return this.policiesRepository.find({ where: { icon } });
  }

  /**
   * Получить политики с IP доступом
   */
  async getPoliciesWithIpAccess(): Promise<DirectusPolicies[]> {
    return this.policiesRepository
      .createQueryBuilder('policy')
      .where('policy.ip_access IS NOT NULL')
      .andWhere('policy.ip_access != :empty', { empty: '' })
      .getMany();
  }
}
