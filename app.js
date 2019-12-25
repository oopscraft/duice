// imports modules
var express = require('express');
var path = require('path');
var mysql = require('mysql');

// creates app
var app = express();

// defines configure
global.config = {
	server: require('./conf/server.json'),
	dataSource: require('./conf/dataSource.json')
}

// creates dataSource
global.dataSource = mysql.createPool(global.config.dataSource);

// routes root 
app.get('/', function(req, res){
	res.redirect('/doc');
});

// routes doc
app.use('/doc', express.static(path.join(__dirname,'doc')));

// routes src
app.use('/src', express.static(path.join(__dirname,'src')));

// routes test
app.use('/test', express.static(path.join(__dirname,'test')));
var test = require('./test/test.js');
app.use('/test', test);

// start server
app.listen(global.config.server.port, function(){
	console.log('listeneing port[' + global.config.server.port + ']...');
});
