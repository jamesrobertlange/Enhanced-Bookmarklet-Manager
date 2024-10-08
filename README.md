# Enhanced Bookmarklet Manager

Enhanced Bookmarklet Manager is a Chrome extension that allows you to easily manage, organize, and execute your bookmarklets directly from your browser.

## Features

1. **Organize Bookmarklets**: Store your bookmarklets in folders for easy categorization and access.
2. **Execute Bookmarklets**: Run your bookmarklets with a single click directly from the extension popup.
3. **Add and Edit**: Easily add new bookmarklets or edit existing ones.
4. **Delete Bookmarklets**: Remove unwanted bookmarklets from your collection.
5. **Import and Export**: Share your bookmarklet collection or backup your data with import/export functionality.

## Installation

1. Download the extension files or clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

### Managing Bookmarklets

1. Click on the extension icon in your Chrome toolbar to open the popup.
2. Use the folder dropdown to navigate between different categories of bookmarklets.
3. Select a bookmarklet from the list to work with it.

### Executing a Bookmarklet

1. Select the desired bookmarklet from the dropdown list.
2. Click the "Execute" button to run the bookmarklet on the current page.

### Adding a New Bookmarklet

1. Enter a name for your bookmarklet in the "Name" field.
2. (Optional) Specify a folder name to categorize your bookmarklet.
3. Paste or type your JavaScript code into the code textarea.
4. Click "Save" to add the bookmarklet to your collection.

### Deleting a Bookmarklet

1. Select the bookmarklet you want to remove from the dropdown list.
2. Click the "Delete" button and confirm the action.

### Exporting Bookmarklets

1. Click the "Export" button to save all your bookmarklets as a JSON file.
2. Choose a location on your computer to save the file.

### Importing Bookmarklets

1. Click the "Import" button.
2. Select a previously exported JSON file containing bookmarklets.
3. The imported bookmarklets will be added to your collection.

## Development

The extension consists of the following main files:

- `manifest.json`: Extension configuration
- `popup.html`: HTML structure for the extension popup
- `popup.js`: JavaScript code for handling user interactions and managing bookmarklets

To modify the extension:

1. Edit the relevant files.
2. Save your changes.
3. Go to `chrome://extensions/` in Chrome.
4. Click the refresh icon on the extension card to update it with your changes.

## Security Note

Be cautious when importing bookmarklets from unknown sources, as they can execute arbitrary JavaScript code on web pages you visit. Always review the code before adding or importing new bookmarklets.

## Contributing

Contributions to improve the Enhanced Bookmarklet Manager are welcome. Please feel free to submit pull requests or open issues to suggest improvements or report bugs.

## License

[Insert your chosen license here, e.g., MIT License, GPL, etc.]