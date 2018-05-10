var mysql = require('mysql');  
  
function db() {  
  
  this.pool = null;  
    
  // Initialize MySql Connection Pool  
  this.init = function() {  
    this.pool = mysql.createPool({  
      connectionLimit: 10,  
      host     : 'localhost',  
      user     : 'root',  
      password : '',  
      database: 'capstone'  
    });  
  };  
  
  // Acquire connection and execute query on callbacks  
  this.acquire = function(callback) {  
  
    this.pool.getConnection(function(err, connection) {  
      callback(err, connection);  
    });  
  
  };  
  
}  
  
module.exports = new db();