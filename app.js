// Requiring module
const express = require('express');
const cors = require('cors');

// Creating express object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => { 
    res.send('Hello World..') 
}); 

// Prompt routes
app.post('/api/prompt/getPrompt', (req, res) => {
    try {
        // Prompt işlemleri burada yapılacak
        res.json({ message: 'Prompt endpoint çalışıyor' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
    try {
        // Login işlemleri burada yapılacak
        res.json({ message: 'Login endpoint çalışıyor' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Port Number
const PORT = process.env.PORT || 5000;

// Server Setup
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});