

# Premium UX Overhaul for Pathwise

This is a large-scope refinement touching the dashboard, careers page, academic planner, AI advisor behavior, and the overall visual system. I recommend breaking this into **4 phases** implemented sequentially.

---

## Phase 1: Visual System Upgrade (CSS + Design Tokens)

Elevate the global design language so every page benefits immediately.

**Changes to `src/index.css`:**
- Add new CSS custom properties for micro-interactions: `--transition-smooth`, `--shadow-soft`, `--shadow-inset`
- Refine existing gradient tokens for richer depth (e.g., add a subtle warm highlight to `--gradient-card`)
- Add a `.premium-section` utility for section grouping with subtle background tinting and rounded corners
- Add a `.stat-card` utility for compact metric displays with icon + value + label
- Improve `.premium-card` with slightly larger border-radius (1.25rem) and refined shadow
- Add `.card-glow` for hover state on interactive cards (soft primary-colored border glow)

**Changes to `tailwind.config.ts`:**
- Add `font-weight` and `letter-spacing` utilities for tighter typography scale control

---

## Phase 2: Dashboard Redesign

Transform the dashboard from a generic template into a polished startup product.

**Changes to `src/pages/DashboardPage.tsx`:**

1. **Hero section upgrade**: Add a subtle gradient background behind the greeting area with a frosted-glass effect. Show the user's current stage (e.g., "11th Grade | SAT Prep Phase") below their name.

2. **"Today's Focus" elevation**: Redesign the 3 focus cards with:
   - Numbered priority indicators (1, 2, 3)
   - Contextual micro-descriptions pulled from actual task data (not generic labels)
   - A subtle urgency indicator for deadline-sensitive items
   - Visual differentiation using left-border color coding

3. **Journey Progress redesign**: Replace the simple progress bar with a multi-milestone tracker:
   - Show 3-4 key milestones as dots on the progress bar (e.g., "Foundation -> Skills -> Applications -> Career")
   - Current position indicator with a pulsing dot
   - Percentage and task count below

4. **Section grouping**: Wrap related content areas (Academic Pathway + Tasks, Schools + Companies) in subtle `.premium-section` containers with section headers

5. **Quick Stats row**: Add a horizontal row of 4 stat cards above the two-column layout: Active Goals, Tasks Done, Streak (days active), Next Deadline

6. **Spacing and typography**: Increase section spacing from `space-y-8` to `space-y-10`, use larger heading sizes for section labels, improve card padding consistency

---

## Phase 3: Careers Page Enhancement

Make career exploration feel like a discovery experience.

**Changes to `src/pages/CareersPage.tsx`:**

1. **Category tabs**: Replace the vertically stacked sections with a horizontal tab bar (Popular | Emerging | Hybrid | Interdisciplinary) so users can switch views without scrolling
2. **Career card enrichment**: Each expanded card will show:
   - Skills roadmap as a visual progression (Beginner -> Intermediate -> Advanced skills)
   - "Alternative paths" section showing related but different careers
   - A "Why this fits you" personalized note based on user interests
3. **Search and filter**: Add a search input at the top to filter careers by keyword
4. **Mainstream vs. hidden gems**: Add visual labels ("Mainstream" badge for popular roles, "Hidden Gem" badge for emerging/niche roles) to help users distinguish conventional from unconventional paths

**Changes to `src/lib/careerData.ts`:**
- Add a `mainstream` boolean field to `CareerRole` interface
- Add `alternativePaths` string array to each role

---

## Phase 4: Academic Planner + Proactive AI

Upgrade the roadmap and make the AI more proactive.

**Changes to `src/pages/RoadmapPage.tsx`:**

1. **Month-by-month granularity is already implemented** -- enhance it with:
   - Color-coded action categories (academics = blue, testing = orange, applications = green, etc.)
   - A "current month" indicator that auto-highlights the current period
   - Completion animations when marking actions done
   - A mini-calendar view option alongside the list view

2. **Deadline awareness**: Flag items that are within 2 weeks of their due date with an amber "Approaching" badge, and items past-due with a red "Overdue" badge

**Changes to `src/pages/DashboardPage.tsx` (proactive AI section):**

3. **Proactive AI nudges on dashboard**: Add a collapsible "AI Insights" card that shows:
   - Missed milestone warnings (tasks overdue or goals stalling)
   - Hidden career path suggestions ("Based on your interests in X and Y, have you considered Z?")
   - Dynamic recommendation refresh notice when goals change

**Changes to `supabase/functions/ai-agent/index.ts`:**

4. **Enhanced `suggest_next_actions`**: Update the AI prompt to also return:
   - `missedMilestones`: array of flagged items
   - `hiddenPaths`: array of career suggestions the user hasn't explored
   - `refreshReason`: string explaining why recommendations changed

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/index.css` | Add new utility classes, refine design tokens |
| `tailwind.config.ts` | Minor typography extensions |
| `src/pages/DashboardPage.tsx` | Major redesign with stats row, milestone tracker, AI insights, better sections |
| `src/pages/CareersPage.tsx` | Add tabs, search, enriched cards, mainstream/hidden gem labels |
| `src/lib/careerData.ts` | Add `mainstream` and `alternativePaths` fields |
| `src/pages/RoadmapPage.tsx` | Current month indicator, category colors, deadline badges |
| `supabase/functions/ai-agent/index.ts` | Enhanced proactive AI prompt |

---

## What Won't Change

- Sidebar navigation structure (already well-organized)
- Authentication flow
- Database schema (no new tables needed)
- Onboarding flow
- Other pages (Schools, Companies, Networking, Chat, Voice, Settings)

## Important Note

This is a large set of changes. I recommend implementing them in the 4 phases listed above so we can verify each phase works before moving to the next. I'll start with all phases in one pass but will keep changes modular so individual sections can be adjusted easily.

