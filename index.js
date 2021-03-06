const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const marked = require('marked');
const dayjs = require('dayjs');
const error = params => console.error(chalk.bold.red(params));
const warning = params => console.log(chalk.orange(params));
const success = params => console.log(chalk.greenBright(params));
const OUTPUT_FILE_DIRECTORY = 'docs';
const JSON_DATA_PATH = './static/data';
const CSS_DATA_PATH = './static/css';

String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
};
String.prototype.hashCode = function() {
    let hash = 0, char;
    if (this.length === 0) return hash;
    [...new Array(this.length).keys()].forEach(i => {
        char = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + char;
        hash |= 0;  // Convert to 32bit integer
    });
    return Math.abs(hash);
  };
 
function onBuildFiles({filePath}) {
    // 删除打包目录
    fs.removeSync(OUTPUT_FILE_DIRECTORY);

    // 样式输出到打包目录
    onCopyFiles({
        filePath: CSS_DATA_PATH,
        outputFilePath: `${OUTPUT_FILE_DIRECTORY}/css`,
        fileType: 'css'
    })

    // 获取文档完整的目录数据
    let data = onGetDocFiles({filePath, level: 0});
    // 首页输出到打包目录
    onBuildFile({
        data: data.children,
        dataPath: `${JSON_DATA_PATH}/indexList.json`,
        filePath: './static/index.html',
        outputFilePath: OUTPUT_FILE_DIRECTORY,
        fileType: 'file'
    });
    // 文章页输出到打包目录
    onBuildFile({
        data: data.children.filter(i => i.title == 'article')[0].children,
        dataPath: `${JSON_DATA_PATH}/articleList.json`,
        filePath: './static/article.html',
        outputFilePath: OUTPUT_FILE_DIRECTORY,
        fileType: 'file'
    });
    // 书库页输出到打包目录
    onBuildFile({
        data: data.children.filter(i => i.title == 'book')[0].children,
        dataPath: `${JSON_DATA_PATH}/bookList.json`,
        filePath: './static/book.html',
        outputFilePath: OUTPUT_FILE_DIRECTORY,
        fileType: 'directory'
    });
    // demo页输出到打包目录
    onBuildFile({
        data: data.children.filter(i => i.title == 'demo')[0].children,
        dataPath: `${JSON_DATA_PATH}/demoList.json`,
        filePath: './static/demo.html',
        outputFilePath: OUTPUT_FILE_DIRECTORY,
        fileType: 'file'
    });
}

/**
 * 复制文件
 * **/
async function onCopyFiles ({filePath, outputFilePath, fileType}) {
    try{
        await fs.copy(filePath, outputFilePath);
        success(`==== ${fileType} 文件已成功复制到打包目录！====`);
    }catch(err){
        error(err);
    }
}

/**
 * 1. 生成文件目录数据
 * 2. 将md文件转成html文件并输出
 * **/
