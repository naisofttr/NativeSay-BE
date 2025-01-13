import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

class DatabaseConnection {
    private static instance: DataSource;
    private static entities: any[] = [];

    static async initialize() {
        if (!this.instance) {
            this.instance = new DataSource({
                type: 'mssql',
                host: 'mssql-189621-0.cloudclusters.net,10079',
                port: 1433,
                database: 'TurkcesiNe',
                username: 'brewcloud',
                password: '123654Bc!',
                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                    enableArithAbort: true,
                    instanceName: 'SQLEXPRESS'
                },
                synchronize: false,
                logging: true,
                entities: this.entities,
                migrations: ['src/migrations/*.ts'],
                migrationsTableName: "migrations_history",
                extra: {
                    trustServerCertificate: true,
                    validateConnection: false,
                    connectionTimeout: 30000
                },
                requestTimeout: 30000
            });

            await this.instance.initialize();
        }
        return this.instance;
    }

    static addEntity(entity: EntityTarget<ObjectLiteral>) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
    }

    static getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
        if (!this.instance || !this.instance.isInitialized) {
            throw new Error('Database connection not initialized');
        }
        this.addEntity(entity);
        return this.instance.getRepository(entity);
    }

    static isConnected(): boolean {
        return this.instance?.isInitialized ?? false;
    }
}

export const AppDataSource = DatabaseConnection;