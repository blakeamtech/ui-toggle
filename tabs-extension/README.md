# UI Toggle

A Microsoft Edge extension that provides a clean, distraction-free browsing experience by hiding the tabs and search bar. Toggle between fullscreen and normal mode with a keyboard shortcut.

## Features

- Toggle between fullscreen and normal mode
- Minimal navigation UI in fullscreen mode
- Keyboard shortcut support
- Visual indicator for extension status
- Smooth transitions

## Installation from Source

1. Clone this repository:
   ```bash
   git clone https://github.com/blakeamtech/ui-toggle.git
   ```

2. Open Edge and navigate to `edge://extensions/`

3. Enable "Developer mode" in the left sidebar

4. Click "Load unpacked" and select the extension directory

## Usage

- Click the extension icon to enable/disable the functionality
- Use `Alt+F` (Windows) to toggle fullscreen mode
- When in fullscreen mode, hover over the top-left corner to reveal navigation controls
- The extension icon shows 'ON' when enabled and 'OFF' when disabled

## Directory Structure

```
├── src/
│   ├── background.js    # Background script
│   ├── content.js       # Content script
│   ├── injected.js      # Injected script for UI manipulation
│   └── styles.css       # Styles for the extension
├── icons/               # Extension icons
└── manifest.json        # Extension manifest
```

## Development

The extension is built using vanilla JavaScript and follows Chrome Extension Manifest V3 guidelines.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please ensure your code follows the existing style and includes appropriate documentation. 