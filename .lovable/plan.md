

# Onboarding Tutorial: Highlight Actual Nav Items

Instead of just showing a centered modal, each tutorial step (after the welcome) will visually point to the actual navigation item in the bottom nav bar on mobile (or sidebar on desktop).

---

## How It Works

1. **Step 0 (Welcome)** -- stays as a centered modal, no highlight
2. **Steps 1-4 (Roadmap, Chat, Careers, Explore)** -- each step:
   - Adds a `data-tutorial` attribute to the matching bottom nav button (e.g., `data-tutorial="roadmap"`)
   - The tutorial overlay finds that element using `querySelector`, gets its position with `getBoundingClientRect()`
   - A "spotlight" cutout appears around the nav icon, with a tooltip card positioned above it pointing down with an arrow
   - On desktop, it highlights the sidebar item instead

## Visual Design

- Dark overlay covers the screen with a transparent "hole" around the highlighted nav item
- A floating tooltip card appears above the highlighted item with the icon, title, description, progress dots, and next/back buttons
- A small arrow/caret points from the card down to the highlighted element

---

## Technical Details

### File: `src/components/MobileBottomNav.tsx`
- Add `data-tutorial="roadmap"`, `data-tutorial="explore"`, etc. to each nav button so the tutorial can find them

### File: `src/components/AppSidebar.tsx`
- Add matching `data-tutorial` attributes to sidebar nav items

### File: `src/components/OnboardingTutorial.tsx`
- For steps 1-4, use `document.querySelector('[data-tutorial="roadmap"]')` etc. to locate the target element
- Use `getBoundingClientRect()` to get position and size
- Render the overlay with a CSS clip-path or SVG mask to create a spotlight cutout around the target
- Position the tooltip card above (or beside) the highlighted element
- Add a resize/scroll listener to recalculate position if needed
- Step 0 remains centered (no highlight target)

### Step-to-selector mapping:
| Step | Title | Selector |
|------|-------|----------|
| 0 | Welcome to Pathwise | (centered, no highlight) |
| 1 | Your Roadmap | `[data-tutorial="roadmap"]` |
| 2 | AI Advisor | `[data-tutorial="chat"]` |
| 3 | Explore Careers | `[data-tutorial="careers"]` |
| 4 | Explore Page | `[data-tutorial="explore"]` |

No new dependencies needed -- positioning is done with vanilla DOM APIs and existing framer-motion for animations.
