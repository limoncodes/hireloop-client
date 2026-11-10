<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in this repo

`CLAUDE.md` is just `@AGENTS.md` — this file is the single source; don't duplicate content there.

## What this is

Hireloop job-board frontend: Next.js 16 App Router in a shadcn/ui monorepo. There is no backend, auth, or data layer yet — `/`, `/jobs`, `/companies`, `/about`, `/pricing`, `/sign-in`, `/sign-up` are static placeholder pages, and the shared `Navbar` (rendered from the root layout) links to them. Section content is wrapped in `mx-auto w-full max-w-[1280px]` containers (matching the Figma design width); Base UI buttons that render a non-button element need `nativeButton={false}` (used for `Button render={<Link/>}`). The home page hero (`apps/web/components/hero.tsx`) is fully centered on `#010103` with the transparent `apps/web/app/images/globe.png` arc positioned behind the stats heading (masked fade into the card row); fonts are Manrope (`--font-manrope`) + Space Mono (`--font-space-mono`) applied via inline `fontFamily` styles.

## Layout (npm workspaces + Turborepo)

The repo uses **npm**, not pnpm — `packageManager: npm@11.16.0`, `package-lock.json`, Node >= 20.9. README examples using `pnpm dlx` are template leftovers; translate them to `npx`.

- `apps/web` (workspace name `web`) — the app. Routes in `apps/web/app/`, app-local components in `apps/web/components/` imported via `@/*` (tsconfig maps `@/*` → `apps/web/*` and `@workspace/ui/*` → `packages/ui/src/*`). Only workspace with `dev`/`build`/`start`.
- `packages/ui` (`@workspace/ui`) — shadcn/ui components, consumed **as source** (no build step; `transpilePackages: ["@workspace/ui"]` in `apps/web/next.config.ts`). Uses **Base UI** (`@base-ui/react`, shadcn style `base-nova`), *not* Radix.
- `packages/eslint-config`, `packages/typescript-config` — shared configs, no scripts.

## Commands (from repo root; all verified passing)

```bash
npm install
npm run dev        # turbo -> `next dev` in apps/web (persistent; run in background)
npm run build
npm run lint
npm run typecheck
npm run format
```

- Scope to one workspace: `npm run lint -w web` or `npx turbo typecheck --filter=@workspace/ui`.
- **No test runner and no CI.** Verify with `npm run lint && npm run typecheck`; also run `npm run build` when routes or config change.
- **`npm run lint` usually exits 0 even with violations.** `eslint-plugin-only-warn` (`packages/eslint-config/base.js`) rewrites non-fatal rule errors to warnings; only fatal parse/config errors fail the run. Read the warning output — exit 0 ≠ clean.

## shadcn/ui components

- Add: `npx shadcn@latest add <name> -c apps/web`. Files land in `packages/ui/src/components/`; theme and tokens live in `packages/ui/src/styles/globals.css`.
- Import via the exports map only: `@workspace/ui/components/button`, `@workspace/ui/lib/utils`, `@workspace/ui/hooks/*`, `@workspace/ui/globals.css`.
- `cn`: components import it from the `cn` package; app code uses the `@workspace/ui/lib/utils` re-export.
- Base UI composition differs from Radix: there is no `asChild`; pass `render={<Link href="/x" />}` (see `apps/web/components/navbar.tsx`), and animate with `data-starting-style` / `data-ending-style` rather than `data-state`.
- Components present today: `button`, `sheet`.

## Tailwind v4 (CSS-first)

No `tailwind.config` exists. Config lives in `packages/ui/src/styles/globals.css` (`@theme`, `.dark` variant, `@source` globs). Source outside the `@source` globs (`apps/**` and `packages/ui/src/**`) needs a new `@source` entry or its classes are never compiled.

## Formatting

`npm run format` runs Prettier only on `**/*.{ts,tsx}` in `web` and `ui` (CSS/JSON/Markdown are untouched). The root `.prettierrc` sets no semicolons, double quotes, LF, and loads `prettier-plugin-tailwindcss` with `tailwindStylesheet`, so Tailwind class order **is** sorted on format.

## Gotchas

- `apps/web/app/layout.tsx`: keep `suppressHydrationWarning` on `<html>` and the `ThemeProvider` wiring. next-themes uses `attribute="class"` (matching the `.dark` CSS variant) and adds a `d` dark-mode hotkey; the navbar toggle stays mount-gated to avoid hydration mismatch.
- Next.js is **16.4.4** with breaking changes vs older docs. Read `node_modules/next/dist/docs/` (present at repo root) before writing Next.js code.
- The `<!-- BEGIN:nextjs-agent-rules -->` block at the top is regenerated by `next dev`; keep it verbatim and commit it.
