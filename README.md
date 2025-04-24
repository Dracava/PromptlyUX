# PromptlyUX

A Figma plugin that serves as an AI UI/UX Design Assistant, developed by Daphne Varekamp for her Master's degree in Media Technology at Leiden University.

## Features

### AI Chat
- Real-time AI assistance for design workflow in Figma
- Dynamic question suggestions after each AI response
- One-click export of AI responses to Figma
- Zoom functionality for better readability
- Topic and prompt suggestions with regeneration capability

### Prompts Section
1. **Project Information**
   - Comprehensive project overview collection
   - Contextual understanding for better AI assistance

2. **Prompt Library**
   - Pre-made prompts organized by categories
   - Edit, copy, save, and send prompts to AI chat
   - Categories include UX Research, Strategy, Ideation, and more

3. **Generate Prompts**
   - Custom prompt generation based on user topics
   - Option to include project information
   - Multiple prompt variations

## Getting Started

1. Install the plugin in Figma
2. Complete the "Getting Started" survey to help the system understand your project scope
3. Access the AI chat or browse the prompt library
4. Generate custom prompts or use pre-made ones
5. Send responses directly to Figma

## Requirements

- Figma account
- OpenAI API key

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch for changes
npm run watch
```

## License

[MIT License](LICENSE)

## Author

Daphne Varekamp - Master's in Media Technology, Leiden University

Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
