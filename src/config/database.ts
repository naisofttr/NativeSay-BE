import { DataSource } from 'typeorm';
import { Customer } from '../models/customer';

export const AppDataSource = new DataSource({
    type: 'mssql',
    host: 'localhost',
    port: 1433,
    database: 'TurkcesiNe',
    username: 'sa',
    password: '123456tA*',
    options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: 'SQLEXPRESS'
    },
    synchronize: true,
    logging: true,
    entities: [Customer],
    extra: {
        trustServerCertificate: true,
        validateConnection: false,
        connectionTimeout: 60000
    },
    requestTimeout: 60000
});