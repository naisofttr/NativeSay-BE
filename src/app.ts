import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { AppDataSource } from './config/database';
import customerRoutes from './routes/customerRoutes';
import promptRoutes from './routes/promptRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', customerRoutes);
app.use('/api', promptRoutes);
// Veritabanı bağlantısını dene ama hata olursa da uygulamayı başlat
AppDataSource.initialize()
    .then(() => {
        console.log('Veritabanı bağlantısı başarılı');
    })
    .catch((error) => {
        console.log('Veritabanı bağlantı hatası:', error);
        console.log('Uygulama veritabanı olmadan devam ediyor...');
    })
    .finally(() => {
        // Veritabanı bağlantısı başarılı olsun veya olmasın sunucuyu başlat
        app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda çalışıyor`);
        });
    });

// Basit bir health check endpoint'i
app.get('/health', (req, res) => {
    res.json({ 
        status: 'up',
        timestamp: new Date(),
        dbStatus: AppDataSource.isInitialized ? 'connected' : 'disconnected'
    });
}); 