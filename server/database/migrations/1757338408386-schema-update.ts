import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1757338408386 implements MigrationInterface {
    name = 'SchemaUpdate1757338408386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "updatedAt" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

}
