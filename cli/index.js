#!/usr/bin/env node
// create-iris-mfe - scaffolds a Vite + React + Module Federation remote from the bundled template.
//
// Everything lives in this one file, in two modes:
//
//   --pack     maintainers only, wired to `prepack` in package.json. Snapshots the app at the repo
//              root into ./template, so `npm pack` and `npm publish` always ship a fresh copy.
//              template/ is gitignored: the app at the repo root is the single source of truth.
//   (default)  copies the bundled template into ./<name> and leaves the contents alone. The
//              scaffolded project keeps the `template` identity, and the "Renaming the remote"
//              table in its AGENTS.md is the checklist for giving it its own.
//
// No dependencies on purpose - npx has to download this package before it can run, so every
// dependency is startup latency the user waits through.

import { execFileSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
} from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { createInterface } from "node:readline/promises"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))
const templateDir = join(here, "template")

const NAME_PATTERN = /^[a-z][a-z0-9-]{0,39}$/

const die = (message) => {
  console.error(`\n  ${message}\n`)
  process.exit(1)
}

// --------------------------------------------------------------------------------- pack mode

// Build output bakes the federation name into generated filenames, and the scaffolding tooling
// itself has no business landing in a scaffolded app.
const EXCLUDED = new Set([
  ".DS_Store",
  ".git",
  ".mf",
  "CLAUDE.local.md",
  "cli",
  "dist",
  "dist-mf",
  "dist-ssr",
  "node_modules",
])

if (process.argv.includes("--pack")) {
  const root = resolve(here, "..")
  if (!existsSync(join(root, "vite.config.ts"))) {
    die(
      `--pack snapshots the app at the repo root, and there is no app one level up.\n  ` +
        `Run it from cli/ inside a checkout of the create-iris-mfe repo.`
    )
  }

  rmSync(templateDir, { recursive: true, force: true })
  mkdirSync(templateDir, { recursive: true })

  // Copied entry by entry rather than in one cpSync of the root: the destination lives inside the
  // root, and cpSync refuses to copy a directory into its own subtree even with a filter.
  for (const entry of readdirSync(root)) {
    if (EXCLUDED.has(entry)) continue
    cpSync(join(root, entry), join(templateDir, entry), {
      recursive: true,
      filter: (src) =>
        !relative(root, src)
          .split(sep)
          .some((segment) => EXCLUDED.has(segment)),
    })
  }

  // npm silently drops any file named .gitignore from a published tarball, so it ships renamed and
  // the scaffold step below puts it back. Same trick create-vite uses.
  const snapshotGitignore = join(templateDir, ".gitignore")
  if (existsSync(snapshotGitignore))
    renameSync(snapshotGitignore, join(templateDir, "_gitignore"))

  console.log(`  snapshot written to cli${sep}template`)
  process.exit(0)
}

// ------------------------------------------------------------------------------------- input

const usage = `
  Usage: npx create-iris-mfe <name> [options]

  Scaffolds a Vite + React + Module Federation remote into ./<name>.
  <name> is the folder only - the project itself keeps the \`template\` identity
  (federation name, /v2/remote/template/ base path, i18n namespace, template-ws
  backend service). See "Renaming the remote" in the new project's AGENTS.md to
  give it its own. Lowercase letters, digits and dashes.

  Options:
    --no-git    skip git init
    -h, --help  show this message

  Example: npx create-iris-mfe billing
`

const argv = process.argv.slice(2)
if (argv.includes("-h") || argv.includes("--help")) {
  console.log(usage)
  process.exit(0)
}

const withGit = !argv.includes("--no-git")
const positional = argv.filter((arg) => !arg.startsWith("-"))
if (positional.length > 1)
  die(`Expected one project name, got ${positional.length}.${usage}`)

let name = positional[0]
if (!name) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  name = (await rl.question("  Project folder (e.g. billing): ")).trim()
  rl.close()
}

if (!name) die(`A project name is required.${usage}`)
if (!NAME_PATTERN.test(name)) {
  die(
    `"${name}" is not a usable project name.\n  ` +
      `Use lowercase letters, digits and dashes, starting with a letter (max 40 chars).`
  )
}

const target = resolve(process.cwd(), name)
if (existsSync(target) && readdirSync(target).length > 0) {
  die(`./${name} already exists and is not empty.`)
}
if (!existsSync(templateDir)) {
  die(
    `This package shipped without its template/ folder - that is a packaging bug.\n  ` +
      `Try npx create-iris-mfe@latest, and please report it if that does not help.`
  )
}

// ---------------------------------------------------------------------------------- scaffold

console.log(`\n  Creating ${name}...`)
cpSync(templateDir, target, { recursive: true })

// npm strips .gitignore from published packages, so the template ships it renamed.
const shippedGitignore = join(target, "_gitignore")
if (existsSync(shippedGitignore))
  renameSync(shippedGitignore, join(target, ".gitignore"))

if (withGit) {
  try {
    // husky's prepare script needs a git repo, so this runs before the user's npm install.
    execFileSync("git", ["init", "-q"], { cwd: target, stdio: "ignore" })
  } catch {
    console.log("  (git not found - skipped git init)")
  }
}

// ------------------------------------------------------------------------------------ report

console.log(`
  Done. ${relative(process.cwd(), target) || name} still carries the template identity:

    federation name   template
    base path         /v2/remote/template/
    i18n namespace    template
    backend service   /template-ws
    package name      iris_v2_template

  Next steps:

    cd ${name}
    npm install
    npm run dev

  To give the remote its own identity, follow "Renaming the remote" in AGENTS.md.
  Point orval.config.ts at your service's swagger URL, then npm run generate.
`)
