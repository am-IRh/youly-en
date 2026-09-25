# youly-en — AI Agent Guide

## Project

youly-en is a TypeScript monorepo for an English-learning platform.

The repository is a Bun + Turborepo workspace with:
- Next.js frontend in `apps/web`
- Elysia API in `apps/server`
- Better Auth in `packages/auth`
- Drizzle/PostgreSQL in `packages/db`
- Shared environment/config/util packages in `packages/*`

The repository code is the source of truth. Do not rely on assumptions from an old conversation when the current implementation says otherwise.

## Architecture

```
apps/
  web/       Next.js 16 App Router frontend
  server/    Elysia API

packages/
  auth/      Better Auth configuration
  db/        Drizzle client, schema and migrations
  env/       Environment validation/access
  config/    Shared configuration
  ui/        Shared UI package
  utils/     Shared utilities
```

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- shadcn/ui / Radix/Base UI
- TanStack Form
- Better Auth client
- Elysia Eden for typed API access

### Backend

- Elysia
- Bun
- Zod / Elysia `t` schemas
- Better Auth
- Drizzle ORM
- OpenAPI

### Database

- PostgreSQL
- Drizzle ORM
- Schema lives under `packages/db/src/schema`
- Migrations live under `packages/db/src/migrations`

## Important domain structure

Learning content follows this hierarchy:

```
Course
  └── Level
       └── Lesson
```

Public API routes mirror that hierarchy:

```
GET /api/courses
GET /api/courses/:courseSlug
GET /api/courses/:courseSlug/levels
GET /api/courses/:courseSlug/levels/:levelSlug
GET /api/courses/:courseSlug/levels/:levelSlug/lessons
GET /api/courses/:courseSlug/levels/:levelSlug/lessons/:lessonSlug
```

Management routes are separate from public content routes:

```
/api/courses
/api/lessons
/api/reports
/api/badges
```

Keep this distinction unless there is a concrete reason to change the API design.

## Authentication and authorization

Authentication is handled by Better Auth in `packages/auth/src/index.ts`.

Current authentication is phone-number based:
- email/password is disabled
- Iranian E.164 phone numbers are validated
- OTP length is 6
- OTP expires after 300 seconds
- development OTP is currently logged instead of being sent through a production SMS provider
- users have a `role` field with `user` and `admin`

The Elysia auth integration is in:

```
apps/server/src/lib/auth-plugin.ts
```

Authorization helpers are in:

```
apps/server/src/lib/permissions.ts
```

Current content permission rules:
- admins can manage content
- non-admin users need a badge granting content creation permission
- admin-only operations use `requireAdmin`
- content-author operations use `requireContentPermission`

Do not bypass these checks by reading the session manually in individual routes unless there is a specific reason.

## Database rules

Use Drizzle through `@youly-en/db`.

Keep database concerns in the db package and business logic in backend services.

Current content schema includes:
- courses
- levels
- lessons
- lesson notes
- reports
- badges
- user badges

Commerce schema includes:
- course pricing
- level pricing
- enrollments
- subscriptions

Use foreign keys and existing unique constraints consistently.

Do not modify generated Better Auth schema manually when the change belongs to Better Auth. Use the auth package generation command and then review the generated result.

## Backend conventions

Backend modules generally follow:

```
modules/<feature>/
  routes.ts
  service.ts
  schema.ts        # when request/content schemas are needed
```

Management routes are kept separate where appropriate.

Prefer:
- route validation at the Elysia boundary
- business logic in services
- shared auth/permission logic in `lib/`
- small route handlers
- explicit status handling for expected 404/400 cases

The API is mounted under `/api` in `apps/server/src/index.ts`.

Do not introduce another API layer or duplicate the existing service logic without a clear reason.

## Frontend conventions

The frontend uses Next.js App Router.

Dynamic learning routes mirror the backend hierarchy:

```
/courses
/courses/[courseSlug]
/courses/[courseSlug]/levels/[levelSlug]
/courses/[courseSlug]/levels/[levelSlug]/lessons/[lessonSlug]
```

