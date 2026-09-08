# AGENTS.md

## Project Overview

This is a modern React application built with Vite, TypeScript, and Tailwind CSS v4. The project uses shadcn/ui components with a design system based on CSS custom properties and the `radix-nova` style preset (see `components.json`). It is a **Module Federation remote** (`@originjs/vite-plugin-federation`): `src/App.tsx` is exposed as `./App` and loaded by a host application; `src/main.tsx` only runs when the app is started standalone.

## Tech Stack & Architecture

- **Build Tool**: Vite with React plugin and Tailwind CSS v4 Vite plugin
- **Frontend**: React 19.1+ with TypeScript 5.9
- **Micro-Frontends**: @originjs/vite-plugin-federation (this project is a remote, see below)
- **Routing**: React Router v7 - **IMPORTANT: Use `react-router` NOT `react-router-dom`**
- **Data Fetching**: TanStack Query (React Query) - **REQUIRED for ALL API calls**
- **API Client**: axios + TanStack Query hooks generated with orval (`npm run generate` → `src/data/<service>-ws/`)
- **i18n**: i18next + react-i18next - **REQUIRED for ALL user-facing text** (bundles in `src/lang/`)
- **Tables**: TanStack Table v9 (`@tanstack/react-table`) - **REQUIRED for sorting / filtering / pagination**
- **Forms**: React Hook Form (`react-hook-form`) + `@hookform/resolvers` - **REQUIRED for form handling**
- **Validation**: Zod (`zod`) via `zodResolver` - **REQUIRED for schema validation**
- **Notifications**: Base UI toast - **REQUIRED for toast notifications**
- **Styling**: Tailwind CSS v4 with CSS custom properties and CSS variable-based theming
- **Components**: shadcn/ui ONLY (add components with `npx shadcn@latest add <component>`)
- **Icons**: Lucide React
- **Utilities**: clsx + tailwind-merge pattern for className handling

## Module Federation Runtime - CRITICAL

The remote's identity (federation `name`, base path segment, i18n namespace, `<name>-ws` backend service) is the string `template`, and it lives in exactly the places below - keep them in sync. Renaming a remote means changing every row - `create-iris-mfe` copies the template verbatim and does not touch them.

### Renaming the remote - `template` → `<name>`

