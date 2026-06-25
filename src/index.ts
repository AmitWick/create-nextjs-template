#!/usr/bin/env node

import { select } from "@inquirer/prompts";
import { execSync } from "child_process";
import ora from "ora";
import packageJson from "../package.json";
import TEMPLATE_VERSION_MAP from "./versions/nextjs.version.json";

import tiged from "tiged";
import { TemplateVersionMap } from "./types";

// CLI version -> template repo version
const CLI_VERSION = packageJson.version;

const templateMap = TEMPLATE_VERSION_MAP as TemplateVersionMap;
const templateVersion = templateMap[CLI_VERSION];

if (!templateVersion) {
  console.error(`No template mapped for CLI version ${CLI_VERSION}`);
  process.exit(1);
}

const nextjs_graphql_template = `AmitWick/nextjs-graphql-template#${templateVersion["graphql"]}`;

const nextjs_rest_api_template = `AmitWick/nextjs-rest-api-template#${templateVersion["rest-api"]}`;

// Get target folder
const args = process.argv.slice(2);
const targetDir = args.find((arg) => !arg.startsWith("--")) || ".";

// const targetDir = process.argv[2] || ".";

const isGraphQL = args.includes("--graphql");
const isRestApi = args.includes("--rest-api");

let templateType: "graphql" | "rest-api" = "rest-api";

async function run() {
  if (isGraphQL && isRestApi) {
    console.error("Cannot use --graphql and --rest-api together");
    process.exit(1);
  }

  if (targetDir === ".") {
    console.warn("No project directory specified, using current directory.");
  }

  if (isGraphQL) {
    templateType = "graphql";
  } else if (isRestApi) {
    templateType = "rest-api";
  } else {
    templateType = await select({
      message: "Which template would you like to use?",
      default: "rest-api",
      choices: [
        {
          name: "REST API",
          value: "rest-api",
        },
        {
          name: "GraphQL",
          value: "graphql",
        },
      ],
    });
  }

  const repo =
    templateType === "graphql"
      ? nextjs_graphql_template
      : nextjs_rest_api_template;

  const spinner = ora(`Downloading ${templateType} template...`).start();

  try {
    // GitHub repo
    const emitter = tiged(repo, {
      verbose: false,
    });

    await emitter.clone(targetDir);

    spinner.succeed("Template downloaded");

    const installSpinner = ora("Installing dependencies...").start();

    execSync("npm install", {
      cwd: targetDir,
      stdio: "inherit",
    });

    installSpinner.succeed("Dependencies installed");

    console.log(`
✅ Project ready!

Next steps:

${
  targetDir === "."
    ? "npm run dev"
    : `cd ${targetDir}
  npm run dev`
}
  
`);
  } catch (error) {
    spinner.fail("Failed");
    console.error("Error:", error);
    process.exit(1);
  }
}

run();
