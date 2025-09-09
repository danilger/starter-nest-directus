import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Загрузка переменных окружения из .env-файла
dotenv.config();

/**Экспорт конфигурации подключения к PostgreSQL для миграций TypeORM */
export default new DataSource({
  type: 'postgres', // Тип СУБД
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Отключение автоматической синхронизации схемы
  dropSchema: false, // Запрет на удаление схемы при запуске
  logging: true, // Включение логгирования запросов
  logger: 'advanced-console', // Тип логгера (если включено)
  entities: [join(__dirname, '..', 'src', '**', '*.entity.{ts,js}')], // Пути к сущностям
  migrations: [join(__dirname, '..', 'database', 'migrations', '**', '*.{ts,js}')], // Пути к миграциям
  subscribers: [join(__dirname, '..', 'subscriber', '**', '*.{ts,js}')], // Пути к подписчикам событий
  migrationsTableName: 'migrations', // Название таблицы для хранения миграций
  migrationsRun: true
});
