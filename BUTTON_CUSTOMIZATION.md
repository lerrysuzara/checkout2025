# Button Color Customization

The checkout app uses CSS variables for button styling, which can be easily customized from your coreFORCE page to match your theme.

## CSS Variables Available

The following CSS variables control the checkout button appearance:

```css
:root {
  --checkout-button-bg: #2563eb;           /* Button background color */
  --checkout-button-hover-bg: #1d4ed8;     /* Button hover background color */
  --checkout-button-text: #ffffff;         /* Button text color */
  --checkout-button-border: transparent;   /* Button border color */
  --checkout-button-border-radius: 0.5rem; /* Button border radius */
  --checkout-button-padding: 0.75rem 1.5rem; /* Button padding */
  --checkout-button-font-weight: 500;      /* Button font weight */
  --checkout-button-transition: background-color 0.15s ease-in-out; /* Transition */
}
```

## How to Customize

### Method 1: CSS Override (Recommended)

Add this CSS to your coreFORCE page to override the button colors:

```html
<style>
  /* Override checkout button colors to match your theme */
  :root {
    --checkout-button-bg: #your-primary-color;
    --checkout-button-hover-bg: #your-hover-color;
    --checkout-button-text: #ffffff;
  }
</style>
```

### Method 2: JavaScript Override

You can also set the CSS variables programmatically:

```javascript
// Set button colors to match your theme
document.documentElement.style.setProperty('--checkout-button-bg', '#your-primary-color');
document.documentElement.style.setProperty('--checkout-button-hover-bg', '#your-hover-color');
document.documentElement.style.setProperty('--checkout-button-text', '#ffffff');
```

## Example Color Schemes

### Green Theme
```css
:root {
  --checkout-button-bg: #16a34a;
  --checkout-button-hover-bg: #15803d;
  --checkout-button-text: #ffffff;
}
```

### Red Theme
```css
:root {
  --checkout-button-bg: #dc2626;
  --checkout-button-hover-bg: #b91c1c;
  --checkout-button-text: #ffffff;
}
```

### Purple Theme
```css
:root {
  --checkout-button-bg: #7c3aed;
  --checkout-button-hover-bg: #6d28d9;
  --checkout-button-text: #ffffff;
}
```

### Orange Theme
```css
:root {
  --checkout-button-bg: #ea580c;
  --checkout-button-hover-bg: #c2410c;
  --checkout-button-text: #ffffff;
}
```

## Implementation in coreFORCE

Add this to your coreFORCE page where you embed the checkout:

```html
<!-- Customize button colors -->
<style>
  :root {
    --checkout-button-bg: #your-brand-color;
    --checkout-button-hover-bg: #your-brand-hover-color;
    --checkout-button-text: #ffffff;
  }
</style>

<!-- Embed checkout app -->
<iframe src="path/to/checkout/index.html" width="100%" height="800px"></iframe>
```

## Notes

- The CSS variables are applied to buttons with classes: `.bg-blue-600`, `.btn-primary`, and `.checkout-button`
- Changes take effect immediately when the variables are updated
- The checkout app will automatically use your custom colors
- All button styling (padding, border-radius, etc.) can be customized using the available variables 