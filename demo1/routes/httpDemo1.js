var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/',function(req, res, next ){
    http.get('http://localhost:8002', function (response) {
        
        var body = [];
        
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        
        response.on('end', function () {
            body = Buffer.concat(body);
        });
        
        res.render('httpDemo1', {header:JSON.stringify(response.headers), body:body});
    });
    
});

module.exports = router;

