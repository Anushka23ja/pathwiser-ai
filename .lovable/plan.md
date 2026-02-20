
# Mobile-First Optimization for Pathwise

Since most of your users will be on their phones, this plan focuses on making every screen feel native and thumb-friendly.

---

## 1. Add a Mobile Bottom Navigation Bar

The biggest mobile UX improvement: a fixed bottom nav bar (visible only on phones) so users can quickly switch between the 5 most important sections without opening the sidebar.

- Shows on screens below 768px
- 5 tabs: Dashboard, Roadmap, Careers, Chat, Settings
- Active state with icon + label, inactive shows icon only
- Sidebar still available via hamburger for less-used pages
- Bottom nav hides when scrolling down, reappears on scroll up (optional polish)

**New file**: `src/components/MobileBottomNav.tsx`
**Updated file**: `src/components/DashboardLayout.tsx` -- add bottom nav + padding at bottom so content isn't hidden behind it

---

## 2. Dashboard Mobile Fixes

- **Hero greeting**: Reduce icon size and padding on mobile (`p-4` instead of `p-6`)
- **Stats row**: Already `grid-cols-2` on mobile (good) -- reduce text sizes slightly for tighter fit
- **Journey Progress**: Stack the "Action Center" button below the progress bar on mobile instead of beside it
- **Today's Focus**: Already single-column on mobile (good) -- reduce card padding from `p-5` to `p-4`
- **Two-column layout**: Already stacks on mobile via `lg:grid-cols-5` (good)
- **Quick Nav grid**: Already `grid-cols-2` (good)
- Add `pb-24` to main content container so nothing is hidden behind the bottom nav

---

## 3. Roadmap Mobile Fixes

- **Header buttons**: Stack the 3 action buttons (Regenerate, Update Profile, Export) into a horizontal scroll or dropdown on mobile instead of wrapping awkwardly
- **Year block**: Reduce padding, make the expand/collapse area larger for touch
- **Month block action items**: Increase touch target size (min 44px height)
- **Category legend**: Make horizontally scrollable on small screens

---

## 4. Careers Page Mobile Fixes

- **Tab bar**: Make tabs horizontally scrollable when they overflow (especially with badge counts)
- **Field selector pills**: Already `flex-wrap` (good)
- **Career cards**: Reduce padding, ensure salary/growth/education stats wrap properly
- **Search input**: Full-width already (good)

---

## 5. Global Mobile Improvements

- **Sticky header**: Already sticky (good) -- reduce height slightly on mobile
- **Safe area insets**: Add `env(safe-area-inset-bottom)` padding for notched phones (iPhone)
- **Touch targets**: Ensure all interactive elements are at least 44x44px
- **Font sizes**: Slightly increase body text on mobile for readability (14px minimum)

---

## Technical Details

### Files to create:
| File | Purpose |
|------|---------|
| `src/components/MobileBottomNav.tsx` | Fixed bottom navigation bar for mobile |

### Files to modify:
| File | Changes |
|------|---------|
| `src/components/DashboardLayout.tsx` | Add MobileBottomNav, add bottom padding for mobile |
| `src/pages/DashboardPage.tsx` | Responsive padding/spacing tweaks, stack journey button on mobile |
| `src/pages/RoadmapPage.tsx` | Responsive header buttons, larger touch targets |
| `src/pages/CareersPage.tsx` | Scrollable tabs, responsive card padding |
| `src/index.css` | Safe area insets, mobile-specific utilities |

### What stays the same:
- Sidebar (already uses Sheet on mobile)
- All data/logic/API calls
- Desktop layouts (all changes are mobile-only via responsive classes)
