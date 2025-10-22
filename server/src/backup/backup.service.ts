import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import * as zlib from 'zlib';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly dbContainer = 'postgresDB';
  private readonly dbUser = process.env.DB_USER;
  private readonly dbName = process.env.DB_NAME;
  private readonly backupDir = path.join(__dirname, '../../backups');

  constructor() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM) // Изменено на ежедневно в 2:00 для продакшена
  async handleBackup() {
    const backupFile = `backup-${new Date().toISOString().split('T')[0]}.sql.gz`;
    const backupPath = path.join(this.backupDir, backupFile);
    const tempSqlFile = path.join(this.backupDir, 'temp.sql');

    try {
      this.logger.log('Starting database backup...');
      const execAsync = promisify(exec);
      const gzipAsync = promisify(zlib.gzip);

      // Выполняем pg_dump и сохраняем в промежуточный файл
      const command = `docker exec ${this.dbContainer} pg_dump -U ${this.dbUser} ${this.dbName} > ${tempSqlFile}`;
      await execAsync(command);

      // Читаем SQL-файл и сжимаем его в .gz
      const sqlContent = fs.readFileSync(tempSqlFile);
      const gzipContent = await gzipAsync(sqlContent);
      fs.writeFileSync(backupPath, gzipContent);

      // Удаляем временный файл
      fs.unlinkSync(tempSqlFile);

      this.logger.log(`Backup created: ${backupPath}`);

      // Удаление старых бэкапов (старше 7 дней)
      await this.cleanupOldBackups();
    } catch (error) {
      this.logger.error(`Backup failed: ${error.message}`);
      // Удаляем временный файл, если он остался
      if (fs.existsSync(tempSqlFile)) {
        fs.unlinkSync(tempSqlFile);
      }
    }
  }

  private async cleanupOldBackups() {
    const files = fs.readdirSync(this.backupDir);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const file of files) {
      const filePath = path.join(this.backupDir, file);
      const stats = fs.statSync(filePath);
      if (stats.mtime < sevenDaysAgo) {
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted old backup: ${file}`);
      }
    }
  }
}