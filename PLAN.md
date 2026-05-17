# CRM — Full Build Plan

## Goal
Build a production-ready, full-featured CRM web application with contacts, deals, pipeline, tasks, and analytics.

## Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: TailwindCSS v3
- **Icons**: lucide-react
- **State**: React useState/useContext (client-side, localStorage persistence)
- **Charts**: recharts
- **Forms**: react-hook-form + zod
- **Deploy**: Vercel

## Features
1. Dashboard — KPI cards, pipeline summary, recent activity, revenue chart
2. Contacts — full CRUD, search/filter, tags, status, avatar initials
3. Companies — link contacts to orgs
4. Deals / Pipeline — Kanban board (drag-and-drop), deal stages, value tracking
5. Tasks — to-do list with due dates, priority, linked contact/deal
6. Activity Feed — timeline of all CRM events
7. Settings — team profile, pipeline stage config

## File Tree
- `PLAN.md` — this file
- `package.json` — all deps including recharts, lucide-react, react-hook-form, zod, @hello-pangea/dnd
- `tsconfig.json` — strict TypeScript config
- `tailwind.config.ts` — custom palette + dark mode class
- `postcss.config.js` — tailwind + autoprefixer
- `next.config.mjs` — basic Next.js config
- `app/layout.tsx` — root layout with sidebar nav
- `app/globals.css` — tailwind directives + base resets
- `app/page.tsx` — redirect to /dashboard
- `app/dashboard/page.tsx` — KPI cards + revenue chart + recent activity
- `app/contacts/page.tsx` — contacts list with search, filter, add
- `app/contacts/[id]/page.tsx` — contact detail view
- `app/companies/page.tsx` — companies list
- `app/deals/page.tsx` — kanban pipeline board
- `app/tasks/page.tsx` — tasks list
- `app/activity/page.tsx` — activity timeline
- `components/Sidebar.tsx` — left nav with routes + logo
- `components/TopBar.tsx` — search bar + user avatar
- `components/KPICard.tsx` — metric card component
- `components/DealCard.tsx` — draggable deal card for kanban
- `components/ContactRow.tsx` — table row for contacts
- `components/TaskItem.tsx` — single task row
- `components/Modal.tsx` — generic modal wrapper
- `components/AddContactModal.tsx` — add/edit contact form
- `components/AddDealModal.tsx` — add/edit deal form
- `components/AddTaskModal.tsx` — add/edit task form
- `lib/store.tsx` — React context + localStorage persistence (contacts, deals, tasks, companies, activities)
- `lib/types.ts` — TypeScript interfaces for all entities
- `lib/utils.ts` — helper functions (formatCurrency, formatDate, getInitials, etc.)
- `lib/data.ts` — seed data for demo

## Data / API
- No external API or DB — all data stored in React context + localStorage
- localStorage key: `crm_data`
- Seed data loaded on first visit

## Open Questions
- Auth? → Default: no auth (single-user, local). Can add Clerk later.
- Dark mode? → Default: light mode with toggle in sidebar.
- Currency? → USD, formatted with Intl.NumberFormat.
- Drag-and-drop library? → @hello-pangea/dnd (maintained fork of react-beautiful-dnd).
