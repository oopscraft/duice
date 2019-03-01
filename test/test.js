var express = require('express');
var router = express.Router();

/**
 * gets employers
 */
router.get('/employers',function(req,res){
	global.dataSource.getConnection(function(err,connection){
		connection.query('SELECT * FROM EMP',function(err,rows){
			res.json(rows);
		});
		connection.release();
	});
});

/**
 * gets employer
 */
router.get('/employer/:empno',function(req,res){
	global.dataSource.getConnection(function(err,connection){
		connection.query(
			"SELECT * FROM EMP EMP WHERE EMPNO = ?",
			[req.params.empno],
			function(err,rows){
				res.json(rows);
			}
		);
		connection.release();
	});
});

// exports module
module.exports = router;
