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
    if (typeof body.AI !== 'string' || body.AI.trim() === "") {
        return res.status(400).json({
            is_success: false,
            official_email: EMAIL,
            message: "Invalid input: AI must be a non-empty string"
        });
    }

    const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Answer in exactly ONE word only. No punctuation.\nQuestion: ${body.AI}`
                    }]
                }]
            })
        }
    );

    const result = await apiResponse.json();

if (
    !result ||
    !result.candidates ||
    !Array.isArray(result.candidates) ||
    result.candidates.length === 0 ||
    !result.candidates[0].content ||
    !result.candidates[0].content.parts ||
    !result.candidates[0].content.parts[0] ||
    !result.candidates[0].content.parts[0].text
) {
    throw new Error("AI response malformed or blocked");
}

responseData = result.candidates[0].content.parts[0].text
    .trim()
    .split(/\s+/)[0];

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






