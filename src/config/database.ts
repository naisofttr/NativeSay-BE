import typeormConfig from './typeorm.config';

export const AppDataSource = typeormConfig;

export const initializeDatabase = async () => {
    try {
        const connection = await AppDataSource.initialize();
        console.log('Veritabanı bağlantısı başarılı');
        return connection;
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error);
        throw error;
    }
};