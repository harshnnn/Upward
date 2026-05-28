# Upward Design System

## Purpose

This document defines the shared design system for Upward across web and mobile.

The goal is a premium, dark-first, token-driven UI system that feels consistent on both platforms without forcing them to render the same way.

## Source-of-Truth Alignment

This design system follows the established Upward architecture:

- Web is React + Vite and should support dense dashboards, charts, and review flows.
- Mobile is React Native + Expo and should prioritize fast capture and lightweight navigation.
- Shared contracts, strict TypeScript, and a modular monorepo remain the operating model.
- Tailwind CSS and NativeWind are the styling conventions for web and mobile respectively.
- `packages/ui` is for reusable primitives and composition, not whole screens.
- `packages/design-tokens` is the canonical source for visual tokens.

## Critical Review Before Finalizing

A naive shared UI system would have these weaknesses:

- It would try to make web and mobile render identically, which leads to awkward compromises.
- It would keep colors and spacing in component files instead of a token layer, making brand updates expensive.
- It would mix layout primitives, charts, navigation, and form fields in one flat folder.
- It would create component APIs that only fit one platform.
- It would let ad hoc shadows, radii, and typography creep into feature code.
- It would overbuild complex components like dialogs and sheets before base primitives are stable.

### Improvements Applied

- Tokens are separated from components.
- Components are grouped by responsibility and platform.
- The system is dark-first with semantic surfaces and status colors.
- Layout primitives are small and composable.
- Navigation shells are treated as shells, not feature logic.
- Dashboard components sit above primitives and below screen-level composition.

## Design System Architecture

```text
packages/
  design-tokens/
    src/
      colors.ts
      typography.ts
      spacing.ts
      radius.ts
      elevation.ts
      motion.ts
      breakpoints.ts
      charts.ts
      mood.ts
      semantic.ts
      index.ts
  ui/
    src/
      primitives/
      layout/
      feedback/
      data-display/
      navigation/
      charts/
      calendar/
      theme/
      hooks/
      icons/
      index.tsx
```

## Shared Package Structure

### `packages/design-tokens`

Owns all visual constants and theme objects:

- Color palette
- Semantic colors
- Tracker colors
- Chart colors
- Mood colors
- Typography scale
- Spacing scale
- Radius scale
- Shadows and elevation
- Motion values
- Breakpoints

### `packages/ui`

Owns reusable presentation components:

- Buttons, cards, inputs, and selection controls
- Feedback and loading states
- Layout primitives
- Dashboard cards and chart wrappers
- Navigation shells
- Theme context and utility hooks

## Color Palette System

The palette should be dark-first and visually restrained.

### Primary colors

- `primary-50` through `primary-950` should be built around a refined cobalt-blue core.
- `accent` should be quieter than `primary` and used for secondary emphasis.

### Semantic colors

- `success`: emerald-green family
- `warning`: amber family
- `error`: rose-red family
- `info`: sky-blue family

### Tracker colors

Use stable, memorable hues for life domains:

- Habits: teal
- Workouts: orange
- Nutrition: green
- Mood: violet
- Weight: cyan
- Learning: blue
- DSA: amber
- Vocabulary: pink
- Thoughts/journal: slate

### Chart colors

Charts should use a curated multi-series palette with enough contrast for dark surfaces.

### Mood colors

The mood scale should use a perceptual ramp from low energy to high energy and avoid pure red/green dependence alone.

## Typography System

Typography should be crisp, compact, and dashboard-friendly.

### Heading scales

- `display` for rare landing or summary moments
- `h1` for page titles
- `h2` for section headers
- `h3` for card titles
- `h4` for smaller panel labels

### Body text

- `body-lg` for introductory or explanatory copy
- `body` for regular content
- `body-sm` for supporting text

### Captions

- Use muted contrast and smaller line-height.

### Numeric displays

- Use tabular numbers.
- Reserve strong weight and larger size for KPIs and streak metrics.

### Dashboard typography

- KPI values should feel prominent but not noisy.
- Labels should be compact and easy to scan.

## Spacing System

Use a 4px base grid with semantic spacing aliases:

- `xs`: 4
- `sm`: 8
- `md`: 12
- `lg`: 16
- `xl`: 24
- `2xl`: 32
- `3xl`: 40
- `4xl`: 48
- `5xl`: 64

## Radius System

- `sm`: 10
- `md`: 14
- `lg`: 18
- `xl`: 24
- `2xl`: 32
- `full`: pill and avatar use

## Shadow and Elevation System

The system should use subtle dark-mode elevation rather than heavy blur.

- `surface-1`: base card
- `surface-2`: hover and raised card
- `surface-3`: dialogs and sheets
- `surface-4`: overlays and focus panels

## Icon Strategy

- Use a single icon set across web and mobile.
- Prefer outline icons for the core system.
- Keep icon sizes aligned to the spacing grid.
- Avoid mixing multiple icon packs in feature code.

Recommended direction:

- `lucide-react` for web
- `lucide-react-native` or a shared SVG wrapper for mobile when the app grows

## Theme Architecture

The theme layer should expose:

- Dark default theme
- Optional light theme for accessibility or future preference toggles
- Semantic surface roles
- Platform-aware component density
- Motion-safe mode

Theme state should not own business logic.

## Tailwind Configuration

Web should use a shared preset that pulls from design tokens.

### Example structure

```text
apps/web/
  tailwind.config.ts
  postcss.config.cjs
  src/styles.css
```

### Tailwind goals

