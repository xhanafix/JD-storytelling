class StoryGenerator {
    constructor() {
        this.apiKey = localStorage.getItem('openRouterApiKey');
        this.siteUrl = window.location.origin;
        this.siteName = 'Jadivila Story Creator';

        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.contentOutput = document.getElementById('contentOutput');
        this.storyStyleSelect = document.getElementById('storyStyle');
        this.emotionalToneSelect = document.getElementById('emotionalTone');
        this.languageSelect = document.getElementById('language');
        this.perspectiveSelect = document.getElementById('perspective');
        this.apiKeyInput = document.getElementById('apiKey');
        this.saveApiKeyBtn = document.getElementById('saveApiKey');
        
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
        }
    }

    addEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateStory());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('openRouterApiKey', apiKey);
            this.apiKey = apiKey;
            alert('API key saved successfully!');
        } else {
            alert('Please enter a valid API key');
        }
    }

    async generateStory() {
        if (!this.apiKey) {
            alert('Please set your OpenRouter API key first');
            return;
        }

        const storyStyle = this.storyStyleSelect.value;
        const emotionalTone = this.emotionalToneSelect.value;
        const language = this.languageSelect.value;
        const perspective = this.perspectiveSelect.value;

        try {
            this.generateBtn.disabled = true;
            this.generateBtn.textContent = 'Crafting Your Story...';

            const prompt = this.createStoryPrompt(storyStyle, emotionalTone, language, perspective);
            const content = await this.fetchFromAPI(prompt);

            this.contentOutput.textContent = content;
        } catch (error) {
            console.error('Story generation error:', error);
            this.contentOutput.textContent = 'Unable to create your story. Please try again.';
        } finally {
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Create Your Story';
        }
    }

    createStoryPrompt(storyStyle, emotionalTone, language, perspective) {
        return `Create an engaging ${emotionalTone} Facebook post for Jadivila using a ${storyStyle} approach in ${language}. 
        Write from a ${perspective} perspective.

        Key Story Elements:
        - Jadivila offers 360 sqft villas at RM100k
        - Built in 60 days using quality materials
        - Perfect for passive income generation
        - Represents growth and achievement for Malaysians

        Story Guidelines:
        - Focus on emotional connection and aspirational elements
        - Emphasize the journey of growth and success
        - Include relevant emojis for engagement
        - Add meaningful hashtags
        - Keep the tone ${emotionalTone} throughout
        - Make it relatable to Malaysian dreams of property ownership

        Make the story engaging, authentic, and shareable while maintaining the emotional resonance of the chosen style.`;
    }

    async fetchFromAPI(prompt) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "HTTP-Referer": this.siteUrl,
                    "X-Title": this.siteName,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "meta-llama/llama-3.1-70b-instruct:free",
                    "messages": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": prompt
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error('Failed to generate story');
        }
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.contentOutput.textContent);
            this.copyBtn.textContent = 'Story Copied!';
            setTimeout(() => {
                this.copyBtn.textContent = 'Share the Story';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
}

// Initialize the story generator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StoryGenerator();
}); 