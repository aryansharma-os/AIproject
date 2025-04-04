// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Replace with your actual Gemini API key
const GEMINI_API_KEY = 'AIzaSyDml0rPt7RpdhGoAJGFdocS8c7-mHEF_ZU';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Event Listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Handle user input
async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat('user', message);
    userInput.value = '';
    sendButton.disabled = true;

    try {
        // Show loading message
        const loadingDiv = addMessageToChat('bot', 'Thinking...');

        // Get response from Gemini
        const response = await getGeminiResponse(message);

        // Remove loading message and add bot response
        loadingDiv.remove();
        addMessageToChat('bot', response);
    } catch (error) {
        console.error('Error:', error);
        addMessageToChat('bot', 'Sorry, I encountered an error. Please try again.');
    }

    sendButton.disabled = false;
    userInput.focus();
}

// Add message to chat
function addMessageToChat(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// Get response from Gemini API
async function getGeminiResponse(userMessage) {
    const prompt = `You are a helpful Science Experiment Guide. Please provide detailed, accurate, and safe information about science experiments. User question: ${userMessage}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
} 