# Vite React MFE Template

A modern React micro-frontend template built with Vite, TypeScript, Tailwind CSS v4, and Module Federation.

## Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite**
- **Tailwind CSS v4** with CSS custom properties theming
- **Module Federation** (`@originjs/vite-plugin-federation`)
- **React Router v7** (import from `react-router`, NOT `react-router-dom`)
- **TanStack Query** for data fetching
- **React Hook Form** + **Zod** for forms and validation
- **TanStack Table** for table sorting, filtering and pagination
- **shadcn/ui** (New York style) for UI components
- **Base UI toast** for toast notifications
- **Lucide React** for icons
- **Orval** for API client generation

## Getting Started

```bash
npx create-iris-mfe my-app
cd my-app
npm install
npm run dev
```

This copies the template into `./my-app`. The project keeps the `template` identity - federation name, `/v2/remote/template/` base path, i18n namespace and `template-ws` backend service - so follow **Renaming the remote** in the new project's `AGENTS.md` to give it its own.

Already scaffolded? Just `npm install` and `npm run dev`.

## Scripts

| Script             | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Start development server              |
| `npm run build`    | TypeScript compilation + Vite build   |
| `npm run lint`     | ESLint                                |
| `npm run format`   | Prettier format                       |
| `npm run preview`  | Preview production build              |
| `npm run generate` | Generate API client from OpenAPI spec |

## Project Structure

```
src/
├── data/            # Generated API client (via npm run generate)
├── assets/          # Static assets
├── components/
│   ├── ui/          # shadcn/ui components (button, card, field, input...)
│   └── theme-provider.tsx
├── hooks/           # Shared custom hooks
├── layouts/         # Layout components (root-layout.tsx)
├── lib/             # Utilities (cn, etc.)
├── pages/           # Page components (home.tsx, etc.)
├── providers/       # Context providers (query-provider.tsx)
├── main.tsx         # App entry point
└── index.css        # Tailwind CSS v4 + theme variables
```

## Module Federation

Configure remotes and exposes in `vite.config.ts`:

```typescript
federation({
  name: "app",
  remotes: {
    // "remoteApp": "http://localhost:5001/assets/remoteEntry.js",
  },
  exposes: {
    // "./Button": "./src/components/ui/button.tsx",
  },
  shared: ["react", "react-dom", "react-router"],
})
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components are placed in `src/components/ui/`.

## API Client Generation

1. Start your backend API server
2. Run `npm run generate` to generate the TypeScript API client from the OpenAPI spec (configured in `orval.config.ts`)
3. Generated files go to `src/data/template-ws/` - hooks in `endpoints/`, types in `model/`
4. Use the generated TanStack Query hooks directly

## Key Conventions

- **Use `react-router`** not `react-router-dom`
- **Use TanStack Query** for ALL API calls — no direct fetch/axios
- **Use React Hook Form + Zod** for all forms
- **Use TanStack Table** for table sorting, filtering and pagination
- **Use Base Ui Toast** for toast notifications
- **Use shadcn/ui ONLY** — no other UI libraries
- **Use `cn()`** for className merging
- **Use `@/` aliases** for imports

## Releasing the scaffolder

`cli/` is a separate npm package, `create-iris-mfe`, that scaffolds new remotes from this repo. It ships a verbatim snapshot of this app in `cli/template/`; the `template` identity is copied as-is, and renaming it is the scaffolded project's business.

That snapshot is **generated, not maintained**: [scripts/copy-template.mjs](scripts/copy-template.mjs) produces it and `cli/template/` is gitignored, so this app stays the single source of truth. The script runs from `prepack`, so both `npm pack` and `npm publish` refresh it automatically.

```bash
cd cli
npm version patch                          # or minor / major
npm pack                                   # regenerates template/
tar -tf create-iris-mfe-1.0.0.tgz          # confirm template/ is inside
npx ./create-iris-mfe-1.0.0.tgz test-app   # smoke test the real npx path
npm publish --access public
```

Publishing is permanent: `npm unpublish` is only allowed within 72 hours, and a version number can never be reused. Fix a bad release by publishing the next patch version.
