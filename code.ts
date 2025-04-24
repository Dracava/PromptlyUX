// This file holds the main code for the UI Design Assistant plugin.
// It handles the communication between the Figma document and the UI.

// Show the UI when the plugin starts
figma.showUI(__html__, { width: 380, height: 700 });

// Define message types for type safety
interface QuestionnaireData {
  projectType: string;
  designGoal: string;
  projectDescription: string;
}

type MessageType = 
  | { type: 'cancel' }
  | { type: 'questionnaire-complete', data: QuestionnaireData }
  | { type: 'chat-message', message: string }
  | { type: 'prompt-selected', promptTitle: string }
  | { type: 'toggle-collapse', collapsed: boolean }
  | { type: 'get-project-name' }
  | { type: 'create-text-frame', text: string, html?: string }
  | { type: 'parsed-html-result', elements: any[] };

// Handle messages from the UI
figma.ui.onmessage = async (msg: MessageType) => {
  // Handle different message types
  if (msg.type === 'cancel') {
    // Close the plugin when cancel is clicked
    figma.closePlugin();
  } 
  else if (msg.type === 'questionnaire-complete') {
    // Handle questionnaire completion
    console.log('Questionnaire data:', msg.data);
    
    // Here you would typically store this data or use it to inform the AI
    // For now, we'll just acknowledge receipt
    figma.notify('API verified!');
  }
  else if (msg.type === 'chat-message') {
    // Handle chat messages
    console.log('Chat message received:', msg.message);
    
    // In a real implementation, this would send the message to an AI API
    // and return the response to the UI
    // For now, we'll just acknowledge receipt
    figma.notify('Message received!');
  }
  else if (msg.type === 'prompt-selected') {
    // Handle prompt selection
    console.log('Prompt selected:', msg.promptTitle);
    
    // In a real implementation, this would trigger specific AI functionality
    // based on the selected prompt
    figma.notify(`Prompt "${msg.promptTitle}" selected!`);
  }
  else if (msg.type === 'toggle-collapse') {
    // Resize the plugin UI based on collapsed state
    if (msg.collapsed) {
      // When collapsed, only show the navigation bar
      figma.ui.resize(360, 50);
    } else {
      // When expanded, show the full UI
      figma.ui.resize(360, 600);
    }
  }
  else if (msg.type === 'get-project-name') {
    // Send the current project name back to the UI
    figma.ui.postMessage({
      type: 'project-name',
      name: figma.root.name || ''
    });
  }
  else if (msg.type === 'create-text-frame') {
    // Create a text frame with the content from the chat
    createTextFrame(msg.text, msg.html);
  }
  else if (msg.type === 'parsed-html-result') {
    // This is handled by the createTextFrame function
    // The message is received via figma.ui.once('message', ...) in that function
  }

};

