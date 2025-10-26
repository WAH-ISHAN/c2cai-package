නියමයි! හොඳ `README` file එකක් කියන්නේ ඕනෑම open-source project එකක සාර්ථකත්වයට අත්‍යවශ්‍ය දෙයක්. ඒකෙන් අනිත් developerලාට ඔබේ project එක මොකක්ද, ඒක පාවිච්චි කරන්නේ කොහොමද කියලා ලේසියෙන්ම තේරුම් ගන්න පුළුවන් වෙනවා.

මෙන්න ඔබේ `c2cai-package` එකට ගළපෙන, සවිස්තරාත්මක `README.md` file එකක්. මේක Markdown කියන format එකෙන් ලියලා තියෙන්නේ. ඔබට මේ සම්පූර්ණ text එක copy කරලා, ඔබේ `c2cai-project/c2cai-package` folder එක ඇතුළේ `README.md` නමින් අලුත් file එකක් හදලා, ඒකට paste කරන්න පුළුවන්.

ඊට පස්සේ, මේ `README.md` file එකත් එක්ක package එක නැවත publish කළාම (version එක `1.0.3` වගේ වැඩි කරලා), ඔබේ NPM page එක සහ GitHub page එක ගොඩක් ලස්සනට, විස්තරාත්මකව පෙනෙයි.

---

### `README.md` (මේ පහළ තියෙන content එක copy කරගන්න)

````markdown
# C2C-AI Assistant (`c2cai-package`)

[![npm version](https://img.shields.io/npm/v/c2cai-package.svg)](https://www.npmjs.com/package/c2cai-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple, lightweight, and customizable AI-powered voice assistant for any website. C2C-AI allows users to interact with your website using voice commands, providing a modern and accessible user experience.

 
*(Note: Replace this with a real GIF of your assistant working!)*

## ✨ Features

- **Voice-to-Text:** Converts user's voice commands into text using the browser's native Web Speech API.
- **AI-Powered Responses:** Integrates with a backend (like a serverless function) powered by Large Language Models (e.g., GPT) to understand context and answer questions.
- **Text-to-Speech:** Speaks the AI's responses back to the user.
- **Context-Aware:** Reads the text content of the current webpage to provide relevant answers.
- **Customizable Personas:** Easily configure the AI's personality (e.g., professional guide, sales agent).
- **Automatic Welcome Message:** Can greet users with a time-appropriate message when they visit the site.
- **Easy Integration:** Zero dependencies, simple to add to any frontend project.

---

## 🚀 Getting Started

There are two ways to add C2C-AI Assistant to your website: using a CDN (the simplest method) or by installing it via NPM in a modern JavaScript project (like React, Vue, etc.).

### Prerequisites

You need a backend endpoint that can process the user's query and the page context. This backend is responsible for securely calling an AI service like OpenAI.

We recommend using a **Serverless Function** for this. You can find an example implementation for Vercel/Netlify in the [Backend Setup](#-backend-setup) section below.

### Method 1: Using a CDN (Recommended for simple HTML/JS sites)

This is the easiest way to get started. Just add the following script tag to your HTML file before the closing `</body>` tag.

```html
<!-- index.html -->
<body>
    <!-- Your website content -->
    
    <!-- 1. Add the C2C-AI script -->
    <script src="https://cdn.jsdelivr.net/npm/c2cai-package@latest/dist/c2cai.min.js"></script>
    
    <!-- 2. Initialize the assistant -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            new C2CAIAssistant({
                // Required: The URL of your backend serverless function
                backendUrl: 'https://your-live-backend-url.com/api/ask',
                
                // Optional: Customize the assistant
                persona: 'portfolio_guide', // e.g., 'general_assistant', 'sales_agent'
                language: 'en-US',
                welcomeMessage: true // Set to true to enable the welcome message
            });
        });
    </script>
</body>
```

### Method 2: Using NPM (Recommended for React, Vue, etc.)

1.  **Install the package:**
    Open your project's terminal and run:
    ```bash
    npm install c2cai-package
    ```

2.  **Initialize in your project:**
    In your main JavaScript or a specific component file (e.g., `App.js` or a layout component), import and initialize the assistant.

    **Example for a React project:**

    ```jsx
    // src/components/VoiceAssistant.jsx
    import React, { useEffect } from 'react';
    import 'c2cai-package'; // Import the package to load the script

    const VoiceAssistant = () => {
      useEffect(() => {
        if (!window.c2caiInstance) { // Prevent multiple initializations
          window.c2caiInstance = new window.C2CAIAssistant({
            // Required: Use a relative path for serverless functions
            // hosted on the same platform (e.g., Vercel)
            backendUrl: '/api/ask', 
            
            // Optional customizations
            persona: 'portfolio_guide',
            welcomeMessage: true
          });
        }
      }, []);

      return null; // This component doesn't render anything itself
    };

    export default VoiceAssistant;
    ```
    Then, simply add `<VoiceAssistant />` to your main `App.js` or layout file.

---

## 🔧 Configuration Options

You can customize the assistant by passing an options object during initialization:

| Option           | Type    | Default               | Description                                                                                             |
| ---------------- | ------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| `backendUrl`     | `string`| `'/api/ask'`          | **(Required)** The URL endpoint of your AI backend logic.                                               |
| `language`       | `string`| `'en-US'`             | The language for speech recognition and synthesis (e.g., `'si-LK'` for Sinhala).                        |
| `persona`        | `string`| `'general_assistant'` | A key to define the AI's personality. Your backend must be configured to handle this.                   |
| `welcomeMessage` | `boolean`| `false`              | If `true`, the assistant will greet the user with a time-aware message when the page loads. |

---

## ⚙️ Backend Setup (Serverless Function Example)

The frontend package **does not** contain your secret API keys. You must create a secure backend endpoint to handle AI requests. Here is an example of a serverless function for platforms like **Vercel** or **Netlify**.

1.  **Create a file:** In your frontend project's root, create a file at `api/ask.js`.
2.  **Add the code:**

    ```javascript
    // api/ask.js
    import { OpenAI } from 'openai';

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Securely loaded from environment variables
    });

    // Define your personas here
    const personas = {
        'general_assistant': 'You are a helpful assistant...',
        'portfolio_guide': 'You are a professional portfolio guide...',
        // Add more personas as needed
    };

    export default async function handler(req, res) {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method Not Allowed' });
        }

        const { query, context, persona } = req.body;
        const systemPrompt = personas[persona] || personas['general_assistant'];

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { "role": "system", "content": `${systemPrompt} ...` },
                    { "role": "user", "content": `Context: "${context}"\n\nQuestion: "${query}"` }
                ],
            });

            const reply = completion.choices[0].message.content;
            res.status(200).json({ reply });
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({ error: 'Failed to get response from AI.' });
        }
    }
    ```

3.  **Set Environment Variables:**
    On your hosting platform (Vercel, Netlify), go to your project's settings and add an environment variable:
    *   **Name:** `OPENAI_API_KEY`
    *   **Value:** Your secret key from OpenAI (e.g., `sk-...`)

---

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
````
