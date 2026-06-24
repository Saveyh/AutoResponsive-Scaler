# AutoResponsive-Scaler

Make your website responsive with one script instead of redesigning every breakpoint.

Best for art-directed, desktop-first websites where you want to preserve one precise layout and scale it between screen sizes.

Instead of writing many responsive breakpoints, you can design a precise layout at a fixed width, usually `1920px`, wrap the page in one container, and let this script scale the layout down to fit the viewport.

> Status: `0.1.0` experimental. The approach works well for visual, desktop-first websites, but it is not a replacement for every responsive layout.

## Why

Some websites are designed like fixed compositions: landing pages, portfolios, event pages, art-directed pages, one-off campaign sites, or prototypes.

For those projects, this helper lets you:

- build the desktop layout once at a known width;
- scale it smoothly between viewport sizes;
- keep fixed headers aligned with the scaled page;
- fix the document height after `transform: scale(...)`, so scrolling remains normal.

## Demo

Open the local demo:

```txt
examples/basic/index.html
```

If you publish this repository with GitHub Pages from the repository root, the demo URL will be:

```txt
https://Saveyh.github.io/AutoResponsive-Scaler/examples/basic/
```

## Quick Start

Copy `responsive-scale.js` into your project and load it in the `<head>`:

```html
<script src="./responsive-scale.js" data-design-width="1920"></script>
```

Wrap your page content:

```html
<body>
  <header data-scale-fixed>
    ...
  </header>

  <div class="container">
    ...
  </div>
</body>
```

Build your layout at the design width:

```css
.container {
  width: 1920px;
}
```

The script handles the scale, the horizontal overflow, and the corrected page height.

## CDN Usage

You can load the script directly from jsDelivr.

Stable version:

```html
<script
  src="https://cdn.jsdelivr.net/gh/Saveyh/AutoResponsive-Scaler@0.1.0/responsive-scale.js"
  data-design-width="1920"
></script>
```

Latest `main` branch:

```html
<script
  src="https://cdn.jsdelivr.net/gh/Saveyh/AutoResponsive-Scaler@main/responsive-scale.js"
  data-design-width="1920"
></script>
```

Use a tagged version like `@0.1.0` for production sites.

Replace `Saveyh` if you fork the repository under another GitHub account.

## Fixed Elements

If you have a fixed header, floating nav, or another fixed element outside `.container`, mark it with `data-scale-fixed`:

```html
<header data-scale-fixed>
  ...
</header>
```

The element will receive the same scale as the main container.

## Custom Container

By default, the script looks for:

```css
.container
```

You can also mark the scalable element directly:

```html
<main data-scale-container>
  ...
</main>
```

## Options

Add options directly on the script tag:

```html
<script
  src="./responsive-scale.js"
  data-design-width="1440"
  data-container=".page"
  data-fixed=".site-header"
  data-max-scale="1"
  data-min-scale="0"
></script>
```

| Attribute | Default | Description |
| --- | --- | --- |
| `data-design-width` | `1920` | Width used to design the layout. |
| `data-container` | `.container` | Selector for the scalable page wrapper. |
| `data-fixed` | `[data-scale-fixed], .scale-fixed` | Selector for fixed elements that should scale too. |
| `data-max-scale` | `1` | Prevents the layout from scaling larger than its design size. |
| `data-min-scale` | `0` | Optional minimum scale. Keep `0` if you want it to always fit the viewport. |
| `data-auto-height` | `true` | Updates `body` height after scaling. |
| `data-body-setup` | `true` | Applies basic body styles needed for centered scaling. |
| `data-auto` | `true` | Set to `false` for manual initialization. |

## Manual Initialization

If you do not want automatic initialization:

```html
<script src="./responsive-scale.js" data-auto="false"></script>
```

Then initialize it yourself:

```html
<script>
  ResponsiveScaleLayout.init({
    designWidth: 1920,
    container: ".container",
    fixed: "header",
  });
</script>
```

You can refresh measurements manually after custom layout changes:

```js
ResponsiveScaleLayout.instance.refresh();
```

## How It Works

The script calculates:

```txt
scale = viewport width / design width
```

Then it applies:

```css
transform: scale(var(--responsive-scale));
transform-origin: top center;
```

Because CSS transforms do not affect document flow, the script measures the scaled container and sets the correct `body` height.

## Limitations

This is an intentional shortcut, not a universal responsive system.

- Text, images, buttons, and hit targets all scale down together.
- Very small mobile screens may need a separate mobile layout.
- Browser zoom and accessibility text scaling are not the same as true responsive typography.
- The script writes `transform` on the scalable container and fixed elements. If those elements already need their own transforms, wrap the content in another element.
- CSS transforms create stacking contexts, which can affect z-index behavior.
- Viewport-based components such as modals, side menus, sticky sections, or scroll animations may need manual testing.
- If content changes after async loading, call `ResponsiveScaleLayout.instance.refresh()`.

## Browser Support

The script targets modern browsers with support for:

- CSS custom properties;
- `transform`;
- `MutationObserver`;
- `requestAnimationFrame`.

## Development

Run a basic syntax check:

```bash
npm test
```

Package dry-run:

```bash
npm pack --dry-run
```

## Publishing Checklist

Before publishing your first public release:

- enable GitHub Pages from the repository root if you want the demo URL;
- create a GitHub release matching the version in `package.json`;
- test the helper on at least two real websites.

## License

MIT
