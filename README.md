# Caesar Travel

### Travel experiences, thoughtfully connected.

An Arabic-first travel agency website and content management platform for Caesar Travel in Jordan. Built with React and TypeScript, it brings destination packages, Hajj and Umrah programs, hotel offers, and visa services into one responsive experience, supported by a Supabase-backed administration dashboard.

[Visit the website](https://caesar-travel.pages.dev) · [Explore the code](src) · [Routing guide](src/routes/README.md)

## Overview

Caesar Travel helps visitors discover travel programs, compare accommodation options, and contact the agency with their preferences. The public website uses a right-to-left Arabic layout, while the administration area lets the team update travel content, images, offers, and contact details.

The platform combines a client-rendered application with build-generated SEO metadata and static route HTML for hosting on Cloudflare Pages.

## Features

- **Arabic and RTL experience** — responsive layouts, Arabic content, and mobile navigation.
- **Destination packages** — international and domestic travel pages, trip details, itineraries, and hotel stay options.
- **Hajj and Umrah programs** — program dates, prices, availability indicators, and land or air Umrah options.
- **Visa services** — service listings and individual visa information pages.
- **Travel inquiries** — WhatsApp contact flows, quote requests, and a homepage booking inquiry form connected to Supabase.
- **Hajj registration** — a dedicated form that submits registration details to a configured Google Apps Script endpoint.
- **Content management** — a Supabase Auth sign-in flow and management screens for trips, visas, gallery images, and site settings.
- **Offers and availability** — configurable discounts, offer countdowns, and displayed seat counts.
- **Search and social metadata** — canonical URLs, Open Graph and Twitter tags, JSON-LD, sitemap generation, and an automated SEO audit.

## Technology

| Layer                    | Technologies                                          |
| ------------------------ | ----------------------------------------------------- |
| Application              | React 19, TypeScript, Vite 7                          |
| Routing and data         | TanStack Router, TanStack Query                       |
| Interface                | Tailwind CSS 4, Radix UI, Lucide icons, Framer Motion |
| Forms                    | React Hook Form, Zod                                  |
| Backend services         | Supabase Database, Auth, and Storage                  |
| Registration integration | Google Apps Script                                    |
| Hosting                  | Cloudflare Pages                                      |
| Development tools        | ESLint, Prettier, TypeScript                          |

## Getting started

### Prerequisites

- Node.js 22.12 or later and npm.
- A Supabase project with the application's schema, policies, and storage configuration provisioned.
- Access to the repository and the relevant Supabase project settings.

### 1. Install dependencies

```bash
git clone https://github.com/OBITO20011/caesar-travel.git
cd caesar-travel
npm ci
```

### 2. Configure the environment

Create a `.env` file in the project root:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Both variables are required by the application. Restart the development server after changing them.

Use the project's public anon key in the browser. Keep service-role keys and other private credentials out of `VITE_` variables and source control; Vite exposes these variables in the client bundle. The repository ignores local `.env` files.

### 3. Prepare backend access

The SQL history lives in [`supabase/migrations`](supabase/migrations). It includes schema creation, CMS simplification, storage policies, and content seeds. Review these files against the target database before applying them, especially when upgrading an existing project: some migrations remove legacy tables or change existing content. Back up existing data first.

Provision a Supabase Auth user for the agency's management team and register it in `public.admin_users` before applying [`019_restrict_cms_to_admins.sql`](supabase/migrations/019_restrict_cms_to_admins.sql); the migration aborts without changes if no admin is registered. Keep public sign-up disabled in Supabase Auth.

### Access model

The browser uses the public anon key, so access control is enforced in PostgreSQL with Row-Level Security:

| Who                                 | Access                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------ |
| Visitor                             | Read published trips, visas, gallery, and site settings; submit bookings |
| Signed-in user not in `admin_users` | Same as a visitor                                                        |
| Admin listed in `admin_users`       | Manage all CMS tables, bookings, and the `admin-media` storage bucket    |

`public.admin_users` has no API grants and is managed from the SQL editor. Policies call the `SECURITY DEFINER` function `public.is_admin()`, which checks `auth.uid()` against that table. Migration 019 replaces earlier policies that gave every authenticated account management access; it was verified against a local Supabase Postgres database with attacker, visitor, and admin test cases.

### 4. Run locally

```bash
npm run dev
```

Open [localhost:8080](http://localhost:8080). The administration sign-in page is available at `/admin/login`.

## Project structure

```text
src/
  components/          Shared UI, admin screens, SEO, and travel assistant
  data/                Destination definitions and supporting content
  hooks/               Content queries and shared React hooks
  lib/                 Supabase client, auth, formatting, and SEO utilities
  routes/              Public and admin file-based routes
  services/            Supabase data and media operations
  types/               Shared TypeScript types
public/                Static images, hotel galleries, and hosting assets
scripts/               SEO generation, route discovery, and auditing
supabase/migrations/   Database schema and content migration history
docs/                  Supporting documentation and image source notes
reports/               Technical reports
seo.config.json        Site identity and static page SEO configuration
```

TanStack Router generates `src/routeTree.gen.ts` from the route files. Make routing changes in `src/routes/` rather than editing the generated tree. See the [routing guide](src/routes/README.md) for conventions.

## Development commands

| Command             | Purpose                                                                  |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run dev`       | Start the local development server on port 8080                          |
| `npm run typecheck` | Check TypeScript types without emitting files                            |
| `npm run lint`      | Run ESLint                                                               |
| `npm run build`     | Generate SEO assets, build with Vite, and generate route HTML in `dist/` |
| `npm run preview`   | Serve the production build locally                                       |
| `npm run audit:seo` | Audit generated SEO output after a production build                      |
| `npm run format`    | Format the repository with Prettier                                      |

On Windows, use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Deployment

The project is configured for static deployment on Cloudflare Pages:

| Setting               | Value                                         |
| --------------------- | --------------------------------------------- |
| Build command         | `npm run build`                               |
| Output directory      | `dist`                                        |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

Set the environment variables in the hosting project's build settings. Configure the production URL and page metadata in [`seo.config.json`](seo.config.json) before deploying to another domain.

The build scripts read published content from Supabase to discover dynamic trip, Umrah, and visa URLs. If credentials are missing or public queries fail, they log warnings and skip the affected dynamic URLs. Review those warnings and run `npm run audit:seo` after building. On another static host, ensure direct navigation to client-side routes is supported.

### Hajj registration integration

The Google Apps Script web app URL is currently configured as `HAJJ_FORM_URL` in [`src/routes/hajj.tsx`](src/routes/hajj.tsx). A separate deployment needs its own working endpoint and submission permissions. The Apps Script implementation is managed outside this repository.

The form uses a `no-cors` request, so the browser cannot inspect the server response. Verify receipt in the destination system when testing registration; the form's confirmation does not establish that the backend saved the submission.

## Working with this repository

Keep changes focused and run the checks relevant to the files you modify. For application changes, use `npm run typecheck`, `npm run lint`, and `npm run build`; run `npm run audit:seo` when changing routes or SEO output.

This repository is connected to Lovable. Preserve published Git history and follow [`AGENTS.md`](AGENTS.md) when contributing.
