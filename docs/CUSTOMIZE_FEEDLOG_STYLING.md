---
name: customize-feedlog-styling
description: >-
  Theme the Feedlog issues widget with CSS custom properties (--feedlog-*).
  Use when the user wants colors, typography, shadows, spacing, badges, empty
  state, or upvote styling without changing data fetching or components.
---

# Customize Feedlog styling (CSS only)

This guide covers **CSS custom properties** for the Feedlog changelog widget (`feedlog-issues-client`, `feedlog-issues`, and nested cards). It does **not** cover custom data flow, SSR, or fully custom UI; for those integration levels (top-level client, composable components, or core-only SDK), see [Build Your Own Feedlog](BUILD_YOUR_OWN_FEEDLOG.md).

## Where to set variables

Set `--feedlog-*` on a selector that matches the custom element host, or on any **ancestor** in the light DOM. Custom properties **inherit through shadow DOM**, so wrapping styles usually work:

```css
feedlog-issues-client,
feedlog-issues {
  --feedlog-accent-color: #059669;
  --feedlog-card-padding: 1.25rem;
}
```

You can also target a single card:

```css
feedlog-issue {
  --feedlog-shadow-hover-enhancement: 0 8px 24px rgba(37, 99, 235, 0.12);
}
```

Use the same idea from React/Vue: a `className` or `style` on the wrapper that contains the web component, or global CSS that selects the tag name.

## `theme` prop and overrides

The `theme="light"` / `theme="dark"` attributes toggle **built-in default values** on each component host. Your CSS variable overrides still apply on top of those defaults.

## Authoritative sources

Defaults and new tokens are defined on `:host` in the source CSS. When in doubt, read the file:

| Area                                                        | File                                                                                                                                                                        |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Issues container, list chrome, palette shared with children | [`packages/webcomponents/src/components/feedlog-issues/feedlog-issues.css`](../packages/webcomponents/src/components/feedlog-issues/feedlog-issues.css)                     |
| Empty state illustration                                    | [`packages/webcomponents/src/components/feedlog-issues-list/feedlog-issues-list.css`](../packages/webcomponents/src/components/feedlog-issues-list/feedlog-issues-list.css) |
| Issue card, accent bar, upvote control, mobile tokens       | [`packages/webcomponents/src/components/feedlog-issue/feedlog-issue.css`](../packages/webcomponents/src/components/feedlog-issue/feedlog-issue.css)                         |
| Type badges (enhancement / bug / secondary)                 | [`packages/webcomponents/src/components/feedlog-badge/feedlog-badge.css`](../packages/webcomponents/src/components/feedlog-badge/feedlog-badge.css)                         |

The issues container background uses `var(--feedlog-background, var(--feedlog-theme-bg))`. Set **`--feedlog-background`** on `feedlog-issues` or an ancestor for a transparent or brand-colored shell; **`--feedlog-theme-bg`** is the internal default when `--feedlog-background` is unset.

### Global design tokens

[`packages/webcomponents/src/global/global.css`](../packages/webcomponents/src/global/global.css) defines additional `--feedlog-*` tokens on `:root` (for example `--feedlog-primary`, `--feedlog-popover`, blue scale steps). Those are aimed at shared primitives; the feed widget tables below focus on the issues UI files above.

---

## Reference: `feedlog-issues` ([feedlog-issues.css](../packages/webcomponents/src/components/feedlog-issues/feedlog-issues.css))

