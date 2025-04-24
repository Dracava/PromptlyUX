// Add this at the beginning of your script
function initializeWelcomeMessage() {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    // Reset the project overview sent flag when initializing welcome message
    projectOverviewSentToChat = false;
    
    // Hide the prompt suggestions container initially
    const promptSuggestionsContainer = document.querySelector('.prompt-suggestions-container');
    
    const welcomeMessage = `<div class="message system"><div class="message-content">👋 Hi there! I'm your Figma Design Assistant. 

🚀 Send my replies to Figma by clicking the purple arrow below.
            
📚 You can browse through the keywords in the prompt library to get inspiration

🛠️ Or you can also generate your own prompts.

▶️ But I highly recommend starting out by filling in the project overview.

<div class="welcome-buttons">
    <button class="button button-outline" id="welcomeLibraryBtn">Library</button>
    <button class="button button-outline" id="welcomeGenerateBtn">Generate</button>
    <button class="button button-primary" id="welcomeStartBtn">Getting Started</button>
</div></div>
    </div>`;
    
    chatMessages.innerHTML = welcomeMessage;
    
    // Add event listeners for welcome buttons right after creating them
    addWelcomeButtonListeners();

    // Add a delayed follow-up question about PromptlyUI's functionalities
    setTimeout(() => {
        // Create a container div for the suggestion bubble
        const bubbleContainer = document.createElement('div');
        bubbleContainer.style.display = 'flex';
        bubbleContainer.style.justifyContent = 'flex-end';
        bubbleContainer.style.width = '100%';
        
        // Create the suggestion bubble
        const suggestionBubble = document.createElement('div');
        suggestionBubble.className = 'suggestion-bubble';
        suggestionBubble.setAttribute('data-tooltip', 'Click to use this suggestion');
        suggestionBubble.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"></path>
            </svg>
            Could you tell me more about the functionalities of PromptlyUI?
        `;
        
        // Add click event to open the prompt popup
        suggestionBubble.addEventListener('click', () => {
            showPromptPopup('About PromptlyUI', 'Could you tell me more about the functionalities of PromptlyUI?');
        });
        
        // Add the bubble to the container
        bubbleContainer.appendChild(suggestionBubble);
        
        // Add the container to the chat
        chatMessages.appendChild(bubbleContainer);
        
        // Scroll to show the suggestion bubble
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 3000); // 3 seconds delay
}

// Function to add event listeners to welcome buttons
function addWelcomeButtonListeners() {
    const welcomeLibraryBtn = document.getElementById('welcomeLibraryBtn');
    const welcomeGenerateBtn = document.getElementById('welcomeGenerateBtn');
    const welcomeStartBtn = document.getElementById('welcomeStartBtn');
    
    if (welcomeLibraryBtn) {
        welcomeLibraryBtn.addEventListener('click', () => {
            // Switch to prompts tab
            document.querySelector('.nav-tab[data-section="prompts"]').click();
            
            // Find the library category and trigger a click on it
            const libraryCategory = document.getElementById('libraryCategory');
            if (libraryCategory) {
                setTimeout(() => {
                    libraryCategory.click();
                }, 100); // Small delay to ensure the tab switch completes
            }
        });
    }
    
    if (welcomeGenerateBtn) {
        welcomeGenerateBtn.addEventListener('click', () => {
            // Switch to prompts tab
            document.querySelector('.nav-tab[data-section="prompts"]').click();
            
            // Show the generate page
            if (typeof showGeneratePage === 'function') {
                setTimeout(() => {
                    showGeneratePage();
                }, 100); // Small delay to ensure the tab switch completes
            } else {
                console.error('showGeneratePage function not found');
            }
        });
    }
    
    if (welcomeStartBtn) {
        welcomeStartBtn.addEventListener('click', () => {
            // Add animation class to the body for transition
            document.body.classList.add('page-transition');
            
            // Switch to prompts tab and show questionnaire
            document.querySelector('.nav-tab[data-section="prompts"]').click();
            
            setTimeout(() => {
                document.querySelector('.prompts-grid').style.display = 'none';
                document.getElementById('questionnaireContainer').style.display = 'block';
                // Re-initialize option items when questionnaire is shown
                initializeOptionItems();
                
                // Remove animation class after transition completes
                document.body.classList.remove('page-transition');
            }, 300); // Small delay to ensure the tab switch completes
        });
    }
}

// When page loads, ensure Chat section is active by default and initialize option items
window.addEventListener('DOMContentLoaded', () => {
    // Initialize welcome message
    initializeWelcomeMessage();
    
    // Set Chat tab as active
    document.querySelector('.nav-tab[data-section="chat"]').classList.add('active');
    document.querySelector('.nav-tab[data-section="prompts"]').classList.remove('active');
    
    // Set Chat section as active
    document.getElementById('chat').classList.add('active');
    document.getElementById('prompts').classList.remove('active');
    
    // Initialize option items
    initializeOptionItems();
    
    // Initialize zoom controls
    initializeZoomControls();
    
    // Initialize prompt categories
    if (typeof initializePromptCategories === 'function') {
        initializePromptCategories();
    }
    
    // Initialize back button functionality
    const backToCategories = document.getElementById('backToCategories');
    if (backToCategories) {
        backToCategories.addEventListener('click', () => {
            const questionnaireContainer = document.getElementById('questionnaireContainer');
            const promptsGrid = document.querySelector('.prompts-grid');
            if (questionnaireContainer && promptsGrid) {
                questionnaireContainer.style.display = 'none';
                promptsGrid.style.display = 'grid';
            }
        });
    }
    
    // Add direct click handler for the Generate category
    const generateCategory = document.getElementById('generateCategory');
    if (generateCategory) {
        generateCategory.addEventListener('click', function() {
            console.log('Generate category clicked from script.js');
            if (typeof showGenerateInterface === 'function') {
                showGenerateInterface();
            } else {
                console.error('showGenerateInterface function not found');
            }
        });
    }
});

// Initialize option items with event listeners
function initializeOptionItems() {
    document.querySelectorAll('.option-grid').forEach(grid => {
        const isMultipleSelect = grid.classList.contains('multiple-select');
        
        grid.querySelectorAll('.option-item').forEach(item => {
            // Remove any existing event listeners by cloning and replacing
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Add new event listener
            newItem.addEventListener('click', () => {
                if (isMultipleSelect) {
                    // Toggle selection for multiple select
                    newItem.classList.toggle('selected');
                } else {
                    // Single selection behavior
                    grid.querySelectorAll('.option-item').forEach(opt => {
                        opt.classList.remove('selected');
                        // Remove other input if deselected
                        if (opt !== newItem && opt.classList.contains('other')) {
                            const input = opt.querySelector('.other-input');
                            if (input) opt.removeChild(input);
                        }
                    });
                    newItem.classList.add('selected');
                }
                
                // If this is an "Other" option, handle the input field
                if (newItem.classList.contains('other') && newItem.classList.contains('selected')) {
                    // Create input field if it doesn't exist
                    if (!newItem.querySelector('.other-input')) {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'other-input';
                        input.placeholder = 'Please specify';
                        
                        // Prevent click from toggling selection
                        input.addEventListener('click', e => e.stopPropagation());
                        
                        newItem.appendChild(input);
                        setTimeout(() => input.focus(), 0);
                    }
                }
            });
        });
    });
}

// Tab navigation
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const sectionId = tab.getAttribute('data-section');
        
        // Only add animation class for the prompts section
        if (sectionId === 'prompts') {
            document.body.classList.add('page-transition');
            
            // Remove animation class after transition completes
            setTimeout(() => {
                document.body.classList.remove('page-transition');
            }, 300);
        }
        
        // If switching to chat tab, refresh the placeholder prompts
        if (sectionId === 'chat') {
            // Update placeholder prompts based on whether project overview has been sent
            displayPlaceholderPrompts();
        }
        
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) section.classList.add('active');
        });
    });
});

// Handle Start category click to show questionnaire
document.getElementById('startCategory').addEventListener('click', () => {
    document.querySelector('.prompts-grid').style.display = 'none';
    document.getElementById('questionnaireContainer').style.display = 'block';
    // Re-initialize option items when questionnaire is shown
    initializeOptionItems();
});

// Handle Library category click to show library page
document.getElementById('libraryCategory').addEventListener('click', () => {
    // Call the showLibraryPage function from library.js
    if (typeof showLibraryPage === 'function') {
        showLibraryPage();
    }
});

// Back button to return to categories
document.getElementById('backToCategories').addEventListener('click', () => {
    document.getElementById('questionnaireContainer').style.display = 'none';
    document.querySelector('.prompts-grid').style.display = 'grid';
});

// Option selection
document.querySelectorAll('.option-item').forEach(item => {
    item.addEventListener('click', () => {
        const siblings = Array.from(item.parentElement.children);
        siblings.forEach(sibling => sibling.classList.remove('selected'));
        item.classList.add('selected');
    });
});

// Chat functionality
const chatInput = document.querySelector('.chat-input');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.querySelector('.chat-messages');
const apiKeyInput = document.getElementById('apiKeyInput');
const verifyKeyButton = document.getElementById('verifyKeyButton');
const apiKeyContainer = document.getElementById('apiKeyContainer');
const promptSuggestionsContainer = document.querySelector('.prompt-suggestions-container');
const regenerateButton = document.getElementById('regenerateButton');

let apiKey = '';
let hasUserSentMessage = false;

// Verify API key
async function verifyApiKey(key) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [{ role: 'user', content: 'Test' }],
                max_tokens: 5
            })
        });

        return { valid: response.ok };
    } catch (error) {
        console.error('API verification error:', error);
        return { valid: false };
    }
}

// Handle verify button click
verifyKeyButton.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
        return;
    }

    verifyKeyButton.disabled = true;
    verifyKeyButton.textContent = 'Verifying...';

    try {
        const result = await verifyApiKey(key);
        
        if (result.valid) {
            apiKey = key;
            apiKeyContainer.style.display = 'none';
            chatInput.disabled = false;
            sendButton.disabled = false;
            
            // Check if there's a pending overview in local storage
            const pendingOverview = localStorage.getItem('pendingOverview');
            if (pendingOverview) {
                chatInput.value = pendingOverview;
                localStorage.removeItem('pendingOverview');
            }
            
            // Set a timer to show prompt suggestions after 5 seconds if user hasn't sent a message
            setTimeout(() => {
                if (!hasUserSentMessage) {
                    hasUserSentMessage = true;
                    promptSuggestionsContainer.style.display = 'block';
                    // Display placeholder prompts for initial suggestions
                    displayPlaceholderPrompts();
                }
            }, 5000); // 5 seconds delay
        }
    } catch (error) {
        console.error('Error verifying API key:', error);
    } finally {
        verifyKeyButton.disabled = false;
        verifyKeyButton.textContent = 'Verify Key';
    }
});

// Handle Enter key on API key input
apiKeyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        verifyKeyButton.click();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatInput.value = '';
        
        if (!apiKey) {
            // If no API key, just show the API key dialog
            apiKeyContainer.style.display = 'flex';
            return;
        }
        
        // Show prompt suggestions after first message if not already shown
        if (!hasUserSentMessage) {
            hasUserSentMessage = true;
            promptSuggestionsContainer.style.display = 'block';
            // Display placeholder prompts for initial suggestions
            displayPlaceholderPrompts();
        }
        
        sendToAI(message);
    }
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    
    // Create message content without timestamp for user messages
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;
    
    // Add "Send to Figma" button for system messages
    if (type === 'system') {
        // Create the send to Figma button
        const sendToFigmaButton = document.createElement('button');
        sendToFigmaButton.className = 'send-to-figma';
        sendToFigmaButton.title = 'Send to Figma';
        sendToFigmaButton.setAttribute('data-tooltip', 'Send to Figma');
        sendToFigmaButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z"/>
            </svg>
        `;
        
        // Add click event to send content to Figma
        sendToFigmaButton.addEventListener('click', () => {
            // Get the message content
            const messageContent = messageDiv.querySelector('.message-content');
            const textContent = messageContent.textContent;
            const htmlContent = messageContent.innerHTML;
            
            // Send to Figma
            parent.postMessage({ 
                pluginMessage: { 
                    type: 'create-text-frame', 
                    text: textContent,
                    html: htmlContent
                } 
            }, '*');
            
            // No popup notification - Figma will show its own notification
        });
        
        // Add the button to the message
        messageDiv.appendChild(sendToFigmaButton);
    }
    
    // Add message to chat
    chatMessages.appendChild(messageDiv);
    
    // Add timestamp for user messages only, but outside the bubble
    if (type === 'user') {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const timestamp = `${hours}:${minutes}`;
        
        const timestampDiv = document.createElement('div');
        timestampDiv.classList.add('message-timestamp');
        timestampDiv.style.textAlign = 'right';
        timestampDiv.textContent = timestamp;
        
        chatMessages.appendChild(timestampDiv);
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update the sendToAI function to handle markdown tables
async function sendToAI(message) {
    try {
        // Disable chat input and send button while generating
        const chatInput = document.querySelector('.chat-input');
        const sendButton = document.getElementById('sendButton');
        chatInput.disabled = true;
        sendButton.disabled = true;
        chatInput.placeholder = 'AI is generating...';
        
        // Show typing indicator
        const aiMessageElement = document.createElement('div');
        aiMessageElement.classList.add('message', 'system');
        aiMessageElement.innerHTML = `<div class="message-content typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>`;
        chatMessages.appendChild(aiMessageElement);
        
        // Initialize user scroll tracking
        let userHasScrolled = false;
        
        // Add scroll event listener to detect manual scrolling
        const scrollHandler = () => {
            // If user scrolls up during generation, mark as manually scrolled
            if (chatMessages.scrollTop < chatMessages.scrollHeight - chatMessages.clientHeight - 10) {
                userHasScrolled = true;
            }
        };
        
        chatMessages.addEventListener('scroll', scrollHandler);
        
        // Initial scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Check if this is a prompt from the tabs (Persona or Style Guide)
        const isPromptTabMessage = message.startsWith("I need to create a realistic persona") || 
                                  message.startsWith("Please generate a comprehensive style guide");
        
        // Get conversation history for context (only if not a prompt tab message)
        let conversationHistory = [];
        
        if (!isPromptTabMessage) {
            const messages = document.querySelectorAll('.message');
            
            const maxMessages = 20; // Increase from 10 to 20 messages for better context
            let count = 0;
            let foundProjectOverview = false;
            
            for (let i = messages.length - 1; i >= 0 && count < maxMessages; i--) {
                const message = messages[i];
                // Skip the typing indicator we just added
                if (message === aiMessageElement) continue;
                
                // Get the message content element specifically
                const messageContentElement = message.querySelector('.message-content');
                if (!messageContentElement) continue;
                
                // Skip typing indicators
                if (!messageContentElement.querySelector('.typing-indicator')) {
                    // Extract text from the message content element only
                    const text = messageContentElement.textContent.trim();
                    
                    // Check if this is the project overview message
                    if (text.includes('Project Information Sent')) {
                        foundProjectOverview = true;
                        continue; // Skip the project overview message itself
                    }
                    
                    // Only include messages after the project overview was sent
                    if (!projectOverviewSentToChat || (projectOverviewSentToChat && foundProjectOverview)) {
                        // Clean the text to remove any UI elements text that might be included
                        const cleanedText = cleanMessageContent(text);
                        
                        // Only add non-empty messages
                        if (cleanedText) {
                            // Map 'system' class to 'assistant' role for OpenAI API
                            const type = message.classList.contains('user') ? 'user' : 'assistant';
                            conversationHistory.unshift({
                                role: type,
                                content: cleanedText
                            });
                            count++;
                        }
                    }
                }
            }
        }
        
        // Only include project context if it has been explicitly sent to the chat
        let projectContext = '';
        if (projectOverviewSentToChat) {
            projectContext = `
Current project: ${projectData.projectName || 'Untitled Project'}

1. Project Description:
${projectData.projectDescription || 'Not specified'}

2. Target Audience:
${projectData.targetAudience || 'Not specified'}

3. Project Type:
${projectData.projectType || 'Not specified'}

4. Main Goal:
${projectData.mainGoals.length ? projectData.mainGoals.join(', ') : 'Not specified'}

5. Design Style:
${projectData.designStyle.length ? projectData.designStyle.join(', ') : 'Not specified'}

6. Figma Experience:
${projectData.figmaExperience || 'Not specified'}

7. Complexity:
${projectData.complexity || 'Not specified'}

8. Purposes:
${projectData.purposes || 'Not specified'}

9. Design Stage:
${projectData.designStage || 'Not specified'}

10. Additional Guidelines:
${projectData.guidelines || 'Not specified'}
`;
        }

        // Enhanced system prompt with project context
        const systemPrompt = `You are a (Western-)European AI UI/UX Design Assistant integrated into a Figma plugin named PromptlyUI. 
        About you:
        - As an expert in UI/UX principles and Figma, provide users with specific, actionable design advice. Use markdown formatting for better readability. 
        - DO NOT give ANY introductions or conclusions to your responses. ESPECIALLY NEVER when asked to directly generate something (e.g. Style Guide, Persona).
        - Plugin functionalities: An AI chat as an assistance for the design workflow in Figma with constant question suggestions after each AI response. When the user hovers over each response a small purple arrow appears at the bottom right, and with this arrow the user can send the generated answer to Figma. At the top you see a plus and a minus with the number 100% where you can can zoom in and out for beter readability. The two pill shaped tabs above the chat input are topic and prompt suggestions which you can regenerate with the button next to it. The other section besides "Chat" is called "Prompts" and here the user can put in their project information so the system has a better overview of the scope of the project. Also a there is a prompt library category with dropdown menus where you can find premade prompts, which you can edit, copy, save and send the AI chat. And lastly there is a category called generate prompts where the user can fill in a topic and the system will generate prompt suggestions for that topic. The user can choose to include their project information in this prompt generation.
        - When the user asks about the functionalities of the plugin give a clear overview of the two main features: AI chat and Prompts. Elaborate first on the features of the chat then of every category behind the Prompts section. VERY IMPORTANT: emphasize the user should do the "Getting Started" survey first so the system can better understand the scope of the project!
        - The name of your creator is Daphne Varekamp, she developed the Figma plugin for her masters degree (called Media Technology) at Leiden University.
        - Try to include more international and non Northen American examples in your responses.

        About the project:
${projectContext}

${isPromptTabMessage ? 
  'This is a direct request to generate content based on the project information. Provide a detailed and concise response without elaborate jargon and filler text.' : 
  (projectOverviewSentToChat ? 
    'Always keep this project context in mind when responding. Your advice should be specifically tailored to this project, its goals, audience, and design stage. Refer back to relevant aspects of the project context in your responses.' : 
    'The user has not shared any project information yet. Provide general UI/UX advice or ask for more specific details about their project to give more tailored recommendations.')}`;
        
        // Prepare messages array for the API request
        let apiMessages = [
            {
                role: 'system',
                content: systemPrompt
            }
        ];
        
        // Add conversation history to the messages array only if not a prompt tab message
        if (!isPromptTabMessage && conversationHistory.length > 0) {
            console.log('Conversation history collected:', conversationHistory);
            apiMessages = apiMessages.concat(conversationHistory);
        } else {
            console.log('No conversation history included');
        }
        
        // Add the current message
        apiMessages.push({
            role: 'user',
            content: message
        });
        
        console.log('Final API messages:', apiMessages);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 1000,
                stream: true
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || `API Error (${response.status})`;
            throw new Error(errorMessage);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let responseText = '';
        
        // Remove typing indicator and prepare for actual content
        aiMessageElement.innerHTML = '<div class="message-content"></div>';
        const messageContent = aiMessageElement.querySelector('.message-content');
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                // Add the "Send to Figma" button after the response is complete
                const sendToFigmaButton = document.createElement('button');
                sendToFigmaButton.className = 'send-to-figma';
                sendToFigmaButton.title = 'Send to Figma';
                sendToFigmaButton.setAttribute('data-tooltip', 'Send to Figma');
                sendToFigmaButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 13h11.17l-4.88 4.88c-.39.39-.39 1.03 0 1.42.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41l-6.58-6.6c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L16.17 11H5c-.55 0-1 .45-1 1s.45 1 1 1z"/>
                    </svg>
                `;
                
                // Add click event to send content to Figma
                sendToFigmaButton.addEventListener('click', () => {
                    // Get the message content
                    const textContent = messageContent.textContent;
                    const htmlContent = messageContent.innerHTML;
                    
                    // Send to Figma
                    parent.postMessage({ 
                        pluginMessage: { 
                            type: 'create-text-frame', 
                            text: textContent,
                            html: htmlContent
                        } 
                    }, '*');
                    
                    // No popup notification - Figma will show its own notification
                });
                
                // Add the button to the message
                aiMessageElement.appendChild(sendToFigmaButton);
                
                // Add a suggestion bubble with a follow-up question
                addSuggestionBubble(aiMessageElement);
                
                // Only scroll to bottom when the response is complete
                chatMessages.scrollTop = chatMessages.scrollHeight;
                break;
            }
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                        const json = JSON.parse(line.slice(5));
                        const content = json.choices[0].delta.content;
                        if (content) {
                            responseText += content;
                            const formattedResponse = responseText
                                // Headers (update order to handle #### first)
                                .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
                                .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                                .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                                .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                                // Remove !Color Palette links and variations
                                .replace(/!Color Palette/gi, 'Color Palette')
                                .replace(/!color palette/gi, 'Color Palette')
                                // Wrap plain text in paragraphs
                                .replace(/^(?!<[h|p|ul|ol|li|div|code|table|thead|tbody|tr|th|td])(.*?)$/gm, '<p>$1</p>')
                                // Bold and Italic
                                .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                // Code
                                .replace(/`([^`]+)`/g, '<code>$1</code>')
                                // Lists
                                .replace(/^\d+\.\s+(.*?)$/gm, '<div class="list-item">$1</div>')
                                .replace(/^[-*]\s+(.*?)$/gm, '<div class="list-item">• $1</div>')
                                // Links
                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                                // Color codes - Hex (both #fff and #ffffff formats)
                                .replace(/(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))\b/g, '<span class="color-preview" style="background-color: $1; display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 4px; vertical-align: middle; border: 1px solid #ccc;"></span><span class="color-code">$1</span>')
                                // Color codes - RGB/RGBA
                                .replace(/(rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0?\.\d+|1(\.0)?)\))/g, function(match) {
                                    return `<span class="color-preview" style="background-color: ${match}; display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 4px; vertical-align: middle; border: 1px solid #ccc;"></span><span class="color-code">${match}</span>`;
                                })
                                // Horizontal Rules
                                .replace(/^---+$/gm, '<hr>')
                                .replace(/^===+$/gm, '<hr>')
                                .replace(/^\*\*\*+$/gm, '<hr>')
                                // Tables - improved handling
                                .replace(/^\|(.*)\|$/gm, function(match, content) {
                                    // Split the table row by pipes
                                    const cells = content.split('|').map(cell => cell.trim());
                                    // Check if this is a header separator row
                                    if (cells.every(cell => /^:?-+:?$/.test(cell))) {
                                        return ''; // Skip separator rows
                                    }
                                    // Create table cells
                                    const cellsHtml = cells.map(cell => `<td>${cell}</td>`).join('');
                                    return `<tr>${cellsHtml}</tr>`;
                                })
                                // Wrap tables with proper table structure
                                .replace(/(<tr>.*?<\/tr>)\s*(<tr>.*?<\/tr>)/gs, function(match, headerRow, bodyRows) {
                                    return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
                                })
                                // Line breaks
                                .replace(/\n\n/g, '<br><br>')
                                .replace(/\n/g, '<br>');
                            
                            messageContent.innerHTML = formattedResponse;
                        }
                    } catch (e) {
                        console.error('Error parsing chunk:', e);
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('Error sending to AI:', error);
        
        // Remove typing indicator if it exists
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.parentElement.remove();
        }
        
        // Add specific error message
        let errorMessage = 'API Error. Please check your API key and try again.';
        
        if (error.message.includes('API key')) {
            errorMessage = 'Invalid API key. Please verify your API key and try again.';
        } else if (error.message.includes('billing')) {
            errorMessage = 'Billing issue with your OpenAI account. Please check your billing status.';
        } else if (error.message.includes('rate limit')) {
            errorMessage = 'Rate limit exceeded. Please try again in a few moments.';
        } else if (error.message.includes('model')) {
            errorMessage = 'The requested model is unavailable. Please try a different model.';
        } else if (error.message.includes('network')) {
            errorMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        addMessage(`Error: ${errorMessage}`, 'system');
    } finally {
        // Re-enable chat input and send button, and restore placeholder
        const chatInput = document.querySelector('.chat-input');
        const sendButton = document.getElementById('sendButton');
        chatInput.disabled = false;
        sendButton.disabled = false;
        chatInput.placeholder = 'Type your message...';
    }
}

