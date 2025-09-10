import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Декоратор для указания требуемых разрешений
 *
 * @description
 * Устанавливает метаданные с требуемыми разрешениями для endpoint'а или контроллера.
 * Эти метаданные затем используются в PermissionsGuard для проверки прав доступа.
 * 
 * Поддерживает два режима проверки:
 * - 'or' (по умолчанию): пользователь должен иметь хотя бы одно из разрешений
 * - 'and': пользователь должен иметь все указанные разрешения
 *
 * @param permissions Массив строк с разрешениями в формате "действие коллекция" (например, "read users")
 * @param operator Режим проверки: 'or' или 'and' (по умолчанию 'or')
 *
 * @important Должен использоваться совместно с @UseGuards(UserAuthGuard, PermissionsGuard)
 *
 * @usage
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
export const Permissions = (
  permissions: string[],
  operator: 'and' | 'or' = 'or',
) => SetMetadata(PERMISSIONS_KEY, { permissions, operator });