| Variable                     | Role                                                              | Light default (dark differs) |
| ---------------------------- | ----------------------------------------------------------------- | ---------------------------- |
| `--feedlog-theme-bg`         | Default container background when `--feedlog-background` is unset | `#ffffff`                    |
| `--feedlog-foreground`       | Section heading / primary text on container                       | `oklch(0.145 0 0)`           |
| `--feedlog-card`             | Skeleton / card surfaces in loading state                         | `#ffffff`                    |
| `--feedlog-card-foreground`  | Text on card surfaces (loading)                                   | `oklch(0.145 0 0)`           |
| `--feedlog-muted`            | Muted surfaces (e.g. skeleton accent bar)                         | `#ececf0`                    |
| `--feedlog-muted-foreground` | Muted text                                                        | `#717182`                    |
| `--feedlog-border`           | Borders                                                           | `rgba(0, 0, 0, 0.1)`         |
| `--feedlog-accent-color`     | Accent (inherited by children)                                    | `#2563eb`                    |
| `--feedlog-destructive`      | Bug / destructive accent                                          | `#d4183d`                    |
| `--feedlog-blue-400`         | Palette (gradients, icons)                                        | oklch blue                   |
| `--feedlog-blue-600`         | Palette                                                           | oklch blue                   |
| `--feedlog-blue-100`         | Palette                                                           | oklch blue                   |
| `--feedlog-red-100`          | Palette                                                           | `#fce7f3`                    |
| `--feedlog-red-400`          | Palette                                                           | `#f472b6`                    |
| `--feedlog-red-600`          | Palette                                                           | `#db2777`                    |
| `--feedlog-radius`           | Container and skeleton radius                                     | `0.625rem`                   |
| `--feedlog-gap`              | Gap between list items / skeletons                                | `0.5rem`                     |
| `--feedlog-padding`          | Container padding                                                 | `2rem`                       |
| `--feedlog-min-height`       | Container min height                                              | `100%`                       |
| `--feedlog-shadow`           | Skeleton / card shadow                                            | theme-specific               |

**Also consumed (set on host or ancestor):** `--feedlog-background` — overrides container background (see [feedlog-issues.css](../packages/webcomponents/src/components/feedlog-issues/feedlog-issues.css) `.issues-container`).

---

## Reference: `feedlog-issues-list` ([feedlog-issues-list.css](../packages/webcomponents/src/components/feedlog-issues-list/feedlog-issues-list.css))

| Variable                              | Role                       | Light default          |
| ------------------------------------- | -------------------------- | ---------------------- |
| `--feedlog-muted-foreground`          | Empty state secondary text | `#64748b`              |
| `--feedlog-foreground`                | Empty state primary text   | `oklch(0.145 0 0)`     |
| `--feedlog-empty-illustration-bg`     | SVG fill                   | `oklch(0.96 0.01 260)` |
| `--feedlog-empty-illustration-stroke` | SVG stroke                 | `oklch(0.75 0.02 260)` |
| `--feedlog-empty-illustration-muted`  | SVG muted stroke           | `oklch(0.82 0.01 260)` |

---

## Reference: `feedlog-issue` ([feedlog-issue.css](../packages/webcomponents/src/components/feedlog-issue/feedlog-issue.css))

### Base, colors, typography

| Variable                             | Role                               | Default (light)                   |
| ------------------------------------ | ---------------------------------- | --------------------------------- |
| `--feedlog-font-family`              | Card font stack                    | system UI stack                   |
| `--feedlog-background`               | Host background (card context)     | `#ffffff`                         |
| `--feedlog-foreground`               | Foreground                         | `oklch(0.145 0 0)`                |
| `--feedlog-card`                     | Card background                    | `#ffffff`                         |
| `--feedlog-card-foreground`          | Card text                          | `oklch(0.145 0 0)`                |
| `--feedlog-muted`                    | Muted fills                        | `#f4f4f5`                         |
| `--feedlog-muted-foreground`         | Muted text                         | `#64748b`                         |
| `--feedlog-border`                   | Borders                            | `rgba(0, 0, 0, 0.06)`             |
| `--feedlog-accent-color`             | Links, accents                     | `#2563eb`                         |
| `--feedlog-destructive`              | Bug stripe / destructive           | `#d4183d`                         |
| `--feedlog-blue-400`                 | Gradients, icons                   | oklch                             |
| `--feedlog-blue-600`                 | Icons                              | oklch                             |
| `--feedlog-red-600`                  | Gradients, filled upvote           | `#db2777`                         |
| `--feedlog-blue-300`                 | Dark theme upvote text hover chain | (dark only)                       |
| `--feedlog-radius`                   | Fallback radius                    | `0.625rem`                        |
| `--feedlog-gap`                      | (host)                             | `0.5rem`                          |
| `--feedlog-card-padding`             | Card body padding                  | `1.5rem`                          |
| `--feedlog-card-radius`              | Card radius                        | `1rem`                            |
| `--feedlog-title-font-family`        | Title font                         | `var(--feedlog-font-family)`      |
| `--feedlog-title-font-size`          | Title size                         | `1.5rem`                          |
| `--feedlog-title-font-weight`        | Title weight                       | `700`                             |
| `--feedlog-title-line-height`        | Title line height                  | `1.3`                             |
| `--feedlog-title-margin-bottom`      | Title spacing                      | `0.75rem`                         |
| `--feedlog-title-letter-spacing`     | Title tracking                     | `-0.02em`                         |
| `--feedlog-body-font-size`           | Body                               | `0.9375rem`                       |
| `--feedlog-body-line-height`         | Body                               | `1.65`                            |
| `--feedlog-timestamp-font-size`      | Timestamp                          | `0.75rem`                         |
| `--feedlog-timestamp-color`          | Timestamp color                    | `var(--feedlog-muted-foreground)` |
| `--feedlog-icon-color`               | Icons                              | `var(--feedlog-muted-foreground)` |
| `--feedlog-icon-color-muted`         | Muted icons                        | `var(--feedlog-muted-foreground)` |
| `--feedlog-pin-color`                | Pin icon                           | `var(--feedlog-accent-color)`     |
| `--feedlog-upvote-icon-color`        | Upvote outline                     | `var(--feedlog-blue-600)`         |
| `--feedlog-upvote-icon-filled-color` | Upvote filled                      | `var(--feedlog-red-600)`          |

