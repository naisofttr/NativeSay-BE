import { DataSource } from 'typeorm';
import { Customer } from '../models/customer';
import { join } from 'path';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT || '10079'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [join(__dirname, '..', 'models', '*.{ts,js}')],
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Veritabanı bağlantısı başarılı');
        return true;
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error);
        return false;
    }
};