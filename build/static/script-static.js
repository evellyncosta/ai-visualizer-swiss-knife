// Static version for GitHub Pages deployment
let currentTokenProbs = [];

// Sample response data for demonstration
const sampleResponse = {
    text: "conference hall where all the amazing talks are happening today!",
    tokenProbs: [
        {
            "selected_token": "conference",
            "selected_prob": 0.85,
            "top_logprobs": [
                {"token": "conference", "probability": 0.85},
                {"token": "main", "probability": 0.08},
                {"token": "exhibition", "probability": 0.04},
                {"token": "speaker", "probability": 0.02},
                {"token": "keynote", "probability": 0.01}
            ]
        },
        {
            "selected_token": " hall",
            "selected_prob": 0.72,
            "top_logprobs": [
                {"token": " hall", "probability": 0.72},
                {"token": " room", "probability": 0.15},
                {"token": " center", "probability": 0.08},
                {"token": " venue", "probability": 0.03},
                {"token": " auditorium", "probability": 0.02}
            ]
        },
        {
            "selected_token": " where",
            "selected_prob": 0.91,
            "top_logprobs": [
                {"token": " where", "probability": 0.91},
                {"token": " to", "probability": 0.04},
                {"token": " and", "probability": 0.03},
                {"token": " for", "probability": 0.01},
                {"token": " with", "probability": 0.01}
            ]
        },
        {
            "selected_token": " all",
            "selected_prob": 0.67,
            "top_logprobs": [
                {"token": " all", "probability": 0.67},
                {"token": " the", "probability": 0.18},
                {"token": " we", "probability": 0.08},
                {"token": " everyone", "probability": 0.04},
                {"token": " people", "probability": 0.03}
            ]
        },
        {
            "selected_token": " the",
            "selected_prob": 0.94,
            "top_logprobs": [
                {"token": " the", "probability": 0.94},
                {"token": " those", "probability": 0.03},
                {"token": " our", "probability": 0.02},
                {"token": " these", "probability": 0.01},
                {"token": " my", "probability": 0.001}
            ]
        },
        {
            "selected_token": " amazing",
            "selected_prob": 0.56,
            "top_logprobs": [
                {"token": " amazing", "probability": 0.56},
                {"token": " great", "probability": 0.22},
                {"token": " wonderful", "probability": 0.12},
                {"token": " exciting", "probability": 0.06},
                {"token": " fantastic", "probability": 0.04}
            ]
        },
        {
            "selected_token": " talks",
            "selected_prob": 0.89,
            "top_logprobs": [
                {"token": " talks", "probability": 0.89},
                {"token": " presentations", "probability": 0.06},
                {"token": " sessions", "probability": 0.03},
                {"token": " speakers", "probability": 0.01},
                {"token": " workshops", "probability": 0.01}
            ]
        },
        {
            "selected_token": " are",
            "selected_prob": 0.78,
            "top_logprobs": [
                {"token": " are", "probability": 0.78},
                {"token": " will", "probability": 0.12},
                {"token": " have", "probability": 0.06},
                {"token": " take", "probability": 0.03},
                {"token": " begin", "probability": 0.01}
            ]
        },
        {
            "selected_token": " happening",
            "selected_prob": 0.82,
            "top_logprobs": [
                {"token": " happening", "probability": 0.82},
                {"token": " taking", "probability": 0.09},
                {"token": " being", "probability": 0.05},
                {"token": " scheduled", "probability": 0.03},
                {"token": " occurring", "probability": 0.01}
            ]
        },
        {
            "selected_token": " today",
            "selected_prob": 0.71,
            "top_logprobs": [
                {"token": " today", "probability": 0.71},
                {"token": " now", "probability": 0.15},
                {"token": " right", "probability": 0.08},
                {"token": " this", "probability": 0.04},
                {"token": " currently", "probability": 0.02}
            ]
        },
        {
            "selected_token": "!",
            "selected_prob": 0.93,
            "top_logprobs": [
                {"token": "!", "probability": 0.93},
                {"token": ".", "probability": 0.05},
                {"token": ",", "probability": 0.01},
                {"token": " and", "probability": 0.005},
                {"token": " -", "probability": 0.005}
            ]
        }
    ]
};