| File              | Change                                                                                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vite.config.ts`  | `federation({ name: "template" })` → `"<name>"`, and `base: "/v2/remote/template/"` → `"/v2/remote/<name>/"`                                                                                          |
| `src/main.tsx`    | `<BrowserRouter basename="/v2/remote/template">` → `"/v2/remote/<name>"` (standalone only)                                                                                                            |
| `src/i18n.ts`     | `i18nNamespace = "template"` → `"<name>"`                                                                                                                                                             |
| `orval.config.ts` | config key `templateWs` → `<name>Ws`; `input.target` swagger URL; `output.baseUrl: "/template-ws"`; both output paths (`target` → `endpoints/`, `schemas` → `model/`) under `./src/data/template-ws/` |
| `package.json`    | `"name": "iris_v2_template"` → `"iris_v2_<name>"`                                                                                                                                                     |
| `index.html`      | `<title>iris_v2_template</title>` (standalone only)                                                                                                                                                   |
| `README.md`       | the H1 and the intro sentence                                                                                                                                                                         |

Nothing else in `src/` hardcodes the name. Two placeholder strings are demo copy rather than identity, so rename them only if you keep the demo page: `home.title` in `src/lang/en.ts` (`"🚀 Template Demo"`) and `src/lang/bg.ts` (`"🚀 Демо на шаблона"`). Delete `dist/` and `.mf/` after renaming - both bake the old federation name into generated filenames.

### Standalone dev proxy - add when you need it

There is intentionally no `server.proxy` in `vite.config.ts`. Federated under the host, its gateway serves `/<name>-ws` on the same origin, so no proxy is needed. Standalone (`npm run dev`), those requests hit the Vite dev server and 404 - add the proxy then:

```ts
// vite.config.ts - dev only, never part of the production bundle
server: {
  proxy: {
    "/template-ws": {
      target: "https://<backend-host>", // NO /template-ws here - see below
      changeOrigin: true,               // remote hosts need the rewritten Host header
      secure: false,                    // only for an internal/self-signed certificate
    },
  },
},
```

**Never put `/<name>-ws` in `target`.** `prependPath` defaults to `true`, so the target's path is prepended to a request path that `output.baseUrl` already prefixed, giving `/template-ws/template-ws/api/...`. Either leave the target as a bare origin, or keep the path and strip the prefix with `rewrite: (p) => p.replace(/^\/template-ws/, "")`.

When loaded by the host (which mounts the remote as `<Route path="/<name>/*" element={<App />} />` inside its own `BrowserRouter basename="/v2"`):

1. **The host provides the Router, the ThemeProvider, the `QueryClientProvider` and an initialised i18next instance.** `src/main.tsx` (BrowserRouter + ThemeProvider + QueryProvider) does not run. **Never add these providers to `src/App.tsx`** - a nested ThemeProvider would fight the host's theme and install its global `d` hotkey into the host page.
2. **Never navigate with absolute paths** (`<Navigate to="/x" />`, `navigate("/x")`) - they escape the host's route prefix (`/v2/<name>/...` → `/v2/x`). Use relative targets: `to="x"` from the index route, `to="../x"` from the `*` route.
3. **Theme**: read it with `useResolvedTheme()` from `@/hooks/use-resolved-theme` (observes the `dark` class the host toggles on `<html>`). `useTheme()` only works standalone.
4. **Never import `queryClient` from `src/providers/query-provider.tsx` in feature code** - it is the standalone-only instance. Use `useQueryClient()` from `@tanstack/react-query`.
5. **i18n**: the host initialises i18next (`localStorage["iris-lang"]`, fallback `bg`, its own keys in the default namespace) and changes the language on the shared instance; `src/i18n.ts` only adds this remote's namespace, so language switches propagate automatically.
6. `react`, `react-dom`, `react-router`, `i18next`, `react-i18next` and `@tanstack/react-query` are `shared` - at runtime the host's copies are used, so keep versions compatible with the host and do not add second copies of these libraries.

## Key Patterns & Conventions

### Component Library - CRITICAL

**ALWAYS use shadcn/ui components ONLY. NO other UI libraries are allowed.**

- Add components with `npx shadcn@latest add <component>` (or the shadcn MCP server if it is configured in your editor); they land in `src/components/ui/`
- All UI components must come from shadcn/ui ecosystem
- Components use CVA for variants, Radix UI primitives for composition

### Data Fetching - REQUIRED PATTERN

**ALL API requests MUST go through TanStack Query (React Query). Use the orval-generated hooks - never call fetch/axios directly in components.**

The client is generated by `npm run generate` (orval, `client: "react-query"`) into `src/data/<service>-ws/` - point `input.target` in `orval.config.ts` at the service's `swagger.json`. Orval emits the React Query hooks itself, so there is no `Configuration` or `*Api` class to instantiate. Generated code is excluded from ESLint and Prettier; never edit it by hand.

Every request goes through the shared axios instance and mutator in `src/lib/api.ts` (wired up as `override.mutator` in `orval.config.ts`) - that is the single place to add interceptors, `withCredentials` or default headers. `output.baseUrl` already prefixes `/template-ws` onto every generated URL, so never set `baseURL` on the instance as well.

`mode: "tags-split"` puts one file per swagger tag in `endpoints/<tag>/<tag>.ts`, and models in `model/`. For each operation, named after its `operationId`, you get:

- `useGetUser(userId, options?)` - the query hook
- `getGetUserQueryKey(userId)` / `getGetUserQueryOptions(...)` - use these for invalidation and prefetching, **never a hand-written query key**
- `useCreateUser(options?)` - the mutation hook
- `getUser(...)` - the bare request function, for the rare case you need your own `useQuery`

Example pattern:

```typescript
import { useQueryClient } from "@tanstack/react-query"

import {
  getGetUserQueryKey,
  useCreateUser,
  useGetUser,
} from "@/data/template-ws/endpoints/users/users"

const queryClient = useQueryClient()

// Same-origin via the Vite dev proxy / the host's gateway; the hook owns the query key
const { data, isLoading, error } = useGetUser(userId)

const mutation = useCreateUser({
  mutation: {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetUserQueryKey(userId) })
    },
  },
})

