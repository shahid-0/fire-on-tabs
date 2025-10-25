# Visual Effects on Tabs

Beautiful visual effects appear on your browser tab after a few seconds of inactivity. Choose from fire, rain, snow, stars, or matrix effects, all with customizable settings.

## Demo

![Effects demo](./assets/demo.gif)

## Features

- **5 Visual Effects**: Fire, Rain, Snow, Stars, and Matrix
- **Customizable Settings**: Choose idle delay (1-30 seconds) and intensity
- **Modern Popup UI**: Easy-to-use interface for all settings
- **Smooth Animations**: Fades in/out smoothly with realistic physics
- **Smart Detection**: Disappears on any user interaction (mouse, keyboard, scroll, touch)
- **Lightweight**: No external dependencies, optimized performance
- **Persistent Settings**: Your preferences are saved across browser sessions

## Available Effects

### 🔥 Fire Effect
- Boiling flames with realistic physics
- Sparks and flickering animations
- Warm color palette with depth

### 🌧️ Rain Effect  
- Gentle falling raindrops
- Smooth CSS animations
- Calming blue tones

### ❄️ Snow Effect
- Winter snowfall with wind effects
- Rotating snowflakes of varying sizes
- Cool winter atmosphere

### ⭐ Stars Effect
- Twinkling night sky
- Shooting stars with trails
- Deep space ambiance

### 🔢 Matrix Effect
- Digital rain with characters
- Green terminal aesthetic
- Cyberpunk vibes

## Installation (Local/Unpacked)

1. **Clone or Download the Repository**
	- Download this folder to your computer, or clone with:
	  ```sh
	  git clone https://github.com/IamMoosa/visual-effects-on-tabs.git
	  ```

2. **Open Chrome Extensions Page**
	- Go to `chrome://extensions` in your browser.
	- Enable **Developer mode** (toggle in the top right).

3. **Load Unpacked Extension**
	- Click **Load unpacked**.
	- Select the folder containing this project (the folder with `manifest.json`).

4. **Verify Installation**
	- The extension should appear in your list with the effects icon.
	- Click the extension icon to open the settings popup.
	- Open any webpage or new tab to test.

## Usage

1. **Open Settings**
	- Click the extension icon in your browser toolbar to open the settings popup.

2. **Choose Your Effect**
	- Select from Fire, Rain, Snow, Stars, or Matrix effects.
	- Use the preview button to test effects before saving.

3. **Customize Settings**
	- Adjust idle delay (1-30 seconds)
	- Set intensity (Low, Medium, High)
	- Click "Save Settings" to apply changes.

4. **Enjoy the Effects**
	- After the set idle period, your chosen effect will fade in.
	- Interact with the page (mouse, keyboard, scroll, touch) to dismiss.
	- Effects will reappear after another idle period.

## Settings

### Idle Delay
- **1-5 seconds**: Quick effects for active users
- **5-15 seconds**: Balanced experience (default: 5s)
- **15-30 seconds**: Subtle effects for focused work

### Intensity Levels
- **Low**: Minimal particles, subtle effect
- **Medium**: Balanced particle count (default)
- **High**: Maximum particles, dramatic effect

### Effect Selection
- **Fire**: Warm, energetic atmosphere
- **Rain**: Calm, peaceful environment  
- **Snow**: Cool, wintery feeling
- **Stars**: Mysterious, space-like ambiance
- **Matrix**: Cyberpunk, tech-focused vibe

## Troubleshooting

- **Effects don't appear?**
  - Make sure the extension is enabled and loaded in Developer mode.
  - Check that you've selected an effect in the popup settings.
  - Reload the extension after making code changes.
  - Try on a regular webpage (some Chrome pages block content scripts).

- **Performance issues?**
  - Try reducing the intensity setting to "Low"
  - Close other browser tabs to free up resources
  - Disable other extensions temporarily to test

- **Visual artifacts?**
  - Ensure you have the latest code
  - If you use display scaling (e.g., 125%, 150%), effects should still look correct
  - Try switching to a different effect to isolate the issue

- **Settings not saving?**
  - Make sure you click "Save Settings" after making changes
  - Check that the extension has storage permissions
  - Try refreshing the page after saving settings

## Technical Details

### Architecture
- **Modular Design**: Each effect is a self-contained module
- **Dynamic Loading**: Effects are loaded on-demand to optimize performance
- **Canvas Rendering**: High-performance animations using HTML5 Canvas
- **CSS Animations**: Smooth transitions and overlays

### File Structure
```
├── content.js          # Main effect manager
├── popup.html         # Settings interface
├── popup.js           # Popup functionality  
├── popup.css          # Popup styling
├── effects/           # Effect modules
│   ├── fire.js       # Fire effect
│   ├── rain.js       # Rain effect
│   ├── snow.js       # Snow effect
│   ├── stars.js      # Stars effect
│   ├── matrix.js     # Matrix effect
│   └── *.css         # Effect-specific styles
└── manifest.json   # Extension configuration
```

## Uninstalling

1. Go to `chrome://extensions`.
2. Find "Visual Effects on Tabs" and click **Remove**.

## License

MIT License. See [License](LICENSE) for details.

## Credits

Beautiful effects coded with ❤️ by [Shahid Khan](https://www.linkedin.com/in/shahid-khan-1521a01a5/).