// Add this function near the top with other initialization functions
function displayPlaceholderPrompts() {
    // Check if project data is filled in
    const hasProjectData = projectData.projectType !== '' || 
                          projectData.projectDescription !== '' || 
                          projectData.targetAudience !== '';
    
    // Function to process placeholders in text
    const processPlaceholders = (text) => {
        // Replace common placeholders with project data if available
        return text
            .replace(/\[describe product\/service\/platform\]/g, hasProjectData && projectData.projectType !== '' ? 
                projectData.projectType : 
                '<span style="color:var(--main-purple)">[describe product/service/platform]</span>')
            
            .replace(/\[specific problem or market need\]/g, hasProjectData && projectData.projectDescription !== '' ? 
                `${projectData.projectDescription.split('.')[0]}` : 
                '<span style="color:var(--main-purple)">[specific problem or market need]</span>')
            
            .replace(/\[specific purpose\]/g, hasProjectData && projectData.mainGoals.length ? 
                projectData.mainGoals[0] : 
                '<span style="color:var(--main-purple)">[specific purpose]</span>')
            
            .replace(/\[target audience characteristics\]/g, hasProjectData && projectData.targetAudience !== '' ? 
                projectData.targetAudience : 
                '<span style="color:var(--main-purple)">[target audience characteristics]</span>');
    };
    
    let placeholderSuggestions = [];
    
    // Different prompts based on whether project overview has been sent to chat
    if (projectOverviewSentToChat) {
        // Persona prompt with project data incorporated - NO conversation history
        const personaPrompt = `I need to create a realistic persona for a [${projectData.projectType || 'my project'}] focused on [${projectData.mainGoals.length ? projectData.mainGoals.join(' and ') : 'improving user experience'}]. 
This is the project description: [${projectData.projectDescription || 'No project description provided'}].
Please generate one detailed persona that represents [${projectData.targetAudience || 'my target audience'}] with the following details:<br>

• Demographic: Name, age, occupation, and location <br>
• Personal: background and lifestyle <br>
• Personality (traits)<br>
• Hobbies (and interests) <br>
• Goals (and motivations) <br>
• Challenges (and pain points they face) <br>
• Considerations: Decision-making factors when choosing [${projectData.projectDescription || 'No project description provided'}] <br>
• Product interaction: How they might interact with an [${projectData.projectType}] <br>
• Quote: A unique deep quote <br>

Important: separate these topics by clear and short headings + paragraphs/lists. Make the persona have a CONSISTENT age and personality throughout. Be detailed, yet concise.`;

        // Style guide prompt with project data incorporated - NO conversation history
        const styleGuidePrompt = `Please generate a comprehensive style guide for a [${projectData.projectType || 'product'}]] with a[ [${projectData.designStyle.length ? projectData.designStyle.join('/') : 'modern]'}] design approach. Our target audience [is [${projectData.targetAudience || 'our use]rs'}] and our main goals inc[lude [${projectData.mainGoals.length ? projectData.mainGoals.join(' and ') : 'usability and engage]ment'}].

This guide should include:<br>
• Brand Tone & Voice: Writing style, formality level, and messaging tone that resonates with [${projectData.targetAudience || 'our users'}] and aligns with our [${projectData.designStyle.length ? projectData.designStyle.join('/') : 'modern'}] approach.<br>
• Typography: Approved fonts and their applications that support [${projectData.mainGoals.length ? projectData.mainGoals.join(' and ') : 'usability and engagement'}]<br>
• Color Palette: For example background, primary, secondary, accent, hover colors WITH hex codes, but also think about colors for specific features that reflect design direction<br>
• Imagery: Guidelines for photographs, illustrations, graphs and other visual content that appeal to [${projectData.targetAudience || 'our users'}]<br>
• Headings and Subheadings: Guidelines for hierarchy and formatting that enhance [${projectData.mainGoals.length ? projectData.mainGoals[0] : 'user experience'}]<br>
• Buttons: Styles (filled, outlined, text), sizes, and interaction states (default, hover, pressed, disabled) optimized for [${projectData.projectType || 'our product'}]<br>
• Forms & Inputs: Text fields, dropdowns, checkboxes, radio buttons, sliders that align with [${projectData.designStyle.length ? projectData.designStyle.join('/') : 'modern'}] standards<br>
• Navigation: Bottom tab bar, side menu, breadcrumbs, gestures designed for [${projectData.targetAudience || 'our users'}]'s needs<br>
• Cards & Containers: Usage, padding, borders, and shadowing that complement our [${projectData.designStyle.length ? projectData.designStyle.join('/') : 'modern'}] aesthetic<br>
• Gestures: Swipe, tap, long press, pinch, and drag behaviors suited to [${projectData.targetAudience || 'our users'}]'s tech comfort level<br>
• Best practices to ensure content is accessible to all users, particularly considering [${projectData.targetAudience || 'our target audience'}]<br>

Be detailed, yet concise.`;

        placeholderSuggestions = [
            {
                title: "Persona",
                prompt: personaPrompt
            },
            {
                title: "Style Guide",
                prompt: styleGuidePrompt
            }
        ];
    } else {
        // Default prompts when no project overview has been sent - NO conversation history
        placeholderSuggestions = [
        {
            title: "Persona",
                prompt: processPlaceholders("I need to create a realistic persona for a [specific purpose]. Please generate one detailed persona that includes: demographic information, personal background, hobbies, goals and motivations, pain points and challenges, daily routine, and technology usage. The persona should represent [target audience characteristics] and have a consistent personality throughout. Important: show this information of all these items by headings + paragraphs/lists. Be detailed, yet concise.")
            },
            {
                title: "Style Guide",
                prompt: processPlaceholders(`Please generate a comprehensive style guide for [describe product/service/platform]. This guide should include:<br>
• Brand Tone & Voice: Writing style, formality level, and messaging tone<br>
• Typography: Approved fonts and their applications<br>
• Color Palette: For example background, primary, secondary, accent, hover, colors etc. with hex codes<br>
• Imagery: Guidelines for photographs, illustrations, graphs and other visual content<br>
• Headings and Subheadings: Guidelines for hierarchy and formatting<br>
• Buttons: Styles (filled, outlined, text), sizes, and interaction states (default, hover, pressed, disabled)<br>
• Forms & Inputs: Text fields, dropdowns, checkboxes, radio buttons, sliders<br>
• Navigation: Bottom tab bar, side menu, breadcrumbs, gestures<br>
• Cards & Containers: Usage, padding, borders, and shadowing<br>
• Gestures: Swipe, tap, long press, pinch, and drag behaviors<br>
• Best practices to ensure content is accessible to all users<br><br>

Be detailed, yet concise.`)
            }
        ];
    }
    
    updatePromptSuggestionTabs(placeholderSuggestions);
}

