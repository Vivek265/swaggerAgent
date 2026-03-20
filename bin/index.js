#!/usr/bin/env node
import dotenv from "dotenv";
import * as fs from 'fs';
import * as path from 'path'
import { handleSwaggerAdd } from "./utils/common.js";
import { configDir, configFilePath } from "./constants.js";
dotenv.config();
if(!fs.existsSync(configDir)){
   fs.mkdirSync(configDir);
}
console.log("argss")
const args = process.argv.slice(2);
if(!args || args.length==0){
    console.log("No args in ",process.cwd())
}
else{

switch(args[0]){
  case 'set-api-key': const fileData ={apiKey:args[1],modelType:args[1].startsWith('sk-')?'openai':'google'}
                       fs.writeFileSync(configFilePath,JSON.stringify(fileData));
                       break;
  case 'add-swagger': await handleSwaggerAdd();
                      break;
  case 'check-data': const data = JSON.parse(fs.readFileSync(configFilePath));
                     console.log(data);
                     break;


}
}