### Card chrome, layout, underline, mobile

| Variable                                     | Role                           | Default                 |
| -------------------------------------------- | ------------------------------ | ----------------------- |
| `--feedlog-card-accent-height`               | Top accent bar height          | `3px`                   |
| `--feedlog-card-accent-opacity`              | Accent bar opacity             | `0.85`                  |
| `--feedlog-card-accent-gradient-enhancement` | Enhancement gradient           | blue → accent           |
| `--feedlog-card-accent-gradient-bug`         | Bug gradient                   | red → destructive       |
| `--feedlog-card-hover-translate-y`           | Card hover lift                | `0`                     |
| `--feedlog-shadow`                           | Card shadow                    | layered light shadow    |
| `--feedlog-shadow-hover-enhancement`         | Hover shadow (enhancement)     | defaults to base shadow |
| `--feedlog-shadow-hover-bug`                 | Hover shadow (bug)             | defaults to base shadow |
| `--feedlog-content-gap`                      | Main column gap                | `0.875rem`              |
| `--feedlog-header-margin-bottom`             | Header block                   | `0.875rem`              |
| `--feedlog-footer-margin-top`                | Footer                         | `1rem`                  |
| `--feedlog-footer-padding-top`               | Footer                         | `1.25rem`               |
| `--feedlog-title-underline-width`            | Title underline                | `3rem`                  |
| `--feedlog-title-underline-height`           | Title underline                | `2px`                   |
| `--feedlog-title-underline-offset`           | Title underline                | `-4px`                  |
| `--feedlog-title-underline-radius`           | Title underline                | `2px`                   |
| `--feedlog-card-padding-mobile`              | Card padding (narrow viewport) | `1rem`                  |
| `--feedlog-content-gap-mobile`               | Gap (narrow)                   | `0.75rem`               |
| `--feedlog-title-font-size-mobile`           | Title size (narrow)            | `1.25rem`               |

### Upvote control

