import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import ora from 'ora';
import * as fs from 'fs';
import *  as  path from 'path'
import { configFilePath } from "../constants.js";
import { getAllFileAndFolders, getChangedFiles, getFileNames } from "./fileScanner.js";
import { swaggerCreationPrompt, swaggerFileDetectionPrompt, swaggerUpdationPrompt } from "../prompts/prompts.js";
import simpleGit from 'simple-git';
export async function handleSwaggerAdd() {
    let configData = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath)) : undefined;
    if (!configData || !configData.apiKey) {
        console.log("Set api key first");
        return;
    }
    const model = getApiModel(configData.modelType, configData.apiKey);
    let fileNamesAndFolders = await getAllFileAndFolders();
    const fileNames = getFileNames(fileNamesAndFolders);
    let swaggerFileNameResult;

    if (fs.existsSync(path.join(process.cwd(), 'via-swagger.json'))) {
        let swaggerConfigFile = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'via-swagger.json')));
        swaggerFileNameResult = swaggerConfigFile.fileName;
    }
    else {
        const spinner1 = ora('Detecting swagger configuration from files...').start();
        swaggerFileNameResult = (await model.invoke(swaggerFileDetectionPrompt + JSON.stringify(fileNames)))?.content;
        spinner1.stop();
        if (swaggerFileNameResult == 'NO') {
            console.log("No swagger file detected")
            return;
        }
        else {
            console.log("swagger file config created");
            fs.writeFileSync(path.join(process.cwd(), 'via-swagger.json'), JSON.stringify({ fileName: swaggerFileNameResult }))
        }
    }
    const git = simpleGit();
    const currenSwaggerData = fs.readFileSync(path.join(process.cwd(), swaggerFileNameResult), 'utf8');
    let prompt;
    if (currenSwaggerData.length != 0) {
        console.log("Updating the current swagger based on file changes")
        const projectRootPath = (await git.revparse(['--show-toplevel'])).trim();
        const changedGitFiles = (await git.status()).files.map(f => path.resolve(projectRootPath, f.path));
        fileNamesAndFolders = getChangedFiles(fileNamesAndFolders, swaggerFileNameResult, changedGitFiles);
        prompt = swaggerUpdationPrompt + "current swagger /n" + currenSwaggerData + "/n Updated files /n" + JSON.stringify(fileNamesAndFolders);
    }
    else {
        console.log("No existing swagger data found.Creating new swagger from scratch")
        fileNamesAndFolders = getChangedFiles(fileNamesAndFolders, swaggerFileNameResult);
        prompt = swaggerCreationPrompt + JSON.stringify(fileNamesAndFolders);
    }
    const spinner2 = ora('Generating swagger data using AI. This may take a minute...').start();
    const result = await model.invoke(prompt);
    spinner2.succeed("Swagger data created successfully!");
    const swaggerFilePath = path.join(process.cwd(), swaggerFileNameResult);

    fs.writeFileSync(swaggerFilePath, result.content?.slice(7, -3));
    console.log("Finished");
    return;
}




function getApiModel(modelType, apiKey) {
    if (modelType === 'openai') {
        return new ChatOpenAI({
            model: "gpt-4o",
            apiKey: apiKey,
            temperature: 0,
        });
    } else if (modelType === 'claude') {
        return new ChatAnthropic({
            model: "claude-3-5-sonnet-latest",
            apiKey: apiKey,
            temperature: 0,
        });
    } else {
        return new ChatGoogleGenerativeAI({
            model: "gemini-2.5-flash",
            apiKey: apiKey,
            temperature: 0
        });
    }
}