// Additional sample responses for demo purposes
const sampleResponses = [
    {
        prompt: "The weather today is",
        response: {
            text: " absolutely beautiful and perfect for outdoor activities!",
            tokenProbs: [
                {
                    "selected_token": " absolutely",
                    "selected_prob": 0.73,
                    "top_logprobs": [
                        {"token": " absolutely", "probability": 0.73},
                        {"token": " really", "probability": 0.12},
                        {"token": " quite", "probability": 0.08},
                        {"token": " very", "probability": 0.05},
                        {"token": " incredibly", "probability": 0.02}
                    ]
                },
                {
                    "selected_token": " beautiful",
                    "selected_prob": 0.89,
                    "top_logprobs": [
                        {"token": " beautiful", "probability": 0.89},
                        {"token": " lovely", "probability": 0.06},
                        {"token": " perfect", "probability": 0.03},
                        {"token": " wonderful", "probability": 0.015},
                        {"token": " amazing", "probability": 0.005}
                    ]
                }
            ]
        }
    },
    {
        prompt: "Machine learning is",
        response: {
            text: " revolutionizing how we solve complex problems across industries.",
            tokenProbs: [
                {
                    "selected_token": " revolutionizing",
                    "selected_prob": 0.67,
                    "top_logprobs": [
                        {"token": " revolutionizing", "probability": 0.67},
                        {"token": " transforming", "probability": 0.18},
                        {"token": " changing", "probability": 0.10},
                        {"token": " reshaping", "probability": 0.03},
                        {"token": " improving", "probability": 0.02}
                    ]
                },
                {
                    "selected_token": " how",
                    "selected_prob": 0.85,
                    "top_logprobs": [
                        {"token": " how", "probability": 0.85},
                        {"token": " the", "probability": 0.08},
                        {"token": " our", "probability": 0.04},
                        {"token": " every", "probability": 0.02},
                        {"token": " many", "probability": 0.01}
                    ]
                }
            ]
        }
    }
];

const wordDemoResponses = [
    {
        prompt: "The weather today is ",
        response: {
            text: "sunny",
            tokenProbs: [
                { selected_token: "sun", selected_prob: 0.71, top_logprobs: [{ token: "sun", probability: 0.71 }, { token: "rain", probability: 0.19 }, { token: "cloud", probability: 0.08 }] },
                { selected_token: "ny", selected_prob: 0.94, top_logprobs: [{ token: "ny", probability: 0.94 }, { token: "shine", probability: 0.04 }, { token: "day", probability: 0.01 }] }
            ]
        }
    },
    {
        prompt: "Machine learning is ",
        response: {
            text: "powerful",
            tokenProbs: [
                { selected_token: "power", selected_prob: 0.64, top_logprobs: [{ token: "power", probability: 0.64 }, { token: "transform", probability: 0.22 }, { token: "use", probability: 0.11 }] },
                { selected_token: "ful", selected_prob: 0.90, top_logprobs: [{ token: "ful", probability: 0.90 }, { token: "ly", probability: 0.06 }, { token: "ness", probability: 0.03 }] }
            ]
        }
    }
];

const portugueseWordDemoResponses = [
    {
        prompt: 'O clima hoje está ',
        response: { text: 'ensolarado', tokenProbs: [
            { selected_token: 'ensol', selected_prob: 0.71, top_logprobs: [{ token: 'ensol', probability: 0.71 }, { token: 'nublado', probability: 0.19 }] },
            { selected_token: 'arado', selected_prob: 0.94, top_logprobs: [{ token: 'arado', probability: 0.94 }, { token: 'ado', probability: 0.04 }] }
        ] }
    },
    {
        prompt: 'Aprendizado de máquina é ',
        response: { text: 'poderoso', tokenProbs: [
            { selected_token: 'poder', selected_prob: 0.64, top_logprobs: [{ token: 'poder', probability: 0.64 }, { token: 'útil', probability: 0.22 }] },
            { selected_token: 'oso', selected_prob: 0.90, top_logprobs: [{ token: 'oso', probability: 0.90 }, { token: 'osa', probability: 0.06 }] }
        ] }
    }
];

