require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Persona Management: විවිධ persona වලට අදාළ උපදෙස්
const personas = {
    'general_assistant': 'You are a helpful general assistant. Your job is to answer questions based on the website content provided.',
    'sales_agent': 'You are a friendly and persuasive sales agent. Your goal is to guide the user towards making a purchase. Explain products enthusiastically and highlight their benefits. If asked about price, be positive. Always try to close the sale by asking if they want to add the item to the cart.',
    'portfolio_guide': 'You are a professional portfolio guide. You are explaining the work of a creative professional. Speak clearly and highlight the skills and achievements demonstrated in the projects mentioned in the website content.'
};

app.post('/ask', async (req, res) => {
    const { query, context, persona } = req.body;

    if (!query || !context) {
        return res.status(400).json({ error: 'Query and context are required.' });
    }

    // Persona එකට අදාළ system prompt එක තෝරාගැනීම
    const systemPrompt = personas[persona] || personas['general_assistant'];

    console.log(`Received Query: ${query}`);
    console.log(`Using Persona: ${persona}`);
    // console.log(`Context (Website Content): ${context.substring(0, 500)}...`); // For debugging

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Or "gpt-4" for better results
            messages: [
                {
                    "role": "system",
                    "content": `${systemPrompt} You MUST answer based ONLY on the following website content. Do not make up information. If the answer is not in the content, say "I cannot find that information on this page." Keep your answers concise.`
                },
                {
                    "role": "user",
                    "content": `Here is the website content: "${context}"\n\nNow, please answer my question: "${query}"`
                }
            ],
        });

        const reply = completion.choices[0].message.content;
        console.log(`AI Reply: ${reply}`);
        res.json({ reply: reply });

    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).json({ error: 'Failed to get a response from AI.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`C2C-AI Backend is running on port ${PORT}`);
});