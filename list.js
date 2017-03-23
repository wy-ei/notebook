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
    return {
        list: list,
        dir: dir
    };
}

function buildReadmeFile(){
    let files = fs.readdirSync(__dirname);

    let categories = files.filter(file => {
        return fs.statSync(path.join(__dirname, file)).isDirectory() && !/^\./.test(file);
    }).map(file => {
        return walkDirectory(path.join(__dirname, file));
    }).map(category => {
        let list = category.list;
        let readmePath = path.join(category.dir, 'README.md');

        let readmeContent = fs.readFileSync(readmePath, 'utf8');

        let readmeHeader = readmeContent.split('\n').slice(0, 2).join('\n') + '\n';
        let match = /##\s+(.+)$/gm.exec(readmeHeader);
        let categoryTitle = '';
        if(match){
            categoryTitle = match[1];
        }
        readmeContent = readmeHeader + list.map(item => {
            return `- [${item.title}](${item.relativeLink})`
        }).join('\n');

        fs.writeFileSync(readmePath, readmeContent);
        return {
            title: categoryTitle,
            content: `### ${categoryTitle}\n\n` + list.map(item => {
                return `- [${item.title}](${item.rootLink})`
            }).join('\n')
        }
    });

    let categoryList = '## 分类\n\n' + categories.map(category => {
        return `- [${category.title}](#${category.title.replace(/\s+/g, '-')})`;
    }).join('\n') + '\n\n';

    let categoryDetails = categories.map(category => category.content).join('\n\n');

    let titleContent = '## Notebook\n\n我的笔记本，记录平时所学的编程相关的知识。\n\n'

    let rootReadMEContent = titleContent + categoryList + categoryDetails;
    fs.writeFileSync(path.join(__dirname, 'README.md'), rootReadMEContent);
}

buildReadmeFile();