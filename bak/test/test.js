var express = require('express');
var squel = require('squel');
var router = express.Router();

/**
 * gets employers
 */
router.get('/employers',function(req,res){
	var employers = null;
	var totalCount = 0;
	var rows = req.query.rows || 10;
	var page = req.query.page || 1;
	var sql = squel.select().from('EMP');
	if(req.query.searchType == 'EMPNO'){
		sql.where('EMPNO = ?', req.query.searchValue);
	}else if(req.query.searchType == 'ENAME'){
		sql.where("ENAME LIKE CONCAT(?,'%')", req.query.searchValue);
	}

	Promise.all([
		new Promise(function(resolve,reject){
			var sqlLimit = sql.clone();
			sqlLimit.limit(rows);
			sqlLimit.offset((page-1)*rows);
			global.dataSource.getConnection(function(err,connection){
				connection.query(sqlLimit.toString(), sqlLimit.toParam(), function(err,rows){
					employers = rows;
					resolve();	
				});
				connection.release();
			});
		}),
		new Promise(function(resolve, reject) {
			var sqlCount = sql.clone();
			sqlCount.field("COUNT(*) AS CNT");
			global.dataSource.getConnection(function(err,connection){
				connection.query(sqlCount.toString(), sqlCount.toParam(), function(err,rows){
					totalCount = rows[0].CNT;
					resolve();
				});
				connection.release();
			});
		})
	]).then(function(){
		res.set('X-Total-Count', totalCount);
		res.json(employers);
	}).catch(console.err);
});

/**
 * gets employer
 */
router.get('/employer/:empno',function(req,res){
	var sql = squel.select().from("EMP")
			.where("EMPNO = ?", req.params.empno);
	global.dataSource.getConnection(function(err,connection){
		connection.query(
			sql.toString(),
			sql.toParam(),
			function(err,rows){
				res.json(rows);
			}
		);
		connection.release();
	});
});

// exports module
module.exports = router;