mutation.mutate({ data: { name: "Ada" } })
```

React Query options go under the hook's `query` / `mutation` key - the hook's options object is **not** a `UseQueryOptions`:

```typescript
const { data } = useGetUser(userId, { query: { enabled: !!userId } })
```

**CRITICAL: Hook Usage and State Management Rules**

1. **NEVER call hooks inside useEffect**
2. **Parent components manage state** - All TanStack Query hooks should be called in parent/page components
3. **Child components are presentational** - They receive data as props and render UI only
4. **Data flows down** - Parent fetches → stores in state → passes as props to children
5. **Callbacks flow up** - Children call parent callbacks to trigger actions

### Routing

- **CRITICAL**: Use `react-router` NOT `react-router-dom`
- Import from `"react-router"`: `import { useNavigate, Navigate } from "react-router"`
- Follow React Router v7 conventions

### Translations i18n

**ALL user-facing text MUST use `react-i18next` (`useTranslation`) with keys defined in `src/lang/bg.ts` and `src/lang/en.ts` - NEVER hardcode strings in components.**

- Translation bundles are namespaced. Use `useTranslation(i18nNamespace)` with `i18nNamespace` imported from `src/i18n.ts` — never hardcode another module's namespace.
- The host initializes i18next when federated; `src/i18n.ts` registers this remote's bundles either way.

### Forms - REQUIRED PATTERN

**ALL forms MUST use React Hook Form (`react-hook-form`) with Zod validation via `@hookform/resolvers/zod` and the project's shadcn/ui Field components.**

- Set up with `useForm<T>({ resolver: zodResolver(schema), defaultValues, mode: "onSubmit" })` - always provide `defaultValues` for every field
- Render every field through `Controller`, wrapped in `<FieldGroup>` / `<Field>` / `<FieldLabel>` / `<FieldError>`
- Pass `data-invalid={fieldState.invalid}` to `<Field>` and `aria-invalid={fieldState.invalid}` to the input - `FieldLabel` turns red via `group-data-[invalid=true]/field`
- Add `noValidate` to the `<form>` and submit via `handleSubmit(...)` - without it the browser's native validation runs before Zod
- **NEVER use `@tanstack/react-form`** (not a dependency) or shadcn/ui's `form.tsx` (`FormField` / `FormItem` / `FormMessage`) - this project standardises on `field.tsx`

### Tables - REQUIRED PATTERN

**ALL tables with sorting, filtering, or pagination MUST use TanStack Table v9 (`@tanstack/react-table`). Do NOT hand-roll table state.**

**CRITICAL: v9 is a major rewrite - v8 examples found online will NOT work.** Verify the API against the installed package: `node_modules/@tanstack/react-table/skills/` and `node_modules/@tanstack/react-table/dist/index.d.ts`.

- Create tables with `useTable({ features, columns, data })`, registering features explicitly via `tableFeatures({ ... })` - only the features the table actually uses
- **Sorting**: `rowSortingFeature` + `sortedRowModel: createSortedRowModel()`
- **Filtering**: `columnFilteringFeature` + `filteredRowModel: createFilteredRowModel()` (global search additionally needs `globalFilteringFeature`)
- **Pagination**: `rowPaginationFeature` + `paginatedRowModel: createPaginatedRowModel()`
- Sorting/filtering/pagination state and methods **do not exist until their feature is registered** - a missing `table.setSorting` means a missing feature, not a typing problem
- Build columns with `createColumnHelper<typeof features, TData>()` + `helper.columns([...])`
- TanStack Table is headless: use the shadcn/ui table primitives for markup, render through `<table.FlexRender header={header} />` / `<table.FlexRender cell={cell} />`, and iterate cells with `row.getAllCells()`
- **NEVER use v8 APIs** (`useReactTable`, or the imported `getCoreRowModel()` / `getSortedRowModel()` / `getFilteredRowModel()` / `getPaginationRowModel()` option functions) or `@tanstack/react-table/legacy`
- `row.getVisibleCells()` only exists once `columnVisibilityFeature` is registered - use `row.getAllCells()` otherwise

### Notifications

- **REQUIRED**: Use Base UI toast for all toast notifications
- Import: `import { toast } from "@/components/ui/toast"`

### Import Aliases

```typescript
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Feature Organization

1. Keep related files together within a feature
2. Each feature is self-contained with its own components/hooks/types
3. Common components go in `src/components/`, shared hooks in `src/hooks/`, context providers in `src/providers/`, helpers in `src/lib/`
4. shadcn/ui components stay in `components/ui/`
5. Generated API clients stay in `src/data/<service>-ws/` (never edited by hand)
6. Use relative paths within the same feature
7. Use `@/` aliases for cross-feature imports

## Important Notes

- **Tailwind v4**: Uses `@import "tailwindcss"` syntax (different from v3)
- **React 19**: Latest React version
- **React Router v7**: Use latest conventions; relative navigation only (see Module Federation Runtime)
- Always use `cn()` for className merging
- **Use ONLY shadcn/ui components**
- **Use TanStack Query for ALL data fetching**
- **Pre-commit hook**: `npm install` installs husky; every commit runs lint-staged (`eslint --fix` + `prettier --write` on staged files). ESLint enforces sorted imports (`simple-import-sort`) - run `npm run lint:fix` to fix ordering.
