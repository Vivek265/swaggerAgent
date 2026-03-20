const fs = require('fs')
export const ReadFileTool={
    name:'read_file',
    description:"Read file for content",
    func:async(filePath)=>{
        const result= await fs.readFile(filePath,{ encoding: 'utf8' });
        return result;
    }
}