function onGetDocFiles({filePath, level}) {
    let data = {
        type: 'directory',
        level,
        title: path.basename(filePath),
        path: filePath
    }
    let files = fs.readdirSync(filePath);
    level++;
    data.children = files.map(file => {
        let subPath = path.join(filePath, file);
        let stats = fs.statSync(subPath);
        if(stats.isDirectory()){
            return onGetDocFiles({filePath: subPath, level});
        }

        let modifyTime = stats.ctime;
        let timeArr = dayjs(modifyTime).format('YYYY/MM/DD').split('/');
        let option = {
            type: 'file',
            level,
            modifyTime,
            year: timeArr[0],
            date: `${timeArr[1]}/${timeArr[2]}`
        };
        let ext = path.extname(file);
        if(ext == '.md' && file !== 'readme.md'){
            try{
                let mdContent = fs.readFileSync(subPath, 'utf-8');
                let htmlContent = marked(mdContent.toString());
                let fileTitle = path.basename(file, '.md');
                let fileHashTitle = fileTitle.hashCode();
                // markdown 文件生成 html 文件，文章详情页
                onLoadHtml({
                    filePath: './static/detail.html',
                    outputFilePath: `${OUTPUT_FILE_DIRECTORY}`,
                    outputFileName: fileHashTitle,
                    outputFileContent: {
                        '@markdown': `<h1>${fileTitle}</h1>${htmlContent}`
                    }
                })
                return {
                    ...option,
                    path: `${fileHashTitle}.html`,
                    title: fileTitle,
                    introduce: `${mdContent.substr(0, 150).replace(/#|<style>|<\/style>/g,'')}......`
                }
            }catch(err){
                error(err);
            }
        }
        if(file == 'index.html'){
            let mdContent = '';
            try{
                mdContent = fs.readFileSync(`${filePath}/readme.md`, 'utf-8');
            }catch(err){}
            let htmlContent = marked(mdContent.toString());
            let pathArr = filePath.split('/');
            let fileTitle = pathArr[pathArr.length - 1];
            let fileHashTitle = fileTitle.hashCode();
            onCopyFiles({
                filePath,
                outputFilePath: `${OUTPUT_FILE_DIRECTORY}/${fileHashTitle}`,
                fileType: 'directory'
            });
            // markdown 文件生成 html 文件，文章详情页
            onLoadHtml({
                filePath: './static/detail.html',
                outputFilePath: `${OUTPUT_FILE_DIRECTORY}`,
                outputFileName: fileHashTitle,
                outputFileContent: {
                    '@markdown': `<h1>${fileTitle}</h1><div class="preview-link"><a target="_blank" href="./${fileHashTitle}/index.html">查看链接</a></div>${htmlContent}`
                }
            })
            return {
                ...option,
                path: `${fileHashTitle}.html`,
                title: fileTitle,
                introduce: `${mdContent.substr(0, 150).replace(/#|<style>|<\/style>/g,'')}......`
            }
        }
    }).filter(i => i);
    return data;
}

/**
 * 输出单个打包文件
 * **/
function onBuildFile({ data, dataPath, filePath, outputFilePath, fileType }) {
    // 生成数据
    onGetJsonData({
        data,
        path: dataPath,
        fileType
    });
    // 生成页面
    onLoadHtml({
        filePath,
        outputFilePath
    });  
}

/**
 * 根据目录数据生成页面需要展示的数据
*/
function onGetJsonData({data, path, fileType}){
    let onLoopData = children => children.reduce((list, i) => {
        if(i.type == fileType){
            return list.concat(i);
        }
        return list.concat(onLoopData(i.children||[]))
    }, []);
    fs.writeJsonSync(path, {
        data: onLoopData(data).sort((a, b) => b.modifyTime - a.modifyTime)
    });
}

/**
 * 打包输出html文件
 * **/
function onLoadHtml({ filePath, outputFilePath, outputFileName, outputFileContent = {} }){
    let fileExt = path.extname(filePath);
    outputFileName = outputFileName || path.basename(filePath, fileExt);
    outputFilePath = `${outputFilePath}/${outputFileName}${fileExt}`;
    
    try{
        let res = fs.readFileSync(filePath, 'utf-8');
        let reg = /(@include\('(\S+)(',\s(\S+))*'\))|(@markdown)/g;
        // 找到所有的引用标签
        let tags = res.match(reg)||[];
        tags.map(i => {
            let html = '';
            // 如果是 @include 标签
            if(i.startsWith('@include')){
                let result = i.match(/@include\('(\S+)(',\s'(\S+))*'\)/);
                let tagPath = result[1];
                let jsonPath = result[3];
                html = fs.readFileSync(tagPath, 'utf-8');
                // 如果有JSON路径，就读取jons文件作为数据来源
                if(jsonPath){
                    let json = fs.readJsonSync(jsonPath);
                    html = html.interpolate(json);
                }
            }
            // 如果是 @markdown 标签
            if(i.startsWith('@markdown')){
                html = outputFileContent[i];
            }
            res = res.replace(i, html);   
        })
        // 当全部加载完后，生成完整html文件
        fs.outputFileSync(outputFilePath, res);
        success(`==== ${outputFilePath} 生成成功！====`); 
    }catch(err){
        error(err);
    }          
}

onBuildFiles({
    filePath: './src'
});