import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import * as fs from 'fs';
import *  as  path from 'path'
import { configFilePath } from "../constants.js";
import { getAllFileAndFolders, getFileNames } from "./fileScanner.js";
import { swaggerCreationPrompt, swaggerFileDetectionPrompt } from "../prompts/prompts.js";
export async function handleSwaggerAdd(){
let configData =  fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath)) :undefined;
if(!configData || !configData.apiKey){
    console.log("Set api key first");
    return;
} 
const model = getApiModel(configData.modelType,configData.apiKey) ; 
const fileNamesAndFolders =  await getAllFileAndFolders();
const fileNames= getFileNames(fileNamesAndFolders);
let swaggerFileNameResult;
if(fs.existsSync(path.join(process.cwd(),'via-swagger.json'))){
let swaggerConfigFile = JSON.parse(fs.readFileSync(path.join(process.cwd(),'via-swagger.json')));
swaggerFileNameResult= swaggerConfigFile.fileName;
}
else{
console.log("swaggerFile..creation")
 swaggerFileNameResult = (await model.invoke(swaggerFileDetectionPrompt+JSON.stringify(fileNames)))?.content;
if(swaggerFileNameResult=='NO'){
    console.log("No swagger file detected")
    return;
}
else{
    console.log("swagger file confg created");
    fs.writeFileSync(path.join(process.cwd(),'via-swagger.json'),JSON.stringify({fileName:swaggerFileNameResult}))
}
}
console.log("creating...swagger data")
    const result =await model.invoke(swaggerCreationPrompt+JSON.stringify(fileNamesAndFolders));
    console.log("swagger data ..created")
    const swaggerFilePath = path.join(process.cwd(),swaggerFileNameResult);
    fs.writeFileSync(swaggerFilePath,result.content?.slice(7,-3));
    console.log("Finished");
    return;
}




function getApiModel(modelType,apiKey){
    if(modelType=='openai')
        return new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: apiKey,
});
else
     return  new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey:apiKey
});
    

}