// Requiring module
const express = require('express');
const cors = require('cors');
const { PromptController } = require('./src/controllers/promptController');
const { AuthController } = require('./src/controllers/authController');
const { AppDataSource } = require('./src/config/database');

// Creating express object
const app = express();

// Controllers
const promptController = new PromptController();
const authController = new AuthController();

// Middleware
app.use(cors());
app.use(express.json());

// Veritabanı bağlantı yönetimi
let retryCount = 0;
const maxRetries = 3;

const connectDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Veritabanı bağlantısı başarılı');
        }
        return true;
    } catch (error) {
        console.error('Veritabanı bağlantı hatası:', error);
        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Yeniden deneme ${retryCount}/${maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 saniye bekle
            return connectDatabase();
        }
        return false;
    }
};

// Routes
app.get('/', (req, res) => { 
    res.send('Hello World..') 
}); 

// Prompt routes
app.post('/api/prompt/getPrompt', async (req, res) => {
    if (!AppDataSource.isInitialized) {
        const connected = await connectDatabase();
        if (!connected) {
            return res.status(500).json({ 
                success: false, 
                error: 'Veritabanı bağlantısı kurulamadı' 
            });
        }
    }
    return promptController.getPrompt(req, res);
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
    if (!AppDataSource.isInitialized) {
        const connected = await connectDatabase();
        if (!connected) {
            return res.status(500).json({ 
                success: false, 
                error: 'Veritabanı bağlantısı kurulamadı' 
            });
        }
    }
    return authController.login(req, res);
});

// Port Number
const PORT = process.env.PORT || 5000;

// Server Setup
app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    await connectDatabase();
});