function updatePromptSuggestionTabs(suggestions) {
    const promptSuggestionsContainer = document.getElementById('promptSuggestions');
    promptSuggestionsContainer.innerHTML = '';
    
    // Limit to exactly 2 suggestions
    const displaySuggestions = suggestions.slice(0, 2);
    
    // Create a tab for each suggestion
    displaySuggestions.forEach(suggestion => {
        // Limit title to two words and ensure it's not too long
        let title = suggestion.title.split(' ').slice(0, 2).join(' ');
        // If title is still too long, truncate it
        if (title.length > 15) {
            title = title.substring(0, 15) + '...';
        }
        
        const tab = document.createElement('div');
        tab.className = 'prompt-tab';
        tab.innerHTML = `
            <div class="prompt-tab-header">${title}</div>
        `;
        
        tab.addEventListener('click', () => {
            showPromptPopup(suggestion.title, suggestion.prompt, false);
        });
        
        promptSuggestionsContainer.appendChild(tab);
    });
}

// Add a function to show prompt suggestion tabs with loading animation
function showPromptSuggestionTabsWithLoading() {
    const promptSuggestionsContainer = document.querySelector('.prompt-suggestions-container');
    if (promptSuggestionsContainer) {
        promptSuggestionsContainer.style.display = 'block';
    }
    
    const promptSuggestionsElement = document.getElementById('promptSuggestions');
    promptSuggestionsElement.innerHTML = '';
    
    // Create loading animation for tabs
    for (let i = 0; i < 2; i++) {
        const loadingTab = document.createElement('div');
        loadingTab.className = 'prompt-tab';
        loadingTab.innerHTML = `
            <div class="prompt-tab-header">
                <div class="loading-dot-container" style="display: flex; justify-content: center; padding: 4px 0;">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        `;
        promptSuggestionsElement.appendChild(loadingTab);
    }
    
    // Make the prompt suggestions row visible
    const promptSuggestionsRow = document.querySelector('.prompt-suggestions-row');
    if (promptSuggestionsRow) {
        promptSuggestionsRow.style.display = 'flex';
    }
}

