import { DataSource } from 'typeorm';
import { join } from 'path';
import 'dotenv/config';

export default new DataSource({
    // MSSQL Configuration
    // type: 'mssql',
    // host: process.env.DB_SERVER,
    // port: parseInt(process.env.DB_PORT || '10079'),
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_DATABASE,
    // options: {
    //     encrypt: true,
    //     trustServerCertificate: true
    // },
    // extra: {
    //     validateConnection: false,
    //     trustServerCertificate: true
    // },

    // PostgreSQL Configuration
    type: 'postgres',
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false
        },
        poolSize: 20,
        connectionTimeoutMillis: 30000,
    },

    // Common Configuration
    entities: [join(__dirname, '..', 'models', '*.{ts,js}')],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    synchronize: false,
    logging: true, // Geçici olarak loglamayı açıyoruz
    connectTimeoutMS: 30000
});