const textDemoResponse = {
    prompt: "Escreva uma mensagem de aniversário para meu pai",
    response: {
        text: "Feliz aniversário, pai!\n\nQue seu dia seja cheio de alegria, saúde e boas lembranças.",
        tokenProbs: [
            { selected_token: "Feliz", selected_prob: 0.78, top_logprobs: [{ token: "Feliz", probability: 0.78 }, { token: "Parabéns", probability: 0.16 }, { token: "Querido", probability: 0.04 }] },
            { selected_token: " aniversário", selected_prob: 0.88, top_logprobs: [{ token: " aniversário", probability: 0.88 }, { token: " dia", probability: 0.07 }, { token: " pai", probability: 0.03 }] },
            { selected_token: ", pai!", selected_prob: 0.91, top_logprobs: [{ token: ", pai!", probability: 0.91 }, { token: "!", probability: 0.05 }, { token: ", meu pai!", probability: 0.02 }] },
            { selected_token: "\n\n", selected_prob: 0.74, top_logprobs: [{ token: "\n\n", probability: 0.74 }, { token: " ", probability: 0.16 }, { token: "\n", probability: 0.08 }] },
            { selected_token: "Que", selected_prob: 0.69, top_logprobs: [{ token: "Que", probability: 0.69 }, { token: "Espero", probability: 0.18 }, { token: "Desejo", probability: 0.11 }] },
            { selected_token: " seu dia seja cheio de alegria, saúde e boas lembranças.", selected_prob: 0.83, top_logprobs: [{ token: " seu dia seja cheio de alegria, saúde e boas lembranças.", probability: 0.83 }, { token: " esta data seja especial.", probability: 0.11 }, { token: " você tenha muita felicidade.", probability: 0.04 }] }
        ]
    }
};

// Check if we're running locally or on GitHub Pages
const isLocalEnvironment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    if (!isLocalEnvironment) {
        setupStaticDemo();
    }
});

document.addEventListener('localechange', function() {
    if (!isLocalEnvironment) {
        setupStaticDemo();
    }
});

function setupStaticDemo() {
    document.querySelector('.demo-section')?.remove();
    // Add demo section for GitHub Pages
    const inputSection = document.querySelector('.input-section');
    const demoSection = document.createElement('div');
    demoSection.className = 'demo-section';
    const isTextMode = document.body.dataset.generationMode === 'text';
    demoSection.innerHTML = `
        <div class="demo-header">
            <h3>${window.i18n.t('staticDemoTitle')}</h3>
            <p>${window.i18n.t('staticDemoDescription')} <a href="https://github.com/marlenezw/token-probability" target="_blank">GitHub</a>.</p>
        </div>
        <div class="demo-buttons">
            ${isTextMode
                ? `<button class="demo-btn" onclick="loadTextDemo()">${window.i18n.t('loadTextDemo')}</button>`
                : `<button class="demo-btn" onclick="loadDemoExample(0)">${window.i18n.t('weatherDemo')}</button><button class="demo-btn" onclick="loadDemoExample(1)">${window.i18n.t('mlDemo')}</button><button class="demo-btn" onclick="loadOriginalExample()">${window.i18n.t('originalDemo')}</button>`}
        </div>
    `;
    
    inputSection.parentNode.insertBefore(demoSection, inputSection);
    
    // Hide API configuration in demo mode
    const configSection = document.querySelector('.config-section');
    if (configSection) {
        configSection.style.display = 'none';
    }
}