// Update the showPromptPopup function to move the close button to the popup itself and improve the save button styling.
function showPromptPopup(title, prompt, isProjectOverview = false) {
    const overlay = document.createElement('div');
    overlay.className = 'prompt-overlay';
    
    // Format the prompt content to preserve line breaks and lists
    const formattedPrompt = prompt
        .replace(/\[([^\]]+)\]/g, '<span style="color:var(--main-purple)">[$1]</span>') // Color bracket placeholders
        .replace(/\n\n/g, '</p><p>') // Convert double line breaks to paragraphs
        .replace(/\n([0-9]+\.|•)/g, '</p><p>$1') // Preserve list items
        .replace(/\n/g, '<br>') // Convert single line breaks to <br>
        .replace(/^/, '<p>') // Add opening paragraph
        .replace(/$/, '</p>'); // Add closing paragraph
    
    const popup = document.createElement('div');
    popup.className = 'prompt-popup';
    if (isProjectOverview) {
        popup.setAttribute('data-is-project-overview', 'true');
    }
    
    // Create the popup HTML - hide regenerate button for project overview
    popup.innerHTML = `
        <div style="position: relative;">
            <button class="close-prompt" style="position:absolute;top:0;right:0;background:none;border:none;font-size:24px;cursor:pointer;color:var(--light-gray);">×</button>
            <h3 style="margin-top: 0; padding-right: 24px; color: var(--white-1); font-size: var(--fs-4);">${title}</h3>
        </div>
        <div class="prompt-content" contenteditable="false">${formattedPrompt}</div>
        <div class="prompt-actions">
            ${isProjectOverview ? '' : `
            <button class="regenerate-prompt" data-tooltip="Regenerate">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            `}
            <button class="copy-prompt" data-tooltip="Copy">
                <svg class="copy-text" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg class="copied-text" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="send-to-chat" data-tooltip="Send to chat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="edit-button" data-tooltip="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="save-button" data-tooltip="Save" style="display: none; background: var(--eerie-black-1); border-color: var(--main-purple); color: var(--main-purple);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    const promptContent = popup.querySelector('.prompt-content');
    const editButton = popup.querySelector('.edit-button');
    const saveButton = popup.querySelector('.save-button');
    const regenerateButton = popup.querySelector('.regenerate-prompt');
    
    // Close button handler
    popup.querySelector('.close-prompt').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    
    // Regenerate button handler - only add if the button exists
    if (regenerateButton) {
    regenerateButton.addEventListener('click', () => {
        // Show loading state in the prompt content
        const originalPrompt = promptContent.innerHTML;
        promptContent.innerHTML = `
            <div class="loading-dot-container" style="margin: 20px auto;">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        `;
        
        // Generate a new prompt based on the title
        generateSinglePrompt(title)
            .then(newPrompt => {
                    // Format the new prompt with purple brackets
                    const formattedPrompt = newPrompt
                        .replace(/\[([^\]]+)\]/g, '<span style="color:var(--main-purple)">[$1]</span>')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n([0-9]+\.|•)/g, '</p><p>$1')
                        .replace(/\n/g, '<br>')
                        .replace(/^/, '<p>')
                        .replace(/$/, '</p>');
                    
                    promptContent.innerHTML = formattedPrompt;
            })
            .catch(error => {
                console.error('Error regenerating prompt:', error);
                promptContent.innerHTML = originalPrompt;
            });
    });
    }
    
    // Copy button handler
    popup.querySelector('.copy-prompt').addEventListener('click', () => {
        // Create a temporary textarea element to handle the copying
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = promptContent.textContent;
        // Make the textarea invisible
        tempTextArea.style.position = 'absolute';
        tempTextArea.style.left = '-9999px';
        tempTextArea.style.top = '0';
        tempTextArea.style.opacity = '0';
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        
        try {
            // Execute the copy command
            document.execCommand('copy');
            
            // Visual feedback
            const copyBtn = popup.querySelector('.copy-prompt');
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
            }, 2000);
            
            console.log('Prompt copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        } finally {
            // Remove the temporary element
            document.body.removeChild(tempTextArea);
        }
    });
    
    // Send to chat button handler
    popup.querySelector('.send-to-chat').addEventListener('click', () => {
        // Switch to chat tab
        document.querySelector('.nav-tab[data-section="chat"]').click();
        
        if (isProjectOverview) {
            // Set flag to indicate project overview has been sent to chat
            projectOverviewSentToChat = true;
            
            // Add the special project information messages
            addMessage('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Project Information Sent', 'user'); 
            addMessage('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Received', 'system');
            
            // Show prompt suggestion tabs with loading animation
            showPromptSuggestionTabsWithLoading();
            
            // Update placeholder prompts to use project data
            displayPlaceholderPrompts();
        } else {
            // For regular prompts, add the message to the chat input and send it
            const chatInput = document.querySelector('.chat-input');
            if (chatInput) {
                chatInput.value = promptContent.textContent;
                chatInput.disabled = false;
                
                // Focus the chat input
                setTimeout(() => {
        chatInput.focus();
                    
                    // Simulate pressing Enter to send the message
                    const event = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        which: 13,
                        keyCode: 13,
                        bubbles: true
                    });
                    
                    chatInput.dispatchEvent(event);
                }, 100);
            }
        }
        
        // Close the popup
        document.body.removeChild(overlay);
    });
    
    // Edit button handler
    editButton.addEventListener('click', () => {
        promptContent.contentEditable = 'true';
        promptContent.focus();
        editButton.style.display = 'none';
        saveButton.style.display = 'inline-flex';
    });
    
    // Save button handler
    saveButton.addEventListener('click', () => {
        promptContent.contentEditable = 'false';
        saveButton.style.display = 'none';
        editButton.style.display = 'inline-flex';
    });
}

// Add a new function to generate a single prompt based on a title
async function generateSinglePrompt(title) {
    // Check if API key is available
    if (!apiKey) {
        // Show API key dialog if no key is available
        apiKeyContainer.style.display = 'flex';
        return '';
    }
    
    try {
        // Check if project overview button has been clicked
        const projectOverviewButton = document.querySelector('#projectOverviewButton');
        const hasProjectData = projectOverviewButton ? projectOverviewButton.classList.contains('clicked') : false;
        
        // Prepare context for generating a single prompt
        const context = {
            projectName: projectData.projectName || 'Untitled Project',
            projectType: projectData.projectType || '',
            designStage: projectData.designStage || '',
            targetAudience: projectData.targetAudience || '',
            mainGoals: projectData.mainGoals || [],
            projectDescription: projectData.projectDescription || '',
            designStyle: projectData.designStyle || [],
            complexity: projectData.complexity || '',
            purposes: projectData.purposes || ''
        };
        
        // Get conversation history for context
        const messages = document.querySelectorAll('.message');
        let conversationHistory = [];
        
        const maxMessages = 20; // Increase from 10 to 20 messages for better context
        let count = 0;
        for (let i = messages.length - 1; i >= 0 && count < maxMessages; i--) {
            const message = messages[i];
            // Map 'system' class to 'assistant' role for OpenAI API
            const type = message.classList.contains('user') ? 'user' : 'assistant';
            
            // Get the message content element specifically
            const messageContentElement = message.querySelector('.message-content');
            if (!messageContentElement) continue;
            
            // Skip typing indicators
            if (!messageContentElement.querySelector('.typing-indicator')) {
                // Extract text from the message content element only
                const text = messageContentElement.textContent.trim();
                
                // Clean the text to remove any UI elements text that might be included
                const cleanedText = cleanMessageContent(text);
                
                // Only add non-empty messages
                if (cleanedText) {
                conversationHistory.unshift({
                        role: type === 'user' ? 'user' : 'assistant',
                        content: cleanedText
                });
                count++;
                }
            }
        }
        
        console.log('Conversation history for prompt generation:', conversationHistory);
        
        let systemContent, userContent;
        
        if (!hasProjectData) {
            // Generic system prompt if survey not filled in
            systemContent = `You generate prompt suggestions to ask an AI chat in a Plugin in Figma.
            Generate a detailed prompt which I can send to a large language model based on the given title.
            
            IMPORTANT GUIDELINES:
            1. Focus on general UI/UX design principles and best practices useful for within the Figma design environment (for example: make a persona, style guide, etc.).
            2. Include context suggestions in brackets (for example: for [platform], describe [target group], etc.)
            3. Ensure the prompt avoids using terms such as 'build,' 'design,' 'develop,' that insinuate building and focus on 'create' or 'generate' as the GPT can only reply with text.
            4. Make the prompts concise, and end every prompt with "Be detailed, yet concise"
            5. Try to make the prompts relevant to the conversation. For example, elaborate on previous answers and take them into account, but don't duplicate them.
            
            Respond with ONLY the prompt text, no additional commentary.`;
            
            userContent = `Generate a prompt for this topic: "${title}"
            
            Recent conversation history: ${JSON.stringify(conversationHistory)}

            Remember the guidelines.`;
        } else {
            // Project-specific system prompt if survey is filled in
            systemContent = `You generate prompt suggestions to ask an AI chat in a Plugin in Figma.
            Generate a detailed prompt which I can send to a large language model based on the given title.
            
            IMPORTANT GUIDELINES:
            1. Focus on the PROJECT CONTEXT provided, e.g. "For a ${context.projectType} project targeting ${context.targetAudience}, how...".
            2. Ensure the prompt avoids using terms such as 'build,' 'design,' 'develop,' that insinuate building and focus on 'create' or 'generate' as the GPT can only reply with text.
            3. Make the prompt concise, and end every prompt with "Be detailed, yet concise"
            4. DIRECTLY REFERENCE specific project details in your prompt, such as:
               - "Considering that this project is for ${context.targetAudience || 'your target audience'}, could you..."
               - "Given that the project is in the ${context.designStage || 'current'} stage, how might..."
               - "With the goal of ${context.mainGoals.length ? context.mainGoals[0] : 'improving user experience'}, what..."
            5. Try to make the prompts relevant to the project conversation. For example, elaborate on previous answers and take them into account, but don't duplicate them.
            
            Respond with ONLY the prompt text, no additional commentary.`;
            
            userContent = `Generate a prompt for this topic: "${title}", take into consideration this project context: ${JSON.stringify(context)}
            
            Recent conversation history: ${JSON.stringify(conversationHistory)}

            Remember the guidelines.`;
        }
        
        // Call OpenAI to generate a single prompt based on the title
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: systemContent
                    },
                    {
                        role: 'user',
                        content: userContent
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating prompt:', error);
        return `I couldn't generate a new prompt for "${title}". Please try again later.`;
    }
}

