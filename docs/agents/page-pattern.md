Dashboard pages start with "use client";
useState + useEffect for Supabase data via getRows/insertRow/updateRow/deleteRow
try/catch with realistic sample data fallback (3-5 rows matching product domain)
Stats row: 3-4 metric Cards in grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
Data table: Card > Table with Search input + optional status filter
Create/Edit: single Dialog for both (toggle via editItem state)
Delete: confirmation Dialog
Empty state: centered icon + text + Create button
Loading: <Loader2 className="size-6 animate-spin text-white/40" />
Every button must be functional — no placeholder onClick or # hrefs
Export default function — never export const
DialogContent must include DialogDescription for accessibility
File placement: src/app/dashboard/[feature]/page.tsx
