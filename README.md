# create-iris-mfe

Scaffold a React micro-frontend remote — Vite, TypeScript, Tailwind CSS v4 and Module Federation, wired up and ready to run.

```bash
npx create-iris-mfe billing
cd billing
npm install
npm run dev
```

## What you get

- **React 19** + **TypeScript 5.9** + **Vite 7**
- **Module Federation** (`@module-federation/vite`) — `src/App.tsx` is exposed as `./App`; `src/main.tsx` runs only standalone
- **Tailwind CSS v4** with CSS custom properties theming, plus **shadcn/ui** components
- **React Router v7**, **TanStack Query**, **TanStack Table**
- **React Hook Form** + **Zod**
- **i18next** with `en` / `bg` bundles
- **orval** for generating typed API clients from an OpenAPI spec
- ESLint, Prettier, Husky and lint-staged already configured

## After scaffolding

Rename the remote (see **Renaming the remote** in `AGENTS.md`), then point `orval.config.ts` at your service's swagger URL and run `npm run generate` to produce typed hooks under `src/data/<name>-ws/`.

Requires Node 20 or newer.
