#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// npm strips files named ".gitignore" from published tarballs, so the template
// ships it as "_gitignore" and it is restored here.
const RENAMED_FILES = {
  _gitignore: ".gitignore",
};

// `create-iris-mfe components <name>` adds the shared IRIS components
// (tables, pagination, status badges, page header) on top of the base template.
const args = process.argv.slice(2);
const withComponents = args[0] === "components";
const projectName = withComponents ? args[1] : args[0];

if (!projectName) {
  console.error("\nUsage:");
  console.error("  npx create-iris-mfe <project-name>");
  console.error("  npx create-iris-mfe components <project-name>\n");
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);
const templateDir = path.join(__dirname, "template");
const componentsDir = path.join(__dirname, "template-components");

if (await exists(targetDir)) {
  console.error(`\n❌ Directory "${projectName}" already exists.\n`);
  process.exit(1);
}

console.log(`\nCreating ${projectName}...\n`);

await fs.mkdir(targetDir, { recursive: true });

await copyTemplate(templateDir, targetDir);

await updatePackageName(targetDir, projectName);

console.log("✓ Template copied");
console.log("✓ package.json updated");

if (withComponents) {
  await copyTemplate(componentsDir, targetDir);
  await importIrisTheme(targetDir);

  console.log("✓ IRIS components added");
}

console.log("\nInstalling dependencies...\n");

try {
  execSync("npm install", {
    cwd: targetDir,
    stdio: "inherit",
  });
} catch {
  console.error("\n❌ Failed to install dependencies.");
  process.exit(1);
}

console.log("\n✓ Dependencies installed");

console.log("\n🎉 Project created successfully!\n");

console.log("Next steps:\n");
console.log(`  cd ${projectName}`);
console.log("  npm run dev\n");

async function copyTemplate(source, destination) {
  const entries = await fs.readdir(source, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const name = entry.name;

    if (shouldIgnore(name)) {
      continue;
    }

    const sourcePath = path.join(source, name);
    const destinationPath = path.join(destination, renamed(name));

    if (entry.isDirectory()) {
      await fs.mkdir(destinationPath, { recursive: true });
      await copyTemplate(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

function renamed(name) {
  return RENAMED_FILES[name] ?? name;
}

function shouldIgnore(name) {
  return [
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    ".turbo",
  ].includes(name);
}

async function updatePackageName(projectDir, projectName) {
  const packagePath = path.join(projectDir, "package.json");

  try {
    const packageJson = JSON.parse(await fs.readFile(packagePath, "utf8"));

    packageJson.name = projectName;

    await fs.writeFile(
      packagePath,
      `${JSON.stringify(packageJson, null, 2)}\n`,
    );
  } catch {
    // No package.json in template.
  }
}

// The IRIS tokens live in their own file so the shadcn variables in index.css
// stay exactly as the base template ships them.
async function importIrisTheme(projectDir) {
  const cssPath = path.join(projectDir, "src", "index.css");
  const css = await fs.readFile(cssPath, "utf8");
  const lastImport = [...css.matchAll(/^@import .*$/gm)].at(-1);
  const insertAt = lastImport ? lastImport.index + lastImport[0].length : 0;
  const eol = css.includes("\r\n") ? "\r\n" : "\n";

  await fs.writeFile(
    cssPath,
    `${css.slice(0, insertAt)}${eol}@import "./iris-theme.css";${css.slice(insertAt)}`,
  );
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
