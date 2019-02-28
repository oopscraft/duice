var express = require('express');
var router = express.Router();

/**
 * test
 */
router.get('/', function(req,res){
	global.response(res,'test',{message:'Hello~'});
});

/**
 * gets employers
 */
router.get('/employers',function(req,res){
	global.dataSource.getConnection(function(err,connection){
		try {
			connection.query('SELECT * FROM EMP',function(err,rows){
				res.json(rows);
			});
		}catch(e){
			console.error(e);
		}finally{
			connection.release();
		}
	});
});

/**
 * gets employer
 */
router.get('/employer/:empno',function(req,res){
	global.dataSource.getConnection(function(err,connection){
		try {
			connection.query(
				"SELECT * FROM EMP EMP WHERE EMPNO = ?",
				[req.params.empno],
				function(err,rows){
					res.json(rows);
				}
			);
		}catch(e){
			console.error(e);
		}finally{
			connection.release();
		}
	});
});


module.exports = router;
