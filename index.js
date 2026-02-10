require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getFibonacci, isPrime, getLCM, getHCF } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;
const EMAIL = process.env.EMAIL || "user@chitkara.edu.in";

// Middleware
app.use(cors());
app.use(express.json());

const genAI = process.env.GEMINI_API_KEY 
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
    : null;

// --- ROUTES ---

// 1. GET /health
app.get('/health', (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: EMAIL
    });
});

// 2. POST /bfhl
app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        let responseData = null;
        
        
        // Case 1: Fibonacci
        if (body.fibonacci !== undefined) {
            const n = parseInt(body.fibonacci);
            if (isNaN(n)) {
                return res.status(400).json({
                    is_success: false,
                    official_email: EMAIL,
                    message: "Invalid input: fibonacci must be a number"
                });
            }
            responseData = getFibonacci(n);
        }
        
        // Case 2: Prime
        else if (body.prime) {
            if (!Array.isArray(body.prime)) {
                return res.status(400).json({
                    is_success: false,
                    official_email: EMAIL,
                    message: "Invalid input: prime must be an array"
                });
            }
            responseData = body.prime.filter(num => 
                typeof num === 'number' && isPrime(num)
            );
        }
        
        // Case 3: LCM
        else if (body.lcm) {
            if (!Array.isArray(body.lcm)) {
                return res.status(400).json({
                    is_success: false,
                    official_email: EMAIL,
                    message: "Invalid input: lcm must be an array"
                });
            }
            responseData = getLCM(body.lcm);
        }
        
        // Case 4: HCF
        else if (body.hcf) {
            if (!Array.isArray(body.hcf)) {
                return res.status(400).json({
                    is_success: false,
                    official_email: EMAIL,
                    message: "Invalid input: hcf must be an array"
                });
            }
            responseData = getHCF(body.hcf);
        }
        
        // Case 5: AI
        else if (body.AI) {
            if (typeof body.AI !== 'string') {
                return res.status(400).json({
                    is_success: false,
                    official_email: EMAIL,
                    message: "Invalid input: AI must be a string"
                });
            }
            
            if (!genAI) {
                 return res.status(500).json({
                    is_success: false,
                    official_email: EMAIL,
                    message: "Server Error: GEMINI_API_KEY not configured"
                });
            }
            
            
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Answer the following question in exactly one single word: ${body.AI}`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            responseData = text.trim().split(/\s+/)[0]; 
        } 
        
        else {
            return res.status(400).json({
                is_success: false,
                official_email: EMAIL,
                message: "Invalid request format. Key missing."
            });
        }

        
        res.status(200).json({
            is_success: true,
            official_email: EMAIL,
            data: responseData
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            is_success: false,
            official_email: EMAIL,
            message: error.message || "Internal Server Error"
        });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;


