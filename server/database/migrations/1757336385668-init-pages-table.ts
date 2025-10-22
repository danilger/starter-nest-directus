import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Базовая миграция - создание таблицы pages с автоматическими timestamp'ами
 */
export class InitPagesTable1757336385668 implements MigrationInterface {
    name = 'InitPagesTable1757336385668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаем таблицу pages с DEFAULT now() для timestamp полей
        await queryRunner.query(`
            CREATE TABLE "pages" (
                "id" SERIAL NOT NULL, 
                "title" character varying NOT NULL, 
                "content" text NOT NULL, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pages"`);
    }

}

