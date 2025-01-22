import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { AppDataSource } from './config/database';
import promptRoutes from './routes/promptRoutes';
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', promptRoutes);
app.use('/api', customerRoutes);

// Veritabanı bağlantısını başlat
AppDataSource.initialize()
    .then(() => {
        console.log('Veritabanı bağlantısı başarılı');
        
        // Sunucuyu başlat
        app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda çalışıyor`);
        });
    })
    .catch((error) => {
        console.log('Veritabanı bağlantı hatası:', error);
        console.log('Uygulama veritabanı olmadan devam ediyor...');
        
        // Hata olsa bile sunucuyu başlat
        app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda çalışıyor`);
        });
    });

// Health check endpoint'i
app.get('/health', (req, res) => {
    res.json({ 
        status: 'up',
        timestamp: new Date(),
        dbStatus: AppDataSource.isInitialized ? 'connected' : 'disconnected'
    });
});