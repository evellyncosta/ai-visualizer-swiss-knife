// Sample data structure based on your notebook output
let currentTokenProbs = [];

// Sample response data - replace this with actual API call
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
        tokenElement.title = `${window.i18n.t('tokenColumn')} ${token.id}`;
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
        tokenButton.title = `${window.i18n.t('tokenColumn')}: ${formatToken(tokenData.selected_token)}`;
        
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
    const context = currentPrompt + currentTokenProbs
        .slice(0, tokenIndex)
        .map(item => item.selected_token)
        .join('');
    document.getElementById('token-context').textContent = context;
    document.querySelectorAll('.token').forEach((button, index) => {
        button.classList.toggle('token-selected', index === tokenIndex);
        button.setAttribute('aria-pressed', String(index === tokenIndex));
    });

    const rows = [...tokenData.top_logprobs];
    if (!rows.some(item => item.token === tokenData.selected_token)) {
        rows.unshift({ token: tokenData.selected_token, probability: tokenData.selected_prob });
    }
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

async function generateResponse() {
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const responseElement = document.getElementById('response-text');
    
    const prompt = promptInput.value;
    
    if (!prompt.trim()) {
        alert(window.i18n.t('enterPrompt'));
        return;
    }
    
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
    promptLabel.textContent = document.body.dataset.generationMode === 'text'
        ? window.i18n.t('tokenizedQuestion')
        : window.i18n.t('tokenizedContext');
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
        generateBtn.textContent = document.body.dataset.generationMode === 'text'
            ? window.i18n.t('generateText')
            : window.i18n.t('generate');
    }
}

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
