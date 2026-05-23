#!/usr/bin/env node

import { execSync } from "child_process";
import { createRequire } from "module";
import ora from "ora";

await emitter.clone(targetDir);

const require = createRequire(import.meta.url);
const tiged = require("tiged");

// Get target folder
const targetDir = process.argv[2] || ".";

// GitHub repo
const emitter = tiged("github:AmitWick/nextjs-template", {
  mode: "git",
  verbose: true,
});

async function run() {
  try {
    console.log("Downloading template...");
    const spinner = ora("Downloading template...").start();

    await emitter.clone(targetDir);

    console.log("Installing dependencies...");

    execSync("npm install", {
      cwd: targetDir,
      stdio: "inherit",
    });

    console.log("Template ready!");
    spinner.succeed("Template downloaded");
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
