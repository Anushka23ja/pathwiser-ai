

# Add Personalized Name to Dashboard Greeting

## What Changes

The dashboard greeting will change from "Good morning" to **"Good morning, Alex!"** (using the user's name from their account). For guest users, it will say **"Good morning, Pathwiser!"**.

## How It Works

1. **Get the user's name**: The `useAuth` hook already provides `user.user_metadata.full_name` (set during signup). The `DashboardPage` will import `useAuth` and extract the first name.

2. **Determine display name**:
   - If the user has a `full_name` in their metadata, use the **first name** (split on space, take first part)
   - If the user is anonymous (guest mode), display **"Pathwiser"**
   - Fallback: **"Pathwiser"** if no name is found

3. **Update greeting**: Change the `getGreeting()` function to append the name, e.g., `"Good morning, Alex!"`

4. **Update translations**: Modify the greeting keys in `en.ts` (and other locale files) to accept a `name` interpolation variable: `"Good morning, {{name}}!"`

## Technical Details

**`src/pages/DashboardPage.tsx`**:
- Import `useAuth` hook
- Extract display name: `user?.user_metadata?.full_name?.split(" ")[0]` or `"Pathwiser"` for anonymous/missing
- Update `getGreeting()` to return greeting with name using `t("dashboard.goodMorning", { name })`

**`src/i18n/locales/en.ts`** (and other locale files):
- `"dashboard.goodMorning": "Good morning, {{name}}!"` (same pattern for afternoon/evening)

**Files to update**:
- `src/pages/DashboardPage.tsx` -- add useAuth, compute name, pass to greeting
- `src/i18n/locales/en.ts` -- add `{{name}}` interpolation to greeting strings
- All other locale files (`ar.ts`, `de.ts`, `es.ts`, `fr.ts`, `hi.ts`, `ja.ts`, `ko.ts`, `pt.ts`, `ru.ts`, `zh.ts`) -- same pattern with localized greetings

