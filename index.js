#!/usr/bin/env node

import { execSync } from "child_process";
import { createRequire } from "module";
import ora from "ora";
import packageJson from "./package.json" with { type: "json" };
import TEMPLATE_VERSION_MAP from "./versions/nextjs.version.json" with { type: "json" };

const require = createRequire(import.meta.url);

const tiged = require("tiged");

// CLI version -> template repo version
const CLI_VERSION = packageJson.version;

const templateVersion = TEMPLATE_VERSION_MAP[CLI_VERSION];

if (!templateVersion) {
  console.error(`No template mapped for CLI version ${CLI_VERSION}`);

  process.exit(1);
}

// Get target folder
const targetDir = process.argv[2] || ".";

async function run() {
  const spinner = ora(`Downloading template ${templateVersion}...`).start();

  try {
    // GitHub repo
    const emitter = tiged(`AmitWick/nextjs-template#${templateVersion}`, {
      mode: "git",
      verbose: false,
    });

    await emitter.clone(targetDir);

    spinner.succeed("Template downloaded");

    console.log("Installing dependencies...");

    execSync("npm install", {
      cwd: targetDir,
      stdio: "inherit",
    });

    console.log("Project ready!");
  } catch (error) {
    spinner.fail("Failed");

    console.error("Error:", error);
  }
}

run();
