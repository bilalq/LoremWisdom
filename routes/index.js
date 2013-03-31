var config = require('../config');

var request = require('request');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database
});


connection.connect();


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.facts = function(req, res) {
  var limit = req.param('limit');

  connection.query('SELECT * FROM facts ORDER BY RAND() LIMIT ?', [limit], function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.proverbs = function(req, res) {
  var limit = req.param('limit');

  connection.query('SELECT * FROM proverbs ORDER BY RAND() LIMIT ?', [limit], function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.quotes = function(req, res) {
  var limit = req.param('limit');

  connection.query('SELECT * FROM quotes ORDER BY RAND() LIMIT ?', [limit], function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  };
};

exports.surprise = function(req, res) {

};