function loadTextDemo() {
    const demo = window.i18n.getLocale() === 'en'
        ? { prompt: 'Write a birthday message for my father', response: { text: 'Happy birthday, Dad!\n\nI hope your day is full of joy, health, and wonderful memories.', tokenProbs: [{ selected_token: 'Happy birthday, Dad!', selected_prob: 0.78, top_logprobs: [{ token: 'Happy birthday, Dad!', probability: 0.78 }] }, { selected_token: '\n\n', selected_prob: 0.74, top_logprobs: [{ token: '\n\n', probability: 0.74 }] }, { selected_token: 'I hope your day is full of joy, health, and wonderful memories.', selected_prob: 0.83, top_logprobs: [{ token: 'I hope your day is full of joy, health, and wonderful memories.', probability: 0.83 }] }] } }
        : textDemoResponse;
    const promptInput = document.getElementById('prompt-input');
    const userMessageContent = document.querySelector('.user-message .message-content .prompt-text');
    promptInput.value = demo.prompt;
    userMessageContent.textContent = demo.prompt;
    displayResponse(
        demo.prompt,
        demo.response.text,
        demoPromptTokens(demo.prompt),
        demo.response.tokenProbs
    );
}

function loadDemoExample(index) {
    const example = window.i18n.getLocale() === 'en'
        ? wordDemoResponses[index]
        : portugueseWordDemoResponses[index];
    const promptInput = document.getElementById('prompt-input');
    const userMessageContent = document.querySelector('.user-message .message-content .prompt-text');
    
    // Update prompt input
    promptInput.value = example.prompt;
    
    // Update user message in chat
    userMessageContent.textContent = example.prompt;
    
    // Display the response
    displayResponse(example.prompt, example.response.text, demoPromptTokens(example.prompt), example.response.tokenProbs);
}

function loadOriginalExample() {
    const promptInput = document.getElementById('prompt-input');
    const userMessageContent = document.querySelector('.user-message .message-content .prompt-text');
    
    // Reset to original example
    const english = window.i18n.getLocale() === 'en';
    const prompt = english ? 'the cat climbed onto the ' : 'o gato subiu no ';
    const response = english ? 'roof' : 'telhado';
    promptInput.value = prompt;
    userMessageContent.textContent = prompt;
    
    displayResponse(prompt, response, demoPromptTokens(prompt), [
        { selected_token: response, selected_prob: 0.92, top_logprobs: [{ token: response, probability: 0.92 }] }
    ]);
}

let currentPrompt = '';

function formatToken(token) {
    return token.replace(/ /g, '␠').replace(/\n/g, '↵').replace(/\t/g, '⇥');
}

function demoPromptTokens(prompt) {
    return [...new TextEncoder().encode(prompt)].map((byte, index) => ({ id: index, bytes: [byte] }));
}