- Map token names to utility values.
- Keep semantic colors in the config rather than hard-coded in components.
- Support content scanning for web app and shared UI package files.

## NativeWind Configuration

Mobile should use a NativeWind preset that mirrors the same tokens.

### Example structure

```text
apps/mobile/
  tailwind.config.js
  babel.config.js
  nativewind-env.d.ts
```

### NativeWind goals

- Reuse the same token names as web.
- Keep spacing, colors, and typography aligned.
- Add type support for `className` usage on React Native primitives.

## Shared Design Tokens

Tokens should be exported as plain TypeScript objects so they are easy to consume from both apps.

Recommended exports:

- `colors`
- `semanticColors`
- `trackerColors`
- `chartColors`
- `moodColors`
- `typography`
- `spacing`
- `radius`
- `elevation`
- `motion`
- `breakpoints`

## Responsive Breakpoint Strategy

Use mobile-first breakpoints:

- `sm`: small phones and narrow web panels
- `md`: tablets and compact desktop
- `lg`: standard desktop
- `xl`: wide desktop dashboards
- `2xl`: ultra-wide analytic views

## Layout Primitives

### Containers

- Centered and padded page shells
- Full-width dashboard containers
- Dense content containers for tables and graphs

### Stacks

- Vertical and horizontal stacks with semantic spacing

### Grids

- Responsive grids for cards and widgets
- Dashboard grids should support 1, 2, 3, and 4 column layouts

### Dashboard layouts

- Sidebar + topbar on desktop
- Bottom navigation or tabs on mobile

## Reusable Components

The system should eventually expose these composable primitives:

- Button
- Card
- Modal
- Sheet
- Dialog
- Input
- Textarea
- Select
- Checkbox
- Toggle
- Tabs
- Progress bar
- Avatar
- Badge
- Tooltip
- Toast
- Skeleton loader
- Empty state
- Loading state

## Dashboard Components

These are UI composites, not feature screens:

- Analytics card
- Tracker card
- Streak card
- Timeline card
- Workout card

## Chart Wrappers

Charts should be wrapped so the design system controls spacing, headings, legends, and empty states.

## Calendar UI Foundation

The calendar layer should provide:

- Date grids
- Range selection
- Activity markers
- Compact month summaries

## Navigation UI System

The system should support:

- Sidebar for desktop web
- Topbar for global actions
- Bottom navigation for mobile
- Mobile tabs for section switching

## Animation Recommendations

- Use motion sparingly and intentionally.
- Animate card entrance, dialog transitions, and tab changes.
- Prefer short, soft easing curves.
- Avoid continuous motion unless it communicates status.

## Accessibility Considerations

- Maintain visible focus states.
- Ensure color contrast on dark surfaces.
- Use semantic roles for controls and dialogs.
- Support keyboard navigation on web.
- Avoid relying on color alone for status.
- Respect reduced-motion preferences.

## Folder Structure Recommendation

```text
packages/ui/
  src/
    primitives/
      button/
      card/
      input/
      textarea/
      select/
      checkbox/
      toggle/
      tabs/
      progress/
      avatar/
      badge/
      tooltip/
      toast/
      skeleton/
      empty-state/
      loading-state/
    layout/
      container/
      stack/
      grid/
      dashboard-layout/
    navigation/
      sidebar/
      topbar/
      bottom-nav/
      mobile-tabs/
    data-display/
      analytics-card/
      tracker-card/
      streak-card/
      timeline-card/
      workout-card/
    charts/
      chart-wrapper/
    calendar/
      calendar-grid/
      calendar-header/
    theme/
      theme-provider/
      theme-context/
      use-theme/
    hooks/
      use-breakpoint/
      use-motion/
    index.tsx
```

## Shared Component Export Strategy

- Export from package roots only.
- Keep barrel files shallow and predictable.
- Export both primitives and token objects from public entrypoints.
- Avoid deep imports in app code.

## Component Naming Conventions

- Use PascalCase for React components.
- Use lowercase folder names.
- Keep platform-specific files named with `.web.tsx` and `.native.tsx` when necessary.
- Use `index.ts` files for each folder boundary.

## Reusable Hook Strategy

- `useTheme` for theme access.
- `useBreakpoint` for responsive layout selection.
- `useMotion` for animation preference awareness.
- `useColorScheme` for platform color-scheme bridging.

## Dependency Installation Commands

Recommended commands for the design system stack:

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm add nativewind tailwind-merge clsx
pnpm add lucide-react
pnpm add -F @upward/mobile react-native-svg react-native-reanimated
```

## Critical Weaknesses to Watch

The design is strong, but it still has risks:

- Cross-platform parity can drift if web and native tokens are not generated from the same source.
- Too many component variants can make the UI package noisy.
- Dialog, sheet, and toast behaviors can become inconsistent if each feature invents its own wrapper.
- Dashboard chart styling can become overfit if tokens are not used consistently.
- NativeWind adoption can stall if mobile components are not refactored in sequence.

## Improved Final Version

The improved version is to keep the system token-first and progressively implement components in this order:

1. Design tokens package.
2. Theme provider and hook layer.
3. Core primitives: button, card, input, badge, skeleton, empty state.
4. Layout primitives: container, stack, grid, dashboard shell.
5. Feedback primitives: modal, dialog, sheet, toast, tooltip.
6. Dashboard composites: analytics cards, tracker cards, streak cards.
7. Chart and calendar wrappers.
8. Navigation shells for desktop and mobile.

This sequence gives Upward a scalable design system without over-engineering the first release.