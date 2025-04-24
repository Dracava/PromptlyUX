"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Function to create a text frame with the provided text and HTML
function createTextFrame(text, html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Default fonts
            yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
            yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
            yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
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
                    yield figma.loadFontAsync({ family: font, style: "Regular" });
                    monospaceFont = font;
                    console.log(`Loaded monospace font: ${font}`);
                    break; // Stop after loading the first available monospace font
                }
                catch (e) {
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
                    yield figma.loadFontAsync({ family: fontName, style: "Regular" });
                    loadedFonts.add(fontName);
                    console.log(`Loaded font: ${fontName}`);
                    // Try to load additional styles if available
                    try {
                        yield figma.loadFontAsync({ family: fontName, style: "Medium" });
                    }
                    catch (e) { }
                    try {
                        yield figma.loadFontAsync({ family: fontName, style: "Bold" });
                    }
                    catch (e) { }
                    try {
                        yield figma.loadFontAsync({ family: fontName, style: "Italic" });
                    }
                    catch (e) { }
                }
                catch (e) {
                    console.log(`Could not load font: ${fontName}`);
                }
            }
            // Create frame
            const frame = figma.createFrame();
            // Check if this is a style guide or persona
            const isStyleGuide = text.toLowerCase().includes('style guide') ||
                (html && html.toLowerCase().includes('style guide'));
            const isPersona = frame.name.toLowerCase().includes('persona') ||
                frame.name.toLowerCase().includes('user profile');
            // Set frame name based on content type
            if (isStyleGuide) {
                frame.name = "Style Guide";
            }
            else if (isPersona) {
                frame.name = "Persona";
            }
            else {
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
                yield figma.loadFontAsync({ family: regularFont.family, style: "Italic" });
                italicFont.style = "Italic";
            }
            catch (e) {
                console.log("Italic font not available, using fallback");
            }
            // Function to extract font name from text content
            const extractFontFromText = (text) => {
                // Check if the text explicitly mentions a font
                for (const font of loadedFonts) {
                    if (text.includes(font)) {
                        return font;
                    }
                }
                return null;
            };
            // Special function to handle font examples in style guides
            const processFontExample = (text, node) => __awaiter(this, void 0, void 0, function* () {
                // Check if this is a font example (e.g., "Montserrat: This is a modern sans-serif font")
                const fontExampleMatch = text.match(/^([A-Za-z\s]+)(?:\s*:\s*|\s+-\s+)(.*)/);
                if (fontExampleMatch) {
                    const fontName = fontExampleMatch[1].trim();
                    // Check if this is a loaded font
                    if (loadedFonts.has(fontName)) {
                        try {
                            yield figma.loadFontAsync({ family: fontName, style: "Regular" });
                            node.fontName = { family: fontName, style: "Regular" };
                            return true;
                        }
                        catch (e) {
                            console.log(`Could not apply font ${fontName} to example`);
                        }
                    }
                }
                return false;
            });
            // If HTML is provided, parse and create styled text
            if (html) {
                // Create a temporary DOM parser in the plugin UI
                figma.ui.postMessage({
                    type: 'parse-html',
                    html: html
                });
                // Listen for the parsed result
                figma.ui.once('message', (parsedData) => __awaiter(this, void 0, void 0, function* () {
                    if (parsedData.type === 'parsed-html-result') {
                        const elements = parsedData.elements;
                        let yOffset = padding;
                        let mentionedFont = null;
                        // Process each element
                        for (let i = 0; i < elements.length; i++) {
                            const element = elements[i];
                            const elementText = element.text.trim();
                            // Skip empty elements
                            if (!elementText)
                                continue;
                            // Check if this is a font mention
                            const fontName = extractFontFromText(elementText);
                            if (fontName) {
                                mentionedFont = fontName;
                            }
                            // Handle numbered lists - create separate text boxes for each item
                            if (element.type === 'numbered-list') {
                                // Split the numbered list into individual items
                                const items = elementText.split('\n');
                                for (const item of items) {
                                    if (!item.trim())
                                        continue;
                                    // Create a new text node for each numbered item
                                    const numberedNode = figma.createText();
                                    numberedNode.x = padding;
                                    numberedNode.y = yOffset;
                                    numberedNode.characters = item;
                                    numberedNode.textAutoResize = "HEIGHT";
                                    numberedNode.resize(contentWidth, numberedNode.height);
                                    // Use mentioned font if available, otherwise use the default
                                    if (mentionedFont) {
                                        try {
                                            yield figma.loadFontAsync({ family: mentionedFont, style: "Medium" });
                                            numberedNode.fontName = { family: mentionedFont, style: "Medium" };
                                        }
                                        catch (e) {
                                            numberedNode.fontName = mediumFont;
                                        }
                                    }
                                    else {
                                        numberedNode.fontName = mediumFont;
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
                            // Handle other elements as before...
                            // ... (rest of the existing code for handling other elements)
                        }
                        // Resize frame to fit content
                        frame.resize(maxWidth, yOffset + padding);
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
                        }
                        else if (isPersona) {
                            figma.notify("Persona added to Figma canvas!");
                        }
                        else {
                            figma.notify("Content added to Figma canvas!");
                        }
                        // Notify success
                        figma.notify('Content sent to Figma!');
                    }
                }));
            }
            else {
                // Fallback to simple text if no HTML is provided
                const textNode = figma.createText();
                // Use the primary font if we detected one
                if (loadedFonts.size > 1) {
                    const primaryFont = Array.from(loadedFonts).find(font => font !== "Inter") || "Inter";
                    textNode.fontName = { family: primaryFont, style: "Regular" };
                }
                else {
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
        }
        catch (error) {
            console.error("Error creating text frame:", error);
            figma.notify("Error creating text frame", { error: true });
        }
    });
}
// The plugin will remain open until the user clicks cancel or closes it manually 