function formatPromptToken(token) {
    const bytes = new Uint8Array(token.bytes || []);
    try {
        return formatToken(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    } catch (_) {
        return [...bytes].map(byte => `\\x${byte.toString(16).padStart(2, '0')}`).join('');
    }
}

function renderPromptTokens(prompt, promptTokens) {
    const promptElement = document.getElementById('prompt-tokens');
    promptElement.innerHTML = '';
    const tokens = promptTokens || demoPromptTokens(prompt);
    tokens.forEach(token => {
        const tokenElement = document.createElement('span');
        tokenElement.className = 'prompt-token';
        tokenElement.textContent = formatPromptToken(token);
        tokenElement.title = `Token ${token.id}`;
        promptElement.appendChild(tokenElement);
    });
}

function displayResponse(prompt, text, promptTokens, tokenProbs) {
    currentPrompt = prompt;
    currentTokenProbs = tokenProbs;
    renderPromptTokens(prompt, promptTokens);
    const responseElement = document.getElementById('response-text');
    responseElement.innerHTML = '';
    
    tokenProbs.forEach((tokenData, index) => {
        const tokenButton = document.createElement('button');
        tokenButton.type = 'button';
        tokenButton.className = 'token';
        tokenButton.textContent = formatToken(tokenData.selected_token);
        tokenButton.dataset.tokenIndex = index;
        
        // Add probability-based class
        const probClass = getProbabilityClass(tokenData.selected_prob);
        tokenButton.classList.add(probClass);
        tokenButton.addEventListener('click', () => selectToken(index));
        
        responseElement.appendChild(tokenButton);
        const lineBreaks = (tokenData.selected_token.match(/\n/g) || []).length;
        for (let line = 0; line < lineBreaks; line += 1) {
            responseElement.appendChild(document.createElement('br'));
        }
    });
    selectToken(0);
}

function getProbabilityClass(probability) {
    if (probability >= 0.8) return 'prob-very-high';
    if (probability >= 0.6) return 'prob-high';
    if (probability >= 0.4) return 'prob-medium';
    if (probability >= 0.2) return 'prob-low';
    return 'prob-very-low';
}

function selectToken(tokenIndex) {
    const tokenData = currentTokenProbs[tokenIndex];
    document.getElementById('token-context').textContent = currentPrompt + currentTokenProbs.slice(0, tokenIndex).map(item => item.selected_token).join('');
    document.querySelectorAll('.token').forEach((button, index) => {
        button.classList.toggle('token-selected', index === tokenIndex);
        button.setAttribute('aria-pressed', String(index === tokenIndex));
    });
    const rows = [...tokenData.top_logprobs];
    if (!rows.some(item => item.token === tokenData.selected_token)) rows.unshift({ token: tokenData.selected_token, probability: tokenData.selected_prob });
    const tableBody = document.getElementById('probability-table-body');
    tableBody.innerHTML = '';
    rows.forEach(item => {
        const row = document.createElement('tr');
        if (item.token === tokenData.selected_token) row.className = 'selected-candidate';
        const tokenCell = document.createElement('td');
        tokenCell.textContent = `"${formatToken(item.token)}"`;
        const probabilityCell = document.createElement('td');
        probabilityCell.textContent = `${(item.probability * 100).toFixed(1)}%`;
        row.append(tokenCell, probabilityCell);
        tableBody.appendChild(row);
    });
}

// Function handles both local and GitHub Pages environments
async function generateResponse() {
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const responseElement = document.getElementById('response-text');
    
    const prompt = promptInput.value;
    
    if (!prompt.trim()) {
        alert(window.i18n.t('enterPrompt'));
        return;
    }
    
    // Check if we're in static demo mode (GitHub Pages)
    if (!isLocalEnvironment) {
        alert(window.i18n.t('staticDemoAlert'));
        return;
    }
    
    // Local environment - proceed with actual API call
    // Update UI for loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<span class="loading"></span> ${window.i18n.t('generating')}`;
    responseElement.textContent = window.i18n.t('generatingResponse');
    
    // Add user message to chat
    const chatContainer = document.querySelector('.chat-container');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    const userMessageContent = document.createElement('div');
    userMessageContent.className = 'message-content';
    const promptLabel = document.createElement('span');
    promptLabel.className = 'prompt-label';
    promptLabel.textContent = document.body.dataset.generationMode === 'text' ? window.i18n.t('tokenizedQuestion') : window.i18n.t('tokenizedContext');
    const promptTokensElement = document.createElement('span');
    promptTokensElement.id = 'prompt-tokens';
    promptTokensElement.className = 'prompt-text';
    userMessageContent.append(promptLabel, promptTokensElement);
    userMessage.appendChild(userMessageContent);
    
    // Remove existing user message if any
    const existingUserMessage = chatContainer.querySelector('.user-message');
    if (existingUserMessage) {
        existingUserMessage.remove();
    }
    
    chatContainer.insertBefore(userMessage, chatContainer.firstChild);
    
    try {
        const response = await makeApiCall(prompt);
        
        displayResponse(prompt, response.text, response.promptTokens, response.tokenProbs);
        
    } catch (error) {
        responseElement.textContent = window.i18n.t('generationError');
        console.error('Error:', error);
    } finally {
        // Reset button state
        generateBtn.disabled = false;
        generateBtn.textContent = document.body.dataset.generationMode === 'text' ? window.i18n.t('generateText') : window.i18n.t('generate');
    }
}

// API call function for local environment
async function makeApiCall(prompt) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                top_k: 5,
                temperature: 0.0,
                mode: document.body.dataset.generationMode || 'word',
                locale: window.i18n.getLocale()
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Allow Enter key to submit (Shift+Enter for new line)
document.getElementById('prompt-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        generateResponse();
    }
});