// Update the generatePromptSuggestions function to default the project overview button clicked state to negative/turned off
async function generatePromptSuggestions(userMessage, aiResponse) {
    try {
        // Show loading state in the tabs
        updatePromptSuggestionsLoadingState();
        
        // Get the last few messages to identify recent topics
        const messages = document.querySelectorAll('.message');
        let recentTopics = [];
        
        // Extract potential topics from recent messages (last 3 user messages)
        let userMessageCount = 0;
        for (let i = messages.length - 1; i >= 0 && userMessageCount < 3; i--) {
            const message = messages[i];
            if (message.classList.contains('user')) {
                const text = message.textContent.trim().toLowerCase();
                // Extract potential topics (nouns and key terms)
                const words = text.split(/\s+/);
                for (const word of words) {
                    if (word.length > 4 && !recentTopics.includes(word)) {
                        recentTopics.push(word);
                    }
                }
                userMessageCount++;
            }
        }
        
        // Check if project data is filled in (default to false)
        const projectOverviewButton = document.querySelector('#projectOverviewButton');
        const hasProjectData = projectOverviewButton ? projectOverviewButton.classList.contains('clicked') : false;
        
        // Prepare context for generating suggestions with emphasis on project details
        const projectContext = {
            name: projectData.projectName || '',
            description: projectData.projectDescription || '',
            type: projectData.projectType || '',
            stage: projectData.designStage || '',
            audience: projectData.targetAudience || '',
            goals: projectData.mainGoals || [],
            style: projectData.designStyle || [],
            experience: projectData.figmaExperience || '',
            complexity: projectData.complexity || '',
            purposes: projectData.purposes || ''
        };
        
        // Latest conversation for context, but with less emphasis
        const conversationContext = {
            userMessage: userMessage,
            aiResponse: aiResponse.substring(0, 200) + (aiResponse.length > 200 ? '...' : ''),
            recentTopics: recentTopics
        };
        
        let systemContent, userContent;
        
        if (hasProjectData) {
            // Project-specific suggestions if survey is filled in
            systemContent = `You generate prompt suggestions to ask an AI chat in a Plugin in Figma.
            Generate a detailed prompt which I can send to a large language model based on the given title.
            Generate two prompts based on the project context, make the first one elaborate and the second one concise.
            
            Your response must be in this exact JSON format:
            [
                {
                    "title": "Short title (1-2 words)",
                    "prompt": "Detailed prompt text"
                },
                {
                    "title": "...",
                    "prompt": "..."
                }
            ]
            
            IMPORTANT GUIDELINES:
            1. Focus on the PROJECT CONTEXT.
            2. Generate DIVERSE suggestions that cover DIFFERENT aspects of the project.
            3. AVOID suggesting topics similar to the recent conversation topics: ${recentTopics.join(', ')}.
            4. Ensure the prompts avoid using terms such as 'create,' 'build,' 'design,' 'develop,' or any language that implies direct design actions.
            5. Make the prompts detailed yet concise.
            6. Keep titles very short (1-2 words).
            7. DIRECTLY REFERENCE specific project details in your prompts, such as:
               - "With this project description ${projectData.projectDescription || 'No project description provided'}, ..."
               - "Considering that this project is for ${projectData.targetAudience || 'the target audience'}, could you..."
               - "Given that the project is in the ${projectData.designStage || 'current'} stage, how might..."
               - "With the goal of ${projectData.mainGoals.length ? projectData.mainGoals[0] : 'improving user experience'}, what..."
               - "For a ${projectData.projectType || 'design'} project with ${projectData.complexity || 'this complexity'}, how..."
            
            Do not include any text outside of the JSON array.`;
            
            userContent = `Generate two DIVERSE prompt suggestions based on this project context: ${JSON.stringify(projectContext)}
            
            Recent conversation (for reference only, DO NOT focus solely on this): ${JSON.stringify(conversationContext)}
            
            Remember to:
            1. Suggest topics DIFFERENT from the recent conversation
            2. Cover varied aspects of the project
            3. DIRECTLY REFERENCE specific project details in your prompts (target audience, project type, design stage, goals, etc.)
            4. Frame questions in a way that acknowledges the specific project context, like "Given that you're designing for ${projectData.targetAudience || 'your audience'}..." or "Considering this is a ${projectData.projectType || 'design'} project..."`;
        } else {
            // Generic UI/UX suggestions if survey not filled in
            systemContent = `You generate prompt suggestions to ask an AI chat in a Plugin in Figma.
            Generate a detailed prompt which I can send to a large language model based on the given title.
            Generate two prompts based on the project context, make the first one elaborate and the second one concise.
            
            Your response must be in this exact JSON format:
            [
                {
                    "title": "Short title (1-2 words)",
                    "prompt": "Detailed prompt text"
                },
                {
                    "title": "...",
                    "prompt": "..."
                }
            ]
            
            IMPORTANT GUIDELINES:
            1. Focus on general UI/UX design principles which are relevant to ask a large language model within the Figma design environment (for example: make a persona, style guide, etc.).
            2. Include context suggestions in brackets (for example: for [platform], describe [target group], etc.)
            3. Generate DIVERSE suggestions that cover DIFFERENT aspects of design.
            4. AVOID suggesting topics similar to the recent conversation topics: ${recentTopics.join(', ')}.
            5. Ensure the prompts avoid using terms such as 'create,' 'build,' 'design,' 'develop,' or any language that implies direct design actions.
            
            Do not include any text outside of the JSON array.`;
            
            userContent = `Generate two DIVERSE prompt suggestions about UI/UX design.`;
        }
        
        // Call OpenAI to generate suggestions
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: systemContent
                    },
                    {
                        role: 'user',
                        content: userContent
                    }
                ],
                temperature: 0.8,
                max_tokens: 1000
            })
        });

        if (!response.ok) throw new Error('Failed to generate suggestions');
        
        const data = await response.json();
        const suggestionsText = data.choices[0].message.content;
        
        // Parse the JSON response
        let suggestions;
        try {
            // Find JSON in the response
            const jsonMatch = suggestionsText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                suggestions = JSON.parse(jsonMatch[0]);
                // Validate the structure of each suggestion
                suggestions = suggestions.map(suggestion => ({
                    title: suggestion.title || 'Design',
                    prompt: suggestion.prompt || 'Could not generate prompt'
                }));
            } else {
                throw new Error('No valid JSON found in response');
            }
        } catch (e) {
            console.error('Error parsing suggestions:', e);
            suggestions = getFallbackSuggestions();
        }
        
        // Update the UI with the suggestions
        updatePromptSuggestionTabs(suggestions);
    } catch (error) {
        console.error('Error generating suggestions:', error);
        updatePromptSuggestionTabs(getFallbackSuggestions());
    }
}

