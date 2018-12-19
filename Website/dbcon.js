var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_slivkaa',
  password        : '7081',
  database        : 'cs340_slivkaa'
});

module.exports.pool = pool;