| Variable                                     | Role                                 |
| -------------------------------------------- | ------------------------------------ |
| `--feedlog-upvote-bg`                        | Default background                   |
| `--feedlog-upvote-bg-hover`                  | Hover background                     |
| `--feedlog-upvote-border`                    | Border                               |
| `--feedlog-upvote-border-hover`              | Hover border                         |
| `--feedlog-upvote-shadow`                    | Shadow                               |
| `--feedlog-upvote-shadow-hover`              | Hover shadow                         |
| `--feedlog-upvote-shadow-active`             | Active shadow                        |
| `--feedlog-upvote-text`                      | Label color                          |
| `--feedlog-upvote-text-hover`                | Label hover                          |
| `--feedlog-upvote-upvoted-bg`                | Upvoted background                   |
| `--feedlog-upvote-upvoted-bg-hover`          | Upvoted hover background             |
| `--feedlog-upvote-upvoted-border`            | Upvoted border                       |
| `--feedlog-upvote-upvoted-border-hover`      | Upvoted hover border                 |
| `--feedlog-upvote-upvoted-text`              | Upvoted label                        |
| `--feedlog-upvote-upvoted-text-hover`        | Upvoted label hover                  |
| `--feedlog-upvote-reel-border`               | Count reel border                    |
| `--feedlog-upvote-reel-border-hover`         | Reel hover                           |
| `--feedlog-upvote-reel-border-upvoted`       | Reel upvoted                         |
| `--feedlog-upvote-reel-border-upvoted-hover` | Reel upvoted hover                   |
| `--feedlog-upvote-hover-lift`                | TranslateY on hover (default `-2px`) |
| `--feedlog-upvote-backdrop-blur`             | Backdrop blur (default `8px`)        |

Dark theme redefines the color-related upvote and shadow tokens in the same file.

---

## Reference: `feedlog-badge` ([feedlog-badge.css](../packages/webcomponents/src/components/feedlog-badge/feedlog-badge.css))

| Variable                        | Role                             |
| ------------------------------- | -------------------------------- |
| `--feedlog-badge-font-size`     | Badge text size                  |
| `--feedlog-badge-font-weight`   | Weight                           |
| `--feedlog-badge-padding-x`     | Horizontal padding               |
| `--feedlog-badge-padding-y`     | Vertical padding                 |
| `--feedlog-badge-border-radius` | Radius (pill)                    |
| `--feedlog-blue-bg`             | Enhancement / default background |
| `--feedlog-blue-text`           | Enhancement text                 |
| `--feedlog-blue-bg-hover`       | Enhancement hover background     |
| `--feedlog-red-bg`              | Destructive (bug) background     |
| `--feedlog-red-text`            | Destructive text                 |
| `--feedlog-red-bg-hover`        | Destructive hover                |
| `--feedlog-muted-bg`            | Secondary background             |
| `--feedlog-muted-text`          | Secondary text                   |
| `--feedlog-muted-bg-hover`      | Secondary hover                  |

---

## Beyond variables: parts and slots

Shadow DOM hides internal class names. For links, media, and the upvote control surface you can use **`::part(...)`** and **slots** as documented in the [feedlog-issue component readme](../packages/webcomponents/src/components/feedlog-issue/readme.md) (CSS Customization and Shadow Parts sections).

---

## Live example

See the **CustomCSSVars** story in [`packages/webcomponents/src/components/feedlog-issues/feedlog-issues.stories.tsx`](../packages/webcomponents/src/components/feedlog-issues/feedlog-issues.stories.tsx). From the monorepo root:

```bash
npm run storybook
```

---

## Copy to clipboard (AI / codegen)

Copy the block below into an assistant to generate or adjust theming code:

````markdown
You are helping theme the Feedlog issues widget using CSS only.

**Scope:** CSS custom properties (`--feedlog-*`) on `feedlog-issues-client`, `feedlog-issues`, or `feedlog-issue`. Do not change fetching or component choice unless the user asks.

**Rules:**

- Custom properties inherit into nested shadow roots; prefer setting tokens on `feedlog-issues-client` or `feedlog-issues` for a consistent feed.
- Respect `theme="light"` / `theme="dark"`; overrides apply on top of component defaults.
- For the full token list and file references, use the repo doc `docs/CUSTOMIZE_FEEDLOG_STYLING.md`.
- For upvote gradients, card accent bar, title underline, mobile breakpoints, and `::part` names, see `packages/webcomponents/src/components/feedlog-issue/readme.md`.
- Default values live in: `feedlog-issues.css`, `feedlog-issues-list.css`, `feedlog-issue.css`, `feedlog-badge.css`.

**Example:**

```css
feedlog-issues-client,
feedlog-issues {
  --feedlog-accent-color: #7c3aed;
  --feedlog-card-padding: 1.25rem;
  --feedlog-radius: 0.75rem;
}
```
````
