var config = require('../config');

var async = require('async');

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
  res.render('index', { title: 'Lorem Wisdom' });
};

exports.docs = function(req, res){
  var end_points = [
    {
      verb: 'GET',
      route: '/quotes',
      description: 'This endpoint retuns a random quote',
      example_response: {},
      optional_parameters: {}
    }
  ];
  res.render('docs', { title: 'Lorem Wisdom | API Docs', docs: end_points });
};

function makeQuery(table, req) {
  var sql_input = [];

  //Base query
  var sql_statement = 'SELECT * FROM ' + table;

  //tag
  if(req.param('tag')) {
    sql_statement += ' WHERE tag = ?';
    sql_input.push(req.param('tag'));
  }

  //id
  if(req.param('id')) {
    if(req.param('tag')) {
      sql_statement += ' and id = ?';
    } else {
      sql_statement += ' WHERE id = ?';
    }
    sql_input.push(req.param('id'));
  }

  //random
  sql_statement += ' ORDER BY RAND()';

  //limit
  var limit = parseInt(req.param('limit'), 10) || 1;
  if(limit < 0) {
    limit = 0;
  } else if(limit > 50) {
    limit = 50;
  }
  sql_statement += ' LIMIT ?';
  sql_input.push(limit);

  return {statement: sql_statement, input: sql_input};
}

exports.facts = function(req, res) {
  var sql_obj = makeQuery('facts', req);

  connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.proverbs = function(req, res) {
  var sql_obj = makeQuery('proverbs', req);

  connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.quotes = function(req, res) {
  var sql_obj = makeQuery('quotes', req);

  connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
    if(err) {
      res.send(500, err);
    } else {
      res.send(200, results);
    }
  });
};

exports.paragraph = function(req, res) {
  var num_para = req.param('paragraphs') || 5;

  var facts = [];

  var i = 0;
  async.whilst(function() { return i < num_para; },
    function(callback) {
      i++;
      var tmp_req = req;
      tmp_req.params.limit = 5;
      tmp_req.params.tag = req.param('tag');
      var sql_obj = makeQuery('facts', tmp_req);
      connection.query(sql_obj.statement, sql_obj.input, function(err, results) {
        if(err) { 
          console.log(err);
        } else {
          facts = facts.concat(results);
          facts.push({text: '\n\n'});
        }
        callback(err, results);
      })
    },
    function(err, stuff) {
      var paragraphs = "";

      for(var i = 0; i < facts.length; i++) {
        var text = facts[i].text;
        paragraphs += text + ' ';
      }
      res.send(200, {paragraph: paragraphs, number_paragraphs: num_para});
    }
  );
};

exports.surprise = function(req, res) {

};

