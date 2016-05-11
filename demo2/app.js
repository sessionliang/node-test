var fs = require('fs'),
    http = require('http'),
    path = require('path');
    
var MIME = {
    '.css':'text/css',
    '.js':'application/javascript'
};

function combinFiles(pathNames,callback) {
    var output =[];
    
    (function next(i, len){
        if(i<len){
            //读取文件
            fs.readFile(pathNames[i],function (err,data) {
                if(err){
                    callback(err);
                }
                else{
                    output.push(data);
                    next(i+1,len);
                }
            });
        }
        else{
           callback&& callback(null, Buffer.concat(output));
        }
    })(0, pathNames.length);
}

/*
* 程序入口
* @argv[0] 配置文件地址
*/
function main(argv){
    //argv[0] 配置文件地址
    var config = JSON.parse(fs.readFileSync(argv[0],'utf-8'));
    var root = config.root || '.';
    var port = config.port || '80';
    
    http.createServer(function (req,res) {
        var urlInfo = parseURL(root, req.url);
        
        combinFiles(urlInfo.pathNames, function (err, data) {
            if(err){
                res.writeHead(404);
                res.end(err.message);
            }else{
                res.writeHead(200,{
                    'Content-Type':urlInfo.mime
                });
                
                res.end(data);
            }
            
        })
    }).listen(port);
}

function  parseURL(root, url) {
    var base, pathNames, parts;
    
    if(url.indexOf('??')===-1){
        url = url.replace('/','/??');
    }
    
    parts = url.split('??');
    base = parts[0];
    
    pathNames = parts[1].split('.').map(function (value) {
        return path.join(root, base, value);
    });
    
    return {
        mime:MIME[path.extname(pathNames[0])]||"text/plain",
        pathNames:pathNames
    };
}

main(process.argv.slice(2));