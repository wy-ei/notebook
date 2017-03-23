"use strict";
let fs = require('fs');
let path = require('path');

function walkDirectory(dir){
    let list = [];
    let files = fs.readdirSync(dir);
    let readmeFile = '';
    for(let i=0;i<files.length;i++){
        let loc = path.join(dir, files[i]);
        if(/readme.md$/i.test(files[i])){
            readmeFile = loc;
        } else if(fs.statSync(loc).isFile()){
            let content = fs.readFileSync(loc, 'utf8');
            let match = /^title:(.+)$/mg.exec(content);
            let title = '';
            if(match){
                title = match[1];
            }else{
                console.warn('don\'t have a title ' + loc);
            }
            list.push({
                relativeLink: './' + path.relative(dir, loc),
                rootLink: './' + path.relative(__dirname, loc),
                title: title.trim()
            });
        }
    }

    let directoryReadmeContent = list.map(item => {
        return `- [${item.title}](${item.relativeLink})`
    }).join('\n');

    let readmeContent = '';
    if(readmeFile){
        readmeContent = fs.readFileSync(readmeFile, 'utf8');
        readmeContent = readmeContent.split('\n')[0] + '\n\n';
    }else{
        readmeFile = path.join(dir, 'README.md');
        readmeContent = '\n\n';
    }
    fs.writeFileSync(readmeFile, readmeContent + directoryReadmeContent);
    return readmeContent + list.map(item => {
        return `- [${item.title}](${item.rootLink})`
    }).join('\n');
}

function buildReadmeFile(){
    let indexContent = '## Notebook';
    let files = fs.readdirSync(__dirname);
    for(let i=0;i<files.length;i++){
        let file = path.join(__dirname, files[i]);
        if(fs.statSync(file).isDirectory() && !/^\./.test(files[i])){
            let content = walkDirectory(file);
            indexContent += '\n\n' + content;
        }
    }
    fs.writeFileSync(path.join(__dirname, 'README.md'), indexContent);
}

buildReadmeFile();