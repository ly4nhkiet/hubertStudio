# GSAP Marquee Component

A flexible and customizable marquee component built with GSAP that supports both forward and reverse directions with adjustable speed.

## Features

- ✅ **Forward/Reverse Direction**: Control animation direction with `data-reverse` attribute
- ✅ **Adjustable Speed**: Set animation speed with `data-speed` attribute
- ✅ **Seamless Loop**: Content automatically clones for infinite scrolling
- ✅ **Interactive Controls**: Pause, resume, reverse, and speed control via JavaScript API
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Neon Effects**: Beautiful cyan glow effects with hover animations
- ✅ **GSAP Powered**: Smooth, performant animations using GSAP

## Quick Start

### 1. HTML Structure

```html
<div class="marquee-container" data-reverse="true" data-speed="25">
    <div class="marquee-track">
        <div class="marquee-content">
            <span>Your text here</span>
            <span>More text</span>
            <span>Additional content</span>
        </div>
    </div>
</div>
```

### 2. Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-reverse` | `"true"` / `"false"` | Controls animation direction |
| `data-speed` | `5-100` | Animation speed (higher = faster) |

### 3. JavaScript API

```javascript
// Get marquee instance
const container = document.querySelector('.marquee-container');
const marquee = container.marqueeInstance;

// Control methods
marquee.toggle();        // Pause/resume animation
marquee.setSpeed(30);    // Change animation speed
marquee.reverse();       // Reverse animation direction
```

## Examples

### Forward Direction (Default)
```html
<div class="marquee-container" data-reverse="false" data-speed="20">
    <div class="marquee-track">
        <div class="marquee-content">
            <span>FORWARD ANIMATION</span>
            <span>LEFT TO RIGHT</span>
        </div>
    </div>
</div>
```

### Reverse Direction
```html
<div class="marquee-container" data-reverse="true" data-speed="25">
    <div class="marquee-track">
        <div class="marquee-content">
            <span>REVERSE ANIMATION</span>
            <span>RIGHT TO LEFT</span>
        </div>
    </div>
</div>
```

### Fast Speed
```html
<div class="marquee-container" data-reverse="false" data-speed="50">
    <div class="marquee-track">
        <div class="marquee-content">
            <span>HIGH SPEED</span>
            <span>FAST MOVEMENT</span>
        </div>
    </div>
</div>
```

### Slow Speed
```html
<div class="marquee-container" data-reverse="true" data-speed="10">
    <div class="marquee-track">
        <div class="marquee-content">
            <span>SLOW MOTION</span>
            <span>RELAXED PACE</span>
        </div>
    </div>
</div>
```

## Demo Pages

- **Homepage**: Visit `/` to see marquee examples integrated into the main page
- **Demo Page**: Visit `/marquee-demo` for interactive examples with controls

## Files Created/Modified

### New Files
- `src/pages/marquee-demo.astro` - Interactive demo page
- `MARQUEE_README.md` - This documentation

### Modified Files
- `public/js/pages/homepage.js` - Enhanced marquee function with reverse support
- `src/pages/index.astro` - Added marquee examples
- `src/styles/main.scss` - Added marquee styles with neon effects

## CSS Classes

### Main Classes
- `.marquee-container` - Main container with overflow hidden
- `.marquee-track` - Track element that moves
- `.marquee-content` - Content wrapper with flex layout
- `.marquee-section` - Section wrapper for multiple marquees

### Styling Features
- Neon cyan glow effects
- Hover animations with scale and enhanced glow
- Separator dots between text items
- Responsive design for mobile devices
- Smooth transitions and animations

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Dependencies

- GSAP (GreenSock Animation Platform)
- Astro framework
- SCSS for styling

## Customization

### Changing Colors
Modify the CSS variables in `src/styles/main.scss`:

```scss
.marquee-content span {
    text-shadow: 
        0 0 5px #00ffff,    // Change this color
        0 0 10px #00ffff,   // Change this color
        0 0 15px #00ffff,   // Change this color
        0 0 20px #00ffff;   // Change this color
}
```

### Changing Font
Update the font-family in the CSS:

```scss
.marquee-content span {
    font-family: 'Your-Font', sans-serif;
}
```

### Adjusting Spacing
Modify the gap between items:

```scss
.marquee-content {
    gap: 3rem; // Change this value
}
```

## Performance Tips

1. **Limit Content**: Don't add too many text items to avoid performance issues
2. **Optimize Images**: If using images in marquee, optimize them for web
3. **Use Hardware Acceleration**: The component uses transform animations for better performance
4. **Monitor Speed**: Very high speeds (>80) may cause performance issues on slower devices

## Troubleshooting

### Marquee Not Moving
- Check if GSAP is properly loaded
- Verify the HTML structure matches the required format
- Check browser console for JavaScript errors

### Animation Too Fast/Slow
- Adjust the `data-speed` attribute
- Lower values = slower animation
- Higher values = faster animation

### Content Not Visible
- Ensure the container has proper width and height
- Check if overflow is hidden on the container
- Verify text color contrasts with background

## License

This component is part of the Hubert Studio project and follows the same licensing terms. 