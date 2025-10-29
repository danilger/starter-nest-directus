import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PageModule } from './page/page.module';
import { DirectusModule } from './directus/directus.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupService } from './backup/backup.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      // Всегда используем .env из корня проекта
      envFilePath: '../.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host:
          configService.get('NODE_ENV') === 'development'  // dev режим переключается на localhost в .env
            ? configService.get('DB_HOST_DEV')
            : configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Отключите в продакшене
      }),
      inject: [ConfigService],
    }),
    PageModule,
    DirectusModule,
  ],
  controllers: [AppController],
  providers: [AppService, BackupService],
})
export class AppModule {}
