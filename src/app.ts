import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import promptRoutes from './routes/promptRoutes';
import customerRoutes from './routes/customerRoutes';
import authRoutes from './routes/authRoutes';
import { initializeDatabase } from './config/database';

// Creating express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initializeDatabase()
    .then(() => {
        console.log('Firebase bağlantısı başarılı');
    })
    .catch((error) => {
        console.error('Firebase başlatma hatası:', error);
        console.log('Uygulama hata ile devam ediyor...');
    });

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'NativeSay API is running!' });
});

// Use route modules
app.use('/api', authRoutes);
app.use('/api', promptRoutes);
app.use('/api', customerRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Bir şeyler ters gitti!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});