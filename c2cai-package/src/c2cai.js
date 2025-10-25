// c2cai.js

class C2CAIAssistant {
    constructor(config) {
        // Default configuration
        this.config = {
            backendUrl: 'http://localhost:3000/ask',
            language: 'en-US',
            persona: 'general_assistant',
            ...config // User overrides
        };

        // Check for SpeechRecognition API
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            console.error("C2C-AI Error: Speech Recognition API is not supported in this browser.");
            return; // Stop initialization if not supported
        }

        this.recognition = new SpeechRecognitionAPI();
        this.isListening = false;
        
        this.initUI();
        this.initSpeechAPI();
    }

    initUI() {
        // Inject CSS
        const style = document.createElement('style');
        style.innerHTML = `
            /* Paste the entire c2cai.css content here */
            #c2cai-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; }
            #c2cai-button { width: 60px; height: 60px; border-radius: 50%; background-color: #007bff; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: all 0.3s ease; }
            #c2cai-button:hover { transform: scale(1.1); }
            #c2cai-mic-icon { width: 28px; height: 28px; fill: white; }
            #c2cai-button.listening { background-color: #dc3545; animation: pulse 1.5s infinite; }
            #c2cai-button.thinking { background-color: #ffc107; animation: spin 1s linear infinite; }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); } 70% { box-shadow: 0 0 0 20px rgba(220, 53, 69, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);

        // Create Button
        this.container = document.createElement('div');
        this.container.id = 'c2cai-container';
        
        this.button = document.createElement('button');
        this.button.id = 'c2cai-button';
        this.button.innerHTML = `
            <svg id="c2cai-mic-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-20.8 12.3-38.7 30-46.3V256c0 70.7 57.3 128 128 128s128-57.3 128-128V169.7c17.7 7.6 30 25.5 30 46.3v40c0 6.1-1.3 12-3.8 17.4l-33.3 69.4c-3 6.2-9.4 10.2-16.4 10.2H123.5c-7 0-13.4-4-16.4-10.2L74.8 313.4c-2.5-5.4-3.8-11.3-3.8-17.4v-40zM128 448H256c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
            </svg>
        `;

        this.container.appendChild(this.button);
        document.body.appendChild(this.container);

        this.button.addEventListener('click', () => this.toggleListening());
    }

    initSpeechAPI() {
        this.recognition.lang = this.config.language;
        this.recognition.interimResults = false;
        
        this.recognition.onstart = () => {
            this.isListening = true;
            this.setState('listening');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (this.button.classList.contains('listening')) { // Only reset if not thinking
                this.setState('idle');
            }
        };

        this.recognition.onresult = (event) => {
            const userQuery = event.results[0][0].transcript;
            console.log(`User said: ${userQuery}`);
            this.setState('thinking');

            // Stop listening immediately after getting a result
            this.recognition.stop();
            
            this.sendToBackend(userQuery);
        };
    }

    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    setState(state) {
        this.button.classList.remove('listening', 'thinking');
        if (state === 'listening' || state === 'thinking') {
            this.button.classList.add(state);
        }
    }

    async sendToBackend(query) {
        try {
            const pageContent = document.body.innerText;
            const response = await fetch(this.config.backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    context: pageContent.substring(0, 15000), // Limit context size
                    persona: this.config.persona
                })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            this.speak(data.reply);
        } catch (error) {
            console.error('C2C-AI Error:', error);
            this.speak("I'm sorry, I encountered an error. Please try again.");
        }
    }

    speak(text) {
        this.setState('speaking');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.config.language;
        utterance.onend = () => {
            this.setState('idle');
        };
        window.speechSynthesis.speak(utterance);
    }
}

// To make it available globally on the window object
window.C2CAIAssistant = C2CAIAssistant;