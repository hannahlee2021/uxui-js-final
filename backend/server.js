require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check for both API keys
if (!process.env.OPENAI_API_KEY || !process.env.GOOGLE_API_KEY) {
    console.error('Missing required API keys');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Endpoint for OpenAI API key
app.get('/api-key', (req, res) => {
    if (process.env.OPENAI_API_KEY) {
        res.json({ apiKey: process.env.OPENAI_API_KEY });
    } else {
        res.status(500).json({ error: 'OpenAI API key not found' });
    }
});

// Endpoint for Gemini image analysis
app.post('/analyze-image', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const { prompt, imageData } = req.body;
        
        if (!imageData) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        console.log("Processing image request with prompt:", prompt);
        
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageData,
                    mimeType: "image/jpeg"
                }
            }
        ]);
        
        const response = await result.response;
        res.json({ text: response.text() });
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('OpenAI API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');
    console.log('Google API Key loaded:', process.env.GOOGLE_API_KEY ? 'Yes' : 'No');
});