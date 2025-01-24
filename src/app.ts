import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PromptController } from './controllers/promptController';
import { AuthController } from './controllers/authController';
import { CustomerController } from './controllers/customerController';
import { initializeDatabase } from './config/database';

// Creating express app
const app = express();

// Controllers
const promptController = new PromptController();
const authController = new AuthController();
const customerController = new CustomerController();

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

// Auth routes
app.post('/api/auth/login', (req: Request, res: Response) => authController.login(req, res));

// Prompt routes
app.post('/api/prompt/getPrompt', (req: Request, res: Response) => promptController.getPrompt(req, res));
app.post('/api/prompt/deletePromptByServicePromptResponse', (req: Request, res: Response) => promptController.deletePromptByServicePromptResponse(req, res));

// Customer routes
app.put('/api/customers/:id', (req: Request, res: Response) => customerController.updateCustomer(req, res));

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