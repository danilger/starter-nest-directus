import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectusService } from './directus.service';
import { DirectusAccess } from './entities/directus-access.entity';
import { DirectusPermissions } from './entities/directus-permissions.entity';
import { DirectusPolicies, } from './entities/directus-policies.entity';
import { DirectusRoles } from './entities/directus-roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DirectusRoles,
      DirectusPermissions,
      DirectusAccess,
      DirectusPolicies,
    ]),
  ],
  providers: [DirectusService],
  exports: [DirectusService],
})
export class DirectusModule {}