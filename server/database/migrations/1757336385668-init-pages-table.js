"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitPagesTable1757336385668 = void 0;
class InitPagesTable1757336385668 {
    name = 'InitPagesTable1757336385668';
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "pages"`);
    }
}
exports.InitPagesTable1757336385668 = InitPagesTable1757336385668;
//# sourceMappingURL=1757336385668-init-pages-table.js.map