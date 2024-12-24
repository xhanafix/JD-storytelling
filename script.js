class StoryWeaver {
    constructor() {
        this.apiKey = localStorage.getItem('openRouterApiKey');
        this.siteUrl = window.location.origin;
        this.siteName = 'Jadivila Story Weaver';

        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.contentOutput = document.getElementById('contentOutput');
        this.storyMoodSelect = document.getElementById('storyMood');
        this.emotionalCoreSelect = document.getElementById('emotionalCore');
        this.languageSelect = document.getElementById('language');
        this.storyArcSelect = document.getElementById('storyArc');
        this.apiKeyInput = document.getElementById('apiKey');
        this.saveApiKeyBtn = document.getElementById('saveApiKey');
        
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
        }
    }

    addEventListeners() {
        this.generateBtn.addEventListener('click', () => this.weaveStory());
        this.copyBtn.addEventListener('click', () => this.shareStory());
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('openRouterApiKey', apiKey);
            this.apiKey = apiKey;
            alert('Key saved successfully!');
        } else {
            alert('Please enter a valid key');
        }
    }

    async weaveStory() {
        if (!this.apiKey) {
            alert('Please set your OpenRouter API key first');
            return;
        }

        const storyMood = this.storyMoodSelect.value;
        const emotionalCore = this.emotionalCoreSelect.value;
        const language = this.languageSelect.value;
        const storyArc = this.storyArcSelect.value;

        try {
            this.generateBtn.disabled = true;
            this.generateBtn.textContent = 'Weaving Your Story...';

            const prompt = this.createStoryPrompt(storyMood, emotionalCore, language, storyArc);
            const content = await this.fetchFromAPI(prompt);

            this.contentOutput.textContent = content;
        } catch (error) {
            console.error('Story weaving error:', error);
            this.contentOutput.textContent = 'Your story awaits another moment. Please try again.';
        } finally {
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Weave Your Story';
        }
    }

    createStoryPrompt(storyMood, emotionalCore, language, storyArc) {
        return `Create an emotionally resonant ${emotionalCore} Facebook post for Jadivila using a ${storyMood} narrative in ${language}. 
        Follow the ${storyArc} story arc.

        Brand Philosophy:
        - "It's not just a villa—it's the first chapter of your legacy"
        - A canvas for dreams, where passive income meets purpose
        - A sanctuary for growth and future-building
        
        Storytelling Guidelines:
        - Focus on emotional connection and aspirational themes
        - Avoid direct mentions of price or technical details
        - Use poetic and evocative language
        - Weave in subtle metaphors about growth, legacy, and dreams
        - Include thoughtfully placed emojis that enhance the emotional resonance
        - Add meaningful hashtags that reflect the story's essence
        - Keep the tone ${emotionalCore} throughout
        - Make it deeply relatable to Malaysian aspirations and dreams

        Create a story that inspires, touches hearts, and paints a vision of possibilities, similar to Nike's "Just Do It" or Ferrari's emotional storytelling approach.`;
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
            throw new Error('Failed to weave story');
        }
    }

    async shareStory() {
        try {
            await navigator.clipboard.writeText(this.contentOutput.textContent);
            this.copyBtn.textContent = 'Legacy Ready to Share';
            setTimeout(() => {
                this.copyBtn.textContent = 'Share Your Legacy';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
}

// Initialize the story weaver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StoryWeaver();
}); 