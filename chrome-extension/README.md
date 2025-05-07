# Temporal Flow Extension

A Chrome extension that adds a search button to Temporal.io workflow pages, allowing quick access to workflow visualizations.

## Installation Guide

1. **Download the Extension**

   - Clone this repository or download the files to your local machine

2. **Load in Chrome**

   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" in the top left
   - Select the folder containing the extension files (manifest.json and content.js)

3. **Verify Installation**
   - The extension should now appear in your Chrome extensions list
   - Visit [Temporal.io](https://cloud.temporal.io/namespaces/<NAEMSPACE>/workflows)
   - You should see a new search button next to each workflow

## Usage

- The search (magnifying glass icon) button appears next to each workflow in the Temporal.io interface
- Clicking the button will open the workflow visualization in a new tab

## Troubleshooting

If you don't see the buttons:

- Make sure the extension is enabled
- Try refreshing the Temporal.io page
- If issues persist, try reloading the extension in chrome://extensions/