// Function to create a text frame with the provided text and HTML
async function createTextFrame(text: string, html?: string) {
  try {
    // Default fonts
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    
    // Extract font names from the text
    const fontRegex = /(?:font|typeface|typography)(?:\s+family)?(?:\s*:\s*|\s+is\s+|\s+)["']?([A-Za-z\s]+)["']?/gi;
    const fontMatches = [];
    let match;
    
    // Extract from plain text
    while ((match = fontRegex.exec(text)) !== null) {
      if (match[1] && !match[1].toLowerCase().includes('font')) {
        fontMatches.push(match[1].trim());
      }
    }
    
    // Extract from HTML if available
    if (html) {
      fontRegex.lastIndex = 0; // Reset regex index
      while ((match = fontRegex.exec(html)) !== null) {
        if (match[1] && !match[1].toLowerCase().includes('font')) {
          fontMatches.push(match[1].trim());
        }
      }
    }
    
    // Common font names to look for explicitly
    const commonFonts = [
      "Montserrat", "Roboto", "Open Sans", "Lato", "Poppins", "Raleway", 
      "Oswald", "Playfair Display", "Merriweather", "Source Sans Pro",
      "Nunito", "Ubuntu", "Rubik", "Work Sans", "Quicksand", "Karla"
    ];
    
    // Common monospace fonts for code
    const monospaceFonts = [
      "Courier", "Courier New", "Consolas", "Monaco", "Menlo", "Source Code Pro", 
      "Fira Code", "Roboto Mono", "JetBrains Mono", "IBM Plex Mono"
    ];
    
    // Try to load at least one monospace font for code blocks
    let monospaceFont = "Courier New"; // Default fallback
    for (const font of monospaceFonts) {
      try {
        await figma.loadFontAsync({ family: font, style: "Regular" });
        monospaceFont = font;
        console.log(`Loaded monospace font: ${font}`);
        break; // Stop after loading the first available monospace font
      } catch (e) {
        console.log(`Could not load monospace font: ${font}`);
      }
    }
    
    // Check for explicit mentions of common fonts
    for (const font of commonFonts) {
      const fontRegexExplicit = new RegExp(`\\b${font}\\b`, 'i');
      if (fontRegexExplicit.test(text) || (html && fontRegexExplicit.test(html))) {
        fontMatches.push(font);
      }
    }
    
    // Remove duplicates and create a set of fonts to load
    const uniqueFonts = [...new Set(fontMatches)];
    const loadedFonts = new Set(["Inter"]); // Inter is already loaded
    
    // Try to load each detected font
    for (const fontName of uniqueFonts) {
      try {
        await figma.loadFontAsync({ family: fontName, style: "Regular" });
        loadedFonts.add(fontName);
        console.log(`Loaded font: ${fontName}`);
        
        // Try to load additional styles if available
        try { await figma.loadFontAsync({ family: fontName, style: "Medium" }); } catch (e) {}
        try { await figma.loadFontAsync({ family: fontName, style: "Bold" }); } catch (e) {}
        try { await figma.loadFontAsync({ family: fontName, style: "Italic" }); } catch (e) {}
      } catch (e) {
        console.log(`Could not load font: ${fontName}`);
      }
    }
    
    // Create frame
    const frame = figma.createFrame();
    
    // Check if this is a style guide or persona
    const isStyleGuide = text.toLowerCase().includes('style guide') || 
                        (html && html.toLowerCase().includes('style guide'));
    const isPersona = text.toLowerCase().includes('persona') || 
                     text.toLowerCase().includes('user profile') ||
                     text.toLowerCase().includes('user persona') ||
                     text.toLowerCase().includes('user research') ||
                     (html && (html.toLowerCase().includes('persona') || 
                              html.toLowerCase().includes('user profile') ||
                              html.toLowerCase().includes('user persona')));
    
    // Set frame name based on content type
    if (isStyleGuide) {
      frame.name = "Style Guide";
    } else if (isPersona) {
      frame.name = "Persona";
    } else {
      frame.name = "AI Response";
    }
    
    // Set frame properties
    const padding = 40;
    const maxWidth = 800;
    const contentWidth = maxWidth - (padding * 2);
    frame.resize(maxWidth, 100); // Initial height, will be adjusted later
    frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // Add rounded corners to the frame
    frame.cornerRadius = 20;
    frame.clipsContent = true;
    
    // Default fonts (will be overridden if specific fonts are detected)
    const regularFont = { family: "Inter", style: "Regular" };
    const mediumFont = { family: "Inter", style: "Medium" };
    const boldFont = { family: "Inter", style: "Bold" };
    const italicFont = { family: "Inter", style: "Regular" }; // Fallback if Italic not available
    
    // Use the first successfully loaded font as the primary font
    if (loadedFonts.size > 1) {
      // Get the first non-Inter font
      const primaryFont = Array.from(loadedFonts).find(font => font !== "Inter") || "Inter";
      regularFont.family = primaryFont;
      mediumFont.family = primaryFont;
      boldFont.family = primaryFont;
      italicFont.family = primaryFont;
    }
    
    try {
      // Try to load italic style for the primary font
      await figma.loadFontAsync({ family: regularFont.family, style: "Italic" });
      italicFont.style = "Italic";
    } catch (e) {
      console.log("Italic font not available, using fallback");
    }
    
    // Function to extract font name from text content
    const extractFontFromText = (text: string): string | null => {
      // Check if the text explicitly mentions a font
      for (const font of loadedFonts) {
        if (text.includes(font)) {
          return font;
        }
      }
      return null;
    };
    
    // Special function to handle font examples in style guides
    const processFontExample = async (text: string, node: TextNode) => {
      // Check if this is a font example (e.g., "Montserrat: This is a modern sans-serif font")
      const fontExampleMatch = text.match(/^([A-Za-z\s]+)(?:\s*:\s*|\s+-\s+)(.*)/);
      if (fontExampleMatch) {
        const fontName = fontExampleMatch[1].trim();
        // Check if this is a loaded font
        if (loadedFonts.has(fontName)) {
          try {
            await figma.loadFontAsync({ family: fontName, style: "Regular" });
            node.fontName = { family: fontName, style: "Regular" };
            return true;
          } catch (e) {
            console.log(`Could not apply font ${fontName} to example`);
          }
        }
      }
      return false;
    };
    
    // If HTML is provided, parse and create styled text
    if (html) {
      // Create a temporary DOM parser in the plugin UI
      figma.ui.postMessage({
        type: 'parse-html',
        html: html
      });
      
      // Listen for the parsed result
      figma.ui.once('message', async (parsedData) => {
        if (parsedData.type === 'parsed-html-result') {
          const elements = parsedData.elements;
          let yOffset = padding;
          
          // First pass: collect all colors with their context
          interface ColorInfo {
            hex: string;
            rgb: { r: number, g: number, b: number };
            category: string;
            name?: string;
            description?: string;
          }
          
          const colors: ColorInfo[] = [];
          let currentCategory = '';
          let currentColorName = '';
          
          // Enhanced color extraction - scan all text elements for color information
          // First pass: identify all color sections and extract colors
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const text = element.text.trim();
            
            // Detect color categories - more flexible detection
            if (text.includes('Primary Colors:') || text.includes('Primary Color:') || 
                text.match(/primary.*color/i)) {
              currentCategory = 'Primary';
            } else if (text.includes('Secondary Colors:') || text.includes('Secondary Color:') || 
                       text.match(/secondary.*color/i)) {
              currentCategory = 'Secondary';
            } else if (text.includes('Accent Colors:') || text.includes('Accent Color:') || 
                       text.match(/accent.*color/i)) {
              currentCategory = 'Accent';
            } else if (text.includes('Neutral Colors:') || text.includes('Neutral Color:') || 
                       text.match(/neutral.*color/i)) {
              currentCategory = 'Neutral';
            } else if (text.includes('Background Colors:') || text.includes('Background Color:') || 
                       text.match(/background.*color/i)) {
              currentCategory = 'Background';
            } else if (text.includes('Text Colors:') || text.includes('Text Color:') || 
                       text.match(/text.*color/i)) {
              currentCategory = 'Text';
            } else if (text.match(/colou?r palette/i) || text.match(/1\.\s*colou?r/i)) {
              // If we find a "Color Palette" heading, set a default category if none exists
              if (!currentCategory) {
                currentCategory = 'Main';
              }
            }
            
            // Extract color names - more flexible pattern
            const colorNameMatch = text.match(/[-\s]([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*:/);
            if (colorNameMatch) {
              currentColorName = colorNameMatch[1];
            }
            
            // Extract hex colors - improved pattern to catch more formats
            // This will match both #RRGGBB and RRGGBB formats
            const hexMatches = text.match(/(#?[0-9A-Fa-f]{6})\b/g);
            if (hexMatches) {
              // If we don't have a category yet but found colors, create a default one
              if (!currentCategory) {
                currentCategory = 'Main';
              }
              
              for (const match of hexMatches) {
                // Remove the # prefix if it exists
                const hex = match.startsWith('#') ? match.substring(1) : match;
                
                const r = parseInt(hex.substring(0, 2), 16) / 255;
                const g = parseInt(hex.substring(2, 4), 16) / 255;
                const b = parseInt(hex.substring(4, 6), 16) / 255;
                
                // Extract description if available
                let description = '';
                const descMatch = text.match(/\(([^)]*)\)/);
                if (descMatch) {
                  description = descMatch[1];
                }
                
                // Add to colors array if not already present
                const existingColor = colors.find(c => c.hex.toUpperCase() === hex.toUpperCase());
                if (!existingColor) {
                  colors.push({
                    hex: hex.toUpperCase(),
                    rgb: { r, g, b },
                    category: currentCategory,
                    name: currentColorName || '',
                    description: description || ''
                  });
                }
              }
            }
            
            // Extract short hex colors (#RGB format)
            const shortHexMatches = text.match(/(#[0-9A-Fa-f]{3})\b/g);
            if (shortHexMatches) {
              // If we don't have a category yet but found colors, create a default one
              if (!currentCategory) {
                currentCategory = 'Main';
              }
              
              for (const match of shortHexMatches) {
                // Remove the # prefix
                const shortHex = match.substring(1);
                
                // Convert 3-digit hex to 6-digit
                const hex = shortHex[0] + shortHex[0] + shortHex[1] + shortHex[1] + shortHex[2] + shortHex[2];
                
                const r = parseInt(hex.substring(0, 2), 16) / 255;
                const g = parseInt(hex.substring(2, 4), 16) / 255;
                const b = parseInt(hex.substring(4, 6), 16) / 255;
                
                // Add to colors array if not already present
                const existingColor = colors.find(c => c.hex.toUpperCase() === hex.toUpperCase());
                if (!existingColor) {
                  colors.push({
                    hex: hex.toUpperCase(),
                    rgb: { r, g, b },
                    category: currentCategory,
                    name: currentColorName || '',
                    description: ''
                  });
                }
              }
            }
            
            // Extract RGB colors
            const rgbMatches = text.match(/rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g);
            if (rgbMatches) {
              // If we don't have a category yet but found colors, create a default one
              if (!currentCategory) {
                currentCategory = 'Main';
              }
              
              for (const match of rgbMatches) {
                const rgbValues = match.match(/\d{1,3}/g);
                if (rgbValues && rgbValues.length === 3) {
                  const r = parseInt(rgbValues[0], 10) / 255;
                  const g = parseInt(rgbValues[1], 10) / 255;
                  const b = parseInt(rgbValues[2], 10) / 255;
                  
                  // Convert RGB to HEX for display
                  const toHex = (c: number) => {
                    const hex = Math.round(c * 255).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                  };
                  
                  const hex = `${toHex(r)}${toHex(g)}${toHex(b)}`;
                  
                  // Add to colors array if not already present
                  const existingColor = colors.find(c => c.hex.toUpperCase() === hex.toUpperCase());
                  if (!existingColor) {
                    colors.push({
                      hex: hex.toUpperCase(),
                      rgb: { r, g, b },
                      category: currentCategory,
                      name: currentColorName || '',
                      description: ''
                    });
                  }
                }
              }
            }
          }
          
          // Second pass: process the elements to create the frame content
          let inColorSection = false;
          let lastSectionHeading = '';
          let currentTextGroup = [];
          let currentTextGroupType = null;
          let mentionedFont = null;
          let hasCreatedColorSwatches = false;
          
          // For persona layout
          let isInPersonaSection = false;
          let personaSectionTitle = '';
          let personaFields = {};
          
          // Process each element
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const elementText = element.text.trim();
            
            // Skip empty elements
            if (!elementText) continue;
            
            // Check if this is a font mention
            const fontName = extractFontFromText(elementText);
            if (fontName) {
              mentionedFont = fontName;
            }
            
            // Check if this is a color palette section - more flexible detection
            const isColorSection = 
              elementText.toLowerCase().includes('color palette') || 
              elementText.match(/\d+\.\s*colou?r/i) ||
              elementText.toLowerCase().includes('primary color') ||
              elementText.toLowerCase().includes('secondary color') ||
              elementText.toLowerCase().includes('accent color') ||
              elementText.toLowerCase().includes('background color') ||
              elementText.toLowerCase().includes('text color');
            
            // Special handling for persona content
            if (isPersona) {
              // Check for common persona section headers
              const isPersonaHeader = 
                element.type === 'h1' || 
                element.type === 'h2' || 
                element.type === 'h3' || 
                element.type === 'h4' || 
                element.type === 'h5' || 
                element.type === 'h6' ||
                elementText.match(/^(Name|Age|Gender|Occupation|Background|Goals|Frustrations|Bio|Needs|Motivations|Behaviors|Challenges|Demographics|Personality|Quote|Skills|Tools|Brands|Influences):/i);
              
              // Check for subheadings within persona sections
              const isPersonaSubheading = 
                !isPersonaHeader && 
                elementText.match(/^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*):/) || 
                elementText.match(/^•\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*):/) ||
                elementText.match(/^-\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*):/);
              
              if (isPersonaHeader || isPersonaSubheading) {
                // If we have any current text group, finish it first
                if (currentTextGroup.length > 0) {
                  const groupedText = currentTextGroup.join('\n');
                  
                  // Create a text node for the content of the previous section
                  const textNode = figma.createText();
                  textNode.x = padding + 16; // Add slight indent for paragraphs in personas
                  textNode.y = yOffset;
                  textNode.characters = groupedText;
                  textNode.textAutoResize = "HEIGHT";
                  textNode.resize(contentWidth - 16, textNode.height); // Adjust width for indentation
                  textNode.fontName = regularFont;
                  textNode.fontSize = 14;
                  textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                  frame.appendChild(textNode);
                  
                  // Add spacing after text
                  yOffset += textNode.height + 16;
                  
                  // Reset the text group
                  currentTextGroup = [];
                  currentTextGroupType = null;
                }
                
                // Extract the section title
                let sectionTitle = elementText;
                let sectionContent = '';
                
                // Check if this is a "Key: Value" format
                const keyValueMatch = elementText.match(/^([^:]+):\s*(.*)/);
                if (keyValueMatch) {
                  // Clean up the title - remove bullet points if present
                  sectionTitle = keyValueMatch[1].trim().replace(/^[•\-]\s+/, '');
                  sectionContent = keyValueMatch[2].trim();
                  
                  // Create the section header
                  const headerNode = figma.createText();
                  headerNode.x = padding;
                  headerNode.y = yOffset;
                  headerNode.characters = sectionTitle;
                  
                  // Use different styling for main headers vs subheadings
                  if (isPersonaHeader) {
                    headerNode.fontName = boldFont;
                    headerNode.fontSize = 16;
                  } else {
                    // For subheadings
                    headerNode.fontName = mediumFont;
                    headerNode.fontSize = 14;
                    // Add indentation for subheadings
                    headerNode.x = padding + 16;
                  }
                  
                  headerNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                  frame.appendChild(headerNode);
                  
                  yOffset += headerNode.height + 8;
                  
                  // Create the content text if it exists
                  if (sectionContent) {
                    const contentNode = figma.createText();
                    contentNode.x = isPersonaSubheading ? padding + 16 : padding; // Indent subheading content
                    contentNode.y = yOffset;
                    contentNode.characters = sectionContent;
                    contentNode.textAutoResize = "HEIGHT";
                    contentNode.resize(contentWidth - (isPersonaSubheading ? 16 : 0), contentNode.height);
                    contentNode.fontName = regularFont;
                    contentNode.fontSize = 14;
                    contentNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                    frame.appendChild(contentNode);
                    
                    yOffset += contentNode.height + (isPersonaSubheading ? 12 : 16);
                  }
                } else {
                  // This is just a header without content on the same line
                  const headerNode = figma.createText();
                  headerNode.x = isPersonaSubheading ? padding + 16 : padding; // Indent subheadings
                  headerNode.y = yOffset;
                  headerNode.characters = sectionTitle;
                  
                  if (isPersonaHeader) {
                    headerNode.fontName = boldFont;
                    if (element.type === 'h1' || element.type === 'h2') {
                      headerNode.fontSize = element.type === 'h1' ? 24 : 20;
                    } else {
                      headerNode.fontSize = 18;
                    }
                  } else {
                    // For subheadings
                    headerNode.fontName = mediumFont;
                    headerNode.fontSize = 14;
                  }
                  
                  headerNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                  frame.appendChild(headerNode);
                  
                  yOffset += headerNode.height + (isPersonaSubheading ? 8 : 12);
                  
                  // Set the current section title for following content
                  personaSectionTitle = sectionTitle;
                  isInPersonaSection = true;
                }
                
                continue;
              } else if (isInPersonaSection) {
                // Check if this line might be a list item that's not a subheading
                const isNumberedList = elementText.match(/^\d+\./);
                const isBulletOrDashList = elementText.startsWith('•') || elementText.startsWith('-');
                
                if (isNumberedList) {
                  // Handle numbered lists separately - create individual text nodes
                  
                  // If we have any current text group, finish it first
                  if (currentTextGroup.length > 0) {
                    const groupedText = currentTextGroup.join('\n');
                    
                    // Create a text node for the content of the previous section
                    const textNode = figma.createText();
                    textNode.x = padding + 16; // Add slight indent for paragraphs in personas
                    textNode.y = yOffset;
                    textNode.characters = groupedText;
                    textNode.textAutoResize = "HEIGHT";
                    textNode.resize(contentWidth - 16, textNode.height); // Adjust width for indentation
                    textNode.fontName = regularFont;
                    textNode.fontSize = 14;
                    textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                    frame.appendChild(textNode);
                    
                    // Add spacing after text
                    yOffset += textNode.height + 16;
                    
                    // Reset the text group
                    currentTextGroup = [];
                    currentTextGroupType = null;
                  }
                  
                  // Create a separate text node for the numbered list item
                  const numberedListNode = figma.createText();
                  numberedListNode.x = padding + 24; // Indent list items
                  numberedListNode.y = yOffset;
                  numberedListNode.characters = elementText;
                  numberedListNode.textAutoResize = "HEIGHT";
                  numberedListNode.resize(contentWidth - 24, numberedListNode.height);
                  numberedListNode.fontName = regularFont;
                  numberedListNode.fontSize = 14;
                  numberedListNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                  frame.appendChild(numberedListNode);
                  
                  // Add spacing after numbered list item
                  yOffset += numberedListNode.height + 8; // Less spacing between list items
                } else if (isBulletOrDashList) {
                  // Group bullet and dash lists together
                  // Check if we're already collecting bullet/dash list items
                  if (currentTextGroupType === 'bullet-list') {
                    // Add to the existing list group
                    currentTextGroup.push(elementText);
                  } else {
                    // If we have any current text group, finish it first
                    if (currentTextGroup.length > 0) {
                      const groupedText = currentTextGroup.join('\n');
                      
                      // Create a text node for the content of the previous section
                      const textNode = figma.createText();
                      textNode.x = padding + 16; // Add slight indent for paragraphs in personas
                      textNode.y = yOffset;
                      textNode.characters = groupedText;
                      textNode.textAutoResize = "HEIGHT";
                      textNode.resize(contentWidth - 16, textNode.height); // Adjust width for indentation
                      textNode.fontName = regularFont;
                      textNode.fontSize = 14;
                      textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                      frame.appendChild(textNode);
                      
                      // Add spacing after text
                      yOffset += textNode.height + 16;
                      
                      // Reset the text group
                      currentTextGroup = [];
                    }
                    
                    // Start a new bullet list group
                    currentTextGroup = [elementText];
                    currentTextGroupType = 'bullet-list';
                  }
                } else {
                  // If we were collecting bullet list items, finish that group first
                  if (currentTextGroupType === 'bullet-list' && currentTextGroup.length > 0) {
                    const listText = currentTextGroup.join('\n');
                    
                    // Create a text node for the list items
                    const listNode = figma.createText();
                    listNode.x = padding + 24; // Indent list items
                    listNode.y = yOffset;
                    listNode.characters = listText;
                    listNode.textAutoResize = "HEIGHT";
                    listNode.resize(contentWidth - 24, listNode.height);
                    listNode.fontName = regularFont;
                    listNode.fontSize = 14;
                    listNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                    frame.appendChild(listNode);
                    
                    // Add spacing after list
                    yOffset += listNode.height + 16;
                    
                    // Reset the text group
                    currentTextGroup = [];
                    currentTextGroupType = null;
                  }
                  
                  // This is regular content that belongs to the current persona section
                  if (currentTextGroupType === null || currentTextGroupType === 'regular') {
                    currentTextGroupType = 'regular';
                    currentTextGroup.push(elementText);
                  } else {
                    // We're switching to regular text from something else
                    // Start a new group
                    currentTextGroup = [elementText];
                    currentTextGroupType = 'regular';
                  }
                }
                continue;
              }
            }
            
            // Handle headings - always in separate text boxes
            if (element.type === 'h1' || element.type === 'h2' || element.type === 'h3' || 
                element.type === 'h4' || element.type === 'h5' || element.type === 'h6' || 
                element.type === 'h7' || element.type === 'h8' || element.type === 'h9' || 
                element.type === 'h10') {
              // If we have any current text group, finish it first
              if (currentTextGroup.length > 0) {
                const groupedText = currentTextGroup.join('\n');
                
                // Check if the grouped text mentions a specific font
                const groupFontName = extractFontFromText(groupedText);
                
                const textNode = figma.createText();
                textNode.x = padding;
                textNode.y = yOffset;
                textNode.characters = groupedText;
                textNode.textAutoResize = "HEIGHT";
                textNode.resize(contentWidth, textNode.height);
                
                // Apply appropriate styling
                if (currentTextGroupType === 'bullet-list') {
                  textNode.fontName = groupFontName ? 
                    { family: groupFontName, style: "Regular" } : regularFont;
                  textNode.fontSize = 14;
                } else {
                  textNode.fontName = groupFontName ? 
                    { family: groupFontName, style: "Regular" } : regularFont;
                  textNode.fontSize = 14;
                }
                
                textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(textNode);
                
                // Add spacing after text
                yOffset += textNode.height + 16;
                
                // Reset the text group
                currentTextGroup = [];
                currentTextGroupType = null;
              }
              
              lastSectionHeading = elementText;
              
              // Create the heading
              const headingNode = figma.createText();
              headingNode.x = padding;
              headingNode.y = yOffset;
              headingNode.characters = elementText;
              headingNode.fontName = boldFont;
              headingNode.fontSize = element.type === 'h1' ? 24 : (element.type === 'h2' ? 20 : 18);
              headingNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
              frame.appendChild(headingNode);
              
              yOffset += headingNode.height + 24;
              
              // Check if this is a color section heading
              if (isColorSection) {
                inColorSection = true;
                
                // Create color swatches grid if we have colors
                if (colors.length > 0) {
                  hasCreatedColorSwatches = true;
                  const swatchSize = 80;
                  const gap = 16;
                  const swatchesPerRow = Math.floor((contentWidth + gap) / (swatchSize + gap));
                  
                  // Group colors by category
                  const categories = Array.from(new Set(colors.map(c => c.category)));
                  
                  // Create swatches for each category
                  for (const category of categories) {
                    const categoryColors = colors.filter(c => c.category === category);
                    
                    if (categoryColors.length === 0) continue;
                    
                    // Create category header
                    const categoryHeader = figma.createText();
                    categoryHeader.x = padding;
                    categoryHeader.y = yOffset;
                    categoryHeader.characters = `${category} Colors:`;
                    categoryHeader.fontName = mediumFont;
                    categoryHeader.fontSize = 16;
                    categoryHeader.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                    frame.appendChild(categoryHeader);
                    
                    yOffset += categoryHeader.height + 16;
                    
                    // Calculate layout
                    const colorsPerRow = Math.min(categoryColors.length, swatchesPerRow);
                    const rowCount = Math.ceil(categoryColors.length / colorsPerRow);
                    
                    // Create swatches grid
                    for (let row = 0; row < rowCount; row++) {
                      const rowY = yOffset;
                      const startIdx = row * colorsPerRow;
                      const endIdx = Math.min(startIdx + colorsPerRow, categoryColors.length);
                      
                      for (let j = startIdx; j < endIdx; j++) {
                        const { hex, rgb, name, description } = categoryColors[j];
                        const colIdx = j - startIdx;
                        
                        // Create swatch container
                        const swatchContainer = figma.createFrame();
                        swatchContainer.x = padding + colIdx * (swatchSize + gap);
                        swatchContainer.y = rowY;
                        swatchContainer.resize(swatchSize, swatchSize + 40);
                        swatchContainer.fills = [];
                        swatchContainer.name = `Color: #${hex}`;
                        frame.appendChild(swatchContainer);
                        
                        // Create color swatch
                        const swatch = figma.createRectangle();
                        swatch.x = 0;
                        swatch.y = 0;
                        swatch.resize(swatchSize, swatchSize);
                        swatch.fills = [{ type: 'SOLID', color: rgb }];
                        swatch.cornerRadius = 8;
                        swatch.effects = [{
                          type: 'DROP_SHADOW',
                          color: { r: 0, g: 0, b: 0, a: 0.1 },
                          offset: { x: 0, y: 2 },
                          radius: 4,
                          spread: 0,
                          visible: true,
                          blendMode: 'NORMAL'
                        }];
                        swatchContainer.appendChild(swatch);
                        
                        // Create hex code label
                        const label = figma.createText();
                        await figma.loadFontAsync(regularFont);
                        label.fontName = regularFont;
                        label.fontSize = 12;
                        label.characters = `#${hex}`;
                        label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
                        label.textAlignHorizontal = 'CENTER';
                        
                        // Position the label centered below the swatch
                        label.resize(swatchSize, label.height);
                        label.x = 0;
                        label.y = swatchSize + 8;
                        swatchContainer.appendChild(label);
                        
                        // Add color name if available
                        if (name) {
                          const nameLabel = figma.createText();
                          await figma.loadFontAsync(regularFont);
                          nameLabel.fontName = regularFont;
                          nameLabel.fontSize = 10;
                          nameLabel.characters = name;
                          nameLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
                          nameLabel.textAlignHorizontal = 'CENTER';
                          
                          // Position the name centered below the hex code
                          nameLabel.resize(swatchSize, nameLabel.height);
                          nameLabel.x = 0;
                          nameLabel.y = swatchSize + 24;
                          
                          // Truncate if too long
                          if (name.length > 15) {
                            nameLabel.characters = name.substring(0, 12) + '...';
                          }
                          
                          swatchContainer.appendChild(nameLabel);
                        }
                      }
                      
                      // Update yOffset for the next row
                      yOffset = rowY + swatchSize + 50;
                    }
                    
                    // Add spacing after each category
                    yOffset += 16;
                  }
                }
              }
              
              continue;
            }
            
            // Check for color section in regular text (not just headings)
            if (!inColorSection && isColorSection) {
              inColorSection = true;
              
              // Create a text node for the current element
              const textNode = figma.createText();
              textNode.x = padding;
              textNode.y = yOffset;
              textNode.characters = elementText;
              textNode.textAutoResize = "HEIGHT";
              textNode.resize(contentWidth, textNode.height);
              textNode.fontName = regularFont;
              textNode.fontSize = 14;
              textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
              frame.appendChild(textNode);
              
              yOffset += textNode.height + 16;
              
              // Create color swatches if we have colors
              if (colors.length > 0 && !hasCreatedColorSwatches) {
                hasCreatedColorSwatches = true;
                const swatchSize = 80;
                const gap = 16;
                const swatchesPerRow = Math.floor((contentWidth + gap) / (swatchSize + gap));
                
                // Group colors by category
                const categories = Array.from(new Set(colors.map(c => c.category)));
                
                // Create swatches for each category
                for (const category of categories) {
                  const categoryColors = colors.filter(c => c.category === category);
                  
                  if (categoryColors.length === 0) continue;
                  
                  // Create category header
                  const categoryHeader = figma.createText();
                  categoryHeader.x = padding;
                  categoryHeader.y = yOffset;
                  categoryHeader.characters = `${category} Colors:`;
                  categoryHeader.fontName = mediumFont;
                  categoryHeader.fontSize = 16;
                  categoryHeader.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                  frame.appendChild(categoryHeader);
                  
                  yOffset += categoryHeader.height + 16;
                  
                  // Calculate layout
                  const colorsPerRow = Math.min(categoryColors.length, swatchesPerRow);
                  const rowCount = Math.ceil(categoryColors.length / colorsPerRow);
                  
                  // Create swatches grid
                  for (let row = 0; row < rowCount; row++) {
                    const rowY = yOffset;
                    const startIdx = row * colorsPerRow;
                    const endIdx = Math.min(startIdx + colorsPerRow, categoryColors.length);
                    
                    for (let j = startIdx; j < endIdx; j++) {
                      const { hex, rgb, name } = categoryColors[j];
                      const colIdx = j - startIdx;
                      
                      // Create swatch container
                      const swatchContainer = figma.createFrame();
                      swatchContainer.x = padding + colIdx * (swatchSize + gap);
                      swatchContainer.y = rowY;
                      swatchContainer.resize(swatchSize, swatchSize + 40);
                      swatchContainer.fills = [];
                      swatchContainer.name = `Color: #${hex}`;
                      frame.appendChild(swatchContainer);
                      
                      // Create color swatch
                      const swatch = figma.createRectangle();
                      swatch.x = 0;
                      swatch.y = 0;
                      swatch.resize(swatchSize, swatchSize);
                      swatch.fills = [{ type: 'SOLID', color: rgb }];
                      swatch.cornerRadius = 8;
                      swatch.effects = [{
                        type: 'DROP_SHADOW',
                        color: { r: 0, g: 0, b: 0, a: 0.1 },
                        offset: { x: 0, y: 2 },
                        radius: 4,
                        spread: 0,
                        visible: true,
                        blendMode: 'NORMAL'
                      }];
                      swatchContainer.appendChild(swatch);
                      
                      // Create hex code label
                      const label = figma.createText();
                      await figma.loadFontAsync(regularFont);
                      label.fontName = regularFont;
                      label.fontSize = 12;
                      label.characters = `#${hex}`;
                      label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
                      label.textAlignHorizontal = 'CENTER';
                      
                      // Position the label centered below the swatch
                      label.resize(swatchSize, label.height);
                      label.x = 0;
                      label.y = swatchSize + 8;
                      swatchContainer.appendChild(label);
                      
                      // Add color name if available
                      if (name) {
                        const nameLabel = figma.createText();
                        await figma.loadFontAsync(regularFont);
                        nameLabel.fontName = regularFont;
                        nameLabel.fontSize = 10;
                        nameLabel.characters = name;
                        nameLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
                        nameLabel.textAlignHorizontal = 'CENTER';
                        
                        // Position the name centered below the hex code
                        nameLabel.resize(swatchSize, nameLabel.height);
                        nameLabel.x = 0;
                        nameLabel.y = swatchSize + 24;
                        
                        // Truncate if too long
                        if (name.length > 15) {
                          nameLabel.characters = name.substring(0, 12) + '...';
                        }
                        
                        swatchContainer.appendChild(nameLabel);
                      }
                    }
                    
                    // Update yOffset for the next row
                    yOffset = rowY + swatchSize + 50;
                  }
                  
                  // Add spacing after each category
                  yOffset += 16;
                }
                
                continue;
              }
            }
            
            // Group text elements after headings or in bullet lists
            if (element.type === 'bullet-list') {
              // If we're starting a new bullet list or continuing one
              if (currentTextGroupType === null || currentTextGroupType === 'bullet-list') {
                currentTextGroupType = 'bullet-list';
                currentTextGroup.push('• ' + elementText);
                continue;
              } else {
                // If we're switching from regular text to bullet list, create the previous text node first
                const groupedText = currentTextGroup.join('\n');
                
                // Check if the grouped text mentions a specific font
                const groupFontName = extractFontFromText(groupedText);
                
                const textNode = figma.createText();
                textNode.x = padding;
                textNode.y = yOffset;
                textNode.characters = groupedText;
                textNode.textAutoResize = "HEIGHT";
                textNode.resize(contentWidth, textNode.height);
                
                // Check if this is a font example
                const isFontExample = await processFontExample(groupedText, textNode);
                
                // Use mentioned font if available and not a font example
                if (!isFontExample && groupFontName) {
                  try {
                    await figma.loadFontAsync({ family: groupFontName, style: "Regular" });
                    textNode.fontName = { family: groupFontName, style: "Regular" };
                  } catch (e) {
                    textNode.fontName = regularFont;
                  }
                } else if (!isFontExample) {
                  textNode.fontName = regularFont;
                }
                
                textNode.fontSize = 14;
                textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(textNode);
                
                // Add spacing after text
                yOffset += textNode.height + 16;
                
                // Start a new bullet list group
                currentTextGroup = ['• ' + elementText];
                currentTextGroupType = 'bullet-list';
                continue;
              }
            } 
            // Handle numbered lists - create separate text boxes for each item
            else if (element.type === 'numbered-list') {
              // If we have any current text group, finish it first
              if (currentTextGroup.length > 0) {
                const groupedText = currentTextGroup.join('\n');
                
                // Check if the grouped text mentions a specific font
                const groupFontName = extractFontFromText(groupedText);
                
                const textNode = figma.createText();
                textNode.x = padding;
                textNode.y = yOffset;
                textNode.characters = groupedText;
                textNode.textAutoResize = "HEIGHT";
                textNode.resize(contentWidth, textNode.height);
                
                // Apply appropriate styling
                if (currentTextGroupType === 'bullet-list') {
                  textNode.fontName = groupFontName ? 
                    { family: groupFontName, style: "Regular" } : regularFont;
                  textNode.fontSize = 14;
                } else {
                  textNode.fontName = groupFontName ? 
                    { family: groupFontName, style: "Regular" } : regularFont;
                  textNode.fontSize = 14;
                }
                
                textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(textNode);
                
                // Add spacing after text
                yOffset += textNode.height + 16;
                
                // Reset the text group
                currentTextGroup = [];
                currentTextGroupType = null;
              }
              
              // Split the numbered list into individual items
              const items = elementText.split('\n');
              
              for (const item of items) {
                // Create a new text node for each numbered item
                const numberedNode = figma.createText();
                numberedNode.x = padding;
                numberedNode.y = yOffset;
                
                // Handle bold text before semicolon
                const colonIndex = item.indexOf(':');
                if (colonIndex !== -1) {
                  const beforeColon = item.substring(0, colonIndex);
                  const afterColon = item.substring(colonIndex);
                  
                  numberedNode.characters = beforeColon + afterColon;
                  numberedNode.textAutoResize = "HEIGHT";
                  numberedNode.resize(contentWidth, numberedNode.height);
                  
                  // Make text before colon bold
                  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
                  numberedNode.setRangeFontName(0, colonIndex, { family: "Inter", style: "Bold" });
                  
                  // Set regular font for rest of text
                  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
                  numberedNode.setRangeFontName(colonIndex, item.length, { family: "Inter", style: "Regular" });
                } else {
                  numberedNode.characters = item;
                  numberedNode.textAutoResize = "HEIGHT";
                  numberedNode.resize(contentWidth, numberedNode.height);
                  numberedNode.fontName = regularFont;
                }
                
                // Set font size slightly larger than regular text
                numberedNode.fontSize = 16;
                numberedNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(numberedNode);
                
                // Add spacing after each numbered item
                yOffset += numberedNode.height + 12;
              }
              
              // Add a bit more spacing after the entire numbered list
              yOffset += 8;
              continue;
            }
            else if (element.type === 'strong' || element.type === 'em' || element.type === 'code') {
              // Handle special formatting elements individually
              // Create a text node for the current group if it exists
              if (currentTextGroup.length > 0) {
                const groupedText = currentTextGroup.join('\n');
                
                // Check if the grouped text mentions a specific font
                const groupFontName = extractFontFromText(groupedText);
                
                const textNode = figma.createText();
                textNode.x = padding;
                textNode.y = yOffset;
                textNode.characters = groupedText;
                textNode.textAutoResize = "HEIGHT";
                textNode.resize(contentWidth, textNode.height);
                
                // Check if this is a font example
                const isFontExample = await processFontExample(groupedText, textNode);
                
                // Use mentioned font if available and not a font example
                if (!isFontExample && groupFontName) {
                  try {
                    await figma.loadFontAsync({ family: groupFontName, style: "Regular" });
                    textNode.fontName = { family: groupFontName, style: "Regular" };
                  } catch (e) {
                    textNode.fontName = regularFont;
                  }
                } else if (!isFontExample) {
                  textNode.fontName = regularFont;
                }
                
                textNode.fontSize = 14;
                textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(textNode);
                
                // Add spacing after text
                yOffset += textNode.height + 16;
                
                // Reset the text group
                currentTextGroup = [];
                currentTextGroupType = null;
              }
              
              // Create individual node for specially formatted text
              const textNode = figma.createText();
              textNode.x = padding;
              textNode.y = yOffset;
              textNode.characters = elementText;
              textNode.textAutoResize = "HEIGHT";
              textNode.resize(contentWidth, textNode.height);
              
              // Apply styling based on element type and mentioned font
              switch (element.type) {
                case 'strong':
                  if (mentionedFont) {
                    try {
                      await figma.loadFontAsync({ family: mentionedFont, style: "Bold" });
                      textNode.fontName = { family: mentionedFont, style: "Bold" };
                    } catch (e) {
                      textNode.fontName = boldFont;
                    }
                  } else {
                    textNode.fontName = boldFont;
                  }
                  textNode.fontSize = 14;
                  break;
                case 'em':
                  if (mentionedFont) {
                    try {
                      await figma.loadFontAsync({ family: mentionedFont, style: "Italic" });
                      textNode.fontName = { family: mentionedFont, style: "Italic" };
                    } catch (e) {
                      textNode.fontName = italicFont;
                    }
                  } else {
                    textNode.fontName = italicFont;
                  }
                  textNode.fontSize = 14;
                  break;
                case 'code':
                  textNode.fontName = regularFont; // Usually code uses a monospace font
                  textNode.fontSize = 14;
                  // Add background for code
                  const codeRect = figma.createRectangle();
                  codeRect.x = textNode.x - 4;
                  codeRect.y = textNode.y - 2;
                  codeRect.resize(textNode.width + 8, textNode.height + 4);
                  codeRect.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
                  codeRect.cornerRadius = 4;
                  frame.appendChild(codeRect);
                  
                  // Use monospace font for code
                  try {
                    textNode.fontName = { family: monospaceFont, style: "Regular" };
                  } catch (e) {
                    console.log("Could not apply monospace font to code");
                  }
                  break;
              }
              
              textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
              frame.appendChild(textNode);
              
              // Add spacing after text
              yOffset += textNode.height + 16;
              continue;
            } else {
              // Regular text - add to the current group if we have one, or start a new one
              if (currentTextGroupType === null) {
                currentTextGroupType = 'regular';
                currentTextGroup.push(elementText);
                continue;
              } else if (currentTextGroupType === 'regular') {
                // Continue adding to the regular text group
                currentTextGroup.push(elementText);
                continue;
              } else {
                // We're switching from bullet list to regular text, create the previous text node first
                const groupedText = currentTextGroup.join('\n');
                
                // Check if the grouped text mentions a specific font
                const groupFontName = extractFontFromText(groupedText);
                
                const textNode = figma.createText();
                textNode.x = padding;
                textNode.y = yOffset;
                
                // Add paragraph indentation for persona content
                if (isPersona) {
                  textNode.x = padding + 16; // Add slight indent for paragraphs in personas
                }
                
                textNode.characters = groupedText;
                textNode.textAutoResize = "HEIGHT";
                
                // Adjust width for indentation if needed
                const adjustedWidth = isPersona ? contentWidth - 16 : contentWidth;
                textNode.resize(adjustedWidth, textNode.height);
                
                // Check if this is a font example
                const isFontExample = await processFontExample(groupedText, textNode);
                
                // Apply styling based on the group type and mentioned font
                if (currentTextGroupType === 'bullet-list') {
                  if (!isFontExample && groupFontName) {
                    try {
                      await figma.loadFontAsync({ family: groupFontName, style: "Regular" });
                      textNode.fontName = { family: groupFontName, style: "Regular" };
                    } catch (e) {
                      textNode.fontName = regularFont;
                    }
                  } else if (!isFontExample) {
                    textNode.fontName = regularFont;
                  }
                  textNode.fontSize = 14;
                } else {
                  if (!isFontExample && groupFontName) {
                    try {
                      await figma.loadFontAsync({ family: groupFontName, style: "Regular" });
                      textNode.fontName = { family: groupFontName, style: "Regular" };
                    } catch (e) {
                      textNode.fontName = regularFont;
                    }
                  } else if (!isFontExample) {
                    textNode.fontName = regularFont;
                  }
                  textNode.fontSize = 14;
                }
                
                textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                frame.appendChild(textNode);
                
                // Add spacing after text
                yOffset += textNode.height + 16;
                
                // Start a new regular text group
                currentTextGroup = [elementText];
                currentTextGroupType = 'regular';
                continue;
              }
            }
          }
          
          // Create a text node for any remaining text in the current group
          if (currentTextGroup.length > 0) {
            const groupedText = currentTextGroup.join('\n');
            
            // Check if the grouped text mentions a specific font
            const groupFontName = extractFontFromText(groupedText);
            
            const textNode = figma.createText();
            textNode.x = padding;
            textNode.y = yOffset;
            
            // Add paragraph indentation for persona content
            if (isPersona) {
              textNode.x = padding + 16; // Add slight indent for paragraphs in personas
            }
            
            textNode.characters = groupedText;
            textNode.textAutoResize = "HEIGHT";
            
            // Adjust width for indentation if needed
            const adjustedWidth = isPersona ? contentWidth - 16 : contentWidth;
            textNode.resize(adjustedWidth, textNode.height);
            
            // Check if this is a font example
            const isFontExample = await processFontExample(groupedText, textNode);
            
            // Apply styling based on the group type and mentioned font
            if (currentTextGroupType === 'bullet-list') {
              if (!isFontExample && groupFontName) {
                try {
                  await figma.loadFontAsync({ family: groupFontName, style: "Regular" });
                  textNode.fontName = { family: groupFontName, style: "Regular" };
                } catch (e) {
                  textNode.fontName = regularFont;
                }
              } else if (!isFontExample) {
                textNode.fontName = regularFont;
              }
              textNode.fontSize = 14;
            } else {
              if (!isFontExample && groupFontName) {
                try {
                  await figma.loadFontAsync({ family: groupFontName, style: "Regular" });
                  textNode.fontName = { family: groupFontName, style: "Regular" };
                } catch (e) {
                  textNode.fontName = regularFont;
                }
              } else if (!isFontExample) {
                textNode.fontName = regularFont;
              }
              textNode.fontSize = 14;
            }
            
            textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            frame.appendChild(textNode);
            
            // Add spacing after text
            yOffset += textNode.height + 16;
          }
          
          // Resize frame to fit content
          frame.resize(maxWidth, yOffset + padding);
          
          // Fallback: If we have colors but haven't created swatches yet, add them at the end
          if (colors.length > 0 && !hasCreatedColorSwatches) {
            // Add a separator before the color palette
            const separator = figma.createLine();
            separator.x = padding;
            separator.y = yOffset;
            separator.resize(contentWidth, 0);
            separator.strokeWeight = 1;
            separator.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
            frame.appendChild(separator);
            
            yOffset += 24;
            
            // Create a heading for the color palette
            const colorHeading = figma.createText();
            colorHeading.x = padding;
            colorHeading.y = yOffset;
            colorHeading.characters = "Color Palette";
            colorHeading.fontName = boldFont;
            colorHeading.fontSize = 20;
            colorHeading.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            frame.appendChild(colorHeading);
            
            yOffset += colorHeading.height + 24;
            
            const swatchSize = 80;
            const gap = 16;
            const swatchesPerRow = Math.floor((contentWidth + gap) / (swatchSize + gap));
            
            // Group colors by category
            const categories = Array.from(new Set(colors.map(c => c.category)));
            
            // Create swatches for each category
            for (const category of categories) {
              const categoryColors = colors.filter(c => c.category === category);
              
              if (categoryColors.length === 0) continue;
              
              // Create category header
              const categoryHeader = figma.createText();
              categoryHeader.x = padding;
              categoryHeader.y = yOffset;
              categoryHeader.characters = `${category} Colors:`;
              categoryHeader.fontName = mediumFont;
              categoryHeader.fontSize = 16;
              categoryHeader.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
              frame.appendChild(categoryHeader);
              
              yOffset += categoryHeader.height + 16;
              
              // Calculate layout
              const colorsPerRow = Math.min(categoryColors.length, swatchesPerRow);
              const rowCount = Math.ceil(categoryColors.length / colorsPerRow);
              
              // Create swatches grid
              for (let row = 0; row < rowCount; row++) {
                const rowY = yOffset;
                const startIdx = row * colorsPerRow;
                const endIdx = Math.min(startIdx + colorsPerRow, categoryColors.length);
                
                for (let j = startIdx; j < endIdx; j++) {
                  const { hex, rgb, name } = categoryColors[j];
                  const colIdx = j - startIdx;
                  
                  // Create swatch container
                  const swatchContainer = figma.createFrame();
                  swatchContainer.x = padding + colIdx * (swatchSize + gap);
                  swatchContainer.y = rowY;
                  swatchContainer.resize(swatchSize, swatchSize + 40);
                  swatchContainer.fills = [];
                  swatchContainer.name = `Color: #${hex}`;
                  frame.appendChild(swatchContainer);
                  
                  // Create color swatch
                  const swatch = figma.createRectangle();
                  swatch.x = 0;
                  swatch.y = 0;
                  swatch.resize(swatchSize, swatchSize);
                  swatch.fills = [{ type: 'SOLID', color: rgb }];
                  swatch.cornerRadius = 8;
                  swatch.effects = [{
                    type: 'DROP_SHADOW',
                    color: { r: 0, g: 0, b: 0, a: 0.1 },
                    offset: { x: 0, y: 2 },
                    radius: 4,
                    spread: 0,
                    visible: true,
                    blendMode: 'NORMAL'
                  }];
                  swatchContainer.appendChild(swatch);
                  
                  // Create hex code label
                  const label = figma.createText();
                  await figma.loadFontAsync(regularFont);
                  label.fontName = regularFont;
                  label.fontSize = 12;
                  label.characters = `#${hex}`;
                  label.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
                  label.textAlignHorizontal = 'CENTER';
                  
                  // Position the label centered below the swatch
                  label.resize(swatchSize, label.height);
                  label.x = 0;
                  label.y = swatchSize + 8;
                  swatchContainer.appendChild(label);
                  
                  // Add color name if available
                  if (name) {
                    const nameLabel = figma.createText();
                    await figma.loadFontAsync(regularFont);
                    nameLabel.fontName = regularFont;
                    nameLabel.fontSize = 10;
                    nameLabel.characters = name;
                    nameLabel.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
                    nameLabel.textAlignHorizontal = 'CENTER';
                    
                    // Position the name centered below the hex code
                    nameLabel.resize(swatchSize, nameLabel.height);
                    nameLabel.x = 0;
                    nameLabel.y = swatchSize + 24;
                    
                    // Truncate if too long
                    if (name.length > 15) {
                      nameLabel.characters = name.substring(0, 12) + '...';
                    }
                    
                    swatchContainer.appendChild(nameLabel);
                  }
                }
                
                // Update yOffset for the next row
                yOffset = rowY + swatchSize + 50;
              }
              
              // Add spacing after each category
              yOffset += 16;
            }
            
            // Resize frame again to include color swatches
            frame.resize(maxWidth, yOffset + padding);
          }
          
          // Position the frame in the center of the viewport
          const centerX = figma.viewport.center.x - (frame.width / 2);
          const centerY = figma.viewport.center.y - (frame.height / 2);
          frame.x = centerX;
          frame.y = centerY;
          
          // Add the frame to the current page
          figma.currentPage.appendChild(frame);
          
          // Select the frame
          figma.currentPage.selection = [frame];
          
          // Zoom to the frame
          figma.viewport.scrollAndZoomIntoView([frame]);
          
          // Notify the user
          if (isStyleGuide) {
            figma.notify("Style guide added to Figma canvas!");
          } else if (isPersona) {
            figma.notify("Persona added to Figma canvas!");
          } else {
            figma.notify("Content added to Figma canvas!");
          }
          
          // Notify success
          figma.notify('Content sent to Figma!');
        }
      });
    } else {
      // Fallback to simple text if no HTML is provided
      const textNode = figma.createText();
      
      // Use the primary font if we detected one
      if (loadedFonts.size > 1) {
        const primaryFont = Array.from(loadedFonts).find(font => font !== "Inter") || "Inter";
        textNode.fontName = { family: primaryFont, style: "Regular" };
      } else {
        textNode.fontName = regularFont;
      }
      
      textNode.fontSize = 14;
      textNode.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
      textNode.characters = text;
      
      // Set text width constraint
      textNode.textAutoResize = "HEIGHT";
      textNode.resize(contentWidth, textNode.height);
      
      // Position and add the text
      textNode.x = padding;
      textNode.y = padding;
      frame.appendChild(textNode);
      
      // Resize frame to fit content
      frame.resize(maxWidth, textNode.height + (padding * 2));
      
      // Position the frame in the center of the viewport
      const centerX = figma.viewport.center.x - (frame.width / 2);
      const centerY = figma.viewport.center.y - (frame.height / 2);
      frame.x = centerX;
      frame.y = centerY;
      
      // Add the frame to the current page
      figma.currentPage.appendChild(frame);
      
      // Select the frame
      figma.currentPage.selection = [frame];
      
      // Zoom to the frame
      figma.viewport.scrollAndZoomIntoView([frame]);
      
      // Notify the user
      figma.notify("Text added to Figma canvas!");
    }
  } catch (error) {
    console.error("Error creating text frame:", error);
    figma.notify("Error creating text frame", { error: true });
  }
}

// The plugin will remain open until the user clicks cancel or closes it manually