// Show loading state while suggestions are being generated
function updatePromptSuggestionsLoadingState() {
    const promptSuggestionsContainer = document.getElementById('promptSuggestions');
    promptSuggestionsContainer.innerHTML = '';
    
    // Create loading tabs with the same styling as the placeholder tabs
    for (let i = 0; i < 2; i++) {
        const tab = document.createElement('div');
        tab.className = 'prompt-tab';
        tab.style.minWidth = '120px'; // Ensure consistent width with regular tabs
        tab.style.flex = '1'; // Allow it to grow
        tab.innerHTML = `
            <div class="prompt-tab-header">
                <div class="loading-dot-container">
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                    <div class="loading-dot"></div>
                </div>
            </div>
        `;
        promptSuggestionsContainer.appendChild(tab);
    }
}

// Update the getFallbackSuggestions function to remove description
function getFallbackSuggestions() {
    return [
        {
            title: "Help",
            prompt: "I need guidance on my current design challenge. Based on my project context, what would you recommend?"
        },
        {
            title: "Next",
            prompt: "What should be my next steps in this design project based on the information I've shared so far?"
        }
    ];
}

// Show popup with detailed prompt
function showPromptSuggestionPopup(suggestion) {
    const overlay = document.createElement('div');
    overlay.className = 'prompt-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'prompt-suggestion-popup';
    
    popup.innerHTML = `
        <button class="close-prompt" style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:24px;cursor:pointer;color:var(--light-gray);">×</button>
        <h3 class="prompt-suggestion-title">${suggestion.title}</h3>
        <div class="prompt-suggestion-content">${suggestion.description}</div>
        <div class="prompt-text" style="background:var(--eerie-black-2);padding:12px;border-radius:8px;margin-bottom:16px;color:var(--white-2);">${suggestion.prompt}</div>
        <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button class="button copy-button">Copy</button>
            <button class="button button-primary send-prompt-button">Send</button>
        </div>
    `;
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    
    // Add event listeners
    popup.querySelector('.close-prompt').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    
    // Add copy button functionality
    popup.querySelector('.copy-button').addEventListener('click', () => {
        const promptText = popup.querySelector('.prompt-text').textContent;
        
        // Create a temporary textarea element to handle the copying
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = promptText;
        // Make the textarea invisible
        tempTextArea.style.position = 'absolute';
        tempTextArea.style.left = '-9999px';
        tempTextArea.style.top = '0';
        tempTextArea.style.opacity = '0';
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        
        try {
            // Execute the copy command
            document.execCommand('copy');
            
            // Visual feedback
            const copyBtn = popup.querySelector('.copy-button');
            copyBtn.textContent = 'Copied!';
            
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
            
            console.log('Prompt copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        } finally {
            // Remove the temporary element
            document.body.removeChild(tempTextArea);
        }
    });
    
    popup.querySelector('.send-prompt-button').addEventListener('click', () => {
        chatInput.value = suggestion.prompt;
        document.body.removeChild(overlay);
        sendMessage();
    });
    
    // Close when clicking outside the popup
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// Plugin communication
function sendToPlugin(type, data = {}) {
    parent.postMessage({ pluginMessage: { type, ...data } }, '*');
}

// Add back the event listeners
sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea
chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Prompt selection
document.querySelectorAll('.prompt-item').forEach(item => {
    item.addEventListener('click', () => {
        const promptTitle = item.querySelector('.prompt-title')?.textContent || '';
        sendToPlugin('prompt-selected', { promptTitle });
        document.querySelector('.nav-tab[data-section="chat"]').click();
        addMessage(`You've selected the "${promptTitle}" prompt. What details would you like to provide?`, 'system');
    });
});

// Button handlers
document.querySelector('.button-primary').addEventListener('click', () => {
    const projectDescription = document.querySelector('.text-input')?.value || '';
    const designStage = document.querySelector('.option-item.selected .option-label')?.textContent || '';
    const guidelines = document.querySelectorAll('.text-input')[1]?.value || '';
    
    sendToPlugin('questionnaire-complete', {
        data: {
            projectDescription,
            designStage,
            guidelines
        }
    });
    
    document.querySelector('.nav-tab[data-section="chat"]').click();
});

// Project data storage
let projectData = {
    projectName: '',
    projectDescription: '',
    targetAudience: '',
    projectType: '',
    mainGoals: [],
    figmaExperience: '',
    designStyle: [],
    complexity: '',
    purposes: '',
    designStage: '',
    guidelines: ''
};

// Flag to track if project overview has been sent to the chat
let projectOverviewSentToChat = false;

// Handle "Other" option with input field
document.querySelectorAll('.option-item.other').forEach(item => {
    item.addEventListener('click', () => {
        if (item.classList.contains('selected')) {
            // If already selected and has input, just focus on input
            const existingInput = item.querySelector('.other-input');
            if (existingInput) {
                existingInput.focus();
                return;
            }
        }
        
        // Create input field if it doesn't exist
        if (!item.querySelector('.other-input')) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'other-input';
            input.placeholder = 'Please specify';
            
            // Prevent click from toggling selection
            input.addEventListener('click', e => e.stopPropagation());
            
            item.appendChild(input);
            input.focus();
        }
    });
});

  

// Generate project overview
function generateProjectOverview() {
    // Collect data from form
    projectData.projectDescription = document.getElementById('projectDescription').value || '';
    projectData.targetAudience = document.getElementById('targetAudience').value || '';
    projectData.purposes = document.getElementById('purposes').value || '';
    projectData.guidelines = document.getElementById('guidelines').value || '';
    
    // Get project type (single select)
    const projectTypeEl = document.querySelector('.question-item:nth-child(3) .option-item.selected');
    if (projectTypeEl) {
        if (projectTypeEl.classList.contains('other')) {
            const input = projectTypeEl.querySelector('.other-input');
            projectData.projectType = input && input.value ? input.value : 'Other';
        } else {
            projectData.projectType = projectTypeEl.getAttribute('data-value');
        }
    } else {
        projectData.projectType = 'Not specified';
    }
    
    // Get main goals (multiple select)
    projectData.mainGoals = [];
    document.querySelectorAll('.question-item:nth-child(4) .option-item.selected').forEach(item => {
        if (item.classList.contains('other')) {
            const input = item.querySelector('.other-input');
            if (input && input.value) projectData.mainGoals.push(input.value);
        } else {
            projectData.mainGoals.push(item.getAttribute('data-value'));
        }
    });
    
    // Get Figma experience (single select)
    const figmaExpEl = document.querySelector('.question-item:nth-child(5) .option-item.selected');
    if (figmaExpEl) {
        projectData.figmaExperience = figmaExpEl.getAttribute('data-value');
    } else {
        projectData.figmaExperience = 'Not specified';
    }
    
    // Get design style (single select)
    const designStyleEl = document.querySelector('.question-item:nth-child(6) .option-item.selected');
    if (designStyleEl) {
        projectData.designStyle = [designStyleEl.getAttribute('data-value')];
    } else {
        projectData.designStyle = [];
    }
    
    // Get complexity (single select)
    const complexityEl = document.querySelector('.question-item:nth-child(7) .option-item.selected');
    if (complexityEl) {
        projectData.complexity = complexityEl.getAttribute('data-value');
    } else {
        projectData.complexity = 'Not specified';
    }
    
    // Get design stage (single select)
    const designStageEl = document.querySelector('.question-item:nth-child(9) .option-item.selected');
    if (designStageEl) {
        projectData.designStage = designStageEl.getAttribute('data-value');
    } else {
        projectData.designStage = 'Not specified';
    }
    
    // Get project name from Figma (if available)
    parent.postMessage({ pluginMessage: { type: 'get-project-name' } }, '*');
    
    console.log('Project data collected:', projectData);
    
    return formatProjectOverview();
}

// Format project overview for display
function formatProjectOverview(includeIntroAndClosing = false) {
    const overviewContent = `<strong>Current project: ${projectData.projectName || 'Untitled Project'}</strong><br><br>

<strong>1. Project Description:</strong>
<span style="color:var(--main-purple)">${projectData.projectDescription || 'Not specified'}</span><br><br>

<strong>2. Target Audience:</strong>
<span style="color:var(--main-purple)">${projectData.targetAudience || 'Not specified'}</span><br><br>

<strong>3. Project Type:</strong>
<span style="color:var(--main-purple)">${projectData.projectType || 'Not specified'}</span><br><br>

<strong>4. Main Goal:</strong>
<span style="color:var(--main-purple)">${projectData.mainGoals.length ? projectData.mainGoals.join(', ') : 'Not specified'}</span><br><br>

<strong>5. Design Style:</strong>
<span style="color:var(--main-purple)">${projectData.designStyle.length ? projectData.designStyle.join(', ') : 'Not specified'}</span><br><br>

<strong>6. Figma Experience:</strong>
<span style="color:var(--main-purple)">${projectData.figmaExperience || 'Not specified'}</span><br><br>

<strong>7. Website Complexity:</strong>
<span style="color:var(--main-purple)">${projectData.complexity || 'Not specified'}</span><br><br>

<strong>8. Purposes:</strong>
<span style="color:var(--main-purple)">${projectData.purposes || 'Not specified'}</span><br><br>

<strong>9. Design Stage:</strong>
<span style="color:var(--main-purple)">${projectData.designStage || 'Not specified'}</span><br><br>

<strong>10. Additional Guidelines:</strong>
<span style="color:var(--main-purple)">${projectData.guidelines || 'Not specified'}</span>`;

    // For chat, we need plain text without HTML
    const plainOverviewContent = `Current project: ${projectData.projectName || 'Untitled Project'}

1. Project Description:
${projectData.projectDescription || 'Not specified'}

2. Target Audience:
${projectData.targetAudience || 'Not specified'}

3. Project Type:
${projectData.projectType || 'Not specified'}

4. Main Goal:
${projectData.mainGoals.length ? projectData.mainGoals.join(', ') : 'Not specified'}

5. Design Style:
${projectData.designStyle.length ? projectData.designStyle.join(', ') : 'Not specified'}

6. Figma Experience:
${projectData.figmaExperience || 'Not specified'}

7. Website Complexity:
${projectData.complexity || 'Not specified'}

8. Purposes:
${projectData.purposes || 'Not specified'}

9. Design Stage:
${projectData.designStage || 'Not specified'}

10. Additional Guidelines:
${projectData.guidelines || 'Not specified'}`;

    if (includeIntroAndClosing) {
        return `I am currently working on a Figma design project${projectData.projectName ? ' for ' + projectData.projectName : ''} with the following details:

${plainOverviewContent}

Take note of this information and acknowledge the details provided. Await further instructions before generating any recommendations.`;
    }
    
    return overviewContent;
}

// Handle Make Overview button click
document.getElementById('makeOverviewButton').addEventListener('click', () => {
    // Generate overview data first
    generateProjectOverview();
    
    // Request the project name from Figma
    parent.postMessage({ pluginMessage: { type: 'get-project-name' } }, '*');
    
    // Wait a short time for the project name to be received
            setTimeout(() => {
        const overview = formatProjectOverview(false);
        // Use the showPromptPopup function with isProjectOverview=true
        showPromptPopup('Project Overview', overview, true);
    }, 300); // Wait 300ms for the project name to be received
});

// Listen for project name from Figma
window.addEventListener('message', event => {
    const msg = event.data.pluginMessage;
    if (msg && msg.type === 'project-name') {
        projectData.projectName = msg.name || 'Untitled Project';
        console.log('Received project name from Figma:', projectData.projectName);
        
        // If the project name was just updated and we have a project overview popup open,
        // update the content to reflect the new project name
        const projectOverviewPopup = document.querySelector('.prompt-popup[data-is-project-overview="true"]');
        if (projectOverviewPopup) {
            const titleElement = projectOverviewPopup.querySelector('strong:first-child');
            if (titleElement) {
                titleElement.innerHTML = `Current project: ${projectData.projectName}`;
            }
        }
    }
});

// Generate design-stage-specific prompt suggestions
function generateDesignStagePrompts(designStage) {
    // Create a context-specific message for the AI to generate relevant suggestions
    // that are appropriate for the current design stage
    
    // Create a more detailed context message that emphasizes the project details
    const contextMessage = `I need prompt suggestions for my ${projectData.projectType || 'design'} project 
    called "${projectData.projectName || 'Untitled Project'}" 
    for ${projectData.targetAudience || 'users'} 
    at the ${designStage || 'initial'} stage 
    with goals including ${projectData.mainGoals.join(', ') || 'improving user experience'}.
    
    The project description is: ${projectData.projectDescription || 'Not specified'}
    
    The design style is: ${projectData.designStyle.join(', ') || 'Not specified'}
    
    Additional purposes: ${projectData.purposes || 'Not specified'}`;
    
    // Use the existing generatePromptSuggestions function with empty AI response
    // to ensure it focuses on project context rather than conversation
    generatePromptSuggestions(contextMessage, "");
}

// Add event listener for regenerate button
regenerateButton.addEventListener('click', () => {
    // Get the last few messages for context
    const messages = document.querySelectorAll('.message');
    let lastUserMessage = '';
    let lastAIResponse = '';
    
    // Find the last user message and AI response
    for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.classList.contains('user') && !lastUserMessage) {
            lastUserMessage = message.textContent.trim();
        } else if (message.classList.contains('system') && !lastAIResponse && !message.querySelector('.typing-indicator')) {
            lastAIResponse = message.textContent.trim();
        }
        
        if (lastUserMessage && lastAIResponse) break;
    }
    
    // Show loading state
    updatePromptSuggestionsLoadingState();
    
    // Generate new suggestions based on conversation context
    generatePromptSuggestions(lastUserMessage, lastAIResponse);
});

