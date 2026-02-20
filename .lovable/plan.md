

# Replace Careers with Explore in Navigation

A straightforward swap in two navigation components.

---

## Changes

### 1. Mobile Bottom Nav (`src/components/MobileBottomNav.tsx`)
- Replace the "Careers" tab (Briefcase icon, `/careers` path) with "Explore" (Compass icon, `/explore` path)

### 2. Sidebar (`src/components/AppSidebar.tsx`)
- Move the Explore item higher in the `mainItems` list (swap position with Careers, or place it where Careers currently sits)
- Careers remains in the sidebar but moves to a less prominent position

---

## Technical Details

| File | Change |
|------|--------|
| `src/components/MobileBottomNav.tsx` | Change Careers tab to Explore: update label, icon (`Compass`), and path (`/explore`) |
| `src/components/AppSidebar.tsx` | Reorder `mainItems` so Explore appears before Careers |

No route changes needed -- both `/explore` and `/careers` routes already exist.

