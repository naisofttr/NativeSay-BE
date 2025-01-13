import { DataSource } from 'typeorm';
import { join } from 'path';
import 'dotenv/config';

export default new DataSource({
    type: 'mssql',
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT || '10079'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [join(__dirname, '..', 'models', '*.{ts,js}')],
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    options: {
        encrypt: true,
        trustServerCertificate: true
    },
    synchronize: false,
    extra: {
        validateConnection: false,
        trustServerCertificate: true
    }
}); 