// Add the collapse toggle functionality
const collapseToggle = document.getElementById('collapseToggle');
collapseToggle.addEventListener('click', () => {
    document.body.classList.toggle('plugin-collapsed');
    collapseToggle.classList.toggle('collapsed');
    
    // Notify the plugin about the collapse state
    const isCollapsed = document.body.classList.contains('plugin-collapsed');
    sendToPlugin('toggle-collapse', { collapsed: isCollapsed });
});

// Add these functions near the top of your script
function closeApiKeyDialog() {
    apiKeyContainer.style.display = 'none';
    chatInput.disabled = false;
    sendButton.disabled = false;
}

// Add event listener for the close button
document.getElementById('closeApiDialog').addEventListener('click', closeApiKeyDialog);

// Add HTML Parser for Figma styling
window.addEventListener('message', (event) => {
    const message = event.data.pluginMessage;
    if (!message) return;
    
    if (message.type === 'parse-html') {
        const html = message.html;
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
        const container = doc.body.firstChild;
        
        const elements = [];
        parseElements(container, elements);
        
        // Send parsed elements back to the plugin
        parent.postMessage({ 
            pluginMessage: { 
                type: 'parsed-html-result', 
                elements: elements 
            } 
        }, '*');
    }
});

// Function to parse HTML elements recursively
function parseElements(container, elements) {
    if (!container || !container.childNodes) return;
    
    // Track sections by headings
    let currentSection = null;
    let currentSectionType = null;
    let currentSectionContent = '';
    let inBulletList = false;
    let bulletListContent = '';
    let inNumberedList = false;
    let numberedListContent = '';
    
    const finishCurrentSection = () => {
        if (currentSection && currentSectionContent.trim()) {
            elements.push({
                type: currentSectionType,
                text: currentSectionContent.trim()
            });
            currentSection = null;
            currentSectionType = null;
            currentSectionContent = '';
        }
    };
    
    const finishBulletList = () => {
        if (bulletListContent.trim()) {
            elements.push({
                type: 'bullet-list',
                text: bulletListContent.trim()
            });
            bulletListContent = '';
            inBulletList = false;
        }
    };
    
    const finishNumberedList = () => {
        if (numberedListContent.trim()) {
            elements.push({
                type: 'numbered-list',
                text: numberedListContent.trim()
            });
            numberedListContent = '';
            inNumberedList = false;
        }
    };
    
    // First pass: collect all headings to identify sections
    const headings = [];
    for (const node of container.childNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.nodeName)) {
            headings.push({
                node: node,
                text: node.textContent.trim(),
                type: node.nodeName.toLowerCase()
            });
        }
    }
    
    // Process the content
    for (let i = 0; i < container.childNodes.length; i++) {
        const node = container.childNodes[i];
        
        // Text node
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (text.trim()) {
                // If we're in a bullet list, add to it
                if (inBulletList) {
                    bulletListContent += text;
                }
                // If we're in a numbered list, add to it
                else if (inNumberedList) {
                    numberedListContent += text;
                }
                // If we're in a section, add to it
                else if (currentSection) {
                    currentSectionContent += text;
                }
                // Otherwise, check parent type
                else {
                    let type = node.parentNode.nodeName.toLowerCase();
                    
                    // Check for special styling
                    if (node.parentNode.nodeName === 'STRONG' || node.parentNode.nodeName === 'B') {
                        type = 'strong';
                    } else if (node.parentNode.nodeName === 'EM' || node.parentNode.nodeName === 'I') {
                        type = 'em';
                    } else if (node.parentNode.nodeName === 'CODE') {
                        type = 'code';
                    }
                    
                    // If it's a paragraph or div, start a new section
                    if (['p', 'div'].includes(type)) {
                        currentSection = node.parentNode;
                        currentSectionType = 'content';
                        currentSectionContent = text;
                    } else {
                        // For inline elements, add directly
                        elements.push({
                            type: type,
                            text: text
                        });
                    }
                }
            }
        } 
        // Element node
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // Handle headings - these always start a new section
            if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.nodeName)) {
                // Finish any current section or list
                finishCurrentSection();
                finishBulletList();
                finishNumberedList();
                
                const text = node.textContent.trim();
                if (text) {
                    elements.push({
                        type: node.nodeName.toLowerCase(),
                        text: text
                    });
                }
            }
            // Check if this is an ordered list (OL)
            else if (node.nodeName === 'OL') {
                // Process children directly to handle numbered items
                for (let j = 0; j < node.childNodes.length; j++) {
                    const childNode = node.childNodes[j];
                    if (childNode.nodeName === 'LI') {
                        // If not already in a numbered list, finish current section and start a new numbered list
                        if (!inNumberedList) {
                            finishCurrentSection();
                            finishBulletList();
                            inNumberedList = true;
                            numberedListContent = '';
                        } else {
                            // Add a line break between numbered points
                            numberedListContent += '\n';
                        }
                        
                        // Get the index of this item in the list (1-based)
                        const index = Array.from(node.children).indexOf(childNode) + 1;
                        
                        // Add numbered point
                        numberedListContent += `${index}. ${childNode.textContent.trim()}`;
                    }
                }
                // Skip processing the OL's children since we've handled them directly
                i += node.childNodes.length;
            }
            // Handle bullet points - group them together
            else if (node.nodeName === 'LI') {
                // Check if parent is OL (ordered list)
                if (node.parentNode && node.parentNode.nodeName === 'OL') {
                    // If not already in a numbered list, finish current section and start a new numbered list
                    if (!inNumberedList) {
                        finishCurrentSection();
                        finishBulletList();
                        inNumberedList = true;
                        numberedListContent = '';
                    } else {
                        // Add a line break between numbered points
                        numberedListContent += '\n';
                    }
                    
                    // Get the index of this item in the list (1-based)
                    const index = Array.from(node.parentNode.children).indexOf(node) + 1;
                    
                    // Add numbered point
                    numberedListContent += `${index}. ${node.textContent.trim()}`;
                } else {
                    // If not already in a bullet list, finish current section and start a new bullet list
                    if (!inBulletList) {
                        finishCurrentSection();
                        finishNumberedList();
                        inBulletList = true;
                        bulletListContent = '';
                    } else {
                        // Add a line break between bullet points
                        bulletListContent += '\n';
                    }
                    
                    // Add bullet point with a bullet character
                    bulletListContent += '• ' + node.textContent.trim();
                }
            }
            // Handle line breaks
            else if (node.nodeName === 'BR') {
                if (inBulletList) {
                    bulletListContent += '\n';
                } else if (inNumberedList) {
                    numberedListContent += '\n';
                } else if (currentSection) {
                    currentSectionContent += '\n';
                }
            }
            // Handle paragraphs and divs
            else if (['P', 'DIV'].includes(node.nodeName)) {
                // If we're in a list, stay there
                if (inBulletList) {
                    // Only add line break if there's content
                    if (bulletListContent.trim()) {
                        bulletListContent += '\n';
                    }
                    bulletListContent += node.textContent.trim();
                } else if (inNumberedList) {
                    // Only add line break if there's content
                    if (numberedListContent.trim()) {
                        numberedListContent += '\n';
                    }
                    numberedListContent += node.textContent.trim();
                }
                // Otherwise, finish current section and start a new one
                else {
                    finishCurrentSection();
                    
                    // Check if this is empty
                    const text = node.textContent.trim();
                    if (text) {
                        currentSection = node;
                        currentSectionType = 'content';
                        currentSectionContent = text;
                    }
                }
            }
            // Recursively parse other elements
            else {
                // For other elements, just parse their children
                for (let j = 0; j < node.childNodes.length; j++) {
                    const childNode = node.childNodes[j];
                    
                    // Text node
                    if (childNode.nodeType === Node.TEXT_NODE) {
                        const text = childNode.textContent;
                        if (text.trim()) {
                            if (inBulletList) {
                                bulletListContent += text;
                            } else if (inNumberedList) {
                                numberedListContent += text;
                            } else if (currentSection) {
                                currentSectionContent += text;
                            }
                        }
                    }
                    // Element node - handle recursively
                    else if (childNode.nodeType === Node.ELEMENT_NODE) {
                        // Special handling for certain elements
                        if (childNode.nodeName === 'BR') {
                            if (inBulletList) {
                                bulletListContent += '\n';
                            } else if (inNumberedList) {
                                numberedListContent += '\n';
                            } else if (currentSection) {
                                currentSectionContent += '\n';
                            }
                        } else if (childNode.nodeName === 'LI') {
                            // Handle nested list items
                            if (childNode.parentNode && childNode.parentNode.nodeName === 'OL') {
                                // If not already in a numbered list, finish current section and start a new numbered list
                                if (!inNumberedList) {
                                    finishCurrentSection();
                                    finishBulletList();
                                    inNumberedList = true;
                                    numberedListContent = '';
                                } else {
                                    numberedListContent += '\n';
                                }
                                
                                // Get the index of this item in the list (1-based)
                                const index = Array.from(childNode.parentNode.children).indexOf(childNode) + 1;
                                
                                // Add numbered point
                                numberedListContent += `${index}. ${childNode.textContent.trim()}`;
                            } else {
                                if (!inBulletList) {
                                    finishCurrentSection();
                                    finishNumberedList();
                                    inBulletList = true;
                                    bulletListContent = '';
                                } else {
                                    bulletListContent += '\n';
                                }
                                bulletListContent += '• ' + childNode.textContent.trim();
                            }
                        } else {
                            // For other elements, just add their text content
                            const text = childNode.textContent.trim();
                            if (text) {
                                if (inBulletList) {
                                    bulletListContent += text;
                                } else if (inNumberedList) {
                                    numberedListContent += text;
                                } else if (currentSection) {
                                    currentSectionContent += text;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Finish any remaining sections
    finishCurrentSection();
    finishBulletList();
    finishNumberedList();
}

function initializeZoomControls() {
    const chatContainer = document.querySelector('.chat-container');
    const zoomInButton = document.getElementById('zoomIn');
    const zoomOutButton = document.getElementById('zoomOut');
    const zoomLevelDisplay = document.getElementById('zoomLevel');
    
    // Set default zoom level
    let currentZoom = 100;
    chatContainer.setAttribute('data-zoom', currentZoom);
    
    // Zoom in function
    function zoomIn() {
        if (currentZoom < 150) {
            currentZoom += 10;
            updateZoom();
        }
    }
    
    // Zoom out function
    function zoomOut() {
        if (currentZoom > 80) {
            currentZoom -= 10;
            updateZoom();
        }
    }
    
    // Zoom in button click handler
    zoomInButton.addEventListener('click', zoomIn);
    
    // Zoom out button click handler
    zoomOutButton.addEventListener('click', zoomOut);
    
    // Add keyboard shortcuts for zooming
    document.addEventListener('keydown', (e) => {
        // Check if Ctrl/Cmd key is pressed
        if (e.ctrlKey || e.metaKey) {
            // Zoom in with Ctrl/Cmd + Plus
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                zoomIn();
            }
            // Zoom out with Ctrl/Cmd + Minus
            else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                zoomOut();
            }
            // Reset zoom with Ctrl/Cmd + 0
            else if (e.key === '0') {
                e.preventDefault();
                currentZoom = 100;
                updateZoom();
            }
        }
    });
    
    // Update zoom level
    function updateZoom() {
        chatContainer.setAttribute('data-zoom', currentZoom);
        zoomLevelDisplay.textContent = `${currentZoom}%`;
        
        // Save zoom preference to localStorage
        localStorage.setItem('chatZoomLevel', currentZoom);
    }
    
    // Load saved zoom preference if available
    const savedZoom = localStorage.getItem('chatZoomLevel');
    if (savedZoom) {
        currentZoom = parseInt(savedZoom);
        updateZoom();
    }
}

// Handle Back button to return to categories
document.addEventListener('DOMContentLoaded', function() {
    const backToCategories = document.getElementById('backToCategories');
    if (backToCategories) {
        backToCategories.addEventListener('click', () => {
            document.getElementById('questionnaireContainer').style.display = 'none';
            document.querySelector('.prompts-grid').style.display = 'grid';
        });
    }
});

// Helper function to clean message content
function cleanMessageContent(text) {
    // Remove any "Send to Figma" text that might be included
    let cleaned = text.replace(/Send to Figma/g, '').trim();
    
    // Remove any other UI text that might be included
    cleaned = cleaned.replace(/Copy|Edit|Save/g, '').trim();
    
    return cleaned;
}

// Add a new function to generate a follow-up question based on chat history
async function generateFollowUpQuestion(aiResponse) {
    // Check if API key is available
    if (!apiKey) {
        return '';
    }
    
    try {
        // Get the last few messages to provide context
        const messages = document.querySelectorAll('.message');
        let conversationHistory = [];
        
        // Collect the last 5 messages for context
        const maxMessages = 8;
        let count = 0;
        for (let i = messages.length - 1; i >= 0 && count < maxMessages; i--) {
            const message = messages[i];
            // Skip typing indicators
            if (message.querySelector('.typing-indicator')) continue;
            
            // Get the message content element specifically
            const messageContentElement = message.querySelector('.message-content');
            if (!messageContentElement) continue;
            
            // Extract text from the message content element only
            const text = messageContentElement.textContent.trim();
            
            // Clean the text to remove any UI elements text that might be included
            const cleanedText = cleanMessageContent(text);
            
            // Only add non-empty messages
            if (cleanedText) {
                const type = message.classList.contains('user') ? 'user' : 'assistant';
                conversationHistory.unshift({
                    role: type,
                    content: cleanedText
                });
                count++;
            }
        }
        
        // Create a system prompt for generating a follow-up question
        const systemPrompt = `Based on the conversation history, generate a single follow-up question that the user might want to ask next to the AI assistant. The question should be relevant to the current conversation and help the user get more specific information or explore a related aspect of the topic. Keep the question concise (under 100 characters) and directly related to the most recent assistant response (for example: "could you elaborate on [part of previous response]"). `;
        
        // Prepare messages array for the API request
        let apiMessages = [
            {
                role: 'system',
                content: systemPrompt
            }
        ];
        
        // Add conversation history to the messages array
        if (conversationHistory.length > 0) {
            apiMessages = apiMessages.concat(conversationHistory);
        }
        
        // Add a final user message asking for a follow-up question
        apiMessages.push({
            role: 'user',
            content: 'Based on this conversation, what would be a good follow-up question I could ask to get more specific information or explore a related aspect?'
        });
        
        // Call the OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: apiMessages,
                temperature: 0.7,
                max_tokens: 100
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error (${response.status})`);
        }
        
        const data = await response.json();
        let followUpQuestion = data.choices[0].message.content.trim();
        
        // Remove quotes if present
        followUpQuestion = followUpQuestion.replace(/^["'](.*)["']$/, '$1');
        
        // Remove "You could ask:" or similar prefixes
        followUpQuestion = followUpQuestion.replace(/^(You could ask:|You might ask:|Consider asking:|How about:|Question:)\s*/i, '');
        
        return followUpQuestion;
    } catch (error) {
        console.error('Error generating follow-up question:', error);
        return '';
    }
}

// Add a function to create and add a suggestion bubble after an AI response
async function addSuggestionBubble(aiMessageElement) {
    try {
        // Get the AI response text
        const aiResponseText = aiMessageElement.querySelector('.message-content').textContent.trim();
        
        // Generate a follow-up question based on the AI response
        const followUpQuestion = await generateFollowUpQuestion(aiResponseText);
        
        // If no question was generated, don't add a bubble
        if (!followUpQuestion) return;
        
        // Create a container div for the suggestion bubble
        const bubbleContainer = document.createElement('div');
        bubbleContainer.style.display = 'flex';
        bubbleContainer.style.justifyContent = 'flex-end';
        bubbleContainer.style.width = '100%';
        
        // Create the suggestion bubble
        const suggestionBubble = document.createElement('div');
        suggestionBubble.className = 'suggestion-bubble';
        suggestionBubble.setAttribute('data-tooltip', 'Click to use this suggestion');
        suggestionBubble.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"></path>
            </svg>
            ${followUpQuestion}
        `;
        
        // Add click event to open the prompt popup
        suggestionBubble.addEventListener('click', () => {
            showPromptPopup('Follow-up Question', followUpQuestion);
        });
        
        // Add the bubble to the container
        bubbleContainer.appendChild(suggestionBubble);
        
        // Add the container to the chat
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.appendChild(bubbleContainer);
        
        // Scroll to show the suggestion bubble
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Error adding suggestion bubble:', error);
    }
}


