# create-iris-mfe

Scaffold a React micro-frontend remote — Vite, TypeScript, Tailwind CSS v4 and Module Federation, wired up and ready to run.

```bash
npx create-iris-mfe billing
cd billing
npm install
npm run dev
```

### With the shared IRIS components

```bash
npx create-iris-mfe components billing
```

Adds the components shared across IRIS micro-frontends on top of the base template:

- `TableComponent` - TanStack Table with pagination, page size select, skeleton and empty state
- `StatusBadge` + `src/lib/status.ts` - the six status tones
- `InfoHeader`, `Breadcrumbs` - the dark page header
- `DetailList` - label/value pairs in a two-column grid, with skeleton and empty state
- `Modal` - centered compound dialog (`ModalContent` / `ModalHeader` / `ModalBody` / `ModalFooter`), fixed or content width; the header and footer stay put while the body scrolls
- `SidePanel` - the same layout stuck to a screen edge, on shadcn's Base UI Drawer (swipe to close, non-modal with `modal={false}`)
- `AccordionComponent` - a collapsible section card
- `RowActions` - the "actions" cell of a table row: stacked buttons plus a ⋮ menu with items and links
- `OverflowTooltip` - truncated text with a tooltip (colour, arrow side/align and custom styles as props)
- the shadcn/ui primitives they use, in `src/components/ui/`

Their design tokens are in `src/iris-theme.css`, imported from `src/index.css`. Texts of the shared components are the `ui` keys in `src/lang/bg.ts` and `src/lang/en.ts`. Other shadcn/ui components are still added with `npx shadcn@latest add <component>`.

A project cannot be named `components`.

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

Requires Node 22.14 or newer.
