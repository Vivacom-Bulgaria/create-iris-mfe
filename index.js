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

const projectName = process.argv[2];

if (!projectName) {
  console.error("\nUsage:");
  console.error("  npx create-iris-mfe <project-name>\n");
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);
const templateDir = path.join(__dirname, "template");

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

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
