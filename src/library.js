// Library page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the library page when it's selected
    initializeLibraryPage();
});

// Function to initialize the library page
function initializeLibraryPage() {
    // Get the library category element
    const libraryCategory = document.getElementById('libraryCategory');
    
    if (libraryCategory) {
        // Add click event listener to the library category
        libraryCategory.addEventListener('click', function() {
            showLibraryPage();
        });
    }
}

// Function to show the library page
function showLibraryPage() {
    // Hide the questionnaire container if it's visible
    const questionnaireContainer = document.getElementById('questionnaireContainer');
    if (questionnaireContainer) {
        questionnaireContainer.style.display = 'none';
    }
    
    // Create or show the library container
    let libraryContainer = document.getElementById('libraryContainer');
    
    if (!libraryContainer) {
        // Create the library container if it doesn't exist
        libraryContainer = document.createElement('div');
        libraryContainer.id = 'libraryContainer';
        libraryContainer.className = 'library-container';
        
        // Create the breadcrumb container
        const breadcrumbContainer = document.createElement('div');
        breadcrumbContainer.className = 'breadcrumb-container';
        
        // Create the back button
        const backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.id = 'backFromLibrary';
        backButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
            </svg>
            Back
        `;
        
        // Add event listener to the back button
        backButton.addEventListener('click', function() {
            libraryContainer.style.display = 'none';
            // Show the prompt categories again
            const promptsGrid = document.querySelector('.prompts-grid');
            if (promptsGrid) {
                promptsGrid.style.display = 'grid';
            }
        });
        
        // Create the category title
        const categoryTitle = document.createElement('div');
        categoryTitle.className = 'category-title';
        categoryTitle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="topic-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Library
        `;
        
        // Create the library description
        const libraryDescription = document.createElement('p');
        libraryDescription.className = 'library-description';
        libraryDescription.textContent = 'Browse pre-made prompts organized by category to enhance your design process.';
        
        // Add back button and category title to breadcrumb container
        breadcrumbContainer.appendChild(backButton);
        breadcrumbContainer.appendChild(categoryTitle);
        
        // Create the search container
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
            <input type="text" id="promptSearchInput" class="search-input" placeholder="Search prompts...">
            <div id="searchResults" class="search-results"></div>
        `;
        
        // Create the prompts categories container
        const promptsCategories = document.createElement('div');
        promptsCategories.className = 'prompts-categories';
        
        // Define the main topic categories
        const mainTopicCategories = [
            {
                name: 'UX Research',
                count: 19,
                items: [
                    'User persona', 'User journey map', 'Target audience', 'Behavior analysis',
                    'Demographics', 'Psychographics', 'Pain points', 'Stakeholder interviews',
                    'Observational research', 'Competitive analysis', 'Market research', 'Survey design',
                    'Affinity diagram', 'Field studies', 'Focus groups', 'Ethnographic research',
                    'Contextual inquiry', 'Emotional mapping', 'User journey'
                ]
            },
            {
                name: 'Strategy',
                count: 20,
                items: [
                    'Problem statement', 'User needs', 'Goal definition', 'Insights clustering',
                    'Value proposition', 'Design constraints', 'User requirements', 'Opportunity framing',
                    'Problem space', 'How-might-we questions', 'Gap analysis', 'Success criteria',
                    'Task analysis', 'Job-to-be-done', 'User pain', 'Journey pain points',
                    'Prioritization matrix', 'Experience goals', 'Product vision', 'Problem framing'
                ]
            },
            {
                name: 'Ideation',
                count: 18,
                items: [
                    'Brainstorming', 'Co-creation', 'Mind mapping', 'Storyboarding',
                    'Role-playing', 'Ideation workshop', 'Concept sketching', 'Crazy 8s',
                    'SCAMPER method', 'Blue-sky thinking', 'Moodboarding', 'Design exploration',
                    'Divergent thinking', 'Problem reframing', 'Reverse engineering', 'Concept testing',
                    'Heuristic ideation', 'Design sprint'
                ]
            },
            {
                name: 'Prototyping',
                count: 24,
                items: [
                    'Wireframe', 'Mockup', 'Clickable prototype', 'Interactive flow',
                    'Style guide', 'Design system', 'UI components', 'User flow',
                    'Color picker', 'Information architecture', 'High-fidelity prototype', 'Low-fidelity prototype',
                    'Responsive design', 'Adaptive design', 'Fixed layout', 'Full-width design',
                    'Minimalist layout', 'Microinteractions', 'Parallax scrolling', 'Iconography',
                    'Infinite scroll', 'Auto-complete', 'Background video', 'SVG graphics'
                ]
            },
            {
                name: 'Testing',
                count: 16,
                items: [
                    'A/B testing', 'Usability testing', 'Heatmaps', 'Click tracking',
                    'User feedback', 'Accessibility audit', 'Performance optimization', 'Mobile-first design',
                    'Error tracking', 'Metrics dashboard', 'Eye-tracking', 'First-click testing',
                    'Retention metrics', 'Conversion rates', 'Qualitative feedback', 'Quantitative feedback'
                ]
            },
            {
                name: 'UI Elements',
                count: 60,
                items: [
                    'Hover effect', 'Drag-and-drop', 'Swipeable interface', 'Toggle',
                    'Scrollbar', 'Loading spinner', 'Breadcrumb navigation/trail', 'Pagination',
                    'Dropdown menu', 'Text field', 'Radio button', 'Checkbox',
                    'Dropdown list', 'Multi-step form', 'Inline validation', 'Placeholder text',
                    'Hero image', 'Submit button', 'Error message', 'Progress bar',
                    'Modal window', 'Tooltip', 'Card', 'Accordion menu',
                    'Carousel/Slider', 'Image gallery', 'Search bar', 'Table',
                    'File upload', 'Date picker', 'Time picker', 'Switch',
                    'Stepper', 'Rating stars', 'Toast notification', 'Tab navigation',
                    'Timeline', 'Hyperlinks', 'Sidebar', 'Multi-select dropdown',
                    'Chip list', 'Footer', 'Action button (floating action button - FAB)', 'Header',
                    'Loader (spinner/bar/screen)', 'Fisheye menu', 'Earcons', 'Chartjunk',
                    'Bento menu', 'Hamburger menu', 'Alt-menu', 'Meatball menu',
                    'Kebab menu', 'Doner menu', 'Button', 'Comment',
                    'Fom', 'Feed', 'Input field', 'Picker (date/time)',
                    'Notification', 'Tag'
                ]
            },
            {
                name: 'Visual Design',
                count: 14,
                items: [
                    'Visual Design', 'Golden Ratio', 'Monochromatic scheme', 'Complementary colors',
                    'Accent color', 'Gradient background', 'Light theme', 'Dark mode',
                    'Pastel colors', 'Neutral palette', 'High contrast', 'Rule of Thirds',
                    'Proximity', 'Color models'
                ]
            },
            {
                name: 'Accessibility',
                count: 10,
                items: [
                    'ARIA labels', 'Alt text', 'Keyboard navigation', 'Screen reader support',
                    'High contrast mode', 'Focus indicators', 'Accessible forms', 'Large tap target',
                    'Dynamic text resizing', 'Color-blind friendly design'
                ]
            },
            {
                name: 'Figma',
                count: 23,
                items: [
                    'Auto Layout', 'Smart Selection', 'Variables', 'Constraints',
                    'Components & Instances', 'Variants', 'Nested Components', 'Interactive Components',
                    'Styles (Text, Colors, Effects, Grids)', 'Plugins & Widgets', 'Figma Tokens', 'Smart Animate',
                    'Dev Mode', 'Version Control', 'File Organization', 'FigJam Collaboration',
                    'Team Libraries', 'Boolean Operations', 'Vector Editing', 'Pen Tool',
                    'Blend Modes', 'Masking', 'Exporting Assets'
                ]
            },
            {
                name: 'Design Principles',
                count: 49,
                items: [
                    'Design Thinking Process', 'Aesthetic-Usability Effect', 'Choice Overload', 'Chunking',
                    'Cognitive Bias', 'Cognitive Load', 'Doherty Threshold', 'Fitts\'s Law',
                    'Flow', 'Goal-Gradient Effect', 'Hick\'s Law', 'Jakob\'s Law',
                    'Law of Common Region', 'Law of Proximity', 'Law of Prägnanz', 'Law of Similarity',
                    'Law of Uniform Connectedness', 'Mental Model', 'Miller\'s Law', 'Occam\'s Razor',
                    'Paradox of the Active User', 'Pareto Principle', 'Parkinson\'s Law', 'Peak-End Rule',
                    'Postel\'s Law', 'Selective Attention', 'Serial Position Effect', 'Tesler\'s Law',
                    'Von Restorff Effect', 'Working Memory', 'Zeigarnik Effect', 'Dark Patterns',
                    'Persuasive Design', 'Gestalt Principles', 'Progressive Disclosure', 'Nielsen\'s Usability Heuristics',
                    'Principle of Least Effort', 'Dunning-Kruger Effect', 'Kano Model', 'Default Effect',
                    'Mere Exposure Effect', 'Social Proof', 'Sunk Cost Fallacy', 'Gamification Mechanics',
                    'FOMO', 'Scarcity Principle', 'Decoy Effect', 'Hyperbolic Discounting',
                    'Nudge Theory', 'Form Follows Function'
                ]
            }
        ];
        
        // Create categories for all topics
        mainTopicCategories.forEach(category => {
            const categoryDiv = createTopicWithItems(category.name, category.items, category.count);
            promptsCategories.appendChild(categoryDiv);
        });
        
        // Assemble the library container
        libraryContainer.appendChild(breadcrumbContainer);
        libraryContainer.appendChild(libraryDescription);
        libraryContainer.appendChild(searchContainer);
        libraryContainer.appendChild(promptsCategories);
        
        // Add the library container to the prompt container
        const promptContainer = document.querySelector('.prompt-container');
        if (promptContainer) {
            promptContainer.appendChild(libraryContainer);
        }
        
        // Initialize search functionality
        initializeSearch();
        
        // Add click event listeners to category headers for accordion functionality
        initializeAccordion();
        
    } else {
        // Show the library container if it already exists
        libraryContainer.style.display = 'block';
    }
    
    // Hide the prompts grid
    const promptsGrid = document.querySelector('.prompts-grid');
    if (promptsGrid) {
        promptsGrid.style.display = 'none';
    }
}

// Helper function to create a topic with items
function createTopicWithItems(topicName, items, count) {
    const topic = document.createElement('div');
    topic.className = 'topic';
    
    const topicHeader = document.createElement('div');
    topicHeader.className = 'topic-header';
    topicHeader.innerHTML = `
        <span>${topicName}</span>
        <span class="count">${count}</span>
    `;
    
    const topicItems = document.createElement('div');
    topicItems.className = 'topic-items';
    
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.textContent = item;
        
        // Add click event to show the prompt popup
        itemDiv.addEventListener('click', () => {
            // Create and show the popup
            const overlay = document.createElement('div');
            overlay.className = 'prompt-overlay';
            
            // Get the prompt content immediately
            const promptText = generatePromptContent(item, topicName);
            
            // Process the prompt text to highlight placeholders in purple
            const processedPromptText = highlightPlaceholders(promptText);
            
            const popup = document.createElement('div');
            popup.className = 'prompt-popup';
            popup.innerHTML = `
                <div style="position: relative;">
                    <button class="close-prompt" style="position:absolute;top:0;right:0;background:none;border:none;font-size:24px;cursor:pointer;color:var(--light-gray);">×</button>
                    <h3 style="margin-top: 0; padding-right: 24px; color: var(--white-1); font-size: var(--fs-4);">${item}</h3>
                </div>
                <div class="prompt-content" contenteditable="false">${processedPromptText}</div>
                <div class="prompt-actions">
                    <button class="regenerate-prompt" data-tooltip="Regenerate">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
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
            
            // Regenerate button handler
            regenerateButton.addEventListener('click', async () => {
                // Show loading state in the prompt content
                const originalPrompt = promptContent.innerHTML;
                promptContent.innerHTML = `
                    <div class="loading-dot-container" style="margin: 20px auto;">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                `;
                
                try {
                    // Get the API key
                    const apiKey = document.getElementById('apiKeyInput')?.value;
                    if (!apiKey) {
                        throw new Error('API key not found');
                    }

                    // Check if project data exists and is meaningful
                    const hasProjectData = checkForProjectData();
                    
                    // Get project overview data if it exists
                    let projectOverviewText = '';
                    if (hasProjectData) {
                        projectOverviewText = getProjectOverviewText();
                    }

                    // Prepare the prompt for GPT
                    let systemPrompt = `You are a UX/UI design expert tasked with generating unique prompt questions. For the topic "${item}" in the context of ${topicName}, create a completely new and different prompt that:
1. Approaches the topic from a fresh angle or perspective
2. Is phrased as 2-3 related questions that build on each other
3. Focuses on different aspects than the current prompt
4. Maintains high quality and depth while being concise
5. Encourages detailed, actionable responses
6. Is specific to UX/UI design best practices
7. Follows this format: "What [specific aspect]? How [implementation detail]? What [considerations/pitfalls]?"`;

                    // Add project overview data if it exists
                    if (hasProjectData) {
                        systemPrompt += `\n\nThe user has provided the following project overview information. Tailor your prompt to be relevant to their specific project context:\n${projectOverviewText}`;
                    }

                    systemPrompt += `\n\nCurrent prompt for reference (generate something different):
${originalPrompt}`;
                    
                    // Call OpenAI API
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${apiKey}`
                        },
                        body: JSON.stringify({
                            model: 'gpt-4',
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: 'Generate a new, unique prompt question that explores different aspects of this topic than the current prompt.' }
                            ],
                            temperature: 0.8,
                            max_tokens: 500
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to generate new prompt');
                    }

                    const data = await response.json();
                    const newPrompt = data.choices[0].message.content.trim();
                    
                    // Process the new prompt to highlight placeholders
                    promptContent.innerHTML = highlightPlaceholders(newPrompt);

                } catch (error) {
                    console.error('Error generating new prompt:', error);
                    // Restore original prompt if there's an error
                    promptContent.innerHTML = originalPrompt;
                    
                    // Show error message to user
                    const errorMessage = error.message === 'API key not found' 
                        ? 'Please enter your OpenAI API key in the chat section first.'
                        : 'Failed to generate new prompt. Please try again.';
                        
                    alert(errorMessage);
                }
            });
            
            // Copy button handler
            popup.querySelector('.copy-prompt').addEventListener('click', () => {
                // Create a temporary textarea element to handle the copying
                const tempTextArea = document.createElement('textarea');
                // Use textContent to get the plain text without HTML formatting
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
                // Get the prompt content as plain text without HTML formatting
                const promptText = promptContent.textContent.trim();
                
                // Switch to chat tab
                document.querySelector('.nav-tab[data-section="chat"]').click();
                
                // Set the prompt text in the chat input
                const chatInput = document.querySelector('.chat-input');
                if (chatInput) {
                    chatInput.value = promptText;
                    chatInput.disabled = false;
                    
                    // Enable the send button if it exists
                    const sendButton = document.getElementById('sendButton');
                    if (sendButton) {
                        sendButton.disabled = false;
                    }
                    
                    // Focus the chat input
                    chatInput.focus();
                }
                
                // Close the popup
                document.body.removeChild(overlay);
            });
            
            // Edit button handler
            editButton.addEventListener('click', () => {
                // Make the content editable but preserve the highlighting
                promptContent.contentEditable = 'true';
                promptContent.focus();
                editButton.style.display = 'none';
                saveButton.style.display = 'inline-flex';
            });
            
            // Save button handler
            saveButton.addEventListener('click', () => {
                promptContent.contentEditable = 'false';
                
                // Re-process the content to ensure placeholders are highlighted
                const rawText = promptContent.textContent;
                promptContent.innerHTML = highlightPlaceholders(rawText);
                
                saveButton.style.display = 'none';
                editButton.style.display = 'inline-flex';
            });
            
            // Close when clicking outside the popup
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        });
        
        topicItems.appendChild(itemDiv);
    });
    
    topic.appendChild(topicHeader);
    topic.appendChild(topicItems);
    
    return topic;
}

// Function to initialize accordion functionality
function initializeAccordion() {
    const topicHeaders = document.querySelectorAll('.topic-header');
    
    topicHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const topic = header.parentElement;
            
            // Check if the topic is already active
            const isActive = topic.classList.contains('active');
            
            // Close all topics first
            const allTopics = document.querySelectorAll('.topic');
            allTopics.forEach(t => t.classList.remove('active'));
            
            // If the clicked topic wasn't active before, open it
            if (!isActive) {
                topic.classList.add('active');
            }
            // If it was active, it's now closed (we removed the active class above)
        });
    });
}

// Function to initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('promptSearchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) return;
    
    // Create an overlay for darkening content when search results are shown
    let overlay = document.querySelector('.content-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'content-overlay';
        document.body.appendChild(overlay);
        
        // Add click event to close search results when clicking outside
        overlay.addEventListener('click', () => {
            overlay.classList.remove('active');
            searchResults.innerHTML = '';
            searchInput.value = '';
        });
    }
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Clear previous results
        searchResults.innerHTML = '';
        
        if (searchTerm.length < 2) {
            overlay.classList.remove('active');
            return;
        }
        
        const results = [];
        
        // Collect all items from all topics
        document.querySelectorAll('.topic').forEach(topic => {
            const topicName = topic.querySelector('.topic-header span').textContent;
            
            topic.querySelectorAll('.item').forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    results.push({
                        text: item.textContent,
                        topic: topicName
                    });
                }
            });
        });
        
        // Display results
        if (results.length > 0) {
            overlay.classList.add('active');
            
            results.forEach(result => {
                const pill = document.createElement('div');
                pill.className = 'search-pill';
                pill.innerHTML = `
                    ${result.text}
                    <span class="topic-label">${result.topic}</span>
                `;
                
                // Add click handler to show the item
                pill.addEventListener('click', () => {
                    searchInput.value = '';
                    searchResults.innerHTML = '';
                    overlay.classList.remove('active');
                    
                    // Find and show the corresponding topic and item
                    document.querySelectorAll('.topic').forEach(topic => {
                        const topicHeader = topic.querySelector('.topic-header span');
                        if (topicHeader.textContent === result.topic) {
                            // Open the topic if it's not already open
                            if (!topic.classList.contains('active')) {
                                topic.classList.add('active');
                            }
                            
                            // Find and highlight the item
                            const item = Array.from(topic.querySelectorAll('.item'))
                                .find(item => item.textContent === result.text);
                            
                            if (item) {
                                // Remove any existing highlights
                                document.querySelectorAll('.item.highlight').forEach(i => {
                                    i.classList.remove('highlight');
                                });
                                
                                // Add highlight class to trigger animation
                                item.classList.add('highlight');
                                
                                // Scroll the item into view
                                setTimeout(() => {
                                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                            }
                        }
                    });
                });
                
                searchResults.appendChild(pill);
            });
        } else {
            overlay.classList.remove('active');
            searchResults.innerHTML = '<div class="no-results">No matching prompts found</div>';
        }
    });
    
    // Remove overlay when clicking a search result
    document.addEventListener('click', (e) => {
        if (e.target.closest('.search-pill')) {
            overlay.classList.remove('active');
        }
    });
}

// Function to generate prompt content based on the item and topic
function generatePromptContent(item, topic) {
    // Object containing preset prompts for each topic and item
    const presetPrompts = {
        'UX Research': {
            'User persona': `Create a detailed user persona for [product/service] that includes demographic information, behaviors, goals, frustrations, and motivations. Include a day-in-the-life narrative that shows how they interact with products like mine, their decision-making process, and key touchpoints where my solution could add value.`,
            
            'User journey map': `Help me develop a comprehensive user journey map for [specific user persona] interacting with [product/service/process]. Include all stages from awareness to advocacy, detailing their actions, thoughts, emotions, pain points, and opportunities for improvement at each touchpoint. Highlight critical moments that could make or break their experience.`,
            
            'Target audience': `Define a precise target audience for [product/service/content], including primary and secondary segments. For each segment, outline demographic characteristics, behavioral patterns, media consumption habits, purchasing power, and the specific problems my [product/service] would solve for them. Explain why this audience is strategically valuable.`,
            
            'Behavior analysis': `Analyze the typical behavioral patterns of [specific user group] when they [relevant activity]. Include their decision triggers, habitual actions, environmental influences, psychological factors, and how these behaviors have evolved over time. Focus on identifying unexpected or counterintuitive behaviors that might inform product design.`,
            
            'Demographics': `Create a comprehensive demographic profile for the ideal users of [product/service]. Include age ranges, income levels, education, occupation, geographic location, family structure, and technology adoption patterns. Explain how each demographic factor influences their needs, preferences, and likelihood to engage with solutions like mine.`,
            
            'Psychographics': `Develop a detailed psychographic profile for users of [product/service], focusing on their values, attitudes, interests, lifestyle choices, social identities, and aspirations. Explain how these psychological characteristics influence their purchasing decisions, brand preferences, and product usage patterns for solutions in my category.`,
            
            'Pain points': `Identify and analyze the critical pain points experienced by [specific user group] when they attempt to [relevant task/process]. For each pain point, describe the context in which it occurs, its emotional impact, current workarounds users employ, and how these challenges affect overall satisfaction and outcomes. Prioritize these pain points by severity and frequency.`,
            
            'Stakeholder interviews': `Design a structured stakeholder interview protocol for gathering insights about [project/product]. Include questions that explore their role, business objectives, definition of success, concerns, constraints, and vision. Provide guidance on how to conduct these interviews effectively and how to analyze the resulting data to inform product strategy.`,
            
            'Observational research': `Create a detailed plan for conducting observational research to understand how [specific user group] interacts with [product/environment/process]. Include methodology, what behaviors to document, ethical considerations, data collection techniques, and a framework for analyzing patterns and anomalies in the observed behaviors.`,
            
            'Competitive analysis': `Develop a comprehensive competitive analysis framework for [product/service category]. Include direct and indirect competitors, evaluation criteria (features, pricing, user experience, market positioning, strengths/weaknesses), emerging threats, and opportunities for differentiation. Conclude with strategic recommendations based on competitive gaps.`,
            
            'Market research': `Design a market research plan for [product/service/industry] that combines quantitative and qualitative methods. Include research questions, data sources, analysis approach, and how findings will inform business strategy. Focus on market size, growth trends, customer segments, buying patterns, and emerging opportunities or threats.`,
            
            'Survey design': `Create a customer survey to gather insights about [specific aspect of product/service/experience]. Include a mix of question types (multiple choice, rating scales, open-ended) that will generate actionable data. Organize questions in a logical flow, avoid bias, and design it to take no more than 10 minutes to complete. Include guidance on sampling strategy and analysis methods.`,
            
            'Affinity diagram': `Help me structure an affinity diagramming exercise to organize and make sense of [specific research data/user feedback]. Outline the process for converting raw data into insights, including how to create meaningful categories, identify patterns and relationships, and translate the resulting structure into actionable recommendations.`,
            
            'Field studies': `Design a comprehensive field study plan to understand how [specific users] interact with [products/services/environments] in their natural context. Include research questions, participant selection criteria, data collection methods, ethical considerations, and analytical approach. Focus on capturing authentic behaviors and contextual factors that influence the user experience.`,
            
            'Focus groups': `Develop a detailed focus group discussion guide to explore [specific topic/product/concept] with [target participants]. Include warm-up activities, stimulus materials, key questions, probing techniques, and exercises that will generate meaningful insights. Structure the session to build from general to specific topics and manage group dynamics effectively.`,
            
            'Ethnographic research': `Create a plan for ethnographic research to deeply understand the cultural context and lived experiences of [specific user group] as they relate to [product/service/activity]. Include methods for immersion, relationship building, data collection, cultural sensitivity considerations, and how to analyze findings to inform product development and marketing strategy.`,
            
            'Contextual inquiry': `Design a contextual inquiry protocol to observe and interview [specific users] while they perform [specific tasks] in their natural environment. Include preparation steps, observation guidelines, interview questions, documentation methods, and analytical framework to translate findings into design requirements and opportunities.`,
            
            'Emotional mapping': `Help me create an emotional mapping framework to understand the feelings and reactions of users as they interact with [product/service/experience]. Include methods for identifying and measuring emotional states at each touchpoint, visualization techniques, and how to connect emotional patterns to specific design elements or service moments.`,
            
            'User journey': `Map out a detailed user journey for [specific persona] interacting with [product/service], from initial awareness through long-term usage. For each stage, identify the user's goals, actions, touchpoints, thoughts, feelings, and opportunities for improvement. Highlight moments of truth that disproportionately impact satisfaction and loyalty.`
        },
        
        'Visual Design': {
            // ... existing code ...
        },
        
        'Strategy': {
            // ... existing code ...
        },
        
        'Ideation': {
            // ... existing code ...
        },
        
        'Prototyping': {
            // ... existing code ...
        },
        
        'Testing': {
            // ... existing code ...
        },
        
        'UI Elements': {
            // ... existing code ...
        },
        
        'Accessibility': {
            // ... existing code ...
        },
        
        'Figma': {
            // ... existing code ...
        },
        
        'Design Principles': {
            // ... existing code ...
        }
    };
    
    // Check if we have a preset prompt for this topic and item
    if (presetPrompts[topic] && presetPrompts[topic][item]) {
        return presetPrompts[topic][item];
    }
    
    // Fallback for items that don't have a preset prompt
    return `What are the key considerations and best practices for implementing ${item.toLowerCase()} in the context of ${topic}? How does it impact the overall user experience, and what common pitfalls should be avoided? Be detailed, yet concise.`;
}

// Function to highlight placeholder text in brackets with purple color
function highlightPlaceholders(text) {
    return text.replace(/\[([^\]]+)\]/g, '<span style="color: var(--main-purple);">[$1]</span>');
}

// Function to check if project data exists and is meaningful
function checkForProjectData() {
    try {
        // Check if projectData is defined and has meaningful data
        return (
            typeof projectData !== 'undefined' &&
            (
                (projectData.projectDescription && projectData.projectDescription !== '' && projectData.projectDescription !== 'Not specified') ||
                (projectData.targetAudience && projectData.targetAudience !== '' && projectData.targetAudience !== 'Not specified') ||
                (projectData.projectType && projectData.projectType !== '' && projectData.projectType !== 'Not specified')
            )
        );
    } catch (error) {
        console.error('Error checking for project data:', error);
        return false;
    }
}

// Function to get project overview text
function getProjectOverviewText() {
    try {
        if (typeof projectData === 'undefined') {
            return '';
        }
        
        // Format project data into a readable text format
        return `Project Description: ${projectData.projectDescription || 'Not specified'}
Target Audience: ${projectData.targetAudience || 'Not specified'}
Project Type: ${projectData.projectType || 'Not specified'}
Main Goals: ${projectData.mainGoals && projectData.mainGoals.length ? projectData.mainGoals.join(', ') : 'Not specified'}
Design Style: ${projectData.designStyle && projectData.designStyle.length ? projectData.designStyle.join(', ') : 'Not specified'}
Figma Experience: ${projectData.figmaExperience || 'Not specified'}
Website Complexity: ${projectData.complexity || 'Not specified'}
Purposes: ${projectData.purposes || 'Not specified'}
Design Stage: ${projectData.designStage || 'Not specified'}
Additional Guidelines: ${projectData.guidelines || 'Not specified'}`;
    } catch (error) {
        console.error('Error getting project overview text:', error);
        return '';
    }
} 