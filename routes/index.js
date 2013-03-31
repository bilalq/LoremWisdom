var config = require('../config');

var request = require('request');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database: config.db.database
});

connection.connect();

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.facts = function(req, res) {
  var limit = parseInt(req.param('limit'), 10) || 1;
  if(limit < 0) {
    limit = 1;
  } 
  else if(limit > 50) {
    limit = 50;
  }

  console.log(limit);

  connection.query('SELECT * FROM facts ORDER BY RAND() LIMIT ?', [limit], function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });

};

exports.proverbs = function(req, res) {
  var limit = parseInt(req.param('limit'), 10) || 1;
  if(limit < 0) {
    limit = 1;
  } 
  else if(limit > 50) {
    limit = 50;
  }

  connection.query('SELECT * FROM proverbs ORDER BY RAND() LIMIT ?', [limit], function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });

};

exports.quotes = function(req, res) {

};

exports.surprise = function(req, res) {

};

/**
 * Wrapper for Wunderground Weather API
 **/
exports.weather = function(req, res) {
  var oath_key = 'b1db4d875d549c24';
  var base = 'http://api.wunderground.com/api/' + oath_key + '/conditions/q/';

  var state, city;
  state = req.params.state;
  city = req.params.city;
  
  var city = base + state + '/' + city + '.json';

  request(city, function(error, response, body) {
    if(error) {
      console.log("--ERROR-- WEATHER: " + error);
      res.status(500);
    } else {
      res.send(body);
    }
  });
};
