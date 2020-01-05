// imports modules
var express = require('express');
var path = require('path');

// creates server
var app = express();

// defines configure
global.config = {
	server: require('./conf/server.json')
}

// routes root 
app.get('/', function(req, res){
	res.redirect('/doc');
});

// routes doc
app.use('/doc', express.static(path.join(__dirname,'doc')));

// routes dist
app.use('/dist', express.static(path.join(__dirname,'dist')));

// routes src
app.use('/src', express.static(path.join(__dirname,'src')));

// start server
app.listen(global.config.server.port, function(){
	console.log('listeneing port[' + global.config.server.port + ']...');
});
