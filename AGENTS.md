# AI agent guidelines for mehmetsahin.dev

Personal website of Mehmet Şahin. Next.js 16 (App Router) portfolio and blog, originally forked from [ncdai/chanhdai.com](https://github.com/ncdai/chanhdai.com) and now maintained independently: upstream changes are not merged, so restructure freely.

**Stack**: TypeScript, React 19, Tailwind CSS v4, shadcn/ui (Base UI), MDX, Vitest, pnpm. Self-hosted with Docker on Dokploy.

## Project structure

| Directory                              | Purpose                                                   |
| -------------------------------------- | --------------------------------------------------------- |
| `src/app/`                             | App Router pages, layouts, route handlers                 |
| `src/components/`                      | Shared UI components (`ui/` holds shadcn primitives)      |
| `src/features/`                        | Feature modules: `doc`, `blog`, `portfolio`, `bookmark`   |
| `src/config/`                          | Site (`site.ts`) and JSON-LD config                       |
| `src/db/`                              | Drizzle client, schema and migration runner (Postgres)    |
| `src/features/admin/`                  | Admin panel: nav config, layout components, session guard |
| `src/hooks/`, `src/lib/`, `src/utils/` | Hooks, libraries, utilities                               |

**Key files**: `src/features/portfolio/data/queries.ts` (cached reads for the site), `src/features/admin/` (admin sections: `profile`, `social-links`, `career`, `bookmarks`, `settings`), `src/components/site-mark.tsx` (logo), `.env.example`

## Admin and data

- Admin routes live under `src/app/admin/`. Every page, layout, Server Action and Route Handler must call `requireAdmin()` from `src/features/admin/lib/session.ts`; `src/proxy.ts` is only an optimistic redirect.
- Auth: Better Auth with GitHub (`src/lib/auth.ts`). Only `ADMIN_GITHUB_USERNAME` can sign in.
- Schema changes: edit `src/db/schema/`, run `pnpm db:generate`, commit the SQL in `drizzle/`. Migrations apply on server start (`src/instrumentation.ts`).
- Server env vars are validated lazily in `src/lib/env.ts`.
- Site content (profile, social links, experience, education, projects, tech stack, bookmarks, settings) lives in Postgres. The site reads it through `src/features/portfolio/data/queries.ts` (cached, tag `portfolio`); admin Server Actions call `refreshPortfolio()` after saving. Pages render dynamically because the database is not available while building the image.
- Each admin section keeps `schema.ts` (zod, shared with the form), `actions.ts`, `queries.ts` and its client components together. Reuse the pieces in `src/features/admin/components/form/` (sortable list, form sheet, icon picker, markdown field, period fields).
- Media (`src/features/media/`): files live in `UPLOADS_DIR`, are served from `/media/<key>` and tracked in `media`/`media_usage`. Pick files with `MediaField`/`MediaPicker`. Whenever a record that references media is saved, call `syncMediaUsage(owner, fields)` (ids or Markdown); call `clearMediaUsage` when it is deleted. Files in use cannot be deleted.

## Content system

Blog posts currently live in `src/features/doc/content/blog/` as MDX files; they will move to the database with multi-language support.

- **Data layer**: `src/features/doc/data/documents.ts`
- **Blog UI**: `src/features/blog/` (rendering only)

## Coding guidelines

- TypeScript strict mode; explicit types when necessary
- kebab-case file naming
- Descriptive names; comments only for "why", not "what"
- No emojis in code, comments, or commit messages
- Tailwind CSS v4 syntax; support dark/light modes
- Headings in sentence-case (capitalize only the first word and proper nouns)

## Commands

```bash
pnpm dev                # Dev server (http://localhost:3000)
pnpm build              # Production build
pnpm test:run           # Vitest (single run)
pnpm lint               # ESLint
pnpm format:write       # Prettier
pnpm check-types        # Type checking (run after a build so PageProps types exist)
pnpm db:generate        # Generate a SQL migration from the Drizzle schema
pnpm db:studio          # Browse the database
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
