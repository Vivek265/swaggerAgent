#!/usr/bin/env node
import dotenv from "dotenv";
import * as fs from "fs";
import { handleSwaggerAdd } from "./utils/common.js";
import { configDir, configFilePath } from "./constants.js";
import { Command } from "commander";

const pkg = await import('../package.json', {
  with: { type: 'json' }
});

dotenv.config();

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
}

const program = new Command();

program
  .name(pkg.name || "via-swagger")
  .description("A CLI tool to create swagger with the help of AI")
  .version(pkg?.default?.version || "1.0.0", "-v, --version", "Output the current version");

program
  .command("set-api-key")
  .description("Set the API key for Anthropic, OpenAI, or Google")
  .argument("<api-key>", "Your API key")
  .action((apiKey) => {
    let modelType = "google";
    if (apiKey.startsWith("sk-ant-")) {
      modelType = "claude";
    } else if (apiKey.startsWith("sk-")) {
      modelType = "openai";
    }

    const fileData = {
      apiKey: apiKey,
      modelType: modelType,
    };
    fs.writeFileSync(configFilePath, JSON.stringify(fileData, null, 2));
    console.log(`\nSuccess! API key saved.\nModel type inferred as: ${fileData.modelType}`);
  });

program
  .command("add-swagger")
  .description("Add or update the swagger documentation")
  .action(async () => {
    await handleSwaggerAdd();
  });

program
  .command("check-data")
  .description("Check the locally saved configuration data")
  .action(() => {
    if (fs.existsSync(configFilePath)) {
      const data = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
      console.log("Current Configuration:");
      console.log(data);
    } else {
      console.log("No configuration found. Please run 'set-api-key' first.");
    }
  });

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  program.parse();
}