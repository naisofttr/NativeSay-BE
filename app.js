// Requiring module
const express = require('express');
const cors = require('cors');
const { PromptController } = require('./src/controllers/promptController');
const { AuthController } = require('./src/controllers/authController');

// Creating express object
const app = express();

// Controllers
const promptController = new PromptController();
const authController = new AuthController();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => { 
    res.send('Hello World..') 
}); 

// Prompt routes
app.post('/api/prompt/getPrompt', (req, res) => promptController.getPrompt(req, res));

// Auth routes
app.post('/api/auth/login', (req, res) => authController.login(req, res));

// Port Number
const PORT = process.env.PORT || 5000;

// Server Setup
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});