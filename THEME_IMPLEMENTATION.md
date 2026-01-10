# Dark Mode & Light Mode Theme Implementation

## Overview
A complete Dark Mode and Light Mode theme implementation for the frontend using React Context API and Tailwind CSS. The default theme is **Dark Mode**, with a beautiful **Light Mode** that's gentle on the eyes.

## Features

✅ **Dynamic Theme Switching** - Toggle between Dark and Light modes instantly  
✅ **Persistent Theme** - Theme preference is saved in localStorage  
✅ **Smooth Transitions** - CSS transitions for a seamless theme change  
✅ **Accessible Toggle Button** - Convenient toggle in the Navbar  
✅ **Complete UI Coverage** - All components support both themes  
✅ **Light Mode Friendly** - Soft colors designed to be easy on the eyes  
✅ **Mobile Responsive** - Works perfectly on all screen sizes  

## Components & Files

### 1. **ThemeContext.jsx** (`src/app/Library/ThemeContext.jsx`)
- Creates a React Context for managing theme state globally
- Provides `isDarkMode` and `toggleTheme` functions
- Saves theme preference to localStorage
- Applies theme class to HTML element

### 2. **ThemeToggle.jsx** (`src/app/Components/ThemeToggle.jsx`)
- Reusable toggle button component
- Displays sun/moon icons based on current mode
- Located in the Navbar for easy access
- Responsive sizing on mobile and desktop

### 3. **Updated Navbar.jsx**
- Integrates ThemeToggle button in both desktop and mobile menus
- Theme-aware styling for all navbar elements
- Smooth color transitions between themes

### 4. **Updated Main.jsx**
- Uses ThemeContext for dynamic background and text colors
- Applies theme-aware classes to the main container

### 5. **Updated layout.jsx**
- Wraps the entire app with ThemeProvider
- Ensures theme context is available throughout the app

### 6. **globals.css** (Extended)
- Comprehensive light and dark mode CSS rules
- Tailwind @apply directives for consistent styling
- Smooth transitions between modes
- Gentle color palette for light mode

## Color Palette

### Dark Mode
- Background: `#1a1a1a` / `bg-gray-950`
- Text: `#ffffff` / `text-white`
- Accent: Cyan (`#00eaff`), Red (`#ff0055`)

### Light Mode (Eye-Friendly)
- Background: `#eff6ff` / `bg-blue-50`
- Text: `#111827` / `text-gray-900`
- Accent: Blue (`#2563eb`), Green (`#16a34a`)
- Soft shadows and gentle borders

## Usage

### Toggle Theme
The toggle button is automatically available in the Navbar:
```jsx
<ThemeToggle />
```

### Use Theme in Components
```jsx
import { useContext } from 'react';
import { ThemeContext } from '../Library/ThemeContext';

export default function MyComponent() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  return (
    <div className={isDarkMode ? 'dark-styles' : 'light-styles'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Apply Theme-Aware Styles
Use Tailwind classes with theme selectors in CSS:
```css
html.light .bg-gray-950 {
  @apply bg-blue-50;
}

html.light .text-white {
  @apply text-gray-900;
}
```

## How It Works

1. **Initialization**: When the app loads, ThemeProvider checks localStorage for saved theme
2. **Default**: Dark Mode is set as default if no preference exists
3. **Toggle**: Clicking the theme toggle button:
   - Updates React state
   - Saves preference to localStorage
   - Applies theme class to HTML element
4. **Styling**: CSS rules automatically switch based on `html.dark` or `html.light` class
5. **Persistence**: Theme preference persists across sessions

## CSS Class Application

The theme system adds/removes classes on the `<html>` element:
- **Dark Mode**: `<html class="dark">`
- **Light Mode**: `<html class="light">`

All theme-aware CSS is scoped to these classes:
```css
html.light {
  /* Light mode styles */
}

html.dark {
  /* Dark mode styles */
}
```

## Browser Support

- Modern browsers with CSS variables support
- localStorage for persistence
- CSS class selectors
- Tailwind CSS (v3+)

## File Structure

```
src/app/
├── Library/
│   └── ThemeContext.jsx          (Theme context provider)
├── Components/
│   ├── ThemeToggle.jsx           (Toggle button)
│   ├── Navbar.jsx                (Updated with toggle)
│   └── Main.jsx                  (Updated with theme)
├── layout.jsx                    (Updated with ThemeProvider)
└── globals.css                   (Comprehensive theme styles)
```

## Customization

### Change Default Theme
In `ThemeContext.jsx`, modify the initial state:
```jsx
const [isDarkMode, setIsDarkMode] = useState(false); // Light mode default
```

### Add More Color Variants
Extend globals.css with additional color mappings:
```css
html.light .bg-custom-dark {
  @apply bg-custom-light;
}
```

### Modify Toggle Button Appearance
Edit `ThemeToggle.jsx` to customize the icon, colors, or positioning.

## Performance

- Minimal re-renders with Context API
- Smooth CSS transitions (300ms)
- No external dependencies (uses React + Tailwind)
- localStorage for persistence without database calls

## Accessibility

- Toggle button has semantic ARIA labels
- Clear visual distinction between modes
- High contrast ratios in both modes
- Keyboard navigable

## Future Enhancements

- Auto theme based on system preference
- Additional theme variants (e.g., sepia, high contrast)
- Per-component theme overrides
- Animation theme switching