Server-side session helpers live in:

```
apps/web/src/lib/session.ts
```

The typed Eden API client lives in:

```
apps/web/src/lib/api-client.ts
```

Prefer the existing typed API client rather than manually duplicating API types or raw request wrappers.

When using Next dynamic route params in Server Components, follow the current Next.js API used by the project; do not introduce legacy pre-App-Router patterns.

## UI conventions

- Use the existing UI primitives before creating duplicates.
- Keep the visual language consistent with the existing application.
- Prefer simple, readable components over premature abstraction.
- Do not add a UI library just to solve a small component problem.
- Preserve existing responsive behavior.
- Avoid unrelated visual refactors while implementing a feature.

## Code style

- TypeScript strictness is enabled.
- Use Biome for formatting/linting.
- Follow existing naming and file organization.
- Prefer explicit types where they improve public APIs or important domain boundaries.
- Avoid `any` unless there is a real interoperability reason.
- Reuse existing utilities and schemas before creating equivalents.

## API and type safety

The frontend consumes the Elysia API through Eden.

When changing an API:
1. Update the backend route/schema/service as needed.
2. Verify the generated/inferred API type remains correct.
3. Update frontend consumers through the typed client.
4. Run type checking.

Do not solve a type error by weakening the API types or casting everything to `any`.

## Working on an existing feature

Before changing code:
1. Locate the current implementation.
2. Read the directly related route/component/service/schema.
3. Search for its callers and consumers.
4. Identify existing conventions before introducing a new pattern.
5. Make the smallest coherent change.

Do not refactor unrelated code just because it could be improved.

If a feature spans frontend, API, auth and database, inspect the complete flow before changing one layer in isolation.

## Context and retrieval rules for AI agents

The conversation is not the source of truth for the implementation.

When a task refers to an existing component, route, API, schema, or behavior:
- search the repository first
- read the current implementation
- follow imports/usages when necessary
- use Git history when the reason for an existing decision matters

Do not recreate code from memory when the repository can provide the actual implementation.

If an old conversation says one thing but the current repository says another, the repository wins unless the user explicitly asks to restore the old behavior.

For large tasks, retrieve only the files relevant to the current change instead of loading the whole repository into context.

If the current task depends on an earlier architectural decision that is not documented in the repository, summarize that decision in the appropriate project documentation after confirming it.

## Preserving existing behavior

Unless the user explicitly asks for a refactor:

- do not change public API contracts unnecessarily
- do not change database schema unnecessarily
- do not replace working libraries
- do not reorganize directories without a reason
- do not rewrite existing components just for style
- do not change auth behavior casually
- do not remove validation or authorization checks

Backward compatibility matters more than making the code look different.

## Verification workflow

After meaningful changes, run the smallest relevant checks first.

Typical checks:

```bash
bun run check-types
bun run check
bun run build
```

For database changes, also use the existing database scripts:

```bash
bun run db:generate
bun run db:push
bun run db:migrate
```

Do not claim a change is verified if the relevant check was not actually run.

## Common commands

```bash
bun install

bun run dev
bun run dev:web
bun run dev:server

bun run check-types
bun run check
bun run build

bun run db:generate
bun run db:push
bun run db:studio
bun run db:migrate
bun run db:start
bun run db:stop
bun run db:down
```

## Git and change discipline

Keep changes focused.

Before making a broad change, identify:
- what files must change
- what behavior must remain unchanged
- how the change will be verified

Prefer small coherent commits.

Never commit secrets, local `.env` files, generated build output, or temporary debugging artifacts.

## When requirements are ambiguous

Do not silently invent architecture.

If a missing detail materially affects the implementation:
1. inspect existing code and conventions
2. infer only what is strongly supported
3. ask the user when multiple materially different approaches remain

For small implementation details, choose the existing project convention rather than creating a new one.

## Documentation maintenance

Update this file when a change materially affects:
- architecture
- package responsibilities
- authentication/authorization
- API conventions
- database/domain structure
- development workflow
- important invariants

Keep this document focused on durable project knowledge, not temporary task details.
