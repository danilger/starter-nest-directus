"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const path_1 = require("path");
dotenv.config();
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    dropSchema: false,
    logging: true,
    logger: 'advanced-console',
    entities: [
        (0, path_1.join)(__dirname, '..', 'src', 'page', '**', '*.entity.{ts,js}'),
    ],
    migrations: [(0, path_1.join)(__dirname, '..', 'database', 'migrations', '**', '*.{ts,js}')],
    subscribers: [(0, path_1.join)(__dirname, '..', 'subscriber', '**', '*.{ts,js}')],
    migrationsTableName: 'migrations',
    migrationsRun: true
});
//# sourceMappingURL=data-source.js.map