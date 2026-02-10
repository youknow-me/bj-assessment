// 2. POST /bfhl
app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        let responseData = null;
        
        // Strict Input Validation & Logic Mapping
        
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
            
            // Integrate Gemini AI
            // Note: Updated to 'gemini-1.5-flash' for better speed/cost, 
            // but 'gemini-pro' is also fine if your key supports it.
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
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

        // Success Response
        res.status(200).json({
            is_success: true,
            official_email: EMAIL, 
            data: responseData
        });

    } catch (error) {
        console.error("Error processing request:", error);
        
        // 500 is only for actual server crashes/failures
        res.status(500).json({
            is_success: false,
            official_email: EMAIL,
            message: error.message || "Internal Server Error"
        });
    }
});