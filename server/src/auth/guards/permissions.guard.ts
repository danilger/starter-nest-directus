import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DirectusService } from 'src/directus/directus.service';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { FindOptionsWhere, In } from 'typeorm';
import { DirectusPermissions } from 'src/directus/entities/directus-permissions.entity';

/**
 * Гвард для проверки разрешений пользователя на основе системы Directus
 *
 * Проверяет доступ пользователя к определенным действиям (read, create, update, delete)
 * на основе его роли и связанных политик через таблицу access.
 *
 * Алгоритм работы:
 * 1. Получает требуемые разрешения из декоратора @Permissions()
 * 2. Находит доступы пользователя по user_id и role_id
 * 3. Ищет разрешения, которые соответствуют требуемым действиям и коллекциям
 * 4. Возвращает результат в зависимости от оператора ('or' или 'and')
 *
 * Режимы проверки:
 * - 'or': пользователь должен иметь хотя бы одно из разрешений
 * - 'and': пользователь должен иметь все указанные разрешения
 *
 * Кэширование:
 * - Запросы к таблицам access и permissions кэшируются на 30 секунд
 * - Кэш хранится в оперативной памяти приложения
 *
 * @important Должен использоваться совместно с декоратором @Permissions()
 * @requires UserAuthGuard для получения информации о пользователе
 *
 * @example
 * ```typescript
 * @Controller('users')
 * @UseGuards(UserAuthGuard, PermissionsGuard)
 * export class UsersController {
 *   @Get()
 *   @Permissions(['read users'])
 *   findAll() { ... }
 *
 *   @Post()
 *   @Permissions(['create users'], 'and')
 *   create() { ... }
 *
 *   @Put()
 *   @Permissions(['read users', 'update users'], 'and')
 *   update() { ... }
 * }
 * ```
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private directusService: DirectusService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;


    if (!user?.id ) {
      return false;
    }

    const permissionsRawArray = this.reflector.getAllAndOverride<{
      permissions: string[];
      operator: 'and' | 'or';
    }>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    const requiredPermissions = permissionsRawArray.permissions
      .map((item) => item.split(' '))
      .map(([action, collection]) => ({ action, collection }));

    const userId = user.id;
    const userRoleId = user.role;


    const access = await this.directusService.findAccess(
      [{ user: userId }, { role: userRoleId }],
      {
        cache: {
          id: 'directus_access',
          milliseconds: 30000,
        },
      },
    );

    let where: FindOptionsWhere<DirectusPermissions>[] = [];
    where = requiredPermissions.map((permission) => ({
      policy: In(access.map((item) => item.policy)),
      ...permission,
    }));

    
    const permissions = await this.directusService.findPermissions(where, {
      cache: {
        id: 'directus_permissions',
        milliseconds: 30000,
      },
    });

    console.log(permissions)

    if (permissionsRawArray.operator === 'or') {
      return permissions.length > 0;
    }

    if (permissionsRawArray.operator === 'and') {
      return requiredPermissions.every(required => 
        permissions.some(permission => 
          permission.action === required.action && 
          permission.collection === required.collection
        )
      );
    }

    return false; 
  }
}
